import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  GraduationCap,
  Clock,
  Briefcase,
  Calendar,
  ChevronDown,
  Layers,
  Activity,
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

// 🚀 ANIMATION VARIANTS FOR LUXURY CUSTOM DROPDOWN FILTER
const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
  },
};

const listMonths = [
  { value: "all", label: "Semua Bulan" },
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

// 🚀 VARIANT ANIMASI FADE-UP UNTUK HEADLINE & FILTER ROW
const fadeUpVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6,},
  },
};

// 🚀 VARIANT STAGGERED UNTUK SECTION LIST CARD LOWONGAN
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 35, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const BerandaUmum: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Advanced Filtering States
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestJobs();
  }, []);

  // 🛠️ MURNI FETCH DATA ASLI BAWAAN LO
  const fetchLatestJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setJobs(data); 
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
    const now = new Date();
    const start = new Date(startDateStr);
    const deadline = new Date(deadlineStr);

    if (now < start) return "akan_dibuka";
    if (now > deadline) return "sudah_tutup";
    return "sedang_dibuka";
  };

  const formatDeadline = (dateStr: string, startDateStr?: string) => {
    if (!dateStr) return "";

    const deadline = new Date(dateStr);
    const start = startDateStr ? new Date(startDateStr) : null;

    const optionsWithYear: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    const optionsWithoutYear: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };

    if (start && !isNaN(start.getTime())) {
      if (start.getMonth() === deadline.getMonth() && start.getFullYear() === deadline.getFullYear()) {
        const startDay = start.getDate();
        const endFormatted = deadline.toLocaleDateString("id-ID", optionsWithYear);
        return `${startDay} - ${endFormatted}`;
      }
      
      if (start.getFullYear() === deadline.getFullYear()) {
        const startFormatted = start.toLocaleDateString("id-ID", optionsWithoutYear);
        const endFormatted = deadline.toLocaleDateString("id-ID", optionsWithYear);
        return `${startFormatted} - ${endFormatted}`;
      }

      const startFormatted = start.toLocaleDateString("id-ID", optionsWithYear);
      const endFormatted = deadline.toLocaleDateString("id-ID", optionsWithYear);
      return `${startFormatted} - ${endFormatted}`;
    }

    return deadline.toLocaleDateString("id-ID", optionsWithYear);
  };

  // Filter Data Gabungan dari DB
  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = filterCategory === "all" || job.category === filterCategory;
    const status = getStatusJob(job.start_date, job.deadline);
    const matchesStatus = filterStatus === "all" || status === filterStatus;
    const jobMonth = job.start_date ? job.start_date.split("-")[1] : "";
    const matchesMonth = filterMonth === "all" || jobMonth === filterMonth;

    return matchesCategory && matchesStatus && matchesMonth;
  });

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="bg-white min-h-screen pt-20 overflow-x-hidden font-['Poppins']" onClick={() => setOpenDropdown(null)}>

      {/* =========================================================
          🚀 1. HERO SECTION (MURNI LANDING PAGE)
          ========================================================= */}
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
            {/* =========================================================
                🚀 KATA-KATA HERO SECTION KHUSUS SEBELUM LOGIN (PERSUASIF & CLEAR)
                ========================================================= */}
            <span className="inline-block px-4 sm:px-5 py-2 rounded-full bg-white/10 border border-white/20 text-[#FEB700] font-bold text-[10px] sm:text-xs mb-6 shadow-[0_0_20px_rgba(254,183,0,0.15)] backdrop-blur-md uppercase tracking-widest max-w-full truncate sm:whitespace-normal">
                Selamat Datang di Portal Rekrutmen Resmi BBWS Mesuji Sekampung
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
               Temukan Peluang Karier Terbaik, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-yellow-200">
                Berkontribusi untuk Negeri
              </span>
            </h1>

            <p className="text-blue-100/90 mb-8 text-base md:text-xl leading-relaxed max-w-4xl font-light">
                Jelajahi berbagai lowongan Konsultan Individu dan Tenaga Pendukung yang tersedia. Temukan posisi yang sesuai dengan kompetensi Anda dan bergabung dalam pembangunan infrastruktur sumber daya air Indonesia.            
                </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center px-4 sm:px-0">
              <button
                onClick={() =>
                  document
                    .getElementById("lowongan-sebelum-login")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group relative overflow-hidden bg-[#FEB700] text-[#0D278D] px-8 py-3.5 sm:py-4 rounded-2xl font-bold flex items-center cursor-pointer justify-center gap-2 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(254,183,0,0.5)] w-full sm:w-auto"
              >
                <span>Lihat Lowongan Kerja</span>
                <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ===================================================================
          🚀 2. DAFTAR LOWONGAN SECTION (ANIMATED LAYOUT LAYER)
          =================================================================== */}
      <section id="lowongan-sebelum-login" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🔥 ANIMATED HEADLINE: Ditambahkan transisi fade-up mewah pas di-scroll */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#FEB700] bg-amber-500/5 px-3.5 py-1.5 rounded-xl mb-3.5 inline-block select-none">
            Lowongan Resmi BBWSMS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0D278D] tracking-tight mb-4">
            Daftar Lowongan Kerja
          </h2>
          <div className="w-15 h-[3.5px] bg-[#FEB700] rounded-full mb-4.5" />
          <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl">
            Transparansi formasi rekrutmen aktif Balai Wilayah Sungai. Pelamar umum dapat meninjau kualifikasi lengkap sebelum melakukan pendaftaran.
          </p>
        </motion.div>

        {/* 🔥 ANIMATED FILTER BAR: Ditambahkan transisi smooth fade-up berbarengan */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-center gap-4 mb-12 pb-6 border-b border-gray-200/60 relative z-30"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-1 w-full" onClick={(e) => e.stopPropagation()}>
            
            {/* --- Custom Dropdown 1: Kategori --- */}
            <div className="relative w-full sm:w-[200px]">
              <button
                onClick={() => toggleDropdown("category")}
                className={`group w-full bg-white text-[#0D278D] font-bold text-xs pl-11 pr-4 py-3.5 rounded-xl border transition-all duration-300 hover:bg-[#0D278D] hover:text-white flex items-center justify-center gap-2 cursor-pointer ${
                  openDropdown === "category" ? "border-[#0D278D] ring-4 ring-blue-50/50" : "border-[#0D278D]/20 hover:border-[#0D278D]"
                }`}
              >
                <Layers size={15} className="absolute left-4 text-[#0D278D] group-hover:text-white transition-colors duration-300" />
                <span className="truncate">
                  {filterCategory === "all" ? "Semua Kategori" : getCategoryDisplay(filterCategory)}
                </span>
                <motion.div animate={{ rotate: openDropdown === "category" ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center">
                  <ChevronDown size={14} className="text-[#0D278D] group-hover:text-white transition-colors duration-300 shrink-0" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openDropdown === "category" && (
                  <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 p-1.5">
                    {[{ id: "all", label: "Semua Kategori" }, { id: "konsultan_individu", label: "Konsultan Individu" }, { id: "tenaga_pendukung", label: "Tenaga Pendukung" }].map((opt) => (
                      <button key={opt.id} onClick={() => { setFilterCategory(opt.id); setOpenDropdown(null); }} className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0D278D] hover:bg-gray-50 hover:text-[#0D278D] block cursor-pointer">
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- Custom Dropdown 2: Status --- */}
            <div className="relative w-full sm:w-[200px]">
              <button
                onClick={() => toggleDropdown("status")}
                className={`group w-full bg-white text-[#0D278D] font-bold text-xs pl-11 pr-4 py-3.5 rounded-xl border transition-all duration-300 hover:bg-[#0D278D] hover:text-white flex items-center justify-center gap-2 cursor-pointer ${
                  openDropdown === "status" ? "border-[#0D278D] ring-4 ring-blue-50/50" : "border-[#0D278D]/20 hover:border-[#0D278D]"
                }`}
              >
                <Activity size={15} className="absolute left-4 text-[#0D278D] group-hover:text-white transition-colors duration-300" />
                <span className="truncate">
                  {filterStatus === "all" ? "Semua Status" : filterStatus === "sedang_dibuka" ? "Sedang Dibuka" : filterStatus === "akan_dibuka" ? "Akan Dibuka" : "Sudah Tutup"}
                </span>
                <motion.div animate={{ rotate: openDropdown === "status" ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center">
                  <ChevronDown size={14} className="text-[#0D278D] group-hover:text-white transition-colors duration-300 shrink-0" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openDropdown === "status" && (
                  <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 p-1.5">
                    {[{ id: "all", label: "Semua Status" }, { id: "sedang_dibuka", label: "Sedang Dibuka" }, { id: "akan_dibuka", label: "Akan Dibuka" }, { id: "sudah_tutup", label: "Sudah Tutup" }].map((opt) => (
                      <button key={opt.id} onClick={() => { setFilterStatus(opt.id); setOpenDropdown(null); }} className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0D278D] hover:bg-gray-50 hover:text-[#0D278D] block cursor-pointer">
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- Custom Dropdown 3: Bulan --- */}
            <div className="relative w-full sm:w-[200px]" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggleDropdown("month")}
                className={`group w-full bg-white text-[#0D278D] font-bold text-xs pl-11 pr-4 py-3.5 rounded-xl border transition-all duration-300 hover:bg-[#0D278D] hover:text-white flex items-center justify-center gap-2 cursor-pointer ${
                  openDropdown === "month" ? "border-[#0D278D] ring-4 ring-blue-50/50" : "border-[#0D278D]/20 hover:border-[#0D278D]/40"
                }`}
              >
                <Calendar size={15} className="absolute left-4 text-[#0D278D] group-hover:text-white transition-colors duration-300" />
                <span className="truncate">
                  {listMonths.find(m => m.value === filterMonth)?.label || "Semua Bulan"}
                </span>
                <motion.div animate={{ rotate: openDropdown === "month" ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex items-center">
                  <ChevronDown size={14} className="text-[#0D278D] group-hover:text-white transition-colors duration-300 shrink-0" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openDropdown === "month" && (
                  <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl max-h-[260px] overflow-y-auto p-1.5 z-50 scrollbar-thin">
                    {listMonths.map((m) => (
                      <button key={m.value} onClick={() => { setFilterMonth(m.value); setOpenDropdown(null); }} className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0D278D] hover:bg-gray-50 hover:text-[#0D278D] block cursor-pointer">
                        {m.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>

        {/* --- GRID CARD LOWONGAN --- */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mx-auto"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Belum ada lowongan aktif yang cocok dengan filter kualifikasi.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {filteredJobs.map((job) => {
              const status = getStatusJob(job.start_date, job.deadline);
              const isComingSoon = status === "akan_dibuka";
              const isClosed = status === "sudah_tutup";
              
              return (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  whileHover={isClosed || isComingSoon ? {} : { y: -8 }}
                  className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 bg-white transition-all duration-300 flex flex-col justify-between ${
                    isClosed ? "opacity-60" : isComingSoon ? "opacity-95" : "hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(254,183,0,0.3)]"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-6 gap-2">
                      <span className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold tracking-wider border truncate ${
                        isComingSoon ? "bg-gray-50 text-gray-400 border-gray-100" : "bg-blue-50/50 text-[#0D278D] border-blue-100"
                      }`}>{job.qualification}</span>
                      <div className={`flex items-center gap-1.5 text-xs font-medium shrink-0 ${isComingSoon ? "text-amber-500" : isClosed ? "text-red-400" : "text-gray-400"}`}>
                        <Clock size={14} />
                        <span>{formatDeadline(job.deadline, job.start_date)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase size={16} className={isClosed || isComingSoon ? "text-gray-300" : job.category === "konsultan_individu" ? "text-[#FEB700]" : "text-[#0D278D]"} />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{getCategoryDisplay(job.category)}</span>
                    </div>

                    <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 transition-colors leading-tight ${isClosed ? "text-gray-400 line-through" : "text-[#0D278D] group-hover:text-[#FEB700]"}`}>{job.title}</h3>
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
                      className={`group px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm flex items-center shrink-0 border-1 gap-1.5 ${
                        isClosed 
                          ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed shadow-none" 
                          : isComingSoon 
                          ? "bg-amber-50 border-amber-200 text-amber-700 cursor-pointer hover:bg-amber-100" 
                          : "bg-transparent border-[#0D278D] text-[#0D278D] cursor-pointer hover:bg-[#0D278D] hover:text-white"
                      }`}
                    >
                      <span>
                        {isClosed ? "Ditutup" : isComingSoon ? "Lihat Detail" : "Lihat Lowongan"}
                      </span>
                      {!isClosed && (
                        <ChevronRight 
                          size={18} 
                          className={`transition-all duration-300 ${
                            isComingSoon 
                              ? "opacity-100 ml-1" 
                              : "opacity-0 -translate-x-2 w-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:w-4"
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
      </section>

    </div>
  );
};

export default BerandaUmum;