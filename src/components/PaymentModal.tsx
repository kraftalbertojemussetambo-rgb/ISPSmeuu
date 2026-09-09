import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LibraryFile } from '../types';
import { X, CheckCircle, Smartphone, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  file: LibraryFile | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ file, onClose, onSuccess }) => {
  const { purchaseFile, currentUser } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola' | 'card'>('mpesa');
  const [phone, setPhone] = useState('+258 84 123 4567');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [txRef, setTxRef] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!file) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (paymentMethod !== 'card' && !phone.trim()) {
      setErrorMsg('Por favor informe o número de telefone de Moçambique.');
      return;
    }

    setStep('processing');
    setLoading(true);

    // Simulate STK Push to user's phone for M-Pesa / E-Mola
    setTimeout(async () => {
      try {
        const ok = await purchaseFile(file.id, paymentMethod, phone);
        if (ok) {
          const generatedRef = `${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
          setTxRef(generatedRef);
          setStep('success');
        } else {
          setStep('form');
          setErrorMsg('Falha ao processar pagamento. Tente novamente.');
        }
      } catch (err) {
        setStep('form');
        setErrorMsg('Erro inesperado na transação.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div
      id="payment-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        id="payment-modal-card"
        className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 relative text-zinc-100 animate-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'processing' ? (
          <div className="py-10 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
              <Smartphone className="w-7 h-7 text-amber-400 absolute inset-0 m-auto" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">Aguardando Confirmação no Telemóvel...</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Enviamos um pedido USSD para o número <strong>{phone}</strong>. Digite o seu PIN no seu telemóvel para aprovar{' '}
              <strong className="text-amber-400">{file.priceMzn} MZN</strong>.
            </p>
          </div>
        ) : step === 'success' ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-50">Pagamento Confirmado!</h3>
              <p className="text-xs text-zinc-400 mt-1">
                O arquivo <strong className="text-zinc-200">"{file.title}"</strong> foi desbloqueado com sucesso.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Referência:</span>
                <span className="font-mono text-zinc-200 font-bold">{txRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Valor Pago:</span>
                <span className="font-bold text-amber-400">{file.priceMzn} MZN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Método:</span>
                <span className="uppercase text-zinc-200 font-semibold">{paymentMethod}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors"
            >
              Acessar Arquivo em "Meus Arquivos"
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-zinc-50 mb-1">Comprar Arquivo Acadêmico</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Pagamento digital rápido e seguro para Moçambique.
            </p>

            {errorMsg && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* File Info */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 mb-4 flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <p className="text-xs font-bold text-zinc-200 truncate">{file.title}</p>
                <p className="text-[11px] text-zinc-400">{file.category} • {file.fileSize}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-lg font-black text-amber-400">{file.priceMzn}</span>
                <span className="text-[10px] text-zinc-400 ml-1">MZN</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 mb-5">
              <label className="text-xs font-semibold text-zinc-300 block">
                Selecione o Método de Pagamento (Moçambique)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'mpesa'
                      ? 'bg-red-600/10 border-red-500 text-red-400 ring-1 ring-red-500/30'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-sm font-black text-red-500">M-Pesa</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Vodacom 84/85</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('emola')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'emola'
                      ? 'bg-orange-600/10 border-orange-500 text-orange-400 ring-1 ring-orange-500/30'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-sm font-black text-orange-500">e-Mola</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Movitel 86/87</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400 ring-1 ring-blue-500/30'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span className="text-[10px] text-zinc-500 font-normal">SIMO / Visa</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePay} className="space-y-4">
              {paymentMethod !== 'card' ? (
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Número de Telemóvel {paymentMethod === 'mpesa' ? '(Vodacom M-Pesa)' : '(Movitel e-Mola)'}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+258 84 123 4567"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Você receberá um aviso no ecrã para introduzir o seu PIN pessoal com segurança.
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      defaultValue="4000 1234 5678 9010"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none font-mono"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      defaultValue="12/28"
                      placeholder="MM/AA"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono"
                      required
                    />
                    <input
                      type="text"
                      defaultValue="789"
                      placeholder="CVV"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm transition-colors shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Pagar {file.priceMzn} MZN e Desbloquear
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
