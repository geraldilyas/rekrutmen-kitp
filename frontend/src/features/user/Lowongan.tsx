import React, { useState, useEffect, useMemo } from "react";
import { RotateCw, Sparkles, LayoutGrid, TableProperties, Layers, Activity, Calendar, GraduationCap, Briefcase, Clock, ChevronDown, ChevronRight, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  kuota?: number | string | null;
}

interface OptimizedJob extends Job {
  computedStatus: string;
  startYear: number;
  endYear: number;
  startMonthInt: number;
  endMonthInt: number;
  startTime: number;
  kuota?: number | string | null;
}

// 噫 ANIMATION VARIANTS FOR LUXURY CUSTOM DROPDOWN FILTER
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

const scrollRevealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
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
  
  const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
  const [availableYears, setAvailableYears] = useState<string[]>([new Date().getFullYear().toString()]);
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // DEFAULT VIEW DIKUNCI DI TABLE VIEW SEJAK PERTAMA LOAD
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setJobs(data);

      const yearsSet = new Set<string>();
      yearsSet.add(new Date().getFullYear().toString());
      
      data.forEach((job: Job) => {
        if (job.start_date) {
          const year = new Date(job.start_date).getFullYear().toString();
          if (year && year !== "NaN") yearsSet.add(year);
        }
        if (job.deadline) {
          const year = new Date(job.deadline).getFullYear().toString();
          if (year && year !== "NaN") yearsSet.add(year);
        }
      });

      setAvailableYears(Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a)));
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

  const renderStatusBadge = (status: string) => {
    if (status === "akan_dibuka") {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100/70 select-none">Akan Datang</span>;
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

  // ENGINE OPTIMIZED MEMOIZATION
  const filteredJobs = useMemo(() => {
    const now = new Date().getTime();
    const currentYearStr = new Date().getFullYear().toString();
    const targetYear = filterYear !== "all" ? parseInt(filterYear, 10) : parseInt(currentYearStr, 10);

    const optimizedList: OptimizedJob[] = jobs.map((job) => {
      const startObj = job.start_date ? new Date(job.start_date) : null;
      const endObj = job.deadline ? new Date(job.deadline) : null;

      const startTime = startObj ? startObj.getTime() : 0;
      const endTime = endObj ? endObj.getTime() : 0;

      let computedStatus = "sedang_dibuka";
      if (startTime && now < startTime) computedStatus = "akan_dibuka";
      else if (endTime && now > endTime) computedStatus = "sudah_tutup";

      return {
        ...job,
        computedStatus,
        startTime,
        startYear: startObj ? startObj.getFullYear() : targetYear,
        endYear: endObj ? endObj.getFullYear() : targetYear,
        startMonthInt: startObj ? startObj.getMonth() + 1 : 1,
        endMonthInt: endObj ? endObj.getMonth() + 1 : 12,
      };
    });

    return optimizedList
      .filter((job) => {
        const matchesCategory = filterCategory === "all" || job.category === filterCategory;
        const matchesStatus = filterStatus === "all" || job.computedStatus === filterStatus;
        const matchesYear = filterYear === "all" || (targetYear >= job.startYear && targetYear <= job.endYear);

        let matchesMonth = true;
        if (filterMonth !== "all") {
          const selectedMonthInt = parseInt(filterMonth, 10);
          matchesMonth = (selectedMonthInt >= job.startMonthInt && selectedMonthInt <= job.endMonthInt);
        }
        
        return matchesCategory && matchesStatus && matchesYear && matchesMonth;
      })
      .sort((a, b) => {
        const getPriorityScore = (status: string, startYear: number) => {
          if (status === "sedang_dibuka") return 1;
          if (status === "akan_dibuka" && startYear === targetYear) return 2;
          if (status === "akan_dibuka" && startYear > targetYear) return 3;
          if (status === "sudah_tutup") return 4;
          return 5;
        };

        const scoreA = getPriorityScore(a.computedStatus, a.startYear);
        const scoreB = getPriorityScore(b.computedStatus, b.startYear);

        if (scoreA === scoreB) {
          return b.startTime - a.startTime; 
        }
        return scoreA - scoreB;
      });
  }, [jobs, filterCategory, filterStatus, filterMonth, filterYear]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="bg-white min-h-screen font-['Poppins']" onClick={() => setOpenDropdown(null)}>

      {/* --- HERO TOP PANEL --- */}
      <div className="bg-[#0D278D] pt-32 pb-24 relative rounded-b-[2.5rem] md:rounded-b-[4rem] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
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
              Pilihan Lowongan bbwsms 
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
        variants={scrollRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        {/* Dropdowns Filter Input */}
        <motion.div
          variants={containerVariants}
          className="flex flex-row flex-wrap items-center justify-center gap-4 mb-12 pb-6 border-b border-gray-100 relative z-30 w-full"
        >
          <div className="flex flex-row flex-wrap items-center justify-center gap-3 w-auto" onClick={(e) => e.stopPropagation()}>
            {/* 1. Dropdown Kategori */}
            <motion.div variants={itemVariants} className="relative w-full sm:w-[180px]">
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
            </motion.div>

            {/* 2. Dropdown Status */}
            <motion.div variants={itemVariants} className="relative w-full sm:w-[180px]">
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
            </motion.div>

            {/* 3. Dropdown Bulan */}
            <motion.div variants={itemVariants} className="relative w-full sm:w-[160px]">
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
            </motion.div>

            {/* 4. Dropdown Tahun */}
            <motion.div variants={itemVariants} className="relative w-full sm:w-[140px]">
              <button onClick={() => toggleDropdown("year")} className={`group w-full bg-white text-[#0D278D] font-bold text-xs pl-10 pr-4 h-[46px] rounded-xl border transition-all duration-300 hover:bg-[#0D278D] hover:text-white flex items-center justify-between cursor-pointer ${openDropdown === "year" ? "border-[#0D278D] ring-4 ring-blue-50/50" : "border-[#0D278D]/20"}`}>
                <Calendar size={14} className="absolute left-3.5 text-[#0D278D] group-hover:text-white transition-colors" />
                <span className="truncate mr-1">{filterYear === "all" ? "Semua Tahun" : filterYear}</span>
                <motion.div animate={{ rotate: openDropdown === "year" ? 180 : 0 }} className="flex items-center shrink-0"><ChevronDown size={14} /></motion.div>
              </button>
              <AnimatePresence>
                {openDropdown === "year" && (
                  <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl max-h-[200px] overflow-y-auto p-1.5 z-50 scrollbar-thin">
                    <button onClick={() => { setFilterYear("all"); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 rounded-lg text-xs font-semibold text-[#0D278D] hover:bg-gray-50 block cursor-pointer">Semua Tahun</button>
                    {availableYears.map((yr) => (
                      <button key={yr} onClick={() => { setFilterYear(yr); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 rounded-lg text-xs font-semibold text-[#0D278D] hover:bg-gray-50 block cursor-pointer">{yr}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* 5. Switch View Mode */}
          <motion.div variants={itemVariants} className="flex items-center justify-center shrink-0" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button"
              onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
              className="w-12 h-12 rounded-full bg-transparent hover:bg-blue-50/40 text-[#0D278D] flex items-center justify-center transition-all duration-300 border-0 outline-none cursor-pointer focus:outline-none relative group select-none"
              title={viewMode === "grid" ? "Ubah ke Tampilan Tabel" : "Ubah ke Tampilan Grid"}
            >
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
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="text-center py-24 flex flex-col items-center justify-center select-none">
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
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/40 rounded-3xl border border-gray-100 p-8">
            <Sparkles size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium">Belum ada lowongan aktif yang cocok dengan kualifikasi filter terpilih.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              /* ==========================================
                 逃 MODE 1: GRID VIEW
                 ========================================== */
              <motion.div 
                key="grid-layout"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 15 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10 w-full"
              >
                {filteredJobs.map((job) => {
                  const status = job.computedStatus;
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
                          : "border-gray-100 hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(245,183,0,0.3)]"
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

                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Briefcase size={16} className={isClosed ? "text-gray-400" : isComingSoon ? "text-amber-500" : job.category === "konsultan_individu" ? "text-[#FEB700]" : "text-[#0D278D]"} />
                            <span className={`text-xs font-semibold uppercase tracking-[0.05] ${isClosed ? "text-gray-400" : job.category === "konsultan_individu" ? "text-[#FEB700]" : "text-[#0D278D]"}`}>
                              {getCategoryDisplay(job.category)}
                            </span>
                          </div>

                          {/* 🚀 BADGE KUOTA DI GRID VIEW */}
                          {job.kuota && job.kuota > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-[#0D278D] border border-blue-100">
                              <Users size={12} />
                              Kuota: {job.kuota} Orang
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-100">
                              <Users size={12} />
                              Kuota: Terbuka
                            </span>
                          )}
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
                              ? "bg-white border-[#FEB700] text-[#FEB700] hover:bg-[#FEB700] hover:text-white" 
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
                 荘 MODE 2: TABLE VIEW (DENGAN KOLOM KUOTA TERINTEGRASI)
                 =================================================================== */
              <motion.div 
                key="table-layout"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                className="w-full relative z-10 overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(13,39,141,0.02)]"
              >
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-separate table-fixed min-w-[1250px]">
                    <thead>
                      <tr className="bg-white text-[#0D278D] text-[11px] font-semibold uppercase tracking-[0.05em] select-none">
                        <th className="py-5 px-6 w-[30%] font-extrabold text-[#0D278D] border-l-[5px] border-l-[#0D278D] text-center">Formasi Lowongan</th>
                        <th className="py-5 px-4 w-[14%] font-extrabold text-center">Jenis Kategori</th>
                        <th className="py-5 px-4 w-[12%] font-extrabold text-center">Kuota</th> {/* 🚀 Kolom Kuota Baru */}
                        <th className="py-5 px-4 w-[18%] font-extrabold text-center">Periode Pendaftaran</th>
                        <th className="py-5 px-4 w-[14%] font-extrabold text-center">Kualifikasi</th>
                        <th className="py-5 px-4 w-[12%] font-extrabold text-center">Status</th>
                        <th className="py-5 pr-6 pl-2 w-[150px]" />
                      </tr>
                    </thead>
                    <motion.tbody 
                      variants={containerVariants}
                      className="text-gray-700 text-sm font-medium"
                    >
                      {filteredJobs.map((job) => {
                        const status = job.computedStatus;
                        const isComingSoon = status === "akan_dibuka";
                        const isClosed = status === "sudah_tutup";

                        return (
                          <motion.tr 
                            key={job.id}
                            variants={itemVariants}
                            className={`transition-colors duration-200 group even:bg-gray-50/20 ${
                              isClosed ? "opacity-60 bg-gray-50/10" : "hover:bg-[#0D278D]/[0.015]"
                            }`}
                          >
                            {/* 1. Formasi Lowongan */}
                            <td className={`py-5 px-6 align-middle border-l-[5px] transition-all duration-300 text-center ${
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

                            {/* 2. Jenis Kategori */}
                            <td className="py-5 px-4 align-middle text-center">
                              <span className="text-gray-500 text-xs font-semibold tracking-wide block truncate text-center">
                                {getCategoryDisplay(job.category)}
                              </span>
                            </td>

                            {/* 3. 🚀 DATA KUOTA TABEL */}
                            <td className="py-5 px-4 align-middle text-center">
                              {job.kuota && job.kuota > 0 ? (
                                <span className="text-gray-900 text-xs font-bold bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100 inline-flex items-center gap-1">
                                  {job.kuota} Orang
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs font-normal">
                                  Tidak dibatasi
                                </span>
                              )}
                            </td>

                            {/* 4. Periode Tanggal Range */}
                            <td className="py-5 px-4 align-middle text-center">
                              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-semibold whitespace-nowrap text-center w-full">
                                <Calendar size={13} className="text-gray-500 shrink-0" />
                                <span>{formatDeadline(job.deadline, job.start_date)}</span>
                              </div>
                            </td>

                            {/* 5. Kualifikasi Pendidikan */}
                            <td className="py-5 px-4 align-middle text-center">
                              <div className="max-w-full whitespace-normal break-words flex justify-center w-full">
                                <span className="inline-block text-[11px] font-bold text-[#0D278D] bg-blue-50/60 border border-blue-100/40 px-2.5 py-1 rounded-lg leading-normal text-center">
                                  {job.qualification}
                                </span>
                              </div>
                            </td>

                            {/* 6. Status Badge */}
                            <td className="py-5 px-4 align-middle text-center">
                              {renderStatusBadge(status)}
                            </td>

                            {/* 7. Action Button */}
                            <td className="py-5 pr-6 pl-2 align-middle text-right w-[150px]">
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

                          </motion.tr>
                        );
                      })}
                    </motion.tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.main>
    </div>
  );
};

export default Lowongan;