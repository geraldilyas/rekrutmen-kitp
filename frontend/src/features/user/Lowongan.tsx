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
  LayoutGrid,
  TableProperties,
  Sparkles,
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
  requirements: string;
}

// 🚀 ANIMATION VARIANTS FOR LUXURY CUSTOM DROPDOWN FILTER
const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
  },
  exit: { opacity: 0, y: -5, scale: 0.95, transition: { duration: 0.15 } }
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

const fadeUpVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 35, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    // transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

const Lowongan: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Advanced Filtering States
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // 🚀 STATE MODE TAMPILAN (GRID VS TABLE VIEW)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-grey-50 text-grey-700 border border-amber-100/70 select-none">Akan Datang</span>;
    }
    if (status === "sudah_tutup") {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-100/70 select-none">Sudah Tutup</span>;
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

  // 🔥 FIX SAKTI: Filter lintas bulan otomatis rentang aktif lowongan
  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = filterCategory === "all" || job.category === filterCategory;
    const status = getStatusJob(job.start_date, job.deadline);
    const matchesStatus = filterStatus === "all" || status === filterStatus;
    
    let matchesMonth = true;
    if (filterMonth !== "all" && job.start_date && job.deadline) {
      const startObj = new Date(job.start_date);
      const endObj = new Date(job.deadline);
      if (!isNaN(startObj.getTime()) && !isNaN(endObj.getTime())) {
        const selectedMonthInt = parseInt(filterMonth, 10);
        const startMonthInt = startObj.getMonth() + 1;
        const endMonthInt = endObj.getMonth() + 1;
        matchesMonth = (startObj.getFullYear() === endObj.getFullYear()) 
          ? (selectedMonthInt >= startMonthInt && selectedMonthInt <= endMonthInt) : true;
      } else {
        matchesMonth = false;
      }
    }
    return matchesCategory && matchesStatus && matchesMonth;
  });

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const getFilterSummaryText = () => {
    const kategoriText = filterCategory === "all" ? "Semua Kategori" : getCategoryDisplay(filterCategory);
    const statusText = filterStatus === "all" ? "Semua Status" : filterStatus === "sedang_dibuka" ? "Sedang Dibuka" : filterStatus === "akan_dibuka" ? "Akan Dibuka" : "Sudah Tutup";
    const monthText = filterMonth === "all" ? "Semua Bulan" : listMonths.find(m => m.value === filterMonth)?.label;

    return (
      <p className="text-xs sm:text-sm text-[#0D278D]/80 font-medium tracking-wide text-center w-full select-none">
        Menampilkan formasi <span className="text-[#0D278D] font-bold">{kategoriText}</span>
        {" • "} dengan status <span className="text-[#0D278D] font-bold">{statusText}</span>
        {" • "} pada periode <span className="text-[#0D278D] font-bold">{monthText}</span>
      </p>
    );
  };

  return (
    <div className="bg-white min-h-screen font-['Poppins']" onClick={() => setOpenDropdown(null)}>

      {/* --- HERO TOP PANEL --- */}
      <div className="bg-[#0D278D] pt-32 pb-24 relative rounded-b-[2.5rem] md:rounded-b-[4rem] overflow-hidden">
        <div className="absolute inset-0 opacity-13 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FEB700]/10 rounded-full blur-[100px]" />

        <motion.div
          className="max-w-5xl mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
            <Briefcase size={16} className="text-[#FEB700]" />
            <span className="text-white text-[11px] font-bold tracking-widest uppercase">
              Pilihan Karir
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Daftar{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-[#ffe066]">
              Lowongan
            </span>
          </h1>

          <p className="text-blue-100/80 text-[15px] md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Temukan peluang karir terbaik dan bergabunglah bersama kami untuk
            berkontribusi membangun infrastruktur sumber daya air negeri.
          </p>
        </motion.div>
      </div>

      <motion.main
        className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Title Formasi */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100 relative z-30"
        >
          {/* Sektor Kiri: Dropdowns Filter Input */}
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full sm:w-[180px]">
              <button onClick={() => toggleDropdown("category")} className={`group w-full bg-white text-[#0D278D] font-bold text-xs pl-10 pr-4 h-[46px] rounded-xl border transition-all duration-300 hover:bg-[#0D278D] hover:text-white flex items-center justify-between cursor-pointer ${openDropdown === "category" ? "border-[#0D278D] ring-4 ring-blue-50/50" : "border-[#0D278D]/20"}`}>
                <Layers size={14} className="absolute left-3.5 text-[#0D278D] group-hover:text-white transition-colors" />
                <span className="truncate mr-1">{filterCategory === "all" ? "Semua Kategori" : getCategoryDisplay(filterCategory)}</span>
                <motion.div animate={{ rotate: openDropdown === "category" ? 180 : 0 }} className="flex items-center shrink-0"><ChevronDown size={14} /></motion.div>
              </button>
              <AnimatePresence>
                {openDropdown === "category" && (
                  <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 p-1.5">
                    {[{ id: "all", label: "Semua Kategori" }, { id: "konsultan_individu", label: "Konsultan Individu" }, { id: "tenaga_pendukung", label: "Tenaga Pendukung" }].map((opt) => (
                      <button key={opt.id} onClick={() => { setFilterCategory(opt.id); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 rounded-lg text-xs font-semibold text-[#0D278D] hover:bg-gray-50 block cursor-pointer">{opt.label}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative w-full sm:w-[180px]">
              <button onClick={() => toggleDropdown("status")} className={`group w-full bg-white text-[#0D278D] font-bold text-xs pl-10 pr-4 h-[46px] rounded-xl border transition-all duration-300 hover:bg-[#0D278D] hover:text-white flex items-center justify-between cursor-pointer ${openDropdown === "status" ? "border-[#0D278D] ring-4 ring-blue-50/50" : "border-[#0D278D]/20"}`}>
                <Activity size={14} className="absolute left-3.5 text-[#0D278D] group-hover:text-white transition-colors" />
                <span className="truncate mr-1">{filterStatus === "all" ? "Semua Status" : filterStatus === "sedang_dibuka" ? "Sedang Dibuka" : filterStatus === "akan_dibuka" ? "Akan Dibuka" : "Sudah Tutup"}</span>
                <motion.div animate={{ rotate: openDropdown === "status" ? 180 : 0 }} className="flex items-center shrink-0"><ChevronDown size={14} /></motion.div>
              </button>
              <AnimatePresence>
                {openDropdown === "status" && (
                  <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 p-1.5">
                    {[{ id: "all", label: "Semua Status" }, { id: "sedang_dibuka", label: "Sedang Dibuka" }, { id: "akan_dibuka", label: "Akan Dibuka" }, { id: "sudah_tutup", label: "Sudah Tutup" }].map((opt) => (
                      <button key={opt.id} onClick={() => { setFilterStatus(opt.id); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 rounded-lg text-xs font-semibold text-[#0D278D] hover:bg-gray-50 block cursor-pointer">{opt.label}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative w-full sm:w-[160px]">
              <button onClick={() => toggleDropdown("month")} className={`group w-full bg-white text-[#0D278D] font-bold text-xs pl-10 pr-4 h-[46px] rounded-xl border transition-all duration-300 hover:bg-[#0D278D] hover:text-white flex items-center justify-between cursor-pointer ${openDropdown === "month" ? "border-[#0D278D] ring-4 ring-blue-50/50" : "border-[#0D278D]/20"}`}>
                <Calendar size={14} className="absolute left-3.5 text-[#0D278D] group-hover:text-white transition-colors" />
                <span className="truncate mr-1">{listMonths.find(m => m.value === filterMonth)?.label || "Semua Bulan"}</span>
                <motion.div animate={{ rotate: openDropdown === "month" ? 180 : 0 }} className="flex items-center shrink-0"><ChevronDown size={14} /></motion.div>
              </button>
              <AnimatePresence>
                {openDropdown === "month" && (
                  <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl max-h-[240px] overflow-y-auto p-1.5 z-50 scrollbar-thin">
                    {listMonths.map((m) => (
                      <button key={m.value} onClick={() => { setFilterMonth(m.value); setOpenDropdown(null); }} className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0D278D] hover:bg-gray-50 block cursor-pointer">{m.label}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* TOGGLE SWITCH BULAT (ICON ONLY) + SPINNING ANIMATION */}
          <div className="flex bg-gray-50 border border-gray-100 p-1.5 rounded-full self-center justify-center shrink-0" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 text-[#0D278D] shadow-sm hover:text-[#FEB700] hover:shadow transition-all cursor-pointer outline-none"
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
          </div>
        </motion.div>

        {/* --- DYNAMIC FILTER SUMMARY ROW --- */}
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="mb-12 flex justify-center items-center w-full relative z-20">
          {getFilterSummaryText()}
        </motion.div>

        {/* --- JOB VIEW DECK LAYER --- */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mx-auto"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/40 rounded-3xl border border-gray-100 p-8">
            <Sparkles size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">Belum ada lowongan aktif yang cocok dengan filter kualifikasi.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              /* ==========================================================
                 📦 MODE 1: GRID VIEW (KUALIFIKASI TER-REVISI LENGKAP)
                 ========================================================== */
              <motion.div 
                key="grid-layout"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 15 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10"
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
                        isClosed ? "opacity-60 bg-gray-50/30" : isComingSoon ? "opacity-95" : "hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(254,183,0,0.3)]"
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
                          className={`group px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm flex items-center shrink-0 border-1 gap-1.5 cursor-pointer ${
                            isClosed 
                              ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed shadow-none" 
                              : isComingSoon 
                              ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" 
                              : "bg-transparent border-[#0D278D] text-[#0D278D] hover:bg-[#0D278D] hover:text-white"
                          }`}
                        >
                          <span>{isClosed ? "Ditutup" : isComingSoon ? "Lihat Detail" : "Lihat Lowongan"}</span>
                          {!isClosed && <ChevronRight size={18} className={`transition-all duration-300 ${isComingSoon ? "opacity-100 ml-1" : "opacity-0 -translate-x-2 w-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:w-4"}`} />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              
              /* ===================================================================
                 📦 MODE 2: MODERN DASHBOARD FLEX-ROW LAYOUT (NEO-GLASSMORPHISM)
                 =================================================================== */
              <motion.div 
                              key="table-layout"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -15 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className="w-full space-y-4 relative z-10"
                            >
                              {/* Header Anggun Penanda Kolom (Desktop Only) */}
                              <div className="hidden lg:flex items-center justify-between px-8 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] border-b border-gray-100 select-none">
                                <div className="w-[30%] text-center -translate-x-6" >Formasi Lowongan</div>
                                <div className="w-[20%]">Jenis Kategori</div>
                                <div className="w-[22%]">Periode Pendaftaran</div>
                                <div className="w-[15%]">Kualifikasi</div>
                                <div className="w-[15%] text-center -translate-x-6" >Status</div>
                                <div className="w-[160px]" />
                              </div>
              
                              {/* Looping Baris Formasi Lowongan */}
                              {filteredJobs.map((job) => {
                                const status = getStatusJob(job.start_date, job.deadline);
                                const isComingSoon = status === "akan_dibuka";
                                const isClosed = status === "sudah_tutup";
              
                                return (
                                  <motion.div
                                    key={job.id}
                                    variants={itemVariants}
                                    whileHover={isClosed || isComingSoon ? {} : { x: 6, borderLeftColor: "#FEB700" }}
                                    className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 lg:p-6 px-6 lg:px-8 bg-white rounded-2xl border-l-[4px] border border-gray-100 transition-all duration-300 ${
                                      isClosed 
                                        ? "opacity-50 bg-gray-50/40 border-l-gray-300" 
                                        : isComingSoon 
                                        ? "border-l-amber-400 shadow-sm" 
                                        : "border-l-[#0D278D] shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_15px_35px_-10px_rgba(13,39,141,0.08)]"
                                    }`}
                                  >
                                    {/* 1. Nama Lowongan Formasi */}
                                    <div className="w-full lg:w-[30%] min-w-0">
                                      <h4 className={`text-base font-bold tracking-tight transition-colors duration-200 ${isClosed ? "text-gray-400 line-through" : "text-[#0D278D]"}`}>
                                        {job.title}
                                      </h4>
                                      <span className="block text-[10px] text-gray-400 font-medium mt-1 lg:hidden">
                                        {getCategoryDisplay(job.category)}
                                      </span>
                                    </div>
              
                                    {/* 2. Jenis Kategori (Hidden di Mobile karena udah diwakili sub-title atas) */}
                                    <div className="hidden lg:block w-[20%] text-sm font-semibold text-gray-500">
                                      {getCategoryDisplay(job.category)}
                                    </div>
              
                                    {/* 3. Periode Tanggal Range */}
                                    <div className="w-full lg:w-[22%] flex items-center gap-2 text-xs text-gray-500 font-medium">
                                      <Calendar size={13} className="text-gray-400 shrink-0" />
                                      <span>{formatDeadline(job.deadline, job.start_date)}</span>
                                    </div>
              
                                    {/* 4. Kualifikasi Pendidikan */}
                                    <div className="w-full lg:w-[15%] flex items-center gap-1.5 text-xs text-gray-700 font-semibold">
                                      <GraduationCap size={15} className="text-gray-400 shrink-0 lg:hidden" />
                                      <span className="bg-gray-50 lg:bg-transparent border border-gray-100 lg:border-0 px-2.5 lg:px-0 py-1 lg:py-0 rounded-lg max-w-full truncate">
                                        {job.qualification}
                                      </span>
                                    </div>
              
                                    {/* 5. Status Badge Area */}
                                    <div className="w-full lg:w-[13%] flex lg:justify-center items-center">
                                      {renderStatusBadge(status)}
                                    </div>
              
                                    {/* Kolom 6: Action Button (🚀 FIXED: IKON CHEVRON HANYA MUNCUL SAAT HOVER) */}
                                          <td className="py-6 text-right align-middle pr-4 w-[190px]">
                                            <div className="flex justify-end items-center w-full">
                                              <button 
                                                onClick={() => navigate(`/detail-lowongan/${job.id}`)}
                                                disabled={isClosed}
                                                className={`group px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm flex items-center justify-center border-1 cursor-pointer outline-none select-none min-w-[145px] ${
                                                  isClosed 
                                                    ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed shadow-none" 
                                                    : isComingSoon 
                                                    ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" 
                                                    : "bg-transparent border-[#0D278D] text-[#0D278D] hover:bg-[#0D278D] hover:text-white"
                                                }`}
                                              >
                                                {/* Teks utama terkunci mati, anti-patah ke bawah */}
                                                <span className="whitespace-nowrap inline-block text-center">
                                                  {isClosed ? "Ditutup" : isComingSoon ? "Lihat Detail" : "Lihat Lowongan"}
                                                </span>
                                                
                                                {/* 🚀 FIXED LOGIC: Chevron disembunyikan total, baru mekar dan meluncur maju pas triger hover group */}
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
              
                                  </motion.div>
                  );
                })}
              </motion.div>
            )}
            {/* //               </tr>
            //             );
            //           })}
            //         </tbody>
            //       </table>
            //     </div>
            //   </motion.div>
            // )} */}
          </AnimatePresence>
        )}
      </motion.main>
    </div>
  );
};

export default Lowongan;