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
        
        // Replace placeholders in the body first
        $body = $this->replacePlaceholders($template->template_body, $userInputs);

        $modelType = config("ai_models.{$agent->category}.type", 'text');
        
        if ($modelType === 'image') {
            $assembled = $this->cleanImagePrompt($body);
        } else {
            // Deduplicate metadata: don't repeat fields that were already used as {{placeholders}} in the body
            $metadata = $this->formatMetadata($userInputs, $template->template_body);
            
            // Separate Instructions if present in the template body
            $parts = explode('Instructions:', $body, 2);
            $taskMain = trim($parts[0]);
            $instructions = isset($parts[1]) ? trim($parts[1]) : '';

            $blocks = [];
            
            // 1. Role (from system prompt)
            if ($systemPrompt) {
                $blocks[] = "[Expert Role]\n" . trim($systemPrompt);
            }

            // 2. Task & Context (from template body minus instructions)
            $blocks[] = trim($taskMain);
            
            // 3. Supplemental Intelligence Context (Curated Metadata)
            if ($metadata) {
                $blocks[] = "Intelligence Context:\n" . $metadata;
            }

            // 4. Instructions (Prioritized at the bottom)
            if ($instructions) {
                $blocks[] = "Instructions:\n" . trim($instructions);
            }

            if ($fileContent) {
                $blocks[] = "--- ATTACHED DOCUMENT ---\n" . $fileContent;
            }

            $assembled = implode("\n\n", array_filter($blocks));
        }

        $maxChars = $this->planMaxChars[$planLevel] ?? $this->planMaxChars['free'];
        
        if (strlen($assembled) > $maxChars) {
            throw new PromptTooLongException("Prompt exceeds the {$maxChars} character limit for your {$planLevel} plan.");
        }

        return $assembled;
    }

    /**
     * Extracts and formats metadata fields into a structured block.
     * Skips fields that are already found as placeholders in the template body to avoid redundancy.
     */
    protected function formatMetadata(array $inputs, string $templateBody): string
    {
        $relevantFields = [
            'tone' => 'Tone',
            'audience' => 'Audience',
            'word_count' => 'Word Count',
            'level' => 'Complexity Level',
            'industry' => 'Industry',
            'target_role' => 'Target Role',
            'brand_name' => 'Brand/Company Name',
            'logo_style' => 'Visual Style',
            'color_palette' => 'Color Palette',
            'source_language' => 'Source Language',
            'target_language' => 'Target Language',
        ];

        $lines = [];
        foreach ($relevantFields as $key => $label) {
            // Skip if value is empty
            if (empty($inputs[$key])) continue;

            // Skip if this field is already explicitly used as a placeholder in the template body
            if (str_contains($templateBody, "{{{$key}}}")) continue;

            $lines[] = "- Target {$label}: " . $inputs[$key];
        }

        return implode("\n", $lines);
    }

    /**
     * Clean up a structured template body for image generation models.
     * Removes labels and extra whitespace to create a direct visual prompt.
     */
    protected function cleanImagePrompt(string $body): string
    {
        // Remove section headers like "Intelligence Context:", "Instructions:", etc.
        $cleaned = preg_replace('/(Intelligence Context|Instructions|Additional Design Intent|Visual Style|Color Strategy):/i', '', $body);

        // Remove field labels including those with hyphens (e.g., "- Target Industry: Portrait" -> "Portrait")
        $cleaned = preg_replace('/^[\s\-]*[\w\s\/]+:\s*/m', '', $cleaned);
        
        // Remove known boilerplate phrases
        $cleaned = preg_replace('/Generate a photorealistic image of:\s*/i', '', $cleaned);
        $cleaned = preg_replace('/Create a professional logo concept for the brand described\./i', '', $cleaned);
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
