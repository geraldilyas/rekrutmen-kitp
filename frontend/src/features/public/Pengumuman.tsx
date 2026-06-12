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
  FileText,
  Sparkles
} from "lucide-react";
import { api } from "../../services/api";

// Interface yang disempurnakan agar mendukung struktur data langsung maupun relasi nested backend
interface Announcement {
  id: number;
  job_id?: number;
  title: string;
  category?: string;
  description?: string;
  qualification?: string;
  deadline?: string;
  published_at?: string;
  file_path?: string;
  applications_count?: number;
  accepted_count?: number;
  // Jika backend mengembalikan relasi object job di dalam pengumuman
  job?: {
    id: number;
    title: string;
    category: string;
    description: string;
    qualification: string;
    deadline: string;
    applications_count?: number;
    accepted_count?: number;
  };
  // Jika backend mengembalikan array pengumuman di dalam lowongan
  announcements?: Array<{
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
      const res = await api.get("/announcements");
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
    return cat || "Umum";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Memastikan ekstraksi kategori aman baik dari objek utama maupun dari nested objek .job
  const filteredData =
    activeFilter === "Semua"
      ? announcements
      : announcements.filter((item) => {
          const category = item.job?.category || item.category || "";
          return getCategoryDisplay(category) === activeFilter;
        });

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
              <span className="text-white text-[11px] font-bold tracking-widest uppercase">
                Pusat Informasi Official
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Pengumuman{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-[#ffe066]">
                Hasil Seleksi
              </span>
            </h1>

            <p className="text-blue-100/80 text-[15px] md:text-base max-w-2xl mx-auto leading-relaxed">
              Informasi resmi hasil kelulusan akhir, daftar nama kandidat terpilih, serta dokumen berita acara rekrutmen aktif.
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
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-[115%] bg-white border border-gray-100 rounded-2xl shadow-xl p-1.5 z-40 min-w-[200px]"
                >
                  {filters.map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setActiveFilter(f);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all duration-200 block ${
                        activeFilter === f
                          ? "bg-blue-50 text-[#0D278D]"
                          : "text-gray-500 hover:bg-gray-50 hover:text-[#0D278D]"
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

        {/* --- CONTAINER PENGUMUMAN SELEKSI LIST --- */}
        <motion.div variants={itemVariants} className="space-y-2">
          <AnimatePresence mode="popLayout">
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mx-auto"></div>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="text-center py-20 bg-gray-50/40 rounded-3xl border border-gray-100/70 p-8 flex flex-col items-center">
                    <Sparkles size={40} className="text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium text-sm">Belum ada dokumen pengumuman hasil seleksi aktif saat ini.</p>
                </div>
            ) : filteredData.map((item) => {
              // Menentukan variabel fallback penampung data agar support multi-struktur API
              const itemCategory = item.job?.category || item.category || "";
              const itemTitle = item.job?.title || item.title;
              const itemDescription = item.job?.description || item.description || "";
              const itemQualification = item.job?.qualification || item.qualification || "-";
              const itemDate = item.published_at || item.deadline || "";
              const appCount = item.job?.applications_count || item.applications_count || 0;
              const accCount = item.job?.accepted_count || item.accepted_count || 0;
              const targetJobId = item.job?.id || item.job_id || item.id;

              return (
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
                            itemCategory === "konsultan_individu" || itemCategory === "Konsultan Individu"
                              ? "bg-amber-50 text-[#FEB700]"
                              : "bg-blue-50 text-[#0D278D]"
                          }`}
                        >
                          {itemCategory === "konsultan_individu" || itemCategory === "Konsultan Individu" ? (
                            <Brain size={12} />
                          ) : (
                            <Users size={12} />
                          )}
                          {getCategoryDisplay(itemCategory)}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={14} className="text-[#FEB700]" />{" "}
                          Diumumkan pada {formatDate(itemDate)}
                        </span>
                      </div>

                      <h3 className="text-2xl font-extrabold text-[#0D278D] mb-4 transition-colors group-hover:text-[#FEB700]">
                        {itemTitle}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-3xl line-clamp-2">
                        {itemDescription}
                      </p>

                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={18} className="text-gray-400" />
                          <span className="px-2 py-0.5 rounded bg-gray-50 text-[10px] font-black text-[#0D278D] border border-gray-100 uppercase">
                              {itemQualification}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-bold text-gray-400 border-l border-gray-100 pl-6">
                          <span className="flex items-center gap-1.5">
                            <Users size={16} /> {appCount} Pelamar Terdaftar
                          </span>
                          <span className="flex items-center gap-1.5 text-emerald-600">
                            <Award size={16} /> {accCount} Lolos Seleksi
                          </span>
                        </div>
                      </div>

                      {/* 📄 LAMPIRAN DOKUMEN SK (Otomatis mendeteksi tipe Array maupun File Tunggal) */}
                      {((item.announcements && item.announcements.length > 0) || item.file_path) && (
                        <div className="mt-8 pt-6 border-t border-dashed border-gray-100 space-y-3">
                          <p className="text-[10px] font-black text-[#0D278D] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            <FileText size={12} /> Lampiran Dokumen SK Kelulusan Resmi
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {item.announcements && item.announcements.length > 0 ? (
                              item.announcements.map((doc) => (
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
                              ))
                            ) : (
                              // Fallback jika item adalah object baris tunggal dari tabel announcements langsung
                              <a 
                                href={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/storage/${item.file_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-50/50 hover:bg-[#0D278D] border border-blue-100/50 rounded-xl text-xs font-bold text-[#0D278D] hover:text-white transition-all duration-300 group/link shadow-sm hover:shadow-md"
                              >
                                <FileText size={14} className="group-hover/link:animate-bounce" />
                                <span>{item.title || "Unduh Dokumen Pengumuman"}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center md:items-center">
                      <button 
                        onClick={() => {
                          const targetParam = !isLoggedIn ? "?status=logout" : "";
                          navigate(`/detail-lowongan/${targetJobId}${targetParam}`);
                        }}
                        className="bg-transparent border-2 border-[#0D278D] text-[#0D278D] px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-[#0D278D] hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center overflow-hidden"
                      >
                        <div className="group/btn flex items-center justify-center">
                          <span className="transition-transform duration-300">Detail Formasi</span>
                          <ChevronRight
                            size={18}
                            className="opacity-0 max-w-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 group-hover/btn:max-w-[18px] group-hover/btn:ml-1.5 transition-all duration-300 ease-out shrink-0"
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Pengumuman;