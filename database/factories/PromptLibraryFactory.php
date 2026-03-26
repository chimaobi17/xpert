<?php

namespace Database\Factories;

use App\Models\AiAgent;
use App\Models\PromptLibrary;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PromptLibrary>
 */
class PromptLibraryFactory extends Factory
{
    protected $model = PromptLibrary::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'agent_id' => AiAgent::factory(),
            'original_input' => fake()->sentence(),
            'final_prompt' => fake()->paragraph(),
            'ai_response' => fake()->paragraphs(3, true),
            'created_at' => now(),
        ];
    }
}
