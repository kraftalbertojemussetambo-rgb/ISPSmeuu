import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LibraryFile } from '../types';
import { LIBRARY_CATEGORIES } from '../data/mockData';
import {
  Search,
  BookOpen,
  Download,
  Star,
  Lock,
  Plus,
  Bookmark,
  FileText,
  Filter,
  CheckCircle,
  Eye
} from 'lucide-react';
import { FileViewerModal } from './FileViewerModal';
import { PaymentModal } from './PaymentModal';
import { UploadFileModal } from './UploadFileModal';

export const LibraryView: React.FC = () => {
  const {
    libraryFiles,
    purchases,
    currentUser,
    toggleSaveItem,
    isItemSaved,
    setAuthModalOpen,
    setAuthModalMode
  } = useApp();

  // Filters and state
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeTab, setActiveTab] = useState<'all' | 'public' | 'premium'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [readingFile, setReadingFile] = useState<LibraryFile | null>(null);
  const [buyingFile, setBuyingFile] = useState<LibraryFile | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Check if a file is already purchased by current user
  const isFilePurchased = (fileId: string) => {
    return purchases.some(p => p.fileId === fileId && p.userId === currentUser?.id);
  };

  const filteredFiles = useMemo(() => {
    return libraryFiles.filter(file => {
      if (!file.isApproved) return false;

      // Tab filter (public vs premium)
      if (activeTab === 'public' && file.priceMzn > 0) return false;
      if (activeTab === 'premium' && file.priceMzn === 0) return false;

      // Category filter
      if (selectedCategory !== 'Todos' && file.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = file.title.toLowerCase().includes(q);
        const inAuthor = file.authorName.toLowerCase().includes(q);
        const inCategory = file.category.toLowerCase().includes(q);
        const inTags = file.tags.some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inAuthor && !inCategory && !inTags) return false;
      }

      return true;
    });
  }, [libraryFiles, activeTab, selectedCategory, searchQuery]);

  const handleAction = (file: LibraryFile) => {
    if (file.priceMzn === 0 || isFilePurchased(file.id)) {
      setReadingFile(file);
    } else {
      if (!currentUser) {
        setAuthModalMode('login');
        setAuthModalOpen(true);
        return;
      }
      setBuyingFile(file);
    }
  };

  const handleOpenUpload = () => {
    if (!currentUser) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setUploadModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Title and Publish Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Repositório Acadêmico
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-50 tracking-tight mt-1">
            Biblioteca ISPS Dark
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Acesso a sebentas, manuais de laboratório, exames resolvidos, livros didáticos e apontamentos dos cursos do ISPS e do país.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenUpload}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Arquivo</span>
          </button>
        </div>
      </div>

      {/* Main Tabs: Todos, 📚 Públicos (Grátis), 💰 Premium (Pagos) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
        <div className="flex items-center p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todos os Materiais
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'public'
                ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>📚 Arquivos Públicos (Grátis)</span>
          </button>
          <button
            onClick={() => setActiveTab('premium')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'premium'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>💰 Arquivos Premium</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por título, autor, exame..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Horizontal Category Scroll Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none text-xs">
        {LIBRARY_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/40 rounded-2xl border border-zinc-800/60 mt-4">
          <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-200">Nenhum arquivo encontrado</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Não foram encontrados documentos nesta categoria ou termo pesquisado.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Todos');
              setSearchQuery('');
              setActiveTab('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-semibold"
          >
            Redefinir busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {filteredFiles.map(file => {
            const purchased = isFilePurchased(file.id);
            const isSaved = isItemSaved(file.id);
            const isFree = file.priceMzn === 0;

            return (
              <div
                key={file.id}
                className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:shadow-black/40"
              >
                <div>
                  {/* File Cover Image Header */}
                  <div className="relative h-44 w-full bg-zinc-950 overflow-hidden">
                    <img
                      src={file.coverImage}
                      alt={file.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

                    {/* Price / Free Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {isFree ? (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-500 text-zinc-950 shadow-md">
                          GRÁTIS
                        </span>
                      ) : purchased ? (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500 text-white flex items-center gap-1 shadow-md">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Adquirido
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500 text-zinc-950 shadow-md">
                          {file.priceMzn} MZN
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur text-zinc-300">
                        {file.format}
                      </span>
                    </div>

                    {/* Save Favorite button */}
                    <button
                      onClick={() => toggleSaveItem(file.id)}
                      className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur transition-colors ${
                        isSaved
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-black/60 text-zinc-300 hover:text-white'
                      }`}
                      title={isSaved ? 'Remover dos guardados' : 'Guardar arquivo'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    {/* Category pill bottom left */}
                    <div className="absolute bottom-2 left-3">
                      <span className="text-[11px] font-semibold text-amber-300 bg-zinc-900/90 px-2 py-0.5 rounded-md border border-zinc-800">
                        {file.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                      {file.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {file.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Por <strong>{file.authorName}</strong></span>
                      <span>{file.pageCount} pág. • {file.fileSize}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-4 pb-4 pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{file.rating || 5.0}</span>
                    <span className="text-zinc-500 text-[10px]">({file.downloadsCount} downloads)</span>
                  </div>

                  {isFree || purchased ? (
                    <button
                      onClick={() => handleAction(file)}
                      className="py-1.5 px-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ler agora</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(file)}
                      className="py-1.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Comprar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reader Modal */}
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
          onSuccess={() => {
            setBuyingFile(null);
          }}
        />
      )}

      {/* Upload File Modal */}
      {uploadModalOpen && <UploadFileModal onClose={() => setUploadModalOpen(false)} />}
    </div>
  );
};
