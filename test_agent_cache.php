<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$agent = App\Models\AiAgent::first();
$agent->is_added = true;
echo isset($agent->toArray()['is_added']) ? 'yes' : 'no';
