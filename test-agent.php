<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $user = \App\Models\User::first();
    if(!$user) { echo "no user\n"; exit; }
    $req = Illuminate\Http\Request::create('/api/agents', 'GET', ['tier' => 'premium']);
    $req->setUserResolver(function () use ($user) { return $user; });
    $controller = app(\App\Http\Controllers\Api\AgentController::class);
    $res = $controller->index($req);
    print_r($res->getContent());
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "VALIDATION EXCEPTION: \n";
    print_r($e->errors());
} catch (\Exception $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
