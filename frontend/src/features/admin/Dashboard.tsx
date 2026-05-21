import React from "react";
import { Users, Briefcase, CheckCircle2, XCircle } from "lucide-react";
import { useDashboardStats } from "./hooks";
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
  const { stats, loading } = useDashboardStats();

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

      {/* Aktivitas Terbaru */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-50">
          <h3 className="font-bold text-gray-900">Aktivitas Terbaru</h3>
        </div>
        <div className="p-5 space-y-3">
          {[
            {
              text: "Pendaftar baru untuk posisi Software Engineer",
              time: "5 menit lalu",
            },
            {
              text: "Lowongan Petugas Administrasi telah ditutup",
              time: "2 jam lalu",
            },
            {
              text: "Pengumuman hasil seleksi Tahap 2 dipublikasikan",
              time: "1 hari lalu",
            },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <p className="text-sm text-gray-600 flex-1">{activity.text}</p>
              <span className="text-xs text-gray-400 shrink-0">
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
