import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import type { Application, SelectionStage, UpdateStageData } from "../../types";

interface StageUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateStageData) => void;
  application: Application | null;
  stages: SelectionStage[];
}

type Decision = "lulus" | "ditolak" | "diterima";

const StageUpdateModal: React.FC<StageUpdateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  application,
  stages,
}) => {
  const [decision, setDecision] = useState<Decision>("lulus");
  const [note, setNote] = useState("");

  React.useEffect(() => {
    if (isOpen) {
      setDecision("lulus");
      setNote("");
    }
  }, [isOpen]);

  if (!isOpen || !application) return null;

  const currentStageOrder = application.current_stage_order;
  const isLastStage = currentStageOrder >= stages.length;
  const nextStage = stages.find((s) => s.order === currentStageOrder + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: UpdateStageData = {
      application_id: application.id,
      stage_name: application.current_stage || "",
      status: decision,
      note: note.trim() || "",
    };
    onSubmit(data);
    onClose();
  };

  const decisions: {
    value: Decision;
    label: string;
    desc: string;
    icon: React.ElementType;
    activeBg: string;
    activeBorder: string;
  }[] = [
    {
      value: "lulus",
      label: "Lulus",
      desc: isLastStage
        ? "Otomatis diterima (tahap terakhir)"
        : `Lanjut ke: ${nextStage?.name || "Selesai"}`,
      icon: ArrowRight,
      activeBg: "bg-emerald-50",
      activeBorder: "border-emerald-500",
    },
    {
      value: "ditolak",
      label: "Tolak",
      desc: "Berikan alasan penolakan & perbaikan",
      icon: XCircle,
      activeBg: "bg-red-50",
      activeBorder: "border-red-500",
    },
    {
      value: "diterima",
      label: "Terima Langsung",
      desc: "Akhiri proses & beri instruksi",
      icon: CheckCircle2,
      activeBg: "bg-blue-50",
      activeBorder: "border-[#0D278D]",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-50 rounded-t-3xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Update Tahapan</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {application.user_name} — {application.current_stage}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Info Tahap Saat Ini */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-9 h-9 rounded-lg bg-[#0D278D] text-white flex items-center justify-center shrink-0">
              <AlertCircle size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Tahap: {application.current_stage}
              </p>
              <p className="text-xs text-gray-500">
                Tahap ke-{currentStageOrder} dari {stages.length}
                {isLastStage && " (terakhir)"}
              </p>
            </div>
          </div>

          {/* Keputusan */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Keputusan
            </label>
            <div className="space-y-2">
              {decisions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = decision === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDecision(opt.value)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? `${opt.activeBg} ${opt.activeBorder} shadow-sm`
                        : "border-gray-100 text-gray-600 hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? opt.value === "lulus"
                            ? "bg-emerald-500 text-white"
                            : opt.value === "ditolak"
                              ? "bg-red-500 text-white"
                              : "bg-[#0D278D] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold">{opt.label}</p>
                      <p className="text-[11px] opacity-70">{opt.desc}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2
                        size={18}
                        className={
                          opt.value === "lulus"
                            ? "text-emerald-600"
                            : opt.value === "ditolak"
                              ? "text-red-600"
                              : "text-[#0D278D]"
                        }
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Catatan
              {(decision === "ditolak" || decision === "diterima") && (
                <span className="text-red-400 ml-1">*</span>
              )}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder={
                decision === "lulus"
                  ? "Catatan untuk peserta (opsional)..."
                  : decision === "ditolak"
                    ? "Jelaskan alasan penolakan dan apa yang perlu diperbaiki oleh pelamar..."
                    : "Berikan instruksi selanjutnya untuk peserta yang diterima (jadwal, lokasi, kontak)..."
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#0D278D] transition-all resize-none"
              required={decision === "ditolak" || decision === "diterima"}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-lg shadow-blue-900/10"
            >
              Simpan Keputusan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StageUpdateModal;
