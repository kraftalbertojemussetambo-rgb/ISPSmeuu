import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LibraryFile } from '../types';
import {
  X,
  Download,
  BookOpen,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle,
  FileText,
  Lock
} from 'lucide-react';

interface FileViewerModalProps {
  file: LibraryFile | null;
  onClose: () => void;
  onBuy: (file: LibraryFile) => void;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({ file, onClose, onBuy }) => {
  const { purchases, currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!file) return null;

  // Check if user has purchased this file or if it's free
  const isPurchased =
    file.priceMzn === 0 || purchases.some(p => p.fileId === file.id && p.userId === currentUser?.id);

  const totalPages = file.pageCount || 10;

  const handleDownload = () => {
    // Simulated realistic download blob
    const content = `ISPS DARK - BIBLIOTECA DIGITAL\nDocumento: ${file.title}\nAutor: ${file.authorName}\nCategoria: ${file.category}\nLicenciado para: ${currentUser ? currentUser.name : 'Estudante ISPS'}\n\nConteúdo acadêmico verificado do Instituto Superior Politécnico de Songo.\n`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="file-viewer-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        id="file-viewer-card"
        className="w-full max-w-4xl h-[92vh] flex flex-col rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl text-zinc-100 overflow-hidden"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-zinc-100 truncate">{file.title}</h2>
              <p className="text-[11px] text-zinc-400 truncate">
                Por {file.authorName} • {file.category} • {file.fileSize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPurchased ? (
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar PDF Completo</span>
              </button>
            ) : (
              <button
                onClick={() => onBuy(file)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Comprar ({file.priceMzn} MZN)</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 rounded hover:bg-zinc-800 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Página <strong className="text-zinc-100">{currentPage}</strong> de {isPurchased ? totalPages : 3}
            </span>
            <button
              disabled={currentPage >= (isPurchased ? totalPages : 3)}
              onClick={() => setCurrentPage(prev => Math.min(isPurchased ? totalPages : 3, prev + 1))}
              className="p-1 rounded hover:bg-zinc-800 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
              className="p-1 rounded hover:bg-zinc-800"
              title="Reduzir zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
              className="p-1 rounded hover:bg-zinc-800"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Content Paper */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-zinc-950">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl p-8 sm:p-12 shadow-2xl space-y-6 transition-transform"
          >
            <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
                  INSTITUTO SUPERIOR POLITÉCNICO DE SONGO
                </span>
                <h1 className="text-lg sm:text-xl font-extrabold text-zinc-50 mt-1">{file.title}</h1>
              </div>
              <span className="text-xs px-2 py-1 bg-zinc-800 rounded text-zinc-400">Pág. {currentPage}</span>
            </div>

            {/* Document Content Simulation */}
            <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-serif">
              <p className="font-semibold text-zinc-100">
                1. Introdução Teórica e Fundamentos Acadêmicos
              </p>
              <p>
                O presente documento foi elaborado para fornecer aos estudantes da área de{' '}
                <strong>{file.category}</strong> uma base sólida e aplicada, integrando teoria rigorosa
                e problemas de engenharia contextualizados no ambiente técnico moçambicano.
              </p>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-amber-300">
                {file.previewPagesSnippet?.[(currentPage - 1) % (file.previewPagesSnippet?.length || 1)] ||
                  'f(x) = ∫ [2x / (x² + 1)] dx = ln|x² + 1| + C'}
              </div>

              <p>
                As normas técnicas de referência e a metodologia aplicada visam preparar os estudantes
                para os exames finais do semestre e para a prática em instalações industriais e de potência.
              </p>

              <p className="text-zinc-400 italic text-xs">
                {file.description}
              </p>
            </div>

            {/* If not purchased and on page 3, show paywall banner */}
            {!isPurchased && currentPage >= 3 && (
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3 mt-8">
                <Lock className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-100">Fim da Pré-Visualização Gratuita</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Este é um arquivo premium com {file.pageCount} páginas completas. Efetue a compra por apenas{' '}
                  <strong className="text-amber-400 font-black">{file.priceMzn} MZN</strong> via M-Pesa ou E-Mola para
                  desbloquear a leitura integral e o download em PDF.
                </p>
                <button
                  onClick={() => onBuy(file)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-md"
                >
                  Comprar Agora por {file.priceMzn} MZN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
