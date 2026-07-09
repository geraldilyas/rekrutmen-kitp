<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // 🚀 WAJIB DIIMPORT UNTUK PENGELOLAAN FILE
use App\Models\User;
use App\Notifications\ResetPasswordCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

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

    /**
     * REQUEST PASSWORD RESET OTP.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Email tidak terdaftar di sistem kami.'
        ]);

        $email = $request->email;
        $code = (string) rand(100000, 999999);

        // Simpan ke database password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($code),
                'created_at' => Carbon::now()
            ]
        );

        // Kirim email
        $user = User::where('email', $email)->first();
        $user->notify(new ResetPasswordCode($code));

        return response()->json([
            'status' => 'success',
            'message' => 'Kode verifikasi berhasil dikirim ke email Anda.'
        ]);
    }

    /**
     * VERIFY OTP AND RESET PASSWORD.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.'
        ]);

        $resetRecord = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Permintaan reset tidak valid atau kode salah.'
            ], 422);
        }

        // Cek kadaluarsa (15 menit)
        if (Carbon::parse($resetRecord->created_at)->addMinutes(15)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'Kode verifikasi telah kadaluarsa. Silakan minta kode baru.'
            ], 422);
        }

        // Cek keabsahan kode OTP
        if (!Hash::check($request->code, $resetRecord->token)) {
            return response()->json([
                'message' => 'Kode verifikasi tidak cocok atau salah.'
            ], 422);
        }

        // Update password user
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Hapus token reset dari DB
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kata sandi Anda berhasil diperbarui. Silakan login.'
        ]);
    }
}