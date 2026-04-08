<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = Illuminate\Http\Request::create('/api/agents', 'GET');
$user = App\Models\User::first();
$request->setUserResolver(function () use ($user) { return $user; });

$controller = app()->make(App\Http\Controllers\Api\AgentController::class);
$response = $controller->index($request);

echo get_class($response) . "\n";
$content = $response->getContent();
$data = json_decode($content, true);
if (isset($data[0])) {
    echo "First agent is_added: " . (isset($data[0]['is_added']) ? ($data[0]['is_added'] ? 'true' : 'false') : 'missing') . "\n";
    $added = array_filter($data, fn($a) => !empty($a['is_added']));
    echo "Total with is_added=true: " . count($added) . "\n";
} else {
    echo "No agents\n";
}
