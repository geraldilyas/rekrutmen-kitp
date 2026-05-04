import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock, Briefcase, GraduationCap, Search, Filter } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// Data Dummy Lowongan
const jobsData = [
  {
    id: 1,
    kategori: "Tenaga Pendukung",
    jurusan: "Teknik Sipil",
    waktu: "5 Hari Lagi",
    posisi: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
    deskripsi: "Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis, administratif, dan sosial.",
    pendidikan: ["S1", "D3"]
  },
  {
    id: 2,
    kategori: "Tenaga Pendukung",
    jurusan: "Administrasi",
    waktu: "Tutup Besok",
    posisi: "Petugas Administrasi Satker",
    deskripsi: "Mendukung pengelolaan administrasi perkantoran, kearsipan, dan penyusunan laporan rutin.",
    pendidikan: ["S1", "D3", "SMA"]
  },
  {
    id: 3,
    kategori: "Konsultan Individu",
    jurusan: "IT Support",
    waktu: "12 Hari Lagi",
    posisi: "Software Engineer (Full-Stack)",
    deskripsi: "Mengembangkan sistem informasi manajemen sumber daya air berbasis web dan mobile.",
    pendidikan: ["S1"]
  },
  {
    id: 4,
    kategori: "Konsultan Individu",
    jurusan: "Hukum",
    waktu: "2 Minggu Lagi",
    posisi: "Staf Advokasi Hukum",
    deskripsi: "Menangani aspek legalitas lahan, sengketa pemanfaatan wilayah sungai, dan penyusunan draf.",
    pendidikan: ["S1", "S2"]
  },
  {
    id: 5,
    kategori: "Tenaga Pendukung",
    jurusan: "Akuntansi",
    waktu: "3 Hari Lagi",
    posisi: "Staf Keuangan & Pelaporan",
    deskripsi: "Melakukan rekapitulasi keuangan, verifikasi dokumen pencairan, dan pelaporan realisasi anggaran.",
    pendidikan: ["S1", "D3"]
  },
  {
    id: 6,
    kategori: "Konsultan Individu",
    jurusan: "Teknik Lingkungan",
    waktu: "1 Bulan Lagi",
    posisi: "Ahli Lingkungan Hidup",
    deskripsi: "Menyusun kajian AMDAL dan memastikan proyek infrastruktur mematuhi standar lingkungan.",
    pendidikan: ["S1", "S2"]
  }
];

const Lowongan: React.FC = () => {
  // State untuk menyimpan kategori filter yang sedang aktif
  const [activeFilter, setActiveFilter] = useState('Semua');

  // Daftar kategori filter
  const filters = ['Semua', 'Tenaga Pendukung', 'Konsultan Individu'];

  // Logika untuk menyaring data berdasarkan filter yang dipilih
  const filteredJobs = activeFilter === 'Semua' 
    ? jobsData 
    : jobsData.filter(job => job.kategori === activeFilter);

  return (
    <div className="bg-gray-50/30 min-h-screen font-['Poppins']">
      {/* Panggil Navbar */}
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header Section dengan Gradasi */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#0D278D] to-[#FEB700]">
              Temukan Karir Anda di <br className="hidden md:block" />
              Balai Besar Wilayah Sungai
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Bergabunglah bersama kami untuk menjaga kedaulatan air dan membangun infrastruktur berkelanjutan untuk masa depan Indonesia.
            </p>
          </motion.div>
        </section>

        {/* Filter Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0D278D]">
                <Filter size={20} />
              </div>
              <span className="font-bold text-[#0D278D]">Filter Kategori:</span>
            </div>

            {/* Tombol-tombol Filter */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-[#0D278D] text-white shadow-lg shadow-blue-900/20'
                      : 'bg-transparent text-gray-500 border border-gray-200 hover:border-[#0D278D] hover:text-[#0D278D]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Job Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* AnimatePresence + layout pada motion.div bikin transisi filter jadi smooth */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredJobs.map((job) => (
                <motion.div 
                  layout
                  key={job.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -8 }}
                  className="group p-8 rounded-[2rem] border border-gray-100 bg-white hover:border-[#FEB700]/30 hover:shadow-[0_20px_40px_-15px_rgba(13,39,141,0.12)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Card: Jurusan & Waktu */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="px-4 py-1.5 rounded-xl bg-blue-50/50 text-[#0D278D] text-xs font-bold tracking-wider border border-blue-100">
                        {job.jurusan}
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                        <Clock size={14} />
                        <span>{job.waktu}</span>
                      </div>
                    </div>

                    {/* Kategori Tag Dinamis */}
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase size={16} className={job.kategori === 'Konsultan Individu' ? 'text-[#FEB700]' : 'text-[#0D278D]'} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${job.kategori === 'Konsultan Individu' ? 'text-[#FEB700]' : 'text-[#0D278D]'}`}>
                        {job.kategori}
                      </span>
                    </div>

                    {/* Judul & Deskripsi */}
                    <h3 className="text-xl font-bold text-[#0D278D] mb-4 group-hover:text-[#FEB700] transition-colors leading-tight">
                      {job.posisi}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                      {job.deskripsi}
                    </p>
                  </div>

                  {/* Footer Card: Pendidikan & Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={18} className="text-gray-400 mr-1" />
                      {job.pendidikan.map((edu, index) => (
                        <span key={index} className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[11px] font-bold text-[#0D278D]">
                          {edu}
                        </span>
                      ))}
                    </div>
                    <button className="bg-transparent border-2 border-[#0D278D] text-[#0D278D] w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-[#0D278D] group-hover:text-white transition-all duration-300 shadow-sm">
                      <ChevronRight size={20} className="transform group-hover:translate-x-0.5 transition-transform duration-300" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {/* Kondisi jika data kosong (meskipun sekarang ada datanya semua) */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-20">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">Belum ada lowongan untuk kategori ini.</p>
            </div>
          )}
        </section>
      </main>

    </div>
  );
};

export default Lowongan;