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
          className="text-xs text-left bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-800/50 rounded-lg p-2 transition-colors duration-200"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default ChatbotQuickActions;
