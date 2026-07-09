import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Lock,
  MessageSquare,
} from "lucide-react";
import { api } from "../../services/api";
import type {
  Application,
  SelectionStage,
  UpdateStageData,
} from "../shared/types";

const isLikelyUrl = (value: string) => /^https?:\/\/\S+$/i.test(value.trim());

interface AnswerItem {
  form_field_id: number;
  answer: string;
  form_field: { id: number; label: string; field_name?: string } | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateStageData) => void | Promise<void>;
  application: Application | null;
  stages: SelectionStage[];
  scorerName: string;
}

const StageUpdateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  application,
  stages,
  scorerName,
}) => {
  const currentStage = application ? stages.find(
    (s) => s.order === application.current_stage_order
  ) : null;
  const isAdminStage = !!(currentStage && currentStage.name && currentStage.name.trim().toLowerCase() === "seleksi administrasi");
  const bobot = currentStage?.weight || 0;
  const stageDocuments = currentStage?.documents || [];
  const hasDocumentChecklist = isAdminStage && stageDocuments.length > 0;

  const [decision, setDecision] = useState<"lulus" | "tidak_lulus">("lulus");
  const [score, setScore] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [docScores, setDocScores] = useState<Record<number, number>>({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDecision("lulus");
      setScore(hasDocumentChecklist ? 0 : null);
      setDocScores({});
      setSubmitError("");
    }
  }, [isOpen, hasDocumentChecklist]);

  useEffect(() => {
    if (!isOpen || !application) {
      setAnswers([]);
      return;
    }
    api
      .get(`/admin/applications/${application.id}`)
      .then((res) => setAnswers(res.data?.answers || []))
      .catch(() => setAnswers([]));
  }, [isOpen, application?.id]);

  if (!isOpen || !application) return null;

  const setDocScore = (formFieldId: number, value: number) => {
    setDocScores((prev) => {
      const next = { ...prev, [formFieldId]: value };

      if (isAdminStage) {
        const totalDocs = stageDocuments.length;
        const sum = stageDocuments.reduce((s, d) => s + (next[d.form_field_id] ?? 0), 0);
        setScore(totalDocs > 0 ? Math.round(sum / totalDocs) : 0);
      } else {
        const weightedSum = stageDocuments.reduce(
          (s, d) => s + ((next[d.form_field_id] ?? 0) * (Number(d.weight) || 0)) / 100,
          0
        );
        setScore(bobot > 0 ? Math.round((weightedSum / bobot) * 100) : 0);
      }

      return next;
    });
  };

  const now = new Date();
  const stageStart = currentStage?.start_date ? new Date(currentStage.start_date) : null;
  const gradingDeadline = currentStage?.grading_end_date
    ? new Date(currentStage.grading_end_date)
    : currentStage?.end_date
    ? new Date(currentStage.end_date)
    : null;
  const stageNotStarted = stageStart !== null && stageStart > now;
  const stagePassed = !stageNotStarted && gradingDeadline !== null && gradingDeadline < now;
  const gradingLocked = stageNotStarted || stagePassed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gradingLocked) return;
    setSubmitError("");
    try {
      await onSubmit({
        application_id: application.id,
        stage_result_id: application.current_stage_result_id!,
        stage_name: application.current_stage || "",
        status: decision,
        note: "",
        score: score,
        scored_by: scorerName,
      });
      onClose();
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || "Gagal menyimpan penilaian.");
    }
  };

  const decisions = [
    {
      value: "lulus" as const,
      label: "Lulus",
      icon: CheckCircle2,
      activeBg: "bg-emerald-50",
      activeBorder: "border-emerald-500",
    },
    {
      value: "tidak_lulus" as const,
      label: "Tidak Lulus",
      icon: XCircle,
      activeBg: "bg-red-50",
      activeBorder: "border-red-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Input Penilaian</h2>
            <div className="text-base text-gray-500 mt-2">
              <span className="font-extrabold text-gray-900">{application.user_name}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-semibold text-gray-600">{application.user_email}</span>
            </div>
            <p className="text-sm font-bold text-[#0D278D] mt-2">
              Tahap Seleksi: {application.current_stage}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors self-start"
          >
            <X size={22} />
          </button>
        </div>

        {stageNotStarted && (
          <div className="mx-5 mb-4 mt-2 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <Lock size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Tahap Belum Dimulai</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Penilaian untuk tahap <span className="font-semibold">{currentStage?.name}</span> dibuka mulai{" "}
                <span className="font-semibold">
                  {stageStart?.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>.
              </p>
            </div>
          </div>
        )}

        {stagePassed && (
          <div className="mx-5 mb-4 mt-2 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <Lock size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800">Masa Penilaian Sudah Berakhir</p>
              <p className="text-xs text-red-700 mt-0.5">
                Batas waktu penilaian untuk tahap <span className="font-semibold">{currentStage?.name}</span> telah berakhir pada{" "}
                <span className="font-semibold">
                  {gradingDeadline?.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>. Penilaian tidak dapat diubah lagi.
              </p>
            </div>
          </div>
        )}

        {submitError && (
          <div className="mx-5 mb-4 mt-2 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <Lock size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-red-700">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Info Tahap + Bobot */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <AlertCircle size={18} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-800">
                  {application.current_stage}
                </p>
                <p className="text-[10px] text-gray-400">
                  Tahap {application.current_stage_order} dari {stages.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-[#0D278D] font-extrabold text-lg">
                {bobot}%
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Bobot</p>
                <p className="text-[10px] text-gray-400">Nilai x {bobot}%</p>
              </div>
            </div>
          </div>

          {/* Pertanyaan & Jawaban Pelamar (di luar dokumen tahapan ini) */}
          {isAdminStage && (() => {
            const docFieldIds = new Set(stageDocuments.map((d) => d.form_field_id));
            const questionAnswers = answers.filter((a) => !docFieldIds.has(a.form_field_id));
            return questionAnswers.length > 0 ? (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase mb-1.5">
                  <MessageSquare size={13} /> Pertanyaan &amp; Jawaban Pelamar
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {questionAnswers.map((ans, i) => (
                    <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                        {ans.form_field?.label || ans.form_field?.field_name || `Pertanyaan ${i + 1}`}
                      </p>
                      {isLikelyUrl(ans.answer) ? (
                        <a
                          href={ans.answer}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D278D] hover:underline break-all"
                        >
                          <ExternalLink size={13} className="shrink-0" />
                          {ans.answer}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-700 break-words">{ans.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Dokumen tahapan ini — input nilai per item */}
          {hasDocumentChecklist && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                Dokumen Tahapan Ini (isi nilai 0-100 per item)
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {stageDocuments.map((doc) => {
                  const ans = answers.find((a) => a.form_field_id === doc.form_field_id);
                  const itemScore = docScores[doc.form_field_id] ?? 0;
                  return (
                    <div
                      key={doc.form_field_id}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${itemScore > 0 ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-100"}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-gray-700">{doc.label}</p>
                          {isAdminStage ? (
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                              Rata
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-[#0D278D] bg-blue-100 px-1.5 py-0.5 rounded shrink-0">
                              {doc.weight}%
                            </span>
                          )}
                        </div>
                        {ans?.answer ? (
                          isLikelyUrl(ans.answer) ? (
                            <a
                              href={ans.answer}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D278D] hover:underline break-all mt-1"
                            >
                              <ExternalLink size={12} className="shrink-0" />
                              {ans.answer}
                            </a>
                          ) : (
                            <p className="text-xs text-gray-600 break-words mt-1">{ans.answer}</p>
                          )
                        ) : (
                          <p className="text-xs text-gray-400 italic mt-1">Belum diisi pelamar</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={itemScore}
                            disabled={gradingLocked}
                            onChange={(e) =>
                              setDocScore(
                                doc.form_field_id,
                                Math.min(100, Math.max(0, Number(e.target.value) || 0))
                              )
                            }
                            className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white outline-none focus:border-[#0D278D] disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                          <span className="text-[11px] text-gray-400">/ 100</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                {isAdminStage ? (
                  `Skor otomatis dihitung dari rata-rata nilai seluruh item dokumen (${stageDocuments.length} item).`
                ) : (
                  `Skor otomatis dihitung dari nilai tiap dokumen dikali bobotnya terhadap bobot tahapan (${bobot}%).`
                )}
              </p>
            </div>
          )}

          {/* Informasi Untuk Tahapan Selanjutnya */}
          {currentStage?.info && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-[10px] font-bold text-[#0D278D] uppercase tracking-wider mb-1">
                Informasi Untuk Tahapan Selanjutnya
              </p>
              <p className="text-xs text-gray-700 whitespace-pre-line">{currentStage.info}</p>
            </div>
          )}

          {/* Input Skor (0-100) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Skor (0 - 100)
            </label>
            <input
              type="number"
              value={score ?? ""}
              readOnly={hasDocumentChecklist}
              disabled={gradingLocked}
              onChange={(e) => {
                if (hasDocumentChecklist) return;
                const val =
                  e.target.value === ""
                    ? null
                    : Math.min(100, Math.max(0, Number(e.target.value)));
                setScore(val);
              }}
              min="0"
              max="100"
              placeholder={hasDocumentChecklist ? "Isi nilai per item dokumen di atas" : "Masukkan skor 0-100"}
              className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D278D] transition-all ${hasDocumentChecklist || gradingLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-gray-50 focus:bg-white"}`}
            />
            <p className="text-[11px] text-gray-400 mt-1.5">
              Dinilai oleh:{" "}
              <span className="font-semibold text-gray-600">{scorerName}</span>
            </p>
            {score !== null && (
              <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-xs text-amber-700">
                  <span className="font-bold">Nilai setelah bobot:</span>{" "}
                  {score} × {bobot}% ={" "}
                  <span className="font-bold text-amber-800">
                    {((score * bobot) / 100).toFixed(1)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Keputusan */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Keputusan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {decisions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = decision === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={gradingLocked}
                    onClick={() => setDecision(opt.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isSelected ? opt.activeBg + " " + opt.activeBorder + " shadow-sm" : "border-gray-100 text-gray-500 hover:border-gray-200"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? (opt.value === "lulus" ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-gray-100 text-gray-400"}`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-bold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={gradingLocked}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0D278D] disabled:hover:text-white"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StageUpdateModal;
