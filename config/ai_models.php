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
    */

    // --- Text Generation Models (Free Tier) ---

    'code_assistant' => [
        'primary' => 'bigcode/starcoder2-15b',
        'fallback' => 'codellama/CodeLlama-34b-Instruct-hf',
        'max_tokens' => 2048,
        'timeout' => 30,
        'type' => 'text',
    ],

    'content_writer' => [
        'primary' => 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        'fallback' => 'HuggingFaceH4/zephyr-7b-beta',
        'max_tokens' => 4096,
        'timeout' => 30,
        'type' => 'text',
    ],

    'business_analyst' => [
        'primary' => 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        'fallback' => 'mistralai/Mistral-7B-Instruct-v0.2',
        'max_tokens' => 4096,
        'timeout' => 30,
        'type' => 'text',
    ],

    'ux_research' => [
        'primary' => 'mistralai/Mistral-7B-Instruct-v0.2',
        'fallback' => 'HuggingFaceH4/zephyr-7b-beta',
        'max_tokens' => 4096,
        'timeout' => 30,
        'type' => 'text',
    ],

    'graphic_designer' => [
        'primary' => 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        'fallback' => 'HuggingFaceH4/zephyr-7b-beta',
        'max_tokens' => 4096,
        'timeout' => 30,
        'type' => 'text',
    ],

    'document_qa' => [
        'primary' => 'mistralai/Mistral-7B-Instruct-v0.2',
        'fallback' => 'HuggingFaceH4/zephyr-7b-beta',
        'max_tokens' => 4096,
        'timeout' => 30,
        'type' => 'text',
    ],

    'sentiment_analysis' => [
        'primary' => 'cardiffnlp/twitter-roberta-base-sentiment-latest',
        'fallback' => null,
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

    // --- Translation ---

    'translation' => [
        'primary' => 'facebook/nllb-200-distilled-600M',
        'fallback' => null,
        'max_tokens' => 4096,
        'timeout' => 30,
        'type' => 'text',
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
