<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Job;
use App\Models\JobStage;
use App\Models\Application;
use App\Models\ApplicationStageResult;
use App\Notifications\ApplicationSubmitted;
use App\Notifications\ApplicationStatusUpdated;
use App\Notifications\ApplicationReminder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

/**
 * Covers every code path that changes an Application's status and asserts
 * the matching email notification is actually dispatched to the applicant.
 */
class ApplicationNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    protected function makeJobWithTwoStages(): Job
    {
        $job = Job::create([
            'title' => 'Tenaga Ahli IT',
            'category' => 'konsultan_individu',
            'description' => 'Membangun sistem rekrutmen',
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addDays(10),
            'deadline' => Carbon::now()->addMonth(),
            'created_by' => $this->admin->id,
        ]);

        JobStage::create([
            'job_id' => $job->id,
            'name' => 'Administrasi',
            'stage_order' => 1,
            'weight' => 40,
            'start_date' => Carbon::yesterday(),
            'end_date' => Carbon::now()->addDays(5),
        ]);

        JobStage::create([
            'job_id' => $job->id,
            'name' => 'Wawancara',
            'stage_order' => 2,
            'weight' => 60,
            'start_date' => Carbon::yesterday(),
            'end_date' => Carbon::now()->addDays(10),
        ]);

        return $job->load('stages');
    }

    /** @test */
    public function it_notifies_applicant_when_application_is_submitted()
    {
        Notification::fake();

        $job = $this->makeJobWithTwoStages();
        $applicant = User::factory()->create(['role' => 'user']);

        $this->actingAs($applicant, 'sanctum')
            ->postJson('/api/applications', ['job_id' => $job->id, 'answers' => []])
            ->assertStatus(200);

        Notification::assertSentTo($applicant, ApplicationSubmitted::class);
    }

    /** @test */
    public function it_notifies_applicant_when_a_stage_is_failed()
    {
        Notification::fake();

        $job = $this->makeJobWithTwoStages();
        $applicant = User::factory()->create(['role' => 'user']);
        $application = Application::create([
            'user_id' => $applicant->id,
            'job_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        $stageResult = ApplicationStageResult::create([
            'application_id' => $application->id,
            'job_stage_id' => $job->stages[0]->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/admin/applications/stages/{$stageResult->id}", [
                'status' => 'tidak_lulus',
                'score' => 40,
            ])->assertStatus(200);

        $this->assertEquals('Tidak Lulus', $application->fresh()->status);
        Notification::assertSentTo($applicant, ApplicationStatusUpdated::class);
    }

    /** @test */
    public function it_notifies_applicant_when_stage_passed_and_moved_to_next_stage()
    {
        Notification::fake();

        $job = $this->makeJobWithTwoStages();
        $applicant = User::factory()->create(['role' => 'user']);
        $application = Application::create([
            'user_id' => $applicant->id,
            'job_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        $stageResult = ApplicationStageResult::create([
            'application_id' => $application->id,
            'job_stage_id' => $job->stages[0]->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/admin/applications/stages/{$stageResult->id}", [
                'status' => 'lulus',
                'score' => 80,
            ])->assertStatus(200);

        $this->assertEquals('seleksi', $application->fresh()->status);
        Notification::assertSentTo($applicant, ApplicationStatusUpdated::class);
    }

    /** @test */
    public function it_notifies_applicant_when_the_final_stage_is_passed()
    {
        Notification::fake();

        $job = $this->makeJobWithTwoStages();
        $applicant = User::factory()->create(['role' => 'user']);
        $application = Application::create([
            'user_id' => $applicant->id,
            'job_id' => $job->id,
            'status' => 'seleksi',
            'applied_at' => now(),
        ]);

        $stageResult = ApplicationStageResult::create([
            'application_id' => $application->id,
            'job_stage_id' => $job->stages[1]->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/admin/applications/stages/{$stageResult->id}", [
                'status' => 'lulus',
                'score' => 90,
            ])->assertStatus(200);

        $this->assertEquals('pending_keputusan', $application->fresh()->status);
        Notification::assertSentTo($applicant, ApplicationStatusUpdated::class);
    }

    /** @test */
    public function it_notifies_applicant_when_admin_manually_changes_status()
    {
        Notification::fake();

        $job = $this->makeJobWithTwoStages();
        $applicant = User::factory()->create(['role' => 'user']);
        $application = Application::create([
            'user_id' => $applicant->id,
            'job_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/admin/applications/{$application->id}/status", [
                'status' => 'Tidak Lulus',
                'notes' => 'Tidak memenuhi syarat administrasi.',
            ])->assertStatus(200);

        Notification::assertSentTo($applicant, ApplicationStatusUpdated::class);
    }

    /** @test */
    public function reminder_command_emails_stale_applications_and_marks_them_reminded()
    {
        Notification::fake();

        $job = $this->makeJobWithTwoStages();
        $applicant = User::factory()->create(['role' => 'user']);
        $application = Application::create([
            'user_id' => $applicant->id,
            'job_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now()->subDays(10),
        ]);
        $application->timestamps = false;
        $application->updated_at = now()->subDays(10);
        $application->save();

        $this->artisan('app:send-application-reminders', ['--days' => 7])
            ->assertExitCode(0);

        Notification::assertSentTo($applicant, ApplicationReminder::class);
        $this->assertNotNull($application->fresh()->last_reminder_at);
    }

    /** @test */
    public function reminder_command_does_not_re_notify_within_the_threshold()
    {
        Notification::fake();

        $job = $this->makeJobWithTwoStages();
        $applicant = User::factory()->create(['role' => 'user']);
        $application = Application::create([
            'user_id' => $applicant->id,
            'job_id' => $job->id,
            'status' => 'pending',
            'applied_at' => now()->subDays(10),
            'last_reminder_at' => now()->subDays(2),
        ]);
        $application->timestamps = false;
        $application->updated_at = now()->subDays(10);
        $application->save();

        $this->artisan('app:send-application-reminders', ['--days' => 7])
            ->assertExitCode(0);

        Notification::assertNotSentTo($applicant, ApplicationReminder::class);
    }

    /** @test */
    public function reminder_command_ignores_applications_already_finalized()
    {
        Notification::fake();

        $job = $this->makeJobWithTwoStages();
        $applicant = User::factory()->create(['role' => 'user']);
        $application = Application::create([
            'user_id' => $applicant->id,
            'job_id' => $job->id,
            'status' => 'Lulus',
            'applied_at' => now()->subDays(10),
        ]);
        $application->timestamps = false;
        $application->updated_at = now()->subDays(10);
        $application->save();

        $this->artisan('app:send-application-reminders', ['--days' => 7])
            ->assertExitCode(0);

        Notification::assertNotSentTo($applicant, ApplicationReminder::class);
    }
}
