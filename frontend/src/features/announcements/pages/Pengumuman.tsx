import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Calendar,
  Users,
  ArrowLeft,
  Download,
  CheckCircle2,
  Award,
  FileText,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";

// Data Dummy Pengumuman (Sudah ditambah detail jurusan, deskripsi, pendidikan)
const announcements = [
  {
    id: 1,
    kategori: "Tenaga Pendukung",
    jurusan: "Teknik Sipil",
    posisi: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    deskripsi:
      "Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis, administratif, dan sosial pada kegiatan Percepatan Peningkatan Tata Guna Air Irigasi.",
    pendidikan: ["S1", "D3"],
    tanggalTutup: "20 April 2026",
    totalPendaftar: 245,
    lulus: [
      { nama: "Ahmad Faisal", nik: "187102********0001" },
      { nama: "Budi Santoso", nik: "187104********0003" },
      { nama: "Citra Lestari", nik: "187105********0005" },
      { nama: "Dewi Anggraini", nik: "187101********0002" },
      { nama: "Eko Prasetyo", nik: "187103********0004" },
    ],
  },
  {
    id: 2,
    kategori: "Konsultan Individu",
    jurusan: "IT Support",
    posisi: "Software Engineer (Full-Stack)",
    deskripsi:
      "Mengembangkan dan memelihara sistem informasi manajemen sumber daya air berbasis web dan mobile yang terintegrasi.",
    pendidikan: ["S1"],
    tanggalTutup: "15 April 2026",
    totalPendaftar: 128,
    lulus: [
      { nama: "Fajar Nugraha", nik: "317201********0008" },
      { nama: "Gilang Ramadhan", nik: "317202********0011" },
    ],
  },
  {
    id: 3,
    kategori: "Tenaga Pendukung",
    jurusan: "Administrasi",
    posisi: "Petugas Administrasi Satker",
    deskripsi:
      "Mendukung pengelolaan administrasi perkantoran, kearsipan, dan penyusunan laporan rutin pada satuan kerja Balai.",
    pendidikan: ["S1", "D3", "SMA"],
    tanggalTutup: "10 April 2026",
    totalPendaftar: 412,
    lulus: [
      { nama: "Hani Fitriani", nik: "327301********0007" },
      { nama: "Indra Gunawan", nik: "327302********0009" },
      { nama: "Joko Widodo", nik: "327303********0012" },
    ],
  },
];

