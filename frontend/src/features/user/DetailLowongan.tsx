import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CalendarClock,
  CheckCircle2,
  GraduationCap,
  UserPlus,
  Banknote,
  ClipboardList,
  Info,
  Briefcase,
  FileText,
  Send,
  AlertCircle,
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
  required_documents?: string[] | string; 
}

const DetailLowongan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Application & Form State
  const isLoggedIn = !!localStorage.getItem("token");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");
  
  // DRIVER EXPAND: Mengontrol perluasan form di bawah halaman
  const [showApplyForm, setShowApplyForm] = useState(false); 
  
  // 🚀 FIX TIPE DATA: Mengubah File ke string kosong "" untuk menampung tautan URL Google Drive
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
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
      const jobData = results[0].data.data;
      setJob(jobData);

      // Inisialisasi list tipe dokumen dinamis berdasarkan setelan Admin
      const docRequirements = jobData.required_documents 
        ? (typeof jobData.required_documents === 'string' ? JSON.parse(jobData.required_documents) : jobData.required_documents)
        : ["KTP", "CV / Daftar Riwayat Hidup", "Ijazah Terakhir", "Transkrip Nilai"];
      
      const initialFilesState: any = {};
      docRequirements.forEach((docType: string) => {
        // 🚀 FIX INITIAL: Setel nilai awal murni ke string kosong ""
        initialFilesState[docType] = "";
      });
      setUploadedFiles(initialFilesState);

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

  // 🚀 FIX HANDLER: Mengubah pembacaan File binary menjadi value string URL teks biasa (Bebas dari Warning Kuning)
  const handleLinkChange = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles({
      ...uploadedFiles,
      [docType]: e.target.value
    });
  };

  // 🚀 SUBMIT DATA DENGAN TRACKER ERROR DETAIL LARAVEL
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // Validasi internal frontend
    const missingDocs = Object.keys(uploadedFiles).filter(key => !uploadedFiles[key].trim());
    if (missingDocs.length > 0) {
      setApplyError(`Harap isi tautan Drive untuk berkas: ${missingDocs.join(", ")}`);
      return;
    }

   try {
      setApplyLoading(true);
      setApplyError("");

      // Ubah wujudnya jadi Array Murni
      const formattedDocumentsArray = Object.keys(uploadedFiles).map((docType) => ({
        type: docType,
        file_path: uploadedFiles[docType]
      }));

      // Kirim format JSON murni
      await api.post("/applications", {
        job_id: Number(id),
        documents: formattedDocumentsArray 
      });

      setApplySuccess(true);
      setAlreadyApplied(true);
      setShowApplyForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      const validationErrors = err?.response?.data?.errors;

      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join(", ");
        setApplyError(errorMessages);
      } else {
        setApplyError(serverMessage || "Gagal mengirim berkas lamaran.");
      }
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

  const isClosed = job?.deadline ? new Date() > new Date(job.deadline) : false;

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

      {/* --- HERO BANNER SECTION --- */}
      <div className="bg-[#0D278D] pt-32 pb-24 relative rounded-b-[2.5rem] md:rounded-b-[4rem] z-10">
        <div className="absolute inset-0 opacity-13 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FEB700]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <button
              onClick={() => navigate("/lowongan")}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-medium mb-10 group"
            >
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
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

      {/* --- MAIN CONTENT & SIDEBAR SECTION --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Info Details Left Column */}
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
                  Persyaratan Jabatan
                </h2>
                <div
                  className="text-gray-600 leading-[1.7] text-[15px] md:text-[16px]"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </section>
            )}
          </motion.div>

          {/* Action Sidebar Right Column */}
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
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Batas Waktu</p>
                    <p className="font-semibold text-gray-800 text-[15px]">
                      {new Date(job.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                    <UserPlus size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Unit Kerja</p>
                    <p className="font-semibold text-gray-800 text-[15px]">{job.unit_kerja || "BBWS Mesuji Sekampung"}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                    <Banknote size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Durasi</p>
                    <p className="font-semibold text-gray-800 text-[15px]">{job.duration || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Status Sesi Feedback Atas */}
              <AnimatePresence mode="wait">
                {applySuccess ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-green-50 border border-green-100 flex gap-3 mb-4">
                    <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-green-800 text-sm">Lamaran terkirim!</p>
                      <button onClick={() => navigate("/status")} className="text-[#0D278D] text-xs font-bold hover:underline mt-1">
                        Lihat Status Lamaran →
                      </button>
                    </div>
                  </motion.div>
                ) : alreadyApplied ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 mb-4">
                    <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-800 text-sm">Anda sudah melamar</p>
                      <button onClick={() => navigate("/status")} className="text-[#0D278D] text-xs font-bold hover:underline mt-1">
                        Cek Status →
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="flex gap-3 mb-6 text-gray-500">
                <Info size={18} className="shrink-0 mt-0.5 text-gray-400" />
                <p className="text-[13px] leading-relaxed">
                  Gunakan form pendaftaran di bawah untuk mengunggah dokumen digital pendaftaran Anda.
                </p>
              </div>

              {/* Conditional Action Button Group */}
              {!isLoggedIn ? (
                <button onClick={() => navigate("/login")} className="w-full bg-white text-[#0D278D] border-2 border-[#0D278D] py-4 rounded-full font-bold text-[15px] hover:bg-[#0D278D] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
                  Masuk untuk Melamar
                </button>
              ) : isClosed ? (
                <button disabled className="w-full bg-gray-100 text-gray-400 border-2 border-gray-200 py-4 rounded-full font-bold text-[15px] cursor-not-allowed flex items-center justify-center gap-2">
                  Pendaftaran Ditutup
                </button>
              ) : alreadyApplied || applySuccess ? (
                <button disabled className="w-full bg-green-50 text-green-600 border-2 border-green-200 py-4 rounded-full font-bold text-[15px] cursor-not-allowed flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> Sudah Dilamar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyForm(!showApplyForm);
                    // Otomatis arahkan view monitor ke form bagian bawah setelah diexpand
                    setTimeout(() => {
                      document.getElementById("dynamic-form-section")?.scrollIntoView({ behavior: "smooth" });
                    }, 150);
                  }}
                  className={`w-full py-4 rounded-full font-bold text-[15px] transition-all flex items-center justify-center gap-2 group cursor-pointer border-2
                    ${showApplyForm 
                      ? "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200" 
                      : "bg-white border-[#0D278D] text-[#0D278D] hover:bg-[#0d278d] hover:text-white shadow-sm"
                    }`}
                >
                  <span>{showApplyForm ? "Sembunyikan Form" : "Lamar Posisi Ini"}</span>
                  {!showApplyForm && <Send size={16} className="transform group-hover:translate-x-1 transition-transform" />}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* ============================================================================
          🚀 DYNAMIC FORM EXPANSION - EDITORIAL STYLE DYNAMIC DRIVE LINK INPUTS
          ============================================================================ */}
      <AnimatePresence>
        {showApplyForm && (
          <motion.div
            id="dynamic-form-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="relative">
                
                {/* --- EDITORIAL HEADER --- */}
                <div className="text-left mb-12 border-b border-gray-900 pb-6">
                  <h3 className="text-2xl font-extrabold text-[#0D278D] font-['Poppins']">
                    Dokumen Kelengkapan Digital
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide">
                    Silakan masukkan tautan Google Drive untuk masing-masing berkas yang diwajibkan di bawah ini.
                  </p>
                </div>

                {/* --- EDITORIAL INSTRUCTION NOTE --- */}
                <div className="mb-12 p-6 bg-gray-50 border-l-2 border-[#0D278D] flex gap-4 items-start">
                  <div className="w-5 h-5 rounded-full bg-[#0D278D] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Info size={12} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#0D278D] uppercase tracking-wider block">Petunjuk Akses Berbagi</span>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      Unggah berkas Anda ke Google Drive per item, kemudian salin tautannya masing-masing. Pastikan status berbagi berkas telah diatur ke <span className="text-amber-600 font-bold">"Siapa saja yang memiliki link (Anyone with the link)"</span> sebagai <span className="font-bold">Pelihat (Viewer)</span> agar panitia seleksi BBWSMS dapat melakukan verifikasi.
                    </p>
                  </div>
                </div>

                {/* Internal Form Error Feedback */}
                {applyError && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-8 p-4 bg-red-50 border-l-2 border-red-500 rounded-lg text-red-600 text-xs flex gap-2 font-medium">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{applyError}</span>
                  </motion.div>
                )}

                {/* --- EDITORIAL FORM SYSTEM (DYNAMICS ROW LAYOUT) --- */}
                {/* --- SYSTEM FORM: MURNI INPUT TEKS URL DRIVE DINAMIS --- */}
                <form onSubmit={handleSubmitApplication} className="space-y-8">
                  <div className="space-y-8">
                    {Object.keys(uploadedFiles).map((docType, index) => {
                      return (
                        <div 
                          key={docType} 
                          className="group/row flex flex-col md:flex-row md:items-start border-b border-gray-100 pb-6 gap-2 md:gap-6 transition-colors duration-300 hover:border-gray-300"
                        >
                          {/* Label Tipe Berkas (Sisi Kiri) */}
                          <div className="w-full md:w-1/3 pt-3">
                            <label className="text-xs font-bold text-[#0D278D] uppercase flex items-center gap-1.5">
                              <span className="text-[#0D278D] font-mono text-[11px] font-normal">0{index + 1}.</span>
                              {docType} <span className="text-red-500/80">*</span>
                            </label>
                          </div>

                          {/* Input Kolom Tautan Teks Drive (Sisi Kanan) */}
                          <div className="w-full md:w-2/3 relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-gray-300 group-focus-within/row:text-[#0D278D] transition-colors pointer-events-none">
                              <FileText size={16} strokeWidth={2} />
                            </span>
                            <input
                              type="url"
                              name={`drive_link_${docType}`}
                              placeholder="Salin tautan Google Drive dokumen di sini"
                              value={uploadedFiles[docType] || ""}
                              onChange={(e) => handleLinkChange(docType, e)}
                              className="w-full bg-transparent border-b-2 border-gray-200 text-xs md:text-sm font-medium pl-8 pr-2 py-3 outline-none transition-all duration-300 focus:border-[#0D278D] text-gray-800 placeholder-gray-300"
                              required
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tombol Kontrol Bawah Form (Gaya Border-Only UI Sinkron) */}
                  <div className="pt-8 flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    <button
                      type="button"
                      disabled={applyLoading}
                      onClick={() => setShowApplyForm(false)}
                      className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-500 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      Batalkan
                    </button>
                    
                    <button
                      type="submit"
                      disabled={applyLoading}
                      className="px-5 py-2.5 rounded-xl border border-[#0D278D] text-[#0D278D] text-xs font-bold uppercase tracking-wider hover:bg-[#0D278D] hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {applyLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#0D278D]/30 border-t-[#0D278D] rounded-full animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <Send size={12} />
                          <span>Kirim Lamaran Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DetailLowongan;