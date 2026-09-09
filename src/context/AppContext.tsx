import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  LibraryFile,
  CommunityPost,
  LessonBooking,
  ChatMessage,
  NotificationItem,
  Review,
  Purchase,
  ReportItem,
  Course
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_LIBRARY_FILES,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_LESSONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_REPORTS,
  INITIAL_COURSES
} from '../data/mockData';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currentUser: User | null;
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  users: User[];
  tutors: User[];
  courses: Course[];
  libraryFiles: LibraryFile[];
  posts: CommunityPost[];
  lessons: LessonBooking[];
  messages: ChatMessage[];
  notifications: NotificationItem[];
  reviews: Review[];
  purchases: Purchase[];
  savedItems: string[];
  reports: ReportItem[];
  // Modals & Navigation
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register-student' | 'register-tutor';
  setAuthModalMode: (mode: 'login' | 'register-student' | 'register-tutor') => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  selectedTutorProfile: User | null;
  setSelectedTutorProfile: (tutor: User | null) => void;
  lessonModalTutor: User | null;
  setLessonModalTutor: (tutor: User | null) => void;
  activeLessonForRoom: LessonBooking | null;
  setActiveLessonForRoom: (lesson: LessonBooking | null) => void;
  activeReadingFile: LibraryFile | null;
  setActiveReadingFile: (file: LibraryFile | null) => void;
  activeChatUser: User | null;
  setActiveChatUser: (user: User | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Actions
  login: (identifier: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  registerStudent: (data: { name: string; emailOrPhone: string; password: string; course?: string }) => Promise<{ success: boolean }>;
  registerTutor: (data: { name: string; emailOrPhone: string; password: string; mainSubject: string; course?: string }) => Promise<{ success: boolean }>;
  logout: () => void;
  switchRoleDemo: (role: UserRole) => void;
  updateUserProfile: (updated: Partial<User>) => void;
  requestLesson: (bookingData: Omit<LessonBooking, 'id' | 'createdAt' | 'status'>) => void;
  updateLessonStatus: (lessonId: string, status: LessonBooking['status'], reasonOrNotes?: string) => void;
  sendMessage: (recipientId: string, text: string, attachment?: { url: string; name: string; type: 'image' | 'file' }) => void;
  purchaseFile: (fileId: string, paymentMethod: 'mpesa' | 'emola' | 'card', phoneNumber: string) => Promise<boolean>;
  addLibraryFile: (fileData: Omit<LibraryFile, 'id' | 'createdAt' | 'downloadsCount' | 'rating' | 'reviewCount' | 'isApproved'>) => void;
  addPost: (postData: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'likedByUserIds' | 'commentsCount' | 'comments' | 'reportsCount' | 'isApproved'>) => void;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  markBestAnswer: (postId: string, commentId: string) => void;
  reportContent: (type: 'post' | 'file' | 'user', id: string, title: string, reason: string) => void;
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => void;
  toggleSaveItem: (itemId: string) => void;
  isItemSaved: (itemId: string) => boolean;
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  // Admin actions
  addCourse: (courseData: Omit<Course, 'id' | 'createdAt'>) => void;
  updateCourse: (courseId: string, updated: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  verifyTutor: (tutorId: string, verified: boolean) => void;
  toggleUserSuspension: (userId: string) => void;
  deleteOrApproveFile: (fileId: string, approve: boolean) => void;
  deleteOrApprovePost: (postId: string, approve: boolean) => void;
  resolveReport: (reportId: string, status: 'resolved' | 'dismissed') => void;
  sendAdminBroadcast: (title: string, message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('isps_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('isps_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // Users and Auth
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('isps_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('isps_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const currentRole: UserRole = currentUser ? currentUser.role : 'guest';

  // Courses collection (managed by admin)
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('isps_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  useEffect(() => {
    localStorage.setItem('isps_courses', JSON.stringify(courses));
  }, [courses]);

  // Core Collections
  const [libraryFiles, setLibraryFiles] = useState<LibraryFile[]>(() => {
    const saved = localStorage.getItem('isps_library_files');
    return saved ? JSON.parse(saved) : INITIAL_LIBRARY_FILES;
  });

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('isps_community_posts');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
  });

  const [lessons, setLessons] = useState<LessonBooking[]>(() => {
    const saved = localStorage.getItem('isps_lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('isps_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('isps_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('isps_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('isps_purchases');
    return saved ? JSON.parse(saved) : [
      {
        id: 'pur-1',
        userId: 'user-student-1',
        fileId: 'file-3',
        fileTitle: 'Guia Definitivo de Dimensionamento de Instalações Elétricas Industriais',
        fileFormat: 'pdf',
        fileSize: '8.4 MB',
        fileCategory: 'Engenharia',
        amountMzn: 350,
        paymentMethod: 'mpesa',
        reference: 'MPESA-TX-882194',
        status: 'completed',
        date: '2025-02-28'
      }
    ];
  });

  const [savedItems, setSavedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('isps_saved_items');
    return saved ? JSON.parse(saved) : ['user-tutor-1', 'file-1', 'post-1'];
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('isps_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  // Modals & Active Selections
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register-student' | 'register-tutor'>('login');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [selectedTutorProfile, setSelectedTutorProfile] = useState<User | null>(null);
  const [lessonModalTutor, setLessonModalTutor] = useState<User | null>(null);
  const [activeLessonForRoom, setActiveLessonForRoom] = useState<LessonBooking | null>(null);
  const [activeReadingFile, setActiveReadingFile] = useState<LibraryFile | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('isps_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('isps_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('isps_library_files', JSON.stringify(libraryFiles));
  }, [libraryFiles]);

  useEffect(() => {
    localStorage.setItem('isps_community_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('isps_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('isps_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('isps_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('isps_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('isps_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('isps_saved_items', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    localStorage.setItem('isps_reports', JSON.stringify(reports));
  }, [reports]);

  // Derived tutors list
  const tutors = users.filter(u => u.role === 'tutor' && !u.isSuspended);

  // Auth methods
  const login = async (identifier: string, _pass: string) => {
    const cleanId = identifier.trim().toLowerCase();

    // Fast-path credentials for demo / evaluation
    if (cleanId === 'admin' || cleanId === 'admin@ispsdark.ac.mz') {
      const admin = users.find(u => u.role === 'admin');
      if (admin) {
        setCurrentUser(admin);
        return { success: true };
      }
    }
    if (cleanId === 'estudante' || cleanId === 'aluno' || cleanId === 'americo.machava@isps.ac.mz') {
      const student = users.find(u => u.role === 'student');
      if (student) {
        setCurrentUser(student);
        return { success: true };
      }
    }
    if (cleanId === 'explicador' || cleanId === 'tutor' || cleanId === 'tomas.chivambo@isps.ac.mz') {
      const tutor = users.find(u => u.role === 'tutor');
      if (tutor) {
        setCurrentUser(tutor);
        return { success: true };
      }
    }

    const found = users.find(
      u => u.email.toLowerCase() === cleanId || u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
    );
    if (found) {
      if (found.isSuspended) {
        return { success: false, message: 'Esta conta foi suspensa pela administração.' };
      }
      setCurrentUser(found);
      return { success: true };
    }
    return { success: false, message: 'Utilizador não encontrado. Verifique o email ou telefone.' };
  };

  const registerStudent = async (data: { name: string; emailOrPhone: string; password: string; course?: string }) => {
    const isEmail = data.emailOrPhone.includes('@');
    const newUser: User = {
      id: `user-student-${Date.now()}`,
      name: data.name,
      email: isEmail ? data.emailOrPhone : `${data.name.toLowerCase().replace(/\s+/g, '')}@estudante.isps.ac.mz`,
      phone: !isEmail ? data.emailOrPhone : '+258 84 000 0000',
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      institution: 'Instituto Superior Politécnico de Songo (ISPS)',
      course: data.course || 'Engenharia Elétrica e de Potência',
      yearSemester: '1º Ano',
      bio: `Estudante de ${data.course || 'Engenharia'} no ISPS Dark.`,
      location: 'Songo, Moçambique',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const registerTutor = async (data: { name: string; emailOrPhone: string; password: string; mainSubject: string; course?: string }) => {
    const isEmail = data.emailOrPhone.includes('@');
    const newUser: User = {
      id: `user-tutor-${Date.now()}`,
      name: data.name,
      email: isEmail ? data.emailOrPhone : `${data.name.toLowerCase().replace(/\s+/g, '')}@explicador.isps.ac.mz`,
      phone: !isEmail ? data.emailOrPhone : '+258 84 000 0000',
      role: 'tutor',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      institution: 'ISPS - Explicador Registado',
      course: data.course || data.mainSubject,
      bio: `Explicador especializado em ${data.mainSubject}. Disponível para aulas online e presenciais.`,
      location: 'Moçambique',
      isVerified: false, // Pending admin verification!
      mainSubject: data.mainSubject,
      subjects: [data.mainSubject],
      hourlyRateMzn: 400,
      teachingMode: 'both',
      experienceYears: 1,
      availableSchedule: ['Seg a Sex 18h-21h', 'Sáb 09h-14h'],
      rating: 5.0,
      reviewCount: 0,
      studentCount: 0,
      onlineStatus: 'online',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Notify admin
    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin-1',
      title: 'Novo explicador cadastrado',
      message: `${newUser.name} registou-se para lecionar ${data.mainSubject} e aguarda verificação.`,
      type: 'admin_alert',
      isRead: false,
      link: 'admin',
      createdAt: 'Agora mesmo'
    };
    setNotifications(prev => [adminNotif, ...prev]);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRoleDemo = (role: UserRole) => {
    if (role === 'guest') {
      setCurrentUser(null);
      return;
    }
    const sample = users.find(u => u.role === role);
    if (sample) {
      setCurrentUser(sample);
    }
  };

  const updateUserProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const modified = { ...currentUser, ...updated };
    setCurrentUser(modified);
    setUsers(prev => prev.map(u => (u.id === modified.id ? modified : u)));
  };

  // Lesson Booking
  const requestLesson = (bookingData: Omit<LessonBooking, 'id' | 'createdAt' | 'status'>) => {
    const newLesson: LessonBooking = {
      ...bookingData,
      id: `lesson-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLessons(prev => [newLesson, ...prev]);

    // Notify tutor
    const tutorNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: bookingData.tutorId,
      title: 'Nova Solicitação de Aula!',
      message: `${bookingData.studentName} solicitou uma aula de ${bookingData.subject} para ${bookingData.date} às ${bookingData.time}.`,
      type: 'lesson_booked',
      isRead: false,
      link: 'dashboard',
      createdAt: 'Agora mesmo'
    };
    setNotifications(prev => [tutorNotif, ...prev]);
  };

  const updateLessonStatus = (lessonId: string, status: LessonBooking['status'], reasonOrNotes?: string) => {
    setLessons(prev =>
      prev.map(l => {
        if (l.id !== lessonId) return l;
        const updated = {
          ...l,
          status,
          ...(status === 'accepted' ? { meetingLink: `https://ispsdark.ac.mz/aula-online/${l.id}` } : {}),
          ...(reasonOrNotes ? { rejectionReason: reasonOrNotes } : {})
        };

        // Notify student
        const studentNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          userId: l.studentId,
          title: status === 'accepted' ? 'Aula Confirmada!' : status === 'rejected' ? 'Aula Rejeitada' : 'Estado da Aula Atualizado',
          message:
            status === 'accepted'
              ? `${l.tutorName} aceitou a sua aula de ${l.subject} para ${l.date} às ${l.time}.`
              : `${l.tutorName} ${status === 'rejected' ? 'não pôde aceitar' : 'atualizou'} a sua aula. ${reasonOrNotes || ''}`,
          type: status === 'accepted' ? 'lesson_accepted' : 'lesson_rejected',
          isRead: false,
          link: 'dashboard',
          createdAt: 'Agora mesmo'
        };
        setNotifications(n => [studentNotif, ...n]);

        return updated;
      })
    );
  };

  // Chat
  const sendMessage = (
    recipientId: string,
    text: string,
    attachment?: { url: string; name: string; type: 'image' | 'file' }
  ) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${currentUser.id}-${recipientId}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      recipientId,
      text,
      attachmentUrl: attachment?.url,
      attachmentName: attachment?.name,
      attachmentType: attachment?.type,
      timestamp: timeStr,
      isRead: false
    };
    setMessages(prev => [...prev, newMsg]);

    // Send notification to recipient
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: recipientId,
      title: `Nova mensagem de ${currentUser.name}`,
      message: text ? (text.length > 50 ? text.substring(0, 50) + '...' : text) : 'Enviou um anexo.',
      type: 'message',
      isRead: false,
      link: 'chat',
      createdAt: 'Agora mesmo'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Library & Purchases
  const purchaseFile = async (fileId: string, paymentMethod: 'mpesa' | 'emola' | 'card', phoneNumber: string) => {
    if (!currentUser) return false;
    const file = libraryFiles.find(f => f.id === fileId);
    if (!file) return false;

    // Simulate payment transaction
    const refCode = `${paymentMethod.toUpperCase()}-ISPS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPurchase: Purchase = {
      id: `pur-${Date.now()}`,
      userId: currentUser.id,
      fileId: file.id,
      fileTitle: file.title,
      fileFormat: file.format,
      fileSize: file.fileSize,
      fileCategory: file.category,
      amountMzn: file.priceMzn,
      paymentMethod,
      phoneNumber,
      reference: refCode,
      status: 'completed',
      date: new Date().toISOString().split('T')[0]
    };

    setPurchases(prev => [newPurchase, ...prev]);

    // Increment downloads count on file
    setLibraryFiles(prev =>
      prev.map(f => (f.id === fileId ? { ...f, downloadsCount: f.downloadsCount + 1 } : f))
    );

    // Notify user
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Compra Confirmada!',
      message: `Você adquiriu "${file.title}" por ${file.priceMzn} MZN via ${paymentMethod.toUpperCase()} (${refCode}). O arquivo está disponível em "Meus Arquivos".`,
      type: 'purchase_success',
      isRead: false,
      link: 'dashboard',
      createdAt: 'Agora mesmo'
    };
    setNotifications(prev => [notif, ...prev]);

    // Notify author
    if (file.authorId) {
      const authorNotif: NotificationItem = {
        id: `notif-${Date.now() + 1}`,
        userId: file.authorId,
        title: 'Nova Venda de Arquivo!',
        message: `${currentUser.name} comprou "${file.title}". Ganho creditado: ${file.priceMzn} MZN.`,
        type: 'purchase_success',
        isRead: false,
        link: 'dashboard',
        createdAt: 'Agora mesmo'
      };
      setNotifications(prev => [authorNotif, ...prev]);
    }

    return true;
  };

  const addLibraryFile = (
    fileData: Omit<LibraryFile, 'id' | 'createdAt' | 'downloadsCount' | 'rating' | 'reviewCount' | 'isApproved'>
  ) => {
    const newFile: LibraryFile = {
      ...fileData,
      id: `file-${Date.now()}`,
      downloadsCount: 0,
      rating: 5.0,
      reviewCount: 0,
      isApproved: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLibraryFiles(prev => [newFile, ...prev]);

    // Broadcast notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'all',
      title: 'Novo material na Biblioteca ISPS',
      message: `${newFile.authorName} publicou "${newFile.title}" (${newFile.priceMzn === 0 ? 'GRÁTIS' : `${newFile.priceMzn} MZN`}).`,
      type: 'new_file',
      isRead: false,
      link: 'library',
      createdAt: 'Agora mesmo'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Community
  const addPost = (
    postData: Omit<
      CommunityPost,
      'id' | 'createdAt' | 'likesCount' | 'likedByUserIds' | 'commentsCount' | 'comments' | 'reportsCount' | 'isApproved'
    >
  ) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}`,
      likesCount: 0,
      likedByUserIds: [],
      commentsCount: 0,
      comments: [],
      reportsCount: 0,
      isApproved: true,
      createdAt: dateStr
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const toggleLikePost = (postId: string) => {
    if (!currentUser) return;
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        const alreadyLiked = p.likedByUserIds.includes(currentUser.id);
        const newLikes = alreadyLiked
          ? p.likedByUserIds.filter(id => id !== currentUser.id)
          : [...p.likedByUserIds, currentUser.id];
        return {
          ...p,
          likedByUserIds: newLikes,
          likesCount: newLikes.length
        };
      })
    );
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newComment = {
      id: `comment-${Date.now()}`,
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      isTutorVerified: currentUser.isVerified,
      content,
      likesCount: 0,
      isBestAnswer: false,
      createdAt: dateStr
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment]
        };
      })
    );

    // Notify post author if different
    const post = posts.find(p => p.id === postId);
    if (post && post.authorId !== currentUser.id) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: post.authorId,
        title: 'Nova resposta na sua publicação',
        message: `${currentUser.name} comentou: "${content.length > 50 ? content.substring(0, 50) + '...' : content}"`,
        type: 'new_reply',
        isRead: false,
        link: 'community',
        createdAt: 'Agora mesmo'
      };
      setNotifications(n => [notif, ...n]);
    }
  };

  const markBestAnswer = (postId: string, commentId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          isSolved: true,
          bestAnswerId: commentId,
          comments: p.comments.map(c => ({
            ...c,
            isBestAnswer: c.id === commentId
          }))
        };
      })
    );
  };

  const reportContent = (type: 'post' | 'file' | 'user', id: string, title: string, reason: string) => {
    if (!currentUser) return;
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      targetType: type,
      targetId: id,
      targetTitle: title,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReports(prev => [newReport, ...prev]);

    // Admin notification
    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin-1',
      title: 'Nova denúncia recebida',
      message: `${currentUser.name} denunciou ${type === 'post' ? 'uma publicação' : type === 'file' ? 'um arquivo' : 'um utilizador'}: "${title}". Motivo: ${reason}`,
      type: 'admin_alert',
      isRead: false,
      link: 'admin',
      createdAt: 'Agora mesmo'
    };
    setNotifications(n => [adminNotif, ...n]);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newRev, ...prev]);

    // If review target is a tutor, update their rating
    if (reviewData.targetType === 'tutor') {
      const tutorReviews = [...reviews.filter(r => r.targetType === 'tutor' && r.targetId === reviewData.targetId), newRev];
      const avg = Number((tutorReviews.reduce((sum, r) => sum + r.rating, 0) / tutorReviews.length).toFixed(2));
      setUsers(prev =>
        prev.map(u =>
          u.id === reviewData.targetId
            ? { ...u, rating: avg, reviewCount: (u.reviewCount || 0) + 1 }
            : u
        )
      );

      // Notify tutor
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: reviewData.targetId,
        title: 'Nova Avaliação Recebida! ⭐',
        message: `${reviewData.authorName} atribuiu ${reviewData.rating} estrelas à sua explicação: "${reviewData.comment}"`,
        type: 'review_received',
        isRead: false,
        link: 'dashboard',
        createdAt: 'Agora mesmo'
      };
      setNotifications(n => [notif, ...n]);
    }
  };

  const toggleSaveItem = (itemId: string) => {
    setSavedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const isItemSaved = (itemId: string) => savedItems.includes(itemId);

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Admin Actions
  const verifyTutor = (tutorId: string, verified: boolean) => {
    setUsers(prev =>
      prev.map(u => (u.id === tutorId ? { ...u, isVerified: verified } : u))
    );
    // Notify tutor
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: tutorId,
      title: verified ? 'Perfil Verificado com Sucesso! ✓' : 'Estado de Verificação Atualizado',
      message: verified
        ? 'Parabéns! A administração do ISPS Dark verificou as suas credenciais acadêmicas. O selo "✓ Explicador Verificado" está ativo no seu perfil.'
        : 'O selo de verificação foi revisto pela administração.',
      type: 'admin_alert',
      isRead: false,
      link: 'dashboard',
      createdAt: 'Agora mesmo'
    };
    setNotifications(n => [notif, ...n]);
  };

  const toggleUserSuspension = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u))
    );
  };

  const deleteOrApproveFile = (fileId: string, approve: boolean) => {
    if (approve) {
      setLibraryFiles(prev =>
        prev.map(f => (f.id === fileId ? { ...f, isApproved: true } : f))
      );
    } else {
      setLibraryFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const deleteOrApprovePost = (postId: string, approve: boolean) => {
    if (approve) {
      setPosts(prev =>
        prev.map(p => (p.id === postId ? { ...p, isApproved: true } : p))
      );
    } else {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const resolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status } : r))
    );
  };

  const sendAdminBroadcast = (title: string, message: string) => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'all',
      title: `Aviso ISPS Dark: ${title}`,
      message,
      type: 'admin_alert',
      isRead: false,
      link: 'home',
      createdAt: 'Agora mesmo'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCourses(prev => [newCourse, ...prev]);

    // Broadcast system notification about new course
    sendAdminBroadcast(
      'Novo Curso Cadastrado',
      `O curso ${newCourse.name} (${newCourse.code}) foi adicionado pela administração à oferta acadêmica do ISPS.`
    );
  };

  const updateCourse = (courseId: string, updated: Partial<Course>) => {
    setCourses(prev => prev.map(c => (c.id === courseId ? { ...c, ...updated } : c)));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        currentRole,
        activeTab,
        setActiveTab,
        users,
        tutors,
        courses,
        libraryFiles,
        posts,
        lessons,
        messages,
        notifications,
        reviews,
        purchases,
        savedItems,
        reports,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        selectedTutorProfile,
        setSelectedTutorProfile,
        lessonModalTutor,
        setLessonModalTutor,
        activeLessonForRoom,
        setActiveLessonForRoom,
        activeReadingFile,
        setActiveReadingFile,
        activeChatUser,
        setActiveChatUser,
        searchQuery,
        setSearchQuery,
        login,
        registerStudent,
        registerTutor,
        logout,
        switchRoleDemo,
        updateUserProfile,
        requestLesson,
        updateLessonStatus,
        sendMessage,
        purchaseFile,
        addLibraryFile,
        addPost,
        toggleLikePost,
        addComment,
        markBestAnswer,
        reportContent,
        addReview,
        toggleSaveItem,
        isItemSaved,
        markNotificationAsRead,
        markAllNotificationsRead,
        addCourse,
        updateCourse,
        deleteCourse,
        verifyTutor,
        toggleUserSuspension,
        deleteOrApproveFile,
        deleteOrApprovePost,
        resolveReport,
        sendAdminBroadcast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
