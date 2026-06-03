import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Megaphone,
  Users,
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

const Beranda: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestJobs();
  }, []);

  const fetchLatestJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      
      // 🚀 SINKRONISASI TOTAL: Meniru validasi pengaman halaman Lowongan agar support objek wrapper Laravel
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      
      setJobs(data.slice(0, 4)); // Baru kita potong aman top 4 posisi
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

  const formatDeadline = (dateStr: string, startDateStr?: string) => {
    const now = new Date();
    
    if (startDateStr) {
      const start = new Date(startDateStr);
      if (now < start) {
        const diffTime = start.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) return `Buka dalam ${diffDays} Hari`;
        return "Segera Hadir";
      }
    }

    if (!dateStr) return "";
    const deadline = new Date(dateStr);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Sudah ditutup";
    if (diffDays === 0) return "Tutup hari ini";
    if (diffDays > 30) return "Masih lama";
    return `${diffDays} Hari Lagi`;
  };

  /*
    ==================================================
    STATE SIMULASI LOGIN (Ubah sesuai Auth Context lo)
    ==================================================
  */

  /*
    ==================================================
    HANDLER AKSI CONDITIONAL UTK PADA BUTTON LAMAR
    ==================================================
  */
  const handleActionPendaftaran = (job?: Job) => {
    if (job?.id) {
      navigate(`/detail-lowongan/${job.id}`);
    } else {
      navigate("/lowongan");
    }
  };

  return (
    <div className="bg-white min-h-screen pt-20 overflow-x-hidden font-['Poppins']">

      {/* --- HERO SECTION --- */}
      {/* 🚀 RESPONSIVE FIX: Padding atas-bawah disesuaikan (py-20 md:py-32) agar pas di mobile tidak terlalu tenggelam */}
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
            {/* 🚀 RESPONSIVE FIX: Ukuran teks badge dibikin text-[10px] sm:text-xs agar pas porsi layar HP potrait */}
            <span className="inline-block px-4 sm:px-5 py-2 rounded-full bg-white/10 border border-white/20 text-[#FEB700] font-bold text-[10px] sm:text-xs mb-6 shadow-[0_0_20px_rgba(254,183,0,0.15)] backdrop-blur-md uppercase tracking-widest max-w-full truncate sm:whitespace-normal">
              REKRUTMEN KONSULTAN INDIVIDU & TENAGA PENDUKUNG
            </span>

            {/* 🚀 RESPONSIVE FIX: Tipografi ukuran font mengalir (text-3xl sm:text-4xl md:text-5xl lg:text-6xl) mencegah overflow kesamping */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              Membangun Negeri Melalui <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-yellow-200">
                Pengelolaan Sumber Daya Air
              </span>
            </h1>

            {/* 🚀 RESPONSIVE FIX: Mengatur text-base md:text-xl agar deskripsi tenang dibaca di HP */}
            <p className="text-blue-100/90 mb-8 text-base md:text-xl leading-relaxed max-w-2xl font-light">
              Bergabunglah bersama Balai Besar Wilayah Sungai Kementerian PUPR.
              Kontribusi nyata untuk pembangunan infrastruktur vital nasional.
            </p>

            {/* 🚀 RESPONSIVE FIX: Menggunakan w-full sm:w-auto px-6 agar tombol tidak kekecilan saat ditekan jempol di mobile */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center px-4 sm:px-0">
              <button
                onClick={() =>
                  document
                    .getElementById("lowongan")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group relative overflow-hidden bg-[#FEB700] text-[#0D278D] px-8 py-3.5 sm:py-4 rounded-2xl font-bold flex items-center cursor-pointer justify-center gap-2 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(254,183,0,0.5)] w-full sm:w-auto"
              >
                <span>Lihat Lowongan Aktif</span>
                <ChevronRight
                  size={18}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("tahapan")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-white/5 border border-white/20 text-white px-8 py-3.5 sm:py-4 rounded-2xl font-bold hover:bg-white/10 hover:border-white/30 cursor-pointer transition-all duration-300 backdrop-blur-sm shadow-lg w-full sm:w-auto"
              >
                Panduan Pendaftaran
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- LOWONGAN SECTION --- */}
      {/* 🛠️ FIX TOTAL: Setel induk section ke animate="visible" secara konstan agar spinner loading tidak terkunci */}
      <motion.section
        id="lowongan"
        className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}

          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 md:gap-6"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D278D] mb-2">
              Lowongan Pilihan
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Temukan posisi yang sesuai dengan keahlian Anda
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/lowongan")}
            className="text-[#0D278D] font-bold flex items-center gap-1 hover:text-[#FEB700] transition-colors group cursor-pointer text-sm md:text-base"
          >
            Look Semua Posisi
            <ChevronRight
              size={18}
              className="transform group-hover:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>

        {/* 🚀 RESPONSIVE FIX: Grid beralih grid-cols-1 md:grid-cols-2 secara fluid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {loading ? (
              <div className="col-span-full text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mx-auto"></div>
              </div>
          ) : jobs.length === 0 ? (
              <div className="col-span-full text-center py-20">
                  <p className="text-gray-500">Belum ada lowongan aktif.</p>
              </div>
          ) : jobs.map((job) => {
            const isComingSoon = new Date() < new Date(job.start_date);
            return (
            /* 🚀 SINKRONISASI EMAS: Kita tambahkan initial="hidden" dan animate="visible" langsung di card individu ini 
                sama persis dengan cara halaman Lowongan.tsx merender list-nya! */
            <motion.div
              key={job.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={isComingSoon ? {} : { y: -8 }}
              className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 bg-white transition-all duration-300 flex flex-col justify-between ${
                isComingSoon ? "opacity-95" : "hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(254,183,0,0.3)]"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-6 gap-2">
                  <span className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold tracking-wider border truncate ${
                    isComingSoon ? "bg-gray-50 text-gray-400 border-gray-100" : "bg-blue-50/50 text-[#0D278D] border-blue-100"
                  }`}>
                    {job.qualification}
                  </span>
                  <div className={`flex items-center gap-1.5 text-xs font-medium shrink-0 ${isComingSoon ? "text-amber-500" : "text-gray-400"}`}>
                    <Clock size={14} />
                    <span>{formatDeadline(job.deadline, job.start_date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Briefcase
                    size={16}
                    className={
                      isComingSoon ? "text-gray-300" : (
                      job.category === "konsultan_individu"
                        ? "text-[#FEB700]"
                        : "text-[#0D278D]"
                      )
                    }
                  />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {getCategoryDisplay(job.category)}
                  </span>
                </div>

                {/* 🚀 RESPONSIVE FIX: Ukuran font judul posisi dibikin text-xl sm:text-2xl */}
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 transition-colors leading-tight ${isComingSoon ? "text-gray-400" : "text-[#0D278D] group-hover:text-[#FEB700]"}`}>
                  {job.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 sm:mb-8 line-clamp-3">
                  {job.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-50 gap-2">
                <div className="flex items-center gap-1 sm:gap-2 overflow-hidden">
                  <GraduationCap size={18} className="text-gray-400 mr-1 shrink-0" />
                  <span className="w-auto px-2.5 sm:px-3 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-[#0D278D] truncate">
                      {job.qualification}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleActionPendaftaran(job)}
                  className={`group px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm flex items-center shrink-0 border-1 ${
                    isComingSoon 
                    ? "bg-amber-50 border-amber-200 text-amber-700 cursor-pointer hover:bg-amber-100" 
                    : "bg-transparent border-[#0D278D] text-[#0D278D] cursor-pointer hover:bg-[#0D278D] hover:text-white"
                  }`}
                >
                  <span>{isComingSoon ? "Lihat Detail" : "Lamar"}</span>
                  <ChevronRight
                    size={18}
                    className={`transition-all duration-300 ${isComingSoon ? "opacity-100 ml-1" : "opacity-0 -translate-x-2 w-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:w-4"}`}
                  />
                </button>
              </div>
            </motion.div>
          );})}
        </div>
      </motion.section>

{/* --- TAHAPAN SELEKSI SECTION (SINE WAVE DATA STREAM TIMELINE) --- */}
      <section
        id="tahapan"
        className="py-20 md:py-32 bg-white relative overflow-hidden border-y border-gray-100"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-40 -right-40 w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-28"
          >
            <span className="text-[#FEB700] font-bold text-sm tracking-widest uppercase mb-2 block">
              Timeline Pendaftaran
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D278D] mb-4 sm:mb-6">
              Tahapan Seleksi
            </h2>
            <p className="text-gray-500 leading-relaxed text-base sm:text-lg">
              Proses rekrutmen dilaksanakan secara transparan, akuntabel, dan
              bebas biaya untuk menjaring talenta terbaik bangsa.
            </p>
          </motion.div>

          <div className="relative w-full">
            
            {/* 🚀 1. DESKTOP HORIZONTAL FLUID WAVE (Tetap Statis & Aman!) */}
            <div className="hidden lg:block absolute inset-x-0 top-0 h-40 z-0 pointer-events-none">
              <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="desktopBlueStream" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0D278D" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#0D278D" />
                    <animate attributeName="x1" from="-100%" to="100%" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="x2" from="0%" to="200%" dur="3s" repeatCount="indefinite" />
                  </linearGradient>
                </defs>
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
                  d="M 50 110 C 130 110, 150 40, 240 40 C 330 40, 350 110, 440 110 C 530 110, 550 40, 640 40 C 730 40, 750 110, 840 110 C 930 110, 950 40, 1040 40 C 1130 40, 1140 110, 1185 110"
                  stroke="url(#desktopBlueStream)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 🚀 2. MOBILE & TABLET SINE WAVE STREAM (REVISI: Aliran Sungai Santai & Jarang) */}
            {/* Lebar dinaikkan jadi w-20 agar lengkungan ombak yang diregangkan tidak kepotong */}
            <div className="block lg:hidden absolute top-20 bottom-12 left-1/2 -translate-x-1/2 w-20 z-0 pointer-events-none overflow-hidden">
              <motion.svg 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8 }}
                className="w-full h-full" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Gradasi Biru Full */}
                  <linearGradient id="mobileSineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0D278D" />
                    <stop offset="50%" stopColor="#60A5FA" /> {/* Pendar Biru Air */}
                    <stop offset="100%" stopColor="#0D278D" />
                  </linearGradient>
                  
                  {/* 🚀 SETELAN BARU: Pattern gelombang diregangkan (height jadi 400px, dari sebelumnya 120px) */}
                  <pattern id="sineWavePattern" width="80" height="400" patternUnits="userSpaceOnUse">
                    {/* Path Gelombang lebih landai dan panjang */}
                    <path 
                      d="M 40 0 C 0 66, 0 133, 40 200 C 80 266, 80 333, 40 400" 
                      stroke="url(#mobileSineGrad)" 
                      fill="none" 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                    />
                    {/* 🚀 ANIMASI SANTUY: Durasi diperlambat total jadi 4.5 detik biar ngalir kaya sungai tenang */}
                    <animateTransform 
                      attributeName="patternTransform" 
                      type="translate" 
                      from="0 0" 
                      to="0 400" 
                      dur="15s" 
                      repeatCount="indefinite" 
                    />
                  </pattern>
                </defs>
                
                <rect width="100%" height="100%" fill="url(#sineWavePattern)" />
              </motion.svg>
            </div>

            {/* 🚀 LAYOUT CONTAINER HYBRID (Aman Gak Disentuh) */}
            <div className="flex flex-col lg:grid lg:grid-cols-6 gap-y-24 lg:gap-y-16 gap-x-4 relative z-10 w-full">
              {tahapanSeleksi.map((step, index) => {
                const isEven = (index + 1) % 2 === 0;

                return (
                  <div key={step.id} className="w-full relative z-10">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 35 : -35 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 95,
                      }}
                      className={`flex flex-row lg:flex-col items-center justify-center text-center group relative p-2 pt-0 w-full ${
                        isEven ? "lg:pt-0" : "lg:pt-16"
                      }`}
                    >
                      {/* SISI KIRI */}
                      {!isEven ? (
                        <div className="flex-1 text-right pr-6 sm:pr-8 lg:hidden block z-10">
                          <span className="block text-[11px] font-black tracking-widest text-[#0D278D]/20 mb-1 font-mono">
                            PHASE // 0{step.id}
                          </span>
                          <h3 className="text-sm sm:text-base font-black text-[#0D278D] group-hover:text-[#FEB700] transition-colors duration-300 leading-tight tracking-tight">
                            {step.title}
                          </h3>
                          <div className="w-6 h-[2px] bg-[#FEB700] inline-block mt-2 rounded-full transition-all duration-300 group-hover:w-12" />
                        </div>
                      ) : (
                        <div className="flex-1 lg:hidden block pointer-events-none" />
                      )}

                      {/* AREA CARD */}
                      <div className="relative z-10 w-24 h-24 md:w-26 md:h-26 rounded-[1.6rem] bg-white shadow-2xl shadow-blue-900/10 flex items-center justify-center border border-gray-100 group-hover:border-[#FEB700] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 shrink-0 mx-auto">
                        <div className="w-[74px] h-[74px] md:w-[82px] md:h-[82px] rounded-[1.2rem] bg-white border border-dashed border-gray-200 flex items-center justify-center transition-all group-hover:border-[#FEB700]/40 group-hover:bg-amber-50/30">
                          <div className="w-15 h-15 rounded-xl flex items-center justify-center shadow-inner bg-[#0D278D] text-white group-hover:bg-[#FEB700] group-hover:text-[#0D278D] transition-colors duration-500">
                            <step.icon size={24} strokeWidth={2.2} />
                          </div>
                        </div>
                        
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center border-[2.5px] border-white shadow-md bg-[#0D278D] text-white group-hover:bg-[#FEB700] group-hover:text-[#0D278D] transition-all duration-500 group-hover:rotate-12">
                          {step.id}
                        </div>
                      </div>

                      {/* SISI KANAN */}
                      {isEven ? (
                        <div className="flex-1 text-left pl-6 sm:pl-8 lg:hidden block z-10">
                          <span className="block text-[11px] font-black tracking-widest text-[#0D278D]/20 mb-1 font-mono">
                            PHASE // 0{step.id}
                          </span>
                          <h3 className="text-sm sm:text-base font-black text-[#0D278D] group-hover:text-[#FEB700] transition-colors duration-300 leading-tight tracking-tight">
                            {step.title}
                          </h3>
                          <div className="w-6 h-[2px] bg-[#FEB700] block mt-2 rounded-full transition-all duration-300 group-hover:w-12" />
                        </div>
                      ) : (
                        <div className="flex-1 lg:hidden block pointer-events-none" />
                      )}

                      {/* DESKTOP TEXT */}
                      <div className="relative z-10 bg-white px-3 py-1 rounded-md hidden lg:block mt-2">
                        <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-[#0D278D] group-hover:text-[#FEB700] transition-colors duration-300 leading-snug">
                          {step.title}
                        </h3>
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
        {/* 🚀 RESPONSIVE FIX: Padding diturunkan dikit di mobile (p-8 sm:p-16) dan lekukan disesuaikan (rounded-[2rem] sm:rounded-[3rem]) */}
        <div className="max-w-5xl mx-auto bg-[#0D278D] rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(13,39,141,0.4)] border border-white/10">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#FEB700] rounded-full blur-[80px] sm:blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-400 rounded-full blur-[80px] sm:blur-[120px] opacity-20 translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 sm:mb-8 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-[#FEB700] animate-pulse" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">
                Pendaftaran Sedang Dibuka
              </span>
            </div>

            {/* 🚀 RESPONSIVE FIX: Font size text-2xl sm:text-4xl md:text-5xl */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              Siap Berkontribusi bagi <span className="text-[#FEB700]">Negeri?</span>
            </h2>

            <p className="text-blue-100/80 text-sm sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Daftarkan diri Anda sekarang dan jadilah bagian dari tim yang
              berdedikasi menjaga kedaulatan air Indonesia. Kesempatan untuk
              membangun infrastruktur vital nasional ada di tangan Anda.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
              <button 
                onClick={() => handleActionPendaftaran()}
                className="group relative overflow-hidden bg-[#FEB700] text-[#0D278D] px-8 md:px-12 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(254,183,0,0.6)] flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer"
              >
                <span>Mulai Pendaftaran</span>
                <ArrowRight
                  size={20}
                  className="transform group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </button>

              <button className="group bg-white/5 border border-white/10 text-white px-8 md:px-12 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-3 w-full sm:w-auto shadow-lg">
                <MessageCircle
                  size={20}
                  className="text-blue-300 group-hover:-translate-y-1 group-hover:text-white transition-all duration-300"
                />
                <span>Hubungi Kami</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Beranda;