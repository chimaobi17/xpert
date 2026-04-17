<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ChatbotKnowledge;

class ChatbotKnowledgeSeeder extends Seeder
{
    public function run(): void
    {
        $entries = [
            // Getting Started
            [
                'question' => 'What is XPERT?',
                'keywords' => 'what,xpert,about,app,tool',
                'answer' => 'XPERT is an AI-powered platform that helps you generate optimized prompts for various tasks using specialized agents.',
                'action_type' => null,
                'action_target' => null,
                'category' => 'getting_started',
                'sort_order' => 10,
            ],
            [
                'question' => 'How do I use an AI agent?',
                'keywords' => 'how,use,agent,prompt,start,create',
                'answer' => 'Navigate to your Workspace, select an agent, fill in the customized fields, and click "Generate Prompt". You can then choose to use it, write your own, or edit it before sending.',
                'action_type' => 'navigate',
                'action_target' => '/workspace',
                'category' => 'getting_started',
                'sort_order' => 20,
            ],
            [
                'question' => 'Help me get started',
                'keywords' => 'help,start,begin,first',
                'answer' => 'Welcome! The best way to begin is by browsing the available AI agents and adding ones that fit your field to your workspace.',
                'action_type' => 'navigate',
                'action_target' => '/agents/discover',
                'category' => 'getting_started',
                'sort_order' => 30,
            ],
            // Agents & Prompts
            [
                'question' => 'How do I add agents to my workspace?',
                'keywords' => 'add,agent,workspace,discover,find,new',
                'answer' => 'You can browse and add new agents directly from the Discovery page. Click the button below to go there!',
                'action_type' => 'navigate',
                'action_target' => '/agents/discover',
                'category' => 'agents',
                'sort_order' => 40,
            ],
            [
                'question' => 'I want to try an agent',
                'keywords' => 'try,test,use,agent',
                'answer' => 'Great! Let\'s go find an agent for you.',
                'action_type' => 'navigate',
                'action_target' => '/agents/discover',
                'category' => 'agents',
                'sort_order' => 50,
            ],
            [
                'question' => 'What is the prompt library?',
                'keywords' => 'what,library,save,prompt,history',
                'answer' => 'The Prompt Library is where all your saved prompts and AI responses are stored for later access. You can view them anytime.',
                'action_type' => 'navigate',
                'action_target' => '/library',
                'category' => 'prompts',
                'sort_order' => 60,
            ],
            [
                'question' => 'Show me my saved prompts',
                'keywords' => 'show,saved,prompts,library,history,past',
                'answer' => 'Opening your Prompt Library now.',
                'action_type' => 'navigate',
                'action_target' => '/library',
                'category' => 'prompts',
                'sort_order' => 70,
            ],
            [
                'question' => 'What file types can I upload?',
                'keywords' => 'file,type,upload,support,format,pdf,image',
                'answer' => 'You can upload PDF, DOCX, XLSX, PNG, and JPG files. The maximum size depends on your active plan tier.',
                'action_type' => null,
                'action_target' => null,
                'category' => 'prompts',
                'sort_order' => 80,
            ],
            // Billing & Plans
            [
                'question' => 'What are tokens?',
                'keywords' => 'what,token,quota,usage,limit,budget',
                'answer' => 'Tokens are the unit of measure for AI requests. Each plan has a daily token budget. Generating text or analyzing files consumes tokens from your daily balance.',
                'action_type' => null,
                'action_target' => null,
                'category' => 'billing',
                'sort_order' => 90,
            ],
            [
                'question' => 'How do I upgrade my plan?',
                'keywords' => 'upgrade,plan,standard,premium,pay,subscribe',
                'answer' => 'You can upgrade your plan at any time to unlock more tokens, larger file sizes, and premium agents.',
                'action_type' => 'navigate',
                'action_target' => '/settings?tab=plan',
                'category' => 'billing',
                'sort_order' => 100,
            ],
            [
                'question' => 'I want to upgrade',
                'keywords' => 'want,buy,upgrade,premium,standard,pay',
                'answer' => 'Let\'s take a look at the plans available.',
                'action_type' => 'navigate',
                'action_target' => '/settings?tab=plan',
                'category' => 'billing',
                'sort_order' => 110,
            ],
            [
                'question' => 'What\'s the difference between Free and Premium?',
                'keywords' => 'difference,free,premium,compare,plan,tier',
                'answer' => 'The Free plan includes 50 daily requests and standard agents. Premium unlocks priority models, image Generation agents, and unlimited daily usage. Click upgrade to see full details.',
                'action_type' => 'navigate',
                'action_target' => '/settings?tab=plan',
                'category' => 'billing',
                'sort_order' => 120,
            ],
            // Navigation
            [
                'question' => 'Take me to my workspace',
                'keywords' => 'take,go,workspace,dashboard,home',
                'answer' => 'Navigating to your workspace...',
                'action_type' => 'navigate',
                'action_target' => '/workspace',
                'category' => 'navigation',
                'sort_order' => 130,
            ],
            [
                'question' => 'How do I change my theme?',
                'keywords' => 'change,theme,dark,light,mode,color',
                'answer' => 'You can toggle between Light, Dark, or System Sync mode in your Settings area.',
                'action_type' => 'navigate',
                'action_target' => '/settings',
                'category' => 'navigation',
                'sort_order' => 140,
            ],
            [
                'question' => 'Open settings',
                'keywords' => 'open,setting,account,profile,preference',
                'answer' => 'Opening your account settings.',
                'action_type' => 'navigate',
                'action_target' => '/settings',
                'category' => 'navigation',
                'sort_order' => 150,
            ],
        ];

        foreach ($entries as $item) {
            ChatbotKnowledge::updateOrCreate(
                ['question' => $item['question']],
                $item
            );
        }
    }
}
