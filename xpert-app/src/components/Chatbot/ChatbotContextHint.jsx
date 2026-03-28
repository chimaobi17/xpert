import React from 'react';
import { useLocation } from 'react-router-dom';

function ChatbotContextHint() {
  const location = useLocation();
  const path = location.pathname;

  let hint = "";

  if (path === '/dashboard') {
    hint = "Try selecting an agent to get started, or browse the marketplace!";
  } else if (path === '/workspace') {
    hint = "Click any agent card to start the prompt flow.";
  } else if (path.startsWith('/agents/discover')) {
    hint = "Find agents for your field. Free agents can be added instantly!";
  } else if (path.startsWith('/agents/')) {
    hint = "Fill in the form fields and click Generate Prompt to see the magic.";
  } else if (path.startsWith('/library')) {
    hint = "Search your saved prompts or filter by agent type.";
  } else if (path.startsWith('/settings')) {
    hint = "Manage your profile, theme, and subscription here.";
  } else {
    hint = "Ask me anything or tell me where you'd like to go!";
  }

  return (
    <div className="bg-primary-50/80 dark:bg-primary-900/40 border-b border-primary-100 dark:border-primary-800/50 p-3 text-xs text-primary-800 dark:text-primary-200 text-center animate-fade-in">
      <span className="font-medium">💡 Tip:</span> {hint}
    </div>
  );
}

export default ChatbotContextHint;
