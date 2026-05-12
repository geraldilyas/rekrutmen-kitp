import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  Calendar,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  History,
} from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";

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

const Arsip: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("Semua Riwayat");

  const filters = ["Semua Riwayat", "Diterima", "Tidak Lulus"];

  const filteredHistory =
    activeFilter === "Semua Riwayat"
      ? archiveJobs
      : archiveJobs.filter((job) => job.statusAkhir === activeFilter);

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 border border-blue-100 mb-6">
              <Archive size={16} className="text-[#FEB700]" />
              <span className="text-[#0D278D] text-sm font-bold tracking-widest uppercase">
                Arsip Lamaran
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#0D278D] via-[#0D278D] to-[#FEB700]">
              Riwayat Perjalanan Karir <br className="hidden md:block" />
              Anda Bersama Kami
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Seluruh rekam jejak dan riwayat pendaftaran Anda di Balai Besar
              Wilayah Sungai tersimpan rapi pada halaman ini.
            </p>
          </motion.div>
        </section>

        {/* Filter Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-200">
                <History size={18} />
              </div>
              <span className="font-bold text-[#0D278D]">Filter Riwayat:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeFilter === filter
                      ? "bg-[#0D278D] text-white shadow-md"
                      : "bg-transparent text-gray-500 border border-gray-200 hover:border-[#0D278D] hover:text-[#0D278D]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* List History Arsip */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div layout className="space-y-6">
            <AnimatePresence>
              {filteredHistory.map((job) => (
                <motion.div
                  layout
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-[0_15px_40px_-15px_rgba(13,39,141,0.08)] hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Bagian Info Utama (Kiri) */}
                  <div className="p-8 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          job.kategori === "Konsultan Individu"
                            ? "bg-[#FEB700]/10 text-[#FEB700]"
                            : "bg-blue-50 text-[#0D278D]"
                        }`}
                      >
                        <Briefcase size={14} /> {job.kategori}
                      </span>
                      <span className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-[11px] font-semibold">
                        {job.jurusan}
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-[11px] font-semibold flex items-center gap-1.5 border border-gray-100">
                        <Clock size={12} /> {job.periode}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#0D278D] mb-2">
                      {job.posisi}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                      {job.deskripsi}
                    </p>

                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} className="text-gray-400 mr-1" />
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

                  {/* Bagian Status Akhir & Tanggal (Kanan) */}
                  <div className="bg-[#fafafa] p-8 md:w-72 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center items-start md:items-center text-left md:text-center shrink-0">
                    <span className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1.5 md:justify-center">
                      <Calendar size={14} /> Tgl Melamar:
                    </span>
                    <span className="text-sm font-bold text-[#0D278D] mb-6">
                      {job.tanggalMelamar}
                    </span>

                    <div className="w-full h-[1px] bg-gray-200 mb-6 hidden md:block" />

                    <span className="text-xs text-gray-400 font-medium mb-3">
                      Status Akhir:
                    </span>
                    <div
                      className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border ${
                        job.statusAkhir === "Diterima"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      {job.statusAkhir === "Diterima" ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <XCircle size={18} />
                      )}
                      {job.statusAkhir}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredHistory.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-100 shadow-sm mt-6">
              <Archive size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-[#0D278D] mb-2">
                Riwayat Kosong
              </h3>
              <p className="text-gray-500 text-sm">
                Anda belum memiliki riwayat lamaran dengan status ini.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Arsip;
