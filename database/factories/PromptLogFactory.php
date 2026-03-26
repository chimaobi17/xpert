<?php

namespace Database\Factories;

use App\Models\AiAgent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PromptLog>
 */
class PromptLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'agent_id' => AiAgent::factory(),
            'prompt_type' => fake()->randomElement(['generated', 'custom', 'edited']),
            'prompt_text' => fake()->paragraph(),
            'tokens_estimated' => fake()->numberBetween(50, 2000),
            'created_at' => now(),
        ];
    }
}
