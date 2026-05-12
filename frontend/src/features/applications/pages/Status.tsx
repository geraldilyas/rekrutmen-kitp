import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Briefcase,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  GraduationCap,
  FileText,
} from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";

// Data Dummy Status Lamaran (Sudah ditambahkan detail dari lowongan)
const appliedJobs = [
  {
    id: 1,
    kategori: "Tenaga Pendukung",
    jurusan: "Teknik Sipil",
    posisi: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    deskripsi:
      "Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis, administratif, dan sosial.",
    pendidikan: ["S1", "D3"],
    tanggal: "12 Mei 2026",
    currentStep: 2, // 1: Diajukan, 2: Diproses, 3: Hasil (Diterima/Ditolak)
    statusText: "Sedang Diproses",
    isRejected: false,
  },
  {
    id: 2,
    kategori: "Konsultan Individu",
    jurusan: "IT Support",
    posisi: "Software Engineer (Full-Stack)",
    deskripsi:
      "Mengembangkan sistem informasi manajemen sumber daya air berbasis web dan mobile.",
    pendidikan: ["S1"],
    tanggal: "05 Mei 2026",
    currentStep: 3,
    statusText: "Diterima",
    isRejected: false,
  },
  {
    id: 3,
    kategori: "Tenaga Pendukung",
    jurusan: "Administrasi",
    posisi: "Petugas Administrasi Satker",
    deskripsi:
      "Mendukung pengelolaan administrasi perkantoran, kearsipan, dan penyusunan laporan rutin.",
    pendidikan: ["S1", "D3", "SMA"],
    tanggal: "01 Mei 2026",
    currentStep: 3,
    statusText: "Ditolak",
    isRejected: true,
  },
];

// Timeline diubah menjadi 3 step utama
const timelineSteps = [
  { id: 1, label: "Diajukan", desc: "Berkas diterima", icon: Send },
  { id: 2, label: "Diproses", desc: "Seleksi & Tes", icon: Clock },
  { id: 3, label: "Keputusan", desc: "Hasil akhir", icon: CheckCircle2 },
];

