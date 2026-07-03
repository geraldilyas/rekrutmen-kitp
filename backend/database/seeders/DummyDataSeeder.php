<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Job;
use App\Models\FormField;
use App\Models\JobStage;
use App\Models\Application;
use App\Models\ApplicationAnswer;
use App\Models\ApplicationStageResult;
use App\Models\Announcement;
use App\Models\UserDocument;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

/**
 * Seeds a wide spread of scenarios the system can be in, so every screen
 * (job listing, applicant grading, reports, announcements, ...) has
 * realistic data to render for every state it needs to handle:
 *
 *  - Jobs: coming soon / active / finished, with or without a quota,
 *    with 1 document / several documents required on the admin stage,
 *    with the grading window open / not started yet / already closed.
 *  - Applications: brand new, mid-selection, fully passed, fully failed,
 *    with an unfilled optional document.
 *  - Admin hierarchy: L1/L2/L3 admins, two penyeleksi.
 *  - A finished job with a manually published announcement.
 */
class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // ------------------------------------------------------------------
        // 1. STAFF USERS (admin hierarchy + penyeleksi)
        // ------------------------------------------------------------------
        $adminL1 = User::firstOrCreate(
            ['email' => 'admin@kitp.go.id'],
            [
                'name' => 'Admin Utama',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'admin_level' => 1,
                'email_verified_at' => now(),
            ]
        );

        $adminL2 = User::firstOrCreate(
            ['email' => 'admin.l2@kitp.go.id'],
            [
                'name' => 'Sari Kusuma (Admin L2)',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'admin_level' => 2,
                'parent_id' => $adminL1->id,
                'email_verified_at' => now(),
            ]
        );

        $adminL3 = User::firstOrCreate(
            ['email' => 'admin.l3@kitp.go.id'],
            [
                'name' => 'Bayu Pratama (Admin L3)',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'admin_level' => 3,
                'parent_id' => $adminL2->id,
                'email_verified_at' => now(),
            ]
        );

        $penyeleksi1 = User::firstOrCreate(
            ['email' => 'rina@kitp.go.id'],
            [
                'name' => 'Rina Marlina, SE',
                'password' => Hash::make('password'),
                'role' => 'penyeleksi',
                'email_verified_at' => now(),
            ]
        );

        $penyeleksi2 = User::firstOrCreate(
            ['email' => 'andi@kitp.go.id'],
            [
                'name' => 'Dr. Andi Wijaya, MT',
                'password' => Hash::make('password'),
                'role' => 'penyeleksi',
                'email_verified_at' => now(),
            ]
        );

        // ------------------------------------------------------------------
        // 2. CANDIDATES (pelamar)
        // ------------------------------------------------------------------
        $candidates = [
            ['email' => 'budi@gmail.com', 'name' => 'Budi Santoso', 'nik' => '1234567890123456', 'pendidikan' => 'S1 Teknik Sipil', 'verified' => true],
            ['email' => 'ani@gmail.com', 'name' => 'Ani Wijaya', 'nik' => '6543210987654321', 'pendidikan' => 'D3 Teknik Sipil', 'verified' => true],
            ['email' => 'citra@gmail.com', 'name' => 'Citra Lestari', 'nik' => '1357924680135792', 'pendidikan' => 'S1 Informatika', 'verified' => true],
            ['email' => 'dodi@gmail.com', 'name' => 'Dodi Hermawan', 'nik' => '2468013579246801', 'pendidikan' => 'S1 Sistem Informasi', 'verified' => true],
            ['email' => 'eka@gmail.com', 'name' => 'Eka Putri', 'nik' => '9876543210987654', 'pendidikan' => 'S1 Teknik Sipil', 'verified' => true],
            ['email' => 'fajar@gmail.com', 'name' => 'Fajar Setiawan', 'nik' => '1122334455667788', 'pendidikan' => 'S1 Teknik Lingkungan', 'verified' => false],
            ['email' => 'gita@gmail.com', 'name' => 'Gita Ayu Lestari', 'nik' => '8877665544332211', 'pendidikan' => 'D3 Manajemen Informatika', 'verified' => true],
        ];

        $candidateModels = [];
        foreach ($candidates as $c) {
            $user = User::firstOrCreate(
                ['email' => $c['email']],
                [
                    'name' => $c['name'],
                    'password' => Hash::make('password'),
                    'role' => 'user',
                    'nik' => $c['nik'],
                    'email_verified_at' => $c['verified'] ? now() : null,
                ]
            );

            // Gita intentionally has no master documents uploaded, to exercise
            // the "Belum diisi pelamar" state seen while grading.
            if ($c['email'] !== 'gita@gmail.com') {
                $slug = strtolower(str_replace(' ', '_', $user->name));
                UserDocument::firstOrCreate(['user_id' => $user->id, 'type' => 'cv'], ['file_path' => "https://drive.google.com/cv_{$slug}"]);
                UserDocument::firstOrCreate(['user_id' => $user->id, 'type' => 'ktp'], ['file_path' => "https://example.com/ktp_{$slug}.jpg"]);
                UserDocument::firstOrCreate(['user_id' => $user->id, 'type' => 'ijazah'], ['file_path' => "https://example.com/ijazah_{$slug}.pdf"]);
                UserDocument::firstOrCreate(['user_id' => $user->id, 'type' => 'transkrip'], ['file_path' => "https://example.com/transkrip_{$slug}.pdf"]);
                UserDocument::firstOrCreate(['user_id' => $user->id, 'type' => 'Portofolio'], ['file_path' => 'https://github.com/' . strtolower(str_replace(' ', '', $user->name))]);
            }

            $candidateModels[$c['email']] = $user;
        }
        [$budi, $ani, $citra, $dodi, $eka, $fajar, $gita] = array_values($candidateModels);

        // ------------------------------------------------------------------
        // 3. FORM FIELDS (data_diri questions + berkas/document master list)
        // ------------------------------------------------------------------
        $fieldsData = [
            'nama' => ['label' => 'Nama Lengkap', 'type' => 'text', 'category' => 'data_diri', 'is_required' => true],
            'email' => ['label' => 'Email Aktif', 'type' => 'email', 'category' => 'data_diri', 'is_required' => true],
            'pendidikan' => ['label' => 'Pendidikan Terakhir', 'type' => 'text', 'category' => 'data_diri', 'is_required' => true],
            'cv' => ['label' => 'Link CV (Google Drive)', 'type' => 'url', 'category' => 'berkas', 'is_required' => true],
            'portofolio' => ['label' => 'Link Portofolio', 'type' => 'url', 'category' => 'berkas', 'is_required' => false],
            'ktp' => ['label' => 'Link KTP', 'type' => 'url', 'category' => 'berkas', 'is_required' => true],
            'ijazah' => ['label' => 'Link Ijazah', 'type' => 'url', 'category' => 'berkas', 'is_required' => true],
            'skck' => ['label' => 'Link SKCK', 'type' => 'url', 'category' => 'berkas', 'is_required' => true],
            'transkrip' => ['label' => 'Link Transkrip Nilai', 'type' => 'url', 'category' => 'berkas', 'is_required' => false],
        ];

        $fields = [];
        foreach ($fieldsData as $key => $fd) {
            $fields[$key] = FormField::firstOrCreate(['label' => $fd['label']], $fd);
        }
        $questionFieldIds = collect($fields)->only(['nama', 'email', 'pendidikan'])->pluck('id')->toArray();

        // Deterministic dummy answer values per candidate/field key.
        $answerValue = function (FormField $field, User $candidate, string $key) {
            $slug = strtolower(str_replace(' ', '_', $candidate->name));
            return match ($key) {
                'nama' => $candidate->name,
                'email' => $candidate->email,
                'pendidikan' => 'S1 Teknik Sipil',
                'cv' => "https://drive.google.com/cv_{$slug}",
                'portofolio' => 'https://github.com/' . strtolower(str_replace(' ', '', $candidate->name)),
                'ktp' => "https://drive.google.com/ktp_{$slug}",
                'ijazah' => "https://drive.google.com/ijazah_{$slug}",
                'skck' => "https://drive.google.com/skck_{$slug}",
                'transkrip' => "https://drive.google.com/transkrip_{$slug}",
                default => $field->label,
            };
        };

        /**
         * Create an application with its question answers plus document
         * answers for a given set of document field keys. Passing a key in
         * $skipDocKeys leaves that document unanswered (tests the "belum
         * diisi" empty state during grading).
         */
        $createApplication = function (User $candidate, Job $job, string $status, array $docKeys, array $skipDocKeys = []) use ($fields, $questionFieldIds, $answerValue) {
            $app = Application::create([
                'user_id' => $candidate->id,
                'job_id' => $job->id,
                'status' => $status,
                'applied_at' => now()->subDays(random_int(1, 20)),
            ]);

            foreach ([...$questionFieldIds, ...collect($fields)->only($docKeys)->pluck('id')->toArray()] as $fieldId) {
                $field = collect($fields)->firstWhere('id', $fieldId);
                $key = collect($fields)->search(fn ($f) => $f->id === $fieldId);
                if (in_array($key, $skipDocKeys, true)) {
                    continue;
                }
                ApplicationAnswer::create([
                    'application_id' => $app->id,
                    'form_field_id' => $fieldId,
                    'answer' => $answerValue($field, $candidate, $key),
                ]);
            }

            return $app;
        };

        /**
         * Build the standard 3-stage pipeline (Seleksi Administrasi, Tes
         * Kompetensi, Wawancara) for a job, attach the given documents (with
         * weights summing to the admin stage's own weight) to the admin
         * stage, and return [adminStage, testStage, interviewStage].
         */
        $makeStages = function (Job $job, array $docWeights, array $adminOverrides = [], array $testOverrides = [], array $interviewOverrides = []) use ($fields) {
            $adminWeight = array_sum($docWeights);

            $adminStage = JobStage::create(array_merge([
                'job_id' => $job->id,
                'name' => 'Seleksi Administrasi',
                'stage_order' => 1,
                'weight' => $adminWeight,
                'start_date' => $job->start_date,
                'end_date' => $job->deadline,
                'grading_end_date' => $job->deadline,
            ], $adminOverrides));

            foreach ($docWeights as $key => $weight) {
                $adminStage->documents()->attach($fields[$key]->id, ['weight' => $weight]);
            }

            $testStage = JobStage::create(array_merge([
                'job_id' => $job->id,
                'name' => 'Tes Kompetensi',
                'stage_order' => 2,
                'weight' => 50,
                'start_date' => $job->start_date,
                'end_date' => $job->deadline,
                'grading_end_date' => $job->deadline,
            ], $testOverrides));

            $interviewStage = JobStage::create(array_merge([
                'job_id' => $job->id,
                'name' => 'Wawancara',
                'stage_order' => 3,
                'weight' => 100 - $adminWeight - 50,
                'start_date' => $job->start_date,
                'end_date' => $job->deadline,
                'grading_end_date' => $job->deadline,
            ], $interviewOverrides));

            return [$adminStage, $testStage, $interviewStage];
        };

        // ------------------------------------------------------------------
        // 4. JOBS — one per scenario the system needs to render
        // ------------------------------------------------------------------

        // 4a. ACTIVE job, quota set, admin stage requires 2 documents (CV + KTP)
        $jobActive = Job::create([
            'title' => 'Tenaga Pendamping Masyarakat (TPM) - P3-TGAI',
            'category' => 'tenaga_pendukung',
            'description' => "Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis, administratif, dan sosial.\nBertanggung jawab atas pelaporan progres kegiatan tiap bulan.",
            'qualification' => "S1/D3 Teknik Sipil\nDiutamakan berpengalaman di bidang irigasi",
            'requirements' => "1. IPK minimal 3.00\n2. Memiliki kendaraan sendiri\n3. Bersedia ditempatkan di seluruh wilayah kerja",
            'duration' => '6 Bulan',
            'location' => 'Provinsi Lampung',
            'unit_kerja' => 'BBWS Mesuji Sekampung',
            'recruiter_name' => 'Sari Kusuma',
            'kuota' => 5,
            'start_date' => Carbon::now()->subDays(10),
            'end_date' => Carbon::now()->addDays(20),
            'deadline' => Carbon::now()->addDays(15),
            'created_by' => $adminL1->id,
        ]);
        [$jobActiveAdmin, $jobActiveTest, $jobActiveInterview] = $makeStages($jobActive, ['cv' => 10, 'ktp' => 10], [], [], ['weight' => 30]);

        // 4b. ACTIVE job, no quota limit, admin stage requires only 1 document (CV)
        $jobNoKuota = Job::create([
            'title' => 'Software Engineer (Full-Stack)',
            'category' => 'konsultan_individu',
            'description' => 'Mengembangkan sistem informasi manajemen sumber daya air berbasis web dan mobile.',
            'qualification' => 'S1 Informatika / Sistem Informasi',
            'requirements' => "1. Menguasai React dan Laravel\n2. Pengalaman minimal 2 tahun",
            'duration' => '1 Tahun',
            'location' => 'Bandar Lampung',
            'unit_kerja' => 'BBWS Mesuji Sekampung',
            'recruiter_name' => 'Bayu Pratama',
            'kuota' => null,
            'start_date' => Carbon::now()->subDays(5),
            'end_date' => Carbon::now()->addDays(25),
            'deadline' => Carbon::now()->addDays(15),
            'created_by' => $adminL1->id,
        ]);
        [$jobNoKuotaAdmin, $jobNoKuotaTest, $jobNoKuotaInterview] = $makeStages($jobNoKuota, ['cv' => 20]);

        // 4c. COMING SOON job (starts in the future), admin stage requires 3 documents
        $jobComingSoon = Job::create([
            'title' => 'Surveyor Lapangan',
            'category' => 'tenaga_pendukung',
            'description' => 'Melaksanakan survei topografi dan pemetaan kondisi lapangan pada wilayah kerja SNVT PB.',
            'qualification' => 'D3/S1 Teknik Geodesi atau sejenis',
            'requirements' => "1. Menguasai alat ukur Total Station\n2. Bersedia bertugas di lapangan",
            'duration' => '4 Bulan',
            'location' => 'Lampung Selatan',
            'unit_kerja' => 'SNVT PB',
            'recruiter_name' => 'Sari Kusuma',
            'kuota' => 3,
            'start_date' => Carbon::now()->addDays(14),
            'end_date' => Carbon::now()->addDays(90),
            'deadline' => Carbon::now()->addDays(45),
            'created_by' => $adminL2->id,
        ]);
        [$jobComingSoonAdmin] = $makeStages($jobComingSoon, ['cv' => 10, 'ktp' => 10, 'ijazah' => 10]);

        // 4d. FINISHED job (deadline & every stage already passed) + manual announcement
        $jobFinished = Job::create([
            'title' => 'Asisten Teknik Irigasi',
            'category' => 'tenaga_pendukung',
            'description' => 'Membantu pelaksanaan pengawasan konstruksi jaringan irigasi.',
            'qualification' => 'D3 Teknik Sipil/Pengairan',
            'requirements' => "1. Berpengalaman minimal 1 tahun\n2. Mampu membaca gambar teknik",
            'duration' => '3 Bulan',
            'location' => 'Lampung Tengah',
            'unit_kerja' => 'OPSDAMS',
            'recruiter_name' => 'Admin Utama',
            'kuota' => 2,
            'start_date' => Carbon::now()->subMonths(3),
            'end_date' => Carbon::now()->subDays(20),
            'deadline' => Carbon::now()->subDays(25),
            'created_by' => $adminL1->id,
        ]);
        [$jobFinishedAdmin, $jobFinishedTest, $jobFinishedInterview] = $makeStages(
            $jobFinished,
            ['cv' => 15, 'ijazah' => 15],
            ['start_date' => $jobFinished->start_date, 'end_date' => Carbon::now()->subDays(60), 'grading_end_date' => Carbon::now()->subDays(55)],
            ['start_date' => Carbon::now()->subDays(59), 'end_date' => Carbon::now()->subDays(40), 'grading_end_date' => Carbon::now()->subDays(35)],
            ['start_date' => Carbon::now()->subDays(39), 'end_date' => Carbon::now()->subDays(25), 'grading_end_date' => Carbon::now()->subDays(20)]
        );

        // 4e. ACTIVE job whose admin-stage grading window has already closed
        $jobGradingClosed = Job::create([
            'title' => 'Tenaga Ahli Lingkungan',
            'category' => 'konsultan_individu',
            'description' => 'Melakukan kajian dampak lingkungan pada proyek infrastruktur sumber daya air.',
            'qualification' => 'S1/S2 Teknik Lingkungan',
            'requirements' => "1. Memiliki sertifikat AMDAL\n2. Pengalaman minimal 3 tahun",
            'duration' => '8 Bulan',
            'location' => 'Bandar Lampung',
            'unit_kerja' => 'BBWS Mesuji Sekampung',
            'recruiter_name' => 'Admin Utama',
            'kuota' => 1,
            'start_date' => Carbon::now()->subDays(30),
            'end_date' => Carbon::now()->addDays(60),
            'deadline' => Carbon::now()->addDays(30),
            'created_by' => $adminL1->id,
        ]);
        [$jobGradingClosedAdmin] = $makeStages(
            $jobGradingClosed,
            ['cv' => 10, 'skck' => 10],
            ['start_date' => Carbon::now()->subDays(30), 'end_date' => Carbon::now()->subDays(10), 'grading_end_date' => Carbon::now()->subDays(3)]
        );

        // 4f. ACTIVE job whose admin-stage grading window has not opened yet
        $jobGradingNotStarted = Job::create([
            'title' => 'Operator Data',
            'category' => 'tenaga_pendukung',
            'description' => 'Mengelola input dan validasi data teknis operasional bendungan.',
            'qualification' => 'D3 Sistem Informasi/Statistika',
            'requirements' => "1. Menguasai Ms. Excel tingkat lanjut\n2. Teliti dan disiplin",
            'duration' => '6 Bulan',
            'location' => 'Lampung Timur',
            'unit_kerja' => 'OPSDAMS',
            'recruiter_name' => 'Sari Kusuma',
            'kuota' => 4,
            'start_date' => Carbon::now()->subDays(2),
            'end_date' => Carbon::now()->addDays(40),
            'deadline' => Carbon::now()->addDays(25),
            'created_by' => $adminL2->id,
        ]);
        [$jobGradingNotStartedAdmin] = $makeStages(
            $jobGradingNotStarted,
            ['cv' => 20],
            ['start_date' => Carbon::now()->addDays(7), 'end_date' => Carbon::now()->addDays(20), 'grading_end_date' => Carbon::now()->addDays(20)]
        );

        // ------------------------------------------------------------------
        // 5. APPLICATIONS covering every status/stage combination
        // ------------------------------------------------------------------

        // -- Job Active (TPM): full spread from brand-new to fully graded --
        $createApplication($budi, $jobActive, 'pending', ['cv', 'ktp']); // baru, belum dinilai sama sekali

        $appAniAdminPassed = $createApplication($ani, $jobActive, 'seleksi', ['cv', 'ktp']);
        ApplicationStageResult::create([
            'application_id' => $appAniAdminPassed->id,
            'job_stage_id' => $jobActiveAdmin->id,
            'status' => 'lulus',
            'score' => 100,
            'notes' => 'Berkas lengkap dan valid.',
            'reviewed_by' => $penyeleksi1->id,
            'reviewed_at' => now()->subDays(2),
        ]);

        $appEkaFull = $createApplication($eka, $jobActive, 'Lulus', ['cv', 'ktp']);
        foreach ([$jobActiveAdmin, $jobActiveTest, $jobActiveInterview] as $index => $stage) {
            ApplicationStageResult::create([
                'application_id' => $appEkaFull->id,
                'job_stage_id' => $stage->id,
                'status' => 'lulus',
                'score' => 80 + ($index * 5),
                'reviewed_by' => ($index % 2 === 0) ? $penyeleksi1->id : $penyeleksi2->id,
                'reviewed_at' => now()->subDays(10 - ($index * 2)),
            ]);
        }

        // Gita applies but never uploaded a KTP link — leaves the document
        // checklist showing "Belum diisi pelamar" for that item.
        $createApplication($gita, $jobActive, 'pending', ['cv', 'ktp'], skipDocKeys: ['ktp']);

        // -- Job No-Kuota (Software Engineer): mid-pipeline + rejected --
        $appCitraTwoStages = $createApplication($citra, $jobNoKuota, 'seleksi', ['cv']);
        ApplicationStageResult::create([
            'application_id' => $appCitraTwoStages->id,
            'job_stage_id' => $jobNoKuotaAdmin->id,
            'status' => 'lulus',
            'score' => 100,
            'reviewed_by' => $penyeleksi1->id,
            'reviewed_at' => now()->subDays(5),
        ]);
        ApplicationStageResult::create([
            'application_id' => $appCitraTwoStages->id,
            'job_stage_id' => $jobNoKuotaTest->id,
            'status' => 'lulus',
            'score' => 88,
            'notes' => 'Logic test sangat baik.',
            'reviewed_by' => $penyeleksi2->id,
            'reviewed_at' => now()->subDays(3),
        ]);

        $appDodiRejected = $createApplication($dodi, $jobNoKuota, 'Tidak Lulus', ['cv']);
        ApplicationStageResult::create([
            'application_id' => $appDodiRejected->id,
            'job_stage_id' => $jobNoKuotaAdmin->id,
            'status' => 'tidak_lulus',
            'score' => 0,
            'notes' => 'Berkas CV tidak dapat diakses.',
            'reviewed_by' => $penyeleksi1->id,
            'reviewed_at' => now()->subDays(4),
        ]);

        // -- Job Coming Soon (Surveyor): applied early, nothing gradeable yet --
        $createApplication($fajar, $jobComingSoon, 'pending', ['cv', 'ktp', 'ijazah']);

        // -- Job Finished (Asisten Teknik Irigasi): fully passed + fully failed --
        $appBudiFinishedPass = $createApplication($budi, $jobFinished, 'Lulus', ['cv', 'ijazah']);
        foreach ([$jobFinishedAdmin, $jobFinishedTest, $jobFinishedInterview] as $index => $stage) {
            ApplicationStageResult::create([
                'application_id' => $appBudiFinishedPass->id,
                'job_stage_id' => $stage->id,
                'status' => 'lulus',
                'score' => 85 + ($index * 3),
                'reviewed_by' => $index % 2 === 0 ? $penyeleksi1->id : $penyeleksi2->id,
                'reviewed_at' => now()->subDays(50 - ($index * 5)),
            ]);
        }

        $appAniFinishedFail = $createApplication($ani, $jobFinished, 'Tidak Lulus', ['cv', 'ijazah']);
        ApplicationStageResult::create([
            'application_id' => $appAniFinishedFail->id,
            'job_stage_id' => $jobFinishedAdmin->id,
            'status' => 'tidak_lulus',
            'score' => 0,
            'notes' => 'Ijazah tidak sesuai kualifikasi jabatan.',
            'reviewed_by' => $penyeleksi1->id,
            'reviewed_at' => now()->subDays(58),
        ]);

        Announcement::create([
            'job_id' => $jobFinished->id,
            'title' => 'Hasil Akhir Seleksi - ' . $jobFinished->title,
            'file_path' => 'announcements/dummy-hasil-asisten-teknik-irigasi.pdf',
            'published_at' => now()->subDays(18),
        ]);

        // -- Job Grading Closed (Tenaga Ahli Lingkungan): stuck, can't be graded anymore --
        $createApplication($citra, $jobGradingClosed, 'pending', ['cv', 'skck']);

        // -- Job Grading Not Started (Operator Data): applied, window opens later --
        $createApplication($dodi, $jobGradingNotStarted, 'pending', ['cv']);
    }
}
