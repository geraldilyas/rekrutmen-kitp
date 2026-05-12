import { useState, useMemo, useCallback } from "react";
import type { Application, UpdateStageData } from "../../types";
import type { Job } from "../../types";

const dummyJobs: Job[] = [
  {
    id: 1,
    title: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    category: "tenaga_pendukung",
    type: "Kontrak",
    description: "Melaksanakan pendampingan...",
    qualification: "S1/D3 Teknik Sipil",
    requirements: "Pengalaman 1 tahun...",
    duration: "6 Bulan",
    location: "Kabupaten Mesuji",
    unit_kerja: "Balai Besar Wilayah Sungai Mesuji Sekampung",
    recruiter_name: "Budi Santoso, ST",
    start_date: "2026-05-01",
    end_date: "2026-10-31",
    deadline: "2026-04-20",
    form_fields: ["CV", "Ijazah"],
    selection_stages: [
      {
        id: "s1",
        name: "Seleksi Administrasi",
        description: "Verifikasi dokumen",
        order: 1,
      },
      {
        id: "s2",
        name: "Tes Kompetensi",
        description: "Ujian tertulis",
        order: 2,
      },
      {
        id: "s3",
        name: "Wawancara",
        description: "Wawancara teknis",
        order: 3,
      },
    ],
    status: "active",
    totalPendaftar: 5,
  },
  {
    id: 2,
    title: "Software Engineer (Full-Stack)",
    category: "konsultan_individu",
    type: "Proyek",
    description: "Mengembangkan sistem informasi...",
    qualification: "S1 Informatika",
    requirements: "React, Laravel...",
    duration: "12 Bulan",
    location: "Bandar Lampung",
    unit_kerja: "BBWS Mesuji Sekampung",
    recruiter_name: "Dr. Andi Wijaya, MT",
    start_date: "2026-06-01",
    end_date: "2027-05-31",
    deadline: "2026-05-15",
    form_fields: ["CV", "Portfolio"],
    selection_stages: [
      {
        id: "s1",
        name: "Seleksi Administrasi",
        description: "Verifikasi",
        order: 1,
      },
      { id: "s2", name: "Tes Teknis", description: "Live coding", order: 2 },
      {
        id: "s3",
        name: "Wawancara Teknis",
        description: "Deep dive",
        order: 3,
      },
      { id: "s4", name: "Wawancara HR", description: "Cultural fit", order: 4 },
    ],
    status: "active",
    totalPendaftar: 3,
  },
];

const dummyApplications: Application[] = [
  {
    id: 101,
    user_id: 10,
    job_id: 1,
    user_name: "Ahmad Faisal",
    user_email: "ahmad.f@email.com",
    user_nik: "1871020101010001",
    user_phone: "081234567890",
    job_title: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    status: "pending",
    current_stage: "Seleksi Administrasi",
    current_stage_order: 1,
    stage_history: [],
    document_link: "https://drive.google.com/drive/folders/abc123",
    applied_at: "2026-04-15T09:30:00Z",
  },
  {
    id: 102,
    user_id: 11,
    job_id: 1,
    user_name: "Budi Hartono",
    user_email: "budi.h@email.com",
    user_nik: "1871020202020002",
    user_phone: "081345678901",
    job_title: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    status: "pending",
    current_stage: "Tes Kompetensi",
    current_stage_order: 2,
    stage_history: [
      {
        stage_name: "Seleksi Administrasi",
        status: "lulus",
        note: "Dokumen lengkap dan valid",
        updated_at: "2026-04-18T10:00:00Z",
      },
    ],
    document_link: "https://drive.google.com/drive/folders/def456",
    applied_at: "2026-04-16T11:00:00Z",
  },
  {
    id: 103,
    user_id: 12,
    job_id: 1,
    user_name: "Citra Dewi",
    user_email: "citra.d@email.com",
    user_nik: "1871020303030003",
    user_phone: "081456789012",
    job_title: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    status: "ditolak",
    current_stage: "Seleksi Administrasi",
    current_stage_order: 1,
    stage_history: [
      {
        stage_name: "Seleksi Administrasi",
        status: "ditolak",
        note: "Dokumen tidak lengkap. Ijazah belum dilegalisir.",
        updated_at: "2026-04-17T14:00:00Z",
      },
    ],
    document_link: "https://drive.google.com/drive/folders/ghi789",
    applied_at: "2026-04-14T08:00:00Z",
  },
  {
    id: 104,
    user_id: 13,
    job_id: 1,
    user_name: "Dian Permata",
    user_email: "dian.p@email.com",
    user_nik: null,
    user_phone: "081567890123",
    job_title: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    status: "pending",
    current_stage: "Seleksi Administrasi",
    current_stage_order: 1,
    stage_history: [],
    document_link: null,
    applied_at: "2026-04-17T15:30:00Z",
  },
  {
    id: 105,
    user_id: 14,
    job_id: 1,
    user_name: "Eko Prasetyo",
    user_email: "eko.p@email.com",
    user_nik: "1871020505050005",
    user_phone: null,
    job_title: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    status: "diterima",
    current_stage: "Wawancara",
    current_stage_order: 3,
    stage_history: [
      {
        stage_name: "Seleksi Administrasi",
        status: "lulus",
        note: "Berkas lengkap",
        updated_at: "2026-04-18T10:00:00Z",
      },
      {
        stage_name: "Tes Kompetensi",
        status: "lulus",
        note: "Nilai 85",
        updated_at: "2026-04-22T10:00:00Z",
      },
      {
        stage_name: "Wawancara",
        status: "diterima",
        note: "Selamat! Silakan melanjutkan ke proses orientasi. Hadir di kantor pusat pada 1 Mei 2026 pukul 08.00 WIB.",
        updated_at: "2026-04-25T10:00:00Z",
      },
    ],
    document_link: "https://drive.google.com/drive/folders/jkl012",
    applied_at: "2026-04-10T07:00:00Z",
  },
];

