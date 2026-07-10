<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'staff' => \App\Http\Middleware\StaffMiddleware::class,
            ]);

        // Trust the reverse proxy that terminates TLS in front of this container,
        // so Request::isSecure() (and every url()/route() built from it) reflects
        // the real https:// connection instead of the plain-http hop behind the proxy.
        $middleware->trustProxies(at: '*');

        $middleware->append(\App\Http\Middleware\SecureHeaderMiddleware::class);
    })
    ->withExceptions(function ($exceptions) {
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        });

        $exceptions->render(function (\Illuminate\Http\Exceptions\ThrottleRequestsException $e, $request) {
            return response()->json([
                'message' => 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
                'retry_after' => $e->getHeaders()['Retry-After'] ?? null
            ], 429);
        });
    })->create();
