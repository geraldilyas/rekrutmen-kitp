<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB
        ]);

        $user = $request->user();
        
        // Remove old document of same type if exists (to keep it a "Master" document)
        $oldDoc = $user->documents()->where('type', $request->type)->first();
        if ($oldDoc) {
            Storage::disk('public')->delete($oldDoc->file_path);
            $oldDoc->delete();
        }

        $path = $request->file('file')->store('user_documents/' . $user->id, 'public');

        $doc = UserDocument::create([
            'user_id' => $user->id,
            'type' => $request->type,
            'file_path' => $path,
            'file_name' => $request->file('file')->getClientOriginalName(),
        ]);

        return response()->json([
            'message' => 'Dokumen berhasil diunggah',
            'data' => $doc
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $doc = $request->user()->documents()->findOrFail($id);
        Storage::disk('public')->delete($doc->file_path);
        $doc->delete();

        return response()->json(['message' => 'Dokumen berhasil dihapus']);
    }
}