export function useApplications() {
  const [applications, setApplications] =
    useState<Application[]>(dummyApplications);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");

  const jobsWithApplicants = useMemo(() => {
    return dummyJobs.filter((job) =>
      applications.some((app) => app.job_id === job.id),
    );
  }, []);

  const getApplicationsByJobId = useCallback(
    (jobId: number) => {
      let result = applications.filter((app) => app.job_id === jobId);

      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          (app) =>
            app.user_name.toLowerCase().includes(q) ||
            app.user_email.toLowerCase().includes(q) ||
            app.user_nik?.toLowerCase().includes(q),
        );
      }

      if (filterStage !== "all") {
        if (filterStage === "pending") {
          result = result.filter((app) => app.status === "pending");
        } else if (filterStage === "diterima") {
          result = result.filter((app) => app.status === "diterima");
        } else if (filterStage === "ditolak") {
          result = result.filter((app) => app.status === "ditolak");
        }
      }

      return result;
    },
    [applications, search, filterStage],
  );

  const updateApplicationStage = useCallback((data: UpdateStageData) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== data.application_id) return app;

        const newHistory = [
          ...app.stage_history,
          {
            stage_name: data.stage_name,
            status: data.status,
            note: data.note || null,
            updated_at: new Date().toISOString(),
          },
        ];

        let newStatus: "pending" | "diterima" | "ditolak" = app.status;
        let newCurrentStage = app.current_stage;
        let newStageOrder = app.current_stage_order;

        if (data.status === "ditolak") {
          newStatus = "ditolak";
        } else if (data.status === "diterima") {
          newStatus = "diterima";
        } else if (data.status === "lulus") {
          // Cari stage berikutnya
          const job = dummyJobs.find((j) => j.id === app.job_id);
          if (job) {
            const stages = job.selection_stages.sort(
              (a, b) => a.order - b.order,
            );
            const nextStage = stages.find(
              (s) => s.order === app.current_stage_order + 1,
            );
            if (nextStage) {
              newCurrentStage = nextStage.name;
              newStageOrder = nextStage.order;
            } else {
              // Tidak ada stage berikutnya, otomatis diterima
              newStatus = "diterima";
            }
          }
        }

        return {
          ...app,
          status: newStatus,
          current_stage: newCurrentStage,
          current_stage_order: newStageOrder,
          stage_history: newHistory,
        };
      }),
    );
  }, []);

  return {
    jobsWithApplicants,
    applications,
    getApplicationsByJobId,
    updateApplicationStage,
    search,
    setSearch,
    filterStage,
    setFilterStage,
  };
}
