import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatbotWidget from '../Chatbot/ChatbotWidget';
import { AppGuideProvider, useAppGuide } from '../../contexts/AppGuideContext';
import AppGuide from '../ui/AppGuide';

export default function AppLayout() {
  return (
    <AppGuideProvider>
      <AppLayoutContent />
    </AppGuideProvider>
  );
}

function AppLayoutContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasSeenGuide, startGuide } = useAppGuide();

  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Auto-start guide only for new signups
  useEffect(() => {
    const isNewSignup = sessionStorage.getItem('xpert_just_registered');
    if (isNewSignup === 'true') {
      startGuide();
      sessionStorage.removeItem('xpert_just_registered');
    }
  }, [startGuide]);

  return (
    <div className="flex h-screen flex-col bg-background selection:bg-primary-500/30 selection:text-primary-500 transition-colors duration-500">
      <AppGuide />
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Global Ambient Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none z-0 dark:opacity-50 opacity-20" />

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className={clsx(
          'flex-1 bg-background relative z-10 scrollbar-hide',
          sidebarOpen ? 'overflow-hidden' : 'overflow-y-auto'
        )}>
          <div className="mx-auto max-w-7xl px-4 py-4 pb-20 sm:px-6 sm:py-6 sm:pb-24 lg:px-12 lg:py-12 lg:pb-24">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
