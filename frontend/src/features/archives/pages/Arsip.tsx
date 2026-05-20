import React, { useState } from "react";
import { motion, AnimatePresence, } from "framer-motion";
import {
  Archive,
  Brain,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  Users,
  Filter
} from "lucide-react";
import Navbar from "../../../components/layout/Navbar";

// Data Dummy Riwayat Arsip Lamaran
const archiveJobs = [
  {
    id: 1,
    kategori: "Konsultan Individu",
    jurusan: "Teknik Informatika",
    posisi: "Data Analyst",
    deskripsi:
      "Melakukan pengolahan data spasial dan non-spasial terkait sumber daya air untuk kebutuhan pelaporan pimpinan.",
    pendidikan: ["S1"],
    tanggalMelamar: "10 Agustus 2025",
    periode: "Rekrutmen Tahap II 2025",
    statusAkhir: "Diterima",
  },
  {
    id: 2,
    kategori: "Tenaga Pendukung",
    jurusan: "Administrasi",
    posisi: "Staf Administrasi Umum",
    deskripsi:
      "Mengelola surat menyurat, arsip digital, dan dokumen kepegawaian di lingkungan Balai Besar Wilayah Sungai.",
    pendidikan: ["D3", "SMA"],
    tanggalMelamar: "05 Februari 2025",
    periode: "Rekrutmen Tahap I 2025",
    statusAkhir: "Tidak Lulus",
  },
  {
    id: 3,
    kategori: "Tenaga Pendukung",
    jurusan: "Teknik Sipil",
    posisi: "Pengawas Lapangan Irigasi",
    deskripsi:
      "Melakukan monitoring dan evaluasi terhadap proyek rehabilitasi jaringan irigasi tingkat sekunder.",
    pendidikan: ["S1", "D3"],
    tanggalMelamar: "12 November 2024",
    periode: "Rekrutmen Akhir Tahun 2024",
    statusAkhir: "Tidak Lulus",
  },
];

// --- ANIMATION SYSTEM ---
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
    transition: { duration: 0.5},
  },
};

const Arsip: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("Semua Riwayat");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = ["Semua Riwayat", "Diterima", "Tidak Lulus"];

  const filteredHistory =
    activeFilter === "Semua Riwayat"
      ? archiveJobs
      : archiveJobs.filter((job) => job.statusAkhir === activeFilter);

  return (
    <div className="bg-white min-h-screen font-['Poppins']">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="bg-[#0D278D] pt-32 pb-24 relative rounded-b-[2.5rem] md:rounded-b-[4rem] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
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
              Pantau kembali rekam jejak lamaran, hasil seleksi akhir, dan histori kontribusi administrasi Anda bersama kami.
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <motion.main
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER LIST & FILTER CONTROLS */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D]">
              Daftar Riwayat
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Menampilkan <span className="text-[#FEB700] font-bold">{filteredHistory.length}</span> arsip lamaran
            </p>
          </div>

          {/* Inline Flex-Flow Filter System */}
          <div className="flex items-center gap-3 relative ">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-[1rem] text-[14px] font-bold border transition-all duration-300  ${
                isFilterOpen
                  ? "bg-[#0D278D] text-white border-[#0D278D]"
                  : "bg-white text-[#0D278D] border-[#0D278D] hover:bg-[#0D278D] hover:text-white"
              }`}
            >
              <Filter size={18} />
              <span>{activeFilter}</span>
            </button>

            {/* <div className="absolute left-full ml-3 top-0 flex items-center z-10"> */}
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
                    // transition={{ duration: 0.35, ease: "easeOut" }}
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
          {/* </div> */}
        </motion.div>

        {/* ARCHIVE GRID CARDS (Style matched to image_7657d8.png layout) */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredHistory.map((job) => (
              <motion.div
                layout
                key={job.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                className="group p-8 rounded-3xl border border-gray-100 bg-white hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(254,183,0,0.3)] transition-all duration-500 flex flex-col relative overflow-hidden"
              >
                {/* Meta Header */}
                <div className="flex justify-between items-start mb-6 gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                    <Clock size={14} className="text-[#FEB700]" />
                    {job.periode}
                  </span>

                  <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                             job.kategori === "Konsultan Individu" ? "bg-amber-50 text-[#FEB700]" : "bg-blue-50 text-[#0D278D]"
                                                      }`}>
                                                        {job.kategori === "Konsultan Individu" ? (
                                                          <Brain size={12} /> 
                                                        ) : (
                                                          <Users size={12} />
                                                        )} 
                                                        {job.kategori}
                      </span>
                </div>

                {/* Job Position Title */}
                <h3 className="text-xl font-extrabold text-[#0D278D] mb-4 leading-tight group-hover:text-blue-800 transition-colors">
                  {job.posisi}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-[14px] leading-relaxed mb-8 flex-grow">
                  {job.deskripsi}
                </p>

                {/* Divider Line & Card Footer */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50 gap-4">
                  
                  {/* Education Circles */}
                  <div className="flex items-center gap-2">
                    <GraduationCap size={18} className="text-gray-400 mr-1" />
                    {job.pendidikan.map((edu, idx) => (
                      <span
                        key={idx}
                        className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-bold text-[#0D278D]"
                      >
                        {edu}
                      </span>
                    ))}
                  </div>

                  {/* Status Badges Matching Lowongan's Button Area placement */}
                  <div
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border ${
                      job.statusAkhir === "Diterima"
                        ? "bg-green-50 text-green-600 border-green-100 shadow-sm shadow-green-50"
                        : "bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-50"
                    }`}
                  >
                    {job.statusAkhir === "Diterima" ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <XCircle size={15} />
                    )}
                    <span>{job.statusAkhir}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* EMPTY STATE */}
        <AnimatePresence>
          {filteredHistory.length === 0 && (
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
                Anda belum memiliki riwayat rekaman administrasi lamaran pada kategori ini.
              </p>
              <button
                onClick={() => setActiveFilter("Semua Riwayat")}
                className="mt-8 text-sm font-bold text-[#0D278D] border-b-2 border-transparent hover:border-[#FEB700] hover:text-[#FEB700] transition-all pb-1"
              >
                Kembali ke Semua Riwayat
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

export default Arsip;