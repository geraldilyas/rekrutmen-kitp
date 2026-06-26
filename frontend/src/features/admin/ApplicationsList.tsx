import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  ChevronRight,
  Users,
  Layers,
  Search,
  Calendar,
  Clock,
  ChevronDown,
  Download,
} from "lucide-react";
import { api } from "../../services/api";
import { useApplications } from "./hooks";
import type { SelectionStage } from "../shared/types";

const fmt = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const getActiveStage = (stages: SelectionStage[]): SelectionStage | null => {
  const now = new Date();
  return (
    stages.find((s) => {
      const start = s.start_date ? new Date(s.start_date) : null;
      const end = s.end_date ? new Date(s.end_date) : null;
      return start && end && now >= start && now <= end;
    }) ?? null
  );
};

const getNextStage = (stages: SelectionStage[], active: SelectionStage | null): SelectionStage | null => {
  if (!active) {
    const now = new Date();
    return (
      stages
        .filter((s) => s.start_date && new Date(s.start_date) > now)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0] ?? null
    );
  }
  return stages.find((s) => (s.order ?? 0) === (active.order ?? 0) + 1) ?? null;
};

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  active: { label: "Berlangsung", dot: "bg-emerald-500", text: "text-emerald-700" },
  coming_soon: { label: "Akan Datang", dot: "bg-amber-500", text: "text-amber-700" },
  finished: { label: "Selesai", dot: "bg-gray-400", text: "text-gray-500" },
};

const ApplicationsList: React.FC = () => {
  const navigate = useNavigate();
  const { allJobs, loading } = useApplications();
  const [search, setSearch] = React.useState("");

  // 🚀 STATE MANAJEMEN POPUP MODAL UPLOAD SK HASEL
  const [skModalOpen, setSkModalOpen] = useState(false);
  const [selectedStageForSk, setSelectedStageForSk] = useState<SelectionStage | null>(null);
  const [skFile, setSkFile] = useState<File | null>(null);
  const [uploadingSk, setUploadingSk] = useState(false);

  const filtered = allJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase()),
  );

  // 🚀 ACTION HANDLER: Kirim berkas PDF SK Kelulusan ke Backend Laravel
  const handleUploadSk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skFile || !selectedStageForSk) return;

    setUploadingSk(true);
    try {
      const formData = new FormData();
      formData.append("sk_file", skFile);

      // Endpoint diarahkan ke ID tahapan seleksi yang aktif
      await api.post(`/admin/stages/${selectedStageForSk.id}/upload-sk`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("SK Kelulusan resmi berhasil diunggah!");
      setSkModalOpen(false);
      setSkFile(null);
      
      // Refresh halaman biar status teks tombol singkron otomatis
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengunggah SK");
    } finally {
      setUploadingSk(false);
    }
  };

  return (
    <div className="space-y-4 font-['Poppins']">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Pendaftar</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pilih lowongan untuk melihat dan menilai pelamar
        </p>
      </div>
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari lowongan..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0D278D]"
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D278D] mx-auto" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => {
            const stages = job.selection_stages || [];
            const activeStage = getActiveStage(stages);
            const nextStage = getNextStage(stages, activeStage);
            const sc = statusConfig[job.status] || statusConfig.finished;

            return (
              <div
                key={job.id}
                onClick={() => navigate(`/admin/applications/${job.id}`)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md hover:border-[#0D278D]/20 cursor-pointer group transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-50 items-center justify-center shrink-0 group-hover:bg-[#0D278D] transition-colors">
                      <Briefcase
                        size={18}
                        className="text-[#0D278D] group-hover:text-white"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-[#0D278D]">
                          {job.title}
                        </p>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-50 ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {job.totalPendaftar} pelamar
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers size={11} />
                          {stages.length} tahap
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {fmt(job.start_date)} — {fmt(job.end_date)}
                        </span>
                      </div>

                      {/* Stage progress info */}
                      {stages.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {activeStage && (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-blue-50 text-[#0D278D] px-2.5 py-1.5 rounded-lg">
                                <Clock size={10} />
                                Sekarang: {activeStage.name}
                                {activeStage.end_date && (
                                  <span className="font-normal text-blue-400">
                                     s/d {fmt(activeStage.end_date)}
                                  </span>
                                )}
                              </span>

                              {/* 🚀 TOMBOL SAKTI: Admin klik ini untuk upload SK Hasil khusus Tahap Ini */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation(); // Mencegah klik tembus masuk ke detail halaman pelamar
                                  setSelectedStageForSk(activeStage);
                                  setSkModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#FEB700] text-[#0D278D] px-2.5 py-1.5 rounded-lg hover:bg-yellow-400 transition-all shadow-sm cursor-pointer border-0 outline-none"
                              >
                                <Download size={11} />
                                <span>{activeStage.sk_path ? "Perbarui SK" : "Unggah SK Hasil"}</span>
                              </button>
                            </div>
                          )}
                          
                          {nextStage && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg">
                              <ChevronDown size={10} />
                              Berikutnya: {nextStage.name}
                              {nextStage.start_date && (
                                <span className="font-normal text-amber-500">
                                   mulai {fmt(nextStage.start_date)}
                                </span>
                              )}
                            </span>
                          )}
                          
                          {!activeStage && !nextStage && job.status === "finished" && (
                            <span className="text-[11px] text-gray-400 font-medium">
                              Seluruh tahap seleksi selesai
                            </span>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-300 group-hover:text-[#0D278D] shrink-0 mt-1"
                  />
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Users size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Belum ada lowongan</p>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================
          👑 POPUP MODAL UPLOAD SK: LAYER POPUP INTERAKTIF KHUSUS ADMIN
          =================================================================== */}
      {skModalOpen && selectedStageForSk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
            onClick={() => !uploadingSk && setSkModalOpen(false)} 
          />
          
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10">
            <h3 className="text-base font-bold text-[#0D278D] mb-1">Unggah SK Kelulusan Resmi</h3>
            <p className="text-xs text-gray-400 mb-4">
              Tahapan: <span className="text-gray-700 font-semibold">{selectedStageForSk.name}</span>
            </p>
            
            <form onSubmit={handleUploadSk} className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100/50 transition-all relative">
                <input 
                  type="file" 
                  accept=".pdf"
                  required
                  disabled={uploadingSk}
                  onChange={(e) => setSkFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <Download size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-xs font-bold text-gray-600 truncate max-w-xs mx-auto">
                  {skFile ? skFile.name : "Pilih atau Seret Berkas SK Kelulusan"}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Hanya format berkas .pdf (Maks. 5MB)</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={uploadingSk}
                  onClick={() => setSkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-all border-0 bg-transparent cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploadingSk || !skFile}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0D278D] text-white hover:bg-[#FEB700] hover:text-[#0D278D] transition-all disabled:opacity-50 cursor-pointer border-0"
                >
                  {uploadingSk ? "Mengunggah..." : "Simpan Berkas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationsList;