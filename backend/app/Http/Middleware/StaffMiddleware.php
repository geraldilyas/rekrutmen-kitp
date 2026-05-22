<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class StaffMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $role = $request->user()?->role;

        if (!in_array($role, ['admin', 'penyeleksi'])) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}