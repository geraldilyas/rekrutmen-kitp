<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class BaseExternalService
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->initialize();
    }

    abstract protected function initialize(): void;

    protected function request()
    {
        return Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Accept' => 'application/json',
            'X-Proxy-By' => config('app.name'),
        ])->baseUrl($this->baseUrl);
    }

    protected function logSecure(string $message, array $context = []): void
    {
        $sanitizedContext = collect($context)->map(function ($value, $key) {
            if (str_contains(strtolower($key), 'key') || str_contains(strtolower($key), 'token')) {
                return '********';
            }
            return $value;
        })->toArray();

        Log::info("[SecureProxy] " . $message, $sanitizedContext);
    }
}
