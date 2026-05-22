<?php

namespace Tests\Feature\Api\Admin;

use Tests\TestCase;
use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class AdminHierarchyTest extends TestCase
{
    use RefreshDatabase;

    protected $adminL1;
    protected $adminL2;
    protected $adminL3;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->adminL1 = User::factory()->create(['role' => 'admin', 'admin_level' => 1]);
        
        $this->adminL2 = User::factory()->create([
            'role' => 'admin', 
            'admin_level' => 2, 
            'parent_id' => $this->adminL1->id
        ]);

        $this->adminL3 = User::factory()->create([
            'role' => 'admin', 
            'admin_level' => 3, 
            'parent_id' => $this->adminL2->id
        ]);
    }

    /** @test */
    public function l1_can_create_l1_l2_and_l3()
    {
        $levels = [1, 2, 3];
        
        foreach ($levels as $level) {
            $response = $this->actingAs($this->adminL1, 'sanctum')
                ->postJson('/api/admin/users', [
                    'name' => "New Admin L$level",
                    'email' => "l1_created_$level@example.com",
                    'password' => 'password123',
                    'password_confirmation' => 'password123',
                    'admin_level' => $level,
                    'role' => 'admin'
                ]);

            $response->assertStatus(201);
            $this->assertDatabaseHas('users', ['email' => "l1_created_$level@example.com", 'admin_level' => $level]);
        }
    }

    /** @test */
    public function l2_can_only_create_l3()
    {
        // Should succeed
        $response = $this->actingAs($this->adminL2, 'sanctum')
            ->postJson('/api/admin/users', [
                'name' => "New Admin L3",
                'email' => "l2_created_l3@example.com",
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'admin_level' => 3,
                'role' => 'admin'
            ]);
        $response->assertStatus(201);

        // Should fail for L2
        $response = $this->actingAs($this->adminL2, 'sanctum')
            ->postJson('/api/admin/users', [
                'name' => "New Admin L2",
                'email' => "l2_created_l2@example.com",
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'admin_level' => 2,
                'role' => 'admin'
            ]);
        $response->assertStatus(422);
    }

    /** @test */
    public function l3_cannot_create_admins()
    {
        $response = $this->actingAs($this->adminL3, 'sanctum')
            ->postJson('/api/admin/users', [
                'name' => "New Admin",
                'email' => "l3_created@example.com",
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'admin_level' => 3,
                'role' => 'admin'
            ]);
        $response->assertStatus(422);
    }

    /** @test */
    public function data_visibility_scoping()
    {
        // L1 Job
        $jobL1 = Job::factory()->create(['title' => 'L1 Job', 'created_by' => $this->adminL1->id]);
        
        // L2 Job
        $jobL2 = Job::factory()->create(['title' => 'L2 Job', 'created_by' => $this->adminL2->id]);

        // L1 should see both
        $this->actingAs($this->adminL1, 'sanctum')
            ->getJson('/api/jobs')
            ->assertJsonCount(2);

        // L2 should see only their own
        $this->actingAs($this->adminL2, 'sanctum')
            ->getJson('/api/jobs')
            ->assertJsonCount(1)
            ->assertJsonPath('0.title', 'L2 Job');

        // L3 should see their parent's (L2) job
        $this->actingAs($this->adminL3, 'sanctum')
            ->getJson('/api/jobs')
            ->assertJsonCount(1)
            ->assertJsonPath('0.title', 'L2 Job');
    }
}
