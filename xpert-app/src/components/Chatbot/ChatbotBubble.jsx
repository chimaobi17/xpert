import React from 'react';

function ChatbotBubble({ isOpen, toggle, unreadCount }) {
  return (
    <button
      onClick={toggle}
      className={`fixed z-50 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        isOpen
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
          : 'bg-primary-600 hover:bg-primary-700 text-white'
      }`}
      style={{
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px'
      }}
      aria-label="Toggle Help Chatbot"
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <React.Fragment>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
          </svg>
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm">
              {unreadCount}
            </span>
          )}
        </React.Fragment>
      )}
    </button>
  );
}

export default ChatbotBubble;
