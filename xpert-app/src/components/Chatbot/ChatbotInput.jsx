import React, { useState } from 'react';

function ChatbotInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 bg-white dark:bg-black border-t border-gray-100 dark:border-white/5 rounded-b-2xl">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask me anything..."
        className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-primary-500 placeholder-gray-400 dark:placeholder-zinc-500 outline-none shadow-sm"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="flex-shrink-0 bg-transparent dark:bg-black border border-primary-500 text-primary-500 dark:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2 h-9 w-9 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </form>
  );
}

export default ChatbotInput;
