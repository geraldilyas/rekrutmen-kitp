<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserRoleTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function pelamar_must_provide_nik()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Pelamar Test',
            'email' => 'pelamar@test.com',
            'password' => 'password123',
            'role' => 'user'
            // NIK missing
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['nik']);
    }

    /** @test */
    public function admin_does_not_need_nik()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'password' => 'password123',
            'role' => 'admin'
            // NIK missing
        ]);

        $response->assertStatus(201);
    }
}
