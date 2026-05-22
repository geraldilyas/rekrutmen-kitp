import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  GraduationCap,
  FileText,
  Megaphone,
  Users,
  Search,
  Brain,
  CircleDot,
  Activity,
  Filter,
} from "lucide-react";
import { api } from "../../services/api";

interface Application {
  id: number;
  status: string;
  applied_at: string;
  job: {
    id: number;
    title: string;
    category: string;
    qualification: string;
    stages: any[];
  };
  stage_results: any[];
}

const timelineStepsDefault = [
  { id: 1, label: "Diajukan", desc: "Registrasi Online", icon: Send },
  { id: 2, label: "Seleksi Admin", desc: "Verifikasi Berkas", icon: FileText },
  { id: 3, label: "Pengumuman", desc: "Hasil Admin", icon: Megaphone },
  { id: 4, label: "Kompetensi", desc: "Ujian Tulis & CAT", icon: Brain },
  { id: 5, label: "Wawancara", desc: "Tatap Muka", icon: Users },
  { id: 6, label: "Hasil Akhir", desc: "Keputusan Final", icon: CheckCircle2 },
];

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

const StatusLamaran: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = ["Semua", "Tenaga Pendukung", "Konsultan Individu"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications/my");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
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

  const getApplicationStatus = (app: Application) => {
    if (app.status === 'Tidak Lulus') return { text: 'Tidak Lulus', isRejected: true, step: 6 };
    if (app.status === 'Lulus') return { text: 'Lulus', isRejected: false, step: 6 };
    
    // Logic to determine current step based on stage results
    const completedStages = app.stage_results?.filter((sr: any) => sr.status === 'Lulus' || sr.status === 'lulus' || sr.status === 'passed').length || 0;
    return { text: 'Sedang Proses', isRejected: false, step: completedStages + 1 };
  };

  const filteredJobs =
    activeFilter === "Semua"
      ? applications
      : applications.filter((app) => getCategoryDisplay(app.job.category) === activeFilter);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white min-h-screen font-['Poppins']">

      <div className="bg-[#0D278D] pt-32 pb-24 relative rounded-b-[2.5rem] md:rounded-b-[4rem] z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FEB700]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 shadow-sm backdrop-blur-sm">
              <Activity size={16} className="text-[#FEB700]" />
              <span className="text-white text-[11px] font-bold tracking-widest uppercase">
                Monitoring
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Status{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-[#ffe066]">
                Lamaran
              </span>
            </h1>
            <p className="text-blue-100/80 text-[15px] md:text-base font-medium max-w-xl mx-auto leading-relaxed">
              Pantau seluruh progress rekrutmen Anda secara real-time dan
              transparan di sini.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.main
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-0"
        variants={mainContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={mainItemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-100 pb-8 relative"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] tracking-tight">
              Riwayat Lamaran
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-2">
              Menampilkan{" "}
              <span className="text-[#FEB700] font-bold">
                {filteredJobs.length}
              </span>{" "}
              data
            </p>
          </div>

          <div className="flex items-center relative gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-bold border cursor-pointer transition-all duration-300 ${
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
                  className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 absolute md:relative right-0 top-14 md:top-auto z-30  whitespace-nowrap overflow-hidden"
                >
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter);
                        setIsFilterOpen(false);
                      }}
                      className={`px-5 h-[40px] flex items-center justify-center rounded-xl text-[14px] font-bold cursor-pointer transition-all duration-300 whitespace-nowrap ${
                        activeFilter === filter
                          ? "bg-white border border-[#0D278D] text-[#0D278D] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                          : "text-gray-500 hover:text-[#0D278D] hover:bg-blue-50/50"
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
        <motion.div
          layout
          className="flex flex-col"
          variants={mainItemVariants}
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mx-auto"></div>
                </div>
            ) : filteredJobs.map((app) => {
              const statusInfo = getApplicationStatus(app);
              return (
              <motion.div
                layout
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="border-b border-gray-100 last:border-0 group relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FEB700] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-r-full z-10" />

                <div
                  onClick={() => toggleExpand(app.id)}
                  className="py-6 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer transition-colors duration-300 hover:bg-gray-50/30"
                >
                  <div className="flex-1 w-full group-hover:translate-x-2 transition-transform duration-300">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#FEB700]" />{" "}
                        {formatDate(app.applied_at)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 hidden md:block" />
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                          app.job.category === "konsultan_individu"
                            ? "bg-amber-50 text-[#FEB700]"
                            : "bg-blue-50 text-[#0D278D]"
                        }`}
                      >
                        {app.job.category === "konsultan_individu" ? (
                          <Brain size={12} />
                        ) : (
                          <Users size={12} />
                        )}
                        {getCategoryDisplay(app.job.category)}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-[#0D278D] mb-5 leading-tight transition-colors">
                      {app.job.title}
                    </h3>

                    <div className="flex items-center gap-2">
                      <GraduationCap size={18} className="text-gray-400 mr-1" />
                      <span className="px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[12px] font-bold text-[#0D278D]">
                          {app.job.qualification}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-6 mt-4 md:mt-0">
                    <div
                      className={`px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 border ${
                        statusInfo.step === 6
                          ? statusInfo.isRejected
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-green-50 text-green-600 border-green-100"
                          : "bg-white text-[#0D278D] border-[#0D278D]"
                      }`}
                    >
                      {statusInfo.step === 6 ? (
                        statusInfo.isRejected ? (
                          <XCircle size={16} />
                        ) : (
                          <CheckCircle2 size={16} />
                        )
                      ) : (
                        <Clock
                          size={16}
                          className="animate-spin-slow text-[#FEB700]"
                        />
                      )}
                      {statusInfo.text}
                    </div>

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        expandedId === app.id
                          ? "rotate-180 bg-[#0D278D] text-white shadow-md"
                          : "text-gray-400 group-hover:bg-white group-hover:text-[#0D278D] group-hover:shadow-sm"
                      }`}
                    >
                      <ChevronDown size={22} />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === app.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.48, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pb-12 px-4 sm:px-6">
                        <h4 className="text-[11px] font-bold text-gray-400 mb-12 text-center md:text-left uppercase tracking-[0.2em] flex items-center gap-2 justify-center md:justify-start">
                          <Activity size={16} className="text-[#FEB700]" />
                          Timeline Seleksi
                        </h4>

                        <div className="relative">
                          <div className="hidden md:block absolute top-[22px] left-[8.33%] right-[8.33%] z-0">
                            <div className="h-[2px] w-full bg-gray-100" />
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${((statusInfo.step - 1) / 5) * 100}%`,
                              }}
                              className={`absolute top-0 left-0 h-[2px] transition-all duration-700 ease-out ${
                                statusInfo.isRejected && statusInfo.step === 6
                                  ? "bg-red-500"
                                  : statusInfo.step === 6 && !statusInfo.isRejected
                                    ? "bg-green-500"
                                    : "bg-[#0D278D]"
                              }`}
                            />
                          </div>

                          <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-0 relative z-10 w-full">
                            {timelineStepsDefault.map((step) => {
                              const isPast = statusInfo.step > step.id;
                              const isCurrent = statusInfo.step === step.id;
                              const isEndRejected =
                                statusInfo.step === 6 &&
                                statusInfo.isRejected &&
                                step.id === 6;
                              const isEndAccepted =
                                statusInfo.step === 6 &&
                                !statusInfo.isRejected &&
                                step.id === 6;

                              let circleClass =
                                "bg-white border-[2px] border-gray-200 text-gray-300";
                              let titleClass = "text-gray-400";
                              let IconCmp = isPast
                                ? CheckCircle2
                                : isCurrent
                                  ? CircleDot
                                  : step.icon;

                              if (isEndAccepted) {
                                circleClass =
                                  "bg-green-500 border-[2px] border-green-500 text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)]";
                                titleClass = "text-green-600 font-bold";
                                IconCmp = CheckCircle2;
                              } else if (isPast) {
                                circleClass =
                                  "bg-[#0D278D] border-[2px] border-[#0D278D] text-white shadow-[0_4px_15px_rgba(13,39,141,0.2)]";
                                titleClass = "text-[#0D278D] font-bold";
                                IconCmp = CheckCircle2;
                              } else if (isCurrent && !isEndRejected) {
                                circleClass =
                                  "bg-white border-[2px] border-[#FEB700] text-[#FEB700] ring-4 ring-yellow-50";
                                titleClass = "text-[#0D278D] font-bold";
                                IconCmp = step.icon;
                              } else if (isEndRejected) {
                                circleClass =
                                  "bg-red-500 border-[2px] border-red-500 text-white shadow-[0_4px_15px_rgba(239,68,68,0.3)]";
                                titleClass = "text-red-600 font-bold";
                                IconCmp = XCircle;
                              }

                              return (
                                <div
                                  key={step.id}
                                  className="flex flex-row md:flex-col items-center md:items-center gap-5 md:gap-4 w-full md:w-[16.66%] shrink-0"
                                >
                                  <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${circleClass}`}
                                  >
                                    <IconCmp
                                      size={20}
                                      strokeWidth={
                                        isCurrent && !isPast ? 2.5 : 2
                                      }
                                    />
                                  </div>

                                  <div className="text-left md:text-center w-full md:px-2">
                                    <h3
                                      className={`text-[14px] md:text-[15px] tracking-tight whitespace-nowrap ${titleClass}`}
                                    >
                                      {step.id === 6 && isEndRejected
                                        ? "Tidak Lulus"
                                        : step.id === 6 && isEndAccepted
                                          ? "Lulus"
                                          : step.label}
                                    </h3>
                                    <p className="text-[12px] md:text-[13px] text-gray-500 font-medium mt-1 leading-relaxed md:leading-tight whitespace-nowrap">
                                      {step.desc}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )})}
          </AnimatePresence>
        </motion.div>

        {!loading && filteredJobs.length === 0 && (
          <motion.div
            variants={mainItemVariants}
            className="text-center py-32 mt-6"
          >
            <Search
              size={48}
              className="mx-auto text-gray-200 mb-6"
              strokeWidth={1.5}
            />
            <h3 className="text-[#0D278D] font-extrabold text-2xl tracking-tight">
              Tidak Ada Lamaran
            </h3>
            <p className="text-gray-500 text-[15px] mt-2">
              Anda belum memiliki riwayat lamaran di kategori ini.
            </p>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};

export default StatusLamaran;