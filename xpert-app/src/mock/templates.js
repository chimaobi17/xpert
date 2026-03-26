export const templates = {
  1: {
    id: 1,
    agent_id: 1,
    template_body:
      'Write {{task_description}} in {{language}}{{#if framework}} using the {{framework}} framework{{/if}}. The complexity level should be {{complexity}}.',
    field_schema: [
      { name: 'language', label: 'Programming Language', type: 'select', options: ['JavaScript', 'Python', 'PHP', 'Go', 'Rust', 'TypeScript', 'Java', 'C#'], required: true },
      { name: 'task_description', label: 'Task Description', type: 'textarea', placeholder: 'Describe what you want the code to do...', required: true },
      { name: 'complexity', label: 'Complexity Level', type: 'select', options: ['Simple', 'Intermediate', 'Advanced', 'Expert'], required: true },
      { name: 'framework', label: 'Framework (optional)', type: 'text', placeholder: 'e.g., React, Laravel, Django', required: false },
    ],
    version: 1,
  },
  2: {
    id: 2,
    agent_id: 2,
    template_body:
      'Write a {{tone}} article about {{topic}} targeting {{audience}}. Aim for approximately {{word_count}} words.{{#if key_points}} Key points to cover: {{key_points}}{{/if}}',
    field_schema: [
      { name: 'topic', label: 'Topic', type: 'text', placeholder: 'What should the article be about?', required: true },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Academic', 'Persuasive', 'Informative', 'Humorous'], required: true },
      { name: 'word_count', label: 'Word Count', type: 'select', options: ['300', '500', '800', '1200', '2000'], required: true },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g., developers, marketers, students', required: true },
      { name: 'key_points', label: 'Key Points (optional)', type: 'textarea', placeholder: 'List the main points to cover...', required: false },
    ],
    version: 1,
  },
  3: {
    id: 3,
    agent_id: 3,
    template_body:
      'Perform a {{analysis_type}} analysis on {{subject}} in the {{industry}} industry.{{#if context}} Additional context: {{context}}{{/if}}',
    field_schema: [
      { name: 'subject', label: 'Subject', type: 'text', placeholder: 'What should be analyzed?', required: true },
      { name: 'analysis_type', label: 'Analysis Type', type: 'select', options: ['SWOT', 'Market Research', 'Competitive Analysis', 'Financial Overview', 'Risk Assessment'], required: true },
      { name: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g., FinTech, Healthcare, E-commerce', required: true },
      { name: 'context', label: 'Additional Context (optional)', type: 'textarea', placeholder: 'Provide any relevant background...', required: false },
    ],
    version: 1,
  },
  4: {
    id: 4,
    agent_id: 4,
    template_body:
      'Analyze the uploaded document. Extraction type: {{extraction_type}}.{{#if specific_questions}} Specific questions: {{specific_questions}}{{/if}}',
    field_schema: [
      { name: 'file', label: 'Upload Document', type: 'file', accept: '.pdf,.docx,.txt,.csv', required: true },
      { name: 'extraction_type', label: 'Extraction Type', type: 'select', options: ['Summary', 'Key Points', 'Q&A', 'Data Extraction', 'Sentiment Analysis'], required: true },
      { name: 'specific_questions', label: 'Specific Questions (optional)', type: 'textarea', placeholder: 'What questions do you want answered?', required: false },
    ],
    version: 1,
  },
  5: {
    id: 5,
    agent_id: 5,
    template_body:
      'Translate the following from {{source_language}} to {{target_language}}.{{#if context}} Context: {{context}}{{/if}}\n\nText: {{text_input}}',
    field_schema: [
      { name: 'source_language', label: 'Source Language', type: 'select', options: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Portuguese'], required: true },
      { name: 'target_language', label: 'Target Language', type: 'select', options: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Portuguese'], required: true },
      { name: 'text_input', label: 'Text to Translate', type: 'textarea', placeholder: 'Enter text to translate...', required: true },
      { name: 'context', label: 'Context (optional)', type: 'text', placeholder: 'e.g., legal, medical, casual conversation', required: false },
    ],
    version: 1,
  },
};

export function getTemplateByAgentId(agentId) {
  return templates[agentId] || null;
}
