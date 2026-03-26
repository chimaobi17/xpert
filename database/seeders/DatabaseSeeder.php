<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@xpert.test',
        ]);

        // Create test user (free plan)
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'user@xpert.test',
        ]);

        // Seed AI agents with their prompt templates
        $this->call(AiAgentSeeder::class);
    }
}
