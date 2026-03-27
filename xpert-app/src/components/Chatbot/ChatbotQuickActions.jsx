import React from 'react';

const QUICKS = [
  "How do I get started?",
  "Browse agents",
  "My saved prompts",
  "Upgrade my plan",
  "What are tokens?",
  "Open settings"
];

function ChatbotQuickActions({ onSend }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-2 mb-2">
      {QUICKS.map((label) => (
        <button
          key={label}
          onClick={() => onSend(label)}
          className="text-xs text-left bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 rounded-lg p-2 transition-colors duration-200"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default ChatbotQuickActions;
