import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatbotWidget from '../Chatbot/ChatbotWidget';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-background selection:bg-primary-500/30 selection:text-primary-500 transition-colors duration-500">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Global Ambient Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none z-0 dark:opacity-50 opacity-20" />

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto bg-background relative z-10 scrollbar-hide">
          <div className="mx-auto max-w-7xl px-4 py-4 pb-20 sm:px-6 sm:py-6 sm:pb-24 lg:px-12 lg:py-12 lg:pb-24">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
