<!DOCTYPE html>
<html>
<head>
    <title>Hasil Tahapan {{ $stage->name }} - {{ $job->title }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 10px;
            color: #1a1a2e;
            background: #fff;
            padding: 28px 36px 36px 36px;
        }

        .header {
            text-align: center;
            padding-bottom: 14px;
            border-bottom: 3px solid #0D278D;
            margin-bottom: 18px;
        }
        .header .report-label {
            font-size: 8px;
            font-weight: bold;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #0D278D;
            margin-bottom: 5px;
        }
        .header h1 {
            font-size: 14px;
            font-weight: 900;
            color: #0D278D;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 3px;
        }
        .header h2 {
            font-size: 11px;
            font-weight: bold;
            color: #1a1a2e;
            margin-bottom: 7px;
        }
        .header-meta {
            font-size: 8px;
            color: #6b7280;
            background: #f0f4ff;
            border: 1px solid #c7d2fe;
            border-radius: 4px;
            padding: 3px 10px;
        }

        .info-box {
            margin-bottom: 16px;
            padding: 10px 14px;
            background: #f8faff;
            border-left: 3px solid #0D278D;
            border-radius: 4px;
        }
        .info-box .info-label {
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #0D278D;
            margin-bottom: 4px;
        }
        .info-box .info-text {
            font-size: 9px;
            color: #374151;
            line-height: 1.5;
            white-space: pre-line;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background-color: #0D278D;
            color: #fff;
            font-size: 8px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            padding: 6px 7px;
            text-align: left;
            border: 1px solid #0a1f70;
        }
        td {
            padding: 5px 7px;
            border: 1px solid #e5e7eb;
            font-size: 9px;
            vertical-align: middle;
        }
        tr:nth-child(even) td { background-color: #f8faff; }
        tr:nth-child(odd) td  { background-color: #ffffff; }

        .td-center { text-align: center; }
        .td-score  { text-align: center; font-weight: bold; font-size: 10px; }

        .badge {
            display: inline-block;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 0.4px;
            padding: 2px 6px;
            border-radius: 8px;
            text-transform: uppercase;
        }
        .badge-lulus  { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
        .badge-tidak  { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
        .badge-proses { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }

        .footer {
            margin-top: 36px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .footer-note {
            font-size: 8px;
            color: #9ca3af;
            font-style: italic;
            line-height: 1.5;
        }
        .signature-block {
            text-align: center;
            font-size: 9px;
            line-height: 1.6;
        }
        .signature-name {
            border-top: 1px solid #1a1a2e;
            padding-top: 4px;
            font-weight: bold;
            min-width: 150px;
            display: inline-block;
        }

        .disclaimer {
            margin-top: 22px;
            padding: 8px 12px;
            border: 1px dashed #c7d2fe;
            border-radius: 4px;
            background: #f8faff;
            font-size: 8px;
            color: #4b5563;
            font-style: italic;
            line-height: 1.5;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="report-label">Laporan Resmi Rekrutmen KITP</div>
        <h1>{{ $report_title ?? 'HASIL TAHAPAN SELEKSI' }}</h1>
        <h2>{{ $job->title }} &mdash; {{ $stage->name }}</h2>
        <span class="header-meta">
            Unit Kerja: {{ $job->unit_kerja ?? '-' }}
            &nbsp;&bull;&nbsp;
            Bobot Tahapan: {{ $stage->weight }}%
            &nbsp;&bull;&nbsp;
            Dicetak: {{ date('d F Y') }}
        </span>
    </div>

    @if($stage->info)
        <div class="info-box">
            <p class="info-label">Informasi Tahapan</p>
            <p class="info-text">{{ $stage->info }}</p>
        </div>
    @endif

    <table>
        <thead>
            <tr>
                <th style="width: 24px;" class="td-center">No</th>
                <th>Nama Peserta</th>
                <th style="width: 140px;">NIK</th>
                <th style="width: 55px;" class="td-center">Skor</th>
                <th style="width: 80px;" class="td-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($applications as $i => $app)
                @php
                    $result = $app->stageResults->firstWhere('job_stage_id', $stage->id);
                    $stageStatus = $result ? ($result->status ?? '-') : '-';
                    $badgeClass = 'badge-proses';
                    if (strtolower($stageStatus) === 'lulus')
                        $badgeClass = 'badge-lulus';
                    elseif (in_array(strtolower($stageStatus), ['tidak_lulus', 'tidak lulus', 'gagal', 'fail']))
                        $badgeClass = 'badge-tidak';
                @endphp
                <tr>
                    <td class="td-center">{{ $i + 1 }}</td>
                    <td>{{ $app->user->name }}</td>
                    <td>{{ $app->user->nik ?? '-' }}</td>
                    <td class="td-score">{{ $result ? ($result->score ?? '-') : '-' }}</td>
                    <td class="td-center">
                        <span class="badge {{ $badgeClass }}">{{ str_replace('_', ' ', ucfirst($stageStatus)) }}</span>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="td-center" style="color:#9ca3af; font-style:italic;">
                        Tidak ada data peserta untuk tahapan ini.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <div class="footer-note">
            * Dokumen ini digenerate otomatis oleh sistem rekrutmen KITP.<br>
            Diurutkan berdasarkan skor tertinggi. Total peserta: {{ count($applications) }} orang.
        </div>
        <div class="signature-block">
            <p>Bandar Lampung, {{ date('d F Y') }}</p>
            <p>Perekrut / Ketua Tim Seleksi</p>
            <br>
            <p>dto.</p>
            <br><br>
            <span class="signature-name">{{ $job->recruiter_name ?? '( ................................ )' }}</span>
        </div>
    </div>

    <div class="disclaimer">
        Dokumen ini merupakan dokumen resmi dan asli yang diterbitkan secara otomatis oleh sistem rekrutmen KITP.
    </div>

</body>
</html>
