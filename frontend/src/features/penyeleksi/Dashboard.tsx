import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useAssignedJobs, usePendingGrading } from "./hooks";

const PenyeleksiDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, totalJobs, currentPenyeleksi } = useAssignedJobs();
  const { count: pendingCount, items: pendingItems, loading: pendingLoading } = usePendingGrading();
  const totalPeserta = jobs.reduce((s, j) => s + j.totalPendaftar, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Selamat datang, {currentPenyeleksi}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Lowongan"
          value={totalJobs}
          icon={<Briefcase size={20} />}
          color="blue"
        />
        <StatCard
          title="Peserta"
          value={totalPeserta}
          icon={<Users size={20} />}
          color="yellow"
        />
        <StatCard
          title="Sudah Dinilai"
          value={pendingLoading ? 0 : Math.max(0, totalPeserta - pendingCount)}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
        <StatCard
          title="Belum Dinilai"
          value={pendingLoading ? 0 : pendingCount}
          icon={<Clock size={20} />}
          color="red"
        />
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
                onClick={() => navigate(`/penyeleksi/jobs/${item.job_id}`)}
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-50">
          <h3 className="font-bold text-gray-900">Lowongan Anda</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => navigate(`/penyeleksi/jobs/${job.id}`)}
              className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer group"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-sm group-hover:text-[#0D278D] truncate">
                  {job.title}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={11} />
                    {job.totalPendaftar} peserta
                  </span>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-gray-300 group-hover:text-[#0D278D] shrink-0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
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

export default PenyeleksiDashboard;
