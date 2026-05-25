import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, CheckCircle2, XCircle, Bell, ChevronRight } from "lucide-react";
import { useDashboardStats, usePendingGrading } from "./hooks";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
  const [period, setPeriod] = React.useState<'daily' | 'monthly'>('daily');
  const { stats, loading } = useDashboardStats(period);
  const { count: pendingCount, items: pendingItems, loading: pendingLoading } = usePendingGrading();
  
  // 🚀 FIX: Prevent Recharts from rendering before parent container is ready
  const [isReady, setIsReady] = React.useState(false);
  React.useEffect(() => {
    setIsReady(true);
  }, []);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Tren Pendaftaran</h3>
            <p className="text-sm text-gray-500">
              {period === 'daily' ? 'Pelamar vs Pelamar Lulus per hari (30 hari terakhir)' : 'Pelamar vs Pelamar Lulus per bulan (12 bulan terakhir)'}
            </p>
          </div>
          
          {/* Period Toggle */}
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 shrink-0">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === 'daily' 
                ? 'bg-white text-[#0D278D] shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === 'monthly' 
                ? 'bg-white text-[#0D278D] shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Bulanan
            </button>
          </div>
        </div>

        <div className="w-full bg-white" style={{ minHeight: '300px' }}>
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center animate-pulse bg-gray-50 rounded-xl">
              <p className="text-gray-400 text-sm">Memuat data...</p>
            </div>
          ) : isReady && stats?.trendData && stats.trendData.length > 0 ? (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.trendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
                    dy={10}
                    interval="preserveStartEnd"
                    minTickGap={period === 'daily' ? 30 : 10}
                    tickFormatter={(str) => {
                      try {
                        if (period === 'monthly') return str; 
                        const d = new Date(str);
                        return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
                      } catch {
                        return str;
                      }
                    }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94a3b8", fontSize: 11 }} 
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="applicants"
                    name="Pelamar"
                    stroke="#0D278D"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#0D278D", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, fill: "#0D278D", stroke: "#fff", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accepted"
                    name="Pelamar Lulus"
                    stroke="#FEB700"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#FEB700", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, fill: "#FEB700", stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
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
