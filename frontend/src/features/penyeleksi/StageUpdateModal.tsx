import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import type {
  Application,
  SelectionStage,
  UpdateStageData,
} from "../shared/types";

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
  const [decision, setDecision] = useState<"lulus" | "tidak_lulus">("lulus");
  const [note, setNote] = useState("");
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDecision("lulus");
      setNote("");
      setScore(null);
    }
  }, [isOpen]);

  if (!isOpen || !application) return null;

  const currentStage = stages.find(
    (s) => s.order === application.current_stage_order,
  );
  const bobot = currentStage?.weight || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      application_id: application.id,
      stage_result_id: application.current_stage_result_id!,
      stage_name: application.current_stage || "",
      status: decision,
      note: note.trim() || "",
      score: score,
      scored_by: scorerName,
    });
    onClose();
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
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <div>
            <h2 className="font-bold text-gray-900">Input Penilaian</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {application.user_name} — {application.current_stage}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

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

          {/* Link Tes */}
          {currentStage?.test_link && (
            <a
              href={currentStage.test_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <ExternalLink size={14} />
              Buka Link Tes
            </a>
          )}

          {/* Input Skor (0-100) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Skor (0 - 100)
            </label>
            <input
              type="number"
              value={score ?? ""}
              onChange={(e) => {
                const val =
                  e.target.value === ""
                    ? null
                    : Math.min(100, Math.max(0, Number(e.target.value)));
                setScore(val);
              }}
              min="0"
              max="100"
              placeholder="Masukkan skor 0-100"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#0D278D] transition-all"
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
                    onClick={() => setDecision(opt.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${isSelected ? opt.activeBg + " " + opt.activeBorder + " shadow-sm" : "border-gray-100 text-gray-500 hover:border-gray-200"}`}
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

          {/* Catatan */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Catatan <span className="text-red-400">*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              required
              placeholder={
                decision === "lulus"
                  ? "Berikan catatan untuk peserta..."
                  : "Jelaskan alasan dan yang perlu diperbaiki..."
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#0D278D] resize-none"
            />
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
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-sm"
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
