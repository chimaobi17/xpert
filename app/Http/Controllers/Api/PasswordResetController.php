<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Rate limit: 3 requests per 5 minutes per email
        $key = 'password-reset:' . $request->email;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            return response()->json([
                'message' => 'Too many reset requests. Please try again later.',
            ], 429);
        }
        RateLimiter::hit($key, 300);

        // Always return success to prevent email enumeration
        $user = User::where('email', $request->email)->first();

        if ($user) {
            $token = Str::random(64);

            $user->update([
                'reset_token' => Hash::make($token),
                'reset_token_expires_at' => now()->addMinutes(30),
            ]);

            $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
            $resetUrl = "{$frontendUrl}/reset-password?token={$token}&email={$user->email}";

            Mail::to($user->email)->send(new PasswordResetMail(
                resetUrl: $resetUrl,
                userName: $user->name,
            ));
        }

        return response()->json([
            'message' => 'If an account with that email exists, a password reset link has been sent.',
        ]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! $user->reset_token) {
            return response()->json([
                'message' => 'Invalid or expired reset link.',
            ], 422);
        }

        if ($user->reset_token_expires_at && $user->reset_token_expires_at->isPast()) {
            $user->update(['reset_token' => null, 'reset_token_expires_at' => null]);
            return response()->json([
                'message' => 'This reset link has expired. Please request a new one.',
            ], 422);
        }

        if (! Hash::check($request->token, $user->reset_token)) {
            return response()->json([
                'message' => 'Invalid or expired reset link.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'reset_token' => null,
            'reset_token_expires_at' => null,
        ]);

        // Revoke all existing tokens for security
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password reset successfully. You can now log in.',
        ]);
    }
}
