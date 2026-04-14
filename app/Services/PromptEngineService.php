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
            $assembled = $this->buildImagePrompt($agent->category, $userInputs, $body);
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
     * Build a structured, high-fidelity prompt for image generation models.
     *
     * Instead of stripping metadata, we compose a rich visual descriptor
     * that image diffusion models (SDXL, FLUX) actually respond to well.
     * Structure: [subject], [style modifiers], [lighting/mood], [technical quality], [negative guidance]
     */
    protected function buildImagePrompt(string $category, array $inputs, string $templateBody): string
    {
        // Route to the right builder based on category
        return match ($category) {
            'photography' => $this->buildPhotographyPrompt($inputs),
            'logo_creator' => $this->buildLogoPrompt($inputs),
            'interior_designer' => $this->buildInteriorPrompt($inputs),
            'graphics_designer' => $this->buildGraphicsPrompt($inputs),
            default => $this->buildGenericImagePrompt($inputs, $templateBody),
        };
    }

    protected function buildPhotographyPrompt(array $inputs): string
    {
        $subject = trim($inputs['subject'] ?? 'a scene');
        $style = $inputs['style'] ?? 'Portrait';
        $mood = $inputs['mood'] ?? 'Natural Daylight';
        $aspectRatio = $inputs['aspect_ratio'] ?? '';
        $extra = trim($inputs['extra_details'] ?? '');

        // Map style to photographic technique descriptors
        $styleMap = [
            'Portrait' => 'professional portrait photography, shallow depth of field, bokeh background, 85mm lens',
            'Landscape' => 'sweeping landscape photography, deep depth of field, wide-angle lens, vivid natural colors',
            'Street Photography' => 'candid street photography, urban environment, documentary style, 35mm lens',
            'Product / Commercial' => 'commercial product photography, clean background, studio setup, sharp focus, advertising quality',
            'Food Photography' => 'professional food photography, appetizing presentation, shallow depth of field, overhead angle, styled plating',
            'Architecture' => 'architectural photography, leading lines, symmetry, tilt-shift perspective, clean geometry',
            'Wildlife / Nature' => 'wildlife nature photography, telephoto lens, natural habitat, sharp subject isolation',
            'Fashion' => 'high fashion editorial photography, dramatic pose, stylized lighting, vogue magazine quality',
            'Macro / Close-Up' => 'extreme macro photography, incredible detail, shallow depth of field, magnified textures',
            'Aerial / Drone' => 'aerial drone photography, birds eye view, sweeping perspective, geographic patterns',
        ];

        $moodMap = [
            'Golden Hour / Warm' => 'golden hour warm sunlight, long shadows, amber tones, magic hour glow',
            'Cool / Blue Hour' => 'blue hour twilight, cool tones, serene atmosphere, soft ambient light',
            'Dramatic / High Contrast' => 'dramatic chiaroscuro lighting, deep shadows, high contrast, cinematic intensity',
            'Soft / Diffused' => 'soft diffused lighting, overcast sky, gentle shadows, ethereal quality',
            'Moody / Dark' => 'moody low-key lighting, dark atmospheric tones, mysterious ambiance, noir influence',
            'Bright / Airy' => 'bright airy natural light, high-key exposure, clean whites, fresh luminous feel',
            'Studio Lighting' => 'professional studio lighting, three-point setup, controlled highlights, clean shadows',
            'Natural Daylight' => 'natural daylight, authentic outdoor lighting, true-to-life colors',
            'Neon / Night' => 'neon night photography, vibrant colored lights, urban nightscape, light reflections on wet surfaces',
        ];

        $styleDesc = $styleMap[$style] ?? strtolower($style) . ' photography';
        $moodDesc = $moodMap[$mood] ?? strtolower($mood);

        $parts = [
            $subject,
            $styleDesc,
            $moodDesc,
        ];

        if ($extra) {
            $parts[] = $extra;
        }

        // Quality boosters that SDXL/FLUX respond to
        $parts[] = 'photorealistic, ultra high resolution, 8K, shot on Canon EOS R5, RAW photo, professional color grading, masterful composition';

        return implode(', ', array_filter($parts));
    }

    protected function buildLogoPrompt(array $inputs): string
    {
        $brandName = trim($inputs['brand_name'] ?? 'brand');
        $industry = trim($inputs['industry'] ?? '');
        $logoStyle = $inputs['logo_style'] ?? 'Combination';
        $tagline = trim($inputs['tagline'] ?? '');
        $preferences = trim($inputs['preferences'] ?? '');

        $styleMap = [
            'Wordmark' => 'typographic wordmark logo, elegant lettering, custom typography, text-based brand identity',
            'Lettermark' => 'lettermark monogram logo, single initial or initials, distinctive typographic mark',
            'Icon/Symbol' => 'iconic symbol logo, abstract geometric mark, memorable brand symbol, scalable icon design',
            'Combination' => 'combination mark logo, symbol paired with wordmark, balanced icon and text integration',
            'Emblem' => 'emblem logo design, badge style, enclosed crest, classic brand seal',
            'Abstract' => 'abstract geometric logo, modern shapes, dynamic angles, conceptual brand mark',
        ];

        $styleDesc = $styleMap[$logoStyle] ?? strtolower($logoStyle) . ' logo design';

        $parts = [
            "professional {$styleDesc} for \"{$brandName}\"",
        ];

        if ($industry) {
            $parts[] = "{$industry} industry";
        }

        if ($tagline) {
            $parts[] = "incorporating tagline \"{$tagline}\"";
        }

        if ($preferences) {
            $parts[] = $preferences;
        }

        $parts[] = 'clean vector style, white background, minimal color palette, high contrast, scalable design, print-ready, corporate quality, Adobe Illustrator style';

        return implode(', ', array_filter($parts));
    }

    protected function buildInteriorPrompt(array $inputs): string
    {
        $roomType = $inputs['room_type'] ?? 'Living Room';
        $style = $inputs['style'] ?? 'Modern';
        $colorPalette = trim($inputs['color_palette'] ?? '');
        $budget = $inputs['budget'] ?? 'Mid-Range';
        $requirements = trim($inputs['special_requirements'] ?? '');

        $styleMap = [
            'Modern' => 'modern contemporary interior, clean lines, open concept, minimalist furniture, neutral palette with accent colors',
            'Minimalist' => 'minimalist interior design, uncluttered space, functional furniture, monochromatic scheme, breathing room',
            'Industrial' => 'industrial loft interior, exposed brick, metal fixtures, raw materials, Edison bulbs, warehouse aesthetic',
            'Scandinavian' => 'Scandinavian hygge interior, light wood, white walls, cozy textiles, natural materials, warm minimalism',
            'Bohemian' => 'bohemian eclectic interior, layered textiles, mixed patterns, global accents, plants, rich warm colors',
            'Traditional' => 'traditional classic interior, ornate details, rich wood furniture, elegant fabrics, symmetrical layout',
        ];

        $budgetMap = [
            'Budget' => 'smart affordable design',
            'Mid-Range' => 'balanced quality furnishings',
            'Luxury' => 'luxury high-end designer furniture, premium materials, bespoke details',
        ];

        $styleDesc = $styleMap[$style] ?? strtolower($style) . ' interior design';
        $budgetDesc = $budgetMap[$budget] ?? '';

        $parts = [
            "beautiful {$roomType} interior design",
            $styleDesc,
        ];

        if ($colorPalette) {
            $parts[] = "{$colorPalette} color scheme";
        }

        if ($budgetDesc) {
            $parts[] = $budgetDesc;
        }

        if ($requirements) {
            $parts[] = $requirements;
        }

        $parts[] = 'architectural visualization, photorealistic 3D render, natural lighting through windows, high detail, interior magazine quality, 8K resolution';

        return implode(', ', array_filter($parts));
    }

    protected function buildGraphicsPrompt(array $inputs): string
    {
        $designType = $inputs['design_type'] ?? 'Illustration';
        $description = trim($inputs['description'] ?? '');
        $style = $inputs['style'] ?? 'Minimalist';
        $colorPalette = trim($inputs['color_palette'] ?? '');
        $dimensions = $inputs['dimensions'] ?? '';

        $styleMap = [
            'Minimalist' => 'minimalist clean design, simple shapes, generous whitespace, limited color palette',
            'Bold & Vibrant' => 'bold vibrant colors, high energy, dynamic composition, eye-catching contrast',
            'Corporate / Clean' => 'corporate professional design, clean layout, business appropriate, sophisticated typography',
            'Vintage / Retro' => 'vintage retro aesthetic, distressed textures, nostalgic color palette, classic typography',
            'Futuristic' => 'futuristic sci-fi design, neon accents, holographic elements, cyberpunk influence, sleek technology',
            'Hand-Drawn / Sketch' => 'hand-drawn illustration style, organic lines, pencil sketch texture, artistic imperfection',
            'Flat Design' => 'flat design style, solid colors, no gradients, geometric shapes, modern UI aesthetic',
        ];

        $styleDesc = $styleMap[$style] ?? strtolower($style) . ' design style';

        $parts = [
            "{$designType}: {$description}",
            $styleDesc,
        ];

        if ($colorPalette) {
            $parts[] = "{$colorPalette} colors";
        }

        $parts[] = 'professional graphic design, polished composition, high resolution, print quality, visually striking, award-winning design';

        return implode(', ', array_filter($parts));
    }

    /**
     * Fallback for any image category not explicitly mapped.
     */
    protected function buildGenericImagePrompt(array $inputs, string $templateBody): string
    {
        // Extract meaningful values from inputs, skip empty ones
        $descriptors = [];
        foreach ($inputs as $key => $value) {
            if (empty($value) || $key === 'file') continue;
            $descriptors[] = is_string($value) ? trim($value) : (string) $value;
        }

        $prompt = implode(', ', array_filter($descriptors));

        // Add universal quality boosters
        $prompt .= ', high quality, detailed, professional, 8K resolution, masterful composition';

        return $prompt;
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
