<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AI Model Registry
    |--------------------------------------------------------------------------
    |
    | Maps each agent category to its primary and fallback Hugging Face models.
    | All models MUST be free-tier HF Inference API compatible.
    | Update with better models discovered during Phase 0 research.
    |
    */

    'code_assistant' => [
        'primary' => 'bigcode/starcoder2-15b',
        'fallback' => 'codellama/CodeLlama-34b-Instruct-hf',
        'max_tokens' => 2048,
        'timeout' => 30,
    ],

    'content_writer' => [
        'primary' => 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        'fallback' => 'HuggingFaceH4/zephyr-7b-beta',
        'max_tokens' => 4096,
        'timeout' => 30,
    ],

    'business_analyst' => [
        'primary' => 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        'fallback' => 'mistralai/Mistral-7B-Instruct-v0.2',
        'max_tokens' => 4096,
        'timeout' => 30,
    ],

    'ux_research' => [
        'primary' => 'mistralai/Mistral-7B-Instruct-v0.2',
        'fallback' => 'HuggingFaceH4/zephyr-7b-beta',
        'max_tokens' => 4096,
        'timeout' => 30,
    ],

    'graphic_designer' => [
        'primary' => 'stabilityai/stable-diffusion-xl-base-1.0',
        'fallback' => 'runwayml/stable-diffusion-v1-5',
        'max_tokens' => 512,
        'timeout' => 60,
    ],

    'translation' => [
        'primary' => 'facebook/nllb-200-distilled-600M',
        'fallback' => null,
        'max_tokens' => 4096,
        'timeout' => 30,
    ],

    'document_qa' => [
        'primary' => 'mistralai/Mistral-7B-Instruct-v0.2',
        'fallback' => 'HuggingFaceH4/zephyr-7b-beta',
        'max_tokens' => 4096,
        'timeout' => 30,
    ],

    'sentiment_analysis' => [
        'primary' => 'cardiffnlp/twitter-roberta-base-sentiment-latest',
        'fallback' => null,
        'max_tokens' => 512,
        'timeout' => 15,
    ],

    'embeddings' => [
        'primary' => 'BAAI/bge-small-en-v1.5',
        'fallback' => null,
        'max_tokens' => 512,
        'timeout' => 15,
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
    | Plan Rate Limits (requests per day)
    |--------------------------------------------------------------------------
    */

    'rate_limits' => [
        'free' => 50,
        'standard' => 300,
        'premium' => 0, // 0 = unlimited
    ],

];
