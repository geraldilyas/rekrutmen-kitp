<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PublicFileController extends Controller
{
    /**
     * Serve a file from the 'public' disk (storage/app/public/...) directly
     * through Laravel, without relying on the `public/storage` symlink.
     *
     * This mirrors what `php artisan storage:link` would normally expose at
     * /storage/{path}, but works even when the symlink is missing/broken or
     * unsupported by the hosting environment.
     */
    public function show(Request $request, string $path): StreamedResponse
    {
        // Reject path traversal attempts (../, encoded variants, etc.)
        $normalized = str_replace('\\', '/', $path);
        if (str_contains($normalized, '..') || str_starts_with($normalized, '/')) {
            abort(404);
        }

        $disk = Storage::disk('public');

        if (!$disk->exists($normalized)) {
            abort(404);
        }

        $mimeType = $disk->mimeType($normalized) ?: 'application/octet-stream';
        $filename = basename($normalized);

        // Inline so PDFs/images open in a new tab instead of forcing a download.
        return $disk->response($normalized, $filename, [
            'Content-Type'  => $mimeType,
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}