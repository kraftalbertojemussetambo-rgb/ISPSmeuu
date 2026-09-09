import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  Download,
  BookOpen,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Users,
  Star,
  FileText,
  AlertCircle,
  Lock,
  UserCheck,
  UserX,
  CreditCard,
  Edit3,
  PlusCircle,
  Trash2,
  Edit,
  GraduationCap,
  Building,
  Layers,
  Search
} from 'lucide-react';
import { FileViewerModal } from './FileViewerModal';
import { LibraryFile, Course } from '../types';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    lessons,
    purchases,
    libraryFiles,
    tutors,
    users,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    updateLessonStatus,
    setActiveLessonForRoom,
    verifyTutor,
    toggleUserSuspension,
    deleteOrApproveFile,
    updateUserProfile,
    setAuthModalOpen,
    setAuthModalMode
  } = useApp();

  const [activeTab, setActiveTab] = useState<'lessons' | 'files' | 'earnings' | 'admin' | 'courses' | 'profile'>('lessons');
  const [selectedFileToRead, setSelectedFileToRead] = useState<LibraryFile | null>(null);

  // Course Management states (Admin)
  const [courseSearch, setCourseSearch] = useState('');
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseFormFeedback, setCourseFormFeedback] = useState('');

  // Course Form fields
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formDegree, setFormDegree] = useState('Licenciatura');
  const [formDepartment, setFormDepartment] = useState('Departamento de Engenharia Elétrica');
  const [formDuration, setFormDuration] = useState(5);
  const [formCoordinator, setFormCoordinator] = useState('');
  const [formSubjects, setFormSubjects] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const resetCourseForm = () => {
    setEditingCourseId(null);
    setFormCode('');
    setFormName('');
    setFormDegree('Licenciatura');
    setFormDepartment('Departamento de Engenharia Elétrica');
    setFormDuration(5);
    setFormCoordinator('');
    setFormSubjects('');
    setFormDescription('');
    setCourseFormFeedback('');
    setIsCourseFormOpen(false);
  };

  const handleOpenAddCourse = () => {
    resetCourseForm();
    setIsCourseFormOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setFormCode(course.code);
    setFormName(course.name);
    setFormDegree(course.degree);
    setFormDepartment(course.department);
    setFormDuration(course.durationYears);
    setFormCoordinator(course.coordinator || '');
    setFormSubjects(course.subjects ? course.subjects.join(', ') : '');
    setFormDescription(course.description);
    setCourseFormFeedback('');
    setIsCourseFormOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim() || !formDescription.trim()) {
      setCourseFormFeedback('Por favor preencha os campos obrigatórios (Código, Nome e Descrição).');
      return;
    }

    const subjectsArray = formSubjects
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingCourseId) {
      updateCourse(editingCourseId, {
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        degree: formDegree,
        department: formDepartment,
        durationYears: Number(formDuration),
        coordinator: formCoordinator.trim(),
        subjects: subjectsArray,
        description: formDescription.trim()
      });
      setCourseFormFeedback('Curso atualizado com sucesso!');
    } else {
      addCourse({
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        degree: formDegree,
        department: formDepartment,
        durationYears: Number(formDuration),
        coordinator: formCoordinator.trim(),
        subjects: subjectsArray,
        description: formDescription.trim(),
        activeStudentsCount: 0
      });
      setCourseFormFeedback('Novo curso cadastrado com sucesso no ISPS!');
    }

    setTimeout(() => {
      resetCourseForm();
    }, 1200);
  };

  const handleDeleteCourse = (courseId: string, courseName: string) => {
    if (window.confirm(`Tem a certeza que deseja remover o curso "${courseName}" do sistema?`)) {
      deleteCourse(courseId);
    }
  };

  // Profile edit states
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h2 className="text-xl font-bold text-zinc-100">Painel do Utilizador</h2>
          <p className="text-xs text-zinc-400">
            Aceda às suas aulas agendadas, arquivos adquiridos e configurações de conta.
          </p>
          <button
            onClick={() => {
              setAuthModalMode('login');
              setAuthModalOpen(true);
            }}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
          >
            Entrar no ISPS Dark
          </button>
        </div>
      </div>
    );
  }

  // Filter lessons
  const myLessons = lessons.filter(l =>
    currentUser.role === 'student' ? l.studentId === currentUser.id : l.tutorId === currentUser.id
  );

  // Filter purchased files
  const myPurchasedFiles = libraryFiles.filter(f =>
    purchases.some(p => p.fileId === f.id && p.userId === currentUser.id)
  );

  // Tutor earnings calculation
  const tutorLessonsCompleted = lessons.filter(
    l => l.tutorId === currentUser.id && l.status === 'completed'
  );
  const tutorEarningsFromLessons = tutorLessonsCompleted.reduce((acc, l) => acc + l.priceMzn, 0);

  const tutorFilesSold = purchases.filter(p => {
    const file = libraryFiles.find(f => f.id === p.fileId);
    return file && file.authorId === currentUser.id;
  });
  const tutorEarningsFromFiles = tutorFilesSold.reduce((acc, p) => acc + p.amountMzn, 0);
  const totalTutorEarnings = tutorEarningsFromLessons + tutorEarningsFromFiles;

  // Platform admin metrics
  const totalPlatformRevenue = purchases.reduce((acc, p) => acc + p.amountMzn, 0) + 12450;
  const pendingTutors = users.filter(u => u.role === 'tutor' && !u.isVerified);
  const pendingFiles = libraryFiles.filter(f => !f.isApproved);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      phone: editPhone,
      bio: editBio
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Hero Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-zinc-700"
              referrerPolicy="no-referrer"
            />
            {currentUser.isVerified && (
              <span
                className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-zinc-950 rounded-full"
                title="Verificado"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-50">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {currentUser.role === 'admin'
                  ? 'Administrador'
                  : currentUser.role === 'tutor'
                  ? 'Explicador'
                  : 'Estudante'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {currentUser.email} • {currentUser.phone}
            </p>
            <p className="text-xs text-amber-400 font-medium mt-0.5">
              {currentUser.course || currentUser.mainSubject || 'Instituto Superior Politécnico de Songo'}
            </p>
          </div>
        </div>

        {/* Quick stat badge */}
        <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs">
          {currentUser.role === 'tutor' ? (
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-bold block">Ganhos Acumulados</span>
              <span className="text-xl font-black text-amber-400">{totalTutorEarnings} MZN</span>
            </div>
          ) : currentUser.role === 'admin' ? (
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-bold block">Faturamento Geral</span>
              <span className="text-xl font-black text-emerald-400">{totalPlatformRevenue} MZN</span>
            </div>
          ) : (
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-bold block">Arquivos no Painel</span>
              <span className="text-xl font-black text-amber-400">{myPurchasedFiles.length} adquiridos</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 mt-6 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'lessons'
              ? 'bg-amber-500 text-zinc-950 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{currentUser.role === 'tutor' ? 'Pedidos e Agenda de Aulas' : 'Aulas Agendadas'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
            {myLessons.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'files'
              ? 'bg-amber-500 text-zinc-950 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Meus Arquivos Adquiridos</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
            {myPurchasedFiles.length}
          </span>
        </button>

        {currentUser.role === 'tutor' && (
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'earnings'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Ganhos & Saldo</span>
          </button>
        )}

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Painel Administrativo</span>
            {(pendingTutors.length > 0 || pendingFiles.length > 0) && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        )}

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('courses')}
            id="tab-admin-courses-btn"
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'courses'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Gestão de Cursos</span>
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-800 text-[10px] font-bold">
              {courses.length}
            </span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-amber-500 text-zinc-950 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Minha Conta</span>
        </button>
      </div>

      {/* Tab: LESSONS & SCHEDULE */}
      {activeTab === 'lessons' && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-100">
              {currentUser.role === 'tutor' ? 'Solicitações e Aulas Agendadas' : 'As Minhas Aulas Agendadas'}
            </h2>
            <span className="text-xs text-zinc-400">Total: {myLessons.length}</span>
          </div>

          {myLessons.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 text-xs text-zinc-400 space-y-2">
              <Calendar className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="font-semibold text-zinc-300">Você não tem nenhuma aula agendada no momento.</p>
              <p>Consulte a lista de explicadores disponíveis para agendar uma nova sessão.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myLessons.map(lesson => {
                const isPending = lesson.status === 'pending';
                const isAccepted = lesson.status === 'accepted';
                const isLive = lesson.status === 'live';
                const isCompleted = lesson.status === 'completed';
                const isRejected = lesson.status === 'rejected';

                return (
                  <div
                    key={lesson.id}
                    className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      {/* Status badge and date */}
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isLive
                              ? 'bg-red-500 text-white animate-pulse'
                              : isAccepted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : isCompleted
                              ? 'bg-zinc-800 text-zinc-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {isLive
                            ? '● AO VIVO'
                            : isAccepted
                            ? 'Agendada & Confirmada'
                            : isPending
                            ? 'Aguardando Resposta'
                            : isCompleted
                            ? 'Concluída'
                            : 'Recusada'}
                        </span>

                        <div className="text-zinc-400 flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>
                            {lesson.date} às {lesson.time} ({lesson.durationMinutes} min)
                          </span>
                        </div>
                      </div>

                      {/* Lesson title */}
                      <h3 className="text-sm font-bold text-zinc-100 mt-2">{lesson.subject}</h3>

                      {/* Participant info */}
                      <div className="flex items-center gap-2.5 mt-2 text-xs">
                        <img
                          src={currentUser.role === 'student' ? lesson.tutorAvatar : lesson.studentAvatar}
                          alt="avatar"
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-700"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-zinc-300">
                          {currentUser.role === 'student' ? (
                            <>
                              Explicador: <strong>{lesson.tutorName}</strong>
                            </>
                          ) : (
                            <>
                              Estudante: <strong>{lesson.studentName}</strong>
                            </>
                          )}
                        </span>
                      </div>

                      {lesson.notes && (
                        <p className="text-[11px] text-zinc-400 bg-zinc-950 p-2 rounded-lg mt-2 italic">
                          "{lesson.notes}"
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                      <span className="font-black text-amber-400">{lesson.priceMzn} MZN</span>

                      <div className="flex items-center gap-2">
                        {/* Tutor Accept / Reject buttons */}
                        {currentUser.role === 'tutor' && isPending && (
                          <>
                            <button
                              onClick={() => updateLessonStatus(lesson.id, 'rejected')}
                              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-red-400 text-xs font-semibold flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Rejeitar
                            </button>
                            <button
                              onClick={() => updateLessonStatus(lesson.id, 'accepted')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Aceitar Aula
                            </button>
                          </>
                        )}

                        {/* Enter Lesson Button (Req 6: Entrar na aula) */}
                        {(isAccepted || isLive) && (
                          <button
                            onClick={() => setActiveLessonForRoom(lesson)}
                            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Entrar na Aula
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: PURCHASED FILES (Req 13: Meus Arquivos) */}
      {activeTab === 'files' && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-100">Arquivos Adquiridos na Biblioteca</h2>
            <span className="text-xs text-zinc-400">Total: {myPurchasedFiles.length} arquivos</span>
          </div>

          {myPurchasedFiles.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 text-xs text-zinc-400 space-y-2">
              <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="font-semibold text-zinc-300">Você ainda não adquiriu nenhum arquivo premium.</p>
              <p>Explore a biblioteca digital e acerte as suas disciplinas com os melhores apontamentos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myPurchasedFiles.map(file => (
                <div
                  key={file.id}
                  className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={file.coverImage}
                      alt={file.title}
                      className="w-14 h-18 rounded-lg object-cover ring-1 ring-zinc-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-bold text-zinc-100 line-clamp-2 leading-tight">
                        {file.title}
                      </h3>
                      <span className="text-[10px] text-amber-400 block mt-1">{file.category}</span>
                      <span className="text-[10px] text-zinc-500 block">
                        {file.pageCount} pág. • {file.fileSize}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Acesso Liberado
                    </span>

                    <button
                      onClick={() => setSelectedFileToRead(file)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Ler / Baixar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: TUTOR EARNINGS */}
      {activeTab === 'earnings' && currentUser.role === 'tutor' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-400 font-semibold">Ganhos em Aulas</span>
              <p className="text-2xl font-black text-zinc-50">{tutorEarningsFromLessons} MZN</p>
              <span className="text-[10px] text-zinc-500">{tutorLessonsCompleted.length} aulas realizadas</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-400 font-semibold">Ganhos em Venda de Arquivos</span>
              <p className="text-2xl font-black text-amber-400">{tutorEarningsFromFiles} MZN</p>
              <span className="text-[10px] text-zinc-500">{tutorFilesSold.length} arquivos baixados</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <span className="text-xs text-zinc-400 font-semibold">Saldo Disponível para Levantamento</span>
              <p className="text-2xl font-black text-emerald-400">{totalTutorEarnings} MZN</p>
              <button
                onClick={() => alert(`Pedido de levantamento de ${totalTutorEarnings} MZN enviado para o seu M-Pesa!`)}
                className="mt-2 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs"
              >
                Levantar via M-Pesa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: ADMIN MANAGEMENT (Req 15) */}
      {activeTab === 'admin' && currentUser.role === 'admin' && (
        <div className="mt-6 space-y-6">
          {/* Platform Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-[11px] text-zinc-400">Total Usuários</span>
              <p className="text-xl font-bold text-zinc-100">{users.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-[11px] text-zinc-400">Explicadores Registados</span>
              <p className="text-xl font-bold text-amber-400">{tutors.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-[11px] text-zinc-400">Aulas no Sistema</span>
              <p className="text-xl font-bold text-zinc-100">{lessons.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-[11px] text-zinc-400">Arquivos na Biblioteca</span>
              <p className="text-xl font-bold text-zinc-100">{libraryFiles.length}</p>
            </div>
          </div>

          {/* Pending Tutors Verification */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Gestão e Verificação de Explicadores (✓ Selo Oficial)
            </h3>
            <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-2xl bg-zinc-900 overflow-hidden text-xs">
              {tutors.map(tutor => (
                <div key={tutor.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-10 h-10 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-bold text-zinc-200">{tutor.name}</p>
                      <p className="text-[11px] text-zinc-400">
                        {tutor.course || tutor.mainSubject} • {tutor.hourlyRateMzn} MZN/h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => verifyTutor(tutor.id, !tutor.isVerified)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                        tutor.isVerified
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {tutor.isVerified ? '✓ Verificado' : 'Conceder Selo'}
                    </button>
                    <button
                      onClick={() => toggleUserSuspension(tutor.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                        tutor.isSuspended
                          ? 'bg-red-500 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:text-red-400'
                      }`}
                    >
                      {tutor.isSuspended ? 'Suspenso' : 'Suspender'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Library Files Approval */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Moderação de Arquivos da Biblioteca
            </h3>
            <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-2xl bg-zinc-900 overflow-hidden text-xs">
              {libraryFiles.map(file => (
                <div key={file.id} className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-zinc-200">{file.title}</p>
                    <p className="text-[11px] text-zinc-400">
                      Por {file.authorName} • {file.category} • Preço: {file.priceMzn === 0 ? 'Grátis' : `${file.priceMzn} MZN`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!file.isApproved && (
                      <button
                        onClick={() => deleteOrApproveFile(file.id, true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs"
                      >
                        Aprovar
                      </button>
                    )}
                    <button
                      onClick={() => deleteOrApproveFile(file.id, false)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-red-400 text-xs font-semibold hover:bg-zinc-700"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: COURSE MANAGEMENT (Admin only) */}
      {activeTab === 'courses' && currentUser.role === 'admin' && (
        <div className="mt-6 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-zinc-100">Gestão de Cursos do ISPS</h2>
              </div>
              <p className="text-xs text-zinc-400">
                Cadastre e atualize a oferta formativa institucional do Instituto Superior Politécnico de Songo.
              </p>
            </div>

            <button
              type="button"
              id="admin-add-course-btn"
              onClick={handleOpenAddCourse}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Adicionar Novo Curso</span>
            </button>
          </div>

          {/* Search bar for admin */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={courseSearch}
              onChange={e => setCourseSearch(e.target.value)}
              placeholder="Pesquisar nos cursos cadastrados..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Courses List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses
              .filter(
                c =>
                  c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
                  c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
                  c.department.toLowerCase().includes(courseSearch.toLowerCase())
              )
              .map(course => (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md">
                        {course.degree} • {course.durationYears} Anos
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-zinc-100">{course.name}</h3>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{course.department}</p>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {course.coordinator && (
                      <div className="text-[11px] text-zinc-300">
                        <span className="text-zinc-500">Coordenador:</span> {course.coordinator}
                      </div>
                    )}

                    {course.subjects && course.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {course.subjects.slice(0, 3).map((sub, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400"
                          >
                            {sub}
                          </span>
                        ))}
                        {course.subjects.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-500">
                            +{course.subjects.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCourse(course)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-400" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(course.id, course.name)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Add / Edit Course Modal */}
          {isCourseFormOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full my-8 space-y-5 shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-100">
                      {editingCourseId ? 'Editar Curso Superior' : 'Cadastrar Novo Curso Superior'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={resetCourseForm}
                    className="text-zinc-500 hover:text-zinc-300 text-sm p-1"
                  >
                    ✕
                  </button>
                </div>

                {courseFormFeedback && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{courseFormFeedback}</span>
                  </div>
                )}

                <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-zinc-300 font-semibold block">Código do Curso *</label>
                      <input
                        type="text"
                        value={formCode}
                        onChange={e => setFormCode(e.target.value)}
                        placeholder="ex: ENG-ELE"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 uppercase font-mono focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-zinc-300 font-semibold block">Nome Completo do Curso *</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={e => setFormName(e.target.value)}
                        placeholder="ex: Engenharia Elétrica e de Potência"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-zinc-300 font-semibold block">Grau Acadêmico</label>
                      <select
                        value={formDegree}
                        onChange={e => setFormDegree(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Licenciatura">Licenciatura</option>
                        <option value="Mestrado">Mestrado</option>
                        <option value="Técnico Superior">Técnico Superior</option>
                        <option value="Pós-Graduação">Pós-Graduação</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-300 font-semibold block">Duração Oficial (Anos)</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={formDuration}
                        onChange={e => setFormDuration(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-semibold block">Departamento Acadêmico</label>
                    <select
                      value={formDepartment}
                      onChange={e => setFormDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Departamento de Engenharia Elétrica">Departamento de Engenharia Elétrica</option>
                      <option value="Departamento de Engenharia Mecânica">Departamento de Engenharia Mecânica</option>
                      <option value="Departamento de Engenharia Hidráulica e Ambiente">Departamento de Engenharia Hidráulica e Ambiente</option>
                      <option value="Departamento de Informática e Tecnologias">Departamento de Informática e Tecnologias</option>
                      <option value="Departamento de Ciências Sociais e Gestão">Departamento de Ciências Sociais e Gestão</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-semibold block">Coordenador do Curso</label>
                    <input
                      type="text"
                      value={formCoordinator}
                      onChange={e => setFormCoordinator(e.target.value)}
                      placeholder="ex: Prof. Dr. Armando Nhantumbo"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-semibold block">Disciplinas Principais (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={formSubjects}
                      onChange={e => setFormSubjects(e.target.value)}
                      placeholder="ex: Cálculo I, Circuitos Elétricos, Eletromagnetismo, Máquinas Elétricas"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-semibold block">Descrição Curricular e Objetivos *</label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={e => setFormDescription(e.target.value)}
                      placeholder="Descreva o perfil profissional, saídas de emprego e matriz curricular..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={resetCourseForm}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      id="save-course-submit-btn"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-lg"
                    >
                      {editingCourseId ? 'Atualizar Curso' : 'Salvar Curso no ISPS'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: PROFILE SETTINGS (Req 16: Minha Conta) */}
      {activeTab === 'profile' && (
        <div className="mt-6 max-w-xl">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h2 className="text-base font-bold text-zinc-100">Configurações da Minha Conta</h2>

            {profileSavedMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Dados atualizados com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Número de Telefone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Biografia / Apresentação</label>
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors"
              >
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}

      {/* File Reader Modal */}
      {selectedFileToRead && (
        <FileViewerModal
          file={selectedFileToRead}
          onClose={() => setSelectedFileToRead(null)}
          onBuy={() => {}}
        />
      )}
    </div>
  );
};
