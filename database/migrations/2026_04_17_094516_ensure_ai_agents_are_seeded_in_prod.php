<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\AiAgent;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('ai_agents')) {
            try {
                if (AiAgent::count() === 0) {
                    \Log::info('Production Data Sync: Seeding Starter AI Agents...');
                    
                    $starterAgents = [
                        ['name' => 'Code Assistant', 'domain' => 'Technology', 'category' => 'code_assistant', 'is_premium_only' => false],
                        ['name' => 'Content Writer', 'domain' => 'Creative', 'category' => 'content_writer', 'is_premium_only' => false],
                        ['name' => 'Business Analyst', 'domain' => 'Business', 'category' => 'business_analyst', 'is_premium_only' => false],
                        ['name' => 'Document Analyzer', 'domain' => 'Research', 'category' => 'document_qa', 'is_premium_only' => false],
                        ['name' => 'Grammar Editor', 'domain' => 'Language', 'category' => 'grammar_editor', 'is_premium_only' => false],
                    ];

                    foreach ($starterAgents as $agent) {
                        $id = DB::table('ai_agents')->insertGetId(array_merge($agent, [
                            'system_prompt' => 'You are an AI assistant specialized in ' . $agent['domain'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]));

                        DB::table('prompt_templates')->insert([
                            'agent_id' => $id,
                            'version' => 1,
                            'template_body' => 'You are an assistant.',
                            'field_schema' => json_encode(['fields' => []]),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            } catch (\Exception $e) {
                \Log::warning('Production Seed Warning: ' . $e->getMessage());
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse for data seeding migration
    }
};
