import { useState, useMemo, useCallback } from "react";
import type {
  Job,
  JobFormData,
  User,
  UserFormData,
  Application,
  DashboardStats,
} from "../shared/types";

// ============================================================
// DASHBOARD STATS
// ============================================================
const dummyStats: DashboardStats = {
  totalApplicants: 1248,
  totalJobs: 12,
  totalAccepted: 186,
  totalRejected: 874,
  applicationsByMonth: [
    { month: "Jan", applicants: 120, accepted: 15 },
    { month: "Feb", applicants: 200, accepted: 28 },
    { month: "Mar", applicants: 150, accepted: 20 },
    { month: "Apr", applicants: 300, accepted: 45 },
    { month: "Mei", applicants: 250, accepted: 38 },
    { month: "Jun", applicants: 228, accepted: 40 },
  ],
  applicationsByCategory: [
    { name: "Tenaga Pendukung", value: 780 },
    { name: "Konsultan Individu", value: 468 },
  ],
};

export function useDashboardStats() {
  const [stats] = useState<DashboardStats>(dummyStats);
  const [loading] = useState(false);
  return { stats, loading };
}

// ============================================================
// JOBS MANAGEMENT
// ============================================================
const initialJobs: Job[] = [
  {
    id: 1,
    title: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
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
        description: "Verifikasi",
        order: 1,
        weight: 25,
        start_date: "2026-05-01",
        end_date: "2026-05-03",
        test_link: null,
      },
      {
        id: "s2",
        name: "Tes Kompetensi",
        description: "Ujian",
        order: 2,
        weight: 50,
        start_date: "2026-05-10",
        end_date: "2026-05-10",
        test_link: "https://exam.kitp.go.id/tpm",
      },
      {
        id: "s3",
        name: "Wawancara",
        description: "Wawancara",
        order: 3,
        weight: 25,
        start_date: "2026-05-20",
        end_date: "2026-05-22",
        test_link: "https://meet.google.com/tpm",
      },
    ],
    status: "active",
    totalPendaftar: 245,
  },
  {
    id: 2,
    title: "Software Engineer (Full-Stack)",
    category: "konsultan_individu",
    description: "Mengembangkan sistem informasi manajemen sumber daya air.",
    qualification: "S1 Informatika",
    requirements: "React, Laravel, PostgreSQL, pengalaman min 2 tahun.",
    duration: "12 Bulan",
    location: "Bandar Lampung",
    unit_kerja: "BBWS Mesuji Sekampung",
    recruiter_name: "Dr. Andi Wijaya, MT",
    penyeleksi_ids: [3],
    penyeleksi_names: ["Dr. Andi Wijaya"],
    start_date: "2026-06-01",
    end_date: "2027-05-31",
    form_fields: ["CV", "Portfolio"],
    selection_stages: [
      {
        id: "s1",
        name: "Seleksi Administrasi",
        description: "Verifikasi",
        order: 1,
        weight: 20,
        start_date: "2026-06-01",
        end_date: "2026-06-02",
        test_link: null,
      },
      {
        id: "s2",
        name: "Tes Teknis",
        description: "Live coding",
        order: 2,
        weight: 40,
        start_date: "2026-06-08",
        end_date: "2026-06-08",
        test_link: "https://code.kitp.go.id/se",
      },
      {
        id: "s3",
        name: "Wawancara Teknis",
        description: "Deep dive",
        order: 3,
        weight: 25,
        start_date: "2026-06-15",
        end_date: "2026-06-16",
        test_link: "https://meet.google.com/se-teknis",
      },
      {
        id: "s4",
        name: "Wawancara HR",
        description: "Cultural fit",
        order: 4,
        weight: 15,
        start_date: "2026-06-20",
        end_date: "2026-06-21",
        test_link: "https://meet.google.com/se-hr",
      },
    ],
    status: "active",
    totalPendaftar: 128,
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
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.unit_kerja?.toLowerCase().includes(q),
      );
    }
    if (filterStatus !== "all")
      result = result.filter((j) => j.status === filterStatus);
    return result;
  }, [jobs, search, filterStatus]);

  const addJob = useCallback((data: JobFormData, names: string[]) => {
    setJobs((prev) => [
      {
        id: Date.now(),
        ...data,
        penyeleksi_names: names,
        totalPendaftar: 0,
        status: determineStatus(data.start_date, data.end_date),
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);
  const editJob = useCallback(
    (id: number, data: JobFormData, names: string[]) => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id
            ? {
                ...j,
                ...data,
                penyeleksi_names: names,
                updated_at: new Date().toISOString(),
              }
            : j,
        ),
      );
    },
    [],
  );
  const deleteJob = useCallback((id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
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
  start: string,
  end: string,
): "coming_soon" | "active" | "finished" {
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);
  if (now < s) return "coming_soon";
  if (now > e) return "finished";
  return "active";
}

// ============================================================
// USERS MANAGEMENT
// ============================================================
const initialUsers: User[] = [
  {
    id: 1,
    name: "Admin KITP",
    email: "admin@kitp.go.id",
    nik: null,
    phone: "081234567890",
    address: "Bandar Lampung",
    role: "admin",
    email_verified_at: "2025-01-15T08:30:00Z",
    created_at: "2025-01-15T08:30:00Z",
  },
  {
    id: 2,
    name: "Rina Marlina",
    email: "rina@kitp.go.id",
    nik: null,
    phone: "081345678901",
    address: "Mesuji",
    role: "penyeleksi",
    email_verified_at: null,
    created_at: "2026-04-05T11:20:00Z",
  },
  {
    id: 3,
    name: "Dr. Andi Wijaya",
    email: "andi@kitp.go.id",
    nik: null,
    phone: "081456789012",
    address: "Bandar Lampung",
    role: "penyeleksi",
    email_verified_at: "2026-05-01T10:00:00Z",
    created_at: "2026-05-01T10:00:00Z",
  },
];

export function useUsersManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterVerification, setFilterVerification] = useState<string>("all");

  const filteredUsers = useMemo(() => {
    let result = users;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q),
      );
    }
    if (filterRole !== "all")
      result = result.filter((u) => u.role === filterRole);
    if (filterVerification === "verified")
      result = result.filter((u) => u.email_verified_at !== null);
    else if (filterVerification === "unverified")
      result = result.filter((u) => u.email_verified_at === null);
    return result;
  }, [users, search, filterRole, filterVerification]);

  const addUser = useCallback((data: UserFormData) => {
    setUsers((prev) => [
      {
        id: Date.now(),
        name: data.name,
        email: data.email,
        nik: null,
        phone: data.phone || null,
        address: data.address || null,
        role: data.role,
        email_verified_at: null,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);
  const editUser = useCallback((id: number, data: UserFormData) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              name: data.name,
              email: data.email,
              phone: data.phone || null,
              address: data.address || null,
              role: data.role,
              updated_at: new Date().toISOString(),
            }
          : u,
      ),
    );
  }, []);
  const deleteUser = useCallback((id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);
  const toggleVerification = useCallback((id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              email_verified_at: u.email_verified_at
                ? null
                : new Date().toISOString(),
            }
          : u,
      ),
    );
  }, []);

  return {
    users: filteredUsers,
    totalUsers: users.length,
    search,
    setSearch,
    filterRole,
    setFilterRole,
    filterVerification,
    setFilterVerification,
    addUser,
    editUser,
    deleteUser,
    toggleVerification,
  };
}

