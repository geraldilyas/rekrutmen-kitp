import React from "react";
import {
  Pencil,
  Trash2,
  MapPin,
  Building2,
  Calendar,
  Layers,
  Users,
  ChevronRight,
} from "lucide-react";
import type { Job } from "../shared/types";

interface Props {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
}

const statusConfig: Record<
  string,
  { label: string; color: string; dot: string }
> = {
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

const categoryConfig: Record<
  string,
  { label: string; color: string; dot: string }
> = {
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

const fmt = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const isSameDay = (d1Str: string | null, d2Str: string | null): boolean => {
  if (!d1Str || !d2Str) return false;
  const d1 = new Date(d1Str);
  const d2 = new Date(d2Str);
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

const JobRow: React.FC<{
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
}> = ({ job, onEdit, onDelete }) => {
  const [expanded, setExpanded] = React.useState(false);
  const status = statusConfig[job.status] || statusConfig.active;
  const category =
    categoryConfig[job.category] || categoryConfig.tenaga_pendukung;

  return (
    <div
      key={job.id}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 transition-all overflow-hidden"
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Badges Row */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${category.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${category.dot}`} />
                {category.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${status.color}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>

            {/* Title & Info */}
            <h3 className="text-base font-bold text-gray-900 mb-2 truncate">
              {job.title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4">
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={14} className="shrink-0" />
                <span className="text-xs truncate">{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Building2 size={14} className="shrink-0" />
                <span className="text-xs truncate">{job.unit_kerja}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={14} className="shrink-0" />
                <span className="text-xs">
                  {fmt(job.start_date)} - {fmt(job.deadline)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden lg:flex flex-col items-end pr-4 border-r border-gray-100">
              <div className="flex items-center gap-1.5 text-[#0D278D]">
                <Users size={14} />
                <span className="text-sm font-bold">{job.totalPendaftar}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Pendaftar</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(job)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#0D278D] hover:bg-blue-50 transition-all"
                title="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(job.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Hapus"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Detail Tahapan */}
      <div className="border-t border-gray-50 bg-gray-50/30 px-4 sm:px-5 py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-xs font-medium text-gray-500 hover:text-[#0D278D] transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Layers size={12} />
            {(job.selection_stages || []).length} Tahapan Seleksi
          </span>
          <ChevronRight
            size={14}
            className={`transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </button>
        {expanded && (
          <div className="mt-3 space-y-2">
            {(job.selection_stages || [])
              .sort((a, b) => a.order - b.order)
              .map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0D278D] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                    {stage.order}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-800">
                      {stage.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-gray-500 font-medium">
                        Bobot: {stage.weight}%
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {isSameDay(stage.start_date, stage.end_date)
                          ? fmt(stage.start_date)
                          : `${fmt(stage.start_date)} - ${fmt(stage.end_date)}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

const JobsTable: React.FC<Props> = ({ jobs, onEdit, onDelete }) => {
  if (jobs.length === 0)
    return (
      <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
        <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">Tidak ada lowongan</p>
      </div>
    );

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <JobRow
          key={job.id}
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default JobsTable;
