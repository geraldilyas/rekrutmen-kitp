// Admin

export interface User {
  id: number;
  name: string;
  email: string;
  nik: string | null;
  phone: string | null;
  address: string | null;
  role: "admin" | "user";
  email_verified_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  nik: string;
  phone: string;
  address: string;
  role: "admin" | "user";
}

// Lowongan

export interface DashboardStats {
  totalApplicants: number;
  totalJobs: number;
  totalAccepted: number;
  totalRejected: number;
  applicationsByMonth: {
    month: string;
    applicants: number;
    accepted: number;
  }[];
  applicationsByCategory: {
    name: string;
    value: number;
  }[];
}

export interface SelectionStage {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface Job {
  id: number;
  title: string;
  category: "tenaga_pendukung" | "konsultan_individu";
  type: string | null;
  description: string | null;
  qualification: string | null;
  requirements: string | null;
  duration: string | null;
  location: string | null;
  unit_kerja: string | null;
  recruiter_name: string | null;
  start_date: string | null;
  end_date: string | null;
  deadline: string | null;
  form_fields: string[] | null;
  selection_stages: SelectionStage[];
  status: "coming_soon" | "active" | "finished";
  totalPendaftar: number;
  created_at?: string;
  updated_at?: string;
}

export interface JobFormData {
  title: string;
  category: "tenaga_pendukung" | "konsultan_individu";
  type: string;
  description: string;
  qualification: string;
  requirements: string;
  duration: string;
  location: string;
  unit_kerja: string;
  recruiter_name: string;
  start_date: string;
  end_date: string;
  deadline: string;
  form_fields: string[];
  selection_stages: SelectionStage[];
}

// Pelamar

export interface Application {
  id: number;
  user_id: number;
  job_id: number;
  user_name: string;
  user_email: string;
  user_nik: string | null;
  user_phone: string | null;
  job_title: string;
  status: "pending" | "diterima" | "ditolak";
  current_stage: string | null;
  current_stage_order: number;
  stage_history: StageHistory[];
  document_link: string | null;
  applied_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface StageHistory {
  stage_name: string;
  status: "lulus" | "ditolak" | "diterima";
  note: string | null;
  updated_at: string;
}

export interface UpdateStageData {
  application_id: number;
  stage_name: string;
  status: "lulus" | "ditolak" | "diterima";
  note: string;
}
