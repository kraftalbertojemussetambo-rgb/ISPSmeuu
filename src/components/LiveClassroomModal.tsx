import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  MessageSquare,
  PenTool,
  Eraser,
  RotateCcw,
  Send,
  Users,
  Clock,
  Sparkles,
  Maximize2
} from 'lucide-react';

export const LiveClassroomModal: React.FC = () => {
  const { activeLessonForRoom, setActiveLessonForRoom, currentUser } = useApp();

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'board' | 'chat'>('board');
  const [penColor, setPenColor] = useState('#fbbf24'); // amber
  const [penSize, setPenSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  // Chat in classroom
  const [classMessages, setClassMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Sistema', text: 'Sessão de aula online iniciada no ISPS Dark. Áudio e quadro ativos.', time: '17:00' },
    { sender: 'Eng. Tomás Chivambo', text: 'Boa tarde! Bem-vindo. Vamos começar com o diagrama de fasores.', time: '17:01' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Canvas drawing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw initial welcome formula/diagram
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.font = '14px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('ISPS Songo - Quadro Virtual Interativo', 20, 30);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Z = R + j*(wL - 1/(wC))  |  V = Z * I', 20, 60);

    // Coordinate axis
    ctx.beginPath();
    ctx.strokeStyle = '#475569';
    ctx.moveTo(30, 180);
    ctx.lineTo(220, 180);
    ctx.moveTo(60, 100);
    ctx.lineTo(60, 220);
    ctx.stroke();

    // Phasor vector
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.moveTo(60, 180);
    ctx.lineTo(160, 120);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillText('V_fase', 165, 125);
  }, []);

  if (!activeLessonForRoom) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = isEraser ? '#09090b' : penColor;
    ctx.lineWidth = isEraser ? 20 : penSize;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setClassMessages(prev => [
      ...prev,
      {
        sender: currentUser ? currentUser.name : 'Aluno',
        text: inputMsg,
        time: timeStr
      }
    ]);
    setInputMsg('');
  };

  return (
    <div
      id="classroom-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        id="classroom-modal-card"
        className="w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl text-zinc-100 overflow-hidden"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>{activeLessonForRoom.subject}</span>
                <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Ao Vivo
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Explicador: <strong>{activeLessonForRoom.tutorName}</strong> • Estudante:{' '}
                <strong>{activeLessonForRoom.studentName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Duração: {activeLessonForRoom.durationMinutes} min</span>
            </div>

            <button
              onClick={() => setActiveLessonForRoom(null)}
              className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              Sair da Aula
            </button>
          </div>
        </div>

        {/* Main Stage: Video Feeds + Whiteboard / Chat */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 p-3 overflow-hidden">
          {/* Left / Center Area: Interactive Whiteboard & Participants */}
          <div className="lg:col-span-2 flex flex-col gap-3 h-full overflow-hidden">
            {/* Whiteboard Controls */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                  <PenTool className="w-3.5 h-3.5 text-amber-400" />
                  Quadro Virtual
                </span>
                <div className="h-4 w-px bg-zinc-700 mx-1" />
                <button
                  onClick={() => setIsEraser(false)}
                  className={`p-1.5 rounded-lg ${!isEraser ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-zinc-400'}`}
                  title="Caneta"
                >
                  <PenTool className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsEraser(true)}
                  className={`p-1.5 rounded-lg ${isEraser ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-zinc-400'}`}
                  title="Borracha"
                >
                  <Eraser className="w-3.5 h-3.5" />
                </button>

                {/* Color swatches */}
                {!isEraser && (
                  <div className="flex items-center gap-1 ml-1">
                    {['#fbbf24', '#38bdf8', '#ef4444', '#10b981', '#ffffff'].map(c => (
                      <button
                        key={c}
                        onClick={() => setPenColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-4 h-4 rounded-full border ${penColor === c ? 'ring-2 ring-amber-400' : 'border-zinc-700'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
                  title="Limpar quadro"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpar
                </button>
              </div>
            </div>

            {/* Drawing Canvas */}
            <div className="flex-1 bg-zinc-950 rounded-xl border border-zinc-800 relative overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={700}
                height={420}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full cursor-crosshair bg-zinc-950"
              />
            </div>

            {/* Bottom Media Controls */}
            <div className="flex items-center justify-center gap-3 p-2 bg-zinc-900 rounded-xl border border-zinc-800">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-3 rounded-full transition-colors ${
                  micOn ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
                title={micOn ? 'Desativar microfone' : 'Ativar microfone'}
              >
                {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`p-3 rounded-full transition-colors ${
                  videoOn ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
                title={videoOn ? 'Desativar câmera' : 'Ativar câmera'}
              >
                {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => alert('Compartilhamento de tela em preparação.')}
                className="p-3 rounded-full bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
                title="Partilhar ecrã"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Sidebar: Video participants + Live Chat */}
          <div className="flex flex-col gap-3 h-full overflow-hidden">
            {/* Mini Video Previews of Tutor & Student */}
            <div className="grid grid-cols-2 gap-2">
              {/* Tutor Video */}
              <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video flex items-center justify-center">
                <img
                  src={activeLessonForRoom.tutorAvatar}
                  alt={activeLessonForRoom.tutorName}
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between text-[10px] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur">
                  <span className="font-semibold truncate text-zinc-200">{activeLessonForRoom.tutorName}</span>
                  <span className="text-emerald-400">● Mic</span>
                </div>
              </div>

              {/* Student Video */}
              <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video flex items-center justify-center">
                {videoOn ? (
                  <img
                    src={activeLessonForRoom.studentAvatar}
                    alt={activeLessonForRoom.studentName}
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-zinc-500 text-xs font-semibold">Câmera desligada</div>
                )}
                <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between text-[10px] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur">
                  <span className="font-semibold truncate text-zinc-200">{activeLessonForRoom.studentName} (Você)</span>
                  <span className={micOn ? 'text-emerald-400' : 'text-red-400'}>
                    {micOn ? '● Mic' : 'Mudo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Panel */}
            <div className="flex-1 flex flex-col rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  Chat da Sessão
                </span>
                <span className="text-[10px] text-zinc-500">Ao vivo</span>
              </div>

              {/* Messages log */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                {classMessages.map((m, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/60">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-amber-400 text-[11px]">{m.sender}</span>
                      <span className="text-[9px] text-zinc-500">{m.time}</span>
                    </div>
                    <p className="text-zinc-300 text-xs leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-2 border-t border-zinc-800 flex items-center gap-1.5">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  placeholder="Enviar mensagem na aula..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
