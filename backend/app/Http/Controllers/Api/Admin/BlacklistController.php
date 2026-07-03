<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlacklistedNik;
use App\Models\User;
use Illuminate\Http\Request;

class BlacklistController extends Controller
{
    /**
     * List blacklisted NIKs.
     */
    public function index(Request $request)
    {
        $query = BlacklistedNik::with('blacklistedBy')->latest();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(10));
    }

    /**
     * Blacklist a NIK directly (not necessarily tied to an existing user).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik'    => 'required|digits:16|unique:blacklisted_niks,nik',
            'name'   => 'nullable|string|max:255',
            'reason' => 'nullable|string|max:500',
        ]);

        $blacklisted = BlacklistedNik::create([
            'nik'            => $validated['nik'],
            'name'           => $validated['name'] ?? optional(User::where('nik', $validated['nik'])->first())->name,
            'reason'         => $validated['reason'] ?? null,
            'blacklisted_by' => $request->user()->id,
        ]);

        // Revoke any active sessions for a matching existing account so the block is immediate.
        $matchingUser = User::where('nik', $validated['nik'])->first();
        $matchingUser?->tokens()->delete();

        return response()->json([
            'message' => 'NIK berhasil ditambahkan ke daftar blokir',
            'data' => $blacklisted,
        ], 201);
    }

    /**
     * Blacklist the NIK belonging to an existing user, by user id.
     */
    public function blacklistUser(Request $request, $userId)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $user = User::findOrFail($userId);

        if (!$user->nik) {
            return response()->json(['message' => 'User ini tidak memiliki NIK terdaftar'], 422);
        }

        $blacklisted = BlacklistedNik::updateOrCreate(
            ['nik' => $user->nik],
            [
                'name'           => $user->name,
                'reason'         => $validated['reason'] ?? null,
                'blacklisted_by' => $request->user()->id,
            ]
        );

        $user->tokens()->delete();

        return response()->json([
            'message' => 'User berhasil diblokir',
            'data' => $blacklisted,
        ], 201);
    }

    /**
     * Remove a NIK from the blacklist.
     */
    public function destroy($id)
    {
        $blacklisted = BlacklistedNik::findOrFail($id);
        $blacklisted->delete();

        return response()->json(['message' => 'NIK berhasil dikeluarkan dari daftar blokir']);
    }
}
