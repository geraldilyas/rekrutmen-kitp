import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Plus, MonitorUp, FileCheck, Brain, Award } from 'lucide-react';

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
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#0D278D] mb-2">Lowongan Pilihan</h2>
            <p className="text-gray-500">Temukan posisi yang sesuai dengan keahlian Anda</p>
          </div>
          <button className="text-[#0D278D] font-bold flex items-center gap-1 hover:underline">
            Lihat Semua Posisi <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-3xl border border-gray-100 bg-white hover:border-[#0D278D]/20 hover:shadow-2xl hover:shadow-blue-900/5 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 rounded-lg bg-blue-50 text-[#0D278D] text-xs font-bold uppercase tracking-wider">
                  Teknik Sipil
                </span>
                <span className="text-gray-400 text-xs">5 Hari Lagi</span>
              </div>
              <h3 className="text-2xl font-bold text-[#0D278D] mb-4 group-hover:text-[#FEB700] transition-colors">
                Tenaga Pendamping Masyarakat (TPM) - P3-TGAI
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Melaksanakan pendampingan kepada P3A/GP3A/IP3A dalam aspek teknis, administratif, dan sosial pada kegiatan Percepatan Peningkatan Tata Guna Air Irigasi.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">S1</span>
                  <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">D3</span>
                </div>
                <button className="bg-[#0D278D] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#FEB700] hover:text-[#0D278D] transition-colors shadow-md">
                  Lamar Sekarang
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tahapan Seleksi Section */}
      <section className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#0D278D] mb-4">Tahapan Seleksi</h2>
            <p className="text-gray-500 leading-relaxed">
              Proses rekrutmen dilaksanakan secara transparan, akuntabel, dan bebas biaya untuk menjaring kompetensi terbaik.
            </p>
          </div>

          <div className="relative">
            {/* Garis penghubung background (hanya desktop) */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-gray-200" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {tahapanSeleksi.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 ${step.color}`}>
                    <step.icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0D278D] mb-2">
                    {step.id}. {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed px-2">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-[#0D278D] rounded-[40px] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Siap Berkontribusi bagi Negeri?</h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto relative z-10">
            Daftarkan diri Anda sekarang dan jadilah bagian dari tim yang berdedikasi menjaga kedaulatan air Indonesia.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <button className="bg-[#FEB700] text-[#0D278D] px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-yellow-500/20">
              Mulai Pendaftaran
            </button>
            <button className="bg-white/10 text-white border border-white/20 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors backdrop-blur-sm">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;