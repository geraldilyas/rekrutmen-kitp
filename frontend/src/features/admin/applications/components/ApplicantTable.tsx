import React from "react";
import {
  Mail,
  Phone,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  ChevronDown,
  FileText,
  User,
  Hash,
} from "lucide-react";
import type { Application } from "../../types";

interface ApplicantTableProps {
  applicants: Application[];
  onUpdateStage: (application: Application) => void;
}

const statusConfig = {
  pending: {
    label: "Proses",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  diterima: {
    label: "Diterima",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  ditolak: {
    label: "Ditolak",
    color: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500",
  },
};

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ApplicantTable: React.FC<ApplicantTableProps> = ({
  applicants,
  onUpdateStage,
}) => {
  if (applicants.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
        <User size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">Tidak ada pelamar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applicants.map((applicant) => {
        const status = statusConfig[applicant.status];

        return (
          <div
            key={applicant.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Main Content */}
            <div className="p-5 sm:p-6">
              {/* Header: Avatar + Name + Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D278D] to-blue-700 text-white flex items-center justify-center font-bold text-base shadow-md">
                    {applicant.user_name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">
                      {applicant.user_name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <Mail size={12} className="text-gray-400" />
                      {applicant.user_email}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border whitespace-nowrap ${status.color}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              {/* Detail Info in Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {/* NIK */}
                {applicant.user_nik && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Hash size={14} className="text-[#0D278D]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        NIK
                      </p>
                      <p className="text-sm font-semibold text-gray-700 font-mono truncate">
                        {applicant.user_nik}
                      </p>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {applicant.user_phone && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        Telepon
                      </p>
                      <p className="text-sm font-semibold text-gray-700 truncate">
                        {applicant.user_phone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Applied Date */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      Melamar
                    </p>
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {formatDate(applicant.applied_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Stage */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0D278D]/5 border border-[#0D278D]/10 mb-4">
                <Clock size={16} className="text-[#0D278D] shrink-0" />
                <div>
                  <p className="text-[10px] text-[#0D278D]/60 uppercase font-bold tracking-wider">
                    Tahap Saat Ini
                  </p>
                  <p className="text-sm font-bold text-[#0D278D]">
                    {applicant.current_stage}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {applicant.document_link ? (
                  <a
                    href={applicant.document_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-blue-50 hover:text-[#0D278D] hover:border-[#0D278D]/30 transition-all"
                  >
                    <ExternalLink size={14} />
                    Lihat Berkas
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400 bg-gray-50 border border-gray-100">
                    <ExternalLink size={14} />
                    Tidak ada berkas
                  </span>
                )}

                {applicant.status === "pending" ? (
                  <button
                    onClick={() => onUpdateStage(applicant)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-sm ml-auto"
                  >
                    Update Tahap
                    <ChevronDown size={14} className="rotate-270" />
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-gray-50 border border-gray-100 ml-auto">
                    Selesai
                  </span>
                )}
              </div>
            </div>

            {/* Stage History */}
            {applicant.stage_history.length > 0 && (
              <div className="border-t border-gray-50 bg-gray-50/30 px-5 sm:px-6 py-3">
                <details className="group/history">
                  <summary className="flex items-center justify-between text-xs font-semibold text-gray-500 hover:text-[#0D278D] cursor-pointer list-none transition-colors">
                    <span className="flex items-center gap-2">
                      <History size={13} />
                      Riwayat Tahapan ({applicant.stage_history.length})
                    </span>
                    <ChevronDown
                      size={14}
                      className="transition-transform group-open/history:rotate-180"
                    />
                  </summary>
                  <div className="mt-3 space-y-2">
                    {applicant.stage_history.map((history, i) => {
                      const isLulus = history.status === "lulus";
                      const isDiterima = history.status === "diterima";
                      const isDitolak = history.status === "ditolak";

                      return (
                        <div
                          key={i}
                          className={`flex items-start gap-3 p-3 rounded-xl border ${
                            isLulus
                              ? "bg-emerald-50/50 border-emerald-100"
                              : isDiterima
                                ? "bg-blue-50/50 border-blue-100"
                                : "bg-red-50/50 border-red-100"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isLulus
                                ? "bg-emerald-500 text-white"
                                : isDiterima
                                  ? "bg-[#0D278D] text-white"
                                  : "bg-red-500 text-white"
                            }`}
                          >
                            {isDitolak ? (
                              <XCircle size={13} />
                            ) : (
                              <CheckCircle2 size={13} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-bold text-gray-800">
                                {history.stage_name}
                              </p>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isLulus
                                    ? "text-emerald-700 bg-emerald-100"
                                    : isDiterima
                                      ? "text-[#0D278D] bg-blue-100"
                                      : "text-red-600 bg-red-100"
                                }`}
                              >
                                {isLulus
                                  ? "Lulus"
                                  : isDiterima
                                    ? "Diterima"
                                    : "Ditolak"}
                              </span>
                            </div>
                            {history.note && (
                              <p className="text-xs text-gray-500 line-clamp-2 italic">
                                "{history.note}"
                              </p>
                            )}
                            <p className="text-[10px] text-gray-400 mt-1">
                              {formatDate(history.updated_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ApplicantTable;
