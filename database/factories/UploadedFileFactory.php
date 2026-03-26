<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UploadedFile>
 */
class UploadedFileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'file_path' => 'uploads/' . fake()->uuid() . '.pdf',
            'mime_type' => fake()->randomElement(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png']),
            'size_bytes' => fake()->numberBetween(1024, 5242880),
            'parsed_content' => null,
        ];
    }
}
