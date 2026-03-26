<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AiAgent>
 */
class AiAgentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true) . ' Agent',
            'domain' => fake()->randomElement(['Technology', 'Business', 'Creative', 'Language', 'Research']),
            'category' => fake()->randomElement(['code_assistant', 'content_writer', 'business_analyst', 'translation', 'document_qa']),
            'system_prompt' => 'You are a helpful AI assistant specialized in ' . fake()->bs() . '.',
            'is_premium_only' => false,
        ];
    }

    public function premiumOnly(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_premium_only' => true,
        ]);
    }
}
