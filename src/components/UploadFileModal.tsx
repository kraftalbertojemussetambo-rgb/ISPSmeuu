import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LIBRARY_CATEGORIES } from '../data/mockData';
import { X, Upload, FileText, Image, DollarSign, CheckCircle } from 'lucide-react';

interface UploadFileModalProps {
  onClose: () => void;
}

export const UploadFileModal: React.FC<UploadFileModalProps> = ({ onClose }) => {
  const { currentUser, addLibraryFile } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Engenharia');
  const [priceMzn, setPriceMzn] = useState<number>(0); // 0 = Grátis, >0 = Pago
  const [format, setFormat] = useState<'pdf' | 'docx' | 'zip'>('pdf');
  const [pageCount, setPageCount] = useState(25);
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [tagsInput, setTagsInput] = useState('ISPS, Engenharia, Estudo');
  const [previewSnippet, setPreviewSnippet] = useState('Capítulo 1: Fundamentos teóricos e fórmulas...');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addLibraryFile({
      title,
      description,
      authorId: currentUser.id,
      authorName: currentUser.name,
      category,
      format,
      pageCount,
      fileSize,
      priceMzn: Number(priceMzn),
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      tags,
      previewPagesSnippet: [previewSnippet],
      previewSummary: priceMzn > 0 ? 'Arquivo acadêmico à venda na biblioteca do ISPS.' : 'Arquivo público gratuito para a comunidade acadêmica.'
    });

    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div
      id="upload-file-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        id="upload-file-card"
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 relative text-zinc-100"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-zinc-50 mb-1 flex items-center gap-2">
          <Upload className="w-5 h-5 text-amber-400" />
          Publicar Arquivo na Biblioteca
        </h3>
        <p className="text-xs text-zinc-400 mb-5">
          Compartilhe materiais de estudo gratuitos ou coloque apontamentos e exames resolvidos à venda.
        </p>

        {success ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-zinc-100">Arquivo Publicado com Sucesso!</h4>
            <p className="text-xs text-zinc-400">
              O seu material já está disponível na Biblioteca ISPS Dark para todos os estudantes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Drop Area Simulation */}
            <div className="border-2 border-dashed border-zinc-700 hover:border-amber-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-zinc-950/60">
              <FileText className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-zinc-200">
                Arraste o arquivo PDF ou clique para selecionar
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">PDF, DOCX ou ZIP até 50 MB</p>
            </div>

            {/* Nome do Arquivo */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Nome / Título do Arquivo *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Ficha de Exercícios Resolvidos de Física II - Gravitação"
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Descrição do Conteúdo *
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explique o que o estudante encontrará neste documento..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none resize-none"
                required
              />
            </div>

            {/* Categoria e Formato */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
                >
                  {LIBRARY_CATEGORIES.filter(c => c !== 'Todos').map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Formato</label>
                <select
                  value={format}
                  onChange={e => setFormat(e.target.value as 'pdf' | 'docx' | 'zip')}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none uppercase"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="docx">Word (.docx)</option>
                  <option value="zip">Arquivo ZIP</option>
                </select>
              </div>
            </div>

            {/* Preço (GRÁTIS ou PAGO) */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Tipo de Distribuição</span>
                <span className="text-amber-400 font-bold">
                  {priceMzn === 0 ? '📚 Gratuito (Público)' : `💰 Pago (${priceMzn} MZN)`}
                </span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPriceMzn(0)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                    priceMzn === 0
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Distribuir Grátis
                </button>
                <button
                  type="button"
                  onClick={() => setPriceMzn(priceMzn > 0 ? priceMzn : 150)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                    priceMzn > 0
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Vender Arquivo
                </button>
              </div>

              {priceMzn > 0 && (
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Preço em Meticais (MZN):</label>
                  <input
                    type="number"
                    min="50"
                    step="10"
                    value={priceMzn}
                    onChange={e => setPriceMzn(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-amber-400 font-bold focus:outline-none"
                    placeholder="Ex: 200"
                    required
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Os pagamentos serão creditados diretamente na sua conta M-Pesa ou E-Mola.
                  </span>
                </div>
              )}
            </div>

            {/* Páginas e Tamanho */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Número de Páginas</label>
                <input
                  type="number"
                  value={pageCount}
                  onChange={e => setPageCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Palavras-chave (Tags)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="separadas por vírgula"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm transition-colors shadow-lg shadow-amber-500/10 mt-2"
            >
              Concluir Publicação
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
