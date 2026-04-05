<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::forUser($request->user()->id)
            ->latest()
            ->limit(50)
            ->get();

        return response()->json($notifications);
    }

    public function markRead(Request $request, Notification $notification)
    {
        // Users can only mark their own or announcement notifications
        if ($notification->user_id && $notification->user_id !== $request->user()->id) {
            return response()->json(['error' => 'forbidden'], 403);
        }

        $notification->update(['read' => true]);

        return response()->json($notification);
    }

    public function markAllRead(Request $request)
    {
        Notification::forUser($request->user()->id)
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Admin: broadcast an announcement to all users (user_id = null).
     */
    public function broadcast(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $notification = Notification::create([
            'user_id' => null,
            'type' => 'announcement',
            'title' => $request->title,
            'message' => $request->message,
        ]);

        return response()->json($notification, 201);
    }
}
