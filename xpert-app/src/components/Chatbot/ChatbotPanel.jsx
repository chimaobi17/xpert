import React, { useEffect, useRef } from 'react';
import ChatbotContextHint from './ChatbotContextHint';
import ChatbotMessage from './ChatbotMessage';
import ChatbotInput from './ChatbotInput';
import ChatbotQuickActions from './ChatbotQuickActions';

function ChatbotPanel({ messages, showQuickActions, onSend, onClose }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showQuickActions]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">XPERT Assistant</h3>
            <p className="text-xs text-green-500 font-medium tracking-wide">● Online</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <ChatbotContextHint />

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-gray-900/30 backdrop-blur-sm">
        {messages.map((msg, index) => (
          <ChatbotMessage key={index} message={msg} />
        ))}
        
        {showQuickActions && (
          <div className="mt-4">
            <ChatbotQuickActions onSend={onSend} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatbotInput onSend={onSend} />
    </div>
  );
}

export default ChatbotPanel;
