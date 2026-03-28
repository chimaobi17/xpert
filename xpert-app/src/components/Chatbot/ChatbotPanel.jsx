import React, { useEffect, useRef } from 'react';
import { CpuChipIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
            <CpuChipIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">XPERT Assistant</h3>
            <p className="text-xs text-green-500 font-medium tracking-wide">● Online</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <XMarkIcon className="h-5 w-5" />
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
