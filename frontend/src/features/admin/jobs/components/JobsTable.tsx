import React from "react";
import {
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  UserCircle,
  Layers,
  ChevronRight,
} from "lucide-react";
import type { Job } from "../../types";

interface JobsTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
}

const statusConfig = {
  coming_soon: {
    label: "Coming Soon",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  active: {
    label: "Berlangsung",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  finished: {
    label: "Selesai",
    color: "bg-gray-100 text-gray-500 border-gray-200",
    dot: "bg-gray-400",
  },
};

const categoryConfig = {
  tenaga_pendukung: {
    label: "Tenaga Pendukung",
    color: "bg-blue-50 text-[#0D278D] border-blue-100",
    dot: "bg-[#0D278D]",
  },
  konsultan_individu: {
    label: "Konsultan Individu",
    color: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-[#FEB700]",
  },
};

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateRange = (start: string | null, end: string | null) => {
  if (!start && !end) return "-";
  const startStr = start ? formatDate(start) : "?";
  const endStr = end ? formatDate(end) : "?";
  return `${startStr} — ${endStr}`;
};

const JobsTable: React.FC<JobsTableProps> = ({ jobs, onEdit, onDelete }) => {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="text-center py-20 px-6">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <Calendar size={32} className="text-gray-300" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            Tidak Ada Lowongan
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Klik <b>Tambah Lowongan</b> untuk membuat lowongan baru
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => {
        const status = statusConfig[job.status];
        const category = categoryConfig[job.category];

        return (
          <div
            key={job.id}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden"
          >
            <div className="p-5 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left: Informasi Utama */}
                <div className="flex-1 min-w-0">
                  {/* Top Badges Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${category.color}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${category.dot}`}
                      />
                      {category.label}
                    </span>
                    {job.type && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-100">
                        {job.type}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${status.color}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                      />
                      {status.label}
                    </span>
                  </div>

                  {/* Judul */}
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0D278D] transition-colors mb-2 leading-snug">
                    {job.title}
                  </h3>

                  {/* Info Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
                    {/* Lokasi */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate">{job.location || "—"}</span>
                    </div>

                    {/* Unit Kerja */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <UserCircle
                        size={13}
                        className="text-gray-400 shrink-0"
                      />
                      <span className="truncate">{job.unit_kerja || "—"}</span>
                    </div>

                    {/* Perekrut */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <span className="text-[11px] text-gray-400 shrink-0">
                        oleh
                      </span>
                      <span className="truncate font-medium text-gray-600">
                        {job.recruiter_name || "—"}
                      </span>
                    </div>

                    {/* Periode */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Calendar size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate text-xs">
                        {formatDateRange(job.start_date, job.end_date)}
                      </span>
                    </div>
                  </div>

                  {/* Deadline Warning */}
                  {job.deadline && job.status === "active" && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100">
                      <Clock size={11} className="text-amber-600" />
                      <span className="text-[11px] font-semibold text-amber-700">
                        Deadline: {formatDate(job.deadline)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Tahapan + Actions */}
                <div className="flex items-center gap-3 lg:flex-col lg:items-end shrink-0">
                  {/* Tahapan Seleksi */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
                    <Layers size={14} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600">
                      {job.selection_stages.length} Tahapan
                    </span>
                    <div className="hidden sm:flex items-center -space-x-1">
                      {job.selection_stages.slice(0, 3).map((stage, i) => (
                        <div
                          key={stage.id}
                          className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500"
                          title={stage.name}
                        >
                          {i + 1}
                        </div>
                      ))}
                      {job.selection_stages.length > 3 && (
                        <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-400">
                          +
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(job)}
                      className="p-2.5 rounded-xl text-gray-400 hover:text-[#0D278D] hover:bg-blue-50 transition-all"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(job.id)}
                      className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable: Detail Tahapan */}
            <div className="border-t border-gray-50 bg-gray-50/30 px-5 sm:px-6 py-3">
              <details className="group/details cursor-pointer">
                <summary className="flex items-center justify-between text-xs font-medium text-gray-500 hover:text-[#0D278D] transition-colors list-none">
                  <span>Lihat detail tahapan seleksi</span>
                  <ChevronRight
                    size={14}
                    className="transition-transform group-open/details:rotate-90"
                  />
                </summary>
                <div className="mt-3 space-y-2">
                  {job.selection_stages
                    .sort((a, b) => a.order - b.order)
                    .map((stage, index) => (
                      <div
                        key={stage.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-gray-100"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#0D278D] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                          {stage.order}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {stage.name}
                          </p>
                          {stage.description && (
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">
                              {stage.description}
                            </p>
                          )}
                        </div>
                        {index < job.selection_stages.length - 1 && (
                          <div className="hidden sm:block text-gray-300 ml-auto">
                            <ChevronRight size={14} />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </details>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobsTable;
