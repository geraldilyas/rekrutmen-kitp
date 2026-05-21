import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CalendarClock,
  CheckCircle2,
  UploadCloud,
  GraduationCap,
  UserPlus,
  Banknote,
  ClipboardList,
  Check,
  Info,
  Briefcase,
  FileText,
  Send,
  AlertCircle,
  X,
} from "lucide-react";
import { api } from "../../services/api";

interface JobDetail {
  id: number;
  title: string;
  category: string;
  type: string;
  description: string;
  qualification: string;
  duration: string;
  location: string;
  unit_kerja: string;
  requirements: string;
  deadline: string;
  start_date: string;
  end_date: string;
}

const DetailLowongan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Application state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token && token !== "undefined" && token !== "null");
    if (id) {
      fetchJobDetail(id, token);
    }
  }, [id]);

  const fetchJobDetail = async (jobId: string, token: string | null) => {
    try {
      setLoading(true);
      const promises: Promise<any>[] = [api.get(`/jobs/${jobId}`)];
      if (token) {
        promises.push(api.get("/applications/my"));
      }
      const results = await Promise.all(promises);
      setJob(results[0].data.data);

      if (results[1]) {
        const myApps = Array.isArray(results[1].data)
          ? results[1].data
          : results[1].data.data || [];
        setAlreadyApplied(myApps.some((a: any) => String(a.job_id) === jobId));
      }
    } catch (err) {
      console.error("Error fetching job detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!id) return;
    try {
      setApplyLoading(true);
      setApplyError("");
      await api.post("/applications/", { job_id: Number(id) });
      setApplySuccess(true);
      setShowConfirm(false);
      setAlreadyApplied(true);
    } catch (err: any) {
      setApplyError(
        err?.response?.data?.message || "Gagal mengirim lamaran. Coba lagi."
      );
    } finally {
      setApplyLoading(false);
    }
  };

  const getCategoryDisplay = (cat: string) => {
    if (cat === "tenaga_pendukung") return "Tenaga Pendukung";
    if (cat === "konsultan_individu") return "Konsultan Individu";
    return cat;
  };

  const formatDeadline = (dateStr: string) => {
    if (!dateStr) return "";
    const deadline = new Date(dateStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Sudah ditutup";
    if (diffDays === 0) return "Tutup hari ini";
    return `Tutup dalam ${diffDays} Hari`;
  };

  const isClosed = job?.deadline
    ? new Date() > new Date(job.deadline)
    : false;

  if (loading) {
    return (
      <div className="bg-white min-h-screen font-['Poppins'] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D]"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-white min-h-screen font-['Poppins'] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#0D278D]">Lowongan tidak ditemukan</h2>
        <button
          onClick={() => navigate("/lowongan")}
          className="mt-4 text-[#0D278D] font-bold hover:underline"
        >
          Kembali ke Lowongan
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-['Poppins']">

      {/* --- HERO HEADER --- */}
      <div className="bg-[#0D278D] pt-32 pb-24 relative rounded-b-[2.5rem] md:rounded-b-[4rem] z-10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FEB700]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => navigate("/lowongan")}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-medium mb-10 group"
            >
              <ArrowLeft
                size={18}
                className="transform group-hover:-translate-x-1 transition-transform"
              />
              Kembali ke Lowongan
            </button>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-[#FEB700] text-[#0D278D] text-xs font-bold tracking-widest uppercase shadow-sm">
                {getCategoryDisplay(job.category)}
              </span>
              <span className="px-4 py-1.5 rounded-full border border-blue-300/30 text-blue-100 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Clock size={14} /> {formatDeadline(job.deadline)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-8 max-w-4xl tracking-tight text-white">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-blue-100/80 text-sm font-medium">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#FEB700]" />
                {job.location || "Penempatan BBWS"}
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-[#FEB700]" />
                {job.qualification}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 space-y-16"
          >
            <section>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] mb-6 tracking-tight flex items-center gap-3">
                <Briefcase size={28} className="text-[#FEB700]" />
                Deskripsi Lowongan
              </h2>
              <div
                className="text-gray-600 leading-[1.8] text-[15px] md:text-[17px] text-justify font-normal"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </section>

            {job.requirements && (
              <section>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] mb-8 tracking-tight flex items-center gap-3">
                  <CheckCircle2 size={28} className="text-[#FEB700]" />
                  Persyaratan
                </h2>
                <div
                  className="text-gray-600 leading-[1.7] text-[15px] md:text-[16px]"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </section>
            )}

            <section>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] tracking-tight flex items-center gap-3">
                  <FileText size={28} className="text-[#FEB700]" />
                  Berkas yang Disiapkan
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 text-[11px] font-bold rounded-lg uppercase tracking-wider w-fit">
                  <UploadCloud size={14} /> Format PDF
                </span>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-4 group">
                  <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0D278D] transition-colors">
                    <Check size={14} className="text-[#0D278D] group-hover:text-white" />
                  </div>
                  <span className="text-gray-600 text-[15px] md:text-[16px] leading-[1.7]">
                    Dokumen sesuai yang diminta pada formulir pendaftaran.
                  </span>
                </li>
              </ul>
            </section>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-32 lg:border-l-2 lg:border-gray-100 lg:pl-10 pb-8">
              <h3 className="text-xl font-extrabold text-[#0D278D] flex items-center gap-2 mb-8">
                <ClipboardList size={22} className="text-[#FEB700]" />
                Ringkasan Posisi
              </h3>

              <div className="space-y-8 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                    <CalendarClock size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                      Batas Waktu
                    </p>
                    <p className="font-semibold text-gray-800 text-[15px]">
                      {new Date(job.deadline).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                    <UserPlus size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                      Unit Kerja
                    </p>
                    <p className="font-semibold text-gray-800 text-[15px]">
                      {job.unit_kerja || "BBWS Mesuji Sekampung"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                    <Banknote size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                      Durasi
                    </p>
                    <p className="font-semibold text-gray-800 text-[15px]">
                      {job.duration || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Apply state feedback */}
              <AnimatePresence mode="wait">
                {applySuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-green-50 border border-green-100 flex gap-3 mb-4"
                  >
                    <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-green-800 text-sm">Lamaran terkirim!</p>
                      <button
                        onClick={() => navigate("/status")}
                        className="text-[#0D278D] text-xs font-bold hover:underline mt-1"
                      >
                        Lihat Status Lamaran →
                      </button>
                    </div>
                  </motion.div>
                ) : alreadyApplied ? (
                  <motion.div
                    key="applied"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 mb-4"
                  >
                    <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-800 text-sm">Anda sudah melamar</p>
                      <button
                        onClick={() => navigate("/status")}
                        className="text-[#0D278D] text-xs font-bold hover:underline mt-1"
                      >
                        Cek Status →
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {applyError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs flex gap-2 mb-4">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{applyError}</span>
                </div>
              )}

              <div className="flex gap-3 mb-6 text-gray-500">
                <Info size={18} className="shrink-0 mt-0.5 text-gray-400" />
                <p className="text-[13px] leading-relaxed">
                  Pastikan seluruh data profil akun Anda sudah lengkap dan
                  benar sebelum mengirim lamaran.
                </p>
              </div>

              {!isLoggedIn ? (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-white text-[#0D278D] border-2 border-[#0D278D] py-4 rounded-full font-bold text-[15px] hover:bg-[#0D278D] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Masuk untuk Melamar
                </button>
              ) : isClosed ? (
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 border-2 border-gray-200 py-4 rounded-full font-bold text-[15px] cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Pendaftaran Ditutup
                </button>
              ) : alreadyApplied || applySuccess ? (
                <button
                  disabled
                  className="w-full bg-green-50 text-green-600 border-2 border-green-200 py-4 rounded-full font-bold text-[15px] cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Sudah Dilamar
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full bg-white text-[#0D278D] border-2 border-[#0D278D] py-4 rounded-full font-bold text-[15px] hover:bg-[#0a1e6e] hover:border-[#0a1e6e] hover:text-white hover:shadow-[0_15px_30px_-10px_rgba(13,39,141,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Lamar Posisi Ini
                  <Send
                    size={18}
                    className="transform group-hover:translate-x-1 transition-transform"
                  />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => !applyLoading && setShowConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <button
                onClick={() => !applyLoading && setShowConfirm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>

              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-[#0D278D]" />
              </div>

              <h3 className="text-lg font-extrabold text-[#0D278D] text-center mb-2">
                Konfirmasi Lamaran
              </h3>
              <p className="text-gray-500 text-sm text-center mb-1">
                Anda akan melamar posisi:
              </p>
              <p className="font-bold text-[#0D278D] text-center text-[15px] mb-5">
                {job.title}
              </p>

              <p className="text-xs text-gray-400 text-center mb-6 leading-relaxed">
                Dengan mengirim lamaran, Anda menyatakan bahwa data profil
                yang Anda daftarkan adalah benar dan dapat
                dipertanggungjawabkan.
              </p>

              {applyError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs flex gap-2 mb-4">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{applyError}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => !applyLoading && setShowConfirm(false)}
                  disabled={applyLoading}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleApply}
                  disabled={applyLoading}
                  className="flex-1 py-3 rounded-xl bg-[#0D278D] text-white font-bold text-sm hover:bg-[#0a1e6e] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {applyLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Lamaran"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DetailLowongan;
