import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  ChevronRight,
  Users,
  Layers,
  Search,
  Calendar,
} from "lucide-react";
import { useApplications } from "./hooks";

const ApplicationsList: React.FC = () => {
  const navigate = useNavigate();
  const { jobsWithApplicants } = useApplications();
  const [search, setSearch] = React.useState("");

  const fmt = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "-";

  const filtered = jobsWithApplicants.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Pendaftar</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pilih lowongan untuk melihat daftar pelamar
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
        {filtered.map((job) => (
          <div
            key={job.id}
            onClick={() => navigate(`/admin/applications/${job.id}`)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md hover:border-[#0D278D]/20 cursor-pointer group transition-all"
          >
            <div className="flex items-center justify-between gap-4">
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
                      <Users size={11} />
                      {job.totalPendaftar} pelamar
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers size={11} />
                      {job.selection_stages.length} tahap
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {fmt(job.start_date)} — {fmt(job.end_date)}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-gray-300 group-hover:text-[#0D278D] shrink-0"
              />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Users size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              Tidak ada lowongan dengan pendaftar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
