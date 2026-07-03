<?php

namespace App\Exports;

use App\Models\Application;
use App\Models\Job;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ApplicationsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $jobId;
    protected $status;
    protected $stages;
    protected $rowNumber = 0;

    public function __construct($jobId = null, $status = null)
    {
        $this->jobId = $jobId;
        $this->status = $status;
        $this->stages = $jobId
            ? Job::findOrFail($jobId)->stages()->orderBy('stage_order')->get()
            : collect();
    }

    public function collection()
    {
        $query = Application::with(['user', 'job', 'job.stages', 'stageResults']);

        if ($this->jobId) {
            $query->where('job_id', $this->jobId);
        }

        if ($this->status) {
            $query->where('status', $this->status);
        }

        return $query->get()->sortByDesc('calculated_final_score')->values();
    }

    public function map($application): array
    {
        $this->rowNumber++;

        $row = [
            $this->rowNumber,
            $application->user->name ?? '-',
            $application->user->email ?? '-',
            $application->user->nik ?? '-',
        ];

        foreach ($this->stages as $stage) {
            $result = $application->stageResults->firstWhere('job_stage_id', $stage->id);
            $row[] = $result?->score ?? '-';
        }

        $row[] = $application->calculated_final_score ?? 0;
        $row[] = ucfirst($application->status);
        $row[] = $application->created_at->format('d-m-Y H:i');

        return $row;
    }

    public function headings(): array
    {
        $headings = ['No', 'Nama Lengkap', 'Email', 'NIK'];

        foreach ($this->stages as $stage) {
            $headings[] = $stage->name;
        }

        $headings[] = 'Skor Akhir';
        $headings[] = 'Status';
        $headings[] = 'Tanggal Melamar';

        return $headings;
    }
}
