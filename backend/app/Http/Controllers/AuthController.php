<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|confirmed|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        \Log::info('Login attempt started', ['email' => $request->email]);

        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        \Log::info('Validation passed for login', ['email' => $request->email]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            \Log::warning('User not found', ['email' => $request->email]);
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        \Log::info('User found', ['email' => $request->email, 'user_id' => $user->id]);

        if (!Hash::check($request->password, $user->password)) {
            \Log::warning('Password check failed', ['email' => $request->email, 'user_id' => $user->id]);
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        \Log::info('Password check passed, creating token', ['email' => $request->email, 'user_id' => $user->id]);

        $token = $user->createToken('api-token')->plainTextToken;

        \Log::info('Token created successfully', ['email' => $request->email, 'user_id' => $user->id]);

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}

