import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Megaphone,
  Users,
  GraduationCap,
  Award,
  Clock,
  ChevronRight,
  Brain,
  Filter,
  FileText
} from "lucide-react";
import { api } from "../../services/api";

interface Announcement {
  id: number;
  title: string;
  category: string;
  description: string;
  qualification: string;
  deadline: string;
  applications_count: number;
  accepted_count: number;
  announcements: Array<{
    id: number;
    title: string;
    file_path: string;
    published_at: string;
  }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const Pengumuman: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !location.search.includes("status=logout");
  const filters = ["Semua", "Tenaga Pendukung", "Konsultan Individu"];

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs?finished=1");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDisplay = (cat: string) => {
    if (cat === "tenaga_pendukung") return "Tenaga Pendukung";
    if (cat === "konsultan_individu") return "Konsultan Individu";
    return cat;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const filteredData =
    activeFilter === "Semua"
      ? announcements
      : announcements.filter((item) => getCategoryDisplay(item.category) === activeFilter);

  return (
    <div className="bg-white min-h-screen font-['Poppins']">

      <div className="bg-[#0D278D] pt-32 pb-24 relative rounded-b-[2.5rem] md:rounded-b-[4rem] overflow-hidden">
        <div className="absolute inset-0 opacity-13 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FEB700]/10 rounded-full blur-[100px]" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
              <Megaphone size={16} className="text-[#FEB700]" />
              <span className="text-white text-[11px] font-bold tracking-widest uppercase">
                Pusat Informasi
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Pengumuman{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-[#ffe066]">
                Hasil Seleksi
              </span>
            </h1>

            <p className="text-blue-100/80 text-[15px] md:text-base max-w-2xl mx-auto leading-relaxed">
              Informasi resmi hasil seleksi akhir, daftar kandidat yang
              nyatakan diterima, serta penutupan tahapan rekrutmen.
            </p>
          </motion.div>
        </div>
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
              Hasil Akhir Seleksi
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Menampilkan{" "}
              <span className="text-[#FEB700] font-bold">
                {filteredData.length}
              </span>{" "}
              pengumuman aktif
            </p>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-[1rem] text-[14px] font-bold cursor-pointer border transition-all duration-300 ${
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
                  initial={{ width: 0, opacity: 0, x: 10 }}
                  animate={{ width: "auto", opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: 10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 absolute md:relative right-0 top-14 md:top-auto z-30 whitespace-nowrap overflow-hidden"
                >
                  <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] ml-2 w-max whitespace-nowrap">
                    {filters.map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setActiveFilter(f);
                          setIsFilterOpen(false);
                        }}
                        className={`px-5 h-[40px] flex items-center justify-center rounded-xl text-[14px] font-bold cursor-pointer transition-all duration-300 whitespace-nowrap ${
                          activeFilter === f
                            ? "bg-white border border-[#0D278D] text-[#0D278D] shadow-sm"
                            : "text-gray-500 hover:text-[#0D278D]"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <AnimatePresence mode="popLayout">
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mx-auto"></div>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500">Belum ada pengumuman hasil seleksi.</p>
                </div>
            ) : filteredData.map((item) => (
              <motion.div
                layout
                key={item.id}
                exit={{ opacity: 0, y: -10 }}
                className="group border-b border-gray-100 py-10 relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FEB700] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center rounded-r-full" />

                <div className="px-4 flex flex-col md:flex-row justify-between gap-8 group-hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                          item.category === "konsultan_individu"
                            ? "bg-amber-50 text-[#FEB700]"
                            : "bg-blue-50 text-[#0D278D]"
                        }`}
                      >
                        {item.category === "konsultan_individu" ? (
                          <Brain size={12} />
                        ) : (
                          <Users size={12} />
                        )}
                        {getCategoryDisplay(item.category)}
                      </span>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={14} className="text-[#FEB700]" />{" "}
                        Ditutup pada {formatDate(item.deadline)}
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-[#0D278D] mb-4 group- transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-3xl line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={18} className="text-gray-400" />
                        <span className="px-2 py-0.5 rounded bg-gray-50 text-[10px] font-black text-[#0D278D] border border-gray-100 uppercase">
                            {item.qualification}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm font-bold text-gray-400 border-l border-gray-100 pl-6">
                        <span className="flex items-center gap-1.5">
                          <Users size={16} /> {item.applications_count} Pendaftar
                        </span>
                        <span className="flex items-center gap-1.5 text-[#0D278D]">
                          <Award size={16} /> {item.accepted_count} Diterima
                        </span>
                      </div>
                    </div>

                    {/* 📄 DOKUMEN PENGUMUMAN RESMI */}
                    {item.announcements && item.announcements.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-dashed border-gray-100 space-y-3">
                        <p className="text-[10px] font-black text-[#FEB700] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                          <FileText size={12} /> Dokumen Resmi Hasil Seleksi
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {item.announcements.map((doc) => (
                            <a 
                              key={doc.id}
                              href={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/storage/${doc.file_path}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-50/50 hover:bg-[#0D278D] border border-blue-100/50 rounded-xl text-xs font-bold text-[#0D278D] hover:text-white transition-all duration-300 group/link shadow-sm hover:shadow-md"
                            >
                              <FileText size={14} className="group-hover/link:animate-bounce" />
                              <span>{doc.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                    <div className="flex items-center md:items-center">
                      <button 
                        onClick={() => {
                            const targetParam = !isLoggedIn ? "?status=logout" : "";
                            navigate(`/detail-lowongan/${item.id}${targetParam}`);
                          }}
                        className="bg-transparent border-2 border-[#0D278D] text-[#0D278D] px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-[#0D278D] hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center overflow-hidden"
                      >
                        <div className="group/btn flex items-center justify-center">
                          <span className="transition-transform duration-300">Lihat Hasil</span>
                          <ChevronRight
                            size={18}
                            data-framer-appear-id="ignore"
                            className="opacity-0 max-w-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 group-hover/btn:max-w-[18px] group-hover/btn:ml-1.5 transition-all duration-300 ease-out shrink-0"
                          />
                        </div>
                      </button>
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Pengumuman;