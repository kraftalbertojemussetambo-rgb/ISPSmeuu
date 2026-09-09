import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, User, BookOpen, HelpCircle, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    tutors,
    libraryFiles,
    posts,
    setSelectedTutorProfile,
    setActiveTab
  } = useApp();

  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { tutors: [], files: [], posts: [] };
    const q = query.toLowerCase();

    const matchedTutors = tutors.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.mainSubject?.toLowerCase().includes(q) ||
        t.subjects?.some(s => s.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedFiles = libraryFiles.filter(
      f =>
        f.title.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedPosts = posts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.subject.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      tutors: matchedTutors,
      files: matchedFiles,
      posts: matchedPosts
    };
  }, [query, tutors, libraryFiles, posts]);

  if (!isGlobalSearchOpen) return null;

  const handleClose = () => {
    setQuery('');
    setIsGlobalSearchOpen(false);
  };

  return (
    <div
      id="global-search-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        id="global-search-card"
        className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden text-zinc-100 animate-in zoom-in-95 duration-150"
      >
        {/* Search input bar */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Pesquisar explicadores, disciplinas, livros, exames..."
            className="w-full bg-transparent border-none text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs"
            >
              Limpar
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5 text-xs">
          {!query.trim() ? (
            <div className="py-8 text-center text-zinc-500">
              <p className="text-xs">Digite para pesquisar em toda a plataforma ISPS Dark.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                {['Engenharia Elétrica', 'Cálculo I', 'Física II', 'Exames ISPS', 'M-Pesa'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Tutors */}
              {results.tutors.length > 0 && (
                <div>
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Explicadores Encontrados
                  </h4>
                  <div className="space-y-1.5">
                    {results.tutors.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          handleClose();
                          setSelectedTutorProfile(t);
                          setActiveTab('tutors');
                        }}
                        className="w-full p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-8 h-8 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-zinc-200">{t.name}</p>
                            <p className="text-[10px] text-zinc-400">{t.mainSubject} • {t.hourlyRateMzn} MZN/h</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Library Files */}
              {results.files.length > 0 && (
                <div>
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Arquivos da Biblioteca
                  </h4>
                  <div className="space-y-1.5">
                    {results.files.map(f => (
                      <button
                        key={f.id}
                        onClick={() => {
                          handleClose();
                          setActiveTab('library');
                        }}
                        className="w-full p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 flex items-center justify-between text-left transition-colors"
                      >
                        <div>
                          <p className="font-bold text-zinc-200">{f.title}</p>
                          <p className="text-[10px] text-zinc-400">
                            {f.category} • {f.priceMzn === 0 ? 'Grátis' : `${f.priceMzn} MZN`}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Posts */}
              {results.posts.length > 0 && (
                <div>
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Discussões da Comunidade
                  </h4>
                  <div className="space-y-1.5">
                    {results.posts.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          handleClose();
                          setActiveTab('community');
                        }}
                        className="w-full p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 flex items-center justify-between text-left transition-colors"
                      >
                        <div>
                          <p className="font-bold text-zinc-200 truncate">{p.title}</p>
                          <p className="text-[10px] text-zinc-400">{p.subject} • {p.likes} votos</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.tutors.length === 0 && results.files.length === 0 && results.posts.length === 0 && (
                <div className="py-8 text-center text-zinc-500">
                  Nenhum resultado encontrado para "{query}".
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
