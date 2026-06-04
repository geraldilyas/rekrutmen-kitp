import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  Star,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { api } from "../../services/api";
import type { Application } from "../shared/types";

interface FullApplicationData {
  user: { name: string; email: string; nik: string | null; phone: string | null };
  job: { title: string };
  documents: { id: number; type: string; file_path: string; uploaded_at: string }[];
  answers: { answer: string; form_field: { field_name: string } | null }[];
}

interface Props {
  application: Application | null;
  onClose: () => void;
  onGrade: (app: Application) => void;
}

const fmt = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "-";

const fmtDateTime = (d: string | null) =>
  d
    ? new Date(d).toLocaleString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "-";

const GRADEABLE = new Set(["pending", "seleksi"]);

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:      { label: "Proses",      color: "bg-amber-50 text-amber-700 border-amber-200" },
  seleksi:      { label: "Seleksi",     color: "bg-blue-50 text-blue-700 border-blue-200" },
  lulus:        { label: "Lulus",       color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Lulus:        { label: "Lulus",       color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  tidak_lulus:  { label: "Tidak Lulus", color: "bg-red-50 text-red-600 border-red-200" },
  "Tidak Lulus":{ label: "Tidak Lulus", color: "bg-red-50 text-red-600 border-red-200" },
};

const ApplicantDetailModal: React.FC<Props> = ({ application, onClose, onGrade }) => {
  const [detail, setDetail] = useState<FullApplicationData | null>(null);

  useEffect(() => {
    if (!application) { setDetail(null); return; }
    api.get(`/admin/applications/${application.id}`)
      .then((res) => setDetail(res.data))
      .catch(() => setDetail(null));
  }, [application?.id]);

  if (!application) return null;

  const sc = statusConfig[application.status] || statusConfig.pending;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = application.stage_start_date ? new Date(application.stage_start_date) : null;
  const end = application.stage_end_date ? new Date(application.stage_end_date) : null;
  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(0, 0, 0, 0);

  const isTooEarly = start ? today < start : false;
  const isTooLate = end ? today > end : false;
  const isStageActive = !isTooEarly && !isTooLate;

  const canGrade = GRADEABLE.has(application.status) && isStageActive;

  const initials = application.user_name
    .split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const weightedScore = application.stage_scores.reduce(
    (sum, sc) => sum + ((sc.score || 0) * sc.weight) / 100, 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D278D] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900">{application.user_name}</h2>
              <p className="text-xs text-gray-400">{application.job_title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${sc.color}`}>
              {sc.label}
            </span>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Date Alert */}
          {(isTooEarly || isTooLate) && GRADEABLE.has(application.status) && (
            <div className={`p-4 rounded-xl flex gap-3 border ${isTooEarly ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
              <AlertCircle size={20} className="shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-tight">Penilaian Belum Tersedia</p>
                <p className="text-xs font-medium leading-relaxed">
                  {isTooEarly 
                    ? `Tahap "${application.current_stage}" baru akan dimulai pada ${fmt(application.stage_start_date)}.` 
                    : `Masa penilaian untuk tahap "${application.current_stage}" telah berakhir pada ${fmt(application.stage_end_date)}.`}
                </p>
              </div>
            </div>
          )}

          {/* Profile info */}
          <section>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <User size={12} /> Data Pelamar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Mail, label: "Email", value: application.user_email },
                { icon: CreditCard, label: "NIK", value: application.user_nik || "—" },
                { icon: Phone, label: "Telepon", value: application.user_phone || "—" },
                { icon: Calendar, label: "Tanggal Melamar", value: fmt(application.applied_at) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <Icon size={14} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

         
          

          {/* Form answers */}
          {detail?.answers?.length ? (
            <section>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <MessageSquare size={12} /> Jawaban Formulir
              </p>
              <div className="space-y-2">
                {detail.answers.map((ans, i) => (
                  <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                      {ans.form_field?.field_name || `Pertanyaan ${i + 1}`}
                    </p>
                    <p className="text-sm text-gray-700">{ans.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Stage history */}
          {application.stage_history.length > 0 && (
            <section>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Clock size={12} /> Riwayat Seleksi
              </p>
              <div className="relative pl-8 space-y-0">
                <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200" />
                {application.stage_history.map((h, i) => {
                  const isLulus = h.status === "lulus";
                  const isLast = i === application.stage_history.length - 1;
                  return (
                    <div key={i} className={`relative ${!isLast ? "pb-4" : ""}`}>
                      <div className={`absolute -left-[23px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${isLulus ? "bg-emerald-500" : "bg-red-500"}`}>
                        {isLulus
                          ? <CheckCircle2 size={10} className="text-white" />
                          : <XCircle size={10} className="text-white" />
                        }
                      </div>
                      <div className={`p-3 rounded-xl border ${isLulus ? "bg-white border-emerald-100" : "bg-white border-red-100"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-gray-800">{h.stage_name}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isLulus ? "text-emerald-700 bg-emerald-100" : "text-red-600 bg-red-100"}`}>
                            {isLulus ? "Lulus" : "Tidak Lulus"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                          {h.score !== null && <span className="font-semibold text-gray-700">Skor: {h.score}</span>}
                          {h.scored_by && <span>oleh {h.scored_by}</span>}
                          <span className="ml-auto">{fmtDateTime(h.updated_at)}</span>
                        </div>
                        {h.note && (
                          <p className="mt-2 text-xs text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2">
                            "{h.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Weighted score summary */}
              {application.stage_scores.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      {application.stage_scores.map((sc, i) => (
                        <p key={i} className="text-xs text-gray-600">
                          {sc.stage_name} — skor {sc.score ?? "—"} × {sc.weight}% ={" "}
                          <span className="font-bold">{(((sc.score || 0) * sc.weight) / 100).toFixed(1)}</span>
                        </p>
                      ))}
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Nilai Akhir</p>
                      <p className="text-2xl font-extrabold text-amber-700">{weightedScore.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center shrink-0 bg-white">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tahap Aktif</p>
            <p className="text-sm font-bold text-[#0D278D]">
              {application.current_stage || "—"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Tutup
            </button>
            {GRADEABLE.has(application.status) && (
              <div className="relative group/btn">
                <button
                  onClick={() => canGrade && onGrade(application)}
                  disabled={!canGrade}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    canGrade 
                    ? "bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D]" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  <Star size={14} className={canGrade ? "animate-pulse" : ""} />
                  Nilai Pelamar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailModal;
