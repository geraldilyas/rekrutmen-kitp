import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  MapPin,
  ChevronRight,
  Layers,
  Briefcase,
  Search,
} from "lucide-react";
import { useApplications } from "../hooks/useApplications";

const ApplicationList: React.FC = () => {
  const navigate = useNavigate();
  const { jobsWithApplicants } = useApplications();
  const [search, setSearch] = React.useState("");

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredJobs = jobsWithApplicants.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Data Pendaftar
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pilih lowongan untuk melihat daftar pelamar
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari lowongan..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm outline-none focus:border-[#0D278D]/30 transition-all"
        />
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => navigate(`/admin/applications/${job.id}`)}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0D278D]/20 transition-all duration-300 p-5 sm:p-6 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 items-center justify-center shrink-0 group-hover:bg-[#0D278D] group-hover:border-[#0D278D] transition-all duration-300">
                <Briefcase
                  size={22}
                  className="text-[#0D278D] group-hover:text-white transition-colors"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 group-hover:text-[#0D278D] transition-colors leading-snug">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={11} className="text-gray-400" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Layers size={11} className="text-gray-400" />
                    {job.selection_stages.length} tahapan
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-sm font-bold text-gray-700">
                    {job.totalPendaftar}
                  </span>
                  <span className="text-xs text-gray-400">pelamar</span>
                </div>
                <div className="flex sm:hidden items-center gap-1.5">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-sm font-bold text-gray-700">
                    {job.totalPendaftar}
                  </span>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-300 group-hover:text-[#0D278D] group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">
            Tidak ada lowongan dengan pendaftar
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
