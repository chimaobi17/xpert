import React from 'react';

function ChatbotBubble({ isOpen, toggle, unreadCount }) {
  return (
    <button
      onClick={toggle}
      className={`fixed z-[60] rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 border ${isOpen
        ? 'bg-white dark:bg-black !text-primary-500 border-gray-200 dark:border-primary-500'
        : 'bg-primary-100 dark:bg-black hover:bg-primary-200 dark:hover:bg-primary-900/10 !text-primary-600 dark:!text-primary-500 border-primary-500'
        }`}
      style={{
        bottom: '24px',
        right: '24px',
        width: '56px', // Slightly larger for clarity
        height: '56px'
      }}
      aria-label="Toggle Help Chatbot"
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <React.Fragment>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
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
