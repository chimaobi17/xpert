import React from 'react';
import ReactMarkdown from 'react-markdown';

function ChatbotMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mt-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm border ${
          isUser 
            ? 'bg-primary-600 dark:bg-black text-white dark:text-primary-500 border-transparent dark:border-primary-500 rounded-br-none' 
            : 'bg-white dark:bg-black text-gray-800 dark:text-primary-500 border-gray-200 dark:border-primary-500 rounded-bl-none shadow-sm'
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none chatbot-markdown overflow-x-auto break-words !text-primary-500">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {message.action_pill && (
          <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full border border-green-200 dark:border-green-800/50">
            {message.action_pill}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatbotMessage;
