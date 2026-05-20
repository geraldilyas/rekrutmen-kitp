<?php

namespace App\Exports;

use App\Models\Application;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ApplicationsExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $jobId;

    public function __construct($jobId = null)
    {
        $this->jobId = $jobId;
    }

    public function query()
    {
        $query = Application::with(['user', 'job']);

        if ($this->jobId) {
            $query->where('job_id', $this->jobId);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'ID Lamaran',
            'NIK',
            'Nama Pelamar',
            'Email',
            'Posisi / Job',
            'Status',
            'Tanggal Melamar',
        ];
    }

    public function map($application): array
    {
        return [
            $application->id,
            $application->user->nik ?? '-',
            $application->user->name ?? '-',
            $application->user->email ?? '-',
            $application->job->title ?? '-',
            ucfirst($application->status),
            $application->created_at->format('d-m-Y H:i'),
        ];
    }
}
