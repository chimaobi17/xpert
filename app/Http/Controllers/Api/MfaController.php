<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MfaController extends Controller
{
    public function enable(Request $request)
    {
        $user = $request->user();

        if ($user->two_factor_enabled) {
            return response()->json(['message' => 'Two-factor authentication is already enabled.'], 409);
        }

        $secret = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->update([
            'two_factor_secret' => Hash::make($secret),
            'two_factor_enabled' => false,
        ]);

        // In production, send this via email/SMS. For now, return it.
        return response()->json([
            'message' => 'Verify this code to enable 2FA.',
            'code' => $secret,
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        if (!$user->two_factor_secret) {
            return response()->json(['error' => 'mfa_not_setup', 'message' => 'Please enable 2FA first.'], 400);
        }

        if (!Hash::check($request->code, $user->two_factor_secret)) {
            return response()->json(['error' => 'invalid_code', 'message' => 'Invalid verification code.'], 422);
        }

        $user->update(['two_factor_enabled' => true]);

        return response()->json(['message' => 'Two-factor authentication enabled successfully.']);
    }

    public function verifyLogin(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $user = User::findOrFail($request->user_id);

        if (!Hash::check($request->code, $user->two_factor_secret)) {
            return response()->json(['error' => 'invalid_code', 'message' => 'Invalid verification code.'], 422);
        }

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function disable(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'invalid_password', 'message' => 'Incorrect password.'], 422);
        }

        $user->update([
            'two_factor_secret' => null,
            'two_factor_enabled' => false,
        ]);

        return response()->json(['message' => 'Two-factor authentication disabled.']);
    }
}
