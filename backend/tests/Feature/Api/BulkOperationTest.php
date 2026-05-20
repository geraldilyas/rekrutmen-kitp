<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BulkOperationTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create([
            'role' => 'admin',
            'admin_level' => 1
        ]);
    }

    /** @test */
    public function admin_can_bulk_delete_jobs()
    {
        $jobs = Job::factory()->count(3)->create(['created_by' => $this->admin->id]);
        
        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/bulk/jobs/delete', [
                'ids' => $jobs->pluck('id')->toArray()
            ]);

        $response->assertStatus(200);
        $this->assertEquals(0, Job::count()); // They are soft deleted
        $this->assertEquals(3, Job::withTrashed()->count());
    }

    /** @test */
    public function admin_can_bulk_update_application_status()
    {
        $job = Job::factory()->create(['created_by' => $this->admin->id]);
        $apps = Application::factory()->count(3)->create([
            'job_id' => $job->id,
            'status' => 'pending'
        ]);

        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/bulk/applications/status', [
                'ids' => $apps->pluck('id')->toArray(),
                'status' => 'seleksi',
                'notes' => 'Bulk moving to selection'
            ]);

        $response->assertStatus(200);
        $this->assertEquals(3, Application::where('status', 'seleksi')->count());
    }
}
