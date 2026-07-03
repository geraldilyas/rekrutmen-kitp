<?php

namespace App\Services;

use App\Models\User;
use App\Models\BlacklistedNik;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class UserService
{
    /**
     * Register a new user.
     */
    public function register(array $data)
    {
        $user = User::create([
            'name' => strip_tags($data['name']),
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'nik' => $data['nik'] ?? null,
            'role' => $data['role'] ?? 'user'
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Login a user.
     */
    public function login(string $email, string $password)
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw new \Exception('Email atau password salah', 401);
        }

        if ($user->nik && BlacklistedNik::where('nik', $user->nik)->exists()) {
            throw new \Exception('Akun ini telah diblokir oleh admin.', 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Get users with filters and pagination.
     */
    public function getUsers(array $filters, int $perPage = 10)
    {
        $query = User::query();

        if (!empty($filters['search'])) {
            $q = $filters['search'];
            $query->where(function ($q2) use ($q) {
                $q2->where('name', 'like', "%{$q}%")
                  ->orWhere('email', 'like', "%{$q}%")
                  ->orWhere('nik', 'like', "%{$q}%");
            });
        }

        if (!empty($filters['role']) && $filters['role'] !== 'all') {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['verification']) && $filters['verification'] !== 'all') {
            if ($filters['verification'] === 'verified') {
                $query->whereNotNull('email_verified_at');
            } else {
                $query->whereNull('email_verified_at');
            }
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Create an admin or penyeleksi user.
     */
    public function createStaff(User $authUser, array $data)
    {
        if ($authUser->admin_level === 3) {
            throw new \Exception('L3 admin cannot create users', 422);
        }

        if ($authUser->admin_level === 2 && ($data['admin_level'] ?? 3) != 3) {
            throw new \Exception('L2 admin can only create L3 admins', 422);
        }

        return User::create([
            'name'        => strip_tags($data['name']),
            'email'       => $data['email'],
            'password'    => Hash::make($data['password']),
            'phone'       => $data['phone'] ?? null,
            'address'     => $data['address'] ?? null,
            'role'        => $data['role'],
            'admin_level' => $data['admin_level'] ?? null,
            'parent_id'   => $data['parent_id'] ?? $authUser->id,
        ]);
    }

    /**
     * Update user profile.
     */
    public function updateProfile(User $user, array $data)
    {
        $user->update($data);
        return $user;
    }

    /**
     * Change user password.
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword)
    {
        if (!Hash::check($currentPassword, $user->password)) {
            throw new \Exception('Kata sandi saat ini tidak sesuai', 422);
        }

        $user->update([
            'password' => Hash::make($newPassword)
        ]);
    }

    /**
     * Get registered users (role = user) with filters.
     */
    public function getRegisteredUsers(User $authUser, array $filters, int $perPage = 10)
    {
        $query = $authUser->role === 'admin'
            ? User::query()
            : User::where('role', 'user');

        if (!empty($filters['search'])) {
            $q = $filters['search'];
            $query->where(function ($q2) use ($q) {
                $q2->where('name', 'like', "%{$q}%")
                ->orWhere('email', 'like', "%{$q}%")
                ->orWhere('nik', 'like', "%{$q}%");
            });
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Toggle email verification for a user.
     */
    public function toggleVerification(User $user)
    {
        $user->email_verified_at = $user->email_verified_at ? null : now();
        $user->save();
        return $user;
    }

    /**
     * Delete a user.
     */
    public function deleteUser(User $user)
    {
        return $user->delete();
    }

    /**
     * Update or create a user document link.
     */
    public function saveDocument(User $user, array $data)
    {
        return \App\Models\UserDocument::updateOrCreate(
            ['user_id' => $user->id, 'type' => $data['type']],
            ['file_path' => $data['url']]
        );
    }

    /**
     * Delete a user document.
     */
    public function deleteDocument(User $user, int $documentId)
    {
        $doc = $user->documents()->findOrFail($documentId);
        return $doc->delete();
    }
}
