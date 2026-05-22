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

        $pelamar1 = User::firstOrCreate(
            ['email' => 'budi@gmail.com'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'role' => 'user',
                'nik' => '1234567890123456',
                'email_verified_at' => now(),
            ]
        );

        $pelamar2 = User::firstOrCreate(
            ['email' => 'ani@gmail.com'],
            [
                'name' => 'Ani Wijaya',
                'password' => Hash::make('password'),
                'role' => 'user',
                'nik' => '6543210987654321',
                'email_verified_at' => now(),
            ]
        );

        // 2. CREATE FORM FIELDS
        $fields = [
            ['label' => 'Nama Lengkap', 'type' => 'text', 'category' => 'data_diri', 'is_required' => true],
            ['label' => 'Email Aktif', 'type' => 'email', 'category' => 'data_diri', 'is_required' => true],
            ['label' => 'Link CV (Google Drive)', 'type' => 'link', 'category' => 'berkas', 'is_required' => true],
            ['label' => 'Link Portofolio', 'type' => 'link', 'category' => 'berkas', 'is_required' => false],
            ['label' => 'Pendidikan Terakhir', 'type' => 'text', 'category' => 'data_diri', 'is_required' => true],
        ];

        $formFieldIds = [];
        foreach ($fields as $f) {
            $field = FormField::firstOrCreate(['label' => $f['label']], $f);
            $formFieldIds[] = $field->id;
        }

        // 3. CREATE JOBS
        // Job 1: Active
        $job1 = Job::create([
            'title' => 'Tenaga Pendamping Masyarakat (TPM) - P3-TGAI',
            'category' => 'tenaga_pendukung',
            'description' => 'Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis, administratif, dan sosial pada kegiatan Percepatan Peningkatan Tata Guna Air Irigasi.',
            'qualification' => 'S1/D3 Teknik Sipil',
            'requirements' => 'IPK min 3.00, Memiliki kendaraan sendiri.',
            'start_date' => Carbon::now()->subDays(5),
            'end_date' => Carbon::now()->addDays(10),
            'deadline' => Carbon::now()->addDays(5),
            'location' => 'Provinsi Lampung',
            'unit_kerja' => 'BBWS Mesuji Sekampung',
            'created_by' => $admin->id,
        ]);
        $job1->formFields()->sync($formFieldIds);

        // Job 2: Active
        $job2 = Job::create([
            'title' => 'Software Engineer (Full-Stack)',
            'category' => 'konsultan_individu',
            'description' => 'Mengembangkan sistem informasi manajemen sumber daya air berbasis web dan mobile yang terintegrasi.',
            'qualification' => 'S1 Informatika / Sistem Informasi',
            'requirements' => 'Menguasai React dan Laravel, Pengalaman min 2 tahun.',
            'start_date' => Carbon::now()->subDays(2),
            'end_date' => Carbon::now()->addDays(20),
            'deadline' => Carbon::now()->addDays(10),
            'location' => 'Bandar Lampung',
            'unit_kerja' => 'BBWS Mesuji Sekampung',
            'created_by' => $admin->id,
        ]);
        $job2->formFields()->sync($formFieldIds);

        // Job 3: Closed (For Pengumuman)
        $job3 = Job::create([
            'title' => 'Petugas Administrasi Satker',
            'category' => 'tenaga_pendukung',
            'description' => 'Mendukung pengelolaan administrasi perkantoran, kearsipan, dan penyusunan laporan rutin.',
            'qualification' => 'D3/SMA Administrasi',
            'requirements' => 'Mahir Microsoft Office.',
            'start_date' => Carbon::now()->subMonths(2),
            'end_date' => Carbon::now()->subMonths(1),
            'deadline' => Carbon::now()->subDays(20),
            'location' => 'Kantor Pusat',
            'unit_kerja' => 'BBWS Mesuji Sekampung',
            'created_by' => $admin->id,
        ]);
        $job3->formFields()->sync($formFieldIds);

        // 4. CREATE JOB STAGES
        $stages = [
            ['name' => 'Seleksi Administrasi', 'weight' => 20, 'order' => 1],
            ['name' => 'Tes Kompetensi', 'weight' => 50, 'order' => 2],
            ['name' => 'Wawancara', 'weight' => 30, 'order' => 3],
        ];

        foreach ([$job1, $job2, $job3] as $job) {
            foreach ($stages as $s) {
                JobStage::create([
                    'job_id' => $job->id,
                    'name' => $s['name'],
                    'stage_order' => $s['order'],
                    'weight' => $s['weight'],
                    'start_date' => $job->start_date,
                    'end_date' => $job->deadline,
                ]);
            }
        }

        // 5. CREATE APPLICATIONS
        // Budi melamar TPM (Pending)
        $app1 = Application::create([
            'user_id' => $pelamar1->id,
            'job_id' => $job1->id,
            'status' => 'pending',
            'applied_at' => Carbon::now()->subDays(2),
        ]);

        // Ani melamar TPM (Proses - Lulus Tahap 1)
        $app2 = Application::create([
            'user_id' => $pelamar2->id,
            'job_id' => $job1->id,
            'status' => 'pending',
            'applied_at' => Carbon::now()->subDays(3),
        ]);
        
        $job1Stage1 = $job1->stages()->where('stage_order', 1)->first();
        ApplicationStageResult::create([
            'application_id' => $app2->id,
            'job_stage_id' => $job1Stage1->id,
            'status' => 'lulus',
            'score' => 85,
            'notes' => 'Berkas lengkap dan sesuai.',
            'reviewed_by' => $penyeleksi1->id,
            'reviewed_at' => now(),
        ]);

        // Budi melamar Admin (Closed - Lulus Akhir)
        $app3 = Application::create([
            'user_id' => $pelamar1->id,
            'job_id' => $job3->id,
            'status' => 'Lulus',
            'applied_at' => Carbon::now()->subMonths(1),
        ]);

        // Mock results for all stages of app3
        foreach ($job3->stages as $stg) {
            ApplicationStageResult::create([
                'application_id' => $app3->id,
                'job_stage_id' => $stg->id,
                'status' => 'lulus',
                'score' => 90,
                'reviewed_by' => $penyeleksi2->id,
                'reviewed_at' => now(),
            ]);
        }
    }
}
