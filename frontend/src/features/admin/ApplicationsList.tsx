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
  Clock,
  ChevronDown,
} from "lucide-react";
import { useApplications } from "./hooks";
import type { SelectionStage } from "../shared/types";

const fmt = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const getActiveStage = (stages: SelectionStage[]): SelectionStage | null => {
  const now = new Date();
  return (
    stages.find((s) => {
      const start = s.start_date ? new Date(s.start_date) : null;
      const end = s.end_date ? new Date(s.end_date) : null;
      return start && end && now >= start && now <= end;
    }) ?? null
  );
};

const getNextStage = (stages: SelectionStage[], active: SelectionStage | null): SelectionStage | null => {
  if (!active) {
    const now = new Date();
    return (
      stages
        .filter((s) => s.start_date && new Date(s.start_date) > now)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0] ?? null
    );
  }
  return stages.find((s) => (s.order ?? 0) === (active.order ?? 0) + 1) ?? null;
};

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  active: { label: "Berlangsung", dot: "bg-emerald-500", text: "text-emerald-700" },
  coming_soon: { label: "Akan Datang", dot: "bg-amber-500", text: "text-amber-700" },
  finished: { label: "Selesai", dot: "bg-gray-400", text: "text-gray-500" },
};

const ApplicationsList: React.FC = () => {
  const navigate = useNavigate();
  const { allJobs, loading } = useApplications();
  const [search, setSearch] = React.useState("");

  const filtered = allJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Pendaftar</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pilih lowongan untuk melihat dan menilai pelamar
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

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D278D] mx-auto" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => {
            const stages = job.selection_stages || [];
            const activeStage = getActiveStage(stages);
            const nextStage = getNextStage(stages, activeStage);
            const sc = statusConfig[job.status] || statusConfig.finished;

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/admin/applications/${job.id}`)}
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
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-[#0D278D]">
                          {job.title}
                        </p>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-50 ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {job.totalPendaftar} pelamar
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers size={11} />
                          {stages.length} tahap
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {fmt(job.start_date)} — {fmt(job.end_date)}
                        </span>
                      </div>

                      {/* Stage progress info */}
                      {stages.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {activeStage && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-blue-50 text-[#0D278D] px-2.5 py-1 rounded-lg">
                              <Clock size={10} />
                              Sekarang: {activeStage.name}
                              {activeStage.end_date && (
                                <span className="font-normal text-blue-400">
                                  s/d {fmt(activeStage.end_date)}
                                </span>
                              )}
                            </span>
                          )}
                          {nextStage && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg">
                              <ChevronDown size={10} />
                              Berikutnya: {nextStage.name}
                              {nextStage.start_date && (
                                <span className="font-normal text-amber-500">
                                  mulai {fmt(nextStage.start_date)}
                                </span>
                              )}
                            </span>
                          )}
                          {!activeStage && !nextStage && job.status === "finished" && (
                            <span className="text-[11px] text-gray-400">
                              Seluruh tahap selesai
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-300 group-hover:text-[#0D278D] shrink-0 mt-1"
                  />
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Users size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Belum ada lowongan</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
