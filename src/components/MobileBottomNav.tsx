import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, BookOpen, MessageSquare, User as UserIcon } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, setAuthModalOpen, setAuthModalMode, setIsGlobalSearchOpen } = useApp();

  const handleProfileClick = () => {
    if (currentUser) {
      setActiveTab('dashboard');
    } else {
      setAuthModalMode('login');
      setAuthModalOpen(true);
    }
  };

  return (
    <div
      id="mobile-bottom-navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 text-zinc-400 py-1.5 px-3"
    >
      <div className="grid grid-cols-5 items-center text-center">
        {/* Início */}
        <button
          id="mobile-nav-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'home' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Início</span>
        </button>

        {/* Pesquisa */}
        <button
          id="mobile-nav-search"
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Pesquisa</span>
        </button>

        {/* Biblioteca */}
        <button
          id="mobile-nav-library"
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'library' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Biblioteca</span>
        </button>

        {/* Mensagens */}
        <button
          id="mobile-nav-chat"
          onClick={() => {
            if (currentUser) {
              setActiveTab('chat');
            } else {
              setAuthModalMode('login');
              setAuthModalOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'chat' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Mensagens</span>
        </button>

        {/* Perfil */}
        <button
          id="mobile-nav-profile"
          onClick={handleProfileClick}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'dashboard' ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <UserIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Perfil</span>
        </button>
      </div>
    </div>
  );
};
