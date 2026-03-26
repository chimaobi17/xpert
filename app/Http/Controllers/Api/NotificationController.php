<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        // Mock notifications until a notifications table is created
        return response()->json([
            [
                'id' => 1,
                'type' => 'warning',
                'title' => 'Token quota at 80%',
                'message' => 'You have used 80% of your daily token quota.',
                'read' => false,
                'created_at' => now()->subHours(2)->toISOString(),
            ],
            [
                'id' => 2,
                'type' => 'info',
                'title' => 'New Agent Available',
                'message' => 'Translation Agent is now available for Premium users.',
                'read' => true,
                'created_at' => now()->subDay()->toISOString(),
            ],
        ]);
    }
}
