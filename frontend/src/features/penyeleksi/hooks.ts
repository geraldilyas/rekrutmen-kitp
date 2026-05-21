import { useState, useMemo, useCallback, useEffect } from "react";
import type { Job, Application, UpdateStageData } from "../shared/types";
import { api } from "../../services/api";

function determineStatus(start: string, end: string): "coming_soon" | "active" | "finished" {
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);
  if (now < s) return "coming_soon";
  if (now > e) return "finished";
  return "active";
}

function mapJob(j: any): Job {
  return {
    ...j,
    status: determineStatus(j.start_date, j.deadline || j.end_date),
    totalPendaftar: j.applications_count || 0,
    penyeleksi_ids: j.penyeleksi_ids || [],
    penyeleksi_names: j.penyeleksi_names || [],
    selection_stages: (j.stages || []).map((s: any) => ({
      id: String(s.id),
      name: s.name,
      order: s.stage_order,
      weight: s.weight,
      start_date: s.start_date ?? null,
      end_date: s.end_date ?? null,
      test_link: s.test_link ?? null,
    })),
  };
}

function mapApplication(app: any): Application {
  const results: any[] = app.stage_results || [];
  const sorted = [...results].sort(
    (a, b) => (a.stage?.stage_order || 0) - (b.stage?.stage_order || 0)
  );
  const pendingResult = sorted.find((sr) => sr.status === "pending");
  const completedResults = sorted.filter((sr) => sr.status !== "pending");

  return {
    id: app.id,
    user_id: app.user_id,
    job_id: app.job_id,
    user_name: app.user?.name || "",
    user_email: app.user?.email || "",
    user_nik: app.user?.nik ?? null,
    user_phone: app.user?.phone ?? null,
    job_title: app.job?.title || "",
    status: app.status,
    current_stage: pendingResult?.stage?.name ?? null,
    current_stage_order: pendingResult?.stage?.stage_order ?? null,
    current_stage_result_id: pendingResult?.id ?? null,
    stage_history: completedResults.map((sr: any) => ({
      stage_name: sr.stage?.name,
      status: sr.status,
      note: sr.notes,
      score: sr.score,
      scored_by: sr.reviewer?.name ?? null,
      updated_at: sr.reviewed_at,
    })),
    stage_scores: completedResults.map((sr: any) => ({
      stage_name: sr.stage?.name,
      score: sr.score,
      max_score: 100,
      weight: sr.stage?.weight,
      input_by: sr.reviewer?.name ?? null,
      input_at: sr.reviewed_at,
    })),
    document_link: null,
    applied_at: app.applied_at,
  };
}

export function useAssignedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get("/jobs");
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setJobs(data.map(mapJob));
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!search) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q)
    );
  }, [jobs, search]);

  const getJobById = useCallback(
    (id: number) => jobs.find((j) => j.id === id) ?? null,
    [jobs]
  );

  const currentPenyeleksi = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}").name || "";
    } catch {
      return "";
    }
  })();

  return {
    jobs: filteredJobs,
    totalJobs: jobs.length,
    loading,
    search,
    setSearch,
    getJobById,
    currentPenyeleksi,
  };
}

export function usePenyeleksiApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/applications");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setApplications(data.map(mapApplication));
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getApplicationsByJobId = useCallback(
    (jobId: number) => {
      let result = applications.filter((a) => a.job_id === jobId);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          (a) =>
            a.user_name?.toLowerCase().includes(q) ||
            a.user_email?.toLowerCase().includes(q) ||
            a.user_nik?.toLowerCase().includes(q)
        );
      }
      if (filterStage !== "all")
        result = result.filter((a) => a.status === filterStage);
      return result;
    },
    [applications, search, filterStage]
  );

  const updateApplicationStage = useCallback(
    async (data: UpdateStageData) => {
      await api.put(`/admin/applications/stages/${data.stage_result_id}`, {
        status: data.status,
        score: data.score,
        notes: data.note,
      });
      await fetchApplications();
    },
    [fetchApplications]
  );

  const currentPenyeleksi = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}").name || "";
    } catch {
      return "";
    }
  })();

  return {
    loading,
    getApplicationsByJobId,
    updateApplicationStage,
    search,
    setSearch,
    filterStage,
    setFilterStage,
    currentPenyeleksi,
  };
}
