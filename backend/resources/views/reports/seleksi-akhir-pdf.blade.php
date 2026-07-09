<!DOCTYPE html>
<html>
<head>
    <title>Daftar Peserta Lulus Seleksi Akhir - {{ $job->title }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 10px;
            color: #1a1a2e;
            background: #fff;
            /* Margin kiri-kanan untuk tampilan rapih di A4 */
            padding: 28px 36px 36px 36px;
        }

        /* ===================== HEADER ===================== */
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

        /* ===================== SECTION TAHAPAN ===================== */
        .section-wrapper {
            margin-bottom: 18px;
            page-break-inside: avoid;
        }
        .section-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
        }
        .stage-number {
            background: #0D278D;
            color: #fff;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 1px;
            padding: 3px 8px;
            border-radius: 3px;
            white-space: nowrap;
        }
        .stage-title {
            font-size: 10px;
            font-weight: 900;
            color: #0D278D;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stage-weight {
            font-size: 8px;
            color: #6b7280;
            font-weight: bold;
            margin-left: auto;
            white-space: nowrap;
        }

        /* ===================== TABLE ===================== */
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

        /* Status badge */
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

        /* ===================== DIVIDER ===================== */
        .section-divider {
            border: none;
            border-top: 1px dashed #c7d2fe;
            margin: 16px 0;
        }
        .section-divider-bold {
            border: none;
            border-top: 2px solid #0D278D;
            margin: 20px 0;
        }

        /* ===================== RECAP ===================== */
        .recap-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
        }
        .recap-label {
            background: #FEB700;
            color: #0D278D;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 1px;
            padding: 3px 9px;
            border-radius: 3px;
        }
        .recap-title {
            font-size: 10px;
            font-weight: 900;
            color: #1a1a2e;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .recap-table th {
            background-color: #1a1a2e;
        }
        .th-skor-akhir {
            background: #FEB700 !important;
            color: #0D278D !important;
            border-color: #d4a017 !important;
        }
        .final-score-cell {
            background: #fffbeb !important;
            font-weight: 900;
            font-size: 11px;
            text-align: center;
            color: #0D278D;
        }

        /* ===================== FOOTER ===================== */
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
    </style>
</head>
<body>

    {{-- ===================== HEADER ===================== --}}
    <div class="header">
        <div class="report-label">Laporan Resmi Rekrutmen KITP</div>
        <h1>{{ $report_title ?? 'DAFTAR PESERTA LULUS SELEKSI AKHIR' }}</h1>
        <h2>{{ $job->title }}</h2>
        <span class="header-meta">
            Unit Kerja: {{ $job->unit_kerja ?? '-' }}
            &nbsp;&bull;&nbsp;
            Dicetak: {{ date('d F Y') }}
        </span>
    </div>

    {{-- ===================== SECTION PER TAHAPAN ===================== --}}
    @foreach($job->stages->sortBy('stage_order') as $stageIndex => $stage)

        <div class="section-wrapper">
            <div class="section-header">
                <span class="stage-number">TAHAP {{ $stageIndex + 1 }}</span>
                <span class="stage-title">{{ $stage->name }}</span>
                <span class="stage-weight">Bobot: {{ $stage->weight }}%</span>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 24px;" class="td-center">No</th>
                        <th>Nama Peserta</th>
                        <th style="width: 110px;">NIK</th>
                        <th style="width: 55px;" class="td-center">Skor</th>
                        <th style="width: 70px;" class="td-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        // Filter pelamar yang memiliki hasil (lulus maupun tidak lulus) di tahapan ini
                        $stageApps = $all_applications->filter(function($app) use ($stage) {
                            return $app->stageResults->contains('job_stage_id', $stage->id);
                        })->values();

                        // Urutkan pelamar berdasarkan nilai di tahapan ini secara descending (nilai tertinggi di paling atas)
                        $stageApps = $stageApps->sortByDesc(function($app) use ($stage) {
                            $result = $app->stageResults->firstWhere('job_stage_id', $stage->id);
                            return $result ? ($result->score ?? 0) : 0;
                        })->values();
                    @endphp

                    @forelse($stageApps as $i => $app)
                        @php
                            $result     = $app->stageResults->firstWhere('job_stage_id', $stage->id);
                            $stageStatus = $result ? ($result->status ?? '-') : '-';
                            $badgeClass = 'badge-proses';
                            if (strtolower($stageStatus) === 'lulus')
                                $badgeClass = 'badge-lulus';
                            elseif (in_array(strtolower($stageStatus), ['tidak lulus', 'gagal', 'fail']))
                                $badgeClass = 'badge-tidak';
                        @endphp
                        <tr>
                            <td class="td-center">{{ $i + 1 }}</td>
                            <td>{{ $app->user->name }}</td>
                            <td>{{ $app->user->nik ?? '-' }}</td>
                            <td class="td-score">{{ $result ? ($result->score ?? '-') : '-' }}</td>
                            <td class="td-center">
                                <span class="badge {{ $badgeClass }}">{{ $stageStatus }}</span>
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
        </div>

        @if(!$loop->last)
            <hr class="section-divider">
        @endif

    @endforeach

    {{-- ===================== REKAP AKHIR ===================== --}}
    <hr class="section-divider-bold">

    <div class="recap-header">
        <span class="recap-label">REKAP AKHIR</span>
        <span class="recap-title">Tabel Hasil Seleksi Keseluruhan</span>
    </div>

    <table class="recap-table">
        <thead>
            <tr>
                <th style="width: 24px;" class="td-center">No</th>
                <th>Nama Peserta</th>
                <th style="width: 140px;">Email</th>
                <th style="width: 100px;">NIK</th>
                @foreach($job->stages->sortBy('stage_order') as $stage)
                    <th class="td-center" style="width: 55px;">{{ $stage->name }}</th>
                @endforeach
                <th class="td-center th-skor-akhir" style="width: 55px;">Skor Akhir</th>
                <th class="td-center" style="width: 70px;">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($applications as $index => $app)
                @php
                    $isLulus    = strtolower($app->status) === 'lulus';
                    $statusClass = $isLulus ? 'badge-lulus' : 'badge-tidak';
                @endphp
                <tr>
                    <td class="td-center">{{ $index + 1 }}</td>
                    <td style="font-weight: bold;">{{ $app->user->name }}</td>
                    <td style="font-size: 8px;">{{ $app->user->email }}</td>
                    <td>{{ $app->user->nik ?? '-' }}</td>
                    @foreach($job->stages->sortBy('stage_order') as $stage)
                        @php $result = $app->stageResults->firstWhere('job_stage_id', $stage->id); @endphp
                        <td class="td-score">{{ $result ? ($result->score ?? '-') : '-' }}</td>
                    @endforeach
                    <td class="final-score-cell">{{ $app->calculated_final_score ?? '-' }}</td>
                    <td class="td-center">
                        <span class="badge {{ $statusClass }}">{{ ucfirst($app->status) }}</span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- ===================== FOOTER ===================== --}}
    <div class="footer">
        <div class="footer-note">
            * Dokumen ini digenerate otomatis oleh sistem rekrutmen KITP.<br>
            Total peserta dalam rekap: {{ count($applications) }} orang.
        </div>
        <div class="signature-block">
            <p>Bandar Lampung, {{ date('d F Y') }}</p>
            <p>Panitia Seleksi</p>
            <br><br><br>
            <span class="signature-name">( ................................ )</span>
        </div>
    </div>

</body>
</html>
