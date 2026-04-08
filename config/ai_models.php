<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AI Model Registry
    |--------------------------------------------------------------------------
    |
    | Maps each agent category to its primary and fallback Hugging Face models.
    | All models MUST be free-tier HF Inference API compatible.
    |
    | Endpoint: https://router.huggingface.co/v1/chat/completions (OpenAI-compatible)
    | Free tier: ~1000 requests/day, resets monthly.
    |
    */

    // --- Text Generation Models (Free Tier) ---

    'code_assistant' => [
        'primary' => 'Qwen/Qwen2.5-Coder-32B-Instruct',
        'fallback' => 'meta-llama/Llama-3.2-1B-Instruct',
        'max_tokens' => 2048,
        'timeout' => 60,
        'type' => 'text',
    ],

    'content_writer' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.1-8B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'business_analyst' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.3-70B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'ux_research' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.2-1B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'graphic_designer' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.1-8B-Instruct',
        'max_tokens' => 2048,
        'timeout' => 45,
        'type' => 'text',
    ],

    'document_qa' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.2-1B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'sentiment_analysis' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.2-1B-Instruct',
        'max_tokens' => 512,
        'timeout' => 15,
        'type' => 'text',
    ],

    // --- Text-to-Image Models (Premium Only) ---

    'interior_designer' => [
        'primary' => 'stabilityai/stable-diffusion-xl-base-1.0',
        'fallback' => 'runwayml/stable-diffusion-v1-5',
        'max_tokens' => 512,
        'timeout' => 60,
        'type' => 'image',
    ],

    'logo_creator' => [
        'primary' => 'stabilityai/stable-diffusion-xl-base-1.0',
        'fallback' => 'runwayml/stable-diffusion-v1-5',
        'max_tokens' => 512,
        'timeout' => 60,
        'type' => 'image',
    ],

    // --- New Agent Categories (Text Generation, Free Tier) ---

    'email_writer' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.1-8B-Instruct',
        'max_tokens' => 2048,
        'timeout' => 60,
        'type' => 'text',
    ],

    'resume_builder' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.3-70B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'social_media' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.1-8B-Instruct',
        'max_tokens' => 2048,
        'timeout' => 60,
        'type' => 'text',
    ],

    'academic_writer' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.3-70B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'legal_assistant' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.3-70B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'data_analyst' => [
        'primary' => 'Qwen/Qwen2.5-Coder-32B-Instruct',
        'fallback' => 'Qwen/Qwen2.5-7B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'grammar_editor' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.2-1B-Instruct',
        'max_tokens' => 2048,
        'timeout' => 60,
        'type' => 'text',
    ],

    'meeting_summarizer' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.2-1B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'story_writer' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.1-8B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'api_docs' => [
        'primary' => 'Qwen/Qwen2.5-Coder-32B-Instruct',
        'fallback' => 'Qwen/Qwen2.5-7B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'pitch_deck' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.3-70B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'language_tutor' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.2-1B-Instruct',
        'max_tokens' => 2048,
        'timeout' => 60,
        'type' => 'text',
    ],

    // --- Translation ---

    'translation' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.2-1B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    // --- Tone & Graphics Agents ---

    'tone_transformer' => [
        'primary' => 'Qwen/Qwen2.5-7B-Instruct',
        'fallback' => 'meta-llama/Llama-3.1-8B-Instruct',
        'max_tokens' => 4096,
        'timeout' => 60,
        'type' => 'text',
    ],

    'graphics_designer' => [
        'primary' => 'stabilityai/stable-diffusion-xl-base-1.0',
        'fallback' => 'runwayml/stable-diffusion-v1-5',
        'max_tokens' => 512,
        'timeout' => 60,
        'type' => 'image',
    ],

    'photography' => [
        'primary' => 'black-forest-labs/FLUX.1-schnell',
        'fallback' => 'stabilityai/stable-diffusion-xl-base-1.0',
        'max_tokens' => 512,
        'timeout' => 120,
        'type' => 'image',
    ],

    // --- Embeddings ---

    'embeddings' => [
        'primary' => 'BAAI/bge-small-en-v1.5',
        'fallback' => null,
        'max_tokens' => 512,
        'timeout' => 15,
        'type' => 'embedding',
    ],

    /*
    |--------------------------------------------------------------------------
    | Plan Quotas (daily token limits)
    |--------------------------------------------------------------------------
    */

    'quotas' => [
        'free' => 25000,
        'standard' => 150000,
        'premium' => 1000000,
    ],

    /*
    |--------------------------------------------------------------------------
    | Plan Rate Limits (requests per day, 0 = unlimited)
    |--------------------------------------------------------------------------
    */

    'rate_limits' => [
        'free' => 50,
        'standard' => 300,
        'premium' => 0,
    ],

    /*
    |--------------------------------------------------------------------------
    | File Upload Limits (in MB, per plan)
    |--------------------------------------------------------------------------
    */

    'file_limits' => [
        'free' => 25,
        'standard' => 100,
        'premium' => 200,
    ],

];
