<?php

namespace App\Exports;

use App\Models\Application;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ApplicationsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $jobId;
    protected $status;

    public function __construct($jobId = null, $status = null)
    {
        $this->jobId = $jobId;
        $this->status = $status;
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

        return $query->get()->sortByDesc('calculated_final_score');
    }

    public function map($application): array
    {
        return [
            $application->id,
            $application->user->name ?? '-',
            $application->user->email ?? '-',
            $application->job->title ?? '-',
            ucfirst($application->status),
            $application->calculated_final_score ?? 0,
            $application->created_at->format('d-m-Y H:i'),
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nama Lengkap',
            'Email',
            'Lowongan',
            'Status',
            'Skor Akhir',
            'Tanggal Melamar',
        ];
    }
}
