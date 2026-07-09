import { useState, useMemo, useCallback, useEffect } from "react";
import type {
  Job,
  User,
  UserFormData,
  Application,
  DashboardStats,
  UpdateStageData,
  PendingGradingItem,
} from "../shared/types";
import { api } from "../../services/api";

// ============================================================
// DASHBOARD STATS
// ============================================================
export function useDashboardStats(period: 'daily' | 'monthly' = 'daily') {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/statistics/dashboard?period=${period}`);
      const data = res.data;
      
      const accepted = data.applications_by_status?.find((s: any) => s.status === 'Lulus')?.total || 0;
      const rejected = data.applications_by_status?.find((s: any) => s.status === 'Tidak Lulus')?.total || 0;

      setStats({
        totalApplicants: data.total_applicants || 0,
        totalJobs: data.total_jobs || 0,
        totalAccepted: accepted,
        totalRejected: rejected,
        trendData: data.trend_stats?.map((m: any) => ({
            date: m.date,
            applicants: parseInt(m.applicants),
            accepted: parseInt(m.accepted)
        })) || [], 
        applicationsByCategory: data.applications_by_category?.map((c: any) => ({
            name: c.category === 'tenaga_pendukung' ? 'Tenaga Pendukung' : 'Konsultan Individu',
            value: c.total
        })) || []
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading };
}

// ============================================================
// PENDING GRADING NOTIFICATION
// ============================================================
export function usePendingGrading() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<PendingGradingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/statistics/pending-grading");
        setCount(res.data.count || 0);
        setItems(res.data.items || []);
      } catch {
        setCount(0);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { count, items, loading };
}

// ============================================================
// JOBS MANAGEMENT
// ============================================================
export function useJobsManagement() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs"); 
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      const mappedJobs = data.map((j: any) => ({
        ...j,
        status: determineStatus(j.start_date, j.deadline),
        totalPendaftar: j.applications_count || 0,
        penyeleksi_names: j.selection_stages?.map((s: any) => s.reviewer_name).filter(Boolean) || [],
        selection_stages: j.selection_stages?.map((s: any) => ({
          id: String(s.id),
          name: s.name,
          order: s.stage_order,
          weight: s.weight,
          start_date: s.start_date,
          end_date: s.end_date,
          grading_end_date: s.grading_end_date,
          info: s.info,
          documents: (s.documents || []).map((d: any) => ({
            form_field_id: d.id,
            label: d.label,
            weight: d.pivot?.weight ?? 0,
          })),
        })) || []
      }));
      setJobs(mappedJobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
    let result = jobs;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.unit_kerja?.toLowerCase().includes(q),
      );
    }
    if (filterStatus !== "all")
      result = result.filter((j) => j.status === filterStatus);
    return result;
  }, [jobs, search, filterStatus]);

  const buildJobPayload = (data: any) => ({
    title: data.title,
    category: data.category,
    description: data.description,
    qualification: data.qualification || null,
    location: data.location || null,
    unit_kerja: data.unit_kerja || null,
    duration: data.duration || null,
    recruiter_name: data.recruiter_name || null,
    requirements: data.requirements || null,
    start_date: data.start_date,
    end_date: data.end_date,
    deadline: data.end_date,
    kuota: data.kuota !== undefined && data.kuota !== "" ? data.kuota : null, 
    penyeleksi_ids: data.penyeleksi_ids || [],
    stages: (data.selection_stages || []).map((s: any) => ({
      ...(s.id && /^\d+$/.test(String(s.id)) ? { id: Number(s.id) } : {}),
      name: s.name,
      stage_order: s.order,
      weight: s.weight,
      start_date: s.start_date || null,
      end_date: s.end_date || null,
      grading_end_date: s.grading_end_date || null,
      info: s.info || null,
      documents: (s.documents || []).map((d: any) => ({
        form_field_id: d.form_field_id,
        weight: d.weight || 0,
      })),
    })),
  });

  const addJob = useCallback(async (data: any) => {
    try {
        await api.post("/admin/jobs", buildJobPayload(data));
        fetchJobs();
    } catch (err) {
        console.error("Error adding job:", err);
        throw err;
    }
  }, []);

  const editJob = useCallback(async (id: number, data: any) => {
    try {
        // 🚀 FIX: stages tidak lagi dibuang dari payload — tahapan seleksi
        // sekarang ikut ter-update ketika lowongan diedit.
        await api.put(`/admin/jobs/${id}`, buildJobPayload(data));
        fetchJobs();
    } catch (err) {
        console.error("Error editing job:", err);
        throw err;
    }
  }, []);

  const deleteJob = useCallback(async (id: number) => {
    try {
        await api.delete(`/admin/jobs/${id}`);
        fetchJobs();
    } catch (err) {
        console.error("Error deleting job:", err);
        throw err;
    }
  }, []);

  return {
    jobs: filteredJobs,
    totalJobs: jobs?.length || 0,
    loading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    addJob,
    editJob,
    deleteJob,
    refresh: fetchJobs
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
export function useUsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterVerification, setFilterVerification] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset page on search change
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole, filterVerification]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users", {
        params: {
          page: currentPage,
          search: debouncedSearch || undefined,
          role: filterRole !== "all" ? filterRole : undefined,
          verification: filterVerification !== "all" ? filterVerification : undefined,
        }
      });
      
      const responseData = res.data;
      if (responseData && responseData.data) {
        setUsers(responseData.data);
        setLastPage(responseData.last_page);
        setTotalUsers(responseData.total);
        // Note: We don't sync currentPage back to responseData.current_page here
        // to avoid potential loops, but we trust the requested currentPage state.
      } else {
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filterRole, filterVerification, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const editUser = useCallback(async (id: number, data: any, role?: string) => {
    try {
      if (role === "admin" || role === "penyeleksi") {
        await api.put(`/admin/users/${id}`, data);
      } else {
        await api.put(`/admin/users/registered/${id}`, data);
      }
      fetchUsers();
    } catch (err) {
      console.error("Error editing user:", err);
      throw err;
    }
  }, [fetchUsers]);

  const toggleVerification = useCallback(async (id: number) => {
    try {
      await api.post(`/admin/users/registered/${id}/toggle-verification`);
      fetchUsers();
    } catch (err) {
      console.error("Error toggling verification:", err);
    }
  }, [fetchUsers]);

  const addUser = useCallback(async (data: UserFormData) => {
    try {
        await api.post("/admin/users", data);
        setCurrentPage(1);
        fetchUsers();
    } catch (err) {
        console.error("Error adding user:", err);
        throw err;
    }
  }, [fetchUsers]);

  const blacklistUser = useCallback(async (id: number, reason?: string) => {
      try {
          await api.post(`/admin/blacklist/user/${id}`, { reason });
          fetchUsers();
      } catch (err) {
          console.error("Error blacklisting user:", err);
          throw err;
      }
  }, [fetchUsers]);

  return {
    users,
    totalUsers,
    currentPage,
    lastPage,
    loading,
    search,
    setSearch,
    filterRole,
    setFilterRole,
    filterVerification,
    setFilterVerification,
    setCurrentPage,
    addUser,
    editUser,
    toggleVerification,
    blacklistUser,
  };
}

export function usePenyeleksiOptions() {
  const [penyeleksi, setPenyeleksi] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllPenyeleksi = useCallback(async () => {
    try {
      setLoading(true);

      const first = await api.get("/admin/users", {
        params: { role: "penyeleksi", page: 1, per_page: 500 },
      });

      const firstData = first.data;
      const isPaginated = firstData && Array.isArray(firstData.data);
      let list: User[] = isPaginated ? firstData.data : (Array.isArray(firstData) ? firstData : []);

      const lastPage: number = isPaginated ? (firstData.last_page || 1) : 1;
      if (isPaginated && lastPage > 1) {
        const remainingPages = Array.from({ length: lastPage - 1 }, (_, i) => i + 2);
        const rest = await Promise.all(
          remainingPages.map((page) =>
            api.get("/admin/users", { params: { role: "penyeleksi", page, per_page: 500 } }),
          ),
        );
        rest.forEach((res) => {
          if (Array.isArray(res.data?.data)) list = list.concat(res.data.data);
        });
      }

      setPenyeleksi(list);
    } catch (err) {
      console.error("Error fetching penyeleksi options:", err);
      setPenyeleksi([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPenyeleksi();
  }, [fetchAllPenyeleksi]);

  return { penyeleksi, loading, refresh: fetchAllPenyeleksi };
}

// ============================================================
// APPLICATIONS (ADMIN VIEW)
// ============================================================
export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");

  const fetchData = useCallback(async () => {
    try {
        setLoading(true);
        const [appRes, jobRes] = await Promise.all([
            api.get("/admin/applications"),
            api.get("/jobs")
        ]);

        const appData = Array.isArray(appRes.data) ? appRes.data : (appRes.data.data || []);
        const jobData = Array.isArray(jobRes.data) ? jobRes.data : (jobRes.data.data || []);

        const mappedApps = appData.map((app: any) => {
            const results: any[] = app.stage_results || [];
            const sorted = [...results].sort(
                (a, b) => (a.stage?.stage_order || 0) - (b.stage?.stage_order || 0)
            );
            const pendingResult = sorted.find((sr) => sr.status === 'pending');
            const completedResults = sorted.filter((sr) => sr.status !== 'pending');

            return {
                id: app.id,
                user_id: app.user_id,
                job_id: app.job_id,
                user_name: app.user?.name || '',
                user_email: app.user?.email || '',
                user_nik: app.user?.nik ?? null,
                user_phone: app.user?.phone ?? null,
                job_title: app.job?.title || '',
                status: app.status,
                current_stage: pendingResult?.stage?.name ?? null,
                current_stage_order: pendingResult?.stage?.stage_order ?? null,
                current_stage_result_id: pendingResult?.id ?? null,
                stage_start_date: pendingResult?.stage?.start_date ?? null,
                stage_end_date: pendingResult?.stage?.end_date ?? null,
                last_stage: completedResults.length > 0 ? completedResults[completedResults.length - 1].stage?.name ?? null : null,
                last_stage_status: completedResults.length > 0 ? completedResults[completedResults.length - 1].status ?? null : null,
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
                other_applications: (app.other_applications || []).map((o: any) => ({
                    id: o.id,
                    job_id: o.job_id,
                    job_title: o.job_title,
                    status: o.status,
                })),
            };
        });

        const mappedJobs = jobData.map((j: any) => ({
            ...j,
            status: determineStatus(j.start_date, j.deadline),
            totalPendaftar: appData.filter((a: any) => a.job_id === j.id).length,
            selection_stages: (j.selection_stages || []).map((s: any) => ({
                id: String(s.id),
                name: s.name,
                order: s.stage_order,
                weight: s.weight,
                start_date: s.start_date,
                end_date: s.end_date,
                grading_end_date: s.grading_end_date ?? null,
                info: s.info ?? null,
                documents: (s.documents || []).map((d: any) => ({
                    form_field_id: d.id,
                    label: d.label,
                    weight: d.pivot?.weight ?? 0,
                })),
            })),
        }));

        setApplications(mappedApps);
        setAllJobs(mappedJobs);
    } catch (err) {
        console.error("Error fetching applications:", err);
        setApplications([]);
        setAllJobs([]);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
      fetchData();
  }, [fetchData]);

  const jobsWithApplicants = useMemo(() => {
    if (!Array.isArray(applications) || !Array.isArray(allJobs)) return [];
    const jobIdsWithApps = new Set(applications.map(app => app.job_id));
    return allJobs.filter(job => jobIdsWithApps.has(job.id));
  }, [applications, allJobs]);

  const getApplicationsByJobId = useCallback(
    (jobId: number) => {
      if (!Array.isArray(applications)) return [];
      let result = applications.filter((a) => a.job_id === jobId);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          (a) =>
            a.user_name?.toLowerCase().includes(q) ||
            a.user_email?.toLowerCase().includes(q) ||
            a.user_nik?.toLowerCase().includes(q),
        );
      }
      if (filterStage !== "all")
        result = result.filter((a) => a.status === filterStage);
      return result;
    },
    [applications, search, filterStage],
  );

  const getJobById = useCallback(
    (jobId: number) => allJobs.find((j) => j.id === jobId) ?? null,
    [allJobs],
  );

  const startApplicationStage = useCallback(async (appId: number): Promise<number | null> => {
    const res = await api.post(`/admin/applications/${appId}/init-stage`);
    await fetchData();
    return (res.data.data?.id as number) ?? null;
  }, [fetchData]);

  const updateStage = useCallback(async (data: UpdateStageData) => {
    await api.put(`/admin/applications/stages/${data.stage_result_id}`, {
        status: data.status,
        score: data.score,
        notes: data.note,
    });
    await fetchData();
  }, [fetchData]);

  return {
    applications,
    loading,
    allJobs,
    jobsWithApplicants,
    getApplicationsByJobId,
    getJobById,
    startApplicationStage,
    updateStage,
    search,
    setSearch,
    filterStage,
    setFilterStage,
  };
}