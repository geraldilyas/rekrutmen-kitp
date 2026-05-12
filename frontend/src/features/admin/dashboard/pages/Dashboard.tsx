import React from "react";
import { Users, Briefcase, CheckCircle2, XCircle } from "lucide-react";
import StatsCard from "../components/StatsCard";
import StatusChart from "../components/StatusChart";
import { useDashboardStats } from "../hooks/useDashboardStats";

const Dashboard: React.FC = () => {
  const { stats, loading } = useDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Selamat datang kembali, Admin. Berikut ringkasan data rekrutmen.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse"
              >
                <div className="flex justify-between mb-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded-full w-20" />
                    <div className="h-8 bg-gray-100 rounded-xl w-24" />
                  </div>
                  <div className="h-12 w-12 bg-gray-100 rounded-2xl" />
                </div>
                <div className="h-3 bg-gray-50 rounded-full w-28" />
              </div>
            ))
          : [
              {
                title: "Total Pelamar",
                value: stats?.totalApplicants.toLocaleString() || "0",
                icon: <Users size={22} strokeWidth={1.5} />,
                color: "blue" as const,
                trend: { value: 12, isPositive: true },
              },
              {
                title: "Lowongan Aktif",
                value: stats?.totalJobs || 0,
                icon: <Briefcase size={22} strokeWidth={1.5} />,
                color: "yellow" as const,
                trend: { value: 5, isPositive: true },
              },
              {
                title: "Kandidat Diterima",
                value: stats?.totalAccepted || 0,
                icon: <CheckCircle2 size={22} strokeWidth={1.5} />,
                color: "green" as const,
                trend: { value: 8, isPositive: true },
              },
              {
                title: "Tidak Lulus",
                value: stats?.totalRejected || 0,
                icon: <XCircle size={22} strokeWidth={1.5} />,
                color: "red" as const,
                trend: { value: 3, isPositive: false },
              },
            ].map((stat, i) => <StatsCard key={i} {...stat} />)}
      </div>

      {/* Chart */}
      {loading ? (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-100 rounded-full w-48 mb-2" />
          <div className="h-4 bg-gray-50 rounded-full w-64 mb-8" />
          <div className="h-72 bg-gray-50 rounded-2xl" />
        </div>
      ) : (
        <StatusChart data={stats?.applicationsByMonth || []} />
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Aktivitas Terbaru</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                3 notifikasi hari ini
              </p>
            </div>
            <button className="text-sm font-semibold text-[#0D278D] hover:text-[#FEB700] transition-colors">
              Lihat Semua
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            {
              text: "Pendaftar baru untuk posisi <b>Software Engineer</b>",
              time: "5 menit lalu",
              dot: "bg-emerald-400",
            },
            {
              text: "Lowongan <b>Petugas Administrasi</b> telah ditutup otomatis",
              time: "2 jam lalu",
              dot: "bg-amber-400",
            },
            {
              text: "Pengumuman hasil seleksi <b>Tahap 2</b> dipublikasikan",
              time: "1 hari lalu",
              dot: "bg-blue-400",
            },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full ${activity.dot} shrink-0 ring-4 ring-opacity-20 ring-current`}
              />
              <p
                className="text-sm text-gray-600 flex-1"
                dangerouslySetInnerHTML={{ __html: activity.text }}
              />
              <span className="text-xs text-gray-400 shrink-0 font-medium">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
