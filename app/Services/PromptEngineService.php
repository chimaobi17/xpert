<?php

namespace App\Services;

use App\Exceptions\PromptTooLongException;
use App\Exceptions\TemplateNotFoundException;
use App\Models\AiAgent;

class PromptEngineService
{
    protected array $planMaxChars = [
        'free' => 5000,
        'standard' => 15000,
        'premium' => 50000,
    ];

    public function generate(AiAgent $agent, array $userInputs, ?string $fileContent = null, string $planLevel = 'free'): string
    {
        $template = $agent->latestTemplate;

        if (! $template) {
            throw new TemplateNotFoundException("No template found for agent: {$agent->name}");
        }

        $systemPrompt = $agent->system_prompt;
        $body = $this->replacePlaceholders($template->template_body, $userInputs);

        // Optimization: Image models (SDXL, Flux) prefer pure descriptors over conversational instructions.
        $modelType = config("ai_models.{$agent->category}.type", 'text');
        if ($modelType === 'image') {
            $assembled = $this->cleanImagePrompt($body);
        } else {
            if ($fileContent) {
                $body .= "\n\n--- ATTACHED DOCUMENT ---\n" . $fileContent;
            }
            $assembled = $systemPrompt . "\n\n" . $body;
        }

        $maxChars = $this->planMaxChars[$planLevel] ?? $this->planMaxChars['free'];
        
        if (strlen($assembled) > $maxChars) {
            throw new PromptTooLongException("Prompt exceeds the {$maxChars} character limit for your {$planLevel} plan.");
        }

        return $assembled;
    }

    /**
     * Clean up a structured template body for image generation models.
     * Removes labels and extra whitespace to create a direct visual prompt.
     */
    protected function cleanImagePrompt(string $body): string
    {
        // Remove labels (e.g., "Photography Style: Portrait" -> "Portrait")
        $cleaned = preg_replace('/^[\w\s\/]+:\s*/m', '', $body);
        
        // Remove boilerplate
        $cleaned = preg_replace('/Generate a photorealistic image of:\s*/i', '', $cleaned);
        $cleaned = preg_replace('/Make it look like a real photograph taken with a professional camera\./i', '', $cleaned);
        $cleaned = preg_replace('/Use natural lighting and realistic textures\./i', '', $cleaned);
        $cleaned = preg_replace('/Make it look professionally with clean composition and visual appeal\./i', '', $cleaned);
        $cleaned = preg_replace('/Generate a detailed visual description suitable for (image|logo) generation\./i', '', $cleaned);
        
        // Normalize whitespace and replace newlines with commas for better prompt flow
        $cleaned = str_replace("\n", ", ", $cleaned);
        $cleaned = preg_replace('/\s+/', ' ', $cleaned);
        
        return trim($cleaned, " ,");
    }

    protected function replacePlaceholders(string $templateBody, array $inputs): string
    {
        // Handle conditional blocks: {{#if field}}...content...{{/if}}
        $body = preg_replace_callback(
            '/\{\{#if\s+(\w+)\}\}(.*?)\{\{\/if\}\}/s',
            function ($matches) use ($inputs) {
                $field = $matches[1];
                $content = $matches[2];

                if (! empty($inputs[$field])) {
                    return $this->replaceSimplePlaceholders($content, $inputs);
                }

                return '';
            },
            $templateBody
        );

        // Replace remaining simple {{placeholders}}
        return $this->replaceSimplePlaceholders($body, $inputs);
    }

    protected function replaceSimplePlaceholders(string $text, array $inputs): string
    {
        return preg_replace_callback(
            '/\{\{(\w+)\}\}/',
            function ($matches) use ($inputs) {
                $field = $matches[1];

                return $inputs[$field] ?? '';
            },
            $text
        );
    }

    public function estimateTokens(string $text): int
    {
        return (int) ceil(str_word_count($text) * 1.3);
    }
}
