import React, { useState, useEffect, useCallback } from "react";
import { ShieldOff, Plus, Search, Trash2, X } from "lucide-react";
import { api } from "../../services/api";
import { clearDraft, draftKey, loadDraft, useDraftPersist } from "../../hooks/useModalDraft";

const BLACKLIST_DRAFT_KEY = draftKey("blacklist-add");

interface BlacklistedNik {
  id: number;
  nik: string;
  name: string | null;
  reason: string | null;
  blacklisted_by: { name: string } | null;
  created_at: string;
}

const Blacklist: React.FC = () => {
  const [items, setItems] = useState<BlacklistedNik[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useDraftPersist(BLACKLIST_DRAFT_KEY, { nik, name, reason }, modalOpen);

  useEffect(() => {
    if (!modalOpen) return;
    const draft = loadDraft<{ nik: string; name: string; reason: string }>(BLACKLIST_DRAFT_KEY);
    if (draft) {
      setNik(draft.nik);
      setName(draft.name);
      setReason(draft.reason);
    }
  }, [modalOpen]);

  const closeModal = () => setModalOpen(false);

  const cancelModal = () => {
    clearDraft(BLACKLIST_DRAFT_KEY);
    setNik("");
    setName("");
    setReason("");
    setModalOpen(false);
  };

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/blacklist", {
        params: { search: search || undefined },
      });
      setItems(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching blacklist:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchItems, 300);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{16}$/.test(nik)) {
      setError("NIK harus terdiri dari 16 digit angka");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/admin/blacklist", { nik, name: name || undefined, reason: reason || undefined });
      clearDraft(BLACKLIST_DRAFT_KEY);
      setModalOpen(false);
      setNik("");
      setName("");
      setReason("");
      fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menambahkan NIK ke daftar blokir");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm("Keluarkan NIK ini dari daftar blokir?")) return;
    try {
      await api.delete(`/admin/blacklist/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Error removing from blacklist:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blokir NIK</h1>
          <p className="text-gray-500 text-sm mt-1">
            NIK yang diblokir tidak dapat digunakan untuk mendaftar atau login, meskipun dengan email berbeda.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0D278D] text-white rounded-xl font-semibold text-sm hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-sm"
        >
          <Plus size={18} />
          Blokir NIK
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari NIK atau nama..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0D278D] transition-colors"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D278D] mx-auto" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
          <ShieldOff size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">Belum ada NIK yang diblokir</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">NIK</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nama</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Alasan</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Diblokir Oleh</th>
                  <th className="text-center px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30">
                    <td className="px-5 py-3 font-mono text-sm text-gray-800">{item.nik}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{item.reason || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{item.blacklisted_by?.name || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all mx-auto"
                        title="Keluarkan dari daftar blokir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">Blokir NIK</h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">{error}</div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">NIK</label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  placeholder="16 digit NIK"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#0D278D] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama (opsional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama pemilik NIK"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#0D278D] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Alasan (opsional)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Contoh: Terbukti memalsukan dokumen"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none focus:border-[#0D278D] resize-none transition-all"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={cancelModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Blokir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blacklist;
