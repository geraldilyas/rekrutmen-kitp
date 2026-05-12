import { useState, useMemo, useCallback } from "react";
import type { Job, JobFormData } from "../../types";

const initialJobs: Job[] = [
  {
    id: 1,
    title: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    category: "tenaga_pendukung",
    type: "Kontrak",
    description:
      "Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis, administratif, dan sosial pada kegiatan Percepatan Peningkatan Tata Guna Air Irigasi.",
    qualification: "S1/D3 Teknik Sipil atau jurusan terkait",
    requirements:
      "Pengalaman minimal 1 tahun di bidang irigasi, mampu bekerja dalam tim, bersedia ditempatkan di seluruh wilayah kerja",
    duration: "6 Bulan",
    location: "Kabupaten Mesuji",
    unit_kerja: "Balai Besar Wilayah Sungai Mesuji Sekampung",
    recruiter_name: "Budi Santoso, ST",
    start_date: "2026-05-01",
    end_date: "2026-10-31",
    deadline: "2026-04-20",
    form_fields: ["CV", "Ijazah", "Sertifikat Pendukung"],
    selection_stages: [
      {
        id: "stage-1",
        name: "Seleksi Administrasi",
        description: "Verifikasi dokumen dan persyaratan",
        order: 1,
      },
      {
        id: "stage-2",
        name: "Tes Kompetensi",
        description: "Ujian tertulis dan praktik sesuai bidang",
        order: 2,
      },
      {
        id: "stage-3",
        name: "Wawancara",
        description: "Wawancara teknis dan non-teknis",
        order: 3,
      },
    ],
    status: "active",
    totalPendaftar: 245,
  },
  {
    id: 2,
    title: "Software Engineer (Full-Stack)",
    category: "konsultan_individu",
    type: "Proyek",
    description:
      "Mengembangkan dan memelihara sistem informasi manajemen sumber daya air berbasis web dan mobile yang terintegrasi.",
    qualification: "S1 Teknik Informatika/Ilmu Komputer",
    requirements:
      "Menguasai React, Laravel, PostgreSQL, pengalaman min 2 tahun",
    duration: "12 Bulan",
    location: "Bandar Lampung",
    unit_kerja: "Balai Besar Wilayah Sungai Mesuji Sekampung",
    recruiter_name: "Dr. Andi Wijaya, MT",
    start_date: "2026-06-01",
    end_date: "2027-05-31",
    deadline: "2026-05-15",
    form_fields: ["CV", "Portfolio", "Ijazah"],
    selection_stages: [
      {
        id: "stage-1",
        name: "Seleksi Administrasi",
        description: "Verifikasi dokumen dan persyaratan",
        order: 1,
      },
      {
        id: "stage-2",
        name: "Tes Teknis",
        description: "Live coding dan studi kasus",
        order: 2,
      },
      {
        id: "stage-3",
        name: "Wawancara Teknis",
        description: "Deep dive technical interview",
        order: 3,
      },
      {
        id: "stage-4",
        name: "Wawancara HR",
        description: "Cultural fit dan negosiasi",
        order: 4,
      },
    ],
    status: "active",
    totalPendaftar: 128,
  },
  {
    id: 3,
    title: "Petugas Administrasi Satker",
    category: "tenaga_pendukung",
    type: "Kontrak",
    description:
      "Mendukung pengelolaan administrasi perkantoran, kearsipan, dan penyusunan laporan rutin pada satuan kerja Balai.",
    qualification: "S1/D3 Administrasi, Manajemen, atau sederajat",
    requirements:
      "Mahir Microsoft Office, teliti, pengalaman admin minimal 1 tahun",
    duration: "12 Bulan",
    location: "Kantor Pusat",
    unit_kerja: "Satker Balai Besar",
    recruiter_name: "Rina Marlina, SE",
    start_date: "2026-04-15",
    end_date: "2027-04-14",
    deadline: "2026-04-10",
    form_fields: ["CV", "Ijazah", "SKCK"],
    selection_stages: [
      {
        id: "stage-1",
        name: "Seleksi Berkas",
        description: "Pemeriksaan kelengkapan administrasi",
        order: 1,
      },
      {
        id: "stage-2",
        name: "Tes Komputer",
        description: "Praktik Microsoft Office",
        order: 2,
      },
    ],
    status: "finished",
    totalPendaftar: 412,
  },
  {
    id: 4,
    title: "Ahli Lingkungan Hidup",
    category: "konsultan_individu",
    type: "Proyek",
    description:
      "Menyusun kajian AMDAL dan memastikan proyek infrastruktur mematuhi standar lingkungan hidup.",
    qualification: "S1/S2 Teknik Lingkungan",
    requirements:
      "Sertifikasi AMDAL, pengalaman 3 tahun di proyek infrastruktur",
    duration: "8 Bulan",
    location: "Lampung",
    unit_kerja: "Balai Besar Wilayah Sungai Mesuji Sekampung",
    recruiter_name: "Prof. Dr. Ir. Haryono, M.Sc",
    start_date: "2026-08-01",
    end_date: "2027-03-31",
    deadline: "2026-07-15",
    form_fields: ["CV", "Sertifikasi AMDAL"],
    selection_stages: [
      {
        id: "stage-1",
        name: "Seleksi Administrasi",
        description: "Verifikasi dokumen",
        order: 1,
      },
      {
        id: "stage-2",
        name: "Presentasi Makalah",
        description: "Presentasi studi kasus lingkungan",
        order: 2,
      },
      {
        id: "stage-3",
        name: "Wawancara Panel",
        description: "Wawancara dengan dewan ahli",
        order: 3,
      },
    ],
    status: "coming_soon",
    totalPendaftar: 0,
  },
];

export function useJobsManagement() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredJobs = useMemo(() => {
    let result = jobs;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q) ||
          job.unit_kerja?.toLowerCase().includes(q) ||
          job.recruiter_name?.toLowerCase().includes(q),
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((job) => job.status === filterStatus);
    }

    return result;
  }, [jobs, search, filterStatus]);

  const addJob = useCallback((data: JobFormData) => {
    const newJob: Job = {
      id: Date.now(),
      ...data,
      totalPendaftar: 0,
      status: determineStatus(data.start_date, data.end_date),
      created_at: new Date().toISOString(),
    };
    setJobs((prev) => [newJob, ...prev]);
  }, []);

  const editJob = useCallback((id: number, data: JobFormData) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? {
              ...job,
              ...data,
              totalPendaftar: job.totalPendaftar,
              status: determineStatus(data.start_date, data.end_date),
              updated_at: new Date().toISOString(),
            }
          : job,
      ),
    );
  }, []);

  const deleteJob = useCallback((id: number) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }, []);

  return {
    jobs: filteredJobs,
    totalJobs: jobs.length,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    addJob,
    editJob,
    deleteJob,
  };
}

function determineStatus(
  startDate: string,
  endDate: string,
): "coming_soon" | "active" | "finished" {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "coming_soon";
  if (now > end) return "finished";
  return "active";
}
