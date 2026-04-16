<?php

/*
|--------------------------------------------------------------------------
| Build allowed origins from environment variables
|--------------------------------------------------------------------------
| FRONTEND_URL and ADMIN_URL can be comma-separated for multi-domain
| support (e.g., "https://app.example.com,https://preview-123.vercel.app")
*/
$origins = array_filter(array_merge(
    explode(',', env('FRONTEND_URL', 'http://localhost:5173')),
    explode(',', env('ADMIN_URL', 'http://localhost:5174')),
    [
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
    ]
));

// When APP_URL is set (production), allow same-origin requests
$appUrl = env('APP_URL');
if ($appUrl && ! in_array($appUrl, $origins)) {
    $origins[] = $appUrl;
}

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_map('trim', $origins)),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