const Pengumuman: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedData = announcements.find((a) => a.id === selectedId);

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
              <Megaphone size={16} className="text-[#FEB700]" />
              <span className="text-[#0D278D] text-sm font-bold tracking-widest uppercase">
                Pusat Informasi
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#0D278D] via-[#0D278D] to-[#FEB700]">
              Pengumuman Hasil Akhir <br className="hidden md:block" />
              Seleksi Rekrutmen
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Selamat kepada para kandidat yang telah dinyatakan lulus. Berikut
              adalah daftar resmi hasil akhir seleksi penerimaan.
            </p>
          </motion.div>
        </section>

        {/* Dynamic Content Area */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {/* 1. TAMPILAN DAFTAR PENGUMUMAN */}
            {selectedId === null ? (
              <motion.div
                key="list-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6"
              >
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(13,39,141,0.12)] hover:border-[#FEB700]/30 transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between gap-8"
                  >
                    <div className="flex-1">
                      {/* Top Info: Kategori, Jurusan, Badge Selesai */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            item.kategori === "Konsultan Individu"
                              ? "bg-[#FEB700]/10 text-[#FEB700]"
                              : "bg-blue-50 text-[#0D278D]"
                          }`}
                        >
                          <Briefcase size={14} /> {item.kategori}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-semibold">
                          {item.jurusan}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-green-100">
                          <CheckCircle2 size={14} /> Selesai
                        </span>
                      </div>

                      {/* Judul & Deskripsi */}
                      <h3 className="text-2xl font-bold text-[#0D278D] mb-2 group-hover:text-[#FEB700] transition-colors">
                        {item.posisi}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
                        {item.deskripsi}
                      </p>

                      {/* Info Pendidikan & Statistik */}
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                          <GraduationCap
                            size={16}
                            className="text-gray-400 mr-1"
                          />
                          {item.pendidikan.map((edu, index) => (
                            <span
                              key={index}
                              className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-[#0D278D]"
                            >
                              {edu}
                            </span>
                          ))}
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500 font-medium border-l border-gray-200 pl-6">
                          <span className="flex items-center gap-1.5">
                            <Users size={16} /> {item.totalPendaftar} Pelamar
                          </span>
                          <span className="flex items-center gap-1.5 text-[#0D278D]">
                            <Award size={16} /> {item.lulus.length} Diterima
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Aksi & Tanggal Tutup */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                      <span className="text-gray-400 text-xs font-medium flex items-center gap-1.5 md:mb-2">
                        <Calendar size={14} /> Ditutup: {item.tanggalTutup}
                      </span>
                      <button className="bg-gray-50 text-[#0D278D] px-6 py-3 rounded-xl font-bold group-hover:bg-[#0D278D] group-hover:text-white transition-all duration-300 flex items-center gap-2 shadow-sm border border-gray-200 group-hover:border-transparent w-full md:w-auto justify-center">
                        Lihat Hasil
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              /* 2. TAMPILAN DETAIL KANDIDAT YANG LULUS */
              <motion.div
                key="detail-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Tombol Kembali */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#0D278D] transition-colors font-semibold group"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-[#0D278D] shadow-sm transition-all">
                    <ArrowLeft
                      size={20}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                  </div>
                  Kembali ke Daftar Pengumuman
                </button>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(13,39,141,0.08)] overflow-hidden">
                  {/* Header Detail */}
                  <div className="p-8 md:p-12 border-b border-gray-100 bg-[#fafafa]">
                    <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0D278D] text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-blue-100">
                      {selectedData?.kategori}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D278D] mb-6 leading-tight">
                      Hasil Seleksi Akhir: <br />
                      <span className="text-[#FEB700]">
                        {selectedData?.posisi}
                      </span>
                    </h2>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <p className="text-gray-500 font-medium">
                        Berdasarkan hasil keputusan panitia, ditetapkan{" "}
                        <span className="font-bold text-[#0D278D]">
                          {selectedData?.lulus.length} orang
                        </span>{" "}
                        kandidat yang dinyatakan Lulus.
                      </p>

                      <button
                        onClick={() =>
                          alert(
                            "Mendownload file SK_Pengumuman_" +
                              selectedData?.posisi.substring(0, 5) +
                              ".pdf",
                          )
                        }
                        className="shrink-0 bg-[#0D278D] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 hover:bg-[#FEB700] hover:text-[#0D278D] transition-all duration-300 shadow-lg shadow-blue-900/20 hover:scale-105"
                      >
                        <Download size={18} />
                        Download PDF
                      </button>
                    </div>
                  </div>

                  {/* List Tabel Lulus */}
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                      <FileText className="text-[#FEB700]" size={24} />
                      <h4 className="text-[#0D278D] font-extrabold text-xl">
                        Daftar Kandidat Diterima
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {selectedData?.lulus.map((person, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white hover:border-[#FEB700]/40 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-[#0D278D] group-hover:bg-[#0D278D] group-hover:text-white transition-colors border border-gray-200 group-hover:border-transparent">
                              {index + 1}
                            </div>
                            <div>
                              <h5 className="font-bold text-gray-900 text-lg">
                                {person.nama}
                              </h5>
                              <p className="text-sm text-gray-500 font-medium">
                                Nomor Induk:{" "}
                                <span className="tracking-widest">
                                  {person.nik}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="hidden md:flex px-4 py-2 rounded-lg bg-green-50 text-green-600 font-bold text-sm items-center gap-2 border border-green-100">
                            <CheckCircle2 size={16} /> Lulus
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default Pengumuman;
