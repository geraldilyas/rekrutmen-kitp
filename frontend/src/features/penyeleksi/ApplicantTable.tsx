import React from "react";
import { Mail, Clock, Calendar, ChevronRight, User } from "lucide-react";
import type { Application } from "../shared/types";

interface Props {
  applicants: Application[];
  onView: (app: Application) => void;
}

const statusConfig: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  pending: {
    label: "Proses",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  seleksi: {
    label: "Seleksi",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  lulus: {
    label: "Lulus",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  Lulus: {
    label: "Lulus",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  tidak_lulus: {
    label: "Tidak Lulus",
    color: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500",
  },
  "Tidak Lulus": {
    label: "Tidak Lulus",
    color: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500",
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

const ApplicantTable: React.FC<Props> = ({ applicants, onView }) => {
  if (applicants.length === 0)
    return (
      <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
        <User size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">Tidak ada peserta</p>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Peserta
              </th>
              <th className="text-center px-3 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Tahap
              </th>
              <th className="text-center px-3 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Melamar
              </th>
              <th className="text-center px-3 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-center px-3 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Nilai Akhir
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applicants.map((app) => {
              const s = statusConfig[app.last_stage_status ?? ""] || statusConfig.pending;
              const weightedScore = app.stage_scores.reduce((sum, sc) => {
                return sum + ((sc.score || 0) * sc.weight) / 100;
              }, 0);
              const hasScores = app.stage_scores.length > 0;

              return (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  onClick={() => onView(app)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0D278D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                        {app.user_name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {app.user_name}
                        </p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Mail size={10} className="shrink-0" />
                          <span className="truncate">{app.user_email}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center hidden md:table-cell align-middle">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-[#0D278D] text-[11px] font-semibold whitespace-nowrap">
                      <Clock size={10} />
                      {app.last_stage || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-center hidden sm:table-cell align-middle">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={11} />
                      {fmt(app.applied_at)}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-center align-middle">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${s.color}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-center hidden sm:table-cell align-middle">
                    {hasScores ? (
                      <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold whitespace-nowrap border border-amber-100 shadow-sm">
                        {weightedScore.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-center align-middle">
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#0D278D] transition-colors" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicantTable;
