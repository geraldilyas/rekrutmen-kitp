<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Services\UserService;

class AdminUserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * List all users for the admin panel.
     */
    public function index(Request $request)
    {
        $users = $this->userService->getUsers($request->all());
        return response()->json($users);
    }

    /**
     * Create a new staff user (admin or penyeleksi).
     */
    public function store(Request $request)
    {
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

        try {
            $user = $this->userService->createStaff($request->user(), $validated);

            return response()->json([
                'message' => 'User berhasil dibuat',
                'data'    => $user,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Update an existing staff user.
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
            $validated['password'] = \Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        unset($validated['password_confirmation']);

        $user = $this->userService->updateProfile($user, $validated);

        return response()->json(['message' => 'User berhasil diupdate', 'data' => $user]);
    }

    /**
     * Get registered users (role = user).
     */
    public function users(Request $request)
    {
        $users = $this->userService->getRegisteredUsers($request->user(), $request->all());
        return response()->json($users);
    }

    /**
     * Update a registered user.
     */
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

        $user = $this->userService->updateProfile($user, $validated);

        return response()->json(['message' => 'User berhasil diupdate', 'data' => $user]);
    }

    /**
     * Toggle email verification for a registered user.
     */
    public function toggleVerification($id)
    {
        $user = User::where('role', 'user')->findOrFail($id);
        $user = $this->userService->toggleVerification($user);

        return response()->json(['message' => 'Status verifikasi diperbarui', 'data' => $user]);
    }

    /**
     * Delete a user.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Tidak dapat menghapus diri sendiri'], 422);
        }

        $this->userService->deleteUser($user);

        return response()->json(['message' => 'User berhasil dihapus']);
    }
}

