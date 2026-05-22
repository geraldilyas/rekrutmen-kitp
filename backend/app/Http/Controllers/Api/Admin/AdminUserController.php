<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    /**
     * List all users for the admin panel.
     */
    public function index(Request $request)
    {
        $users = User::latest()->get();
        return response()->json($users);
    }

    /**
     * Create a new admin or penyeleksi user.
     */
    public function store(Request $request)
    {
        $authUser = $request->user();
        
        // Hierarchy Check
        if ($authUser->admin_level === 3) {
            return response()->json(['message' => 'L3 admin cannot create users'], 422);
        }

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|string|email|max:255|unique:users',
            'password'    => 'required|string|min:8|max:100|confirmed',
            'phone'       => 'nullable|string|max:20',
            'address'     => 'nullable|string|max:500',
            'role'        => 'required|in:admin,penyeleksi',
            'admin_level' => 'nullable|integer|in:1,2,3',
            'parent_id'   => 'nullable|exists:users,id',
        ]);

        if ($authUser->admin_level === 2 && ($validated['admin_level'] ?? 3) != 3) {
            return response()->json(['message' => 'L2 admin can only create L3 admins'], 422);
        }

        $user = User::create([
            'name'        => strip_tags($validated['name']),
            'email'       => $validated['email'],
            'password'    => Hash::make($validated['password']),
            'phone'       => $validated['phone'] ?? null,
            'address'     => $validated['address'] ?? null,
            'role'        => $validated['role'],
            'admin_level' => $validated['admin_level'] ?? null,
            'parent_id'   => $validated['parent_id'] ?? $authUser->id,
        ]);

        return response()->json([
            'message' => 'User berhasil dibuat',
            'data'    => $user,
        ], 201);
    }

    /**
     * Update an existing admin or penyeleksi user.
     */
    public function update(Request $request, $id)
    {
        $user = User::whereIn('role', ['admin', 'penyeleksi'])->findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'email'       => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password'    => 'nullable|string|min:8|max:100|confirmed',
            'phone'       => 'sometimes|nullable|string|max:20',
            'address'     => 'sometimes|nullable|string|max:500',
            'role'        => 'sometimes|in:admin,penyeleksi',
            'admin_level' => 'sometimes|nullable|integer|in:1,2,3',
            'parent_id'   => 'sometimes|nullable|exists:users,id',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        unset($validated['password_confirmation']);

        $user->update($validated);

        return response()->json(['message' => 'User berhasil diupdate', 'data' => $user]);
    }

    public function users(Request $request)
        {
            $authUser = $request->user();
            
            $query = $authUser->role === 'admin'
                ? User::query()
                : User::where('role', 'user');

            if ($request->search) {
                $q = $request->search;
                $query->where(function ($q2) use ($q) {
                    $q2->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%")
                    ->orWhere('nik', 'like', "%{$q}%");
                });
            }

            return response()->json($query->latest()->get());
        }

    
        public function updateUser(Request $request, $id)
        {
            $user = User::where('role', 'user')->findOrFail($id);

            $validated = $request->validate([
                'name'    => 'sometimes|string|max:255',
                'email'   => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
                'nik'     => ['sometimes', 'digits:16', Rule::unique('users')->ignore($user->id)],
                'phone'   => 'sometimes|nullable|string|max:20',
                'address' => 'sometimes|nullable|string|max:500',
            ]);

            $user->update($validated);

            return response()->json(['message' => 'User berhasil diupdate', 'data' => $user]);
        }

        public function toggleVerification($id)
        {
            $user = User::where('role', 'user')->findOrFail($id);
            $user->email_verified_at = $user->email_verified_at ? null : now();
            $user->save();

            return response()->json(['message' => 'Status verifikasi diperbarui', 'data' => $user]);
        }
}
