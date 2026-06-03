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
use App\Models\UserDocument;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. CREATE USERS
        $admin = User::firstOrCreate(
            ['email' => 'admin@kitp.go.id'],
            [
                'name' => 'Admin Utama',
                'password' => Hash::make('password'),
                'role' => 'admin',
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

        $candidates = [
            [
                'email' => 'budi@gmail.com',
                'name' => 'Budi Santoso',
                'nik' => '1234567890123456',
                'pendidikan' => 'S1 Teknik Sipil',
            ],
            [
                'email' => 'ani@gmail.com',
                'name' => 'Ani Wijaya',
                'nik' => '6543210987654321',
                'pendidikan' => 'D3 Teknik Sipil',
            ],
            [
                'email' => 'citra@gmail.com',
                'name' => 'Citra Lestari',
                'nik' => '1357924680135792',
                'pendidikan' => 'S1 Informatika',
            ],
            [
                'email' => 'dodi@gmail.com',
                'name' => 'Dodi Hermawan',
                'nik' => '2468013579246801',
                'pendidikan' => 'S1 Sistem Informasi',
            ],
            [
                'email' => 'eka@gmail.com',
                'name' => 'Eka Putri',
                'nik' => '9876543210987654',
                'pendidikan' => 'S1 Teknik Sipil',
            ],
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
                    'email_verified_at' => now(),
                ]
            );

            // Create UserDocuments (Master Links matching Profile.tsx keys)
            UserDocument::firstOrCreate(
                ['user_id' => $user->id, 'type' => 'cv'],
                ['file_path' => 'https://drive.google.com/cv_' . strtolower(str_replace(' ', '_', $user->name))]
            );
            UserDocument::firstOrCreate(
                ['user_id' => $user->id, 'type' => 'ktp'],
                ['file_path' => 'https://example.com/ktp_' . strtolower(str_replace(' ', '_', $user->name)) . '.jpg']
            );
            UserDocument::firstOrCreate(
                ['user_id' => $user->id, 'type' => 'ijazah'],
                ['file_path' => 'https://example.com/ijazah_' . strtolower(str_replace(' ', '_', $user->name)) . '.pdf']
            );
            UserDocument::firstOrCreate(
                ['user_id' => $user->id, 'type' => 'transkrip'],
                ['file_path' => 'https://example.com/transkrip_' . strtolower(str_replace(' ', '_', $user->name)) . '.pdf']
            );
            // Additional custom type
            UserDocument::firstOrCreate(
                ['user_id' => $user->id, 'type' => 'Portofolio'],
                ['file_path' => 'https://github.com/' . strtolower(str_replace(' ', '', $user->name))]
            );

            $candidateModels[] = $user;
        }

        // 2. CREATE FORM FIELDS
        $fieldsData = [
            ['label' => 'Nama Lengkap', 'type' => 'text', 'category' => 'data_diri', 'is_required' => true],
            ['label' => 'Email Aktif', 'type' => 'email', 'category' => 'data_diri', 'is_required' => true],
            ['label' => 'Link CV (Google Drive)', 'type' => 'link', 'category' => 'berkas', 'is_required' => true],
            ['label' => 'Link Portofolio', 'type' => 'link', 'category' => 'berkas', 'is_required' => false],
            ['label' => 'Pendidikan Terakhir', 'type' => 'text', 'category' => 'data_diri', 'is_required' => true],
        ];

        $formFields = [];
        foreach ($fieldsData as $fd) {
            $formFields[] = FormField::firstOrCreate(['label' => $fd['label']], $fd);
        }
        $formFieldIds = collect($formFields)->pluck('id')->toArray();

        // 3. CREATE JOBS
        $job1 = Job::create([
            'title' => 'Tenaga Pendamping Masyarakat (TPM) - P3-TGAI',
            'category' => 'tenaga_pendukung',
            'description' => 'Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis, administratif, dan sosial.',
            'qualification' => 'S1/D3 Teknik Sipil',
            'requirements' => 'IPK min 3.00, Memiliki kendaraan sendiri.',
            'start_date' => Carbon::now()->subDays(10),
            'end_date' => Carbon::now()->addDays(20),
            'deadline' => Carbon::now()->addDays(15),
            'location' => 'Provinsi Lampung',
            'unit_kerja' => 'BBWS Mesuji Sekampung',
            'created_by' => $admin->id,
        ]);
        $job1->formFields()->sync($formFieldIds);

        $job2 = Job::create([
            'title' => 'Software Engineer (Full-Stack)',
            'category' => 'konsultan_individu',
            'description' => 'Mengembangkan sistem informasi manajemen sumber daya air berbasis web dan mobile.',
            'qualification' => 'S1 Informatika / Sistem Informasi',
            'requirements' => 'Menguasai React dan Laravel, Pengalaman min 2 tahun.',
            'start_date' => Carbon::now()->subDays(5),
            'end_date' => Carbon::now()->addDays(25),
            'deadline' => Carbon::now()->addDays(15),
            'location' => 'Bandar Lampung',
            'unit_kerja' => 'BBWS Mesuji Sekampung',
            'created_by' => $admin->id,
        ]);
        $job2->formFields()->sync($formFieldIds);

        // 4. CREATE JOB STAGES
        $stagesData = [
            ['name' => 'Seleksi Administrasi', 'weight' => 20, 'order' => 1],
            ['name' => 'Tes Kompetensi', 'weight' => 50, 'order' => 2],
            ['name' => 'Wawancara', 'weight' => 30, 'order' => 3],
        ];

        foreach ([$job1, $job2] as $job) {
            foreach ($stagesData as $sd) {
                JobStage::create([
                    'job_id' => $job->id,
                    'name' => $sd['name'],
                    'stage_order' => $sd['order'],
                    'weight' => $sd['weight'],
                    'start_date' => $job->start_date,
                    'end_date' => $job->deadline,
                ]);
            }
        }

        // 5. CREATE APPLICATIONS, ANSWERS, AND DOCUMENTS
        
        $createAnswersAndDocs = function($application, $candidate, $fields) {
            // Create Application Answers
            foreach ($fields as $field) {
                $answer = '';
                switch ($field->label) {
                    case 'Nama Lengkap': $answer = $candidate->name; break;
                    case 'Email Aktif': $answer = $candidate->email; break;
                    case 'Link CV (Google Drive)': $answer = 'https://drive.google.com/cv_' . strtolower(str_replace(' ', '_', $candidate->name)); break;
                    case 'Link Portofolio': $answer = 'https://github.com/' . strtolower(str_replace(' ', '', $candidate->name)); break;
                    case 'Pendidikan Terakhir': $answer = 'S1 Teknik Sipil'; break;
                }
                ApplicationAnswer::create([
                    'application_id' => $application->id,
                    'form_field_id' => $field->id,
                    'answer' => $answer,
                ]);
            }

        };

        // Application 1: Budi melamar TPM (New - Not Graded)
        $app1 = Application::create([
            'user_id' => $candidateModels[0]->id,
            'job_id' => $job1->id,
            'status' => 'pending',
            'applied_at' => Carbon::now()->subDays(2),
        ]);
        $createAnswersAndDocs($app1, $candidateModels[0], $formFields);

        // Application 2: Ani melamar TPM (Passed Stage 1)
        $app2 = Application::create([
            'user_id' => $candidateModels[1]->id,
            'job_id' => $job1->id,
            'status' => 'pending',
            'applied_at' => Carbon::now()->subDays(5),
        ]);
        $createAnswersAndDocs($app2, $candidateModels[1], $formFields);
        
        $job1Stages = $job1->stages()->orderBy('stage_order')->get();
        ApplicationStageResult::create([
            'application_id' => $app2->id,
            'job_stage_id' => $job1Stages[0]->id,
            'status' => 'lulus',
            'score' => 85,
            'notes' => 'Berkas sangat lengkap.',
            'reviewed_by' => $penyeleksi1->id,
            'reviewed_at' => now()->subDays(2),
        ]);

        // Application 3: Citra melamar Software Engineer (Passed Stage 1 & 2)
        $app3 = Application::create([
            'user_id' => $candidateModels[2]->id,
            'job_id' => $job2->id,
            'status' => 'pending',
            'applied_at' => Carbon::now()->subDays(7),
        ]);
        $createAnswersAndDocs($app3, $candidateModels[2], $formFields);
        
        $job2Stages = $job2->stages()->orderBy('stage_order')->get();
        ApplicationStageResult::create([
            'application_id' => $app3->id,
            'job_stage_id' => $job2Stages[0]->id,
            'status' => 'lulus',
            'score' => 90,
            'reviewed_by' => $penyeleksi1->id,
            'reviewed_at' => now()->subDays(5),
        ]);
        ApplicationStageResult::create([
            'application_id' => $app3->id,
            'job_stage_id' => $job2Stages[1]->id,
            'status' => 'lulus',
            'score' => 88,
            'notes' => 'Logic test sangat baik.',
            'reviewed_by' => $penyeleksi2->id,
            'reviewed_at' => now()->subDays(3),
        ]);

        // Application 4: Dodi melamar Software Engineer (Failed Stage 1)
        $app4 = Application::create([
            'user_id' => $candidateModels[3]->id,
            'job_id' => $job2->id,
            'status' => 'Tidak Lulus',
            'applied_at' => Carbon::now()->subDays(6),
        ]);
        $createAnswersAndDocs($app4, $candidateModels[3], $formFields);
        
        ApplicationStageResult::create([
            'application_id' => $app4->id,
            'job_stage_id' => $job2Stages[0]->id,
            'status' => 'tidak_lulus',
            'score' => 40,
            'notes' => 'Pengalaman tidak sesuai kualifikasi.',
            'reviewed_by' => $penyeleksi1->id,
            'reviewed_at' => now()->subDays(4),
        ]);

        // Application 5: Eka melamar TPM (Fully Passed)
        $app5 = Application::create([
            'user_id' => $candidateModels[4]->id,
            'job_id' => $job1->id,
            'status' => 'Lulus',
            'applied_at' => Carbon::now()->subDays(10),
        ]);
        $createAnswersAndDocs($app5, $candidateModels[4], $formFields);
        
        foreach ($job1Stages as $index => $stage) {
            ApplicationStageResult::create([
                'application_id' => $app5->id,
                'job_stage_id' => $stage->id,
                'status' => 'lulus',
                'score' => 80 + ($index * 5),
                'reviewed_by' => ($index % 2 == 0) ? $penyeleksi1->id : $penyeleksi2->id,
                'reviewed_at' => now()->subDays(10 - ($index * 2)),
            ]);
        }
    }
}
