import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, Calendar, Briefcase, GraduationCap, CheckCircle2, XCircle, Clock, History } from 'lucide-react';
import Navbar from '../components/navbar';
// import Footer from '../components/footer';

// Data Dummy Riwayat Arsip Lamaran
const archiveJobs = [
  {
    id: 1,
    kategori: "Konsultan Individu",
    jurusan: "Teknik Informatika",
    posisi: "Data Analyst",
    deskripsi: "Melakukan pengolahan data spasial dan non-spasial terkait sumber daya air untuk kebutuhan pelaporan pimpinan.",
    pendidikan: ["S1"],
    tanggalMelamar: "10 Agustus 2025",
    periode: "Rekrutmen Tahap II 2025",
    statusAkhir: "Diterima"
  },
  {
    id: 2,
    kategori: "Tenaga Pendukung",
    jurusan: "Administrasi",
    posisi: "Staf Administrasi Umum",
    deskripsi: "Mengelola surat menyurat, arsip digital, dan dokumen kepegawaian di lingkungan Balai Besar Wilayah Sungai.",
    pendidikan: ["D3", "SMA"],
    tanggalMelamar: "05 Februari 2025",
    periode: "Rekrutmen Tahap I 2025",
    statusAkhir: "Tidak Lulus"
  },
  {
    id: 3,
    kategori: "Tenaga Pendukung",
    jurusan: "Teknik Sipil",
    posisi: "Pengawas Lapangan Irigasi",
    deskripsi: "Melakukan monitoring dan evaluasi terhadap proyek rehabilitasi jaringan irigasi tingkat sekunder.",
    pendidikan: ["S1", "D3"],
    tanggalMelamar: "12 November 2024",
    periode: "Rekrutmen Akhir Tahun 2024",
    statusAkhir: "Tidak Lulus"
  }
];

const Arsip: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Semua Riwayat');

  const filters = ['Semua Riwayat', 'Diterima', 'Tidak Lulus'];

  const filteredHistory = activeFilter === 'Semua Riwayat' 
    ? archiveJobs 
    : archiveJobs.filter(job => job.statusAkhir === activeFilter);

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 border border-blue-100 mb-6 shadow-sm">
              <Archive size={16} className="text-[#FEB700]" />
              <span className="text-[#0D278D] text-sm font-bold tracking-widest uppercase">Arsip Lamaran</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#0D278D] via-[#0D278D] to-[#FEB700]">
              Riwayat Perjalanan Karir <br className="hidden md:block" />
              Anda Bersama Kami
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Seluruh rekam jejak dan riwayat pendaftaran Anda di Balai Besar Wilayah Sungai tersimpan rapi pada halaman ini.
            </p>
          </motion.div>
        </section>

        {/* --- KONTENER UTAMA (FILTER & LIST DISATUKAN) --- */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/60 backdrop-blur-md rounded-[3rem] p-6 sm:p-8 md:p-10 border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)]">
            
            {/* Filter Area - Didesain menyatu di bagian atas grid */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100 px-2">
              <div>
                <h2 className="text-2xl font-bold text-[#0D278D]">Daftar Riwayat</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  Menampilkan <span className="text-[#FEB700] font-bold">{filteredHistory.length}</span> arsip lamaran
                </p>
              </div>

              {/* Segmented Control Filter */}
              <div className="flex items-center gap-1.5 p-1.5 bg-gray-100/70 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                      activeFilter === filter
                        ? 'bg-white text-[#0D278D] shadow-md shadow-gray-200/50'
                        : 'text-gray-500 hover:text-[#0D278D]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List History Arsip */}
            <motion.div layout className="space-y-6">
              <AnimatePresence mode='popLayout'>
                {filteredHistory.map((job) => (
                  <motion.div 
                    layout
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(13,39,141,0.12)] hover:border-[#FEB700]/30 transition-all duration-300 overflow-hidden flex flex-col md:flex-row group"
                  >
                    {/* Bagian Info Utama (Kiri) */}
                    <div className="p-8 flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 border ${
                          job.kategori === 'Konsultan Individu' ? 'bg-[#FEB700]/10 text-[#FEB700] border-[#FEB700]/20' : 'bg-blue-50 text-[#0D278D] border-blue-100'
                        }`}>
                          <Briefcase size={14} /> {job.kategori}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                          {job.jurusan}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-gray-100">
                          <Clock size={12} /> {job.periode}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-[#0D278D] mb-3 group-hover:text-[#FEB700] transition-colors leading-tight">
                        {job.posisi}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {job.deskripsi}
                      </p>

                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-gray-400 mr-1" />
                        {job.pendidikan.map((edu, index) => (
                          <span key={index} className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-black text-[#0D278D]">
                            {edu}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bagian Status Akhir & Tanggal (Kanan) */}
                    <div className="bg-[#fafafa] p-8 md:w-72 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center items-start md:items-center text-left md:text-center shrink-0 group-hover:bg-[#0D278D]/[0.02] transition-colors">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 md:justify-center">
                        <Calendar size={14} /> Tgl Melamar:
                      </span>
                      <span className="text-sm font-bold text-[#0D278D] mb-6">
                        {job.tanggalMelamar}
                      </span>

                      <div className="w-full h-[1px] bg-gray-200 mb-6 hidden md:block" />

                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Status Akhir:</span>
                      <div className={`w-full px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 border ${
                        job.statusAkhir === 'Diterima' 
                          ? 'bg-green-50 text-green-600 border-green-100 shadow-sm shadow-green-100' 
                          : 'bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-100'
                      }`}>
                        {job.statusAkhir === 'Diterima' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        {job.statusAkhir}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            <AnimatePresence>
              {filteredHistory.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24"
                >
                  <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                    <History size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-[#0D278D] text-xl font-bold">Riwayat Kosong</h3>
                  <p className="text-gray-400 mt-2 text-sm">Anda belum memiliki riwayat lamaran dengan status ini.</p>
                  <button 
                    onClick={() => setActiveFilter('Semua Riwayat')}
                    className="mt-8 text-[#0D278D] font-bold text-sm underline underline-offset-8 hover:text-[#FEB700] transition-colors"
                  >
                    Kembali ke Semua Riwayat
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

export default Arsip;