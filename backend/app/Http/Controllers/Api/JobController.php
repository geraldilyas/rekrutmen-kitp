<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use App\Services\JobService;

class JobController extends Controller
{
    protected $jobService;

    public function __construct(JobService $jobService)
    {
        $this->jobService = $jobService;
    }

    /**
     * GET ALL JOBS.
     */
    public function index(Request $request)
    {
        // 1. Ambil data lowongan asli menggunakan service bawaan lo
        $rawJobs = $this->jobService->getJobs($request->all());

        // 2. Kita bungkus pakai collection dan re-mapping datanya sebelum dikirim ke React
        $jobs = collect($rawJobs)->map(function($job) {
            
            // Mencari tahapan seleksi yang saat ini sedang aktif berdasarkan tanggal hari ini
            // Menggunakan properti 'stages' sesuai dengan eager load di fungsi show() lo
            $activeStage = collect($job->stages)->first(function($stage) {
                return $stage->start_date && $stage->end_date && now()->between($stage->start_date, $stage->end_date);
            });

            return [
                'id'               => $job->id,
                'title'            => $job->title,
                'category'         => $job->category,
                'description'      => $job->description,
                'qualification'    => $job->qualification,
                'requirements'     => $job->requirements,
                'location'         => $job->location,
                'unit_kerja'       => $job->unit_kerja,
                'duration'         => $job->duration,
                'recruiter_name'   => $job->recruiter_name,
                'start_date'       => $job->start_date,
                'end_date'         => $job->end_date,
                'status'           => $job->status ?? 'active', // Status penanda berlangsung/selesai
                
                // 🚀 BY SYSTEM 1: Hitung total pendaftar asli di database
                'totalPendaftar'   => $job->applications()->count(),
                
                // 🚀 BY SYSTEM 2: Hitung otomatis pelamar yang lulus & gagal di tahap aktif saat ini
                // Pastikan model JobStage.php sudah punya fungsi relasi results() ya bro!
                'jumlah_lolos'     => $activeStage ? $activeStage->results()->where('status', 'lulus')->count() : 0,
                'jumlah_gagal'     => $activeStage ? $activeStage->results()->where('status', 'tidak_lulus')->count() : 0,
                
                'selection_stages' => $job->stages
            ];
        });

        // 3. Kirim ke React frontend lo
        return response()->json($jobs);
    }

    /**
     * STORE JOB + FORM DINAMIS.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'category'       => 'required|in:tenaga_pendukung,konsultan_individu',
            'description'    => 'required|string',
            'qualification'  => 'nullable|string|max:500',
            'location'       => 'nullable|string|max:255',
            'unit_kerja'     => 'nullable|string|max:255',
            'duration'       => 'nullable|string|max:100',
            'recruiter_name' => 'nullable|string|max:255',
            'start_date'     => 'required|date',
            'end_date'       => 'required|date|after_or_equal:start_date',
            'deadline'       => 'nullable|date',
            'requirements'   => 'nullable|string',
            'form_fields'    => 'nullable|array',
            'form_fields.*'  => 'exists:form_fields,id',
            'stages'         => 'required|array|min:1',
            'stages.*.name'       => 'required|string|max:255',
            'stages.*.stage_order' => 'required|integer|min:1',
            'stages.*.start_date' => 'nullable|date',
            'stages.*.end_date'   => 'nullable|date',
            'stages.*.weight'     => 'required|numeric|min:0|max:100',
            'stages.*.test_link'  => 'nullable|max:255',
        ]);

        $totalWeight = collect($validated['stages'])->sum('weight');
        if ($totalWeight != 100) {
            return response()->json([
                'message' => 'Total bobot semua tahapan harus 100%',
                'current_total' => $totalWeight
            ], 422);
        }

        $job = $this->jobService->createJob($validated);

        return response()->json([
            'message' => 'Lowongan berhasil dibuat',
            'data' => $job
        ], 201);
    }

    /**
     * GET SINGLE JOB DETAIL.
     */
    public function show($id)
    {
        $job = Job::with(['formFields', 'stages', 'announcements'])->findOrFail($id);

        return response()->json([
            'message' => 'Job detail retrieved successfully',
            'data' => $job
        ]);
    }

    /**
     * UPDATE JOB.
     */
    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'category'       => 'required|in:tenaga_pendukung,konsultan_individu',
            'description'    => 'required|string',
            'qualification'  => 'nullable|string|max:500',
            'location'       => 'nullable|string|max:255',
            'unit_kerja'     => 'nullable|string|max:255',
            'duration'       => 'nullable|string|max:100',
            'recruiter_name' => 'nullable|string|max:255',
            'start_date'     => 'required|date',
            'end_date'       => 'required|date|after_or_equal:start_date',
            'deadline'       => 'nullable|date',
            'requirements'   => 'nullable|string',
            'form_fields'    => 'nullable|array',
            'form_fields.*'  => 'exists:form_fields,id',
        ]);

        $job = $this->jobService->updateJob($job, $validated);

        return response()->json([
            'message' => 'Lowongan berhasil diupdate',
            'data' => $job
        ]);
    }

    /**
     * DELETE JOB.
     */
    public function destroy($id)
    {
        $job = Job::findOrFail($id);
        $this->jobService->deleteJob($job);

        return response()->json([
            'message' => 'Lowongan berhasil dihapus'
        ]);
    }

    /**
     * GET FORM FOR APPLICANTS.
     */
    public function getForm($id)
    {
        $job = Job::with('formFields')->findOrFail($id);

        return response()->json([
            'job' => $job->title,
            'form' => $job->formFields
        ]);
    }
}