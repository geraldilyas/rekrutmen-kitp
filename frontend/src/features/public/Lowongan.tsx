import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Clock,
  Briefcase,
  GraduationCap,
  Search,
  Filter,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";

// Data Dummy Lowongan
const jobsData = [
  {
    id: 1,
    kategori: "Tenaga Pendukung",
    jurusan: "Teknik Sipil",
    waktu: "5 Hari Lagi",
    posisi: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    deskripsi:
      "Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis, administratif, dan sosial.",
    pendidikan: ["S1", "D3"],
  },
  {
    id: 2,
    kategori: "Tenaga Pendukung",
    jurusan: "Administrasi",
    waktu: "Tutup Besok",
    posisi: "Petugas Administrasi Satker",
    deskripsi:
      "Mendukung pengelolaan administrasi perkantoran, kearsipan, dan penyusunan laporan rutin.",
    pendidikan: ["S1", "D3", "SMA"],
  },
  {
    id: 3,
    kategori: "Konsultan Individu",
    jurusan: "IT Support",
    waktu: "12 Hari Lagi",
    posisi: "Software Engineer (Full-Stack)",
    deskripsi:
      "Mengembangkan sistem informasi manajemen sumber daya air berbasis web dan mobile.",
    pendidikan: ["S1"],
  },
  {
    id: 4,
    kategori: "Konsultan Individu",
    jurusan: "Hukum",
    waktu: "2 Minggu Lagi",
    posisi: "Staf Advokasi Hukum",
    deskripsi:
      "Menangani aspek legalitas lahan, sengketa pemanfaatan wilayah sungai, dan penyusunan draf.",
    pendidikan: ["S1", "S2"],
  },
  {
    id: 5,
    kategori: "Tenaga Pendukung",
    jurusan: "Akuntansi",
    waktu: "3 Hari Lagi",
    posisi: "Staf Keuangan & Pelaporan",
    deskripsi:
      "Melakukan rekapitulasi keuangan, verifikasi dokumen pencairan, dan pelaporan realisasi anggaran.",
    pendidikan: ["S1", "D3"],
  },
  {
    id: 6,
    kategori: "Konsultan Individu",
    jurusan: "Teknik Lingkungan",
    waktu: "1 Bulan Lagi",
    posisi: "Ahli Lingkungan Hidup",
    deskripsi:
      "Menyusun kajian AMDAL dan memastikan proyek infrastruktur mematuhi standar lingkungan.",
    pendidikan: ["S1", "S2"],
  },
];

const Lowongan: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const filters = ["Semua", "Tenaga Pendukung", "Konsultan Individu"];

  const filteredJobs =
    activeFilter === "Semua"
      ? jobsData
      : jobsData.filter((job) => job.kategori === activeFilter);

  return (
    <div className="bg-gray-50/50 min-h-screen font-['Poppins']">
      <Navbar />
      <main className="pt-32 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#0D278D] to-[#FEB700]">
              Rekrutmen KITP <br className="hidden md:block" />
              Mesuji Sekampung
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Temukan peluang karir strategis dan jadilah bagian dari
              pengelolaan sumber daya air nasional yang berkelanjutan.
            </p>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/60 backdrop-blur-md rounded-[3rem] p-6 sm:p-10 border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 border-b border-gray-100 pb-10">
              <div>
                <h2 className="text-2xl font-bold text-[#0D278D]">
                  Lowongan Aktif
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  Menampilkan{" "}
                  <span className="text-[#FEB700] font-bold">
                    {filteredJobs.length}
                  </span>{" "}
                  posisi tersedia
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1.5 bg-gray-100/70 rounded-2xl w-fit">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      activeFilter === filter
                        ? "bg-white text-[#0D278D] shadow-md shadow-gray-200/50"
                        : "text-gray-500 hover:text-[#0D278D]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredJobs.map((job) => (
                  <motion.div
                    layout
                    key={job.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                    whileHover={{ y: -10 }}
                    className="group p-8 rounded-[2.5rem] border border-gray-100 bg-white hover:border-[#FEB700]/40 hover:shadow-[0_25px_50px_-12px_rgba(13,39,141,0.08)] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="px-4 py-1.5 rounded-xl bg-blue-50/50 text-[#0D278D] text-[11px] font-black uppercase tracking-widest border border-blue-100">
                          {job.jurusan}
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold">
                          <Clock size={14} />
                          <span>{job.waktu}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Briefcase
                          size={16}
                          className={
                            job.kategori === "Konsultan Individu"
                              ? "text-[#FEB700]"
                              : "text-[#0D278D]"
                          }
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-[0.15em] ${job.kategori === "Konsultan Individu" ? "text-[#FEB700]" : "text-[#0D278D]"}`}
                        >
                          {job.kategori}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0D278D] mb-4 leading-tight group-hover:text-[#FEB700] transition-colors">
                        {job.posisi}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed mb-10">
                        {job.deskripsi}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap
                          size={18}
                          className="text-gray-400 mr-1"
                        />
                        {job.pendidikan.map((edu, index) => (
                          <span
                            key={index}
                            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-black text-[#0D278D]"
                          >
                            {edu}
                          </span>
                        ))}
                      </div>
                      <button className="bg-gray-50 text-[#0D278D] w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-[#0D278D] group-hover:text-white transition-all duration-300 shadow-sm">
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {filteredJobs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32"
                >
                  <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                    <Search size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-[#0D278D] text-xl font-bold">
                    Lowongan Tidak Ditemukan
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Maaf bro, kategori ini sedang tidak tersedia. Coba cek
                    kategori lain.
                  </p>
                  <button
                    onClick={() => setActiveFilter("Semua")}
                    className="mt-8 text-[#0D278D] font-bold text-sm underline underline-offset-8 hover:text-[#FEB700] transition-colors"
                  >
                    Kembali ke Semua Lowongan
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Lowongan;
