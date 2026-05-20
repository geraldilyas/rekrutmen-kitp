<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ApplicationDocument;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class DocumentController extends Controller
{
    public function download($id)
    {
        $document = ApplicationDocument::findOrFail($id);
        
        $path = $document->file_path;

        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->download($path);
        }

        if (file_exists(public_path($path))) {
            return response()->download(public_path($path));
        }

        return response()->json([
            'message' => 'File tidak ditemukan di server.',
            'path' => $path
        ], 404);
    }
}
