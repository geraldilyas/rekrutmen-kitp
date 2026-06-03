<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;

class UserDocumentController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * List user documents.
     */
    public function index(Request $request)
    {
        return response()->json($request->user()->documents);
    }

    /**
     * Store or update a user document.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'url'  => 'required|url|max:1000',
        ]);

        $doc = $this->userService->saveDocument($request->user(), $validated);

        return response()->json([
            'message' => 'Tautan dokumen berhasil disimpan',
            'data' => $doc
        ], 200);
    }

    /**
     * Delete a user document.
     */
    public function destroy(Request $request, $id)
    {
        $this->userService->deleteDocument($request->user(), (int)$id);
        return response()->json(['message' => 'Tautan dokumen berhasil dihapus']);
    }
}

