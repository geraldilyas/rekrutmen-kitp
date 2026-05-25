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
  Zap,
} from "lucide-react";
import { api } from "../../services/api";
import { useUserDocuments } from "../shared/profileHooks";

interface JobDetail {
  id: number;
  title: string;
  category: string;
  description: string;
  qualification: string;
  requirements: string;
  duration: string;
  location: string;
  unit_kerja: string;
  recruiter_name: string;
  start_date: string;
  deadline: string;
  required_documents: string[] | string;
}

const DetailLowongan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { documents: masterDocs } = useUserDocuments();

  // Application & Form State
  const isLoggedIn = !!localStorage.getItem("token");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);
  
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

  const handleLinkChange = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles({
      ...uploadedFiles,
      [docType]: e.target.value
    });
  };

  const useMasterDoc = (docType: string) => {
    // Attempt to find master doc that matches type (case insensitive partially)
    const typeLower = docType.toLowerCase();
    const found = masterDocs.find(d => 
      typeLower.includes(d.type.toLowerCase()) || 
      d.type.toLowerCase().includes(typeLower)
    );

    if (found) {
      setUploadedFiles({
        ...uploadedFiles,
        [docType]: found.file_path
      });
    }
  };

  // 🚀 SUBMIT DATA MURNI JSON KE BACKEND LARAVEL
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // Validasi: Pastikan semua kolom input link drive dinamis sudah terisi teks
    const missingDocs = Object.keys(uploadedFiles).filter(key => !uploadedFiles[key].trim());
    if (missingDocs.length > 0) {
      setApplyError(`Harap isi tautan Drive untuk berkas: ${missingDocs.join(", ")}`);
      return;
    }

    try {
      setApplyLoading(true);
      setApplyError("");

      // 🚀 FORMAT SINKRON: Bungkus data kembali ke format Objek ber-Key nama Dokumen
      const formattedDocumentsObj: { [key: string]: { type: string; file__path: string } } = {};
      
      Object.keys(uploadedFiles).forEach((docType) => {
        formattedDocumentsObj[docType] = {
          type: docType,                         // Mengisi field .type
          file__path: uploadedFiles[docType]     // 🚀 SINKRONISASI EMAS: Menggunakan 'file__path' (Double Underscore)
        };
      });

      // Kirim objek terstruktur yang dinanti oleh Laravel lo
      await api.post("/applications", {
        job_id: Number(id),
        documents: formattedDocumentsObj 
      });

      setApplySuccess(true);
      setAlreadyApplied(true);
      setShowApplyForm(false);
      
      // Scroll smooth kembali ke atas indikator sukses pendaftaran
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setApplyError(
        err?.response?.data?.message || "Gagal mengirim berkas lamaran. Coba lagi."
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

  const isClosed = job?.deadline && new Date() > new Date(job.deadline);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D278D]"></div>
      </div>
    );
  }

  if (!job) return <div className="min-h-screen pt-32 text-center">Lowongan tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      
      {/* 🚀 NAVBAR & HERO HEADER */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#0D278D] font-bold text-sm mb-10 hover:gap-4 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Judul & Badge Utama */}
            <div className="lg:col-span-8 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2">
                <span className="bg-blue-50 text-[#0D278D] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-100">
                  {getCategoryDisplay(job.category)}
                </span>
                <span className="bg-amber-50 text-[#FEB700] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-amber-100">
                  Rekrutmen Aktif
                </span>
              </motion.div>
              
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black text-[#0D278D] leading-[1.1] tracking-tight">
                {job.title}
              </motion.h1>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center gap-x-8 gap-y-4 text-gray-500 font-bold text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#FEB700]">
                    <MapPin size={18} />
                  </div>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#FEB700]">
                    <Clock size={18} />
                  </div>
                  <span>{job.duration}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#FEB700]">
                    <Briefcase size={18} />
                  </div>
                  <span>{job.unit_kerja}</span>
                </div>
              </motion.div>
            </div>

            {/* Deadline Card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-4">
              <div className="bg-[#0D278D] rounded-[40px] p-8 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <CalendarClock size={20} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Batas Waktu</span>
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tight leading-none">
                      {new Date(job.deadline).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-blue-200 text-xs mt-3 font-bold uppercase tracking-widest">Waktu Indonesia Barat (WIB)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* 🚀 MAIN CONTENT SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Details */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="lg:col-span-8 space-y-16">
            
            {/* Description */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FEB700]/10 flex items-center justify-center text-[#FEB700]">
                  <ClipboardList size={22} />
                </div>
                <h3 className="text-xl font-black text-[#0D278D] uppercase tracking-tight">Deskripsi Pekerjaan</h3>
              </div>
              <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed font-medium">
                {job.description}
              </div>
            </section>

            {/* Qualifications */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FEB700]/10 flex items-center justify-center text-[#FEB700]">
                  <GraduationCap size={22} />
                </div>
                <h3 className="text-xl font-black text-[#0D278D] uppercase tracking-tight">Kualifikasi Utama</h3>
              </div>
              <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed font-medium">
                {job.qualification}
              </div>
            </section>

            {/* Requirements List (Rich Cards) */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FEB700]/10 flex items-center justify-center text-[#FEB700]">
                  <UserPlus size={22} />
                </div>
                <h3 className="text-xl font-black text-[#0D278D] uppercase tracking-tight">Persyaratan Umum</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.requirements?.split('\n').filter(r => r.trim()).map((req, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-[24px] bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#0D278D] text-[10px] font-black shrink-0 border border-gray-100 shadow-sm group-hover:bg-[#0D278D] group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <p className="text-[13px] font-bold text-gray-700 leading-relaxed">{req.trim().replace(/^[\d.-]+\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>

          {/* Right Column: Sticky Apply Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-4">
            <div className="sticky top-32 bg-white rounded-[40px] p-8 border border-gray-100 shadow-2xl shadow-gray-200/50">
              <h3 className="text-xl font-black text-[#0D278D] mb-6">Siap Melamar?</h3>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <Banknote size={18} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Honorarium</span>
                  </div>
                  <span className="text-sm font-black text-[#0D278D]">Sesuai SBU</span>
                </div>
              </div>

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

               {/* --- SYSTEM FORM: MURNI INPUT TEKS URL DRIVE DINAMIS --- */}
                <form onSubmit={handleSubmitApplication} className="space-y-8">
                  <div className="space-y-8">
                    {Object.keys(uploadedFiles).map((docType, index) => {
                      const hasMaster = masterDocs.some(d => 
                        docType.toLowerCase().includes(d.type.toLowerCase()) || 
                        d.type.toLowerCase().includes(docType.toLowerCase())
                      );
                      
                      return (
                        <div 
                          key={docType} 
                          className="group/row flex flex-col md:flex-row md:items-start border-b border-gray-100 pb-6 gap-2 md:gap-6 transition-colors duration-300 hover:border-gray-300"
                        >
                          {/* Label Kolom Kiri */}
                          <div className="w-full md:w-1/3 pt-3">
                            <label className="text-xs font-bold text-[#0D278D] uppercase flex items-center gap-1.5">
                              <span className="text-[#0D278D] font-mono text-[11px] font-normal">0{index + 1}.</span>
                              {docType} <span className="text-red-500/80">*</span>
                            </label>
                            {hasMaster && (
                              <button
                                type="button"
                                onClick={() => useMasterDoc(docType)}
                                className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-2 py-1 rounded-lg transition-all"
                              >
                                <Zap size={10} fill="currentColor" /> Gunakan Master
                              </button>
                            )}
                          </div>

                          {/* Input Kolom Kanan */}
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

                  {/* Form Action Controls */}
                  <div className="pt-8 flex flex-col sm:flex-row justify-end gap-1.5 mt-4">
                    <button
                      type="submit"
                      disabled={applyLoading}
                      className="bg-[#0D278D] text-white px-10 py-4 rounded-full font-black text-sm hover:bg-[#FEB700] hover:text-[#0D278D] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-900/10"
                    >
                      {applyLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                      <span>{applyLoading ? "Mengirim..." : "Kirim Lamaran Sekarang"}</span>
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
