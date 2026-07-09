<?php

namespace Tests\Feature\Api\Admin;

use Tests\TestCase;
use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use App\Models\JobStage;
use App\Models\ApplicationStageResult;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class AdminFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        // Create an admin user and authenticate
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($this->admin, 'sanctum');
    }

    /** @test */
    public function it_can_retrieve_dashboard_statistics()
    {
        // 1. Arrange: Create dummy data
        Job::factory()->count(3)->create(['category' => 'tenaga_pendukung']);
        Job::factory()->count(2)->create(['category' => 'konsultan_individu']);
        
        // 2. Act: Call the dashboard endpoint
        $response = $this->getJson('/api/admin/statistics/dashboard');

        // 3. Assert: Verify the response structure and some counts
        $response->assertStatus(200)
            ->assertJsonStructure([
                'total_jobs',
                'total_applications',
                'total_applicants',
                'applications_by_status',
                'applications_by_category'
            ])
            ->assertJson(['total_jobs' => 5]);
    }

    /** @test */
    public function it_can_list_closed_jobs_for_reports()
    {
        // 1. Arrange: Create one open and one closed job
        Job::factory()->create([
            'title' => 'Open Job',
            'deadline' => Carbon::now()->addDays(5)
        ]);
        
        Job::factory()->create([
            'title' => 'Closed Job',
            'deadline' => Carbon::now()->subDays(5)
        ]);

        // 2. Act
        $response = $this->getJson('/api/admin/reports/closed-jobs');

        // 3. Assert: Should only see the closed job
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Closed Job');
    }

    /** @test */
    public function it_can_export_applications_for_a_specific_job()
    {
        // 1. Arrange: Create a job and an application
        $job = Job::factory()->create(['title' => 'Target Job']);
        $user = User::factory()->create(['role' => 'user']);
        Application::create([
            'user_id' => $user->id,
            'job_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now()
        ]);

        // 2. Act: Request export
        $response = $this->getJson("/api/admin/reports/export/{$job->id}");

        // 3. Assert: Verify it returns a download response (Excel)
        $response->assertStatus(200);
        $this->assertTrue(
            str_contains($response->headers->get('content-disposition'), 'attachment')
        );
        $this->assertTrue(
            str_contains($response->headers->get('content-disposition'), 'pelamar-target-job')
        );
    }

    /** @test */
    public function it_can_retrieve_stage_statistics()
    {
        $job = Job::factory()->create();
        $stage = JobStage::create([
            'job_id' => $job->id,
            'name' => 'Interview',
            'stage_order' => 1
        ]);
        
        $user = User::factory()->create();
        $app = Application::create([
            'user_id' => $user->id,
            'job_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now()
        ]);

        ApplicationStageResult::create([
            'application_id' => $app->id,
            'job_stage_id' => $stage->id,
            'status' => 'lulus'
        ]);

        $response = $this->getJson('/api/admin/statistics/stages');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'job_stage_id' => $stage->id,
                'status' => 'lulus',
                'total' => 1
            ]);
    }

    /** @test */
    public function it_returns_404_when_exporting_non_existent_job()
    {
        $response = $this->getJson("/api/admin/reports/export/999");
        $response->assertStatus(404);
    }

    /** @test */
    public function it_blocks_grading_if_stage_assessment_has_not_started_yet()
    {
        $job = Job::factory()->create();
        $stage = JobStage::create([
            'job_id' => $job->id,
            'name' => 'Wawancara',
            'stage_order' => 1,
            'start_date' => Carbon::now()->addHours(2), // Starts in 2 hours
            'end_date' => Carbon::now()->addHours(5),
        ]);
        
        $user = User::factory()->create();
        $app = Application::create([
            'user_id' => $user->id,
            'job_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now()
        ]);

        $stageResult = ApplicationStageResult::create([
            'application_id' => $app->id,
            'job_stage_id' => $stage->id,
            'status' => 'pending'
        ]);

        $response = $this->putJson("/api/admin/applications/stages/{$stageResult->id}", [
            'status' => 'lulus',
            'score' => 90,
            'notes' => 'Good job'
        ]);

        $response->assertStatus(403);
        $response->assertJsonPath('message', 'Tahap "Wawancara" belum dapat dinilai. Penilaian dibuka mulai ' . Carbon::parse($stage->start_date)->format('d/m/Y H:i'));
    }

    /** @test */
    public function it_blocks_grading_if_stage_assessment_has_expired()
    {
        $job = Job::factory()->create();
        $stage = JobStage::create([
            'job_id' => $job->id,
            'name' => 'Wawancara',
            'stage_order' => 1,
            'start_date' => Carbon::now()->subHours(5),
            'end_date' => Carbon::now()->subHours(2), // Ended 2 hours ago
        ]);
        
        $user = User::factory()->create();
        $app = Application::create([
            'user_id' => $user->id,
            'job_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now()
        ]);

        $stageResult = ApplicationStageResult::create([
            'application_id' => $app->id,
            'job_stage_id' => $stage->id,
            'status' => 'pending'
        ]);

        $response = $this->putJson("/api/admin/applications/stages/{$stageResult->id}", [
            'status' => 'lulus',
            'score' => 90,
            'notes' => 'Good job'
        ]);

        $response->assertStatus(403);
        $response->assertJsonPath('message', 'Masa penilaian untuk tahap "Wawancara" sudah berakhir pada ' . Carbon::parse($stage->end_date)->format('d/m/Y H:i'));
    }

    /** @test */
    public function it_allows_grading_if_stage_assessment_is_currently_active_including_same_day()
    {
        $job = Job::factory()->create();
        $stage = JobStage::create([
            'job_id' => $job->id,
            'name' => 'Wawancara',
            'stage_order' => 1,
            'start_date' => Carbon::now()->subHours(1), // Started 1 hour ago
            'end_date' => Carbon::now()->addHours(1),   // Ends in 1 hour
        ]);
        
        $user = User::factory()->create();
        $app = Application::create([
            'user_id' => $user->id,
            'job_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now()
        ]);

        $stageResult = ApplicationStageResult::create([
            'application_id' => $app->id,
            'job_stage_id' => $stage->id,
            'status' => 'pending'
        ]);

        $response = $this->putJson("/api/admin/applications/stages/{$stageResult->id}", [
            'status' => 'lulus',
            'score' => 90,
            'notes' => 'Good job'
        ]);

        $response->assertStatus(200);
        $this->assertEquals('lulus', $stageResult->fresh()->status);
        $this->assertEquals(90, $stageResult->fresh()->score);
    }
}