const StatusLamaran: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filters = ["Semua", "Tenaga Pendukung", "Konsultan Individu"];

  const filteredJobs =
    activeFilter === "Semua"
      ? appliedJobs
      : appliedJobs.filter((job) => job.kategori === activeFilter);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-gray-50/30 min-h-screen font-['Poppins']">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#0D278D] via-[#0D278D] to-[#FEB700]">
              Pantau Status Lamaran <br className="hidden md:block" />
              Anda Saat Ini
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Lihat perkembangan proses seleksi Anda secara real-time. Kami
              mengedepankan transparansi dalam setiap tahapan rekrutmen.
            </p>
          </motion.div>
        </section>

        {/* Filter Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0D278D]">
                <Filter size={20} />
              </div>
              <span className="font-bold text-[#0D278D]">Filter Kategori:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeFilter === filter
                      ? "bg-[#0D278D] text-white shadow-lg shadow-blue-900/20"
                      : "bg-transparent text-gray-500 border border-gray-200 hover:border-[#0D278D] hover:text-[#0D278D]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* List Status Lamaran */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div layout className="space-y-6">
            <AnimatePresence>
              {filteredJobs.map((job) => (
                <motion.div
                  layout
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden hover:border-[#0D278D]/20 transition-colors"
                >
                  {/* Card Header - Update dengan detail lowongan */}
                  <div
                    onClick={() => toggleExpand(job.id)}
                    className="p-8 cursor-pointer hover:bg-gray-50/50 transition-colors duration-300 flex flex-col md:flex-row justify-between gap-8"
                  >
                    <div className="flex-1">
                      {/* Top Info: Kategori, Jurusan, Tanggal */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            job.kategori === "Konsultan Individu"
                              ? "bg-[#FEB700]/10 text-[#FEB700]"
                              : "bg-blue-50 text-[#0D278D]"
                          }`}
                        >
                          <Briefcase size={14} /> {job.kategori}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-semibold">
                          {job.jurusan}
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium ml-auto md:ml-0">
                          <Calendar size={14} />
                          <span>Dilamar: {job.tanggal}</span>
                        </div>
                      </div>

                      {/* Judul & Deskripsi */}
                      <h3 className="text-2xl font-bold text-[#0D278D] mb-2">
                        {job.posisi}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
                        {job.deskripsi}
                      </p>

                      {/* Pendidikan */}
                      <div className="flex items-center gap-2">
                        <GraduationCap
                          size={16}
                          className="text-gray-400 mr-1"
                        />
                        {job.pendidikan.map((edu, index) => (
                          <span
                            key={index}
                            className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-[#0D278D]"
                          >
                            {edu}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Aksi & Status */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                      <div
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm ${
                          job.currentStep === 3
                            ? job.isRejected
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : "bg-green-50 text-green-600 border border-green-100"
                            : "bg-blue-50 text-[#0D278D] border border-blue-100"
                        }`}
                      >
                        {job.currentStep === 3 ? (
                          job.isRejected ? (
                            <XCircle size={18} />
                          ) : (
                            <CheckCircle2 size={18} />
                          )
                        ) : (
                          <Clock size={18} className="animate-spin-slow" />
                        )}
                        {job.statusText}
                      </div>

                      <button
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${expandedId === job.id ? "bg-[#0D278D] text-white rotate-180" : "bg-gray-50 text-[#0D278D] border border-gray-200 hover:bg-[#FEB700] hover:border-[#FEB700]"}`}
                      >
                        <ChevronDown size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Timeline Section - Tracking Style Modern */}
                  <AnimatePresence>
                    {expandedId === job.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="border-t border-gray-100 bg-[#fafafa]"
                      >
                        <div className="p-8 md:p-12">
                          <div className="flex items-center gap-3 mb-10">
                            <FileText className="text-[#FEB700]" size={24} />
                            <h4 className="text-[#0D278D] font-extrabold text-xl">
                              Progress Tracking
                            </h4>
                          </div>

                          {/* Progress Bar Container */}
                          <div className="relative px-4 md:px-10">
                            {/* Garis Dasar (Track Background) */}
                            <div className="absolute top-6 left-10 right-10 h-2 bg-gray-200 rounded-full z-0 hidden md:block" />

                            {/* Garis Aktif (Active Track) */}
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${((job.currentStep - 1) / 2) * 100}%`,
                              }}
                              transition={{
                                duration: 0.8,
                                ease: "easeOut",
                                delay: 0.1,
                              }}
                              className={`absolute top-6 left-10 h-2 rounded-full z-0 hidden md:block ${job.isRejected && job.currentStep === 3 ? "bg-red-500" : "bg-[#0D278D]"}`}
                            />

                            {/* Mobile Track (Vertical) */}
                            <div className="absolute top-6 bottom-6 left-9 w-1 bg-gray-200 rounded-full z-0 md:hidden" />
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{
                                height: `${((job.currentStep - 1) / 2) * 100}%`,
                              }}
                              transition={{
                                duration: 0.8,
                                ease: "easeOut",
                                delay: 0.1,
                              }}
                              className={`absolute top-6 left-9 w-1 rounded-full z-0 md:hidden ${job.isRejected && job.currentStep === 3 ? "bg-red-500" : "bg-[#0D278D]"}`}
                            />

                            {/* Dots / Nodes */}
                            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10">
                              {timelineSteps.map((step) => {
                                const isPast = job.currentStep > step.id;
                                const isCurrent = job.currentStep === step.id;
                                const isEndRejected =
                                  job.currentStep === 3 &&
                                  job.isRejected &&
                                  step.id === 3;
                                const isEndAccepted =
                                  job.currentStep === 3 &&
                                  !job.isRejected &&
                                  step.id === 3;

                                // Style penentuan Node
                                let dotColor =
                                  "bg-gray-200 text-gray-400 border-white";
                                let pulseEffect = "";

                                if (isPast || isEndAccepted) {
                                  dotColor =
                                    "bg-[#0D278D] text-white border-white";
                                } else if (isCurrent && !isEndRejected) {
                                  dotColor =
                                    "bg-[#FEB700] text-[#0D278D] border-white";
                                  pulseEffect =
                                    "ring-4 ring-[#FEB700]/30 animate-pulse";
                                } else if (isEndRejected) {
                                  dotColor =
                                    "bg-red-500 text-white border-white";
                                }

                                // Icon logic
                                let StepIcon = step.icon;
                                if (step.id === 3) {
                                  if (isEndRejected) StepIcon = XCircle;
                                  if (isEndAccepted) StepIcon = CheckCircle2;
                                }

                                return (
                                  <div
                                    key={step.id}
                                    className="flex md:flex-col items-center md:justify-start gap-4 md:gap-4 md:w-1/3"
                                  >
                                    {/* Circle Node */}
                                    <div
                                      className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex shrink-0 items-center justify-center border-[4px] shadow-md transition-all duration-500 z-10 ${dotColor} ${pulseEffect}`}
                                    >
                                      <StepIcon size={22} strokeWidth={2.5} />
                                    </div>

                                    {/* Text Content */}
                                    <div className="text-left md:text-center mt-0 md:mt-2">
                                      <h3
                                        className={`text-sm md:text-base font-bold mb-1 transition-colors duration-300 ${isPast || isEndAccepted || isCurrent ? "text-[#0D278D]" : "text-gray-400"}`}
                                      >
                                        {step.id === 3 && isEndRejected
                                          ? "Ditolak"
                                          : step.id === 3 && isEndAccepted
                                            ? "Diterima"
                                            : step.label}
                                      </h3>
                                      <p className="text-xs text-gray-500 font-medium">
                                        {isCurrent
                                          ? "Tahap saat ini"
                                          : isPast
                                            ? "Telah dilalui"
                                            : isEndRejected
                                              ? "Mohon maaf"
                                              : "Belum dimulai"}
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
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-20">
              <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                Belum ada lamaran di kategori ini.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default StatusLamaran;
