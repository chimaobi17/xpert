<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\AiAgent;
use Database\Seeders\AiAgentSeeder;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if the ai_agents table is empty and seed it if so
        if (Schema::hasTable('ai_agents')) {
            if (AiAgent::count() === 0) {
                \Log::info('Production Data Sync: Seeding AI Agents...');
                $seeder = new AiAgentSeeder();
                $seeder->run();
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
