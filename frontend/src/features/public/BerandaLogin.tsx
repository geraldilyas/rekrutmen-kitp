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
  Users,
  Megaphone,
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

// 🚀 DIEXPORT SEBAGAI KOMPONENT SESUDAH LOGIN BERSAMA
export const BerandaLogin: React.FC = () => {
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
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setJobs(data.slice(0, 4)); // Mengunci top 4 formasi pilihan database lo
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
                onClick={() =>
                  document
                    .getElementById("lowongan")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group relative overflow-hidden bg-[#FEB700] text-[#0D278D] px-8 py-3.5 sm:py-4 rounded-2xl font-bold flex items-center cursor-pointer justify-center gap-2 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(254,183,0,0.5)] w-full sm:w-auto"
              >
                <span>Lihat Lowongan Aktif</span>
                <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
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
      <motion.section
        id="lowongan"
        className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 md:gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D278D] mb-2">Lowongan Pilihan</h2>
            <p className="text-gray-500 text-sm md:text-base">Temukan posisi yang sesuai dengan keahlian Anda</p>
          </div>
          <button type="button" onClick={() => navigate("/lowongan")} className="text-[#0D278D] font-bold flex items-center gap-1 hover:text-[#FEB700] transition-colors group cursor-pointer text-sm md:text-base">
            <span>Lihat Semua Posisi</span>
            <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mx-auto" /></div>
          ) : jobs.length === 0 ? (
            <div className="col-span-full text-center py-20"><p className="text-gray-500">Belum ada lowongan aktif.</p></div>
          ) : jobs.map((job) => {
            const isComingSoon = new Date() < new Date(job.start_date);
            return (
              <motion.div key={job.id} variants={itemVariants} initial="hidden" animate="visible" whileHover={isComingSoon ? {} : { y: -8 }} className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 bg-white transition-all duration-300 flex flex-col justify-between ${isComingSoon ? "opacity-95" : "hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(254,183,0,0.3)]"}`}>
                <div>
                  <div className="flex justify-between items-center mb-6 gap-2">
                    <span className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold tracking-wider border truncate ${isComingSoon ? "bg-gray-50 text-gray-400 border-gray-100" : "bg-blue-50/50 text-[#0D278D] border-blue-100"}`}>{job.qualification}</span>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 shrink-0"><Clock size={14} /><span>{formatDeadline(job.deadline, job.start_date)}</span></div>
                  </div>
                  <div className="flex items-center gap-2 mb-3"><Briefcase size={16} className={isComingSoon ? "text-gray-300" : job.category === "konsultan_individu" ? "text-[#FEB700]" : "text-[#0D278D]"} /><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{getCategoryDisplay(job.category)}</span></div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 transition-colors leading-tight ${isComingSoon ? "text-gray-400" : "text-[#0D278D] group-hover:text-[#FEB700]"}`}>{job.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 sm:mb-8 line-clamp-3">{job.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-50 gap-2">
                  <div className="flex items-center gap-1 sm:gap-2 overflow-hidden"><GraduationCap size={18} className="text-gray-400 mr-1 shrink-0" /><span className="w-auto px-2.5 sm:px-3 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-[#0D278D] truncate">{job.qualification}</span></div>
                  <button onClick={() => handleActionPendaftaran(job)} className={`group px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm flex items-center shrink-0 border-1 ${isComingSoon ? "bg-amber-50 border-amber-200 text-amber-700 cursor-pointer" : "bg-transparent border-[#0D278D] text-[#0D278D] cursor-pointer hover:bg-[#0D278D] hover:text-white"}`}>
                    <span>{isComingSoon ? "Lihat Detail" : "Lamar"}</span>
                    <ChevronRight size={18} className={`transition-all duration-300 ${isComingSoon ? "opacity-100 ml-1" : "opacity-0 -translate-x-2 w-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:w-4"}`} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

     {/* ===================================================================
          🌊 FIXED HORIZONTAL STREAM TIMELINE SYSTEM: DYNAMIC RIVER CLIP-PATH SYSTEM (UPDATED)
          =================================================================== */}
      <section id="tahapan" className="py-24 bg-white relative overflow-hidden border-y border-gray-100 font-['Poppins']">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-40 -right-40 w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          {/* Header Title Section */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#FEB700] bg-amber-500/5 px-3.5 py-1.5 rounded-xl mb-3.5 inline-block select-none">
              Alur Rekrutmen BBWSMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D278D] mb-4 tracking-tight">
              Tahapan Seleksi Resmi
            </h2>
            <div className="w-12 h-[3px] bg-[#FEB700] rounded-full mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Proses rekrutmen dilaksanakan secara transparan, akuntabel, dan bebas biaya melalui sistem penyeleksian berkas digital terintegrasi.
            </p>
          </div>

          {/* Container Alur Garis Lurus */}
          <div className="relative w-full px-4 md:px-10">
            
            {/* 🌊 DESKTOP GRADIENT LINE: FIXED ANTI-STRETCH (Menggunakan Masking Clip-Path Berarus Mulus) */}
            <div className="hidden lg:block absolute inset-x-[10%] top-14 h-[5px] z-0 pointer-events-none">
              <motion.div 
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
                className="w-full h-full bg-gradient-to-r from-[#0D278D] via-[#2563EB] to-[#FEB700] rounded-full relative overflow-hidden"
              >
                {/* Efek Kilauan Arus Air Bergerak Super Kontras di Dalam Garis */}
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
                />
              </motion.div>
            </div>

            {/* 🌊 MOBILE VERTICAL LINE: FIXED ANTI-STRETCH (Mekar Kebawah via Clip-Path) */}
            <div className="block lg:hidden absolute top-6 bottom-6 left-10 md:left-12 w-[4px] z-0 pointer-events-none">
              <motion.div
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
                className="w-full h-full bg-gradient-to-b from-[#0D278D] via-[#2563EB] to-[#FEB700] rounded-full"
              />
            </div>

            {/* Barisan Card Bulat: Otomatis Menjadi Grid 5 Kolom Sesuai Jumlah Tahap */}
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-y-12 lg:gap-x-4 relative z-10 w-full">
              {tahapanSeleksi
                // 🚀 FILTER: Membuang Tahap Pengumuman Administrasi secara aman
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
                        {/* 🚀 CARD BULAT UTAMA */}
                        <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-[0_10px_30px_-15px_rgba(13,39,141,0.08)] group-hover:border-[#FEB700] group-hover:shadow-[0_20px_40px_-15px_rgba(254,183,0,0.25)] transition-all duration-300 shrink-0">
                          <div className="w-[66px] h-[66px] sm:w-[78px] sm:h-[78px] rounded-full bg-white border border-dashed border-gray-200 flex items-center justify-center group-hover:border-amber-300 transition-colors">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-inner bg-[#0D278D] text-white group-hover:bg-[#FEB700] group-hover:text-[#0D278D] transition-colors duration-300">
                              <step.icon size={20} strokeWidth={2.2} />
                            </div>
                          </div>
                          {/* Badge Angka Penanda Urutan Urutan Baru (1 Sampai 5) */}
                          <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full font-bold text-[11px] flex items-center justify-center border-2 border-white bg-[#0D278D] text-white group-hover:bg-[#FEB700] group-hover:text-[#0D278D] font-mono shadow-sm transition-all duration-300">
                            {index + 1}
                          </div>
                        </div>

                        {/* Detail Deskripsi Teks */}
                        <div className="text-left lg:text-center pl-6 lg:pl-0 lg:mt-5 flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-[#0D278D] group-hover:text-[#FEB700] transition-colors duration-200 leading-tight tracking-tight truncate max-w-full">
                            {step.title}
                          </h3>
                          <div className="w-4 h-[2px] bg-[#FEB700] rounded-full mt-2 lg:mx-auto transition-all duration-300 group-hover:w-10 opacity-0 group-hover:opacity-100" />
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FEB700] rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-[80px] opacity-20 translate-y-1/3 -translate-x-1/3" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 sm:mb-8"><span className="w-2 h-2 rounded-full bg-[#FEB700] animate-pulse" /><span className="text-white text-xs font-bold tracking-widest uppercase">Pendaftaran Sedang Dibuka</span></div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight">Siap Berkontribusi bagi <span className="text-[#FEB700]">Negeri?</span></h2>
            <p className="text-blue-100/80 text-sm sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto font-light leading-relaxed">Daerah aliran sungai dan bendungan nasional menanti bakti Anda. Daftarkan diri Anda sekarang bersama kementerian PUPR.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
              <button onClick={() => handleActionPendaftaran()} className="group bg-[#FEB700] text-[#0D278D] px-8 md:px-12 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-all"><span>Mulai Pendaftaran</span><ArrowRight size={20} className="transform group-hover:translate-x-1.5 transition-transform" /></button>
              <button className="group bg-white/5 border border-white/10 text-white px-8 md:px-12 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 backdrop-blur-md hover:bg-white/10 transition-all"><MessageCircle size={20} className="text-blue-300 group-hover:-translate-y-1 transition-all" /><span>Hubungi Kami</span></button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BerandaLogin;