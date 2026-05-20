import React from "react";
import {
  Mail,
  ExternalLink,
  Clock,
  History,
  Calendar,
  User,
} from "lucide-react";
import type { Application } from "../shared/types";

interface Props {
  applicants: Application[];
  onUpdate: (app: Application) => void;
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
  lulus: {
    label: "Lulus",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  tidak_lulus: {
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
const fmtDateTime = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const ApplicantTable: React.FC<Props> = ({ applicants, onUpdate }) => {
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

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
                Berkas
              </th>
              <th className="text-center px-3 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applicants.map((app) => {
              const s = statusConfig[app.status] || statusConfig.pending;
              const canUpdate = app.status === "pending";
              const hasHistory = app.stage_history.length > 0;
              const hasDocument = !!app.document_link;
              const isExpanded = expandedId === app.id;

              const weightedScore = app.stage_scores.reduce((sum, sc) => {
                return sum + ((sc.score || 0) * sc.weight) / 100;
              }, 0);
              const hasScores = app.stage_scores.length > 0;

              return (
                <React.Fragment key={app.id}>
                  <tr
                    className={`hover:bg-gray-50/30 transition-colors ${hasHistory ? "cursor-pointer" : ""}`}
                    onClick={() =>
                      hasHistory && setExpandedId(isExpanded ? null : app.id)
                    }
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#0D278D] text-white flex items-center justify-center font-bold text-xs shrink-0">
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
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Mail size={10} className="shrink-0" />
                            <span className="truncate">{app.user_email}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center hidden md:table-cell align-middle">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-[#0D278D] text-[11px] font-semibold whitespace-nowrap">
                        <Clock size={10} />
                        {app.current_stage || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell align-middle">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={11} />
                        {fmt(app.applied_at)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center align-middle">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${s.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell align-middle">
                      {hasDocument ? (
                        <a
                          href={app.document_link!}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:text-[#0D278D] transition-all"
                        >
                          <ExternalLink size={13} />
                          Lihat
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center align-middle">
                      {canUpdate ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdate(app);
                          }}
                          className="h-8 px-4 rounded-lg text-[11px] font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-sm"
                        >
                          Nilai
                        </button>
                      ) : (
                        <span className="inline-flex items-center h-8 px-4 rounded-lg text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100">
                          Selesai
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Riwayat */}
                  {isExpanded && hasHistory && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-4 bg-gray-50/30 border-b border-gray-50"
                      >
                        <p className="text-[11px] font-bold text-gray-500 mb-4 flex items-center gap-1.5">
                          <History size={12} />
                          Riwayat Tahapan Seleksi
                        </p>

                        <div className="relative pl-8 space-y-0">
                          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200" />
                          {app.stage_history.map((h, i) => {
                            const isLulus = h.status === "lulus";
                            const isLast = i === app.stage_history.length - 1;
                            return (
                              <div
                                key={i}
                                className={`relative ${!isLast ? "pb-5" : ""}`}
                              >
                                <div
                                  className={`absolute -left-[23px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${isLulus ? "bg-emerald-500" : "bg-red-500"}`}
                                >
                                  {isLulus ? (
                                    <svg
                                      className="w-full h-full text-white p-0.5"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                    >
                                      <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-full h-full text-white p-0.5"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                    >
                                      <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                                <div
                                  className={`p-4 rounded-xl border ${isLulus ? "bg-white border-emerald-100" : "bg-white border-red-100"}`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                        Tahap {i + 1}
                                      </span>
                                      <p className="text-sm font-bold text-gray-800">
                                        {h.stage_name}
                                      </p>
                                    </div>
                                    <span
                                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isLulus ? "text-emerald-700 bg-emerald-100" : "text-red-600 bg-red-100"}`}
                                    >
                                      {isLulus ? "✓ Lulus" : "✕ Tidak Lulus"}
                                    </span>
                                  </div>
                                  {h.note && (
                                    <div className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                      <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">
                                        Catatan Penyeleksi
                                      </p>
                                      <p className="text-xs text-gray-600 italic leading-relaxed">
                                        "{h.note}"
                                      </p>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                                    {h.score !== null && (
                                      <span className="text-xs font-bold text-gray-700">
                                        Skor: {h.score}
                                      </span>
                                    )}
                                    {h.scored_by && (
                                      <div className="flex items-center gap-1.5">
                                        <User
                                          size={11}
                                          className="text-gray-400"
                                        />
                                        <span className="text-[11px] text-gray-500">
                                          {h.scored_by}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1.5 ml-auto">
                                      <Clock
                                        size={11}
                                        className="text-gray-400"
                                      />
                                      <span className="text-[11px] text-gray-400">
                                        {fmtDateTime(h.updated_at)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {hasScores && (
                          <div className="mt-4 p-4 rounded-xl bg-white border border-amber-100">
                            <p className="text-[11px] font-bold text-gray-500 mb-2">
                              Ringkasan Penilaian
                            </p>
                            <div className="space-y-1.5">
                              {app.stage_scores.map((sc, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span className="text-gray-600">
                                    {sc.stage_name}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-400">
                                      Bobot: {sc.weight}%
                                    </span>
                                    <span className="text-gray-400">
                                      Skor: {sc.score}
                                    </span>
                                    <span className="font-bold text-gray-700">
                                      {(
                                        ((sc.score || 0) * sc.weight) /
                                        100
                                      ).toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-700">
                                  Nilai Akhir
                                </span>
                                <span className="text-sm font-bold text-amber-700">
                                  {weightedScore.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicantTable;
