import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Plus, MonitorUp, FileCheck, Brain, Award, GraduationCap, Clock, Briefcase, ArrowRight, MessageCircle } from 'lucide-react';

// Data untuk Tahapan Seleksi
const tahapanSeleksi = [
  {
    id: 1,
    title: 'Registrasi Online',
    desc: 'Pendaftaran dan upload dokumen persyaratan melalui portal resmi.',
    icon: MonitorUp,
    color: 'bg-[#0D278D] text-white',
  },
  {
    id: 2,
    title: 'Seleksi Administrasi',
    desc: 'Verifikasi kelengkapan dan keabsahan dokumen oleh tim panitia.',
    icon: FileCheck,
    color: 'bg-[#0D278D] text-white',
  },
  {
    id: 3,
    title: 'Tes Kompetensi',
    desc: 'Ujian tertulis/CAT dan wawancara teknis sesuai formasi yang dipilih.',
    icon: Brain,
    color: 'bg-[#FEB700] text-[#0D278D]',
  },
  {
    id: 4,
    title: 'Pengumuman Akhir',
    desc: 'Penetapan kelulusan berdasarkan peringkat nilai terbaik.',
    icon: Award,
    color: 'bg-[#0D278D] text-white',
  },
];

const Home: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative bg-[#0D278D] py-20 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FEB700]/10 skew-x-12 transform translate-x-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-[#FEB700] text-[#0D278D] font-bold text-xs mb-6 shadow-sm">
                REKRUTMEN TENAGA NON-PNS 2026
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Membangun Negeri Melalui Pengelolaan Sumber Daya Air
              </h1>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                Bergabunglah bersama Balai Besar Wilayah Sungai Kementerian PUPR. Kontribusi nyata untuk pembangunan infrastruktur vital nasional.
              </p>
              <div className="flex gap-4">
                <button className="bg-[#FEB700] text-[#0D278D] px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-yellow-500/20">
                  Lihat Lowongan Aktif <ChevronRight size={18} />
                </button>
                <button className="border border-white/30 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors">
                  Panduan Pendaftaran
                </button>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#FEB700] rounded-xl text-[#0D278D]"><Plus size={24} /></div>
                  <div>
                    <p className="text-blue-200 text-sm">Batas Akhir Pendaftaran</p>
                    <p className="text-white font-bold text-lg">15 Oktober 2026</p>
                  </div>
                </div>
                <div className="h-px bg-white/10" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-blue-200 text-xs mb-1">Dokumen Terverifikasi</p>
                    <p className="text-white font-bold text-2xl">4,281</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs mb-1">Posisi Tersedia</p>
                    <p className="text-white font-bold text-2xl">12 Formasi</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lowongan Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-[#0D278D] mb-2">Lowongan Pilihan</h2>
            <p className="text-gray-500">Temukan posisi yang sesuai dengan keahlian Anda</p>
          </div>
          <button className="text-[#0D278D] font-bold flex items-center gap-1 hover:text-[#FEB700] transition-colors group">
            Lihat Semua Posisi 
            <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              id: 1,
              kategori: "Tenaga Pendukung",
              jurusan: "Teknik Sipil",
              waktu: "5 Hari Lagi",
              posisi: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
              deskripsi: "Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis, administratif, dan sosial pada kegiatan Percepatan Peningkatan Tata Guna Air Irigasi.",
              pendidikan: ["S1", "D3"]
            },
            {
              id: 2,
              kategori: "Tenaga Pendukung",
              jurusan: "Administrasi",
              waktu: "Tutup Besok",
              posisi: "Petugas Administrasi Satker",
              deskripsi: "Mendukung pengelolaan administrasi perkantoran, kearsipan, dan penyusunan laporan rutin pada satuan kerja Balai.",
              pendidikan: ["S1", "D3", "SMA"]
            },
            {
              id: 3,
              kategori: "Konsultan Individu",
              jurusan: "IT Support",
              waktu: "12 Hari Lagi",
              posisi: "Software Engineer (Full-Stack)",
              deskripsi: "Mengembangkan dan memelihara sistem informasi manajemen sumber daya air berbasis web dan mobile yang terintegrasi.",
              pendidikan: ["S1"]
            },
            {
              id: 4,
              kategori: "Konsultan Individu",
              jurusan: "Hukum",
              waktu: "2 Minggu Lagi",
              posisi: "Staf Advokasi Hukum",
              deskripsi: "Menangani aspek legalitas lahan, sengketa pemanfaatan wilayah sungai, dan penyusunan draf perjanjian kerja sama.",
              pendidikan: ["S1", "S2"]
            }
          ].map((job) => (
            <motion.div 
              key={job.id}
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

                {/* Kategori Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase size={16} className={job.kategori === 'Konsultan Individu' ? 'text-[#FEB700]' : 'text-[#0D278D]'} />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {job.kategori}
                  </span>
                </div>

                {/* Judul & Deskripsi */}
                <h3 className="text-2xl font-bold text-[#0D278D] mb-4 group-hover:text-[#FEB700] transition-colors leading-tight">
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
                <button className="bg-transparent border-2 border-[#0D278D] text-[#0D278D] px-6 py-2.5 rounded-xl text-sm font-bold group-hover:bg-[#0D278D] group-hover:text-white transition-all duration-300 shadow-sm flex items-center gap-2">
                  Lamar
                  <ChevronRight size={16} className="opacity-0 -translate-x-2 w-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:w-4 transition-all duration-300" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

     {/* Tahapan Seleksi Section - Upgraded Luxury Version */}
      <section className="py-32 bg-white relative overflow-hidden border-y border-gray-100">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-40 -right-40 w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[#FEB700] font-bold text-sm tracking-widest uppercase mb-2 block">
              Timeline Pendaftaran
            </span>
            <h2 className="text-4xl font-extrabold text-[#0D278D] mb-6">
              Tahapan Seleksi
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Proses rekrutmen dilaksanakan secara transparan, akuntabel, dan bebas biaya untuk menjaring talenta terbaik bangsa.
            </p>
          </div>

          <div className="relative">
            {/* Garis penghubung dashed (hanya desktop) */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] border-t-2 border-dashed border-[#0D278D]/15 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {tahapanSeleksi.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2, type: "spring", stiffness: 100 }}
                  className="flex flex-col items-center text-center group relative p-6 rounded-[2rem] hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(13,39,141,0.08)] transition-all duration-500"
                >
                  {/* Watermark Number Raksasa */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[120px] font-black text-gray-50/60 z-0 group-hover:text-blue-50/60 group-hover:-translate-y-4 transition-all duration-500 pointer-events-none select-none">
                    {step.id}
                  </div>

                  {/* Icon Container */}
                  <div className="relative z-10 w-24 h-24 mb-8 rounded-[1.5rem] bg-white shadow-xl shadow-blue-900/5 flex items-center justify-center border border-gray-100 group-hover:border-[#FEB700] group-hover:scale-110 group-hover:-translate-y-3 transition-all duration-500">
                    
                    {/* Inner Colored Circle - Default Biru, Hover Kuning */}
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-inner bg-[#0D278D] text-white group-hover:bg-[#FEB700] group-hover:text-[#0D278D] transition-colors duration-500">
                      <step.icon size={28} strokeWidth={2} />
                    </div>
                    
                    {/* Floating Badge Number - Default Biru, Hover Kuning */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full font-bold flex items-center justify-center border-[3px] border-white shadow-sm bg-[#0D278D] text-white group-hover:bg-[#FEB700] group-hover:text-[#0D278D] transition-all duration-500 group-hover:rotate-12">
                      {step.id}
                    </div>
                  </div>

                  {/* Teks Content */}
                  <h3 className="text-xl font-bold text-[#0D278D] mb-3 relative z-10 group-hover:text-[#FEB700] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed px-2 relative z-10">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Ultra Premium */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto bg-[#0D278D] rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(13,39,141,0.4)] border border-white/10">

          {/* Dynamic Glow Backgrounds */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FEB700] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-20 translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          
          {/* Subtle Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

          {/* Content Wrapper dengan animasi membal dari bawah */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Glassmorphism Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-[#FEB700] animate-pulse" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">Pendaftaran Sedang Dibuka</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Siap Berkontribusi bagi <span className="text-[#FEB700]">Negeri?</span>
            </h2>

            <p className="text-blue-100/80 text-lg mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Daftarkan diri Anda sekarang dan jadilah bagian dari tim yang berdedikasi menjaga kedaulatan air Indonesia. Kesempatan untuk membangun infrastruktur vital nasional ada di tangan Anda.
            </p>

            {/* Button Group */}
            <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto">
              
              {/* Primary Button (Yellow) */}
              <button className="group relative overflow-hidden bg-[#FEB700] text-[#0D278D] px-8 md:px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(254,183,0,0.6)] flex items-center justify-center gap-3 w-full sm:w-auto">
                <span>Mulai Pendaftaran</span>
                <ArrowRight size={20} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>

              {/* Secondary Glass Button */}
              <button className="group bg-white/5 border border-white/10 text-white px-8 md:px-12 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-3 w-full sm:w-auto shadow-lg">
                <MessageCircle size={20} className="text-blue-300 group-hover:-translate-y-1 group-hover:text-white transition-all duration-300" />
                <span>Hubungi Kami</span>
              </button>

            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;