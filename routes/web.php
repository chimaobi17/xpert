<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Xpert API',
        'status' => 'online',
        'version' => '1.0.0'
    ]);
});
