<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$apiKey = env('HUGGINGFACE_API_KEY');
if (!$apiKey) {
    echo "NO API KEY\n";
    exit(1);
}

$endpoints = [
    'direct' => 'https://api-inference.huggingface.co/models/',
    'router' => 'https://router.huggingface.co/hf-inference/models/'
];

$models = [
    'black-forest-labs/FLUX.1-schnell',
    'stabilityai/stable-diffusion-xl-base-1.0',
    'stabilityai/stable-diffusion-2-1',
    'runwayml/stable-diffusion-v1-5'
];

foreach ($endpoints as $name => $baseUrl) {
    echo "--- Testing Endpoint: $name ($baseUrl) ---\n";
    foreach ($models as $model) {
        $url = $baseUrl . $model;
        echo "Testing $model... ";
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['inputs' => 'a blue apple']));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        curl_close($ch);
        
        echo "Status: $status | Type: $contentType\n";
        if ($status !== 200 && $status !== 503) {
            echo "   Error: " . substr($response, 0, 100) . "\n";
        }
    }
    echo "\n";
}
