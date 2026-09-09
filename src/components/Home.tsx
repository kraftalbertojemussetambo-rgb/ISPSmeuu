import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Sparkles,
  Star,
  ShieldCheck,
  ArrowRight,
  Download,
  Users,
  CheckCircle,
  FileText,
  Clock,
  ThumbsUp,
  MessageSquare,
  Zap
} from 'lucide-react';
import { POPULAR_SUBJECTS } from '../data/mockData';
import { User, LibraryFile } from '../types';
import { TutorProfileModal } from './TutorProfileModal';
import { FileViewerModal } from './FileViewerModal';
import { PaymentModal } from './PaymentModal';

export const Home: React.FC = () => {
  const {
    tutors,
    libraryFiles,
    posts,
    setActiveTab,
    selectedTutorProfile,
    setSelectedTutorProfile,
    setLessonModalTutor,
    setActiveChatUser,
    currentUser,
    setAuthModalOpen,
    setAuthModalMode
  } = useApp();

  // Search in banner
  const [bannerSearch, setBannerSearch] = useState('');
  const [teachingMode, setTeachingMode] = useState<'all' | 'online' | 'in_person'>('all');

  // Modals for preview
  const [readingFile, setReadingFile] = useState<LibraryFile | null>(null);
  const [buyingFile, setBuyingFile] = useState<LibraryFile | null>(null);

  // Filtered queries for home sections
  const featuredTutors = tutors.slice(0, 4);
  const topRatedTutors = [...tutors].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
  const mostDownloadedFiles = [...libraryFiles].sort((a, b) => b.downloadsCount - a.downloadsCount).slice(0, 4);
  const newestFiles = [...libraryFiles].slice(0, 4);
  const recentQuestions = posts.filter(p => p.type === 'question').slice(0, 3);
  const recentArticles = posts.filter(p => p.type === 'article').slice(0, 3);

  const handleBannerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('tutors');
  };

  const handleOpenChat = (tutor: User) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setSelectedTutorProfile(null);
    setActiveChatUser(tutor);
    setActiveTab('chat');
  };

  const handleRequestLesson = (tutor: User) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setSelectedTutorProfile(null);
    setLessonModalTutor(tutor);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO BANNER PRINCIPAL */}
      <section
        id="hero-banner"
        className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 overflow-hidden bg-gradient-to-b from-zinc-900/50 via-zinc-950 to-zinc-950"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold text-amber-400">ISPS Dark</span>
            <span className="text-zinc-500">•</span>
            <span>Instituto Superior Politécnico de Songo</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-50 tracking-tight leading-tight">
            Aprenda melhor.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              Encontre os melhores explicadores
            </span>{' '}
            e materiais acadêmicos.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Uma plataforma simples e poderosa para estudantes do ISPS e de todo o país encontrarem apoio acadêmico, aulas online e conteúdos de estudo com alta velocidade.
          </p>

          {/* Intelligent Search Bar */}
          <form
            onSubmit={handleBannerSearch}
            className="p-2 sm:p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col sm:flex-row items-center gap-2 text-xs text-zinc-200 mt-6"
          >
            <div className="flex items-center gap-2.5 flex-1 px-3 w-full py-2">
              <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <input
                type="text"
                value={bannerSearch}
                onChange={e => setBannerSearch(e.target.value)}
                placeholder="O que deseja aprender hoje? (Ex: Cálculo, Física, Programação, Engenharia...)"
                className="w-full bg-transparent border-none text-zinc-100 placeholder:text-zinc-500 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

            <div className="flex items-center justify-between w-full sm:w-auto gap-2 px-1">
              {/* Mode Select */}
              <select
                value={teachingMode}
                onChange={e => setTeachingMode(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none text-xs"
              >
                <option value="all">Todas modalidades</option>
                <option value="online">Online</option>
                <option value="in_person">Presencial</option>
              </select>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-amber-500/10 flex-shrink-0"
              >
                <span>Pesquisar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Action Buttons (Botões de Ação Rápida) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => setActiveTab('tutors')}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Encontrar Explicador</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Explorar Biblioteca</span>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Tirar Dúvidas</span>
            </button>

            <button
              onClick={() => {
                setAuthModalMode('register-tutor');
                setAuthModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Quero ser explicador</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. DISCIPLINAS POPULARES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">Disciplinas Populares</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              As áreas mais procuradas pelos estudantes do ISPS para exames e trabalhos
            </p>
          </div>
          <button
            onClick={() => setActiveTab('tutors')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            Ver todas
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {POPULAR_SUBJECTS.map((subj, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab('tutors')}
              className="p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors line-clamp-1">
                  {subj.name}
                </h3>
              </div>
              <span className="text-[10px] text-zinc-500 mt-2 block font-medium">
                {subj.count} explicadores
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. EXPLICADORES EM DESTAQUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Destaques da Semana</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-50 mt-0.5">Explicadores em Destaque</h2>
          </div>
          <button
            onClick={() => setActiveTab('tutors')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            Explorar explicadores
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTutors.map(tutor => (
            <div
              key={tutor.id}
              className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-zinc-700"
                      referrerPolicy="no-referrer"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                        tutor.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-zinc-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-100 truncate group-hover:text-amber-400 transition-colors">
                      {tutor.name}
                    </h3>
                    <p className="text-[11px] text-amber-300 font-semibold truncate mt-0.5">
                      {tutor.mainSubject}
                    </p>
                    {tutor.isVerified && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-medium mt-0.5">
                        <ShieldCheck className="w-3 h-3" /> Verificado
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 mt-3 leading-relaxed">
                  {tutor.bio}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{tutor.rating || 5.0}</span>
                    <span className="text-[10px] text-zinc-500 font-normal">({tutor.studentCount} alunos)</span>
                  </div>
                  <span className="text-xs font-black text-zinc-100">
                    {tutor.hourlyRateMzn} <span className="text-[10px] text-amber-400 font-normal">MZN/h</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedTutorProfile(tutor)}
                    className="py-1.5 px-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold text-center transition-colors"
                  >
                    Ver perfil
                  </button>
                  <button
                    onClick={() => handleRequestLesson(tutor)}
                    className="py-1.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold text-center transition-colors shadow-sm"
                  >
                    Solicitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MATERIAIS MAIS BAIXADOS & NOVOS ARQUIVOS (BIBLIOTECA DIGITAL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Biblioteca ISPS Dark</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-50 mt-0.5">Materiais Mais Baixados</h2>
          </div>
          <button
            onClick={() => setActiveTab('library')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            Ver biblioteca completa
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mostDownloadedFiles.map(file => {
            const isFree = file.priceMzn === 0;
            return (
              <div
                key={file.id}
                className="rounded-2xl bg-zinc-900/80 border border-zinc-800/80 overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition-all shadow-sm"
              >
                <div>
                  <div className="relative h-32 w-full bg-zinc-950 overflow-hidden">
                    <img
                      src={file.coverImage}
                      alt={file.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-75"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      {isFree ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-zinc-950">
                          GRÁTIS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-zinc-950">
                          {file.priceMzn} MZN
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                      {file.category}
                    </span>
                    <h3 className="text-xs font-bold text-zinc-100 line-clamp-2 leading-tight">
                      {file.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1">Por {file.authorName}</p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-zinc-800/80 text-xs">
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <Download className="w-3 h-3" /> {file.downloadsCount}
                  </span>
                  <button
                    onClick={() => {
                      if (isFree) setReadingFile(file);
                      else setBuyingFile(file);
                    }}
                    className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                  >
                    {isFree ? 'Acessar' : 'Comprar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. COMUNIDADE & PERGUNTAS RECENTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Dúvidas & Discussões</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-50 mt-0.5">Perguntas Recentes da Comunidade</h2>
          </div>
          <button
            onClick={() => setActiveTab('community')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            Participar da comunidade
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentQuestions.map(q => (
            <div
              key={q.id}
              onClick={() => setActiveTab('community')}
              className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="text-amber-400 font-bold">{q.subject}</span>
                  {q.hasBestAnswer && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Resolvido
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-zinc-100 mt-2 line-clamp-2 leading-snug">
                  {q.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                  {q.content}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <span>Por {q.authorName}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> {q.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> {q.comments.length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION FOR TUTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Rede de Explicadores ISPS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-50">
              Quer ensinar e ser remunerado partilhando o seu conhecimento?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Crie o seu perfil de explicador no ISPS Dark, receba solicitações de aula de estudantes e venda os seus apontamentos com pagamento rápido via M-Pesa e E-Mola.
            </p>
          </div>

          <button
            onClick={() => {
              setAuthModalMode('register-tutor');
              setAuthModalOpen(true);
            }}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-colors shadow-xl shadow-amber-500/10 flex-shrink-0"
          >
            Criar Perfil de Explicador
          </button>
        </div>
      </section>

      {/* Tutor Profile Modal */}
      {selectedTutorProfile && (
        <TutorProfileModal
          tutor={selectedTutorProfile}
          onClose={() => setSelectedTutorProfile(null)}
          onRequestLesson={handleRequestLesson}
          onOpenChat={handleOpenChat}
        />
      )}

      {/* File Reader Modal */}
      {readingFile && (
        <FileViewerModal
          file={readingFile}
          onClose={() => setReadingFile(null)}
          onBuy={f => {
            setReadingFile(null);
            setBuyingFile(f);
          }}
        />
      )}

      {/* Payment Modal */}
      {buyingFile && (
        <PaymentModal
          file={buyingFile}
          onClose={() => setBuyingFile(null)}
          onSuccess={() => setBuyingFile(null)}
        />
      )}
    </div>
  );
};
