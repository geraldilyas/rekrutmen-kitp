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
  Calendar
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const fadeUpVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export const BerandaLogin: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Layout View Switcher States
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
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100/70 select-none">Akan Datang</span>;
    }
    if (status === "sudah_tutup") {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-100/70 select-none">Sudah Tutup</span>;
    }
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/70 select-none">Sedang Dibuka</span>;
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

  const getFilterSummaryText = () => {
    return (
      <p className="text-xs sm:text-sm text-[#0D278D]/80 font-medium tracking-wide text-center w-full select-none">
        Menampilkan formasi lowongan pilihan terintegrasi Balai Wilayah Sungai
      </p>
    );
  };

  return (
    <div className="bg-white min-h-screen pt-20 overflow-x-hidden font-['Poppins']">

      {/* --- HERO SECTION --- */}
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
            <span className="inline-block px-4 sm:px-5 py-2 rounded-full bg-white/10 border border-white/20 text-[#FEB700] font-bold text-[10px] sm:text-xs mb-6 shadow-[0_0_20px_rgba(254,183,0,0.15)] backdrop-blur-md uppercase tracking-widest max-w-full truncate sm:whitespace-normal">
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

      {/* ===================================================================
          👑 SECTION LOWONGAN UTAMA (MIGRASI PREMIUM DUAL-VIEW LAYOUT)
          =================================================================== */}
      <motion.section
        id="lowongan"
        className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Row Header & Layout Switcher Button */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] mb-2">Lowongan Pilihan</h2>
            <p className="text-gray-500 text-sm md:text-base">Temukan posisi yang sesuai dengan keahlian dan kompetensi Anda</p>
          </div>
          
          <div className="flex items-center gap-4 self-end w-full md:w-auto justify-end" onClick={(e) => e.stopPropagation()}>
            {/* TOGGLE VIEW BULAT WITH SPINNING ANIMATION */}
            <button 
              type="button"
              onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-[#0D278D] shadow-sm hover:text-[#FEB700] hover:shadow transition-all cursor-pointer outline-none shrink-0"
              title={viewMode === "grid" ? "Ubah ke Tampilan Tabel" : "Ubah ke Tampilan Grid"}
            >
              <motion.div
                animate={{ rotate: viewMode === "grid" ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex items-center justify-center"
              >
                {viewMode === "grid" ? <TableProperties size={18} /> : <LayoutGrid size={18} />}
              </motion.div>
            </button>

            <button type="button" onClick={() => navigate("/lowongan")} className="text-[#0D278D] font-bold flex items-center gap-1 hover:text-[#FEB700] transition-colors group cursor-pointer text-sm md:text-base whitespace-nowrap">
              <span>Lihat Semua Posisi</span>
              <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* --- DECK CONDITIONAL VIEWS MAIN LAYER --- */}
        <div className="w-full">
          {loading ? (
            <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mx-auto" /></div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20"><p className="text-gray-500">Belum ada lowongan aktif saat ini.</p></div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                /* ==========================================
                   📦 OPTION A: GRID VIEW 
                   ========================================== */
                <motion.div 
                  key="grid-layout"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 15 }}
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
                            ? "opacity-60 bg-gray-50/30 border-gray-200" 
                            : isComingSoon 
                            ? "opacity-95 border-amber-200 hover:border-amber-400 hover:shadow-[0_20px_50px_-20px_rgba(245,158,11,0.25)]" 
                            : "border-gray-100 hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(254,183,0,0.3)]"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-6 gap-2">
                            {renderStatusBadge(status)}
                            <div className={`flex items-center gap-1.5 text-xs font-medium shrink-0 ${isComingSoon ? "text-amber-500" : isClosed ? "text-red-400" : "text-gray-400"}`}>
                              <Clock size={14} />
                              <span>{formatDeadline(job.deadline, job.start_date)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Briefcase size={16} className={isClosed ? "text-gray-400" : isComingSoon ? "text-amber-500" : job.category === "konsultan_individu" ? "text-[#FEB700]" : "text-[#0D278D]"} />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{getCategoryDisplay(job.category)}</span>
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
                            onClick={() => handleActionPendaftaran(job)} 
                            disabled={isClosed}
                            className={`group px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm flex items-center shrink-0 border gap-1.5 cursor-pointer ${
                              isClosed 
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none" 
                                : isComingSoon 
                                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" 
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
                   📦 OPTION B: MODERN DASHBOARD FLEX-ROW LAYOUT 
                   =================================================================== */
                <motion.div 
                  key="table-layout"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full space-y-4"
                >
                  <div className="hidden lg:flex items-center justify-between px-8 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100 select-none">
                    <div className="w-[30%] text-left">Formasi Lowongan</div>
                    <div className="w-[20%] text-left">Jenis Kategori</div>
                    <div className="w-[22%] text-left">Periode Pendaftaran</div>
                    <div className="w-[15%] text-left">Kualifikasi</div>
                    <div className="w-[13%] text-center">Status</div>
                    <div className="w-[190px]" />
                  </div>
          
                  {jobs.map((job) => {
                    const status = getStatusJob(job.start_date, job.deadline);
                    const isComingSoon = status === "akan_dibuka";
                    const isClosed = status === "sudah_tutup";
          
                    return (
                      <motion.div
                        key={job.id}
                        variants={itemVariants}
                        whileHover={
                          isClosed 
                            ? { x: 4, borderLeftColor: "#9CA3AF" } 
                            : isComingSoon 
                            ? { x: 6, borderLeftColor: "#F59E0B" } 
                            : { x: 6, borderLeftColor: "#FEB700" }
                        }
                        className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 lg:p-6 px-6 lg:px-8 bg-white rounded-2xl border-l-[4px] border border-gray-100 transition-all duration-300 group ${
                          isClosed 
                            ? "opacity-60 bg-gray-50/40 border-l-gray-300 hover:shadow-md" 
                            : isComingSoon 
                            ? "border-l-amber-400 shadow-sm hover:shadow-[0_15px_35px_-10px_rgba(245,158,11,0.12)]" 
                            : "border-l-[#0D278D] shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_15px_35px_-10px_rgba(13,39,141,0.08)]"
                        }`}
                      >
                        <div className="w-full lg:w-[30%] min-w-0">
                          <h4 className={`text-base font-bold tracking-tight transition-colors duration-200 ${isClosed ? "text-gray-400 line-through group-hover:text-gray-600" : "text-[#0D278D]"}`}>
                            {job.title}
                          </h4>
                          <span className="block text-[10px] text-gray-400 font-medium mt-1 lg:hidden">
                            {getCategoryDisplay(job.category)}
                          </span>
                        </div>
          
                        <div className="hidden lg:block w-[20%] text-sm font-semibold text-gray-500">
                          {getCategoryDisplay(job.category)}
                        </div>
          
                        <div className="w-full lg:w-[22%] flex items-center gap-2 text-xs text-gray-500 font-medium">
                          <Calendar size={13} className="text-gray-400 shrink-0" />
                          <span>{formatDeadline(job.deadline, job.start_date)}</span>
                        </div>
          
                        <div className="w-full lg:w-[15%] flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
                          <GraduationCap size={15} className="text-gray-400 shrink-0 lg:hidden" />
                          <span className="bg-gray-50 lg:bg-transparent border border-gray-100 lg:border-0 px-2.5 lg:px-0 py-1 lg:py-0 rounded-lg max-w-full truncate">
                            {job.qualification}
                          </span>
                        </div>
          
                        <div className="w-full lg:w-[13%] flex lg:justify-center items-center">
                          {renderStatusBadge(status)}
                        </div>
          
                        <div className="w-full lg:w-[190px] flex lg:justify-end items-center">
                          <button 
                            onClick={() => handleActionPendaftaran(job)}
                            disabled={isClosed}
                            className={`group px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm flex items-center justify-center border cursor-pointer outline-none select-none min-w-[145px] ${
                              isClosed 
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none hover:bg-gray-200" 
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
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.section>

      {/* --- FILTER SUMMARY INNER ROW --- */}
      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="mb-12 flex justify-center items-center w-full relative z-20">
        {getFilterSummaryText()}
      </motion.div>

      {/* --- TAHAPAN SELEKSI SYSTEM --- */}
      <section id="tahapan" className="py-24 bg-white relative overflow-hidden border-y border-gray-100 font-['Poppins']">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-40 -right-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#0D278D] bg-blue-50 px-3.5 py-1.5 rounded-xl mb-3.5 inline-block select-none border border-blue-100/50">
              Alur Rekrutmen BBWSMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D278D] mb-4 tracking-tight">
              Tahapan Seleksi Resmi
            </h2>
            <div className="w-12 h-[3px] bg-gradient-to-r from-[#0D278D] to-[#3B82F6] rounded-full mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Proses rekrutmen dilaksanakan secara transparan, akuntabel, and bebas biaya melalui sistem penyeleksian berkas digital terintegrasi.
            </p>
          </div>

          <div className="relative w-full px-4 md:px-10">
            {/* Desktop Line */}
            <div className="hidden lg:block absolute inset-x-[10%] top-14 h-[5px] z-0 pointer-events-none">
              <motion.div 
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
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

            {/* Mobile Line */}
            <div className="block lg:hidden absolute top-6 bottom-6 left-10 md:left-12 w-[4px] z-0 pointer-events-none">
              <motion.div
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
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

            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-y-12 lg:gap-x-4 relative z-10 w-full">
              {tahapanSeleksi
                .filter((step) => step.title !== "Pengumuman Administrasi")
                .map((step, index) => {
                  return (
                    <div key={step.id} className="w-full relative">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.85, y: 20 }} 
                        whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                        viewport={{ once: true, margin: "-40px" }} 
                        transition={{ duration: 0.5, delay: index * 0.12 + 0.4, type: "spring", stiffness: 120, damping: 14 }}
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
                            {index + 1}
                          </div>
                        </div>

                        <div className="text-left lg:text-center pl-6 lg:pl-0 lg:mt-5 flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-[#0D278D] group-hover:text-[#FEB700] transition-colors duration-200 leading-tight tracking-tight truncate max-w-full">
                            {step.title}
                          </h3>
                          <div className="w-4 h-[2px] bg-gradient-to-r from-[#0D278D] to-[#3B82F6] rounded-full mt-2 lg:mx-auto transition-all duration-300 group-hover:w-10 opacity-0 group-hover:opacity-100" />
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-16 md:py-24 px-4 relative">
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
      </section>

    </div>
  );
};

export default BerandaLogin;