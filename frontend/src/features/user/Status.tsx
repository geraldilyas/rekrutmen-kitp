import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  Brain,
  CircleDot,
  Activity,
  Filter,
  Download,
  UserCheck,
  Search,
  Users,
  Briefcase,
  Lock,
} from "lucide-react";
import { api } from "../../services/api";

interface TimelineStep {
  id: number | string;
  name: string;
  status: "aktif" | "selesai" | "locked" | "Lulus" | "Tidak Lulus" | string;
  notes: string | null;
  score?: number | null;
  download_pdf_lulus?: string | null;
  total_applicants?: number;
  end_date?: string | null;
}

interface Application {
  id: number;
  status: string; // 'pending', 'seleksi', 'Lulus', 'Tidak Lulus'
  applied_at: string;
  created_at?: string;
  job?: {
    id: number;
    title: string;
    category: string;
    qualification: string;
  };
  job_vacancy?: {
    id: number;
    title: string;
    category: string;
    qualification: string;
  };
  timeline?: TimelineStep[]; 
}

const mainContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const mainItemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export const StatusLamaran: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Menyimpan ID string/number tahapan yang sedang dibuka rincian detailnya
  const [activeInlineStage, setActiveInlineStage] = useState<{ [key: number]: string | number | null }>({});

  const filters = ["Semua", "Tenaga Pendukung", "Konsultan Individu"];

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/applications/my?t=${new Date().getTime()}`);
      
      // Amankan pembungkus data response (mendukung data langsung atau data.data)
      const responseData = res.data;
      const rawList = responseData.data || (Array.isArray(responseData) ? responseData : []);
      
      setApplications(rawList);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMyApplications();
  }, [navigate]);

  const getCategoryDisplay = (cat: string) => {
    if (!cat) return "-";
    if (cat === "tenaga_pendukung" || cat.toLowerCase() === "tenaga pendukung") return "Tenaga Pendukung";
    if (cat === "konsultan_individu" || cat.toLowerCase() === "konsultan individu") return "Konsultan Individu";
    return cat;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Sesuai ketentuan";
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  /**
   * Mengalkulasi progress bar line injector berdasarkan timeline step aktif
   */
  const getTimelineProgress = (timeline: TimelineStep[]) => {
    if (!timeline || timeline.length === 0) return 0;
    const activeOrDoneIndex = timeline.findLastIndex(
      step => step.status === 'selesai' || step.status === 'aktif' || step.status === 'Lulus' || step.status === 'Tidak Lulus'
    );
    if (activeOrDoneIndex <= 0) return 0;
    return (activeOrDoneIndex / (timeline.length - 1)) * 100;
  };

  const handleStageIconClick = (appId: number, stageId: string | number) => {
    setActiveInlineStage((prev) => ({
      ...prev,
      [appId]: prev[appId] === stageId ? null : stageId,
    }));
  };

  // Ekstraksi objek job secara aman (mengantisipasi null atau variasi nama key dari backend)
  const getSafeJobData = (app: Application) => {
    return app.job || app.job_vacancy || {
      id: 0,
      title: "Posisi Lowongan Tidak Diketahui",
      category: "Semua",
      qualification: "Sesuai Ketentuan"
    };
  };

  const filteredJobs = activeFilter === "Semua"
    ? applications
    : applications.filter((app) => {
        const targetJob = getSafeJobData(app);
        return getCategoryDisplay(targetJob.category) === activeFilter;
      });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    if (expandedId === id) {
      setActiveInlineStage((prev) => ({ ...prev, [id]: null }));
    }
  };

  return (
    <div className="bg-white min-h-screen font-['Poppins']">

      {/* --- HERO MONITORING HEADER --- */}
      <div className="bg-[#0D278D] pt-32 pb-24 relative rounded-b-[2.5rem] md:rounded-b-[4rem] z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FEB700]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 shadow-sm backdrop-blur-sm">
              <Activity size={16} className="text-[#FEB700]" />
              <span className="text-white text-[11px] font-bold tracking-widest uppercase">Monitoring</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Status <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-[#ffe066]">Lamaran</span>
            </h1>
            <p className="text-blue-100/80 text-[15px] md:text-base font-medium max-w-xl mx-auto leading-relaxed">
              Pantau seluruh progress rekrutmen Anda secara real-time dan transparan sesuai tahapan seleksi aktif.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-0" variants={mainContainerVariants} initial="hidden" animate="visible">
        
        {/* Riwayat Lamaran Title & Dropdown Filter */}
        <motion.div variants={mainItemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-100 pb-8 relative">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] tracking-tight">Riwayat Lamaran</h2>
            <p className="text-sm text-gray-500 font-medium mt-2">
              Menampilkan <span className="text-[#FEB700] font-bold">{filteredJobs.length}</span> data
            </p>
          </div>

          <div className="flex items-center relative gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-bold border cursor-pointer transition-all duration-300 ${
                isFilterOpen ? "bg-[#0D278D] text-white border-[#0D278D]" : "bg-white text-[#0D278D] border-[#0D278D] hover:bg-[#0D278D] hover:text-white"
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

        {/* Applications Main Card Section */}
        <motion.div layout className="flex flex-col" variants={mainItemVariants}>
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mx-auto"></div>
              </div>
            ) : filteredJobs.map((app) => {
              // Menghindari kegagalan render total dengan fungsi getSafeJobData
              const targetJob = getSafeJobData(app);

              const timeline = app.timeline || [];
              const currentInlineStageId = activeInlineStage[app.id] ?? null;
              
              // Cari detail step yang sedang dibuka pelamar
              const activeStageDetail = timeline.find(step => step.id === currentInlineStageId);

              return (
                <motion.div layout key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, overflow: "hidden" }} transition={{ duration: 0.5, ease: "easeInOut" }} className="border-b border-gray-100 last:border-0 group relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FEB700] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-r-full z-10" />

                  <div onClick={() => toggleExpand(app.id)} className="py-6 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer transition-colors duration-300 hover:bg-gray-50/30">
                    <div className="flex-1 w-full group-hover:translate-x-2 transition-transform duration-300">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#FEB700]" /> {formatDate(app.applied_at || app.created_at || "")}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 hidden md:block" />
                        <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded-md ${targetJob.category === "konsultan_individu" ? "bg-amber-50 text-[#FEB700]" : "bg-blue-50 text-[#0D278D]"}`}>
                          {targetJob.category === "konsultan_individu" ? <Brain size={12} /> : <Users size={12} />}
                          {getCategoryDisplay(targetJob.category)}
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-[#0D278D] mb-3 leading-tight">{targetJob.title}</h3>

                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-gray-400 mr-1" />
                        <span className="text-[13px] font-medium text-gray-600">{targetJob.qualification}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto gap-6 mt-4 md:mt-0">
                      <div className={`px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 border ${app.status === 'Tidak Lulus' || app.status === 'tidak_lulus' ? "bg-red-50 text-red-600 border-red-100" : app.status === 'Lulus' || app.status === 'lulus' ? "bg-green-50 text-green-600 border-green-100" : "bg-white text-[#0D278D] border-[#0D278D]"}`}>
                        {app.status === 'Tidak Lulus' || app.status === 'tidak_lulus' ? <XCircle size={16} /> : app.status === 'Lulus' || app.status === 'lulus' ? <CheckCircle2 size={16} /> : <Clock size={16} className="text-[#FEB700]" />}
                        {app.status === 'pending' || app.status === 'seleksi' ? 'Sedang Proses' : app.status}
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${expandedId === app.id ? "rotate-180 bg-[#0D278D] text-white shadow-md" : "text-gray-400 group-hover:bg-white group-hover:text-[#0D278D] group-hover:shadow-sm"}`}>
                        <ChevronDown size={22} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Timeline Accordion Row */}
                  <AnimatePresence>
                    {expandedId === app.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.48, ease: "easeInOut" }} className="overflow-hidden bg-gray-50/10">
                        <div className="pt-4 pb-12 px-4 sm:px-6">
                          <h4 className="text-[13px] font-semibold text-gray-400 mb-12 text-center md:text-left flex items-center gap-2 justify-center md:justify-start">
                            <Activity size={16} className="text-[#FEB700]" />
                            Klik ikon lingkaran alur di bawah untuk melihat rincian catatan dari tim penilai lowongan ini.
                          </h4>

                          <div className="relative mb-6">
                            {/* Garis Horizontal Penghubung Antar Node Timeline Dinamis */}
                            <div className="hidden md:block absolute top-[22px] left-[4%] right-[4%] z-0">
                              <div className="h-[2px] w-full bg-gray-100" />
                              {timeline.length > 1 && (
                                <motion.div 
                                  initial={{ width: 0 }} 
                                  animate={{ width: `${getTimelineProgress(timeline)}%` }} 
                                  className={`absolute top-0 left-0 h-[2px] transition-all duration-700 ease-out ${app.status === 'Tidak Lulus' || app.status === 'tidak_lulus' ? "bg-red-500" : app.status === 'Lulus' || app.status === 'lulus' ? "bg-green-500" : "bg-[#0D278D]"}`} 
                                />
                              )}
                            </div>

                            <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-0 relative z-10 w-full">
                              {timeline.map((step) => {
                                let circleClass = "bg-white border-[2px] border-gray-200 text-gray-300";
                                let titleClass = "text-gray-400 font-medium";
                                let IconComponent = CircleDot;

                                // Penentuan warna step alur timeline berdasarkan response dinamis Laravel
                                if (step.status === 'selesai') {
                                  circleClass = "bg-[#0D278D] border-[#0D278D] text-white shadow-[0_4px_15px_rgba(13,39,141,0.2)] cursor-pointer hover:scale-110";
                                  titleClass = "text-[#0D278D] font-bold";
                                  IconComponent = CheckCircle2;
                                } else if (step.status === 'aktif') {
                                  circleClass = "bg-white border-[#FEB700] text-[#FEB700] ring-4 ring-yellow-50 cursor-pointer hover:scale-110";
                                  titleClass = "text-[#0D278D] font-bold";
                                  IconComponent = Clock;
                                } else if (step.status === 'tidak_lulus' || step.status === 'Tidak Lulus') {
                                  circleClass = "bg-red-500 border-red-500 text-white shadow-[0_4px_15px_rgba(239,68,68,0.3)] cursor-pointer hover:scale-110";
                                  titleClass = "text-red-600 font-bold";
                                  IconComponent = XCircle;
                                } else if (step.status === 'Lulus' || step.status === 'lulus') {
                                  circleClass = "bg-green-500 border-green-500 text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)] cursor-pointer hover:scale-110";
                                  titleClass = "text-green-600 font-bold";
                                  IconComponent = CheckCircle2;
                                } else if (step.status === 'locked') {
                                  circleClass = "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed";
                                  titleClass = "text-gray-400";
                                  IconComponent = Lock;
                                }

                                if (currentInlineStageId === step.id) {
                                  circleClass += " ring-4 ring-amber-400/80 border-amber-500 scale-110 shadow-lg";
                                }

                                return (
                                  <div key={step.id} className="flex flex-row md:flex-col items-center gap-5 md:gap-4 w-full md:flex-1 shrink-0">
                                    <button
                                      disabled={step.status === 'locked'}
                                      onClick={() => handleStageIconClick(app.id, step.id)}
                                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 outline-none ${circleClass}`}
                                    >
                                      <IconComponent size={18} />
                                    </button>

                                    <div className="text-left md:text-center w-full md:px-2">
                                      <h3 className={`text-[14px] tracking-tight leading-snug ${titleClass}`}>
                                        {step.name}
                                      </h3>
                                      <p className="text-[11px] md:text-[12px] text-gray-400 font-medium mt-0.5 capitalize">
                                        {step.status === 'locked' ? 'Terkunci' : step.status === 'tidak_lulus' ? 'Gugur' : step.status}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Detail Informasi Card Hasil Tahapan Seleksi Dinamis */}
                          <div className="relative">
                            <AnimatePresence mode="wait">
                              {currentInlineStageId && activeStageDetail && (
                                <motion.div
                                  key={currentInlineStageId}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="mt-8 border border-gray-100 rounded-3xl bg-white shadow-sm p-6 md:p-8 overflow-hidden"
                                >
                                  {/* HEADER RINCIAN ALUR */}
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5 mb-6">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D278D] flex items-center justify-center shrink-0">
                                        <UserCheck size={20} />
                                      </div>
                                      <div>
                                        <h5 className="text-sm font-bold text-[#0D278D] tracking-tight">
                                          Rincian Alur: {activeStageDetail.name}
                                        </h5>
                                        
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[12px] font-bold uppercase tracking-wider">
                                          {/* INFO NILAI */}
                                          <span className="text-gray-500">
                                            Nilai : {" "}
                                            <span className="text-[#0D278D]">
                                              {activeStageDetail.score !== null && activeStageDetail.score !== undefined 
                                                ? activeStageDetail.score 
                                                : "-"}
                                              </span>
                                          </span>
                                          
                                          <span className="text-gray-300 hidden sm:inline">|</span>
                                          
                                          {/* INFO STATUS */}
                                          <span className="text-gray-500">
                                            Status : {" "}
                                            <span className={
                                              ['tidak_lulus', 'Tidak Lulus'].includes(activeStageDetail.status) 
                                                ? "text-red-500" 
                                                : ['lulus', 'Lulus', 'selesai'].includes(activeStageDetail.status) 
                                                  ? "text-green-500" 
                                                  : "text-amber-500"
                                            }>
                                              {activeStageDetail.status}
                                            </span>
                                          </span>

                                          <span className="text-gray-300 hidden sm:inline">|</span>

                                          {/* INFO JUMLAH PENGAJU */}
                                          <span className="text-gray-500 flex items-center gap-1">
                                            Jumlah Pengaju : {" "}
                                            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 font-extrabold">
                                              {activeStageDetail.total_applicants ?? 0} Orang
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* TOMBOL UNDUH PDF DI SEBELAH KANAN */}
                                    {activeStageDetail.download_pdf_lulus ? (
                                      <a 
                                        href={activeStageDetail.download_pdf_lulus}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 transition-all group"
                                      >
                                        <Download size={14} className="group-hover:translate-y-0.5 transition-transform duration-200" />
                                        <span>Unduh PDF SK Kelulusan</span>
                                      </a>
                                    ) : (
                                      <span className="text-[11px] text-gray-400 italic bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                        PDF Kelulusan Belum Diunggah
                                      </span>
                                    )}
                                  </div>

                                  {/* TAMPILAN CATATAN VERIFIKATOR */}
                                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                      Catatan / Keterangan Resmi:
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                      {activeStageDetail.notes || "Belum ada catatan atau instruksi tambahan resmi pada tahapan ini."}
                                    </p>
                                  </div>

                                  {activeStageDetail.end_date && (
                                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-3">
                                      <Clock size={12} /> Batas Penilaian: {formatDate(activeStageDetail.end_date)}
                                    </p>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty History State */}
        {!loading && filteredJobs.length === 0 && (
          <motion.div variants={mainItemVariants} className="text-center py-32 mt-6">
            <Search size={48} className="mx-auto text-gray-200 mb-6" strokeWidth={1.5} />
            <h3 className="text-[#0D278D] font-extrabold text-2xl tracking-tight">Tidak Ada Lamaran</h3>
            <p className="text-gray-500 text-[15px] mt-2">Anda belum memiliki riwayat lamaran di kategori ini.</p>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};

export default StatusLamaran;