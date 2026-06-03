export interface User {
  id: number;
  name: string;
  email: string;
  nik: string | null;
  phone: string | null;
  address: string | null;
  role: "admin" | "penyeleksi" | "user";
  email_verified_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  address: string;
  role: "admin" | "penyeleksi" | "user";
}

export interface SelectionStage {
  id: string;
  name: string;
  description: string;
  order: number;
  weight: number;
  start_date: string;
  end_date: string;
  test_link: string | null;
}

export interface Job {
  id: number;
  title: string;
  category: "tenaga_pendukung" | "konsultan_individu";
  description: string | null;
  qualification: string | null;
  requirements: string | null;
  duration: string | null;
  location: string | null;
  unit_kerja: string | null;
  recruiter_name: string | null;
  penyeleksi_ids: number[];
  penyeleksi_names: string[];
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
  description: string;
  qualification: string;
  requirements: string;
  duration: string;
  location: string;
  unit_kerja: string;
  recruiter_name: string;
  penyeleksi_ids: number[];
  start_date: string;
  end_date: string;
  form_fields: string[];
  selection_stages: SelectionStage[];
}

export interface StageScore {
  stage_name: string;
  score: number | null;
  max_score: number;
  weight: number;
  input_by: string | null;
  input_at: string | null;
}

export interface StageHistory {
  stage_name: string;
  status: "lulus" | "tidak_lulus";
  note: string | null;
  score: number | null;
  scored_by: string | null;
  updated_at: string;
}

export interface Application {
  id: number;
  user_id: number;
  job_id: number;
  user_name: string;
  user_email: string;
  user_nik: string | null;
  user_phone: string | null;
  job_title: string;
  status: "pending" | "seleksi" | "lulus" | "tidak_lulus" | "Lulus" | "Tidak Lulus";
  current_stage: string | null;
  current_stage_order: number;
  current_stage_result_id: number | null;
  last_stage: string | null;
  last_stage_status: string | null;
  stage_start_date: string | null;
  stage_end_date: string | null;
  stage_history: StageHistory[];
  stage_scores: StageScore[];
  document_link: string | null;
  applied_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateStageData {
  application_id: number;
  stage_result_id: number;
  stage_name: string;
  status: "lulus" | "tidak_lulus";
  note: string;
  score: number | null;
  scored_by: string;
}

export interface PendingGradingItem {
  application_id: number;
  user_name: string;
  job_title: string;
  job_id: number;
  stage_name: string;
  stage_start_date: string;
}

export interface DashboardStats {
  totalApplicants: number;
  totalJobs: number;
  totalAccepted: number;
  totalRejected: number;
  trendData: {
    date: string;
    applicants: number;
    accepted: number;
  }[];
  applicationsByCategory: { name: string; value: number }[];
}
