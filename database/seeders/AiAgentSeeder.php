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
                        ],
                    ],
                ],
            ],
        ];

        foreach ($agents as $agentData) {
            $templateData = $agentData['template'];
            unset($agentData['template']);

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
