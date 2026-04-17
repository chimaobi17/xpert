<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
use App\Models\AiAgent;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if the ai_agents table is empty and seed it if so
        if (Schema::hasTable('ai_agents')) {
            try {
                if (AiAgent::count() === 0) {
                    \Log::info('Production Data Sync: Seeding AI Agents via Artisan...');
                    Artisan::call('db:seed', [
                        '--class' => 'AiAgentSeeder',
                        '--force' => true
                    ]);
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
