<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // 🚀 WAJIB DIIMPORT UNTUK PENGELOLAAN FILE

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

        if (!empty($validated['nik']) && \App\Models\BlacklistedNik::where('nik', $validated['nik'])->exists()) {
            return response()->json([
                'message' => 'NIK ini telah diblokir dan tidak dapat digunakan untuk mendaftar.',
            ], 403);
        }

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

    /**
     * 🚀 UPDATE AVATAR / PASFOTO USER.
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            // 1. Hapus pasfoto lama dari storage jika sebelumnya sudah pernah upload
            if ($user->avatar_path && Storage::disk('public')->exists($user->avatar_path)) {
                Storage::disk('public')->delete($user->avatar_path);
            }

            // 2. Simpan file pasfoto baru ke folder 'storage/app/public/avatars'
            $path = $request->file('avatar')->store('avatars', 'public');

            // 3. Update field avatar_path ke record user di DB
            $user->update([
                'avatar_path' => $path
            ]);

            // 4. Kirim respons balik ke React beserta link URL gambar utuh
            return response()->json([
                'message' => 'Pasfoto berhasil diperbarui',
                'avatar_url' => asset('storage/' . $path) 
            ], 200);
        }

        return response()->json(['message' => 'File tidak ditemukan'], 400);
    }
}