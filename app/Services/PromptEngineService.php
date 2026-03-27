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

        if ($fileContent) {
            $body .= "\n\n--- ATTACHED DOCUMENT ---\n" . $fileContent;
        }

        $assembled = $systemPrompt . "\n\n" . $body;

        $maxChars = $this->planMaxChars[$planLevel] ?? $this->planMaxChars['free'];

        if (strlen($assembled) > $maxChars) {
            throw new PromptTooLongException("Prompt exceeds the {$maxChars} character limit for your {$planLevel} plan.");
        }

        return $assembled;
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
