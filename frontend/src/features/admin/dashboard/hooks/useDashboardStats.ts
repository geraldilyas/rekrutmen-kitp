import { useState, useEffect } from "react";
import type { DashboardStats } from "../../types";

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulasi API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStats(dummyStats);
      } catch (err) {
        setError("Gagal memuat data statistik");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
