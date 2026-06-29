import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  MonitorUp,
  FileCheck,
  Brain,
  Award,
  GraduationCap,
  Clock,
  Briefcase,
  ArrowRight,
  MessageCircle,
  Users,
  Megaphone,
  LayoutGrid,
  TableProperties,
  Calendar,
  RotateCw,
  Sparkles
} from "lucide-react";
import { api } from "../../services/api";

interface Job {
  id: number;
  title: string;
  category: string;
  description: string;
  qualification: string;
  start_date: string;
  deadline: string;
}

const tahapanSeleksi = [
  { id: 1, title: "Registrasi Online", icon: MonitorUp },
  { id: 2, title: "Seleksi Administrasi", icon: FileCheck },
  { id: 3, title: "Pengumuman Administrasi", icon: Megaphone },
  { id: 4, title: "Tes Kompetensi", icon: Brain },
  { id: 5, title: "Wawancara", icon: Users },
  { id: 6, title: "Pengumuman Akhir", icon: Award },
];

// 🚀 FIXED: RAGAM VARIAN ANIMASI SCROLL REVEAL UNTUK MAKSIMALISASI VISUAL
const scrollRevealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const }
  }
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      // Memulai kemunculan kartu setelah garis mulai bergerak
      staggerChildren: 0.25, 
      delayChildren: 0.2,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring", // TypeScript sekarang tahu ini murni "spring", bukan string biasa
      stiffness: 100, 
      damping: 15,
      duration: 0.4
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  },
};

