<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => env('SUPER_ADMIN_EMAIL', 'admin@xpert.test')],
            [
                'name' => 'Admin',
                'password' => bcrypt(env('SUPER_ADMIN_PASSWORD', 'password')),
                'role' => 'super_admin',
                'plan_level' => 'premium',
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@xpert.test'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'role' => 'user',
                'plan_level' => 'free',
            ]
        );

        $this->call(AiAgentSeeder::class);
        $this->call(ChatbotKnowledgeSeeder::class);
    }
}
