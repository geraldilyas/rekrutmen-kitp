import { useState, useMemo, useCallback } from "react";
import type { Job, Application, UpdateStageData } from "../shared/types";

const CURRENT_PENYELEKSI_ID = 2;
const CURRENT_PENYELEKSI_NAME = "Rina Marlina";

const allJobs: Job[] = [
  {
    id: 1,
    title: "Tenaga Pendamping Masyarakat (TPM)",
    category: "tenaga_pendukung",
    description:
      "Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis.",
    qualification: "S1/D3 Teknik Sipil",
    requirements: "Pengalaman 1 tahun di bidang irigasi.",
    duration: "6 Bulan",
    location: "Kabupaten Mesuji",
    unit_kerja: "BBWS Mesuji Sekampung",
    recruiter_name: "Budi Santoso, ST",
    penyeleksi_ids: [2, 3],
    penyeleksi_names: ["Rina Marlina", "Dr. Andi Wijaya"],
    start_date: "2026-05-01",
    end_date: "2026-10-31",
    form_fields: ["CV", "Ijazah"],
    selection_stages: [
      {
        id: "s1",
        name: "Seleksi Administrasi",
        description: "Verifikasi dokumen",
        order: 1,
        weight: 25,
        start_date: "2026-05-01",
        end_date: "2026-05-03",
        test_link: null,
      },
      {
        id: "s2",
        name: "Tes Kompetensi",
        description: "Ujian tertulis",
        order: 2,
        weight: 50,
        start_date: "2026-05-10",
        end_date: "2026-05-10",
        test_link: "https://exam.kitp.go.id/tpm",
      },
      {
        id: "s3",
        name: "Wawancara",
        description: "Wawancara teknis",
        order: 3,
        weight: 25,
        start_date: "2026-05-20",
        end_date: "2026-05-22",
        test_link: "https://meet.google.com/tpm",
      },
    ],
    status: "active",
    totalPendaftar: 5,
  },
  {
    id: 3,
    title: "Petugas Administrasi Satker",
    category: "tenaga_pendukung",
    description:
      "Mendukung pengelolaan administrasi perkantoran dan kearsipan.",
    qualification: "S1/D3 Administrasi",
    requirements: "Mahir Microsoft Office, teliti.",
    duration: "12 Bulan",
    location: "Kantor Pusat",
    unit_kerja: "Satker Balai Besar",
    recruiter_name: "Rina Marlina, SE",
    penyeleksi_ids: [2],
    penyeleksi_names: ["Rina Marlina"],
    start_date: "2026-04-15",
    end_date: "2027-04-14",
    form_fields: ["CV", "Ijazah", "SKCK"],
    selection_stages: [
      {
        id: "s1",
        name: "Seleksi Berkas",
        description: "Pemeriksaan kelengkapan",
        order: 1,
        weight: 40,
        start_date: "2026-04-15",
        end_date: "2026-04-19",
        test_link: null,
      },
      {
        id: "s2",
        name: "Tes Komputer",
        description: "Praktik Microsoft Office",
        order: 2,
        weight: 60,
        start_date: "2026-04-22",
        end_date: "2026-04-22",
        test_link: "https://lab.kitp.go.id/komputer",
      },
    ],
    status: "finished",
    totalPendaftar: 412,
  },
];

const stageNames = ["Seleksi Administrasi", "Tes Kompetensi", "Wawancara"];

