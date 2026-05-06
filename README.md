# BBWS Recruitment Portal

**Sistem Portal Rekrutmen Tenaga Non-PNS**
Balai Besar Wilayah Sungai (BBWS) – Kementerian PUPR

---

## 📌 Deskripsi Proyek

BBWS Recruitment Portal adalah sistem berbasis web yang dirancang sebagai **single entry point** untuk proses rekrutmen tenaga non-PNS, seperti:

* Konsultan Individu
* Tenaga Pendukung
* Tenaga Kontrak

Sistem ini bertujuan untuk meningkatkan:

* **Transparansi** proses seleksi
* **Akuntabilitas** administrasi
* **Kemudahan akses** bagi pelamar
* **Efisiensi operasional** internal BBWS

---

## 🎯 Fitur Utama

### 👤 Portal Pelamar

* Registrasi & Login (Email + NIK)
* Pendaftaran lowongan
* Upload dokumen (CV, KTP, NPWP, Ijazah, dll)
* Dashboard status seleksi:

  * Verifikasi Berkas
  * Lulus Administrasi
  * Wawancara
  * Hasil Akhir

---

### 📄 Lowongan & Informasi

* Daftar lowongan aktif
* Detail posisi:

  * Jabatan
  * Kualifikasi
  * TOR/KAK
  * Durasi kontrak
  * Lokasi wilayah sungai
* Arsip rekrutmen (untuk transparansi publik)

---

### 📢 Pengumuman

* Publikasi hasil seleksi (PDF resmi)
* Notifikasi ke pelamar (dashboard & email)

---

### 🛠️ Admin Panel (Internal BBWS)

* Manajemen lowongan
* Verifikasi pelamar
* Update status seleksi
* Kirim notifikasi
* Laporan rekap data

---

## 🧱 Arsitektur Sistem

Proyek ini menggunakan arsitektur **decoupled (API-based)**:

```
Frontend (React)  →  Backend API (Laravel)  →  Database
```

---

## ⚙️ Tech Stack

### Backend

* PHP Framework: Laravel
* Authentication: Laravel Sanctum
* Database: MySQL / PostgreSQL
* Queue & Cache: Redis

### Frontend

* React + TypeScript
* Vite (build tool)
* Tailwind CSS (UI styling)
* React Query (data fetching)

### Infrastructure

* Nginx (web server)
* Docker (containerization)
* GitHub (version control & CI/CD)

---

## 📁 Struktur Proyek

```
bbws-recruitment-portal/
│
├── backend/        # Laravel API
├── frontend/       # React App
├── docs/           # Dokumentasi (ERD, API Spec, dll)
├── infra/          # Konfigurasi deployment (Docker, Nginx)
│
├── .gitignore
└── README.md
```

---

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/username/bbws-recruitment-portal.git
cd bbws-recruitment-portal
```

---

### 2. Setup Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Konfigurasi database di file `.env`, lalu jalankan:

```bash
php artisan migrate
php artisan serve
```

Backend akan berjalan di:

```
http://127.0.0.1:8000
```

---

### 3. Setup Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di:

```
http://localhost:5173
```

---

## 🔗 Integrasi API

Contoh endpoint:

```
GET    /api/jobs
POST   /api/applications
POST   /api/login
POST   /api/register
```

---

## 🔐 Keamanan & Kepatuhan

Sistem dirancang sesuai kebutuhan instansi pemerintah:

* Kepatuhan terhadap **UU Perlindungan Data Pribadi (UU PDP)**
* Validasi file upload (PDF only, size limit)
* Enkripsi data sensitif
* Logging aktivitas sistem
* Role-based access control (RBAC)

---

## 📱 Desain UI/UX

* Mobile-first (responsive design)
* Gaya formal & profesional (government style)
* Menggunakan identitas visual PUPR (biru & kuning)
* Navigasi sederhana & informatif

---

## 🔄 Workflow Rekrutmen

1. Admin membuat lowongan
2. Pelamar mendaftar & upload dokumen
3. Verifikasi berkas oleh admin
4. Pengumuman hasil

---

## 📊 Dokumentasi Tambahan

Tersedia pada folder `/docs`:

* ERD Database
* API Specification
* Flow Diagram Sistem

---

## 🧑‍💻 Kontribusi

1. Fork repository
2. Buat branch baru 
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

##
