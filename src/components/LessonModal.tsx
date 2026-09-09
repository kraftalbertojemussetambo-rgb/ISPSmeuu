import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export const LessonModal: React.FC = () => {
  const {
    lessonModalTutor,
    setLessonModalTutor,
    currentUser,
    requestLesson,
    setActiveTab
  } = useApp();

  const [subject, setSubject] = useState(
    lessonModalTutor?.mainSubject || lessonModalTutor?.subjects?.[0] || 'Engenharia Elétrica'
  );
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('17:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [mode, setMode] = useState<'online' | 'in_person'>('online');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  if (!lessonModalTutor || !currentUser) return null;

  const hourlyRate = lessonModalTutor.hourlyRateMzn || 400;
  const totalPrice = Math.round((hourlyRate * durationMinutes) / 60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestLesson({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      studentPhone: currentUser.phone,
      tutorId: lessonModalTutor.id,
      tutorName: lessonModalTutor.name,
      tutorAvatar: lessonModalTutor.avatar,
      subject,
      date,
      time,
      durationMinutes,
      priceMzn: totalPrice,
      teachingMode: mode,
      notes
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setLessonModalTutor(null);
      setActiveTab('dashboard');
    }, 1500);
  };

  return (
    <div
      id="lesson-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        id="lesson-modal-card"
        className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 relative text-zinc-100 animate-in zoom-in-95 duration-150"
      >
        <button
          onClick={() => setLessonModalTutor(null)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-zinc-50 mb-1 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          Solicitar Explicação
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          Agende uma aula com <strong>{lessonModalTutor.name}</strong>. O explicador será notificado e poderá confirmar a sessão.
        </p>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-zinc-100">Solicitação Enviada com Sucesso!</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              A sua solicitação foi encaminhada para a agenda do explicador. Você pode acompanhar o status no seu painel.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tutor Info Summary */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <img
                src={lessonModalTutor.avatar}
                alt={lessonModalTutor.name}
                className="w-10 h-10 rounded-lg object-cover ring-1 ring-zinc-700"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-200 truncate">{lessonModalTutor.name}</p>
                <p className="text-[11px] text-amber-400">{lessonModalTutor.mainSubject}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-zinc-400">Tarifa base:</span>
                <p className="text-sm font-black text-zinc-100">{hourlyRate} MZN/h</p>
              </div>
            </div>

            {/* Disciplina */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Disciplina da Aula
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
              >
                {(lessonModalTutor.subjects || [lessonModalTutor.mainSubject || 'Matemática']).map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Data Desejada</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Horário de Início</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Duração & Modalidade */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Duração</label>
                <select
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value={60}>1 Hora (60 min)</option>
                  <option value={90}>1 Hora e Meia (90 min)</option>
                  <option value={120}>2 Horas (120 min)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Modalidade</label>
                <select
                  value={mode}
                  onChange={e => setMode(e.target.value as 'online' | 'in_person')}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                >
                  <option value="online">Online (Vídeo / Quadro)</option>
                  <option value="in_person">Presencial (Songo)</option>
                </select>
              </div>
            </div>

            {/* Tópico / Observações */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Tópicos de Estudo / Dúvidas Específicas
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ex: Resolução da ficha 3 de circuitos trifásicos, preparação para o mini-teste de sexta-feira..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>

            {/* Price calculation */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-300 font-semibold block">Valor Previsto da Sessão</span>
                <span className="text-[10px] text-zinc-400">
                  {durationMinutes} minutos a {hourlyRate} MZN/hora
                </span>
              </div>
              <span className="text-xl font-black text-amber-400">{totalPrice} MZN</span>
            </div>

            <button
              id="submit-lesson-request-btn"
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm transition-colors shadow-lg shadow-amber-500/10 flex items-center justify-center gap-1.5"
            >
              Confirmar Solicitação de Aula
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