// ============================================================
// APPLICATIONS (ADMIN VIEW)
// ============================================================
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
        scored_by: "Dr. Andi",
        updated_at: "2026-05-01T14:00:00Z",
      },
    ],
    stage_scores: [
      {
        stage_name: "Seleksi Administrasi",
        score: 40,
        max_score: 25,
        weight: 25,
        input_by: "Dr. Andi",
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
        scored_by: "Rina",
        updated_at: "2026-05-02T10:00:00Z",
      },
      {
        stage_name: "Tes Kompetensi",
        status: "lulus",
        note: "Nilai 85",
        score: 85,
        scored_by: "Rina",
        updated_at: "2026-05-11T10:00:00Z",
      },
      {
        stage_name: "Wawancara",
        status: "lulus",
        note: "Hadir 1 Juni 2026.",
        score: 92,
        scored_by: "Rina",
        updated_at: "2026-05-21T10:00:00Z",
      },
    ],
    stage_scores: [
      {
        stage_name: "Seleksi Administrasi",
        score: 90,
        max_score: 25,
        weight: 25,
        input_by: "Rina",
        input_at: "2026-05-02T10:00:00Z",
      },
      {
        stage_name: "Tes Kompetensi",
        score: 85,
        max_score: 50,
        weight: 50,
        input_by: "Rina",
        input_at: "2026-05-11T10:00:00Z",
      },
      {
        stage_name: "Wawancara",
        score: 92,
        max_score: 25,
        weight: 25,
        input_by: "Rina",
        input_at: "2026-05-21T10:00:00Z",
      },
    ],
    document_link: "https://drive.google.com/jkl",
    applied_at: "2026-04-10T07:00:00Z",
  },
];

const adminJobs: Job[] = [
  {
    id: 1,
    title: "TPM - P3-TGAI",
    category: "tenaga_pendukung",
    description: "...",
    qualification: "S1/D3",
    requirements: "...",
    duration: "6 Bulan",
    location: "Mesuji",
    unit_kerja: "BBWS",
    recruiter_name: "Budi",
    penyeleksi_ids: [2, 3],
    penyeleksi_names: ["Rina", "Andi"],
    start_date: "2026-05-01",
    end_date: "2026-10-31",
    form_fields: ["CV"],
    selection_stages: [
      {
        id: "s1",
        name: "Seleksi Administrasi",
        description: "",
        order: 1,
        weight: 25,
        start_date: "2026-05-01",
        end_date: "2026-05-03",
        test_link: null,
      },
      {
        id: "s2",
        name: "Tes Kompetensi",
        description: "",
        order: 2,
        weight: 50,
        start_date: "2026-05-10",
        end_date: "2026-05-10",
        test_link: "https://exam.kitp.go.id/tpm",
      },
      {
        id: "s3",
        name: "Wawancara",
        description: "",
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
];

export function useApplications() {
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");

  const jobsWithApplicants = useMemo(
    () =>
      adminJobs.filter((j) => dummyApplications.some((a) => a.job_id === j.id)),
    [],
  );

  const getApplicationsByJobId = useCallback(
    (jobId: number) => {
      let result = dummyApplications.filter((a) => a.job_id === jobId);
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
    [search, filterStage],
  );

  return {
    jobsWithApplicants,
    getApplicationsByJobId,
    search,
    setSearch,
    filterStage,
    setFilterStage,
  };
}
