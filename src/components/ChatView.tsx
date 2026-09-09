import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, ChatMessage } from '../types';
import {
  Search,
  Send,
  Paperclip,
  Mic,
  MicOff,
  Image,
  FileText,
  Check,
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  Play,
  Pause,
  ArrowLeft
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    messages,
    sendMessage,
    currentUser,
    users,
    activeChatUser,
    setActiveChatUser,
    setLessonModalTutor,
    setAuthModalOpen,
    setAuthModalMode
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter contacts (other users except myself)
  const contacts = users.filter(u => u.id !== currentUser?.id);

  // Find users who have chatted with me
  const sortedContacts = contacts.sort((a, b) => {
    return (b.onlineStatus === 'online' ? 1 : 0) - (a.onlineStatus === 'online' ? 1 : 0);
  });

  const filteredContacts = sortedContacts.filter(c =>
    c.name.toLowerCase().includes(searchContact.toLowerCase()) ||
    c.mainSubject?.toLowerCase().includes(searchContact.toLowerCase())
  );

  // Current conversation messages
  const activeConversationMessages = activeChatUser && currentUser
    ? messages.filter(
        m =>
          (m.senderId === currentUser.id && m.recipientId === activeChatUser.id) ||
          (m.senderId === activeChatUser.id && m.recipientId === currentUser.id)
      )
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationMessages.length]);

  // Audio recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecordingAudio) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingAudio]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChatUser || !currentUser) return;

    sendMessage(activeChatUser.id, inputMessage.trim());
    setInputMessage('');
  };

  const handleSendAudio = () => {
    if (!activeChatUser || !currentUser) return;
    setIsRecordingAudio(false);

    const durationStr = `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}`;
    sendMessage(activeChatUser.id, `🎤 Mensagem de voz (${durationStr})`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChatUser || !currentUser) return;

    const isImg = file.type.startsWith('image/');
    sendMessage(
      activeChatUser.id,
      isImg ? 'Foto compartilhada' : `Documento: ${file.name}`,
      {
        url: isImg
          ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
          : 'https://example.com/arquivo.pdf',
        name: file.name,
        type: isImg ? 'image' : 'file'
      }
    );
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h2 className="text-xl font-bold text-zinc-100">Inicie Sessão para Acessar o Chat</h2>
          <p className="text-xs text-zinc-400">
            Converse diretamente com explicadores, tire dúvidas e compartilhe arquivos com os seus colegas.
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

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl h-[82vh] flex">
        {/* Left pane: Contact list */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-zinc-800 flex flex-col bg-zinc-900/60 ${
            activeChatUser ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-100">Mensagens & Conversas</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
              ISPS Chat
            </span>
          </div>

          {/* Search Contacts */}
          <div className="p-3 border-b border-zinc-800/80">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchContact}
                onChange={e => setSearchContact(e.target.value)}
                placeholder="Pesquisar conversas..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Contacts list */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50">
            {filteredContacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
                Nenhum contato encontrado.
              </div>
            ) : (
              filteredContacts.map(contact => {
                const isSelected = activeChatUser?.id === contact.id;
                // Get last message
                const lastMsg = messages
                  .filter(
                    m =>
                      (m.senderId === currentUser.id && m.receiverId === contact.id) ||
                      (m.senderId === contact.id && m.receiverId === currentUser.id)
                  )
                  .slice(-1)[0];

                return (
                  <button
                    key={contact.id}
                    onClick={() => setActiveChatUser(contact)}
                    className={`w-full p-3 flex items-start gap-3 text-left transition-colors ${
                      isSelected ? 'bg-zinc-800/90' : 'hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-zinc-700"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                          contact.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-zinc-600'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-200 truncate">
                          {contact.name}
                        </span>
                        {lastMsg && (
                          <span className="text-[10px] text-zinc-500">
                            {new Date(lastMsg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-amber-400 truncate">
                        {contact.role === 'tutor' ? `Explicador • ${contact.mainSubject}` : 'Estudante'}
                      </p>

                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {lastMsg ? lastMsg.content : 'Iniciar nova conversa...'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right pane: Active Conversation */}
        {activeChatUser ? (
          <div className="flex-1 flex flex-col bg-zinc-950">
            {/* Conversation Header */}
            <div className="p-3 sm:p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveChatUser(null)}
                  className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <img
                    src={activeChatUser.avatar}
                    alt={activeChatUser.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-700"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${
                      activeChatUser.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-zinc-600'
                    }`}
                  />
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <span>{activeChatUser.name}</span>
                    {activeChatUser.role === 'tutor' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-normal">
                        Explicador
                      </span>
                    )}
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    {activeChatUser.onlineStatus === 'online' ? (
                      <span className="text-emerald-400">● Online agora</span>
                    ) : (
                      'Visto recentemente'
                    )}
                  </span>
                </div>
              </div>

              {/* Tutor Action Button */}
              {activeChatUser.role === 'tutor' && (
                <button
                  onClick={() => setLessonModalTutor(activeChatUser)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors shadow-sm hidden sm:block"
                >
                  Agendar Aula
                </button>
              )}
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-950/40">
              {activeConversationMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 text-xs space-y-2">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-amber-400">
                    <Send className="w-5 h-5" />
                  </div>
                  <p>Inicie a conversa com {activeChatUser.name}.</p>
                  <p className="text-[11px] text-zinc-600">
                    Envie dúvidas acadêmicas, combine horários ou compartilhe fichas de exercícios.
                  </p>
                </div>
              ) : (
                activeConversationMessages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 text-xs shadow-md ${
                          isMe
                            ? 'bg-amber-500 text-zinc-950 rounded-br-none'
                            : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700/60'
                        }`}
                      >
                        {/* Audio Message */}
                        {msg.text.includes('Mensagem de voz') && (
                          <div className="flex items-center gap-3 min-w-[200px] py-1">
                            <button
                              onClick={() =>
                                setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)
                              }
                              className={`p-2 rounded-full ${
                                isMe ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500 text-zinc-950'
                              }`}
                            >
                              {playingAudioId === msg.id ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5 fill-current" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    isMe ? 'bg-zinc-950' : 'bg-amber-400'
                                  } ${playingAudioId === msg.id ? 'w-3/4 animate-pulse' : 'w-1/3'}`}
                                />
                              </div>
                              <span className="text-[10px] opacity-80 mt-1 block">
                                {msg.text}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Image Attachment */}
                        {msg.attachmentType === 'image' && msg.attachmentUrl && (
                          <div className="mb-2 rounded-xl overflow-hidden border border-black/10">
                            <img
                              src={msg.attachmentUrl}
                              alt="Anexo"
                              className="max-h-60 object-cover w-full"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        {/* File Attachment */}
                        {msg.attachmentType === 'file' && (
                          <div
                            className={`flex items-center gap-2 p-2 rounded-xl mb-1 ${
                              isMe ? 'bg-black/10' : 'bg-zinc-900 border border-zinc-700'
                            }`}
                          >
                            <FileText className="w-5 h-5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold truncate text-[11px]">{msg.attachmentName || 'documento.pdf'}</p>
                              <span className="text-[9px] opacity-70">Arquivo Acadêmico</span>
                            </div>
                          </div>
                        )}

                        {/* Text Content */}
                        {!msg.text.includes('Mensagem de voz') && (
                          <p className="leading-relaxed break-words">{msg.text}</p>
                        )}

                        {/* Timestamp & Read ticks */}
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                            isMe ? 'text-zinc-800' : 'text-zinc-400'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isMe && (
                            <span>
                              {msg.isRead ? (
                                <CheckCheck className="w-3 h-3 text-zinc-950 font-bold" />
                              ) : (
                                <Check className="w-3 h-3 text-zinc-800" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-zinc-800 bg-zinc-900/90">
              {isRecordingAudio ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold">A gravar áudio... 0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsRecordingAudio(false)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSendAudio}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-bold flex items-center gap-1 shadow"
                    >
                      <Send className="w-3 h-3" />
                      Enviar Áudio
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Anexar arquivo ou imagem"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    placeholder={`Mensagem para ${activeChatUser.name}...`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                  />

                  {inputMessage.trim() ? (
                    <button
                      type="submit"
                      className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsRecordingAudio(true)}
                      className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Gravar áudio"
                    >
                      <Mic className="w-4 h-4 text-amber-400" />
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center text-zinc-500 bg-zinc-950">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-base font-bold text-zinc-300">Nenhuma conversa selecionada</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
              Escolha um contato à esquerda ou clique em "Conversar no Chat" no perfil de qualquer explicador.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
