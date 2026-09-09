import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Zap,
  BookOpen,
  Phone,
  ShieldAlert
} from 'lucide-react';

export const ProtectedLoginGate: React.FC = () => {
  const { login, registerStudent, registerTutor, switchRoleDemo, courses } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registerRole, setRegisterRole] = useState<'student' | 'tutor'>('student');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.name || 'Engenharia Elétrica e de Potência');
  const [mainSubject, setMainSubject] = useState('Engenharia Elétrica');
  const [hourlyRate, setHourlyRate] = useState(400);
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Por favor preencha o seu email/telefone e a palavra-passe.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(identifier, password);
      if (res.success) {
        setSuccessMsg('Sessão autenticada com sucesso! Entrando...');
      } else {
        setErrorMsg(res.message || 'Credenciais inválidas. Verifique os dados ou use o acesso de teste.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !identifier.trim() || !password.trim()) {
      setErrorMsg('Preencha todos os campos obrigatórios para criar sua conta.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('As palavras-passe não coincidem.');
      return;
    }

    setLoading(true);
    try {
      if (registerRole === 'student') {
        const res = await registerStudent({
          name: name.trim(),
          emailOrPhone: identifier.trim(),
          password,
          course: selectedCourse
        });
        if (res.success) {
          setSuccessMsg('Conta de estudante criada com sucesso! Acedendo...');
        }
      } else {
        const res = await registerTutor({
          name: name.trim(),
          emailOrPhone: identifier.trim(),
          password,
          mainSubject: mainSubject.trim() || selectedCourse,
          course: selectedCourse
        });
        if (res.success) {
          setSuccessMsg('Conta de explicador criada com sucesso! Acedendo...');
        }
      }
    } catch {
      setErrorMsg('Erro ao cadastrar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'student' | 'tutor' | 'admin') => {
    setErrorMsg('');
    setSuccessMsg('Entrando com credenciais de demonstração...');
    setTimeout(() => {
      switchRoleDemo(role);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-amber-500 selection:text-zinc-950 font-sans overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-zinc-800/30 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Col: Platform Branding & Security Presentation */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold text-amber-400 tracking-wide uppercase text-[10px]">ISPS Dark</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 font-medium">Instituto Superior Politécnico de Songo</span>
          </div>

          <div className="space-y-3">
            <Logo size="lg" showSlogan={true} />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-50 leading-tight">
              Acesso Restrito à Comunidade Acadêmica
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Para garantir a segurança, integridade dos materiais e acompanhamento pedagógico, é obrigatório efetuar login para aceder às aulas, explicadores, biblioteca e cursos oficiais.
            </p>
          </div>

          {/* Pillars List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">Cursos Superiores Oficiais do ISPS</h4>
                <p className="text-[11px] text-zinc-400">
                  Engenharias Elétrica, Hidráulica, Mecânica, Informática e Contabilidade com planos curriculares homologados.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">Explicadores e Docentes Verificados</h4>
                <p className="text-[11px] text-zinc-400">
                  Aulas particulares online e presenciais com selo de verificação de identidade e competência acadêmica.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200">Salas Virtuais com Quadro Interativo</h4>
                <p className="text-[11px] text-zinc-400">
                  Videoconferência, quadro digital em tempo real e biblioteca protegida com pagamentos M-Pesa e e-Mola.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials for Fast Evaluation */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Acesso de Teste Imediato (1 Clique)
              </span>
              <span className="text-[10px] text-zinc-400">Demonstração sem senha</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Experimente a plataforma com os diferentes perfis do sistema:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                id="demo-login-student-btn"
                onClick={() => handleQuickDemo('student')}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 hover:text-amber-400 transition-all text-left border border-zinc-700/60 flex flex-col"
              >
                <span className="text-[11px] font-bold text-zinc-200">🎓 Estudante</span>
                <span className="text-[9px] text-zinc-400 truncate">Américo (Eng. Elétrica)</span>
              </button>

              <button
                type="button"
                id="demo-login-tutor-btn"
                onClick={() => handleQuickDemo('tutor')}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 hover:text-amber-400 transition-all text-left border border-zinc-700/60 flex flex-col"
              >
                <span className="text-[11px] font-bold text-zinc-200">⚡ Explicador</span>
                <span className="text-[9px] text-zinc-400 truncate">Eng. Tomás (Verificado)</span>
              </button>

              <button
                type="button"
                id="demo-login-admin-btn"
                onClick={() => handleQuickDemo('admin')}
                className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-all text-left border border-amber-500/40 flex flex-col"
              >
                <span className="text-[11px] font-bold text-amber-300">🛡️ Administrador</span>
                <span className="text-[9px] text-amber-400/80 truncate">Gestão de Cursos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Protected Auth Card */}
        <div className="lg:col-span-6">
          <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Security Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Portal de Autenticação Segura
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                <ShieldCheck className="w-3 h-3" />
                SSL 256-bit
              </span>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex p-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold">
              <button
                type="button"
                id="tab-login-btn"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-lg transition-all text-center ${
                  mode === 'login'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Entrar na Conta
              </button>
              <button
                type="button"
                id="tab-register-btn"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 rounded-lg transition-all text-center ${
                  mode === 'register'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Criar Nova Conta
              </button>
            </div>

            {/* Error & Success Alerts */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form: LOGIN MODE */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    Email Institucional ou Número de Telefone
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="login-identifier-input"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="ex: americo.machava@isps.ac.mz ou +258 84..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Dica: use "admin" para painel administrativo ou seu email cadastrado.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300">
                      Palavra-passe
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password-input"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Digite a sua palavra-passe"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-login-gate-btn"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Aceder à Plataforma ISPS</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Form: REGISTER MODE */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Role Switch */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegisterRole('student')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      registerRole === 'student'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Sou Estudante
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterRole('tutor')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                      registerRole === 'tutor'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Quero ser Explicador
                  </button>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 block">Nome Completo</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="ex: Mateus Alberto Nhavene"
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 block">Email ou Telefone (M-Pesa)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="email@isps.ac.mz ou +258 84..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Course Selection (Loaded from Admin-managed courses!) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300 block">
                    {registerRole === 'student' ? 'Curso Matriculado no ISPS' : 'Curso de Formação / Departamento'}
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.code} - {c.name} ({c.degree})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tutor specific: Subject & Hourly Rate */}
                {registerRole === 'tutor' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300 block">Disciplina Principal</label>
                      <input
                        type="text"
                        value={mainSubject}
                        onChange={e => setMainSubject(e.target.value)}
                        placeholder="ex: Cálculo I, Eletrotecnia"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300 block">Tarifa por Hora (MZN)</label>
                      <input
                        type="number"
                        min="100"
                        step="50"
                        value={hourlyRate}
                        onChange={e => setHourlyRate(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}

                {/* Passwords */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300 block">Palavra-passe</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mínimo 6 dígitos"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300 block">Confirmar</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-register-gate-btn"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Criar Conta e Aceder</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Institutional footer disclaimer */}
            <div className="pt-2 text-center text-[10px] text-zinc-500 border-t border-zinc-800/80">
              Instituto Superior Politécnico de Songo • Cahora Bassa, Tete, Moçambique.
              <br />
              Dúvidas ou suporte? Contacte a administração acadêmica.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
