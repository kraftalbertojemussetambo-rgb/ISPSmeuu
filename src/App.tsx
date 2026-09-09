import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { TutorsView } from './components/TutorsView';
import { CoursesView } from './components/CoursesView';
import { LibraryView } from './components/LibraryView';
import { CommunityView } from './components/CommunityView';
import { ChatView } from './components/ChatView';
import { DashboardView } from './components/DashboardView';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthModal } from './components/AuthModal';
import { LessonModal } from './components/LessonModal';
import { LiveClassroomModal } from './components/LiveClassroomModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ProtectedLoginGate } from './components/ProtectedLoginGate';

const MainLayout: React.FC = () => {
  const { activeTab, currentUser } = useApp();

  // Protect the entire platform: require login to enter
  if (!currentUser) {
    return (
      <>
        <ProtectedLoginGate />
        <GlobalSearchModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Top Header */}
      <Header />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'home' && <Home />}
        {activeTab === 'tutors' && <TutorsView />}
        {activeTab === 'courses' && <CoursesView />}
        {activeTab === 'library' && <LibraryView />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'questions' && <CommunityView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'about' && <Home />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Mobile Bottom Navigation (Android / iPhone) */}
      <MobileBottomNav />

      {/* Global Modals */}
      <AuthModal />
      <LessonModal />
      <LiveClassroomModal />
      <GlobalSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

