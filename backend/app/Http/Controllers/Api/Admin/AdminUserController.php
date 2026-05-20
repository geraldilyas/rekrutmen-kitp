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
     * List admins based on hierarchy.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = User::where('role', 'admin');

        if ($user->admin_level == 1) {
            // Level 1 sees everyone
        } elseif ($user->admin_level == 2) {
            // Level 2 sees their Level 3 subordinates
            $query->where('parent_id', $user->id);
        } else {
            // Level 3 sees no one or just themselves
            return response()->json([]);
        }

        return response()->json($query->latest()->get());
    }

    /**
     * Create a new admin user.
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|max:100',
            'admin_level' => [
                'required',
                'integer',
                Rule::in([1, 2, 3]),
                function ($attribute, $value, $fail) use ($currentUser) {
                    if ($currentUser->admin_level == 2 && $value != 3) {
                        $fail('Admin Level 2 hanya dapat membuat Admin Level 3.');
                    }
                    if ($currentUser->admin_level == 3) {
                        $fail('Admin Level 3 tidak dapat membuat admin baru.');
                    }
                },
            ],
        ]);

        $admin = User::create([
            'name' => strip_tags($validated['name']),
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'admin',
            'admin_level' => $validated['admin_level'],
            'parent_id' => $currentUser->id,
        ]);

        return response()->json([
            'message' => 'Admin baru berhasil dibuat',
            'data' => $admin
        ], 201);
    }
}
