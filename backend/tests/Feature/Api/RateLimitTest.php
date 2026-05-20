<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;

class RateLimitTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function auth_endpoints_have_strict_rate_limiting()
    {
        // Hit the login endpoint 10 times (the limit)
        for ($i = 0; $i < 10; $i++) {
            $this->postJson('/api/auth/login', [
                'email' => 'hacker@example.com',
                'password' => 'wrong-password'
            ])->assertStatus(401);
        }

        // The 11th time should be throttled
        $response = $this->postJson('/api/auth/login', [
            'email' => 'hacker@example.com',
            'password' => 'wrong-password'
        ]);

        $response->assertStatus(429)
            ->assertJson([
                'message' => 'Terlalu banyak permintaan. Silakan coba lagi nanti.'
            ]);
    }

    /** @test */
    public function general_api_endpoints_have_rate_limiting()
    {
        // Hit a public endpoint 60 times (the limit)
        for ($i = 0; $i < 60; $i++) {
            $this->getJson('/api/jobs')->assertStatus(200);
        }

        // The 61st time should be throttled
        $response = $this->getJson('/api/jobs');

        $response->assertStatus(429);
    }
}
