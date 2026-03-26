<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TokenUsageLog>
 */
class TokenUsageLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'date' => now()->toDateString(),
            'tokens_used' => fake()->numberBetween(100, 5000),
            'request_count' => fake()->numberBetween(1, 20),
        ];
    }
}
