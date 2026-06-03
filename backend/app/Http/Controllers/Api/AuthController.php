<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * REGISTER user.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|max:100',
            'role' => 'sometimes|in:admin,user',
            'nik' => [
                'required_if:role,user',
                'nullable',
                'string',
                'digits:16',
                'unique:users,nik'
            ]
        ]);

        $result = $this->userService->register($validated);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user' => $result['user'],
            'token' => $result['token']
        ], 201);
    }

    /**
     * LOGIN user.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|max:100'
        ]);

        try {
            $result = $this->userService->login($validated['email'], $validated['password']);

            return response()->json([
                'message' => 'Login berhasil',
                'token' => $result['token'],
                'user' => $result['user']
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 401);
        }
    }

    /**
     * LOGOUT user.
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }

    /**
     * UPDATE PROFILE.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'    => 'sometimes|string|max:255',
            'email'   => ['sometimes', 'email', \Illuminate\Validation\Rule::unique('users')->ignore($user->id)],
            'phone'   => 'sometimes|nullable|string|max:20',
            'address' => 'sometimes|nullable|string|max:500',
        ]);

        $user = $this->userService->updateProfile($user, $validated);

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user'    => $user
        ]);
    }

    /**
     * CHANGE PASSWORD.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8|confirmed',
        ]);

        try {
            $this->userService->changePassword($request->user(), $request->current_password, $request->new_password);

            return response()->json([
                'message' => 'Kata sandi berhasil diubah'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}