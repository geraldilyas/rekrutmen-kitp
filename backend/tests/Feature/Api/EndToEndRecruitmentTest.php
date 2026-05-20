<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Job;
use App\Models\FormField;
use App\Models\Application;
use App\Models\JobStage;
use App\Models\ApplicationStageResult;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class EndToEndRecruitmentTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $applicant;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    /** @test */
    public function the_full_recruitment_lifecycle()
    {
        // --- STEP 1: ADMIN CREATES A JOB ---
        $field = FormField::create([
            'label' => 'Pengalaman Kerja (Tahun)',
            'type' => 'number',
            'is_required' => true,
            'category' => 'data_diri'
        ]);

        $jobData = [
            'title' => 'Tenaga Ahli IT',
            'category' => 'konsultan_individu',
            'description' => 'Membangun sistem rekrutmen',
            'start_date' => Carbon::now()->toDateString(),
            'end_date' => Carbon::now()->addDays(5)->toDateString(),
            'deadline' => Carbon::now()->addMonth()->toDateString(),
            'form_fields' => [$field->id],
            'stages' => [
                [
                    'name' => 'Administrasi', 
                    'stage_order' => 1, 
                    'weight' => 40,
                    'start_date' => Carbon::now()->toDateString(),
                    'end_date' => Carbon::now()->addDays(2)->toDateString()
                ],
                [
                    'name' => 'Wawancara', 
                    'stage_order' => 2, 
                    'weight' => 60,
                    'start_date' => Carbon::now()->addDays(3)->toDateString(),
                    'end_date' => Carbon::now()->addDays(5)->toDateString(),
                    'test_link' => 'https://zoom.us/j/123456'
                ],
            ]
        ];

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/jobs', $jobData);

        $response->assertStatus(201);
        $jobId = $response->json('data.id');


        // --- STEP 2: USER REGISTERS ---
        $regResponse = $this->postJson('/api/auth/register', [
            'name' => 'Calon Pegawai',
            'email' => 'pegawai@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'nik' => '3201234567890001'
        ]);
        $regResponse->assertStatus(201);
        $userToken = $regResponse->json('token');
        $userId = $regResponse->json('user.id');


        // --- STEP 3: USER VIEWS JOB AND FORM ---
        $formResponse = $this->getJson("/api/jobs/{$jobId}/form");
        $formResponse->assertStatus(200)
            ->assertJsonFragment(['label' => 'Pengalaman Kerja (Tahun)']);


        // --- STEP 4: USER SUBMITS APPLICATION ---
        $applyResponse = $this->withHeader('Authorization', "Bearer $userToken")
            ->postJson('/api/applications', [
                'job_id' => $jobId,
                'answers' => [
                    ['field_id' => $field->id, 'value' => '5']
                ],
                'documents' => [
                    ['type' => 'ktp', 'file_path' => 'docs/ktp.pdf']
                ]
            ]);
        $applyResponse->assertStatus(200);
        $applicationId = $applyResponse->json('data.id');


        // --- STEP 5: ADMIN REVIEWS APPLICATIONS ---
        $listResponse = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/applications');
        $listResponse->assertStatus(200)
            ->assertJsonFragment(['id' => $applicationId]);


        // --- STEP 6: ADMIN MOVES APPLICANT THROUGH STAGES ---
        $job = Job::with('stages')->find($jobId);
        $stages = $job->stages;

        // Stage 1 (Administrasi - 40%)
        $stageResult1 = ApplicationStageResult::create([
            'application_id' => $applicationId,
            'job_stage_id' => $stages[0]->id,
            'status' => 'pending'
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/admin/applications/stages/{$stageResult1->id}", [
                'status' => 'lulus',
                'score' => 80, // Score 80
                'notes' => 'Lengkap'
            ])->assertStatus(200);

        // Stage 2 (Wawancara - 60%)
        // The system should have auto-created the next stage result record
        $stageResult2 = ApplicationStageResult::where('application_id', $applicationId)
            ->where('job_stage_id', $stages[1]->id)
            ->first();

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/admin/applications/stages/{$stageResult2->id}", [
                'status' => 'lulus',
                'score' => 90, // Score 90
                'notes' => 'Sangat kompeten'
            ])->assertStatus(200);

        // --- STEP 7: VERIFY FINAL CALCULATION ---
        // Final Score = (80 * 0.4) + (90 * 0.6) = 32 + 54 = 86
        $finalApp = Application::find($applicationId);
        $this->assertEquals('Lulus', $finalApp->status);
        $this->assertEquals(86, $finalApp->final_score);


        // --- STEP 8: ADMIN EXPORTS RESULTS ---
        $exportResponse = $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/admin/reports/export/{$jobId}");
        
        $exportResponse->assertStatus(200);
    }
}