export const BerandaLogin: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Default View dikunci di Table View sejak load panel beranda login
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  useEffect(() => {
    fetchLatestJobs();
  }, []);

  const fetchLatestJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setJobs(data.slice(0, 4)); // Mengunci top 4 formasi pilihan database
    } catch (err) {
      console.error("Error fetching latest jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDisplay = (cat: string) => {
    if (cat === "tenaga_pendukung") return "Tenaga Pendukung";
    if (cat === "konsultan_individu") return "Konsultan Individu";
    return cat;
  };

  const getStatusJob = (startDateStr: string, deadlineStr: string) => {
    if (!startDateStr || !deadlineStr) return "sedang_dibuka";
    const now = new Date();
    const start = new Date(startDateStr);
    const deadline = new Date(deadlineStr);
    if (now < start) return "akan_dibuka";
    if (now > deadline) return "sudah_tutup";
    return "sedang_dibuka";
  };

  const renderStatusBadge = (status: string) => {
    if (status === "akan_dibuka") {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200 select-none">Akan Datang</span>;
    }
    if (status === "sudah_tutup") {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#0D278D] text-white border border-[#0D278D] select-none">Sudah Tutup</span>;
    }
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-white text-[#0D278D] border border-[#0D278D] select-none">Sedang Dibuka</span>;
  };

  const formatDeadline = (dateStr: string, startDateStr?: string) => {
    if (!dateStr) return "";
    const deadline = new Date(dateStr);
    const start = startDateStr ? new Date(startDateStr) : null;
    const optionsWithYear: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    const optionsWithoutYear: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };

    if (start && !isNaN(start.getTime())) {
      if (start.getMonth() === deadline.getMonth() && start.getFullYear() === deadline.getFullYear()) {
        return `${start.getDate()} - ${deadline.toLocaleDateString("id-ID", optionsWithYear)}`;
      }
      if (start.getFullYear() === deadline.getFullYear()) {
        return `${start.toLocaleDateString("id-ID", optionsWithoutYear)} - ${deadline.toLocaleDateString("id-ID", optionsWithYear)}`;
      }
      return `${start.toLocaleDateString("id-ID", optionsWithYear)} - ${deadline.toLocaleDateString("id-ID", optionsWithYear)}`;
    }
    return deadline.toLocaleDateString("id-ID", optionsWithYear);
  };

  const handleActionPendaftaran = (job?: Job) => {
    if (job?.id) {
      navigate(`/detail-lowongan/${job.id}`);
    } else {
      navigate("/lowongan");
    }
  };

  return (
    <div className="bg-white min-h-screen pt-20 overflow-x-hidden font-['Poppins']">

      <section className="relative bg-[#0D278D] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#08185A] via-[#0D278D] to-[#0A1E6E] z-0" />
        <div className="absolute top-[-15%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-500/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#FEB700]/15 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 opacity-13 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="inline-block px-4 sm:px-5 py-2 rounded-full bg-white/10 border border-white/20 text-[#FEB700] font-bold text-[10px] sm:text-xs mb-6 shadow-[0_0_20px_rgba(254,183,0,0.15)] backdrop-blur-md uppercase tracking-[0.05em] max-w-full truncate sm:whitespace-normal">
              REKRUTMEN KONSULTAN INDIVIDU & TENAGA PENDUKUNG
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              Membangun Negeri Melalui <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-yellow-200">
                Pengelolaan Sumber Daya Air
              </span>
            </h1>

            <p className="text-blue-100/90 mb-8 text-base md:text-xl leading-relaxed max-w-2xl font-light">
              Bergabunglah bersama Balai Besar Wilayah Sungai Kementerian PUPR.
              Kontribusi nyata untuk pembangunan infrastruktur vital nasional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center px-4 sm:px-0">
              <button
                onClick={() => document.getElementById("lowongan")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative overflow-hidden bg-[#FEB700] text-[#0D278D] px-8 py-3.5 sm:py-4 rounded-2xl font-bold flex items-center cursor-pointer justify-center gap-2 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(254,183,0,0.5)] w-full sm:w-auto"
              >
                <span>Lihat Lowongan Aktif</span>
                <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => document.getElementById("tahapan")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-white/5 border border-white/20 text-white px-8 py-3.5 sm:py-4 rounded-2xl font-bold hover:bg-white/10 hover:border-white/30 cursor-pointer transition-all duration-300 backdrop-blur-sm shadow-lg w-full sm:w-auto"
              >
                Panduan Pendaftaran
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section
        id="lowongan"
        className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
        variants={scrollRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        {/* Row Header & Layout Switcher Button */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] mb-2">Lowongan Pilihan</h2>
            <p className="text-gray-500 text-sm md:text-base">Temukan posisi yang sesuai dengan keahlian dan kompetensi Anda</p>
          </div>
          
          <div className="flex items-center gap-4 self-end w-full md:w-auto justify-end" onClick={(e) => e.stopPropagation()}>
            
            {/* 🔄 RADAR DUAL-LAYER TOGGLE SWITCH WITH 360° SPINNING ARROW */}
            <div className="flex items-center justify-center shrink-0">
              <button 
                type="button"
                onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
                className="w-12 h-12 rounded-full bg-transparent hover:bg-blue-50/40 text-[#0D278D] flex items-center justify-center transition-all duration-300 border-0 outline-none cursor-pointer focus:outline-none relative group select-none"
                title={viewMode === "grid" ? "Ubah ke Tampilan Tabel" : "Ubah ke Tampilan Grid"}
              >
                {/* LAYER 1 (LUAR): Ghost Arrow Ring */}
                <motion.div
                  key={`ring-${viewMode}`}
                  initial={{ rotate: 0, opacity: 0, scale: 0.8 }}
                  animate={{ 
                    rotate: 360, 
                    opacity: [0, 1, 1, 0], 
                    scale: [0.8, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 0.55, 
                    ease: "easeInOut",
                    times: [0, 0.2, 0.8, 1]
                  }}
                  className="absolute inset-0 flex items-center justify-center text-[#0D278D] pointer-events-none"
                >
                  <RotateCw size={40} className="stroke-[1.0]" />
                </motion.div>

                {/* LAYER 2 (DALAM): Icon Utama */}
                <motion.div 
                  animate={{ rotate: viewMode === "grid" ? 0 : 180 }}
                  transition={{ type: "spring", stiffness: 130, damping: 13 }}
                  className="relative z-10 flex items-center justify-center text-[#0D278D] group-hover:scale-105 transition-transform duration-300"
                >
                  <AnimatePresence mode="wait">
                    {viewMode === "grid" ? (
                      <motion.div
                        key="grid-icon"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.12 }}
                      >
                        <LayoutGrid size={18} className="stroke-[2.2]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="table-icon"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.12 }}
                      >
                        <TableProperties size={18} className="stroke-[2.2]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </button>
            </div>

            <button type="button" onClick={() => navigate("/lowongan")} className="text-[#0D278D] font-bold flex items-center gap-1 hover:text-[#FEB700] transition-colors group cursor-pointer text-sm md:text-base whitespace-nowrap">
              <span>Lihat Semua Posisi</span>
              <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* --- DECK CONDITIONAL VIEWS MAIN LAYER --- */}
       <div className="w-full">
          {/* 🚀 KUNCI FIX 1: AnimatePresence dikunci di luar agar transisi loading -> data dapat berjalan */}
          <AnimatePresence mode="wait">
            {loading ? (
              /* 🌊 LAYER A: SEAMLESS GRADIENT RIVER FLOW LOADER (WITH FADE OUT) */
              <motion.div
                key="river-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }} // Fade out halus 0.25 detik saat kelar load
                className="text-center py-24 flex flex-col items-center justify-center select-none"
              >
                {/* Kontainer Utama */}
                <div 
                  className="w-28 h-8 flex items-center justify-center overflow-hidden relative"
                  style={{
                    maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)"
                  }}
                >
                  <svg 
                    className="absolute w-[200%] h-full left-0" 
                    viewBox="0 0 200 40" 
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#0D278D" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>

                    <motion.path
                      d="M 0 20 Q 12.5 8, 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20"
                      fill="none"
                      stroke="url(#riverGradient)"
                      strokeWidth="7" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ x: 0 }}
                      animate={{ x: -100 }} 
                      transition={{
                        duration: 4.5,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    />
                  </svg>
                </div>
              </motion.div>
            ) : jobs.length === 0 ? (
              /* ✨ LAYER B: TAMPILAN DATA KOSONG DENGAN FADE ENTRANCE */
              <motion.div
                key="empty-jobs"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center py-20 bg-gray-50/40 rounded-3xl border border-gray-100 p-8 max-w-4xl mx-auto"
              >
                <Sparkles size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">Belum ada lowongan aktif saat ini.</p>
              </motion.div>
            ) : (
              /* 📦 LAYER C: MAIN DATA CONTAINER CONTAINER (FADE IN MELUNCUR HALUS) */
              <motion.div
                key="jobs-list-content"
                initial={{ opacity: 0, y: 25 }} // Mulai dari transparan dan agak di bawah
                animate={{ opacity: 1, y: 0 }}   // Meluncur naik memudar benderang lembut
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.55, ease: "easeOut" }} // Durasi meluncur premium setengah detik lebih
              >
                {/* 🚀 KUNCI FIX 2: Di sini murni logika switch viewMode tanpa kurungan AnimatePresence ganda */}
                {viewMode === "grid" ? (
                  /* ==========================================
                      📦 MODE 1: GRID VIEW 
                     ========================================== */
                  <motion.div 
                    key="grid-layout"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full"
                  >
                    {jobs.map((job) => {
                      const status = getStatusJob(job.start_date, job.deadline);
                      const isComingSoon = status === "akan_dibuka";
                      const isClosed = status === "sudah_tutup";
                      
                      return (
                        <motion.div 
                          key={job.id} 
                          variants={itemVariants} 
                          whileHover={{ y: -8 }} 
                          className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border bg-white transition-all duration-300 flex flex-col justify-between group ${
                            isClosed 
                              ? "opacity-60 bg-gray-50/30 border-gray-200 hover:border-gray-400 hover:shadow-lg" 
                              : isComingSoon 
                              ? "opacity-95 border-[#FEB700] hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(245,158,11,0.25)]" 
                              : "border-gray-100 hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(254,183,0,0.3)]"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-6 gap-2">
                              {renderStatusBadge(status)}
                              <div className={`flex items-center gap-1.5 text-xs font-semibold shrink-0 ${isComingSoon ? "text-[#FEB700]" : isClosed ? "text-[#0D278D]" : "text-gray-500"}`}>
                                <Clock size={14} />
                                <span>{formatDeadline(job.deadline, job.start_date)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <Briefcase size={16} className={isClosed ? "text-gray-400" : isComingSoon ? "text-[#FEB700]" : job.category === "konsultan_individu" ? "text-[#FEB700]" : "text-[#0D278D]"} />
                              <span className={`text-xs font-semibold uppercase tracking-wider ${
                                isClosed 
                                  ? "text-gray-400" 
                                  : job.category === "konsultan_individu" 
                                  ? "text-[#FEB700]" 
                                  : "text-[#0D278D]"
                              }`}>
                                {getCategoryDisplay(job.category)}
                              </span>
                            </div>
                            <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 transition-colors leading-tight ${isClosed ? "text-gray-400 line-through group-hover:text-gray-600" : "text-[#0D278D] group-hover:text-[#FEB700]"}`}>{job.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 sm:mb-8 line-clamp-3">{job.description}</p>
                          </div>
                          <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-50 gap-2">
                            <div className="flex items-center gap-1 sm:gap-2 overflow-hidden">
                              <GraduationCap size={18} className="text-gray-400 mr-1 shrink-0" />
                              <span className="w-auto px-2.5 sm:px-3 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-[#0D278D] truncate">{job.qualification}</span>
                            </div>
                            
                            <button 
                              onClick={() => navigate(`/detail-lowongan/${job.id}`)}
                              disabled={isClosed}
                              className={`group px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm flex items-center shrink-0 border gap-1.5 cursor-pointer ${
                                isClosed 
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none hover:bg-gray-200" 
                                  : isComingSoon 
                                  ? "bg-[#FEB700] border-[#FEB700] text-white hover:bg-[#FEB700]/80" 
                                  : "bg-transparent border-[#0D278D] text-[#0D278D] hover:bg-[#0D278D] hover:text-white"
                              }`}
                            >
                              <span>{isClosed ? "Ditutup" : isComingSoon ? "Lihat Detail" : "Lamar"}</span>
                              {!isClosed && <ChevronRight size={18} className={`transition-all duration-300 ${isComingSoon ? "opacity-100 ml-1" : "opacity-0 -translate-x-2 w-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:w-4"}`} />}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  /* ===================================================================
                      📦 MODE 2: HIGH-END SLATE EDITORIAL SEAMLESS TABLE (BORDER-FREE SYSTEM)
                     =================================================================== */
                  <div className="w-full relative z-10 overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(13,39,141,0.02)]">
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-separate table-fixed min-w-[1150px]">
                        <thead>
                          <tr className="bg-white text-[#0D278D] text-[11px] font-semibold uppercase tracking-[0.05em] select-none">
                            <th className="py-5 px-8 w-[36%] font-extrabold text-[#0D278D] border-l-[5px] border-l-[#0D278D] text-center">Formasi Lowongan</th>
                            <th className="py-5 px-4 w-[16%] font-extrabold text-center">Jenis Kategori</th>
                            <th className="py-5 px-4 w-[20%] font-extrabold text-center">Periode Pendaftaran</th>
                            <th className="py-5 px-4 w-[15%] font-extrabold text-center">Kualifikasi</th>
                            <th className="py-5 px-4 w-[16%] font-extrabold text-center">Status</th>
                            <th className="py-5 pr-8 pl-2 w-[160px]" />
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-medium">
                          {jobs.map((job) => {
                            const status = getStatusJob(job.start_date, job.deadline);
                            const isComingSoon = status === "akan_dibuka";
                            const isClosed = status === "sudah_tutup";

                            return (
                              <tr 
                                key={job.id}
                                className={`transition-colors duration-200 group even:bg-gray-50/20 ${
                                  isClosed ? "opacity-60 bg-gray-50/10" : "hover:bg-[#0D278D]/[0.015]"
                                }`}
                              >
                                <td className={`py-5 px-8 align-middle border-l-[5px] transition-all duration-300 text-center ${
                                  isClosed ? "border-l-gray-300" : isComingSoon ? "border-l-amber-500" : "border-l-[#0D278D]"
                                }`}>
                                  <div className="max-w-full whitespace-normal break-words flex justify-center w-full">
                                    <h4 className={`text-[14px] font-bold tracking-tight transition-colors duration-200 leading-relaxed text-center ${
                                      isClosed ? "text-gray-400 line-through" : "text-gray-900 group-hover:text-[#0D278D]"
                                    }`}>
                                      {job.title}
                                    </h4>
                                  </div>
                                </td>
                                <td className="py-5 px-4 align-middle text-center">
                                  <span className="text-gray-500 text-xs font-semibold tracking-wide block truncate text-center">
                                    {getCategoryDisplay(job.category)}
                                  </span>
                                </td>
                                <td className="py-5 px-4 align-middle text-center">
                                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-semibold whitespace-nowrap text-center w-full">
                                    <Calendar size={13} className="text-gray-500 shrink-0" />
                                    <span>{formatDeadline(job.deadline, job.start_date)}</span>
                                  </div>
                                </td>
                                <td className="py-5 px-4 align-middle text-center">
                                  <div className="max-w-full whitespace-normal break-words flex justify-center w-full">
                                    <span className="inline-block text-[11px] font-bold text-[#0D278D] bg-blue-50/60 border border-blue-100/40 px-2.5 py-1 rounded-lg leading-normal text-center">
                                      {job.qualification}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-5 px-4 align-middle text-center">
                                  {renderStatusBadge(status)}
                                </td>
                                <td className="py-5 pr-8 pl-2 align-middle text-right w-[160px]">
                                  <div className="flex justify-end items-center w-full">
                                    <button 
                                      onClick={() => navigate(`/detail-lowongan/${job.id}`)}
                                      disabled={isClosed}
                                      className={`group px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm flex items-center justify-center border cursor-pointer outline-none select-none min-w-[135px] ${
                                        isClosed 
                                          ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed shadow-none hover:bg-gray-200" 
                                          : isComingSoon 
                                          ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" 
                                          : "bg-transparent border-[#0D278D] text-[#0D278D] hover:bg-[#0D278D] hover:text-white"
                                      }`}
                                    >
                                      <span className="whitespace-nowrap inline-block text-center">
                                        {isClosed ? "Ditutup" : isComingSoon ? "Lihat Detail" : "Lamar"}
                                      </span>
                                      {!isClosed && (
                                        <ChevronRight 
                                          size={15} 
                                          className={`transition-all duration-300 transform shrink-0 ${
                                            isComingSoon 
                                              ? "opacity-100 ml-1" 
                                              : "opacity-0 -translate-x-2 w-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:w-3.5 group-hover:ml-1"
                                          }`} 
                                        />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>


      <motion.section 
    id="tahapan" 
    className="py-24 bg-white relative overflow-hidden border-y border-gray-100 font-['Poppins']"
    variants={scrollRevealVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-120px" }}
  >
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-40 -right-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
    </div>

    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-[11px] font-bold tracking-[0.05em] uppercase text-[#0D278D] bg-blue-50 px-3.5 py-1.5 rounded-xl mb-3.5 inline-block select-none border border-blue-100/50">
          Alur Rekrutmen BBWSMS
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D278D] mb-4 tracking-tight">
          Tahapan Seleksi Resmi
        </h2>
        <div className="w-12 h-[3px] bg-gradient-to-r from-[#0D278D] to-[#3B82F6] rounded-full mx-auto mb-4" />
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          Proses rekrutmen dilaksanakan secara transparan, akuntabel, dan bebas biaya melalui sistem penyeleksian berkas digital terintegrasi.
        </p>
      </div>

      <div className="relative w-full px-4 md:px-10">
        {/* Desktop Line - Disesuaikan timing-nya agar seirama */}
        <div className="hidden lg:block absolute inset-x-[10%] top-14 h-[5px] z-0 pointer-events-none">
          <motion.div 
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "linear" }} // Menggunakan linear agar sejalan konstan dengan stagger kartu
            className="w-full h-full rounded-full relative overflow-hidden"
          >
            <motion.div
              animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              style={{ backgroundSize: "200% 100%" }}
              className="w-full h-full bg-gradient-to-r from-[#0D278D] via-[#3B82F6] via-[#2563EB] to-[#0D278D] rounded-full"
            />
          </motion.div>
        </div>

        {/* Mobile Line - Disesuaikan timing-nya agar seirama */}
        <div className="block lg:hidden absolute top-6 bottom-6 left-10 md:left-12 w-[4px] z-0 pointer-events-none">
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            whileInView={{ clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.5, ease: "linear" }}
            className="w-full h-full rounded-full relative overflow-hidden"
          >
            <motion.div
              animate={{ backgroundPosition: ["50% 0%", "50% 200%"] }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              style={{ backgroundSize: "100% 200%" }}
              className="w-full h-full bg-gradient-to-b from-[#0D278D] via-[#3B82F6] via-[#2563EB] to-[#0D278D] rounded-full"
            />
          </motion.div>
        </div>

        {/* 2. Tambahkan kontainer variants di bungkus grid ini */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="flex flex-col lg:grid lg:grid-cols-5 gap-y-12 lg:gap-x-4 relative z-10 w-full"
        >
          {tahapanSeleksi
            .filter((step) => step.title !== "Pengumuman Administrasi")
            .map((step) => {
              return (
                <div key={step.id} className="w-full relative">
                  <motion.div 
                    variants={cardVariants} 
                    whileHover={{ y: -8 }}
                    className="flex flex-row lg:flex-col items-center justify-start lg:text-center group p-3 bg-transparent rounded-2xl transition-all duration-300 select-none"
                  >
                    <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-[0_10px_30px_-15px_rgba(13,39,141,0.08)] group-hover:border-[#FEB700] group-hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)] transition-all duration-300 shrink-0">
                      <div className="w-[66px] h-[66px] sm:w-[78px] sm:h-[78px] rounded-full bg-white border border-dashed border-gray-200 flex items-center justify-center group-hover:border-[#FEB700] transition-colors">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-inner bg-[#0D278D] text-white group-hover:bg-[#FEB700] transition-colors duration-300">
                          <step.icon size={20} strokeWidth={2.2} />
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full font-bold text-[11px] flex items-center justify-center border-2 border-white bg-[#0D278D] text-white group-hover:bg-[#FEB700] font-mono shadow-sm transition-all duration-300">
                        {/* Jika ingin nomor berurutan dinamis pasca filter */}
                        {tahapanSeleksi.filter((s) => s.title !== "Pengumuman Administrasi").indexOf(step) + 1}
                      </div>
                    </div>

                    <div className="text-left lg:text-center pl-6 lg:pl-0 lg:mt-5 flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-[#0D278D] group-hover:text-[#FEB700] transition-colors duration-200 leading-tight tracking-tight truncate max-w-full">
                        {step.title}
                      </h3>
                      <div className="w-4 h-[2px] bg-gradient-to-r from-[#0D278D] to-[#3B82F6] rounded-full mt-2 lg:mx-auto transition-all duration-300 group-hover:w-10 opacity-0 group-hover:opacity-100" />
                    </div>
                  </motion.div>
                </div>
              );
            })}
        </motion.div>
      </div>
    </div>
  </motion.section>

      <motion.section 
        className="py-16 md:py-24 px-4 relative"
        variants={scrollRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        <div className="max-w-5xl mx-auto bg-[#0D278D] rounded-[2rem] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-[80px] opacity-20 translate-y-1/3 -translate-x-1/3" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 sm:mb-8"><span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" /><span className="text-white text-xs font-bold tracking-widest uppercase">Pendaftaran Sedang Dibuka</span></div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">Siap Berkontribusi bagi <span className="text-[#3B82F6]">Negeri?</span></h2>
            <p className="text-blue-100/80 text-sm sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto font-light leading-relaxed">Daerah aliran sungai dan bendungan nasional menanti bakti Anda. Daftarkan diri Anda sekarang bersama kementerian PUPR.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
              <button onClick={() => handleActionPendaftaran()} className="group bg-gradient-to-r from-[#0D278D] to-[#3B82F6] text-white px-8 md:px-12 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-all shadow-md"><span>Mulai Pendaftaran</span><ArrowRight size={20} className="transform group-hover:translate-x-1.5 transition-transform" /></button>
              <button className="group bg-white/5 border border-white/10 text-white px-8 md:px-12 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 backdrop-blur-md hover:bg-white/10 transition-all"><MessageCircle size={20} className="text-blue-300 group-hover:-translate-y-1 transition-all" /><span>Hubungi Kami</span></button>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default BerandaLogin;