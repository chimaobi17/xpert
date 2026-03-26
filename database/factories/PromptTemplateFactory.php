<?php

namespace Database\Factories;

use App\Models\AiAgent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PromptTemplate>
 */
class PromptTemplateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'agent_id' => AiAgent::factory(),
            'template_body' => "You are an expert assistant.\n\nTask: {{task_description}}\n\nPlease provide a detailed response.",
            'field_schema' => json_encode([
                'fields' => [
                    ['name' => 'task_description', 'type' => 'textarea', 'label' => 'Describe your task', 'required' => true],
                ],
            ]),
            'version' => 1,
        ];
    }
}
