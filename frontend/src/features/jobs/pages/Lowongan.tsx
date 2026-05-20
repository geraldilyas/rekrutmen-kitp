import React, { useState } from "react";
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

import Navbar from "../../../components/layout/Navbar";

const jobsData = [
  {
    id: 1,
    kategori: "Tenaga Pendukung",
    jurusan: "Teknik Sipil",
    waktu: "15 - 24 Mei 2026",
    posisi: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    deskripsi:
      "Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis, administratif, dan sosial.",
    pendidikan: ["S1", "D3"],
  },
  {
    id: 2,
    kategori: "Tenaga Pendukung",
    jurusan: "Administrasi",
    waktu: "10 - 20 Mei 2026",
    posisi: "Petugas Administrasi Satker",
    deskripsi:
      "Mendukung pengelolaan administrasi perkantoran, kearsipan, dan penyusunan laporan rutin.",
    pendidikan: ["S1", "D3", "SMA"],
  },
  {
    id: 3,
    kategori: "Konsultan Individu",
    jurusan: "IT Support",
    waktu: "18 - 31 Mei 2026",
    posisi: "Software Engineer (Full-Stack)",
    deskripsi:
      "Mengembangkan sistem informasi manajemen sumber daya air berbasis web dan mobile.",
    pendidikan: ["S1"],
  },
  {
    id: 4,
    kategori: "Konsultan Individu",
    jurusan: "Hukum",
    waktu: "20 Mei - 5 Jun 2026",
    posisi: "Staf Advokasi Hukum",
    deskripsi:
      "Menangani aspek legalitas lahan, sengketa pemanfaatan wilayah sungai, dan penyusunan draf.",
    pendidikan: ["S1", "S2"],
  },
  {
    id: 5,
    kategori: "Tenaga Pendukung",
    jurusan: "Akuntansi",
    waktu: "15 - 22 Mei 2026",
    posisi: "Staf Keuangan & Pelaporan",
    deskripsi:
      "Melakukan rekapitulasi keuangan, verifikasi dokumen pencairan, dan pelaporan realisasi anggaran.",
    pendidikan: ["S1", "D3"],
  },
  {
    id: 6,
    kategori: "Konsultan Individu",
    jurusan: "Teknik Lingkungan",
    waktu: "25 Mei - 25 Jun 2026",
    posisi: "Ahli Lingkungan Hidup",
    deskripsi:
      "Menyusun kajian AMDAL dan memastikan proyek infrastruktur mematuhi standar lingkungan.",
    pendidikan: ["S1", "S2"],
  },
];

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

  const [activeFilter, setActiveFilter] = useState("Semua");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = [
    "Semua",
    "Tenaga Pendukung",
    "Konsultan Individu",
  ];

  const filteredJobs =
    activeFilter === "Semua"
      ? jobsData
      : jobsData.filter((job) => job.kategori === activeFilter);

  // const newLocal = "flex items-center gap-2 text-sm font-bold text-[#0D278D] border-1 border-[#0D278D] px-5 py-2.5 cursor-pointer rounded-xl hover:bg-[#0D278D] hover:text-white transition-all duration-300";
  return (
    <div className="bg-white min-h-screen font-['Poppins']">
      <Navbar />

      {/* HERO */}
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

      {/* CONTENT */}
      <motion.main
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
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

          {/* FILTER */}
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
  <AnimatePresence mode="popLayout">
    {filteredJobs.map((job) => (
      <motion.div
        layout
        key={job.id}
        variants={itemVariants}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="group p-8 rounded-3xl border border-gray-100 bg-white hover:border-[#FEB700] hover:shadow-[0_20px_50px_-20px_rgba(254,183,0,0.3)] transition-all duration-500 flex flex-col relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-6">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Clock size={14} className="text-[#FEB700]" />
            {job.waktu}
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

        <h3 className="text-xl font-extrabold text-[#0D278D] mb-4 leading-tight">
          {job.posisi}
        </h3>

        <p className="text-gray-500 text-[14px] leading-relaxed mb-8 flex-grow">
          {job.deskripsi}
        </p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
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

          {/* BUTTON DENGAN ANIMASI HOVER SAMA PERSIS SEPERTI BERANDA */}
          <button
            onClick={() => navigate('/detail-lowongan')}
            className="group bg-transparent border-2 border-[#0D278D] text-[#0D278D] px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-[#0D278D] hover:text-white transition-all duration-300 shadow-sm flex items-center justify-center overflow-hidden"
          >
            <span className="transition-transform duration-300">Lihat Kontol</span>
            <ChevronRight
              size={18}
              data-framer-appear-id="ignore" /* Mencegah bentrokan layout animation */
              className="opacity-0 max-w-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:max-w-[20px] group-hover:ml-2 transition-all duration-300 ease-out shrink-0"
            />
          </button>
        </div>
      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>

        {/* EMPTY */}
        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <Sparkles
              size={48}
              className="mx-auto text-gray-200 mb-4"
            />

            <h3 className="text-[#0D278D] font-bold text-xl">
              Lowongan belum tersedia
            </h3>

            <p className="text-gray-400 mt-2">
              Maaf, saat ini belum ada posisi aktif untuk kategori ini.
            </p>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
};

export default Lowongan;