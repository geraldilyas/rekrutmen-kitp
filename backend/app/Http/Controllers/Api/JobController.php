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
        // 1. Ambil data dengan Eager Loading agar query super cepat dan tidak merusak data relasi
        $rawJobs = Job::with(['stages.documents'])
            ->withCount('applications')
            ->latest()
            ->get();

        // 2. Kita bungkus pakai collection dan re-mapping datanya sebelum dikirim ke React
        $jobs = $rawJobs->map(function($job) {
            
            // Mencari tahapan seleksi yang saat ini sedang aktif berdasarkan tanggal hari ini
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
                'deadline'         => $job->deadline, 
                'kuota'            => $job->kuota, // 🚀 FIX: Wajib di-return agar terdeteksi oleh React!
                'status'           => $job->status ?? 'active',
                
                // 🚀 Menggunakan properti hasil withCount
                'totalPendaftar'   => $job->applications_count,
                
                // Hitung otomatis pelamar yang lulus & gagal di tahap aktif saat ini
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
            'qualification'  => 'required|string|max:500',
            'location'       => 'nullable|string|max:255',
            'unit_kerja'     => 'required|string|max:255',
            'duration'       => 'required|string|max:100',
            'recruiter_name' => 'required|string|max:255',
            'start_date'     => 'required|date',
            'end_date'       => 'required|date|after_or_equal:start_date',
            'deadline'       => 'nullable|date',
            'kuota'          => 'required|integer|min:1', // 🚀 FIX: Daftarkan rules validasi kuota disini
            'requirements'   => 'nullable|string',
            'form_fields'    => 'nullable|array',
            'form_fields.*'  => 'exists:form_fields,id',
            'stages'         => 'required|array|min:1',
            'stages.*.name'        => 'required|string|max:255',
            'stages.*.stage_order' => 'required|integer|min:1',
            'stages.*.start_date' => 'nullable|date',
            'stages.*.end_date'   => 'nullable|date',
            'stages.*.grading_end_date' => 'nullable|date|after_or_equal:stages.*.end_date',
            'stages.*.weight'     => 'required|numeric|min:0|max:100',
            'stages.*.test_link'  => 'nullable|max:255',
            'stages.*.documents'               => 'nullable|array',
            'stages.*.documents.*.form_field_id' => 'required_with:stages.*.documents|exists:form_fields,id',
            'stages.*.documents.*.weight'        => 'nullable|integer|min:0|max:100',
        ]);

        $totalWeight = collect($validated['stages'])->sum('weight');
        if ($totalWeight != 100) {
            return response()->json([
                'message' => 'Total bobot semua tahapan harus 100%',
                'current_total' => $totalWeight
            ], 422);
        }

        foreach ($validated['stages'] as $stage) {
            if (empty($stage['documents'])) {
                continue;
            }

            $docWeight = collect($stage['documents'])->sum('weight');
            if ($docWeight != $stage['weight']) {
                return response()->json([
                    'message' => "Total bobot dokumen pada tahapan \"{$stage['name']}\" harus sama dengan bobot tahapan ({$stage['weight']}%)",
                    'current_total' => $docWeight
                ], 422);
            }
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
        $job = Job::withoutGlobalScopes()->with(['announcements', 'formFields', 'stages.documents'])->find($id);

        if (!$job) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lowongan tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $job
        ], 200);
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
            'qualification'  => 'required|string|max:500',
            'location'       => 'nullable|string|max:255',
            'unit_kerja'     => 'required|string|max:255',
            'duration'       => 'required|string|max:100',
            'recruiter_name' => 'required|string|max:255',
            'start_date'     => 'required|date',
            'end_date'       => 'required|date|after_or_equal:start_date',
            'deadline'       => 'nullable|date',
            'kuota'          => 'required|integer|min:1', // 🚀 FIX: Daftarkan rules validasi kuota disini saat update
            'requirements'   => 'nullable|string',
            'form_fields'    => 'nullable|array',
            'form_fields.*'  => 'exists:form_fields,id',
            'stages'                 => 'nullable|array|min:1',
            'stages.*.id'            => 'nullable|integer|exists:job_stages,id',
            'stages.*.name'          => 'required_with:stages|string|max:255',
            'stages.*.stage_order'   => 'required_with:stages|integer|min:1',
            'stages.*.start_date'    => 'nullable|date',
            'stages.*.end_date'      => 'nullable|date',
            'stages.*.grading_end_date' => 'nullable|date|after_or_equal:stages.*.end_date',
            'stages.*.weight'        => 'required_with:stages|numeric|min:0|max:100',
            'stages.*.test_link'     => 'nullable|max:255',
            'stages.*.documents'                 => 'nullable|array',
            'stages.*.documents.*.form_field_id' => 'required_with:stages.*.documents|exists:form_fields,id',
            'stages.*.documents.*.weight'        => 'nullable|integer|min:0|max:100',
        ]);

        if (!empty($validated['stages'])) {
            $totalWeight = collect($validated['stages'])->sum('weight');
            if ($totalWeight != 100) {
                return response()->json([
                    'message' => 'Total bobot semua tahapan harus 100%',
                    'current_total' => $totalWeight
                ], 422);
            }

            foreach ($validated['stages'] as $stage) {
                if (empty($stage['documents'])) {
                    continue;
                }

                $docWeight = collect($stage['documents'])->sum('weight');
                if ($docWeight != $stage['weight']) {
                    return response()->json([
                        'message' => "Total bobot dokumen pada tahapan \"{$stage['name']}\" harus sama dengan bobot tahapan ({$stage['weight']}%)",
                        'current_total' => $docWeight
                    ], 422);
                }
            }
        }

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
     * GET PUBLIC ANNOUNCEMENTS (Jobs with published results)
     */
    public function announcements()
    {
        $jobs = Job::withoutGlobalScopes()
            ->whereHas('announcements')
            ->with(['announcements'])
            ->withCount('applications')
            ->withCount(['applications as accepted_count' => function ($query) {
                $query->where('status', 'lulus');
            }])
            ->latest()
            ->get();

        $data = $jobs->map(function ($job) {
            return [
                'id'                 => $job->id,
                'title'              => $job->title,
                'category'           => $job->category,
                'description'        => $job->description,
                'qualification'      => $job->qualification,
                'deadline'           => $job->deadline,
                'kuota'              => $job->kuota, // 🚀 FIX: Daftarkan kuota disini juga jika dibutuhkan halaman pengumuman
                'applications_count' => $job->applications_count,
                'accepted_count'     => $job->accepted_count,
                'announcements'      => $job->announcements,
            ];
        });

        return response()->json($data);
    }

    public function getForm($id)
    {
        $job = Job::with('formFields')->findOrFail($id);

        return response()->json([
            'job' => $job->title,
            'form' => $job->formFields
        ]);
    }
}