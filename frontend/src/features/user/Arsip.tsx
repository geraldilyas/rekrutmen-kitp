import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  Brain,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  Users,
  Filter,
} from "lucide-react";
import { api } from "../../services/api";

interface ArchiveItem {
  id: number;
  status: string;
  applied_at: string;
  job: {
    id: number;
    title: string;
    category: string;
    qualification: string;
    deadline: string;
  };
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
    transition: { duration: 0.5 },
  },
};

const Arsip: React.FC = () => {
  const [history, setHistory] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua Riwayat");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = ["Semua Riwayat", "Lulus", "Tidak Lulus"];

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications/my");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      const finished = data.filter((app: ArchiveItem) => ['Lulus', 'Tidak Lulus'].includes(app.status));
      setHistory(finished);
    } catch (err) {
      console.error("Error fetching history:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getCategoryDisplay = (cat: string) => {
    if (cat === "tenaga_pendukung") return "Tenaga Pendukung";
    if (cat === "konsultan_individu") return "Konsultan Individu";
    return cat;
  };

  const getStatusDisplay = (status: string) => {
    if (status === 'Lulus') return 'Lulus';
    if (status === 'Tidak Lulus') return 'Tidak Lulus';
    return status;
  };

  const filteredHistory =
    activeFilter === "Semua Riwayat"
      ? history
      : history.filter((app) => getStatusDisplay(app.status) === activeFilter);

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
              <Archive size={16} className="text-[#FEB700]" />
              <span className="text-white text-[11px] font-bold tracking-widest uppercase">
                Arsip Lamaran
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Riwayat Perjalanan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-[#ffe066]">
                Karir Anda
              </span>
            </h1>

            <p className="text-blue-100/80 text-[15px] md:text-base max-w-2xl mx-auto leading-relaxed">
              Pantau kembali rekam jejak lamaran, hasil seleksi akhir, dan
              histori kontribusi administrasi Anda bersama kami.
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
              Daftar Riwayat
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Menampilkan{" "}
              <span className="text-[#FEB700] font-bold">
                {filteredHistory.length}
              </span>{" "}
              arsip lamaran
            </p>
          </div>

          <div className="flex items-center gap-3 relative ">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-[1rem] text-[14px] font-bold cursor-pointer border transition-all duration-300  ${
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
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 absolute md:relative right-0 top-14 md:top-auto z-30   w-max whitespace-nowrap">
                    {filters.map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setActiveFilter(f);
                          setIsFilterOpen(false);
                        }}
                        className={`px-5 h-[40px] flex items-center justify-center rounded-xl text-[14px] font-bold transition-all duration-300 whitespace-nowrap ${
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

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
                <div className="col-span-full text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D278D] mx-auto"></div>
                </div>
            ) : filteredHistory.map((app) => (
              <motion.div
                layout
                key={app.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                className="group p-8 rounded-3xl border border-gray-100 bg-white hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(254,183,0,0.3)] transition-all duration-500 flex flex-col relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6 gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                    <Clock size={14} className="text-[#FEB700]" />
                    {new Date(app.applied_at).getFullYear()}
                  </span>

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

                <h3 className="text-xl font-extrabold text-[#0D278D] mb-4 leading-tight group-hover:text-blue-800 transition-colors">
                  {app.job.title}
                </h3>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 gap-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={18} className="text-gray-400 mr-1" />
                    <span className="px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[11px] font-bold text-[#0D278D]">
                        {app.job.qualification}
                    </span>
                  </div>

                  <div
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border ${
                      app.status === "Lulus"
                        ? "bg-green-50 text-green-600 border-green-100 shadow-sm shadow-green-50"
                        : "bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-50"
                    }`}
                  >
                    {app.status === "Lulus" ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <XCircle size={15} />
                    )}
                    <span>{getStatusDisplay(app.status)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {!loading && filteredHistory.length === 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-50 border border-gray-100">
                <History size={28} className="text-gray-300" />
              </div>
              <h3 className="text-[#0D278D] font-extrabold text-xl tracking-tight">
                Riwayat Kosong
              </h3>
              <p className="text-gray-400 mt-2 text-sm max-w-sm mx-auto leading-relaxed">
                Anda belum memiliki riwayat rekaman administrasi lamaran yang sudah selesai.
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.main>
    </div>
  );
};

export default Arsip;