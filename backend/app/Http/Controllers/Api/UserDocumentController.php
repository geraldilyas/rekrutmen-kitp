<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use Illuminate\Http\Request;

class UserDocumentController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->documents);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|max:50',
            'url'  => 'required|url|max:1000',
        ]);

        $user = $request->user();
        
        // Update or create document link of same type
        $doc = UserDocument::updateOrCreate(
            ['user_id' => $user->id, 'type' => $request->type],
            ['file_path' => $request->url]
        );

        return response()->json([
            'message' => 'Tautan dokumen berhasil disimpan',
            'data' => $doc
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $doc = $request->user()->documents()->findOrFail($id);
        $doc->delete();

        return response()->json(['message' => 'Tautan dokumen berhasil dihapus']);
    }
}
