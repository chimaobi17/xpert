<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$category = 'logo_creator';
$models = config("ai_models.{$category}");
echo "Category: $category\n";
echo "Type: " . ($models['type'] ?? 'MISSING') . "\n";
echo "Primary: " . ($models['primary'] ?? 'MISSING') . "\n";
echo "Full Config:\n";
print_r($models);
