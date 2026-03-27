export const agents = [
  {
    id: 1,
    name: 'Code Assistant',
    domain: 'Technology',
    category: 'code_assistant',
    system_prompt: 'You are an expert software engineer...',
    is_premium_only: false,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    description: 'Generate clean, production-ready code in any language. Debug issues, refactor patterns, and get architectural advice.',
    icon: 'CodeBracketIcon',
  },
  {
    id: 2,
    name: 'Content Writer',
    domain: 'Creative',
    category: 'content_writer',
    system_prompt: 'You are a professional content writer...',
    is_premium_only: false,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    description: 'Craft compelling articles, marketing copy, emails, and social media content tailored to your audience.',
    icon: 'PencilSquareIcon',
  },
  {
    id: 3,
    name: 'Business Analyst',
    domain: 'Business',
    category: 'business_analyst',
    system_prompt: 'You are a senior business analyst...',
    is_premium_only: false,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    description: 'Perform SWOT analysis, market research, strategy planning, and business case development.',
    icon: 'ChartBarIcon',
  },
  {
    id: 4,
    name: 'Document Analyzer',
    domain: 'Research',
    category: 'document_qa',
    system_prompt: 'You are a document analysis specialist...',
    is_premium_only: false,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    description: 'Upload documents and extract summaries, key points, action items, or get specific questions answered.',
    icon: 'DocumentMagnifyingGlassIcon',
  },
  {
    id: 5,
    name: 'Translation Agent',
    domain: 'Language',
    category: 'translation',
    system_prompt: 'You are a professional translator...',
    is_premium_only: true,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    description: 'Translate text and documents between languages with context-aware accuracy for technical, legal, and literary content.',
    icon: 'LanguageIcon',
  },
  {
    id: 6,
    name: 'UX Research Assistant',
    domain: 'Technology',
    category: 'ux_research',
    system_prompt: 'You are an experienced UX researcher...',
    is_premium_only: false,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-03-10T00:00:00Z',
    description: 'Create usability test scripts, user interview guides, persona templates, and UX audit reports.',
    icon: 'UserGroupIcon',
  },
  {
    id: 7,
    name: 'Graphics Design Advisor',
    domain: 'Creative',
    category: 'graphics_design_advisor',
    system_prompt: 'You are a senior graphic design consultant...',
    is_premium_only: false,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-03-10T00:00:00Z',
    description: 'Get expert advice on typography, color theory, layout composition, and brand identity design.',
    icon: 'SwatchIcon',
  },
  {
    id: 8,
    name: 'Interior Designer',
    domain: 'Creative',
    category: 'interior_designer',
    system_prompt: 'You are a professional interior designer...',
    is_premium_only: true,
    created_at: '2026-02-15T00:00:00Z',
    updated_at: '2026-03-15T00:00:00Z',
    description: 'Generate room design concepts and interior layouts with AI-powered image generation.',
    icon: 'HomeModernIcon',
  },
  {
    id: 9,
    name: 'Sentiment Analyzer',
    domain: 'Research',
    category: 'sentiment_analysis',
    system_prompt: 'You are a sentiment analysis specialist...',
    is_premium_only: false,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-03-10T00:00:00Z',
    description: 'Analyze the tone and sentiment of text, reviews, social media posts, and customer feedback.',
    icon: 'FaceSmileIcon',
  },
  {
    id: 10,
    name: 'Logo Creator',
    domain: 'Creative',
    category: 'logo_creator',
    system_prompt: 'You are a branding and logo design expert...',
    is_premium_only: true,
    created_at: '2026-02-15T00:00:00Z',
    updated_at: '2026-03-15T00:00:00Z',
    description: 'Create unique logo concepts and branding marks using AI image generation.',
    icon: 'SparklesIcon',
  },
];

export const domains = ['All', 'Technology', 'Creative', 'Business', 'Research', 'Language'];

export function getAgentById(id) {
  return agents.find((a) => a.id === Number(id));
}

export function getAgentsByDomain(domain) {
  if (!domain || domain === 'All') return agents;
  return agents.filter((a) => a.domain === domain);
}

export function searchAgents(query, domain, tier) {
  let filtered = [...agents];
  if (domain && domain !== 'All') {
    filtered = filtered.filter((a) => a.domain === domain);
  }
  if (tier === 'Free Only') {
    filtered = filtered.filter((a) => !a.is_premium_only);
  } else if (tier === 'Premium Only') {
    filtered = filtered.filter((a) => a.is_premium_only);
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );
  }
  return filtered;
}
