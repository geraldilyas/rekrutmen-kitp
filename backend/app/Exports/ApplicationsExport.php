<?php

namespace App\Exports;

use App\Models\Application;
use Maatwebsite\Excel\Concerns\FromCollection;

class ApplicationsExport implements FromCollection
{
    public function collection()
    {
        return Application::with('user', 'job')->get();
    }
}