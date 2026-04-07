import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatbotBubble from './ChatbotBubble';
import ChatbotPanel from './ChatbotPanel';
import { matchQuestion, FALLBACK_KNOWLEDGE } from './ChatbotMatcher';
import api from '../../lib/axios';

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const navigate = useNavigate();

  // Initialize Knowledge Base & Welcome Msg on first open
  useEffect(() => {
    if (isOpen && knowledgeBase.length === 0) {
      // Lazy load KB
      api.get('/chatbot/knowledge')
      .then(res => res.data)
      .then(data => {
        setKnowledgeBase(data.length > 0 ? data : FALLBACK_KNOWLEDGE);
      })
      .catch((err) => {
        console.error("Failed to load knowledge base", err);
        setKnowledgeBase(FALLBACK_KNOWLEDGE);
      });

      // Add welcome message
      if (messages.length === 0) {
        setMessages([
          { role: 'bot', content: "Hi! I'm your XPERT assistant. Ask me anything about the app or tell me where you'd like to go." }
        ]);
      }
      setUnreadCount(0);
    }
  }, [isOpen]);

  const toggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0);
  };

  const handleSend = (text) => {
    // 1. Add User Message
    const userMsg = { role: 'user', content: text };
    
    // 2. Match Bot Response
    const kb = knowledgeBase.length > 0 ? knowledgeBase : FALLBACK_KNOWLEDGE;
    const match = matchQuestion(text, kb);
    
    const botMsg = { 
      role: 'bot', 
      content: match.answer 
    };

    setShowQuickActions(match.showQuickActions || false);

    // 3. Handle Actions
    if (match.action) {
      if (match.action.type === 'navigate') {
        botMsg.action_pill = `🔗 Navigated to ${match.action.target}`;
        setTimeout(() => {
          navigate(match.action.target);
          if (window.innerWidth < 768) setIsOpen(false); // close panel on mobile after nav
        }, 600);
      } else if (match.action.type === 'modal') {
        botMsg.action_pill = `📋 Opened ${match.action.target} panel`;
        // Optionally dispatch custom event to open modals
        window.dispatchEvent(new CustomEvent('open-modal', { detail: match.action.target }));
      }
    }

    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  return (
    <>
      {/* Expanded Panel Details */}
      <div
        className={`fixed z-50 transition-all duration-300 transform origin-bottom-right shadow-2xl
          bottom-[90px] right-2 sm:right-6
          w-[calc(100%-1rem)] sm:w-[380px] h-[calc(100vh-160px)] sm:h-[500px]
          rounded-2xl
          ${isOpen
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-90 opacity-0 translate-y-10 pointer-events-none'
          }`}
      >
        <div className="w-full h-full bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-primary-500 overflow-hidden flex flex-col shadow-[0_0_50px_rgba(33,196,93,0.15)]">
          <ChatbotPanel 
            messages={messages} 
            showQuickActions={showQuickActions}
            onSend={handleSend}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </div>

      {/* Floating Action Button */}
      <ChatbotBubble isOpen={isOpen} toggle={toggle} unreadCount={unreadCount} />
    </>
  );
}

export default ChatbotWidget;
