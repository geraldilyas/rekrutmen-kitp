<!DOCTYPE html>
<html>
<head>
    <title>Laporan Pelamar - {{ $job->title }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .status-lulus { color: green; font-weight: bold; }
        .status-tidak { color: red; }
    </style>
</head>
<body>
    <div className="header">
        <h2>{{ $report_title ?? 'PENGUMUMAN HASIL SELEKSI' }}</h2>
        <h3>{{ $job->title }}</h3>
        <p>Unit Kerja: {{ $job->unit_kerja }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Pelamar</th>
                <th>Email</th>
                <th>NIK</th>
                <th>Status Akhir</th>
                <th>Skor Akhir</th>
            </tr>
        </thead>
        <tbody>
            @foreach($applications as $index => $app)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $app->user->name }}</td>
                    <td>{{ $app->user->email }}</td>
                    <td>{{ $app->user->nik }}</td>
                    <td>
                        <span class="{{ strtolower($app->status) == 'lulus' ? 'status-lulus' : 'status-tidak' }}">
                            {{ ucfirst($app->status) }}
                        </span>
                    </td>
                    <td>{{ $app->calculated_final_score ?? '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 50px; text-align: right;">
        <p>Bandar Lampung, {{ date('d F Y') }}</p>
        <p>Panitia Seleksi</p>
        <br><br><br>
        <p><b>( ............................ )</b></p>
    </div>
</body>
</html>
