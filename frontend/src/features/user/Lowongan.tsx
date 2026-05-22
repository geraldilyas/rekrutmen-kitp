import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  Briefcase,
  GraduationCap,
  Filter,
  Sparkles,
  Users,
  Brain
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

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const Lowongan: React.FC = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = [
    "Semua",
    "Tenaga Pendukung",
    "Konsultan Individu",
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const getCategoryDisplay = (cat: string) => {
    if (cat === "tenaga_pendukung") return "Tenaga Pendukung";
    if (cat === "konsultan_individu") return "Konsultan Individu";
    return cat;
  };

  const formatDateRange = (start: string, end: string) => {
    if (!start || !end) return "";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    return `${startDate.getDate()} ${months[startDate.getMonth()]} - ${endDate.getDate()} ${months[endDate.getMonth()]} ${endDate.getFullYear()}`;
  };

  const filteredJobs =
    activeFilter === "Semua"
      ? jobs
      : jobs.filter((job) => getCategoryDisplay(job.category) === activeFilter);

  return (
    <div className="bg-white min-h-screen font-['Poppins']">

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
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D]">
              Lowongan Aktif
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Menampilkan{" "}
              <span className="text-[#FEB700] font-bold">
                {filteredJobs.length}
              </span>{" "}
              posisi tersedia
            </p>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] cursor-pointer font-bold border transition-all duration-300
              ${
                isFilterOpen
                  ? "bg-[#0D278D] text-white border-[#0D278D]"
                  : "bg-white text-[#0D278D] border-[#0D278D] hover:bg-[#0D278D] hover:text-white"
              }`}
            >
              <Filter size={18} />
              <span>{activeFilter}</span>
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{
                    width: 0,
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    width: "auto",
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    width: 0,
                    opacity: 0,
                    x: 10,
                  }}
                  className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 absolute md:relative right-0 top-14 md:top-auto z-30  whitespace-nowrap overflow-hidden"
                >
                  {filters.map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setActiveFilter(f);
                        setIsFilterOpen(false);
                      }}
                      className={`px-5 py-2.5 rounded-xl text-[14px] font-bold cursor-pointer transition-all duration-300
                      ${
                        activeFilter === f
                          ? "bg-white border border-[#0D278D] text-[#0D278D]"
                          : "text-gray-500 hover:text-[#0D278D]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* --- JOB LIST REVENUE FIX --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {loading ? (
            <div className="col-span-full text-center py-20 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mb-4"></div>
              <p className="text-gray-500 text-sm">Memuat lowongan...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <motion.div
                    layout
                    key={job.id}
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 rounded-3xl border border-gray-100 bg-white hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(254,183,0,0.3)] transition-all duration-500 flex flex-col relative overflow-hidden"
                  >
                    {/* ... job content ... */}
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={14} className="text-[#FEB700]" />
                        {formatDateRange(job.start_date, job.deadline)}
                      </span>

                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                          job.category === "konsultan_individu"
                            ? "bg-amber-50 text-[#FEB700]"
                            : "bg-blue-50 text-[#0D278D]"
                        }`}
                      >
                        {job.category === "konsultan_individu" ? (
                          <Brain size={12} />
                        ) : (
                          <Users size={12} />
                        )}
                        {getCategoryDisplay(job.category)}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#0D278D] mb-4 leading-tight">
                      {job.title}
                    </h3>

                    <p className="text-gray-500 text-[14px] leading-relaxed mb-8 flex-grow line-clamp-3">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={18} className="text-gray-400 mr-1" />
                        <span className="text-[11px] font-bold text-[#0D278D] bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          {job.qualification}
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/detail-lowongan/${job.id}`)}
                        className="group bg-transparent border-2 border-[#0D278D] text-[#0D278D] px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-[#0D278D] hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center overflow-hidden"
                      >
                        <span className="transition-transform duration-300">
                          Lihat Lowongan
                        </span>
                        <ChevronRight
                          size={18}
                          className="opacity-0 max-w-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:max-w-[20px] group-hover:ml-2 transition-all duration-300 ease-out shrink-0"
                        />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-32 flex flex-col items-center">
                  <Sparkles size={48} className="text-gray-200 mb-4" />
                  <h3 className="text-[#0D278D] font-bold text-xl">
                    Lowongan belum tersedia
                  </h3>
                  <p className="text-gray-400 mt-2 text-sm">
                    Maaf, saat ini belum ada posisi aktif untuk kategori ini.
                  </p>
                </div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Lowongan;