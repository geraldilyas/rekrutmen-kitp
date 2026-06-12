<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ApplicationService;
use App\Models\Application; 
use Carbon\Carbon;           
use Barryvdh\DomPDF\Facade\Pdf; // 🚀 IMPORT: Wajib untuk generate PDF otomatis

class ApplicationController extends Controller
{
    protected $applicationService;

    public function __construct(ApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * Submit a new application.
     */
    public function apply(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'answers' => 'nullable|array',
            'answers.*.field_id' => 'required|exists:form_fields,id',
            'answers.*.value' => 'required|string|max:1000',
            'documents' => 'nullable|array',
            'documents.*.type' => 'required|string|max:50',
            'documents.*.url' => 'required|url|max:1000',
        ]);

        try {
            $application = $this->applicationService->apply($validated, auth()->id());

            return response()->json([
                'message' => 'Lamaran berhasil dikirim',
                'data' => $application
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

   /**
     * Get applications for the authenticated user with advanced tracking
     */
    public function myApplications(Request $request)
    {
        try {
            // 🛡️ AMAN KAN USER: Jika user belum login, langsung kembalikan array kosong, jangan biarkan crash 500!
            if (!$request->user()) {
                return response()->json([
                    'status' => 'success',
                    'data' => []
                ]);
            }

            $userId = $request->user()->id;

            // 1. Ambil data lamaran beserta relasi lengkap
            $applications = Application::with([
                'job' => function($query) {
                    // Hitung total pelamar yang mendaftar di lowongan ini secara real-time
                    $query->withCount('applications');
                },
                'job.stages' => function($q) {
                    $q->orderBy('stage_order', 'asc');
                },
                'stageResults.stage'
            ])->where('user_id', $userId)->get();

            // 2. [ENGINE AUTO-GUGUR TETAP BERJALAN DI SINI - bisa dipertahankan dari kode sebelumnya]
            // ... (Kodingan auto-gugur milikmu sebelumnya silakan tetap ditaruh di sini) ...

            // 3. INJEKSI TIMELINE DINAMIS + NILAI + TOTAL PENDAFTAR + URL GENERATE PDF AUTOMATIS
            $customizedApplications = $applications->map(function ($app) {
                // 🛡️ AMANKAN RELASI: Antisipasi jika data Lowongan (Job) bernilai null di database
                if (!$app->job) {
                    $app->timeline = [];
                    return $app;
                }

                $totalApplicants = $app->job->applications_count ?? 0;

                // Map tahapan kustom dari admin
                $adminStages = collect($app->job->stages)->map(function ($stage) use ($app, $totalApplicants) {
                    // Cari hasil milik pelamar ini di tahapan ini
                    $userResult = collect($app->stageResults)->firstWhere('job_stage_id', $stage->id);
                    
                    // 🚀 KODE BARU: URL langsung mengarah ke fungsi generate PDF otomatis bawaan sistem
                    $pdfUrl = url("/api/stages/{$stage->id}/download-passed-pdf");

                    return [
                        'id' => $stage->id,
                        'name' => $stage->stage_name ?? $stage->name,
                        'status' => $userResult ? $userResult->status : 'locked',
                        // Injeksi Nilai & Catatan ke dalam tahapan
                        'score' => $userResult ? $userResult->score : null, // Mengambil kolom nilai/score dari stage_results
                        'notes' => $userResult ? $userResult->notes : null,
                        'end_date' => $stage->end_date,
                        'download_pdf_lulus' => $pdfUrl, // Link PDF otomatis aktif
                        'total_applicants' => $totalApplicants // Menyisipkan jumlah pengaju di tiap tahapan seleksi
                    ];
                });

                // Tentukan status untuk "Diajukan"
                $firstAdminStage = $adminStages->first();
                $diajukanStatus = 'selesai';
                if ($app->status === 'pending' && ($firstAdminStage && $firstAdminStage['status'] === 'pending')) {
                    $diajukanStatus = 'aktif';
                }

                $fullTimeline = collect([]);
                
                // 1. MASUKKAN TAHAP "DIAJUKAN" (Ditambahkan info jumlah pengaju)
                $fullTimeline->push([
                    'id' => 'start',
                    'name' => 'Diajukan',
                    'status' => $diajukanStatus,
                    'score' => null,
                    'notes' => "Lamaran Anda telah diterima oleh sistem. Saat ini terdapat total {$totalApplicants} pelamar yang mengajukan berkas pada posisi ini.",
                    'total_applicants' => $totalApplicants
                ]);

                // 2. MASUKKAN TAHAPAN ADMIN (Sudah include Nilai, URL PDF, & Total Pengaju per tahap)
                $fullTimeline = $fullTimeline->merge($adminStages);

                // 3. MASUKKAN TAHAP "HASIL AKHIR"
                $hasilAkhirStatus = 'locked';
                if (in_array($app->status, ['Lulus', 'Tidak Lulus'])) {
                    $hasilAkhirStatus = $app->status;
                }

                // 🚀 KOREKSI: Tambahkan parameter &app_id agar saat diakses publik, sistem tahu ini milik lamaran siapa
                $finalPdfUrl = in_array($app->status, ['Lulus', 'Tidak Lulus']) 
                    ? url("/api/stages/{$app->job_id}/download-passed-pdf?type=final&app_id={$app->id}") 
                    : null;

                $fullTimeline->push([
                    'id' => 'end',
                    'name' => 'Hasil Akhir',
                    'status' => $hasilAkhirStatus,
                    'score' => null,
                    'notes' => in_array($app->status, ['Lulus', 'Tidak Lulus']) 
                                ? 'Proses rekrutmen selesai. Anda dinyatakan ' . $app->status . '.'
                                : 'Akan terbuka setelah semua tahapan seleksi selesai.',
                    'total_applicants' => $totalApplicants,
                    'download_pdf_lulus' => $finalPdfUrl 
                ]);

                $app->timeline = $fullTimeline;
                return $app;
            });

            return response()->json([
                'status' => 'success',
                'data' => $customizedApplications
            ]);

        } catch (\Exception $e) {
            // Log error asli ke laravel.log agar kamu tetap bisa memantau jika ada anomali lain
            \Log::error("Crash di myApplications: " . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

 /**
     * Generate PDF Daftar Rincian Nilai Semua Tahapan Seleksi (Lulus & Tidak Lulus) secara Real-Time
     */
    public function downloadPassedPdf(Request $request, $id)
    {
        try {
            // Cek apakah ini unduhan untuk Hasil Akhir (Final) atau Tahapan Seleksi Biasa
            $isFinal = $request->query('type') === 'final';

            if ($isFinal) {
                // 1a. Jika FINAL, $id adalah job_id. Ambil data lowongannya
                $job = \DB::table('jobs')->where('id', $id)->first();
                if (!$job) {
                    return response()->json(['status' => 'error', 'message' => 'Lowongan tidak ditemukan.'], 404);
                }

                // Ambil application_id dari query string URL
                $appId = $request->query('app_id');
                if (!$appId) {
                    return response()->json(['status' => 'error', 'message' => 'Parameter Lamaran (app_id) diperlukan.'], 400);
                }

                // Ambil data lamaran beserta nama user terkait
                $myApplication = \DB::table('applications')
                    ->join('users', 'applications.user_id', '=', 'users.id')
                    ->select('applications.*', 'users.name as user_name')
                    ->where('applications.id', $appId)
                    ->where('applications.job_id', $id)
                    ->first();

                if (!$myApplication) {
                    return response()->json(['status' => 'error', 'message' => 'Data lamaran tidak ditemukan.'], 404);
                }

                $titleDocument = "SURAT KEPUTUSAN HASIL AKHIR KELULUSAN SELEKSI";
                $jobTitle = $job->title;
                $stageName = "HASIL AKHIR (KELULUSAN FINAL)";

                // Ambil status akhir utama lamaran pelamar (Lulus / Tidak Lulus)
                $currentStatus = strtoupper($myApplication->status); 

                // 🚀 SEKARANG DISERAGAMKAN: Baik Lulus atau Tidak Lulus, breakdown SEMUA tahapan seleksi lowongan ini
                $allStages = \DB::table('job_stages')
                    ->where('job_id', $id)
                    ->orderBy('stage_order', 'asc')
                    ->get();

                $passedApplicants = $allStages->map(function($stage) use ($myApplication) {
                    // Cari skor pelamar di tahapan spesifik ini
                    $stageResult = \DB::table('application_stage_results')
                        ->where('application_id', $myApplication->id)
                        ->where('job_stage_id', $stage->id)
                        ->first();

                    $score = $stageResult ? $stageResult->score : 0;
                    $finalScore = $score && $score > 0 ? $score : 0;

                    $displayStageName = $stage->stage_name ?? $stage->name;

                    // Tentukan status per-tahapan secara dinamis
                    if ($stageResult) {
                        $stageStatus = strtoupper($stageResult->status);
                    } else {
                        $stageStatus = 'BELUM DIIKUTI';
                    }

                    return (object)[
                        'name' => 'Tahap: ' . $displayStageName,
                        'score' => $finalScore,
                        'final_status' => $stageStatus,
                        'is_breakdown' => 1
                    ];
                });

            } else {
                // 1b. Jika Tahapan Biasa, $id adalah stageId
                $stage = \DB::table('job_stages')
                    ->join('jobs', 'job_stages.job_id', '=', 'jobs.id')
                    ->select('job_stages.*', 'jobs.title as job_title')
                    ->where('job_stages.id', $id)
                    ->first();

                if (!$stage) {
                    return response()->json(['status' => 'error', 'message' => 'Tahapan seleksi tidak ditemukan.'], 404);
                }

                $titleDocument = "PENGUMUMAN DAFTAR PESERTA LULUS SELEKSI PER TAHAPAN";
                $jobTitle = $stage->job_title;
                $stageName = $stage->stage_name ?? $stage->name;

                // Ambil pelamar yang lulus di tahapan spesifik ini
                $passedApplicants = \DB::table('application_stage_results')
                    ->join('applications', 'application_stage_results.application_id', '=', 'applications.id')
                    ->join('users', 'applications.user_id', '=', 'users.id')
                    ->where('application_stage_results.job_stage_id', $id)
                    ->whereIn('application_stage_results.status', ['lulus', 'Lulus', 'selesai', 'Selesai'])
                    ->select('users.name', 'application_stage_results.score', \DB::raw('"LULUS" as final_status'), \DB::raw('0 as is_breakdown'))
                    ->orderBy('application_stage_results.score', 'desc')
                    ->get();
            }

            $date = \Carbon\Carbon::now()->translatedFormat('d F Y');

            // 2. Render Template HTML PDF
            $html = '
            <!DOCTYPE html>
            <html>
            <head>
                <title>' . $titleDocument . '</title>
                <style>
                    body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #222; line-height: 1.5; padding: 20px; }
                    .header { text-align: center; margin-bottom: 25px; border-bottom: 3px double #0D278D; padding-bottom: 12px; }
                    .title { font-size: 20px; font-weight: bold; color: #0D278D; margin: 0; }
                    .subtitle { font-size: 13px; color: #444; font-weight: bold; margin-top: 5px; }
                    .content-text { font-size: 13px; text-align: justify; margin-bottom: 20px; }
                    .meta-info { font-size: 13px; margin-bottom: 25px; line-height: 1.6; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
                    th { background-color: #0D278D; color: white; padding: 10px; font-weight: bold; text-align: left; border: 1px solid #0D278D; }
                    td { padding: 10px; border: 1px solid #e2e8f0; }
                    .text-center { text-align: center; }
                    
                    /* Badge Colors */
                    .badge-lulus { background-color: #d1fae5; color: #065f46; padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; text-transform: uppercase; }
                    .badge-gagal { background-color: #fee2e2; color: #991b1b; padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; text-transform: uppercase; }
                    .badge-neutral { background-color: #f1f5f9; color: #475569; padding: 4px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; text-transform: uppercase; }
                    
                    .signature-container { margin-top: 50px; width: 100%; text-align: right; }
                    .signature { display: inline-block; text-align: center; width: 230px; font-size: 13px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">PANITIA SELEKSI REKRUTMEN</div>
                    <div class="subtitle">SISTEM INFORMASI PENERIMAAN TENAGA PENDUKUNG & KONSULTAN INDIVIDU</div>
                </div>

                <div class="text-center" style="font-size: 14px; font-weight: bold; color: #0D278D; margin-bottom: 20px; text-decoration: underline;">
                    ' . strtoupper($titleDocument) . '
                </div>';

                if ($isFinal) {
                    $html .= '<p class="content-text">
                        Berikut adalah lampiran rincian nilai komponen evaluasi dan rekapitulasi capaian skor Anda pada setiap tahapan seleksi yang telah diselenggarakan untuk posisi formasi di bawah ini:
                    </p>';
                } else {
                    $html .= '<p class="content-text">
                        Berdasarkan seluruh rangkaian tahapan evaluasi, verifikasi berkas, uji kompetensi, serta penetapan kelayakan acuan seleksi rekrutmen mandiri, dengan ini menetapkan hasil ketetapan evaluasi komponen peserta pada posisi berikut:
                    </p>';
                }

                $html .= '
                <div class="meta-info">
                    <strong>Formasi Lowongan / Jabatan :</strong> ' . $jobTitle . '<br>
                    <strong>Keterangan Dokumen :</strong> ' . $stageName . '<br>
                    <strong>Tanggal Pengesahan :</strong> ' . $date . '
                    ' . ($isFinal ? '<br><strong>Nama Lengkap Pelamar :</strong> ' . strtoupper($myApplication->user_name) : '') . '
                </div>

                <table>
                    <thead>
                        <tr>
                            <th width="8%" class="text-center">NO</th>
                            <th>' . ($isFinal ? 'KOMPONEN TAHAPAN SELEKSI' : 'NAMA LENGKAP PELAMAR') . '</th>
                            <th width="18%" class="text-center">' . ($isFinal ? 'SKOR CAPAIAN' : 'AKUMULASI SKOR') . '</th>
                            <th width="25%" class="text-center">STATUS KETETAPAN</th>
                        </tr>
                    </thead>
                    <tbody>';
                    
                    if($passedApplicants->isEmpty()) {
                        $html .= '<tr><td colspan="4" class="text-center" style="color: #64748b; font-style: italic; padding: 20px;">Belum ada data evaluasi seleksi yang disahkan untuk formasi ini.</td></tr>';
                    } else {
                        foreach ($passedApplicants as $index => $applicant) {
                            
                            // Logika badge warna dinamis per rincian tahapan
                            $statusClean = strtolower($applicant->final_status);
                            if (str_contains($statusClean, 'lulus') || str_contains($statusClean, 'selesai')) {
                                $badgeClass = 'badge-lulus';
                            } elseif (str_contains($statusClean, 'tidak') || str_contains($statusClean, 'gagal')) {
                                $badgeClass = 'badge-gagal';
                            } else {
                                $badgeClass = 'badge-neutral';
                            }

                            $html .= '<tr>
                                <td class="text-center">' . ($index + 1) . '</td>
                                <td style="' . ($applicant->is_breakdown ? 'font-weight: normal;' : 'text-transform: uppercase; font-weight: 500;') . '">' . e($applicant->name) . '</td>
                                <td class="text-center" style="font-weight: bold; color: #0D278D;">' . ($applicant->score !== null ? $applicant->score : '-') . '</td>
                                <td class="text-center"><span class="' . $badgeClass . '">' . e($applicant->final_status) . '</span></td>
                            </tr>';
                        }
                        
                        // 🚀 BARIS KESIMPULAN AKHIR DINAMIS (IKUT STATUS UTAMA APPLICATIONS)
                        if ($isFinal && isset($currentStatus)) {
                            $isLulusUtama = $currentStatus === 'LULUS';
                            $kesimpulanBadge = $isLulusUtama ? 'badge-lulus' : 'badge-gagal';
                            $kesimpulanText = $isLulusUtama ? 'LULUS UTAMA SELEKSI' : 'TIDAK LULUS SELEKSI';

                            $html .= '<tr style="background-color: #f8fafc; font-weight: bold;">
                                <td colspan="2" class="text-center" style="text-transform: uppercase;">KESIMPULAN HASIL AKHIR REKRUTMEN</td>
                                <td class="text-center" style="color: #0D278D;">-</td>
                                <td class="text-center"><span class="' . $kesimpulanBadge . '">' . $kesimpulanText . '</span></td>
                            </tr>';
                        }
                    }

            $html .= '
                    </tbody>
                </table>

                <p style="font-size: 11px; color: #64748b; margin-top: 30px; font-style: italic;">
                    *Catatan: Surat keputusan ini bersifat mengikat dan mutlak serta tidak dapat diganggu gugat oleh pihak manapun.
                </p>

                <div class="signature-container">
                    <div class="signature">
                        Bandar Lampung, ' . $date . '<br>
                        Tim Penilai Seleksi
                        <br><br><br><br><br>
                        <strong>Panitia Rekrutmen Mandiri</strong>
                    </div>
                </div>
            </body>
            </html>';

            $pdf = Pdf::loadHTML($html);
            return $pdf->download(str_replace(' ', '_', $stageName) . '.pdf');

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses file PDF: ' . $e->getMessage()], 500);
        }
    }
}