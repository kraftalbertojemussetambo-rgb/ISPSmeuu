import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, Phone, User, BookOpen, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    registerStudent,
    registerTutor
  } = useApp();

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [mainSubject, setMainSubject] = useState('Engenharia Elétrica');

  // UI status
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!authModalOpen) return null;

  const resetForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIdentifier('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setForgotPasswordOpen(false);
    setForgotSent(false);
  };

  const handleClose = () => {
    resetForm();
    setAuthModalOpen(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Por favor preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(identifier, password);
      if (res.success) {
        setSuccessMsg('Sessão iniciada com sucesso!');
        setTimeout(() => {
          handleClose();
        }, 600);
      } else {
        setErrorMsg(res.message || 'Credenciais inválidas. Tente novamente ou use o alternador de papéis no cabeçalho.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStudentRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !identifier.trim() || !password.trim()) {
      setErrorMsg('Preencha todos os campos obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerStudent({
        name,
        emailOrPhone: identifier,
        password
      });
      if (res.success) {
        setSuccessMsg('Conta criada com sucesso! Bem-vindo ao ISPS Dark.');
        setTimeout(() => {
          handleClose();
        }, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTutorRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !identifier.trim() || !password.trim() || !mainSubject.trim()) {
      setErrorMsg('Preencha todos os campos obrigatórios.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerTutor({
        name,
        emailOrPhone: identifier,
        password,
        mainSubject
      });
      if (res.success) {
        setSuccessMsg('Conta de explicador criada! O seu perfil passará pelo processo de verificação pelo administrador.');
        setTimeout(() => {
          handleClose();
        }, 1200);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;
    setForgotSent(true);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 relative text-zinc-100 animate-in zoom-in-95 duration-150"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Forgot password subview */}
        {forgotPasswordOpen ? (
          <div>
            <h3 className="text-xl font-bold text-zinc-50 mb-1">Recuperar Senha</h3>
            <p className="text-xs text-zinc-400 mb-5">
              Digite o seu email ou número de telefone de Moçambique registado (+258) para receber as instruções de recuperação.
            </p>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Instruções Enviadas!
                </div>
                <p>
                  Enviamos um SMS com código de segurança e instruções para <strong>{forgotIdentifier}</strong>.
                </p>
                <button
                  onClick={() => setForgotPasswordOpen(false)}
                  className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded-lg transition-colors text-xs"
                >
                  Voltar ao Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Email ou Telefone</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={e => setForgotIdentifier(e.target.value)}
                      placeholder="ex: americo@isps.ac.mz ou +258 84 123 4567"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors"
                >
                  Enviar Código de Recuperação
                </button>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="w-full text-center text-xs text-zinc-400 hover:text-white"
                >
                  Cancelar e voltar
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            {/* Header Tabs / Toggle */}
            <div className="flex items-center gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800/80 mb-6">
              <button
                id="tab-login"
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthModalMode('login');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  authModalMode === 'login'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Entrar
              </button>
              <button
                id="tab-student-register"
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthModalMode('register-student');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  authModalMode === 'register-student'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Criar Conta
              </button>
              <button
                id="tab-tutor-register"
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthModalMode('register-tutor');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  authModalMode === 'register-tutor'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Quero ser explicador
              </button>
            </div>

            {/* Error and Success Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form Mode: LOGIN */}
            {authModalMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Email ou Número de Telefone
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      id="login-identifier-input"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="ex: americo.machava@isps.ac.mz ou +258 84 123 4567"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-zinc-300">Senha</label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      id="login-password-input"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  {loading ? 'A autenticar...' : 'Entrar na Plataforma'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 text-center text-xs text-zinc-400">
                  <span>Ainda não tem conta? </span>
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('register-student')}
                    className="text-amber-400 font-semibold hover:underline"
                  >
                    Criar conta agora
                  </button>
                </div>
              </form>
            )}

            {/* Form Mode: STUDENT REGISTER (Req 3: Extremamente simples, poucos campos) */}
            {authModalMode === 'register-student' && (
              <form onSubmit={handleStudentRegisterSubmit} className="space-y-3.5">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                  Passo 1 rápido: crie a sua conta agora e complete o perfil acadêmico posteriormente.
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Nome completo</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      id="student-name-input"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="ex: Américo Machava"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Email ou número de telefone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      id="student-identifier-input"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="ex: americo@isps.ac.mz ou +258 84 000 0000"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Senha</label>
                    <input
                      id="student-password-input"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mín. 6 caracteres"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Confirmar senha</label>
                    <input
                      id="student-confirmpassword-input"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  id="student-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-md mt-2"
                >
                  {loading ? 'A processar...' : 'Criar minha conta'}
                </button>
              </form>
            )}

            {/* Form Mode: TUTOR REGISTER (Req 4: Quero ser explicador) */}
            {authModalMode === 'register-tutor' && (
              <form onSubmit={handleTutorRegisterSubmit} className="space-y-3.5">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
                  Junte-se à rede de explicadores do ISPS Dark e compartilhe conhecimentos com estudantes de Moçambique.
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Nome completo</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      id="tutor-name-input"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="ex: Eng. Tomás Chivambo"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Email / Telefone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      id="tutor-identifier-input"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="ex: tomas@isps.ac.mz ou +258 82 987 6543"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Disciplina Principal</label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <select
                      id="tutor-subject-select"
                      value={mainSubject}
                      onChange={e => setMainSubject(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Engenharia Elétrica">Engenharia Elétrica & Potência</option>
                      <option value="Matemática">Matemática / Cálculo I e II</option>
                      <option value="Física">Física Aplicada & Mecânica</option>
                      <option value="Eletrónica">Eletrónica Digital & Analógica</option>
                      <option value="Programação">Programação (C, Python, Web)</option>
                      <option value="Contabilidade">Contabilidade & Finanças</option>
                      <option value="Engenharia Mecânica">Engenharia Mecânica</option>
                      <option value="Química">Química Geral e Aplicada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      id="tutor-password-input"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mín. 6 caracteres"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  id="tutor-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-md mt-2"
                >
                  {loading ? 'A registar...' : 'Concluir Cadastro de Explicador'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
