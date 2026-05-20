<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class CoreApiRegressionTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function users_can_register()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'nik' => '1234567890123456'
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['user', 'token']);
        
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    /** @test */
    public function users_can_login()
    {
        $user = User::factory()->create([
            'email' => 'jane@example.com',
            'password' => Hash::make('secret123')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'jane@example.com',
            'password' => 'secret123'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user', 'token']);
    }

    /** @test */
    public function anyone_can_list_jobs_with_optional_filter()
    {
        Job::factory()->create(['category' => 'tenaga_pendukung', 'title' => 'Support Staff']);
        Job::factory()->create(['category' => 'konsultan_individu', 'title' => 'Expert Consultant']);

        // Test global list
        $response = $this->getJson('/api/jobs');
        $response->assertStatus(200)->assertJsonCount(2);

        // Test filtered list (RESTful query param)
        $response = $this->getJson('/api/jobs?category=tenaga_pendukung');
        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.title', 'Support Staff');
    }

    /** @test */
    public function authenticated_users_can_apply_for_a_job()
    {
        $user = User::factory()->create(['role' => 'user']);
        $job = Job::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/applications', [
                'job_id' => $job->id,
                'documents' => [
                    ['type' => 'cv', 'file_path' => 'uploads/cv.pdf']
                ]
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Lamaran berhasil dikirim');
        
        $this->assertDatabaseHas('applications', [
            'user_id' => $user->id,
            'job_id' => $job->id
        ]);
    }

    /** @test */
    public function authenticated_users_can_see_their_own_applications()
    {
        $user = User::factory()->create();
        $job = Job::factory()->create();
        Application::create([
            'user_id' => $user->id,
            'job_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now()
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/applications/my');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.job.id', $job->id);
    }
}
