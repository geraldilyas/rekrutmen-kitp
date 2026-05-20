import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { useAssignedJobs } from "./hooks";

const PenyeleksiDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, totalJobs, currentPenyeleksi } = useAssignedJobs();
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
          title="Dinilai"
          value={8}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
        <StatCard
          title="Pending"
          value={7}
          icon={<Clock size={20} />}
          color="red"
        />
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
