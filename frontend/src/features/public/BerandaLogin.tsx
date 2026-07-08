import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  MonitorUp,
  Award,
  GraduationCap,
  Clock,
  Briefcase,
  LayoutGrid,
  TableProperties,
  Calendar,
  RotateCw,
  Sparkles,
  Mail,
  Users, // 🚀 Tambah import Users
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
  kuota?: number | string | null; // 🚀 Tambah properti kuota
}


const alurRekrutmenSempurna = [
  {
    id: 1,
    title: "Eksplorasi Lowongan",
    icon: Briefcase,
    colorClass: "text-[#0D278D] border-[#0D278D]/30 group-hover:border-[#0D278D] group-hover:bg-blue-50/50",
    titleColor: "text-[#0D278D]",
    desc: "Pelamar dapat mengeksplorasi secara transparan daftar lowongan formasi yang berstatus sedang dibuka, akan dibuka, maupun yang sudah ditutup."
  },
  {
    id: 2,
    title: "Detail & Pendaftaran",
    icon: MonitorUp,
    colorClass: "text-[#0D278D] border-[#0D278D]/30 group-hover:border-[#0D278D] group-hover:bg-blue-50/50",
    titleColor: "text-[#0D278D]",
    desc: "Sistem menyajikan semua detail informasi dari lowongan tersebut secara lengkap dan pelamar dapat langsung mendaftar secara digital."
  },
  {
    id: 3,
    title: "Notifikasi Email",
    icon: Mail,
    colorClass: "text-[#0D278D] border-[#0D278D]/30 group-hover:border-[#0D278D] group-hover:bg-blue-50/50",
    titleColor: "text-[#0D278D]",
    desc: "Ketika pelamar telah berhasil melakukan pendaftaran lowongan, pelamar akan otomatis mendapatkan notifikasi ke email yang terdaftar saat akun dibuat."
  },
  {
    id: 4,
    title: "Monitoring Status",
    icon: Clock,
    colorClass: "text-[#0D278D] border-[#0D278D]/30 group-hover:border-[#0D278D] group-hover:bg-blue-50/50",
    titleColor: "text-[#0D278D]",
    desc: "Pelamar dapat memonitoring status lamaran mereka sekaligus menerima notifikasi email ketika lolos ataupun tidak lolos pada semua tahapan seleksi."
  },
  {
    id: 5,
    title: "Pengumuman Akhir",
    icon: Award,
    colorClass: "text-[#0D278D] border-[#0D278D]/30 group-hover:border-[#0D278D] group-hover:bg-blue-50/50",
    titleColor: "text-[#0D278D]",
    desc: "Tahapan final berupa rilis pengumuman akhir kelulusan yang mana pelamar dapat melihat hasil akhir penetapan lolos atau tidaknya lamaran."
  }
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
    }
  }
};

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
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 20,
    restDelta: 0.001
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    fetchLatestJobs();
  }, []);

  const fetchLatestJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setJobs(data.slice(0, 4));
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
                Panduan Alur Rekrutmen
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section
        id="lowongan"
        className="py-16 md:py-24 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-20"
        variants={scrollRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] mb-2">Lowongan Pilihan</h2>
            <p className="text-gray-500 text-sm md:text-base">Temukan posisi yang sesuai dengan keahlian dan kompetensi Anda</p>
          </div>

          <div className="flex items-center gap-4 self-end w-full md:w-auto justify-end" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center shrink-0">
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
            </div>

            <button type="button" onClick={() => navigate("/lowongan")} className="text-[#0D278D] font-bold flex items-center gap-1 hover:text-[#FEB700] transition-colors group cursor-pointer text-sm md:text-base whitespace-nowrap">
              <span>Lihat Semua Posisi</span>
              <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        <div className="w-full">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="river-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                className="text-center py-24 flex flex-col items-center justify-center select-none"
              >
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
            ) : viewMode === "grid" ? (

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
                      className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border bg-white transition-all duration-300 flex flex-col justify-between group ${isClosed
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

                        {/* 🚀 MODIFIKASI GRID: Wrapper Flex untuk Kategori & Kuota */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Briefcase size={16} className={isClosed ? "text-gray-400" : isComingSoon ? "text-[#FEB700]" : job.category === "konsultan_individu" ? "text-[#FEB700]" : "text-[#0D278D]"} />
                            <span className={`text-xs font-semibold uppercase tracking-wider ${isClosed
                                ? "text-gray-400"
                                : job.category === "konsultan_individu"
                                  ? "text-[#FEB700]"
                                  : "text-[#0D278D]"
                              }`}>
                              {getCategoryDisplay(job.category)}
                            </span>
                          </div>

                          {/* Render Kuota Badge */}
                          {job.kuota && Number(job.kuota) > 0 ? (
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
                          className={`group px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm flex items-center shrink-0 border gap-1.5 cursor-pointer ${isClosed
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

              <motion.div
                key="table-layout"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                className="w-full relative z-10 overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(13,39,141,0.02)]"
              >
                <div className="overflow-x-auto w-full">
                  {/* 🚀 MODIFIKASI TABEL: Menyesuaikan min-w ke 1250px */}
                  <table className="w-full text-left border-separate table-fixed min-w-[1250px]">
                    <thead>
                      <tr className="bg-white text-[#0D278D] text-[11px] font-semibold uppercase tracking-[0.05em] select-none">
                        {/* 🚀 Penyesuaian Rasio Lebar Th Kolom */}
                        <th className="py-5 px-6 w-[30%] font-extrabold text-[#0D278D] border-l-[5px] border-l-[#0D278D] text-center">Formasi Lowongan</th>
                        <th className="py-5 px-4 w-[14%] font-extrabold text-center">Jenis Kategori</th>
                        <th className="py-5 px-4 w-[12%] font-extrabold text-center">Kuota</th> {/* 🚀 Tambah Th Kuota */}
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
                      {jobs.map((job) => {
                        const status = getStatusJob(job.start_date, job.deadline);
                        const isComingSoon = status === "akan_dibuka";
                        const isClosed = status === "sudah_tutup";

                        return (
                          <motion.tr
                            key={job.id}
                            variants={itemVariants}
                            className={`transition-colors duration-200 group even:bg-gray-50/20 ${isClosed ? "opacity-60 bg-gray-50/10" : "hover:bg-[#0D278D]/[0.015]"
                              }`}
                          >
                            <td className={`py-5 px-6 align-middle border-l-[5px] transition-all duration-300 text-center ${isClosed ? "border-l-gray-300" : isComingSoon ? "border-l-amber-500" : "border-l-[#0D278D]"
                              }`}>
                              <div className="max-w-full whitespace-normal break-words flex justify-center w-full">
                                <h4 className={`text-[14px] font-bold tracking-tight transition-colors duration-200 leading-relaxed text-center ${isClosed ? "text-gray-400 line-through" : "text-gray-900 group-hover:text-[#0D278D]"
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

                            {/* 🚀 DATA KUOTA TABEL */}
                            <td className="py-5 px-4 align-middle text-center">
                              {job.kuota && Number(job.kuota) > 0 ? (
                                <span className="text-gray-900 text-xs font-bold bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100 inline-flex items-center gap-1">
                                  {job.kuota} Orang
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs font-normal">
                                  Tidak dibatasi
                                </span>
                              )}
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
                            <td className="py-5 pr-6 pl-2 align-middle text-right w-[150px]">
                              <div className="flex justify-end items-center w-full">
                                <button
                                  onClick={() => navigate(`/detail-lowongan/${job.id}`)}
                                  disabled={isClosed}
                                  className={`group px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm flex items-center justify-center border cursor-pointer outline-none select-none min-w-[135px] ${isClosed
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
                                      className={`transition-all duration-300 transform shrink-0 ${isComingSoon
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
        </div>
      </motion.section>

      {/* SECTION TAHAPAN (Tetap utuh) */}
      <motion.section
        id="tahapan"
        ref={containerRef}
        variants={scrollRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-32 bg-gradient-to-b from-white to-gray-50/30 border-t border-gray-100 font-['Poppins'] relative select-none"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative">
          <div className="text-center max-w-4xl mx-auto mb-36 relative select-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/60 mb-5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D278D] animate-pulse" />
              <span className="text-[10px] font-semibold tracking-[0.01em] uppercase text-[#0D278D]">Alur Penerimaan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0D278D] tracking-tight leading-[1.15] max-w-2xl mx-auto">
              Tahapan dan Alur Sistem {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-[#ffe066]">Rekrutmen</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm font-medium mt-4 max-w-xl mx-auto leading-relaxed">
              Ikuti langkah-langkah terstruktur di bawah ini untuk memulai perjalanan karir profesional Anda bersama kami.
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-6">
              <div className="w-2 h-2 rounded-full bg-[#FEB700]" />
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#FEB700] to-transparent rounded-full" />
            </div>
          </div>

          <div className="relative w-full">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[5.5px] -translate-x-1/2 z-0">
              <div className="absolute inset-0 bg-gray-200 rounded-full" />
              <motion.div className="absolute top-0 left-0 right-0 bg-[#0D278D] origin-top rounded-full" style={{ height: lineHeight }} />
            </div>
            <div className="space-y-32 relative z-10 w-full">
              {alurRekrutmenSempurna.map((alur, index) => {
                const isEven = index % 2 === 0;
                const stepStart = index / (alurRekrutmenSempurna.length - 0.7);
                return <ScrollStepItem key={alur.id} alur={alur} isEven={isEven} smoothProgress={smoothProgress} stepStart={stepStart} />;
              })}
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

interface StepItemProps {
  alur: any;
  isEven: boolean;
  smoothProgress: any;
  stepStart: number;
}

const ScrollStepItem: React.FC<StepItemProps> = ({ alur, isEven, smoothProgress, stepStart }) => {
  const adjustedStepStart = alur.id === 5 ? stepStart - 0.08 : stepStart;
  const pinBg = useTransform(smoothProgress, [adjustedStepStart - 0.03, adjustedStepStart + 0.03], ["#d1d5db", "#0D278D"]);
  const numberBg = useTransform(smoothProgress, [adjustedStepStart - 0.02, adjustedStepStart + 0.02], ["#e5e7eb", "#0D278D"]);
  const numberText = useTransform(smoothProgress, [adjustedStepStart - 0.04, adjustedStepStart + 0.04], ["#9ca3af", "#ffffff"]);
  const contentOpacity = useTransform(smoothProgress, [adjustedStepStart - 0.08, adjustedStepStart + 0.08], [0.2, 1]);
  const iconColor = useTransform(smoothProgress, [adjustedStepStart - 0.06, adjustedStepStart + 0.04], ["rgba(156, 163, 175, 0.4)", "#0D278D"]);

  return (
    <div className={`flex flex-col md:flex-row items-start md:items-center w-full relative ${isEven ? "md:flex-row-reverse" : ""}`}>
      <div className="w-full md:w-1/2 pl-6 md:pl-20 md:px-20 flex flex-col justify-center">
        <motion.div style={{ opacity: contentOpacity }} className={`space-y-3 max-w-md ${isEven ? "md:text-right md:ml-auto" : "md:text-left md:mr-auto"}`}>
          <motion.div style={{ backgroundColor: numberBg, color: numberText }} className={`w-9 h-9 rounded-full font-mono text-md font-bold flex items-center justify-center shadow-md border-2 border-white select-none ${isEven ? "md:ml-auto" : "md:mr-auto"}`}>{alur.id}</motion.div>
          <h4 className="text-2xl font-extrabold text-[#0D278D] tracking-tight">{alur.title}</h4>
          <p className="text-gray-500 text-s sm:text-[14px] leading-relaxed font-normal">{" "}{alur.desc}</p>
        </motion.div>
      </div>
      <div className={`w-full md:w-1/2 pl-6 flex items-center justify-center mt-6 md:mt-0 ${isEven ? "md:pr-2" : "md:pl-2"}`}>
        <motion.div style={{ opacity: contentOpacity }} whileHover={{ scale: 1.05, rotate: isEven ? 5 : -5 }} className="w-32 h-32 rounded-[2rem] border bg-white shadow-[0_15px_35px_-12px_rgba(0,0,0,0.02)] border-[#0D278D] flex items-center justify-center relative group">
          <div className="absolute inset-2 rounded-[1.5rem] bg-[#0D278D]/[0.02] border border-[#0D278D]/5" />
          <motion.div style={{ color: iconColor }} className="flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-110"><alur.icon size={36} className="stroke-[1.6]" /></motion.div>
        </motion.div>
      </div>
      <div className="absolute left-4 md:left-1/2 top-4 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <motion.div style={{ backgroundColor: pinBg }} className="w-5 h-5 rounded-full shadow-md pointer-events-none" />
      </div>
    </div>
  );
};

export default BerandaLogin;