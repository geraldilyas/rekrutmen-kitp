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

  const formatDeadline = (dateStr: string) => {
    if (!dateStr) return "";
    const deadline = new Date(dateStr);
    const now = new Date();
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
  const isLoggedIn = !!localStorage.getItem("token"); 

  /*
    ==================================================
    HANDLER AKSI CONDITIONAL UTK PADA BUTTON LAMAR
    ==================================================
  */
  const handleActionPendaftaran = (jobId?: number) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      if (jobId) {
        navigate(`/detail-lowongan/${jobId}`); 
      } else {
        navigate("/lowongan");
      }
    }
  };

  return (
    <div className="bg-white min-h-screen pt-20 overflow-x-hidden font-['Poppins']">

      {/* --- HERO SECTION --- */}
      <section className="relative bg-[#0D278D] pt-32 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#08185A] via-[#0D278D] to-[#0A1E6E] z-0" />
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#FEB700]/15 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 opacity-13 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="inline-block px-5 py-2 rounded-full bg-white/10 border border-white/20 text-[#FEB700] font-bold text-xs mb-6 shadow-[0_0_20px_rgba(254,183,0,0.15)] backdrop-blur-md uppercase tracking-widest">
              REKRUTMEN KONSULTAN INDIVIDU & TENAGA PENDUKUNG
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 leading-tight tracking-tight">
              Membangun Negeri Melalui <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-yellow-200">
                Pengelolaan Sumber Daya Air
              </span>
            </h1>

            <p className="text-blue-100/90 mb-7 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
              Bergabunglah bersama Balai Besar Wilayah Sungai Kementerian PUPR.
              Kontribusi nyata untuk pembangunan infrastruktur vital nasional.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
              <button
                onClick={() =>
                  document
                    .getElementById("lowongan")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group relative overflow-hidden bg-[#FEB700] text-[#0D278D] px-8 py-4 rounded-2xl font-bold flex items-center cursor-pointer justify-center gap-2 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(254,183,0,0.5)]"
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
                className="bg-white/5 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 hover:border-white/30 cursor-pointer transition-all duration-300 backdrop-blur-sm shadow-lg"
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
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
        >
          <div>
            <h2 className="text-3xl font-bold text-[#0D278D] mb-2">
              Lowongan Pilihan
            </h2>
            <p className="text-gray-500">
              Temukan posisi yang sesuai dengan keahlian Anda
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/lowongan")}
            className="text-[#0D278D] font-bold flex items-center gap-1 hover:text-[#FEB700] transition-colors group cursor-pointer"
          >
            Look Semua Posisi
            <ChevronRight
              size={18}
              className="transform group-hover:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {loading ? (
              <div className="col-span-full text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mx-auto"></div>
              </div>
          ) : jobs.length === 0 ? (
              <div className="col-span-full text-center py-20">
                  <p className="text-gray-500">Belum ada lowongan aktif.</p>
              </div>
          ) : jobs.map((job) => (
            /* 🚀 SINKRONISASI EMAS: Kita tambahkan initial="hidden" dan animate="visible" langsung di card individu ini 
               sama persis dengan cara halaman Lowongan.tsx merender list-nya! */
            <motion.div
              key={job.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -8 }}
              className="p-8 rounded-[2rem] border border-gray-100 bg-white hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(254,183,0,0.3)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="px-4 py-1.5 rounded-xl bg-blue-50/50 text-[#0D278D] text-xs font-bold tracking-wider border border-blue-100">
                    {job.qualification}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                    <Clock size={14} />
                    <span>{formatDeadline(job.deadline)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Briefcase
                    size={16}
                    className={
                      job.category === "konsultan_individu"
                        ? "text-[#FEB700]"
                        : "text-[#0D278D]"
                    }
                  />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {getCategoryDisplay(job.category)}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#0D278D] mb-4 group-hover:text-[#FEB700] transition-colors leading-tight">
                  {job.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                  {job.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} className="text-gray-400 mr-1" />
                  <span className="w-auto px-3 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-bold text-[#0D278D]">
                      {job.qualification}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleActionPendaftaran(job.id)}
                  className="group bg-transparent border-1 border-[#0D278D] text-[#0D278D] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0D278D] cursor-pointer hover:text-white transition-all duration-300 shadow-sm flex items-center "
                >
                  <span>Lamar</span>
                  <ChevronRight
                    size={18}
                    className="opacity-0 -translate-x-2 w-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:w-4 transition-all duration-300"
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* --- TAHAPAN SELEKSI SECTION --- */}
      <section
        id="tahapan"
        className="py-32 bg-white relative overflow-hidden border-y border-gray-100"
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
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <span className="text-[#FEB700] font-bold text-sm tracking-widest uppercase mb-2 block">
              Timeline Pendaftaran
            </span>
            <h2 className="text-4xl font-extrabold text-[#0D278D] mb-6">
              Tahapan Seleksi
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Proses rekrutmen dilaksanakan secara transparan, akuntabel, dan
              bebas biaya untuk menjaring talenta terbaik bangsa.
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 1.8,
                ease: [0.25, 1, 0.5, 1],
                delay: 0.4,
              }}
              className="hidden lg:block absolute top-[44px] left-[8.33%] w-[83.34%] border-t-2 border-dashed border-[#0D278D] z-0 origin-left"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-4 relative z-10">
              {tahapanSeleksi.map((step, index) => {
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="flex flex-col items-center text-center group relative p-2"
                  >
                    <div className="relative z-10 w-20 h-20 md:w-22 md:h-22 mb-6 rounded-[1.2rem] bg-white shadow-xl shadow-blue-900/5 flex items-center justify-center border border-gray-100 group-hover:border-[#FEB700] group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-inner bg-[#0D278D] text-white group-hover:bg-[#FEB700] group-hover:text-[#0D278D] transition-colors duration-500">
                        <step.icon size={24} strokeWidth={2} />
                      </div>
                      <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center border-[2.5px] border-white shadow-sm bg-[#0D278D] text-white group-hover:bg-[#FEB700] group-hover:text-[#0D278D] transition-all duration-500 group-hover:rotate-12">
                        {step.id}
                      </div>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-[#0D278D] group-hover:text-[#FEB700] transition-colors duration-300 leading-snug px-1">
                      {step.title}
                    </h3>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto bg-[#0D278D] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(13,39,141,0.4)] border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FEB700] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-20 translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="relative z-10 z-0 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-[#FEB700] animate-pulse" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">
                Pendaftaran Sedang Dibuka
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Siap Berkontribusi bagi <span className="text-[#FEB700]">Negeri?</span>
            </h2>

            <p className="text-blue-100/80 text-lg mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Daftarkan diri Anda sekarang dan jadilah bagian dari tim yang
              berdedikasi menjaga kedaulatan air Indonesia. Kesempatan untuk
              membangun infrastruktur vital nasional ada di tangan Anda.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto">
              <button 
                onClick={() => handleActionPendaftaran()}
                className="group relative overflow-hidden bg-[#FEB700] text-[#0D278D] px-8 md:px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(254,183,0,0.6)] flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer"
              >
                <span>Mulai Pendaftaran</span>
                <ArrowRight
                  size={20}
                  className="transform group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </button>

              <button className="group bg-white/5 border border-white/10 text-white px-8 md:px-12 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-3 w-full sm:w-auto shadow-lg">
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