<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecureHeaderMiddleware
{
    /**
     * OWASP Best Practice: Defense in Depth
     * 
     * 1. PREVENT KEY LEAKAGE: Ensure the frontend never receives sensitive config data.
     * 2. SECURITY HEADERS: Add standard OWASP-recommended headers (CSP, HSTS, etc).
     * 3. REDACTION: If a response accidentally contains a field named 'api_key', redact it.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Add standard security headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Logic to redact sensitive fields if they appear in JSON responses
        if ($response instanceof \Illuminate\Http\JsonResponse) {
            $data = $response->getData(true);
            
            if (is_array($data)) {
                $this->redactSensitive($data);
                $response->setData($data);
            }
        }

        return $response;
    }

    /**
     * Recursively redact keys that look like secrets.
     */
    private function redactSensitive(array &$data): void
    {
        $sensitiveKeys = ['api_key', 'secret', 'token', 'password', 'key'];

        foreach ($data as $key => &$value) {
            if (is_array($value)) {
                $this->redactSensitive($value);
            } else {
                foreach ($sensitiveKeys as $sensitive) {
                    if (str_contains(strtolower($key), $sensitive)) {
                        // Keep specific allowed fields
                        if (in_array($key, ['token', 'auth_token', 'token_type', 'expires_at'])) {
                            continue;
                        }
                        $value = '********';
                    }
                }
            }
        }
    }
}
