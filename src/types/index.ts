export type UserRole = 'student' | 'tutor' | 'admin' | 'guest';

export type TeachingMode = 'online' | 'in_person' | 'both';

export type FileType = 'pdf' | 'docx' | 'zip';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  institution?: string;
  course?: string;
  yearSemester?: string;
  bio?: string;
  location?: string;
  isVerified?: boolean;
  // Tutor specific fields
  mainSubject?: string;
  subjects?: string[];
  hourlyRateMzn?: number;
  teachingMode?: TeachingMode;
  experienceYears?: number;
  availableSchedule?: string[];
  certificates?: string[];
  rating?: number;
  reviewCount?: number;
  studentCount?: number;
  onlineStatus?: 'online' | 'offline';
  isSuspended?: boolean;
  createdAt: string;
}

export type LessonStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface LessonBooking {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentPhone?: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  subject: string;
  date: string;
  time: string;
  durationMinutes: number;
  priceMzn: number;
  status: LessonStatus;
  teachingMode: TeachingMode;
  meetingLink?: string;
  notes?: string;
  rejectionReason?: string;
  rated?: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'image' | 'file';
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  otherUser: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    onlineStatus?: 'online' | 'offline';
    subject?: string;
  };
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface LibraryFile {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  category: string;
  format: FileType;
  pageCount: number;
  fileSize: string;
  rating: number;
  reviewCount: number;
  downloadsCount: number;
  priceMzn: number; // 0 = GRÁTIS / Público, > 0 = Premium
  coverImage: string;
  tags: string[];
  previewPagesSnippet?: string[];
  previewSummary?: string;
  fileUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  fileId: string;
  fileTitle: string;
  fileFormat: string;
  fileSize: string;
  fileCategory: string;
  amountMzn: number;
  paymentMethod: 'mpesa' | 'emola' | 'card';
  phoneNumber?: string;
  reference: string;
  status: 'completed' | 'pending';
  date: string;
}

export type PostType =
  | 'question'
  | 'summary'
  | 'notes'
  | 'study_tip'
  | 'exercise'
  | 'solution'
  | 'academic_news'
  | 'free_material';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  isTutorVerified?: boolean;
  content: string;
  likesCount: number;
  isBestAnswer?: boolean;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  isTutorVerified?: boolean;
  type: PostType;
  title: string;
  content: string;
  subjectTag: string;
  tags: string[];
  attachmentUrl?: string;
  attachmentName?: string;
  likesCount: number;
  likedByUserIds: string[];
  commentsCount: number;
  comments: Comment[];
  isSolved?: boolean;
  bestAnswerId?: string;
  reportsCount: number;
  isApproved: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  targetType: 'tutor' | 'file';
  targetId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | 'message'
    | 'lesson_booked'
    | 'lesson_accepted'
    | 'lesson_rejected'
    | 'lesson_cancelled'
    | 'new_reply'
    | 'purchase_success'
    | 'new_file'
    | 'review_received'
    | 'admin_alert';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface SavedItem {
  id: string;
  userId: string;
  itemType: 'tutor' | 'file' | 'post';
  itemId: string;
  savedAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  targetType: 'post' | 'file' | 'user';
  targetId: string;
  targetTitle: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  degree: string;
  department: string;
  durationYears: number;
  description: string;
  coordinator?: string;
  subjects?: string[];
  activeStudentsCount?: number;
  iconName?: string;
  createdAt: string;
}
