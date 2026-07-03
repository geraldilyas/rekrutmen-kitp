import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Users,
  GraduationCap,
  Award,
  Clock,
  ChevronRight,
  Brain,
  Filter,
  FileText,
  Sparkles
} from "lucide-react";
import { api, storageUrl } from "../../services/api";

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
  const filters = ["Semua", "Tenaga Pendukung", "Konsultan Individu"];

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // 🚀 FIXED SINKRONISASI: Menembak endpoint khusus pengumuman/kelulusan ril dari backend
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get("/announcements"); // 🛠️ Ganti ke rute endpoint pengumuman kelulusan asli lo
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDisplay = (cat: string) => {
    if (cat === "tenaga_pendukung" || cat === "Tenaga Pendukung") return "Tenaga Pendukung";
    if (cat === "konsultan_individu" || cat === "Konsultan Individu") return "Konsultan Individu";
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
    <div className="bg-white min-h-screen font-['Poppins']" onClick={() => setIsFilterOpen(false)}>

      {/* --- HERO TOP PANEL --- */}
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
              <span className="text-white text-[11px] font-bold tracking-[0.05] uppercase">
                Pengumuman Hasil Seleksi
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Pengumuman{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-[#ffe066]">
                Hasil Seleksi
              </span>
            </h1>

            <p className="text-blue-100/80 text-[15px] md:text-base max-w-2xl mx-auto leading-relaxed">
              Information resmi hasil kelulusan akhir, daftar nama kandidat terpilih, serta dokumen berita acara rekrutmen aktif.
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
              pengumuman kelulusan aktif
            </p>
          </div>

          <div className="flex items-center gap-3 relative" onClick={(e) => e.stopPropagation()}>
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
                             initial={{ width: 0, opacity: 0 }}
                             animate={{ width: "auto", opacity: 1 }}
                             exit={{ width: 0, opacity: 0 }}
                             transition={{ duration: 0.35, ease: "easeOut" }}
                             className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 absolute md:relative right-0 top-14 md:top-auto z-30 whitespace-nowrap overflow-hidden"
                           >
                             {filters.map((filter) => (
                               <button
                                 key={filter}
                                 onClick={() => { setActiveFilter(filter); setIsFilterOpen(false); }}
                                 className={`px-5 h-[40px] flex items-center justify-center rounded-xl text-[14px] font-bold cursor-pointer transition-all duration-300 whitespace-nowrap ${
                                   activeFilter === filter ? "bg-white border border-[#0D278D] text-[#0D278D] shadow-[0_2px_10px_rgba(0,0,0,0.04)]" : "text-gray-500 hover:text-[#0D278D] hover:bg-blue-50/50"
                                 }`}
                               >
                                 {filter}
                               </button>
                             ))}
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                   </motion.div>

        {/* --- CONTAINER PENGUMUMAN SELEKSI LIST --- */}
        <motion.div variants={itemVariants} className="space-y-2">
          <AnimatePresence mode="popLayout">
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
                    ) : filteredData.length === 0 ? (
                <div className="text-center py-20 bg-gray-50/40 rounded-3xl border border-gray-100/70 p-8 flex flex-col items-center">
                    <Sparkles size={40} className="text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium text-sm">Belum ada dokumen pengumuman hasil seleksi aktif saat ini.</p>
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
                          item.category === "konsultan_individu" || item.category === "Konsultan Individu"
                            ? "bg-amber-50 text-[#FEB700]"
                            : "bg-blue-50 text-[#0D278D]"
                        }`}
                      >
                        {item.category === "konsultan_individu" || item.category === "Konsultan Individu" ? (
                          <Brain size={12} />
                        ) : (
                          <Users size={12} />
                        )}
                        {getCategoryDisplay(item.category)}
                      </span>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={14} className="text-[#FEB700]" />{" "}
                        Diumumkan pada {formatDate(item.deadline)}
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-[#0D278D] mb-4 transition-colors group-hover:text-[#FEB700]">
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
                          <Users size={16} /> {item.applications_count || 0} Pelamar Terdaftar
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <Award size={16} /> {item.accepted_count || 0} Lolos Seleksi
                        </span>
                      </div>
                    </div>

                    {item.announcements && item.announcements.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-dashed border-gray-100 space-y-3">
                        <p className="text-[10px] font-black text-[#0D278D] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                          <FileText size={12} /> Lampiran Dokumen SK Kelulusan Resmi
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {item.announcements.map((doc) => (
                            <a 
                              key={doc.id}
                              href={storageUrl(doc.file_path)}
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
                        const fileUrl = storageUrl(item.announcements[0]?.file_path);
                        window.open(fileUrl, "_blank");
                      }}
                      className="bg-transparent border-2 border-[#0D278D] text-[#0D278D] px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-[#0D278D] hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center overflow-hidden"
                    >
                      <div className="group/btn flex items-center justify-center">
                        <span className="transition-transform duration-300">Lihat Pengumuman</span>
                        <ChevronRight
                          size={18}
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