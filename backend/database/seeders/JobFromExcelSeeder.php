<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class JobFromExcelSeeder extends Seeder
{
    public function run(): void
    {
        // Path langsung ke file Excel asli lo di VS Code
        $filePath = database_path('data/format laporan data tenaga ahli konsultan oke.xlsx');

        if (!file_exists($filePath)) {
            $this->command->error("File Excel asli belum dipindahkan ke folder database/data/");
            return;
        }

        // Kita daftarkan sheet-sheet yang mau diambil data jabatannya
        $sheets = ['Satker BBWSMS', 'Satker OPSDAMS', 'SNVT PB'];
        $insertedJobs = [];

        foreach ($sheets as $sheetName) {
            $this->command->info("Membaca data dari Sheet: {$sheetName}...");
            
            // Mengubah sheet excel menjadi array PHP lewat library
            $rows = Excel::toArray([], $filePath)[array_search($sheetName, $sheets)] ?? [];
            
            $rowCount = 0;
            foreach ($rows as $row) {
                $rowCount++;
                
                // Skip header excel bawaan (baris 1 sampai 10-an)
                if ($rowCount <= 10 || empty($row[7])) {
                    continue;
                }

                $title = trim($row[7]); // Kolom H (Index 7) adalah Jabatan
                $jenjang = trim($row[4] ?? ''); // Kolom E (Index 4)
                $prodi = trim($row[5] ?? '');   // Kolom F (Index 5)
                $deskripsi = trim($row[8] ?? ''); // Kolom I (Index 8)

                if (in_array($title, ['Jabatan', '7', '8', '']) || is_numeric($title)) {
                    continue;
                }

                $qualificationText = (!empty($jenjang) || !empty($prodi)) ? "Minimal {$jenjang} {$prodi}" : "Sesuai bidang keahlian";
                if (empty($deskripsi) || $deskripsi == 'nan') {
                    $deskripsi = "Melaksanakan tugas pendampingan teknis dan administratif pada unit kerja terkait.";
                }

                $uniqueKey = Str::slug($title . '-' . $sheetName);

                if (!in_array($uniqueKey, $insertedJobs)) {
                    $jobExists = DB::table('jobs')->where('title', $title)->where('unit_kerja', $sheetName)->exists();

                    if (!$jobExists) {
                        // INSERT DATA - SUDAH DISESUAIKAN DENGAN STRUKTUR ASLI DB LO (TANPA KOLOM 'status')
                        DB::table('jobs')->insert([
                            'title'          => $title,
                            'category'       => 'konsultan_individu', // Masuk ke enum 'konsultan_individu'
                            'description'    => $deskripsi,
                            'qualification'  => $qualificationText,
                            'requirements'   => "1. Sehat jasmani dan rohani.\n2. Berintegritas dan sanggup memenuhi kontrak kerja.\n3. Menguasai formasi jabatan yang dilamar.",
                            'location'       => 'Bandar Lampung',
                            'unit_kerja'     => $sheetName,
                            'start_date'     => now()->format('Y-m-d'), // Otomatis aktif mulai hari ini
                            'end_date'       => now()->addMonths(6)->format('Y-m-d'), // Contoh durasi aktif 6 bulan
                            'deadline'       => now()->addWeeks(2)->format('Y-m-d'),  // Batas lamar 2 minggu ke depan
                            'created_at'     => now(),
                            'updated_at'     => now(),
                        ]);

                        $insertedJobs[] = $uniqueKey;
                        $this->command->info("   [OK] Berhasil Tambah Lowongan: {$title}");
                    }
                }
            }
        }
    }
}