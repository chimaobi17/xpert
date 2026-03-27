export const FALLBACK_KNOWLEDGE = [
  {
    keywords: "what,xpert,about,app,tool",
    question: "What is XPERT?",
    answer: "XPERT is an AI-powered platform that helps you generate optimized prompts for various tasks using specialized agents.",
    action_type: null,
    action_target: null,
    category: "getting_started",
    sort_order: 10
  },
  {
    keywords: "how,use,agent,prompt,start,create",
    question: "How do I use an AI agent?",
    answer: "Navigate to your Workspace, select an agent, fill in the customized fields, and click \"Generate Prompt\". You can then choose to use it, write your own, or edit it before sending.",
    action_type: "navigate",
    action_target: "/workspace",
    category: "getting_started",
    sort_order: 20
  },
  {
    keywords: "add,agent,workspace,discover,find,new",
    question: "How do I add agents to my workspace?",
    answer: "You can browse and add new agents directly from the Discovery page. Click the button below to go there!",
    action_type: "navigate",
    action_target: "/agents/discover",
    category: "agents",
    sort_order: 40
  },
  {
    keywords: "show,saved,prompts,library,history,past",
    question: "Show me my saved prompts",
    answer: "Opening your Prompt Library now.",
    action_type: "navigate",
    action_target: "/library",
    category: "prompts",
    sort_order: 70
  },
  {
    keywords: "upgrade,plan,standard,premium,pay,subscribe",
    question: "How do I upgrade my plan?",
    answer: "You can upgrade your plan at any time to unlock more tokens, larger file sizes, and premium agents.",
    action_type: "modal",
    action_target: "upgrade",
    category: "billing",
    sort_order: 100
  },
  {
    keywords: "change,theme,dark,light,mode,color,settings",
    question: "How do I change my theme?",
    answer: "You can toggle between Light, Dark, or System Sync mode in your Settings area.",
    action_type: "navigate",
    action_target: "/settings",
    category: "navigation",
    sort_order: 140
  }
];

/**
 * Pure function — no React, no side effects.
 * Matches user input against the knowledge base keywords.
 */
export function matchQuestion(userInput, knowledgeBase) {
  const inputWords = userInput.toLowerCase().split(/\s+/);

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    if (!entry.keywords) continue;
    
    const entryKeywords = entry.keywords.split(',').map(k => k.trim().toLowerCase());
    const score = inputWords.filter(word =>
      entryKeywords.some(keyword => keyword.includes(word) || word.includes(keyword))
    ).length;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // Require at least 1 keyword match
  if (bestScore >= 1 && bestMatch) {
    return {
      matched: true,
      answer: bestMatch.answer,
      action: bestMatch.action_type ? {
        type: bestMatch.action_type,
        target: bestMatch.action_target
      } : null
    };
  }

  // Fallback — no confident match
  return {
    matched: false,
    answer: "I'm not sure about that. Here are some things I can help with:",
    action: null,
    showQuickActions: true
  };
}
