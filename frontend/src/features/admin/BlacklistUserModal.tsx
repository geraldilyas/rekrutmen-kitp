import React, { useEffect, useState } from "react";
import { X, ShieldOff, AlertTriangle, CreditCard } from "lucide-react";
import type { User } from "../shared/types";
import { clearDraft, draftKey, loadDraft, useDraftPersist } from "../../hooks/useModalDraft";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void> | void;
  user: User | null;
}

const BlacklistUserModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, user }) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const reasonDraftKey = draftKey("blacklist-user", user?.id ?? null);
  useDraftPersist(reasonDraftKey, { reason }, isOpen && !!user);

  useEffect(() => {
    if (isOpen) {
      const draft = loadDraft<{ reason: string }>(reasonDraftKey);
      setReason(draft?.reason ?? "");
      setErrorMsg("");
      setIsSubmitting(false);
    }
  }, [isOpen, reasonDraftKey]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      await onSubmit(reason.trim());
      clearDraft(reasonDraftKey);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Gagal memblokir user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <ShieldOff size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Blokir NIK</h2>
              <p className="text-sm text-gray-500 mt-0.5">{user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
              {errorMsg}
            </div>
          )}

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              NIK ini tidak akan bisa dipakai untuk login atau mendaftar lagi, walaupun dengan email
              berbeda. Sesi aktif user akan langsung diputus.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <CreditCard size={16} className="text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase">NIK</p>
              <p className="text-sm font-mono font-semibold text-gray-800">{user.nik || "-"}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              Alasan Pemblokiran
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Contoh: Terbukti memalsukan dokumen persyaratan"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#0D278D] resize-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => { clearDraft(reasonDraftKey); onClose(); }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Memblokir..." : "Blokir User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlacklistUserModal;
