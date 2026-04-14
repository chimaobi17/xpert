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
            $hasReferenceImage = !empty($fileContent) && !str_contains($fileContent, 'could not be processed');
            $assembled = $this->buildImagePrompt($agent->category, $userInputs, $body, $hasReferenceImage);
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
    protected function buildImagePrompt(string $category, array $inputs, string $templateBody, bool $hasReference = false): string
    {
        // Route to the right builder based on category
        $prompt = match ($category) {
            'photography' => $this->buildPhotographyPrompt($inputs),
            'logo_creator' => $this->buildLogoPrompt($inputs),
            'interior_designer' => $this->buildInteriorPrompt($inputs),
            'graphics_designer' => $this->buildGraphicsPrompt($inputs),
            default => $this->buildGenericImagePrompt($inputs, $templateBody),
        };

        // When a reference image is uploaded, prepend img2img guidance
        if ($hasReference) {
            $prompt = "based on the uploaded reference image, " . $prompt;
        }

        return $prompt;
    }

    protected function buildPhotographyPrompt(array $inputs): string
    {
        $subject = trim($inputs['subject'] ?? 'a scene');
        $style = $inputs['style'] ?? 'Portrait';
        $mood = $inputs['mood'] ?? 'Natural Daylight';
        $extra = trim($inputs['extra_details'] ?? '');

        $styleMap = [
            'Portrait' => 'close-up portrait photo, shallow depth of field, soft blurred bokeh background, shot with 85mm f/1.4 lens',
            'Landscape' => 'wide-angle landscape photograph, deep depth of field, vivid saturated colors, expansive vista',
            'Street Photography' => 'candid street photograph, urban city setting, gritty authentic feel, shot with 35mm lens',
            'Product / Commercial' => 'studio product photograph, softbox lighting, clean seamless background, sharp crisp focus',
            'Food Photography' => 'overhead food photograph, styled plating on ceramic dish, shallow depth of field, warm appetizing tones',
            'Architecture' => 'architectural photograph, strong leading lines, perfect symmetry, dramatic perspective',
            'Wildlife / Nature' => 'telephoto wildlife photograph, animal in natural habitat, sharp subject with blurred background',
            'Fashion' => 'high fashion editorial photograph, dramatic pose, stylized directional lighting, bold colors',
            'Macro / Close-Up' => 'extreme macro photograph, incredible fine detail, very shallow depth of field, magnified textures',
            'Aerial / Drone' => 'aerial drone photograph, top-down birds eye view, geometric patterns, sweeping landscape',
        ];

        $moodMap = [
            'Golden Hour / Warm' => 'golden hour sunlight, long warm shadows, rich amber and orange tones',
            'Cool / Blue Hour' => 'blue hour twilight sky, cool blue and purple tones, calm serene atmosphere',
            'Dramatic / High Contrast' => 'dramatic side lighting, deep dark shadows, strong highlights, cinematic contrast',
            'Soft / Diffused' => 'soft overcast diffused light, gentle even shadows, dreamy ethereal quality',
            'Moody / Dark' => 'dark moody low-key lighting, deep blacks, mysterious shadowy atmosphere',
            'Bright / Airy' => 'bright airy natural light, high-key exposure, soft whites and pastels',
            'Studio Lighting' => 'three-point studio lighting setup, rim light, controlled even illumination',
            'Natural Daylight' => 'clear natural daylight, true-to-life colors, bright outdoor lighting',
            'Neon / Night' => 'neon city lights at night, colorful reflections on wet pavement, vibrant glowing signs',
        ];

        $styleDesc = $styleMap[$style] ?? strtolower($style) . ' photograph';
        $moodDesc = $moodMap[$mood] ?? strtolower($mood);

        $parts = [
            "A stunning photograph of {$subject}",
            $styleDesc,
            $moodDesc,
        ];

        if ($extra) {
            $parts[] = $extra;
        }

        $parts[] = 'photorealistic, ultra sharp detail, 8K resolution, shot on professional DSLR camera, beautiful color grading';

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
            'Wordmark' => 'bold custom typography logo with the text "{name}", elegant hand-crafted lettering, thick and thin strokes',
            'Lettermark' => 'single bold letter "{initial}" monogram logo, geometric shape, strong distinctive character',
            'Icon/Symbol' => 'iconic symbolic logo mark, abstract geometric shape representing {industry}, bold solid form',
            'Combination' => 'logo featuring a bold icon next to the text "{name}", geometric symbol paired with modern typography',
            'Emblem' => 'circular emblem badge logo with "{name}" text inside, ornate border details, classic crest design',
            'Abstract' => 'abstract geometric logo mark, intersecting shapes and angles, dynamic flowing forms, bold colors',
        ];

        $initial = strtoupper(substr($brandName, 0, 1));
        $template = $styleMap[$logoStyle] ?? 'modern logo design for "{name}"';
        $styleDesc = str_replace(['{name}', '{initial}', '{industry}'], [$brandName, $initial, $industry ?: 'technology'], $template);

        $parts = [$styleDesc];

        if ($industry) {
            $parts[] = "{$industry} theme";
        }

        if ($preferences) {
            $parts[] = $preferences;
        }

        // Visual descriptors FLUX understands — concrete colors, rendering, background
        $parts[] = 'solid dark background, vibrant gradient colors, sharp clean edges, centered composition, 3D rendered, glossy metallic finish, high detail, digital art';

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
            'Modern' => 'modern contemporary furniture, clean straight lines, glass and metal accents, neutral walls with bold accent pieces',
            'Minimalist' => 'minimalist design, very few furniture pieces, open empty space, monochrome palette, zen-like calm',
            'Industrial' => 'industrial loft style, exposed red brick walls, black metal pipe shelving, Edison bulb pendant lights, concrete floor',
            'Scandinavian' => 'Scandinavian style, light blonde wood floors, white painted walls, cozy knit throws, potted green plants',
            'Bohemian' => 'bohemian eclectic style, layered colorful rugs and textiles, hanging macrame, many green plants, warm rich colors',
            'Traditional' => 'traditional classic style, dark polished wood furniture, ornate carved details, rich velvet upholstery, crown molding',
        ];

        $budgetDesc = match($budget) {
            'Luxury' => 'luxury high-end designer pieces, marble surfaces, gold accents, crystal chandelier',
            'Budget' => 'smart stylish affordable pieces, clever use of space',
            default => 'well-appointed quality furnishings',
        };

        $styleDesc = $styleMap[$style] ?? strtolower($style) . ' interior';

        $parts = [
            "Beautiful {$roomType} interior",
            $styleDesc,
            $budgetDesc,
        ];

        if ($colorPalette) {
            $parts[] = "{$colorPalette} color scheme throughout";
        }

        if ($requirements) {
            $parts[] = $requirements;
        }

        $parts[] = 'photorealistic 3D architectural render, warm natural light streaming through large windows, high detail textures, wide-angle shot, interior design magazine photo, 8K';

        return implode(', ', array_filter($parts));
    }

    protected function buildGraphicsPrompt(array $inputs): string
    {
        $designType = $inputs['design_type'] ?? 'Illustration';
        $description = trim($inputs['description'] ?? '');
        $style = $inputs['style'] ?? 'Minimalist';
        $colorPalette = trim($inputs['color_palette'] ?? '');

        $styleMap = [
            'Minimalist' => 'minimalist flat illustration, simple geometric shapes, limited color palette, clean negative space',
            'Bold & Vibrant' => 'bold vibrant saturated colors, high energy dynamic composition, eye-catching strong contrast',
            'Corporate / Clean' => 'clean corporate design, structured grid layout, professional blue tones, refined typography',
            'Vintage / Retro' => 'vintage retro aesthetic, faded warm color tones, grainy distressed texture, 1970s inspired',
            'Futuristic' => 'futuristic cyberpunk design, glowing neon blue and purple accents, holographic effects, dark background',
            'Hand-Drawn / Sketch' => 'hand-drawn pencil sketch illustration, organic loose lines, crosshatch shading, paper texture',
            'Flat Design' => 'flat design illustration, solid bright colors, no shadows or gradients, bold geometric shapes',
        ];

        $styleDesc = $styleMap[$style] ?? strtolower($style);

        $parts = [
            "{$designType} of {$description}",
            $styleDesc,
        ];

        if ($colorPalette) {
            $parts[] = "{$colorPalette} color palette";
        }

        $parts[] = 'sharp high resolution, detailed digital art, professional quality, visually striking composition';

        return implode(', ', array_filter($parts));
    }

    /**
     * Fallback for any image category not explicitly mapped.
     */
    protected function buildGenericImagePrompt(array $inputs, string $templateBody): string
    {
        $descriptors = [];
        foreach ($inputs as $key => $value) {
            if (empty($value) || $key === 'file') continue;
            $descriptors[] = is_string($value) ? trim($value) : (string) $value;
        }

        $prompt = implode(', ', array_filter($descriptors));
        $prompt .= ', high quality, sharp detail, vivid colors, professional digital art, 8K resolution';

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
