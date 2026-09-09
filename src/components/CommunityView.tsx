import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CommunityPost } from '../types';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Send,
  Bookmark,
  Share2,
  Flag,
  Search,
  Plus,
  Filter,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const {
    communityPosts,
    currentUser,
    addCommunityPost,
    likeCommunityPost,
    addPostComment,
    markBestAnswer,
    toggleSaveItem,
    isItemSaved,
    setAuthModalOpen,
    setAuthModalMode
  } = useApp();

  // Mode: 'qa' (Perguntas & Respostas) or 'articles' (Conteúdos e Resumos)
  const [activeSubTab, setActiveSubTab] = useState<'qa' | 'articles'>('qa');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New question / article modal state
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postSubject, setPostSubject] = useState('Engenharia Elétrica');
  const [postTags, setPostTags] = useState('ISPS, Estudo');

  // Active expanded comments thread
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Report toast
  const [reportNotif, setReportNotif] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return communityPosts.filter(post => {
      if (activeSubTab === 'qa' && post.type !== 'question') return false;
      if (activeSubTab === 'articles' && post.type === 'question') return false;

      if (selectedSubject !== 'all' && post.subject !== selectedSubject) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(q);
        const inContent = post.content.toLowerCase().includes(q);
        const inAuthor = post.authorName.toLowerCase().includes(q);
        const inTags = post.tags.some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inContent && !inAuthor && !inTags) return false;
      }

      return true;
    });
  }, [communityPosts, activeSubTab, selectedSubject, searchQuery]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    if (!postTitle.trim() || !postContent.trim()) return;

    const tags = postTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addCommunityPost({
      title: postTitle,
      content: postContent,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      subject: postSubject,
      type: activeSubTab === 'qa' ? 'question' : 'article',
      tags
    });

    setPostTitle('');
    setPostContent('');
    setNewPostModalOpen(false);
  };

  const handleSendComment = (postId: string) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    if (!commentInput.trim()) return;

    addPostComment(postId, {
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: commentInput,
      likes: 0
    });

    setCommentInput('');
  };

  const handleReport = (postId: string) => {
    setReportNotif('Denúncia enviada à administração do ISPS Dark para revisão.');
    setTimeout(() => {
      setReportNotif(null);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {reportNotif && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{reportNotif}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Comunidade & Conteúdos
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-50 tracking-tight mt-1">
            Espaço Acadêmico Colaborativo
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Tire dúvidas com explicadores e colegas, vote nas melhores respostas e acesse resumos acadêmicos essenciais.
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) {
              setAuthModalMode('login');
              setAuthModalOpen(true);
              return;
            }
            setNewPostModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/10 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{activeSubTab === 'qa' ? 'Fazer Pergunta' : 'Publicar Resumo'}</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
        <div className="flex items-center p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-fit">
          <button
            onClick={() => setActiveSubTab('qa')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'qa'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Perguntas & Respostas (Q&A)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('articles')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'articles'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Conteúdos & Resumos</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Pesquisar discussões..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Subject Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none text-xs">
        {['all', 'Engenharia Elétrica', 'Matemática', 'Física', 'Eletrónica', 'Programação', 'Contabilidade'].map(
          subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap text-xs font-medium transition-all ${
                selectedSubject === subj
                  ? 'bg-zinc-800 text-amber-400 border border-amber-500/40 font-bold'
                  : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800/80 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {subj === 'all' ? 'Todas as Disciplinas' : subj}
            </button>
          )
        )}
      </div>

      {/* Posts List */}
      <div className="mt-4 space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800/60">
            <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-200">Nenhum tópico encontrado</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              Seja o primeiro a abrir uma discussão ou formular uma dúvida sobre a matéria!
            </p>
          </div>
        ) : (
          filteredPosts.map(post => {
            const isSaved = isItemSaved(post.id);
            const commentsOpen = expandedCommentsPostId === post.id;

            return (
              <div
                key={post.id}
                className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 transition-all shadow-sm"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-zinc-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-200">{post.authorName}</span>
                        {post.authorRole === 'tutor' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-semibold">
                            Explicador
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-0.5">
                        <span className="text-amber-400 font-semibold">{post.subject}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {post.hasBestAnswer && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Resolvido
                      </span>
                    )}
                    <button
                      onClick={() => toggleSaveItem(post.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved ? 'text-amber-400 bg-amber-500/20' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      title={isSaved ? 'Remover dos guardados' : 'Guardar post'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReport(post.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                      title="Denunciar conteúdo impróprio"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-3 space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-zinc-100">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-950 text-zinc-400 border border-zinc-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Post Footer with Votes & Comments trigger */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  {/* Upvote count */}
                  <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-xl border border-zinc-800">
                    <button
                      onClick={() => likeCommunityPost(post.id)}
                      className="text-zinc-400 hover:text-amber-400 p-1 transition-colors flex items-center gap-1"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="font-bold text-zinc-200">{post.likes}</span>
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedCommentsPostId(commentsOpen ? null : post.id)
                    }
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-zinc-800/60 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>{post.comments.length} Respostas</span>
                  </button>
                </div>

                {/* Expanded Comments & Responses Thread */}
                {commentsOpen && (
                  <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3 animate-in fade-in duration-150">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Respostas da Comunidade ({post.comments.length})
                    </h4>

                    {post.comments.map(c => (
                      <div
                        key={c.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                          c.isBestAnswer
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-zinc-200'
                            : 'bg-zinc-950 border-zinc-800/80 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={c.authorAvatar}
                              alt={c.authorName}
                              className="w-6 h-6 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="font-bold text-zinc-200">{c.authorName}</span>
                            <span className="text-[10px] text-zinc-500">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {c.isBestAnswer ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-zinc-950 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Melhor Resposta
                            </span>
                          ) : (
                            (currentUser?.id === post.authorId || currentUser?.role === 'admin') && (
                              <button
                                onClick={() => markBestAnswer(post.id, c.id)}
                                className="text-[11px] text-zinc-400 hover:text-emerald-400 flex items-center gap-1 font-semibold"
                                title="Marcar como melhor resposta"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Marcar como melhor
                              </button>
                            )
                          )}
                        </div>

                        <p className="leading-relaxed whitespace-pre-line pl-8">{c.content}</p>
                      </div>
                    ))}

                    {/* New Answer / Comment Input */}
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={e => setCommentInput(e.target.value)}
                        placeholder="Escrever uma resposta clara e fundamentada..."
                        className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSendComment(post.id);
                        }}
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        Responder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Creating New Post / Question */}
      {newPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 text-zinc-100 space-y-4">
            <h3 className="text-lg font-bold text-zinc-50">
              {activeSubTab === 'qa' ? 'Fazer Nova Pergunta' : 'Publicar Conteúdo de Estudo'}
            </h3>
            <p className="text-xs text-zinc-400">
              Descreva com clareza o problema para que explicadores e colegas possam ajudar rapidamente.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Título do Tópico</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="Ex: Como calcular a queda de tensão numa linha trifásica de 33 kV?"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Disciplina</label>
                  <select
                    value={postSubject}
                    onChange={e => setPostSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Engenharia Elétrica">Engenharia Elétrica</option>
                    <option value="Matemática">Matemática</option>
                    <option value="Física">Física</option>
                    <option value="Eletrónica">Eletrónica</option>
                    <option value="Programação">Programação</option>
                    <option value="Contabilidade">Contabilidade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Palavras-chave</label>
                  <input
                    type="text"
                    value={postTags}
                    onChange={e => setPostTags(e.target.value)}
                    placeholder="separadas por vírgula"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Explicação Detalhada</label>
                <textarea
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Descreva o exercício, os dados conhecidos e onde você travou..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-md"
                >
                  Publicar Agora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
