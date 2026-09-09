import React from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Award,
  BookOpen,
  MessageSquare,
  Bookmark,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

interface TutorProfileModalProps {
  tutor: User | null;
  onClose: () => void;
  onRequestLesson: (tutor: User) => void;
  onOpenChat: (tutor: User) => void;
}

export const TutorProfileModal: React.FC<TutorProfileModalProps> = ({
  tutor,
  onClose,
  onRequestLesson,
  onOpenChat
}) => {
  const { reviews, toggleSaveItem, isItemSaved } = useApp();

  if (!tutor) return null;

  const tutorReviews = reviews.filter(r => r.targetType === 'tutor' && r.targetId === tutor.id);
  const isSaved = isItemSaved(tutor.id);

  return (
    <div
      id="tutor-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        id="tutor-profile-modal-card"
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl text-zinc-100 p-6 relative"
      >
        {/* Close & Favorite top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Perfil Profissional
            </span>
            {tutor.isVerified && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Explicador Verificado
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleSaveItem(tutor.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
              }`}
              title={isSaved ? 'Remover dos guardados' : 'Guardar explicador'}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tutor Identity Hero */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-5">
          <div className="relative">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-zinc-700 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-zinc-900 ${
                tutor.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-zinc-500'
              }`}
              title={tutor.onlineStatus === 'online' ? 'Disponível Online' : 'Offline'}
            />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">{tutor.name}</h2>
            </div>
            <p className="text-sm text-amber-400 font-semibold">{tutor.course || tutor.mainSubject}</p>
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
              {tutor.institution || 'Instituto Superior Politécnico de Songo (ISPS)'}
            </p>
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {tutor.location || 'Songo, Moçambique'} • Modalidade:{' '}
              <span className="text-zinc-300 font-medium">
                {tutor.teachingMode === 'both' ? 'Online e Presencial' : tutor.teachingMode === 'online' ? 'Online' : 'Presencial'}
              </span>
            </p>
          </div>

          {/* Price & Rating Badge */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-right min-w-[130px]">
            <div className="flex items-center justify-end gap-1 text-amber-400 font-bold text-sm mb-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{tutor.rating || 5.0}</span>
              <span className="text-zinc-500 text-xs">({tutor.reviewCount || 0})</span>
            </div>
            <div className="text-xs text-zinc-400">Preço / aula</div>
            <div className="text-lg font-black text-zinc-100">
              {tutor.hourlyRateMzn || 400} <span className="text-xs text-amber-400 font-normal">MZN</span>
            </div>
          </div>
        </div>

        {/* Biografia */}
        <div className="mt-6 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Sobre o Explicador</h4>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/60">
            {tutor.bio || 'Explicador comprometido com a excelência acadêmica e aprovação dos estudantes no ISPS e outras instituições.'}
          </p>
        </div>

        {/* Disciplinas Lecionadas */}
        <div className="mt-5 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Disciplinas que Ensina
          </h4>
          <div className="flex flex-wrap gap-2">
            {(tutor.subjects || [tutor.mainSubject || 'Matemática']).map((s, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700/60"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Horários & Disponibilidade */}
        <div className="mt-5 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            Horários Disponíveis
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(tutor.availableSchedule || ['Seg a Sex 18h-20h', 'Sáb 09h-13h']).map((sched, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-300 font-medium"
              >
                {sched}
              </div>
            ))}
          </div>
        </div>

        {/* Certificados & Comprovativos */}
        {tutor.certificates && tutor.certificates.length > 0 && (
          <div className="mt-5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Certificações & Reconhecimentos
            </h4>
            <div className="space-y-1.5">
              {tutor.certificates.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-300"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Avaliações dos Alunos */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              Avaliações Recentes dos Alunos ({tutorReviews.length})
            </h4>
          </div>

          {tutorReviews.length === 0 ? (
            <p className="text-xs text-zinc-500 italic p-3 bg-zinc-950 rounded-lg">
              Ainda não possui avaliações públicas. Seja o primeiro a agendar e avaliar!
            </p>
          ) : (
            <div className="space-y-2">
              {tutorReviews.map(rev => (
                <div key={rev.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-200">{rev.authorName}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-zinc-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-zinc-600 block">{rev.createdAt}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons: Solicitar Explicação & Chat */}
        <div className="mt-7 pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            id="tutor-chat-btn"
            onClick={() => onOpenChat(tutor)}
            className="py-3 px-4 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            Conversar no Chat
          </button>
          <button
            id="tutor-request-btn"
            onClick={() => onRequestLesson(tutor)}
            className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/10"
          >
            <Calendar className="w-4 h-4" />
            Solicitar Explicação
          </button>
        </div>
      </div>
    </div>
  );
};
