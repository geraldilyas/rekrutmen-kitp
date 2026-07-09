<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\ReportService;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * List jobs that have passed their deadline (closed) and final stage.
     */
    public function closedJobs()
    {
        $jobs = $this->reportService->getEligibleJobs();

        return response()->json([
            'message' => 'Jobs eligible for announcement retrieved successfully',
            'data' => $jobs
        ]);
    }

    /**
     * Download an editable Word (.docx) draft listing every applicant, their
     * NIK, scores per stage, final score, and status — for the admin to edit
     * outside the system and re-upload as the official final announcement.
     */
    public function exportFinalWordTemplate($job_id)
    {
        $job = Job::with('stages')->findOrFail($job_id);
        $phpWord = $this->reportService->generateFinalAnnouncementWord($job);

        $filename = 'draf-hasil-akhir-' . str_replace(' ', '-', strtolower($job->title)) . '.docx';
        $tempPath = tempnam(sys_get_temp_dir(), 'word') . '.docx';

        $writer = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        $writer->save($tempPath);

        return response()->download($tempPath, $filename)->deleteFileAfterSend(true);
    }

    /**
     * Create an announcement manually (Upload file).
     */
    public function createAnnouncement(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_id' => 'required|exists:jobs,id',
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf|max:5120',
        ], [
            'file.required' => 'File dokumen wajib diunggah.',
            'file.file' => 'File yang diunggah tidak valid.',
            'file.mimes' => 'File harus berupa dokumen PDF.',
            'file.max' => 'Ukuran file maksimal 5 MB.',
            'title.required' => 'Judul pengumuman wajib diisi.',
            'job_id.exists' => 'Lowongan tidak ditemukan.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $job = Job::with(['stages', 'announcements'])->findOrFail($request->job_id);

        try {
            $announcement = $this->reportService->createAnnouncement($job, $request->all());
            return response()->json(['message' => 'Pengumuman berhasil diterbitkan', 'data' => $announcement], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Get announcements for a job.
     */
    public function getAnnouncements($job_id)
    {
        $announcements = Announcement::where('job_id', $job_id)->get();
        return response()->json(['data' => $announcements]);
    }
}

