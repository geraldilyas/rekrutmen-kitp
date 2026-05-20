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
  Megaphone,
  Users,
  Search,
  Brain,
  CircleDot,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";

// Data Dummy Status Lamaran
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
    currentStep: 4,
    statusText: "Sedang Tes Kompetensi",
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
    currentStep: 6,
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
    currentStep: 6,
    statusText: "Ditolak",
    isRejected: true,
  },
];

const timelineSteps = [
  { id: 1, label: "Diajukan", desc: "Registrasi Online", icon: Send },
  { id: 2, label: "Seleksi Admin", desc: "Verifikasi Berkas", icon: FileText },
  { id: 3, label: "Pengumuman", desc: "Hasil Admin", icon: Megaphone },
  { id: 4, label: "Kompetensi", desc: "Ujian Tulis & CAT", icon: Brain },
  { id: 5, label: "Wawancara", desc: "Tatap Muka", icon: Users },
  { id: 6, label: "Hasil Akhir", desc: "Keputusan Final", icon: CheckCircle2 },
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
    <div className="bg-gray-50/50 min-h-screen font-['Poppins']">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#0D278D] tracking-tight">
              Pantau Status Lamaran
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Lihat perkembangan proses seleksi Anda secara transparan dan
              real-time.
            </p>
          </motion.div>
        </section>

        {/* --- KONTENER UTAMA --- */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {/* Filter Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-50 pb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#0D278D]">
                  Riwayat Lamaran
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Menampilkan{" "}
                  <span className="text-[#FEB700] font-bold">
                    {filteredJobs.length}
                  </span>{" "}
                  data
                </p>
              </div>

              {/* Segmented Filter */}
              <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl w-fit overflow-x-auto no-scrollbar border border-gray-100">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                      activeFilter === filter
                        ? "bg-white text-[#0D278D] shadow-sm border border-gray-100"
                        : "text-gray-500 hover:text-[#0D278D]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List Lamaran */}
            <motion.div layout className="space-y-5">
              <AnimatePresence mode="popLayout">
                {filteredJobs.map((job) => (
                  <motion.div
                    layout
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                      expandedId === job.id
                        ? "border-blue-100 shadow-[0_20px_50px_-15px_rgba(13,39,141,0.12)]"
                        : "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
                    }`}
                  >
                    {/* Header Card Lamaran */}
                    <div
                      onClick={() => toggleExpand(job.id)}
                      className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 rounded-md bg-blue-50 text-[#0D278D] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Briefcase size={12} /> {job.kategori}
                          </span>
                          <span className="text-gray-400 text-xs font-medium flex items-center gap-1.5">
                            <Calendar size={12} /> {job.tanggal}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0D278D] mb-2 leading-tight">
                          {job.posisi}
                        </h3>
                        <div className="flex items-center gap-2">
                          <GraduationCap size={14} className="text-gray-400" />
                          <span className="text-xs text-gray-500 font-medium">
                            {job.pendidikan.join(", ")}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge & Toggle */}
                      <div className="flex items-center justify-between w-full md:w-auto gap-4">
                        <div
                          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 ${
                            job.currentStep === 6
                              ? job.isRejected
                                ? "bg-red-50 text-red-600"
                                : "bg-green-50 text-green-600"
                              : "bg-blue-50 text-[#0D278D]"
                          }`}
                        >
                          {job.currentStep === 6 ? (
                            job.isRejected ? (
                              <XCircle size={14} />
                            ) : (
                              <CheckCircle2 size={14} />
                            )
                          ) : (
                            <Clock size={14} className="animate-spin-slow" />
                          )}
                          {job.statusText}
                        </div>

                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 text-gray-400 bg-gray-50 ${expandedId === job.id ? "rotate-180 bg-blue-50 text-[#0D278D]" : ""}`}
                        >
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <AnimatePresence>
                      {expandedId === job.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-50 bg-[#fafafa]"
                        >
                          <div className="p-6 md:p-10">
                            <h4 className="text-sm font-bold text-[#0D278D] mb-8 text-center md:text-left uppercase tracking-wider">
                              Progress Seleksi
                            </h4>

                            <div className="relative">
                              {/* --- DESKTOP PROGRESS LINE WRAPPER --- 
                                  Menggunakan wrapper left & right 8.33% agar lebarnya mentok pas di center icon
                                  Animasi width jadi 100% relatif terhadap wrapper ini. Anti overlap!
                              */}
                              <div className="hidden md:block absolute top-[22px] left-[8.33%] right-[8.33%] z-0">
                                <div className="h-[4px] w-full bg-gray-200 rounded-full" />
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${((job.currentStep - 1) / 5) * 100}%`,
                                  }}
                                  className={`absolute top-0 left-0 h-[4px] rounded-full transition-all duration-700 ease-out ${
                                    job.isRejected && job.currentStep === 6
                                      ? "bg-red-500"
                                      : job.currentStep === 6 && !job.isRejected
                                        ? "bg-green-500"
                                        : "bg-[#0D278D]"
                                  }`}
                                />
                              </div>

                              {/* --- MOBILE PROGRESS LINE (Vertical) WRAPPER --- */}
                              <div className="block md:hidden absolute top-[24px] bottom-[24px] left-[22px] z-0">
                                <div className="w-[4px] h-full bg-gray-200 rounded-full" />
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{
                                    height: `${((job.currentStep - 1) / 5) * 100}%`,
                                  }}
                                  className={`absolute top-0 left-0 w-[4px] rounded-full transition-all duration-700 ease-out ${
                                    job.isRejected && job.currentStep === 6
                                      ? "bg-red-500"
                                      : job.currentStep === 6 && !job.isRejected
                                        ? "bg-green-500"
                                        : "bg-[#0D278D]"
                                  }`}
                                />
                              </div>

                              {/* --- NODES (Lingkaran Timeline) --- */}
                              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative z-10 w-full">
                                {timelineSteps.map((step) => {
                                  const isPast = job.currentStep > step.id;
                                  const isCurrent = job.currentStep === step.id;
                                  const isEndRejected =
                                    job.currentStep === 6 &&
                                    job.isRejected &&
                                    step.id === 6;
                                  const isEndAccepted =
                                    job.currentStep === 6 &&
                                    !job.isRejected &&
                                    step.id === 6;

                                  // Warna Logika Terpusat
                                  let circleClass =
                                    "bg-white border-gray-200 text-gray-300";
                                  let titleClass = "text-gray-400";
                                  let IconCmp = isPast
                                    ? CheckCircle2
                                    : isCurrent
                                      ? CircleDot
                                      : step.icon;

                                  if (isEndAccepted) {
                                    // DITERIMA (HIJAU)
                                    circleClass =
                                      "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/20";
                                    titleClass = "text-green-600 font-bold";
                                    IconCmp = CheckCircle2;
                                  } else if (isPast) {
                                    // SELESAI TAPI BELUM TAHAP AKHIR (BIRU)
                                    circleClass =
                                      "bg-[#0D278D] border-[#0D278D] text-white shadow-md shadow-blue-900/10";
                                    titleClass = "text-[#0D278D] font-bold";
                                    IconCmp = CheckCircle2;
                                  } else if (isCurrent && !isEndRejected) {
                                    // AKTIF SEDANG BERJALAN (KUNING)
                                    circleClass =
                                      "bg-white border-[#FEB700] text-[#FEB700] ring-4 ring-yellow-50 shadow-md";
                                    titleClass = "text-[#0D278D] font-bold";
                                    IconCmp = step.icon;
                                  } else if (isEndRejected) {
                                    // DITOLAK (MERAH)
                                    circleClass =
                                      "bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20";
                                    titleClass = "text-red-600 font-bold";
                                    IconCmp = XCircle;
                                  }

                                  return (
                                    <div
                                      key={step.id}
                                      className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-3 w-full md:w-[16.66%] shrink-0"
                                    >
                                      {/* Lingkaran (Bulatan) Timeline */}
                                      <div
                                        className={`w-12 h-12 rounded-full border-[3px] flex items-center justify-center transition-all duration-500 z-10 ${circleClass}`}
                                      >
                                        <IconCmp
                                          size={20}
                                          strokeWidth={
                                            isCurrent && !isPast ? 2.5 : 2
                                          }
                                        />
                                      </div>

                                      {/* Teks Keterangan */}
                                      <div className="text-left md:text-center w-full md:px-2">
                                        <h3
                                          className={`text-sm md:text-[13px] ${titleClass}`}
                                        >
                                          {step.id === 6 && isEndRejected
                                            ? "Ditolak"
                                            : step.id === 6 && isEndAccepted
                                              ? "Diterima"
                                              : step.label}
                                        </h3>
                                        <p className="text-xs md:text-[11px] text-gray-500 font-medium mt-0.5 md:leading-tight">
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
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl mt-6">
                <Search size={40} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-[#0D278D] font-bold text-lg">
                  Tidak ada lamaran
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Anda belum memiliki lamaran di kategori ini.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StatusLamaran;
