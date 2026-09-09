import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Search,
  Bookmark,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  ShieldCheck,
  CheckCheck,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    currentUser,
    currentRole,
    activeTab,
    setActiveTab,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    savedItems,
    setAuthModalOpen,
    setAuthModalMode,
    setIsGlobalSearchOpen,
    switchRoleDemo,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'tutors', label: 'Encontrar Explicador' },
    { id: 'courses', label: 'Cursos' },
    { id: 'library', label: 'Biblioteca' },
    { id: 'community', label: 'Conteúdos' },
    { id: 'questions', label: 'Comunidade' },
    { id: 'about', label: 'Sobre' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 bg-zinc-950/90 border-zinc-800/80 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          className="cursor-pointer flex items-center"
          onClick={() => {
            setActiveTab('home');
            setMobileMenuOpen(false);
          }}
          id="header-logo-btn"
        >
          <Logo size="md" showSlogan={false} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-zinc-800 text-amber-400 font-semibold shadow-inner'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Global Search Trigger */}
          <button
            id="global-search-btn"
            onClick={() => setIsGlobalSearchOpen(true)}
            title="Pesquisa global (Disciplinas, Explicadores, Arquivos)"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5 text-xs border border-zinc-800/80"
          >
            <Search className="w-4 h-4 text-zinc-300" />
            <span className="hidden md:inline text-zinc-400">Pesquisar...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-zinc-800 rounded text-zinc-400">
              ⌘K
            </kbd>
          </button>

          {/* Saved Items Link */}
          <button
            id="header-saved-btn"
            onClick={() => setActiveTab('saved')}
            title="Guardados (Favoritos)"
            className={`p-2 rounded-lg transition-colors relative ${
              activeTab === 'saved'
                ? 'bg-zinc-800 text-amber-400'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {savedItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center">
                {savedItems.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="header-notif-btn"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserDropdownOpen(false);
                setRoleSwitcherOpen(false);
              }}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors relative"
              title="Notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notification Popover Panel */}
            {notificationsOpen && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl border bg-zinc-900 border-zinc-800 text-zinc-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Notificações</span>
                    {unreadNotifications.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[11px] bg-red-500/20 text-red-400 font-medium">
                        {unreadNotifications.length} novas
                      </span>
                    )}
                  </div>
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Marcar lidas
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-6">Sem notificações no momento.</p>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.link) {
                            setActiveTab(notif.link);
                            setNotificationsOpen(false);
                          }
                        }}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors border ${
                          notif.isRead
                            ? 'bg-zinc-900/50 border-zinc-800/40 text-zinc-400'
                            : 'bg-zinc-800/80 border-amber-500/30 text-zinc-100 font-medium'
                        } hover:bg-zinc-800`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-amber-300">{notif.title}</span>
                          <span className="text-[10px] text-zinc-500">{notif.createdAt}</span>
                        </div>
                        <p className="line-clamp-2 leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-blue-400" />
            )}
          </button>

          {/* Role Switcher Demo Dropdown (Convenient for evaluators) */}
          <div className="relative hidden md:block">
            <button
              id="role-switcher-btn"
              onClick={() => {
                setRoleSwitcherOpen(!roleSwitcherOpen);
                setUserDropdownOpen(false);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
              title="Alternar perfil para teste (Aluno, Explicador, Administrador)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="capitalize font-medium">
                {currentRole === 'student' ? '🎓 Aluno' : currentRole === 'tutor' ? '👨‍🏫 Explicador' : currentRole === 'admin' ? '🛡️ Admin' : '👤 Visitante'}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {roleSwitcherOpen && (
              <div
                id="role-switcher-menu"
                className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border bg-zinc-900 border-zinc-800 text-zinc-200 p-2 z-50 text-xs space-y-1"
              >
                <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 border-b border-zinc-800 mb-1">
                  Alternar Papel (Modo Teste)
                </div>
                <button
                  onClick={() => {
                    switchRoleDemo('student');
                    setRoleSwitcherOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                    currentRole === 'student' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'hover:bg-zinc-800'
                  }`}
                >
                  <span>🎓 Aluno (Américo)</span>
                  {currentRole === 'student' && <span className="text-[10px]">Ativo</span>}
                </button>
                <button
                  onClick={() => {
                    switchRoleDemo('tutor');
                    setRoleSwitcherOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                    currentRole === 'tutor' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'hover:bg-zinc-800'
                  }`}
                >
                  <span>👨‍🏫 Explicador (Eng. Tomás)</span>
                  {currentRole === 'tutor' && <span className="text-[10px]">Ativo</span>}
                </button>
                <button
                  onClick={() => {
                    switchRoleDemo('admin');
                    setRoleSwitcherOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                    currentRole === 'admin' ? 'bg-red-500/20 text-red-400 font-semibold' : 'hover:bg-zinc-800'
                  }`}
                >
                  <span>🛡️ Administrador (ISPS)</span>
                  {currentRole === 'admin' && <span className="text-[10px]">Ativo</span>}
                </button>
                <button
                  onClick={() => {
                    switchRoleDemo('guest');
                    setRoleSwitcherOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-zinc-400 hover:bg-zinc-800`}
                >
                  <span>👤 Desconectar (Visitante)</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile / Auth Action */}
          {currentUser ? (
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setNotificationsOpen(false);
                  setRoleSwitcherOpen(false);
                }}
                className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-zinc-900 border border-zinc-800/80 transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-500/40"
                  referrerPolicy="no-referrer"
                />
                <span className="hidden sm:inline text-xs font-semibold max-w-[110px] truncate text-zinc-200">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {userDropdownOpen && (
                <div
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border bg-zinc-900 border-zinc-800 text-zinc-200 p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-3 py-2 border-b border-zinc-800">
                    <p className="font-semibold text-sm text-zinc-100">{currentUser.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-amber-400 font-medium capitalize">
                        {currentUser.role === 'student' ? 'Estudante' : currentUser.role === 'tutor' ? 'Explicador' : 'Administrador'}
                      </span>
                      {currentUser.isVerified && (
                        <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Verificado
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 flex items-center gap-2 text-zinc-200"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Meu Painel</span>
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 flex items-center gap-2 text-red-400 font-medium"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                      <span>Painel de Administração</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 flex items-center gap-2 text-zinc-200"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Mensagens e Conversas</span>
                  </button>

                  <div className="border-t border-zinc-800 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Terminar Sessão</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Entrar
              </button>
              <button
                id="header-signup-btn"
                onClick={() => {
                  setAuthModalMode('register-student');
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors shadow-sm"
              >
                Criar conta
              </button>
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden border-t border-zinc-800 bg-zinc-950 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-zinc-800 text-amber-400 font-semibold'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Modo Teste Rápido (Papel)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  switchRoleDemo('student');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium border ${
                  currentRole === 'student' ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-zinc-800 bg-zinc-900 text-zinc-300'
                }`}
              >
                🎓 Aluno
              </button>
              <button
                onClick={() => {
                  switchRoleDemo('tutor');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium border ${
                  currentRole === 'tutor' ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-zinc-800 bg-zinc-900 text-zinc-300'
                }`}
              >
                👨‍🏫 Explicador
              </button>
              <button
                onClick={() => {
                  switchRoleDemo('admin');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium border ${
                  currentRole === 'admin' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-zinc-800 bg-zinc-900 text-zinc-300'
                }`}
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