const dummyApplications: Application[] = [
  {
    id: 101,
    user_id: 10,
    job_id: 1,
    user_name: "Ahmad Faisal",
    user_email: "ahmad.f@email.com",
    user_nik: "1871020101010001",
    user_phone: "081234567890",
    job_title: "TPM",
    status: "pending",
    current_stage: "Seleksi Administrasi",
    current_stage_order: 1,
    stage_history: [],
    stage_scores: [],
    document_link: "https://drive.google.com/abc",
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
    job_title: "TPM",
    status: "pending",
    current_stage: "Tes Kompetensi",
    current_stage_order: 2,
    stage_history: [
      {
        stage_name: "Seleksi Administrasi",
        status: "lulus",
        note: "Dokumen lengkap",
        score: 85,
        scored_by: "Rina Marlina",
        updated_at: "2026-05-02T10:00:00Z",
      },
    ],
    stage_scores: [
      {
        stage_name: "Seleksi Administrasi",
        score: 85,
        max_score: 25,
        weight: 25,
        input_by: "Rina Marlina",
        input_at: "2026-05-02T10:00:00Z",
      },
    ],
    document_link: "https://drive.google.com/def",
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
    job_title: "TPM",
    status: "tidak_lulus",
    current_stage: "Seleksi Administrasi",
    current_stage_order: 1,
    stage_history: [
      {
        stage_name: "Seleksi Administrasi",
        status: "tidak_lulus",
        note: "Ijazah belum legalisir",
        score: 40,
        scored_by: "Rina Marlina",
        updated_at: "2026-05-01T14:00:00Z",
      },
    ],
    stage_scores: [
      {
        stage_name: "Seleksi Administrasi",
        score: 40,
        max_score: 25,
        weight: 25,
        input_by: "Rina Marlina",
        input_at: "2026-05-01T14:00:00Z",
      },
    ],
    document_link: "https://drive.google.com/ghi",
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
    job_title: "TPM",
    status: "pending",
    current_stage: "Seleksi Administrasi",
    current_stage_order: 1,
    stage_history: [],
    stage_scores: [],
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
    job_title: "TPM",
    status: "lulus",
    current_stage: "Wawancara",
    current_stage_order: 3,
    stage_history: [
      {
        stage_name: "Seleksi Administrasi",
        status: "lulus",
        note: "Berkas lengkap",
        score: 90,
        scored_by: "Rina Marlina",
        updated_at: "2026-05-02T10:00:00Z",
      },
      {
        stage_name: "Tes Kompetensi",
        status: "lulus",
        note: "Nilai 85",
        score: 85,
        scored_by: "Rina Marlina",
        updated_at: "2026-05-11T10:00:00Z",
      },
      {
        stage_name: "Wawancara",
        status: "lulus",
        note: "Hadir 1 Juni 2026 pukul 08.00 WIB.",
        score: 92,
        scored_by: "Rina Marlina",
        updated_at: "2026-05-21T10:00:00Z",
      },
    ],
    stage_scores: [
      {
        stage_name: "Seleksi Administrasi",
        score: 90,
        max_score: 25,
        weight: 25,
        input_by: "Rina Marlina",
        input_at: "2026-05-02T10:00:00Z",
      },
      {
        stage_name: "Tes Kompetensi",
        score: 85,
        max_score: 50,
        weight: 50,
        input_by: "Rina Marlina",
        input_at: "2026-05-11T10:00:00Z",
      },
      {
        stage_name: "Wawancara",
        score: 92,
        max_score: 25,
        weight: 25,
        input_by: "Rina Marlina",
        input_at: "2026-05-21T10:00:00Z",
      },
    ],
    document_link: "https://drive.google.com/jkl",
    applied_at: "2026-04-10T07:00:00Z",
  },
];

export function useAssignedJobs() {
  const [search, setSearch] = useState("");
  const assignedJobs = useMemo(
    () =>
      allJobs.filter((j) => j.penyeleksi_ids.includes(CURRENT_PENYELEKSI_ID)),
    [],
  );
  const filteredJobs = useMemo(() => {
    if (!search) return assignedJobs;
    const q = search.toLowerCase();
    return assignedJobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q),
    );
  }, [assignedJobs, search]);
  const getJobById = (id: number) =>
    assignedJobs.find((j) => j.id === id) || null;
  return {
    jobs: filteredJobs,
    totalJobs: assignedJobs.length,
    search,
    setSearch,
    getJobById,
    currentPenyeleksi: CURRENT_PENYELEKSI_NAME,
  };
}

export function usePenyeleksiApplications() {
  const [applications, setApplications] =
    useState<Application[]>(dummyApplications);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");

  const getApplicationsByJobId = useCallback(
    (jobId: number) => {
      let result = applications.filter((a) => a.job_id === jobId);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          (a) =>
            a.user_name.toLowerCase().includes(q) ||
            a.user_email.toLowerCase().includes(q) ||
            a.user_nik?.toLowerCase().includes(q),
        );
      }
      if (filterStage !== "all")
        result = result.filter((a) => a.status === filterStage);
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
            score: data.score,
            scored_by: data.scored_by,
            updated_at: new Date().toISOString(),
          },
        ];
        const newScores = [
          ...app.stage_scores,
          {
            stage_name: data.stage_name,
            score: data.score,
            max_score: 0,
            weight: 0,
            input_by: data.scored_by,
            input_at: new Date().toISOString(),
          },
        ];
        let newStatus: Application["status"] = app.status;
        let newStage = app.current_stage;
        let newOrder = app.current_stage_order;
        if (data.status === "tidak_lulus") {
          newStatus = "tidak_lulus";
        } else if (data.status === "lulus") {
          if (app.current_stage_order < stageNames.length) {
            newOrder = app.current_stage_order + 1;
            newStage = stageNames[newOrder - 1];
          } else {
            newStatus = "lulus";
          }
        }
        return {
          ...app,
          status: newStatus,
          current_stage: newStage,
          current_stage_order: newOrder,
          stage_history: newHistory,
          stage_scores: newScores,
        };
      }),
    );
  }, []);

  return {
    getApplicationsByJobId,
    updateApplicationStage,
    search,
    setSearch,
    filterStage,
    setFilterStage,
    currentPenyeleksi: CURRENT_PENYELEKSI_NAME,
  };
}
