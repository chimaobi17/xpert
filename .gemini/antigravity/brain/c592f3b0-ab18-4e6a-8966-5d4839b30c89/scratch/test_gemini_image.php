<?php

require __DIR__ . '/../../../../../../../../vendor/autoload.php';

$app = require_once __DIR__ . '/../../../../../../../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$apiKey = env('GEMINI_API_KEY');
$model = env('GEMINI_IMAGE_MODEL', 'gemini-2.0-flash-exp');

if (!$apiKey) {
    echo "NO API KEY\n";
    exit(1);
}

$url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

$payload = [
    'contents' => [
        [
            'parts' => [
                [
                    'text' => 'Generate a simple blue circle icon.',
                ],
            ],
        ],
    ],
    'generationConfig' => [
        'responseModalities' => ['TEXT', 'IMAGE'],
    ],
];

echo "Testing Gemini Image Generation at: " . $url . "\n";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: $status\n";
echo "Response: " . substr($response, 0, 500) . "...\n";

if ($status === 404) {
    echo "\nModel not found. Trying gemini-2.0-flash (non-exp)...\n";
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    echo "Status: $status\n";
    echo "Response: " . substr($response, 0, 500) . "...\n";
}
