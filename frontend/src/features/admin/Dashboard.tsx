import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, CheckCircle2, XCircle, Bell, ChevronRight } from "lucide-react";
import { useDashboardStats, usePendingGrading } from "./hooks";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-[#0D278D]",
    yellow: "bg-amber-50 text-[#FEB700]",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats();
  const { count: pendingCount, items: pendingItems, loading: pendingLoading } = usePendingGrading();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3">
          <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-bold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan data rekrutmen</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pelamar"
          value={stats?.totalApplicants.toLocaleString() || "0"}
          icon={<Users size={20} />}
          color="blue"
        />
        <StatCard
          title="Lowongan Aktif"
          value={stats?.totalJobs || 0}
          icon={<Briefcase size={20} />}
          color="yellow"
        />
        <StatCard
          title="Lulus"
          value={stats?.totalAccepted || 0}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
        <StatCard
          title="Tidak Lulus"
          value={stats?.totalRejected || 0}
          icon={<XCircle size={20} />}
          color="red"
        />
      </div>

      {/* Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-1">Tren Pendaftaran</h3>
          <p className="text-sm text-gray-500 mb-6">
            Pelamar vs yang Lulus per bulan
          </p>
          <div className="w-full bg-white" style={{ height: 256 }}>
            {loading ? (
              <div className="w-full h-full flex items-center justify-center animate-pulse bg-gray-50 rounded-xl">
                <p className="text-gray-400 text-sm">Memuat data...</p>
              </div>
            ) : stats?.applicationsByMonth && stats.applicationsByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height={256}>
                <AreaChart
                  data={stats.applicationsByMonth}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D278D" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#0D278D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FEB700" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#FEB700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="applicants"
                    name="Pelamar"
                    stroke="#0D278D"
                    strokeWidth={2}
                    fill="url(#colorApplicants)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#0D278D", stroke: "#fff", strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accepted"
                    name="Lulus"
                    stroke="#FEB700"
                    strokeWidth={2}
                    fill="url(#colorAccepted)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#FEB700", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm font-medium">Data tren belum tersedia</p>
              </div>
            )}
          </div>
        </div>

      {/* Notifikasi Perlu Dinilai */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-amber-500" />
            <h3 className="font-bold text-gray-900">Perlu Dinilai</h3>
          </div>
          {!pendingLoading && pendingCount > 0 && (
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {pendingCount} lamaran
            </span>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {pendingLoading ? (
            <div className="p-6 text-center text-sm text-gray-400">Memuat...</div>
          ) : pendingItems.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle2 size={32} className="mx-auto text-emerald-300 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Semua penilaian sudah selesai</p>
            </div>
          ) : (
            pendingItems.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(`/admin/applications/${item.job_id}`)}
                className="w-full flex items-center gap-3 p-4 hover:bg-amber-50 transition-colors text-left group"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#0D278D]">
                    {item.user_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.job_title} — Tahap: <span className="font-medium text-amber-600">{item.stage_name}</span>
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-[#0D278D] shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
