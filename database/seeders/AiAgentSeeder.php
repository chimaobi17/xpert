<?php

namespace Database\Seeders;

use App\Models\AiAgent;
use App\Models\PromptTemplate;
use Illuminate\Database\Seeder;

class AiAgentSeeder extends Seeder
{
    public function run(): void
    {
        $agents = [
            [
                'name' => 'Code Assistant',
                'domain' => 'Technology',
                'category' => 'code_assistant',
                'system_prompt' => 'You are an expert software developer. You write clean, well-documented, production-ready code. You follow best practices for the requested programming language and provide clear explanations of your approach.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "You are an expert {{language}} developer.\n\nTask: {{task_description}}\nComplexity Level: {{complexity}}\n{{#if framework}}Preferred Framework/Library: {{framework}}{{/if}}\n\nInstructions:\n- Write clean, well-commented code.\n- Follow {{language}} best practices and conventions.\n- Include error handling where appropriate.\n- Explain your approach briefly before the code.\n\nOutput Format:\n1. Brief explanation of approach\n2. Complete, runnable code\n3. Usage example",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'language', 'type' => 'select', 'label' => 'Programming Language', 'options' => ['Python', 'JavaScript', 'PHP', 'Go', 'Rust', 'Java', 'C#', 'Other'], 'required' => true],
                            ['name' => 'task_description', 'type' => 'textarea', 'label' => 'Describe your task', 'required' => true],
                            ['name' => 'complexity', 'type' => 'select', 'label' => 'Complexity', 'options' => ['Beginner', 'Intermediate', 'Advanced'], 'required' => true],
                            ['name' => 'framework', 'type' => 'text', 'label' => 'Framework/Library (optional)', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Content Writer',
                'domain' => 'Creative',
                'category' => 'content_writer',
                'system_prompt' => 'You are a professional content writer and copywriter. You craft compelling, engaging, and well-structured content tailored to the specified audience and tone. You understand SEO principles and persuasive writing techniques.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Write a {{tone}} piece about: {{topic}}\n\nTarget Word Count: {{word_count}}\n{{#if audience}}Target Audience: {{audience}}{{/if}}\n{{#if key_points}}Key Points to Cover:\n{{key_points}}{{/if}}\n\nInstructions:\n- Match the requested tone precisely.\n- Structure with clear headings and paragraphs.\n- Make the content engaging and informative.\n- Stay within the target word count (±10%).",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'topic', 'type' => 'text', 'label' => 'Topic', 'required' => true],
                            ['name' => 'tone', 'type' => 'select', 'label' => 'Tone', 'options' => ['Formal', 'Casual', 'Academic', 'Persuasive', 'Technical'], 'required' => true],
                            ['name' => 'word_count', 'type' => 'number', 'label' => 'Target Word Count', 'required' => true],
                            ['name' => 'audience', 'type' => 'text', 'label' => 'Target Audience', 'required' => false],
                            ['name' => 'key_points', 'type' => 'textarea', 'label' => 'Key Points to Cover', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Business Analyst',
                'domain' => 'Business',
                'category' => 'business_analyst',
                'system_prompt' => 'You are a senior business analyst with expertise in strategy, market analysis, and organizational development. You provide data-driven insights and structured frameworks for business decisions.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Perform a {{analysis_type}} for: {{subject}}\n\nIndustry: {{industry}}\n{{#if context}}Additional Context:\n{{context}}{{/if}}\n\nInstructions:\n- Use established business frameworks.\n- Provide actionable recommendations.\n- Support conclusions with reasoning.\n- Structure the output clearly with sections.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'subject', 'type' => 'text', 'label' => 'Business/Product to Analyze', 'required' => true],
                            ['name' => 'analysis_type', 'type' => 'select', 'label' => 'Analysis Type', 'options' => ['SWOT Analysis', 'Market Analysis', 'Competitive Analysis', 'Business Plan Review', 'Strategy Recommendation'], 'required' => true],
                            ['name' => 'industry', 'type' => 'text', 'label' => 'Industry', 'required' => true],
                            ['name' => 'context', 'type' => 'textarea', 'label' => 'Additional Context', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Document Analyzer',
                'domain' => 'Research',
                'category' => 'document_qa',
                'system_prompt' => 'You are an expert document analyst. You carefully read uploaded documents and extract precisely what the user asks for — whether that is a summary, key points, action items, or answers to specific questions. You cite relevant sections when possible.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Analyze the attached document.\n\nExtraction Type: {{extraction_type}}\n{{#if specific_questions}}Specific Questions:\n{{specific_questions}}{{/if}}\n\nInstructions:\n- Be thorough and accurate.\n- Cite or reference relevant sections of the document.\n- Structure your response clearly.\n- If the document does not contain the requested information, say so explicitly.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload Document', 'accept' => '.pdf,.docx,.txt,.xlsx', 'max_size_mb' => 200, 'required' => true],
                            ['name' => 'extraction_type', 'type' => 'select', 'label' => 'What to Extract', 'options' => ['Summary', 'Key Points', 'Action Items', 'Specific Questions'], 'required' => true],
                            ['name' => 'specific_questions', 'type' => 'textarea', 'label' => 'Your Questions (if applicable)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Translation Agent',
                'domain' => 'Language',
                'category' => 'translation',
                'system_prompt' => 'You are an expert multilingual translator. You provide accurate, natural-sounding translations that preserve the meaning, tone, and context of the original text. You understand the nuances of formal vs. informal registers and domain-specific terminology.',
                'is_premium_only' => true,
                'template' => [
                    'template_body' => "Translate the following from {{source_language}} to {{target_language}}.\n\nContext: {{context}}\n\n{{#if text_input}}Text:\n{{text_input}}{{/if}}\n\nInstructions:\n- Preserve the original meaning and tone.\n- Use natural phrasing in the target language.\n- Adapt idioms and cultural references appropriately.\n- If any part is ambiguous, note it and provide the most likely translation.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'source_language', 'type' => 'select', 'label' => 'Source Language', 'options' => ['English', 'French', 'Spanish', 'German', 'Chinese', 'Arabic', 'Auto-detect'], 'required' => true],
                            ['name' => 'target_language', 'type' => 'select', 'label' => 'Target Language', 'options' => ['English', 'French', 'Spanish', 'German', 'Chinese', 'Arabic'], 'required' => true],
                            ['name' => 'context', 'type' => 'select', 'label' => 'Context', 'options' => ['Technical', 'Casual', 'Legal', 'Medical', 'Literary'], 'required' => true],
                            ['name' => 'text_input', 'type' => 'textarea', 'label' => 'Text to Translate', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Or Upload File', 'accept' => '.pdf,.docx,.txt', 'max_size_mb' => 50, 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'UX Researcher',
                'domain' => 'Technology',
                'category' => 'ux_research',
                'system_prompt' => 'You are a senior UX researcher with deep expertise in usability testing, user interviews, and research methodology. You create well-structured research scripts and provide actionable insights based on established UX principles.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Create a {{research_type}} for: {{product}}\n\nTarget Users: {{target_users}}\n{{#if goals}}Research Goals:\n{{goals}}{{/if}}\n\nInstructions:\n- Follow UX research best practices.\n- Include clear methodology.\n- Provide actionable questions or tasks.\n- Structure output for easy use by the research team.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'product', 'type' => 'text', 'label' => 'Product/Feature Name', 'required' => true],
                            ['name' => 'research_type', 'type' => 'select', 'label' => 'Research Type', 'options' => ['Usability Test Script', 'User Interview Guide', 'Survey Questions', 'Heuristic Evaluation', 'Persona Development'], 'required' => true],
                            ['name' => 'target_users', 'type' => 'text', 'label' => 'Target User Group', 'required' => true],
                            ['name' => 'goals', 'type' => 'textarea', 'label' => 'Research Goals', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Sentiment Analyzer',
                'domain' => 'Research',
                'category' => 'sentiment_analysis',
                'system_prompt' => 'You are an expert in sentiment analysis and natural language processing. You classify text tone, identify emotional patterns, and provide actionable insights about audience perception.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Analyze the sentiment of the following text:\n\n{{text_input}}\n\nAnalysis Type: {{analysis_depth}}\n\nInstructions:\n- Classify overall sentiment (Positive, Negative, Neutral, Mixed).\n- Identify key emotional tones.\n- Highlight specific phrases that drive the sentiment.\n- Provide a confidence score for your assessment.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'text_input', 'type' => 'textarea', 'label' => 'Text to Analyze', 'required' => true],
                            ['name' => 'analysis_depth', 'type' => 'select', 'label' => 'Analysis Depth', 'options' => ['Quick Overview', 'Detailed Breakdown', 'Comparative Analysis'], 'required' => true],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Graphics Design Advisor',
                'domain' => 'Creative',
                'category' => 'graphic_designer',
                'system_prompt' => 'You are an experienced graphic design consultant. You provide expert advice on typography, color theory, layout composition, and visual branding. You communicate design concepts clearly and provide actionable creative direction.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Provide design advice for: {{project_description}}\n\nDesign Type: {{design_type}}\nStyle Preference: {{style}}\n{{#if brand_colors}}Brand Colors: {{brand_colors}}{{/if}}\n\nInstructions:\n- Suggest typography, color palettes, and layout principles.\n- Reference design best practices.\n- Provide specific, actionable creative direction.\n- Consider the target audience and medium.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'project_description', 'type' => 'textarea', 'label' => 'Describe Your Project', 'required' => true],
                            ['name' => 'design_type', 'type' => 'select', 'label' => 'Design Type', 'options' => ['Logo', 'Website', 'Social Media', 'Print Material', 'Presentation', 'Packaging'], 'required' => true],
                            ['name' => 'style', 'type' => 'select', 'label' => 'Style Preference', 'options' => ['Minimalist', 'Bold', 'Elegant', 'Playful', 'Corporate', 'Vintage'], 'required' => true],
                            ['name' => 'brand_colors', 'type' => 'text', 'label' => 'Brand Colors (optional)', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Interior Designer',
                'domain' => 'Creative',
                'category' => 'interior_designer',
                'system_prompt' => 'You are a professional interior designer specializing in room design and spatial planning. You generate detailed visual descriptions that can be used for image generation.',
                'is_premium_only' => true,
                'template' => [
                    'template_body' => "Design a {{room_type}} interior.\n\nStyle: {{style}}\nColor Palette: {{color_palette}}\nBudget Range: {{budget}}\n{{#if special_requirements}}Special Requirements:\n{{special_requirements}}{{/if}}\n\nGenerate a detailed visual description suitable for image generation.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'room_type', 'type' => 'select', 'label' => 'Room Type', 'options' => ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Dining Room'], 'required' => true],
                            ['name' => 'style', 'type' => 'select', 'label' => 'Design Style', 'options' => ['Modern', 'Minimalist', 'Industrial', 'Scandinavian', 'Bohemian', 'Traditional'], 'required' => true],
                            ['name' => 'color_palette', 'type' => 'text', 'label' => 'Color Palette', 'required' => true],
                            ['name' => 'budget', 'type' => 'select', 'label' => 'Budget Range', 'options' => ['Budget', 'Mid-Range', 'Luxury'], 'required' => true],
                            ['name' => 'special_requirements', 'type' => 'textarea', 'label' => 'Special Requirements', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Logo Creator',
                'domain' => 'Creative',
                'category' => 'logo_creator',
                'system_prompt' => 'You are a brand identity expert specializing in logo design. You create detailed logo concepts with descriptions suitable for image generation or direct client use.',
                'is_premium_only' => true,
                'template' => [
                    'template_body' => "Create a logo concept for: {{brand_name}}\n\nIndustry: {{industry}}\nStyle: {{logo_style}}\n{{#if tagline}}Tagline: {{tagline}}{{/if}}\n{{#if preferences}}Preferences:\n{{preferences}}{{/if}}\n\nGenerate a detailed visual description suitable for logo generation.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'brand_name', 'type' => 'text', 'label' => 'Brand Name', 'required' => true],
                            ['name' => 'industry', 'type' => 'text', 'label' => 'Industry', 'required' => true],
                            ['name' => 'logo_style', 'type' => 'select', 'label' => 'Logo Style', 'options' => ['Wordmark', 'Lettermark', 'Icon/Symbol', 'Combination', 'Emblem', 'Abstract'], 'required' => true],
                            ['name' => 'tagline', 'type' => 'text', 'label' => 'Tagline (optional)', 'required' => false],
                            ['name' => 'preferences', 'type' => 'textarea', 'label' => 'Design Preferences', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            // ---- Phase 18: New agents below ----
            [
                'name' => 'Email Composer',
                'domain' => 'Business',
                'category' => 'email_writer',
                'system_prompt' => 'You are a professional email communication specialist. You craft clear, effective emails for any business context — from cold outreach to internal memos. You match the appropriate tone and structure for the situation.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Write a {{email_type}} email.\n\nSubject/Purpose: {{purpose}}\nRecipient: {{recipient}}\nTone: {{tone}}\n{{#if context}}Additional Context:\n{{context}}{{/if}}\n\nInstructions:\n- Include a compelling subject line.\n- Keep the email concise and actionable.\n- Match the tone to the recipient and context.\n- End with a clear call to action.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'email_type', 'type' => 'select', 'label' => 'Email Type', 'options' => ['Cold Outreach', 'Follow-up', 'Internal Memo', 'Client Update', 'Negotiation', 'Apology', 'Thank You'], 'required' => true],
                            ['name' => 'purpose', 'type' => 'text', 'label' => 'Purpose / Subject', 'required' => true],
                            ['name' => 'recipient', 'type' => 'text', 'label' => 'Who is the recipient?', 'required' => true],
                            ['name' => 'tone', 'type' => 'select', 'label' => 'Tone', 'options' => ['Formal', 'Friendly', 'Urgent', 'Diplomatic'], 'required' => true],
                            ['name' => 'context', 'type' => 'textarea', 'label' => 'Additional Context', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Resume Builder',
                'domain' => 'Business',
                'category' => 'resume_builder',
                'system_prompt' => 'You are a professional career coach and resume writer. You craft ATS-friendly resumes that highlight relevant experience, quantify achievements, and align with the target role. You understand modern resume formatting and keyword optimization.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Create a professional resume section.\n\nTarget Role: {{target_role}}\nYears of Experience: {{experience_years}}\nKey Skills: {{key_skills}}\n{{#if achievements}}Notable Achievements:\n{{achievements}}{{/if}}\n\nInstructions:\n- Use action verbs and quantify achievements.\n- Tailor content to the target role.\n- Follow ATS-friendly formatting.\n- Keep bullet points concise and impactful.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'target_role', 'type' => 'text', 'label' => 'Target Job Title', 'required' => true],
                            ['name' => 'experience_years', 'type' => 'select', 'label' => 'Years of Experience', 'options' => ['0-1 years', '2-5 years', '5-10 years', '10+ years'], 'required' => true],
                            ['name' => 'key_skills', 'type' => 'textarea', 'label' => 'Key Skills (comma-separated)', 'required' => true],
                            ['name' => 'achievements', 'type' => 'textarea', 'label' => 'Notable Achievements', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Social Media Strategist',
                'domain' => 'Creative',
                'category' => 'social_media',
                'system_prompt' => 'You are an expert social media strategist and content creator. You understand platform-specific best practices for engagement, hashtags, posting times, and content formats across major social platforms.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Create a {{content_type}} for {{platform}}.\n\nTopic: {{topic}}\nGoal: {{goal}}\n{{#if brand_voice}}Brand Voice: {{brand_voice}}{{/if}}\n\nInstructions:\n- Optimize for the specific platform's format and best practices.\n- Include relevant hashtags where applicable.\n- Make the content engaging and shareable.\n- Include a call to action aligned with the goal.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'platform', 'type' => 'select', 'label' => 'Platform', 'options' => ['Twitter/X', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'YouTube'], 'required' => true],
                            ['name' => 'content_type', 'type' => 'select', 'label' => 'Content Type', 'options' => ['Single Post', 'Thread/Carousel', 'Caption', 'Content Calendar (1 week)', 'Bio/About'], 'required' => true],
                            ['name' => 'topic', 'type' => 'text', 'label' => 'Topic or Product', 'required' => true],
                            ['name' => 'goal', 'type' => 'select', 'label' => 'Goal', 'options' => ['Brand Awareness', 'Engagement', 'Lead Generation', 'Education', 'Entertainment'], 'required' => true],
                            ['name' => 'brand_voice', 'type' => 'text', 'label' => 'Brand Voice (optional)', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Academic Writer',
                'domain' => 'Research',
                'category' => 'academic_writer',
                'system_prompt' => 'You are an experienced academic writer and researcher. You produce well-structured academic content following proper citation standards and scholarly conventions. You maintain objectivity and support claims with evidence.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Write a {{document_type}} on: {{topic}}\n\nAcademic Level: {{level}}\nCitation Style: {{citation_style}}\n{{#if thesis}}Thesis Statement:\n{{thesis}}{{/if}}\n\nInstructions:\n- Follow academic writing conventions.\n- Structure with proper sections (intro, body, conclusion).\n- Use formal, objective tone.\n- Include placeholder citations in the requested format.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'topic', 'type' => 'text', 'label' => 'Research Topic', 'required' => true],
                            ['name' => 'document_type', 'type' => 'select', 'label' => 'Document Type', 'options' => ['Essay', 'Literature Review', 'Abstract', 'Research Proposal', 'Thesis Outline'], 'required' => true],
                            ['name' => 'level', 'type' => 'select', 'label' => 'Academic Level', 'options' => ['Undergraduate', 'Graduate', 'Doctoral', 'Professional'], 'required' => true],
                            ['name' => 'citation_style', 'type' => 'select', 'label' => 'Citation Style', 'options' => ['APA 7th', 'MLA 9th', 'Chicago', 'Harvard', 'IEEE'], 'required' => true],
                            ['name' => 'thesis', 'type' => 'textarea', 'label' => 'Thesis Statement (optional)', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Legal Document Assistant',
                'domain' => 'Business',
                'category' => 'legal_assistant',
                'system_prompt' => 'You are a legal document assistant. You help draft, review, and explain common legal documents and clauses. You use clear, precise language and flag potential issues. Note: You provide templates and guidance, not legal advice.',
                'is_premium_only' => true,
                'template' => [
                    'template_body' => "{{action}} a {{document_type}}.\n\nParties Involved: {{parties}}\n{{#if jurisdiction}}Jurisdiction: {{jurisdiction}}{{/if}}\n{{#if special_clauses}}Special Clauses/Requirements:\n{{special_clauses}}{{/if}}\n\nInstructions:\n- Use clear, precise legal language.\n- Include standard protective clauses.\n- Flag areas that may need attorney review.\n- Add disclaimer that this is a template, not legal advice.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'action', 'type' => 'select', 'label' => 'Action', 'options' => ['Draft', 'Review & Summarize', 'Explain in Plain English'], 'required' => true],
                            ['name' => 'document_type', 'type' => 'select', 'label' => 'Document Type', 'options' => ['NDA', 'Service Agreement', 'Employment Contract', 'Terms of Service', 'Privacy Policy', 'Freelance Contract'], 'required' => true],
                            ['name' => 'parties', 'type' => 'text', 'label' => 'Parties Involved', 'required' => true],
                            ['name' => 'jurisdiction', 'type' => 'text', 'label' => 'Jurisdiction (optional)', 'required' => false],
                            ['name' => 'special_clauses', 'type' => 'textarea', 'label' => 'Special Requirements', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Data Analyst',
                'domain' => 'Technology',
                'category' => 'data_analyst',
                'system_prompt' => 'You are a senior data analyst skilled in statistical analysis, data visualization, and deriving insights from datasets. You write clean SQL queries, suggest appropriate charts, and explain data findings in plain language.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "{{task_type}} for the following data/scenario:\n\n{{description}}\n\nPreferred Tool: {{tool}}\n{{#if columns}}Data Columns:\n{{columns}}{{/if}}\n\nInstructions:\n- Provide clear, well-commented code or queries.\n- Suggest the best visualization type for the data.\n- Explain findings in plain language.\n- Note any assumptions or data quality concerns.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'task_type', 'type' => 'select', 'label' => 'Task Type', 'options' => ['Write SQL Query', 'Data Cleaning Script', 'Statistical Analysis', 'Dashboard Design', 'Data Interpretation'], 'required' => true],
                            ['name' => 'description', 'type' => 'textarea', 'label' => 'Describe Your Data/Goal', 'required' => true],
                            ['name' => 'tool', 'type' => 'select', 'label' => 'Preferred Tool', 'options' => ['SQL', 'Python (Pandas)', 'Excel', 'R', 'No Preference'], 'required' => true],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload Data (CSV, Excel, JSON, etc.)', 'accept' => '.csv,.xlsx,.json,.txt', 'max_size_mb' => 200, 'required' => false],
                            ['name' => 'columns', 'type' => 'textarea', 'label' => 'Data Columns (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Grammar & Style Editor',
                'domain' => 'Language',
                'category' => 'grammar_editor',
                'system_prompt' => 'You are a meticulous editor specializing in grammar, style, and clarity. You review text for grammatical errors, awkward phrasing, and readability issues while preserving the author\'s voice. You explain your corrections clearly.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Review and {{edit_mode}} the following text:\n\n{{text_input}}\n\nWriting Style: {{style}}\n\nInstructions:\n- Identify and correct grammatical errors.\n- Improve clarity and readability.\n- Preserve the author's voice and intent.\n- Explain significant changes made.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'text_input', 'type' => 'textarea', 'label' => 'Text to Edit', 'required' => true],
                            ['name' => 'edit_mode', 'type' => 'select', 'label' => 'Editing Mode', 'options' => ['Light Edit (grammar only)', 'Standard Edit (grammar + clarity)', 'Heavy Edit (full rewrite for clarity)'], 'required' => true],
                            ['name' => 'style', 'type' => 'select', 'label' => 'Target Style', 'options' => ['Formal', 'Conversational', 'Academic', 'Business', 'Creative'], 'required' => true],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Meeting Notes Summarizer',
                'domain' => 'Business',
                'category' => 'meeting_summarizer',
                'system_prompt' => 'You are an expert at processing meeting notes, transcripts, and recordings into structured, actionable summaries. You extract key decisions, action items with owners, and follow-up deadlines.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Summarize the following meeting notes.\n\nOutput Format: {{output_format}}\n\n{{#if text_input}}Meeting Notes:\n{{text_input}}{{/if}}\n\nInstructions:\n- Extract key decisions made.\n- List action items with assigned owners.\n- Note deadlines and follow-up dates.\n- Highlight unresolved issues or open questions.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'text_input', 'type' => 'textarea', 'label' => 'Paste Meeting Notes or Transcript', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Or Upload Notes File', 'accept' => '.pdf,.docx,.txt', 'max_size_mb' => 50, 'required' => false],
                            ['name' => 'output_format', 'type' => 'select', 'label' => 'Output Format', 'options' => ['Executive Summary', 'Action Items Only', 'Full Summary + Action Items', 'Email-ready Recap'], 'required' => true],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Creative Story Writer',
                'domain' => 'Creative',
                'category' => 'story_writer',
                'system_prompt' => 'You are a talented creative fiction writer with a gift for vivid storytelling, compelling characters, and engaging narratives. You adapt your style to match any genre and can write everything from flash fiction to novel outlines.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Write a {{format}} in the {{genre}} genre.\n\nPremise: {{premise}}\n{{#if characters}}Characters:\n{{characters}}{{/if}}\n{{#if tone}}Tone: {{tone}}{{/if}}\n\nInstructions:\n- Create vivid, engaging prose.\n- Develop compelling characters.\n- Build tension and maintain pacing.\n- Match the genre conventions.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'genre', 'type' => 'select', 'label' => 'Genre', 'options' => ['Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Horror', 'Literary Fiction', 'Adventure'], 'required' => true],
                            ['name' => 'format', 'type' => 'select', 'label' => 'Format', 'options' => ['Flash Fiction (under 500 words)', 'Short Story (1000-2000 words)', 'Story Outline', 'Character Profile', 'World Building'], 'required' => true],
                            ['name' => 'premise', 'type' => 'textarea', 'label' => 'Story Premise', 'required' => true],
                            ['name' => 'characters', 'type' => 'textarea', 'label' => 'Characters (optional)', 'required' => false],
                            ['name' => 'tone', 'type' => 'select', 'label' => 'Tone', 'options' => ['Dark', 'Humorous', 'Hopeful', 'Suspenseful', 'Whimsical'], 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'API Documentation Writer',
                'domain' => 'Technology',
                'category' => 'api_docs',
                'system_prompt' => 'You are a technical documentation specialist focused on API documentation. You write clear, developer-friendly docs with proper endpoint descriptions, request/response examples, error codes, and authentication details.',
                'is_premium_only' => true,
                'template' => [
                    'template_body' => "Generate {{doc_type}} for:\n\n{{api_description}}\n\nFormat: {{format}}\n{{#if auth_method}}Authentication: {{auth_method}}{{/if}}\n\nInstructions:\n- Use clear, concise technical language.\n- Include request/response examples with realistic data.\n- Document error codes and edge cases.\n- Follow industry-standard API documentation conventions.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'api_description', 'type' => 'textarea', 'label' => 'Describe Your API/Endpoints', 'required' => true],
                            ['name' => 'doc_type', 'type' => 'select', 'label' => 'Documentation Type', 'options' => ['Full API Reference', 'Single Endpoint Docs', 'Quick Start Guide', 'Error Code Reference', 'Authentication Guide'], 'required' => true],
                            ['name' => 'format', 'type' => 'select', 'label' => 'Output Format', 'options' => ['Markdown', 'OpenAPI/Swagger YAML', 'Plain Text'], 'required' => true],
                            ['name' => 'auth_method', 'type' => 'select', 'label' => 'Auth Method', 'options' => ['Bearer Token', 'API Key', 'OAuth 2.0', 'Session/Cookie', 'None'], 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Pitch Deck Advisor',
                'domain' => 'Business',
                'category' => 'pitch_deck',
                'system_prompt' => 'You are a startup advisor specializing in pitch decks and investor presentations. You understand what VCs and angel investors look for and can help structure compelling narratives around business ideas, market opportunities, and financial projections.',
                'is_premium_only' => true,
                'template' => [
                    'template_body' => "Create {{deliverable}} for: {{startup_name}}\n\nIndustry: {{industry}}\nStage: {{stage}}\n{{#if description}}Business Description:\n{{description}}{{/if}}\n\nInstructions:\n- Follow proven pitch deck frameworks.\n- Focus on the problem, solution, market size, and traction.\n- Use persuasive, concise language.\n- Include suggestions for supporting visuals on each slide.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'startup_name', 'type' => 'text', 'label' => 'Startup / Company Name', 'required' => true],
                            ['name' => 'industry', 'type' => 'text', 'label' => 'Industry', 'required' => true],
                            ['name' => 'stage', 'type' => 'select', 'label' => 'Company Stage', 'options' => ['Idea Stage', 'Pre-Seed', 'Seed', 'Series A', 'Growth'], 'required' => true],
                            ['name' => 'deliverable', 'type' => 'select', 'label' => 'Deliverable', 'options' => ['Full Pitch Deck Outline (12 slides)', 'Executive Summary', 'Elevator Pitch Script', 'Investor FAQ Prep'], 'required' => true],
                            ['name' => 'description', 'type' => 'textarea', 'label' => 'Business Description', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Language Tutor',
                'domain' => 'Language',
                'category' => 'language_tutor',
                'system_prompt' => 'You are a patient, encouraging language tutor. You create exercises, explain grammar rules, provide vocabulary lists, and simulate conversations in the target language. You adapt to the learner\'s level and provide corrections with clear explanations.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Create a {{lesson_type}} lesson in {{language}}.\n\nDifficulty: {{difficulty}}\n{{#if focus_area}}Focus Area: {{focus_area}}{{/if}}\n\nInstructions:\n- Adapt content to the specified difficulty level.\n- Include examples with translations.\n- Provide exercises for practice.\n- Add pronunciation tips where relevant.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'language', 'type' => 'select', 'label' => 'Language to Learn', 'options' => ['French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Japanese', 'Korean', 'Mandarin', 'Arabic'], 'required' => true],
                            ['name' => 'lesson_type', 'type' => 'select', 'label' => 'Lesson Type', 'options' => ['Grammar Lesson', 'Vocabulary Builder', 'Conversation Practice', 'Reading Comprehension', 'Writing Exercise'], 'required' => true],
                            ['name' => 'difficulty', 'type' => 'select', 'label' => 'Difficulty', 'options' => ['Beginner (A1-A2)', 'Intermediate (B1-B2)', 'Advanced (C1-C2)'], 'required' => true],
                            ['name' => 'focus_area', 'type' => 'text', 'label' => 'Focus Area (optional)', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload a file (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Tone Transformer',
                'domain' => 'Language',
                'category' => 'tone_transformer',
                'system_prompt' => 'You are an expert writing tone specialist. You take any text and transform it to match a specific tone — formal, casual, persuasive, friendly, academic, or professional. You preserve the original meaning while completely changing the voice and style. You handle documents, emails, messages, and any written content.',
                'is_premium_only' => false,
                'template' => [
                    'template_body' => "Transform the following text to a {{target_tone}} tone.\n\n{{#if context}}Context: {{context}}{{/if}}\n\nOriginal Text:\n{{original_text}}\n\nInstructions:\n- Preserve the core meaning and all key information.\n- Completely shift the tone to {{target_tone}}.\n- Adjust vocabulary, sentence structure, and phrasing to match the target tone.\n- If the text contains technical terms, keep them but adjust surrounding language.\n- Output the transformed text only, no explanations unless asked.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'original_text', 'type' => 'textarea', 'label' => 'Paste your text here', 'required' => true],
                            ['name' => 'target_tone', 'type' => 'select', 'label' => 'Target Tone', 'options' => ['Formal / Professional', 'Casual / Friendly', 'Persuasive / Sales', 'Academic / Scholarly', 'Empathetic / Supportive', 'Concise / Executive Summary'], 'required' => true],
                            ['name' => 'context', 'type' => 'text', 'label' => 'Context (optional — e.g., "email to a client")', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Or upload a document', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Graphics Design Assistant',
                'domain' => 'Creative',
                'category' => 'graphics_designer',
                'system_prompt' => 'You are a professional graphics design AI. You generate high-quality images from detailed text descriptions. You understand design principles including composition, color theory, typography concepts, and visual hierarchy. You create logos, social media graphics, illustrations, banners, and marketing visuals.',
                'is_premium_only' => true,
                'template' => [
                    'template_body' => "Create a {{design_type}} with the following details:\n\nDescription: {{description}}\nStyle: {{style}}\n{{#if color_palette}}Color Palette: {{color_palette}}{{/if}}\n{{#if dimensions}}Dimensions: {{dimensions}}{{/if}}\n\nDesign it professionally with clean composition and visual appeal.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'design_type', 'type' => 'select', 'label' => 'Design Type', 'options' => ['Social Media Post', 'Banner / Header', 'Logo Concept', 'Illustration', 'Poster', 'Infographic Layout', 'Product Mockup'], 'required' => true],
                            ['name' => 'description', 'type' => 'textarea', 'label' => 'Describe what you want', 'required' => true],
                            ['name' => 'style', 'type' => 'select', 'label' => 'Visual Style', 'options' => ['Minimalist', 'Bold & Vibrant', 'Corporate / Clean', 'Vintage / Retro', 'Futuristic', 'Hand-Drawn / Sketch', 'Flat Design'], 'required' => true],
                            ['name' => 'color_palette', 'type' => 'text', 'label' => 'Color Palette (optional — e.g., "blue and gold")', 'required' => false],
                            ['name' => 'dimensions', 'type' => 'select', 'label' => 'Dimensions', 'options' => ['Square (1:1)', 'Landscape (16:9)', 'Portrait (9:16)', 'Wide Banner (3:1)'], 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload reference image (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'AI Photographer',
                'domain' => 'Creative',
                'category' => 'photography',
                'system_prompt' => 'You are an expert AI photographer. You generate stunning, photorealistic images from text descriptions. You understand photography concepts including composition, lighting, depth of field, focal length, color grading, and mood. You produce images that look like they were captured by a professional camera.',
                'is_premium_only' => true,
                'template' => [
                    'template_body' => "Generate a photorealistic image of: {{subject}}\n\nPhotography Style: {{style}}\nMood / Lighting: {{mood}}\n{{#if aspect_ratio}}Aspect Ratio: {{aspect_ratio}}{{/if}}\n{{#if extra_details}}Additional Details: {{extra_details}}{{/if}}\n\nMake it look like a real photograph taken with a professional camera. Use natural lighting and realistic textures.",
                    'field_schema' => [
                        'fields' => [
                            ['name' => 'subject', 'type' => 'textarea', 'label' => 'Describe the scene or subject', 'required' => true],
                            ['name' => 'style', 'type' => 'select', 'label' => 'Photography Style', 'options' => ['Portrait', 'Landscape', 'Street Photography', 'Product / Commercial', 'Food Photography', 'Architecture', 'Wildlife / Nature', 'Fashion', 'Macro / Close-Up', 'Aerial / Drone'], 'required' => true],
                            ['name' => 'mood', 'type' => 'select', 'label' => 'Mood & Lighting', 'options' => ['Golden Hour / Warm', 'Cool / Blue Hour', 'Dramatic / High Contrast', 'Soft / Diffused', 'Moody / Dark', 'Bright / Airy', 'Studio Lighting', 'Natural Daylight', 'Neon / Night'], 'required' => true],
                            ['name' => 'aspect_ratio', 'type' => 'select', 'label' => 'Aspect Ratio', 'options' => ['Square (1:1)', 'Landscape (16:9)', 'Portrait (9:16)', 'Classic (4:3)', 'Cinematic (21:9)'], 'required' => false],
                            ['name' => 'extra_details', 'type' => 'textarea', 'label' => 'Extra details (optional — camera angle, lens, colors, etc.)', 'required' => false],
                            ['name' => 'file', 'type' => 'file', 'label' => 'Upload reference photo (optional)', 'required' => false],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($agents as $agentData) {
            $templateData = $agentData['template'];
            unset($agentData['template']);

            // Ensure strict boolean for PostgreSQL
            $agentData['is_premium_only'] = (bool) ($agentData['is_premium_only'] ?? false);

            $agent = AiAgent::updateOrCreate(
                ['name' => $agentData['name']],
                $agentData
            );

            PromptTemplate::updateOrCreate(
                ['agent_id' => $agent->id, 'version' => 1],
                [
                    'template_body' => $templateData['template_body'],
                    'field_schema' => json_encode($templateData['field_schema']),
                ]
            );
        }
    }
}
