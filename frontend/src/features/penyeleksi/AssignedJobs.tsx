import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, MapPin, Users, Search, Building2 } from "lucide-react";
import { useAssignedJobs } from "./hooks";

const AssignedJobs: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, search, setSearch, totalJobs } = useAssignedJobs();

  const statusConfig: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700",
    coming_soon: "bg-amber-50 text-amber-700",
    finished: "bg-gray-100 text-gray-500",
  };

  const categoryConfig: Record<string, string> = {
    tenaga_pendukung: "bg-blue-50 text-[#0D278D]",
    konsultan_individu: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lowongan Saya</h1>
        <p className="text-gray-500 text-sm mt-1">
          {totalJobs} lowongan ditugaskan
        </p>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari lowongan..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0D278D]"
        />
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => navigate(`/penyeleksi/jobs/${job.id}`)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md hover:border-[#0D278D]/20 cursor-pointer group transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-50 items-center justify-center shrink-0 group-hover:bg-[#0D278D] transition-colors">
                  <Briefcase
                    size={18}
                    className="text-[#0D278D] group-hover:text-white"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-[#0D278D] truncate">
                    {job.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 size={11} />
                      {job.unit_kerja}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {job.totalPendaftar} peserta
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusConfig[job.status]}`}
                >
                  {job.status === "active"
                    ? "Berlangsung"
                    : job.status === "coming_soon"
                      ? "Coming Soon"
                      : "Selesai"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${categoryConfig[job.category]}`}
                >
                  {job.category === "tenaga_pendukung" ? "TP" : "KI"}
                </span>
              </div>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Tidak ada lowongan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedJobs;
