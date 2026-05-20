import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CalendarClock,
  CheckCircle2,
  UploadCloud,
  GraduationCap,
  UserPlus,
  Banknote,
  ClipboardList,
  Check,
  Info,
  Briefcase,
  FileText,
  Send // <-- Tambahan icon untuk tombol lamar
} from "lucide-react";
import Navbar from "../../../components/layout/Navbar"; 

// Data Dummy Detail Lowongan
const jobDetail = {
  id: 1,
  posisi: "Tenaga Pendamping Masyarakat (TPM) - P3-TGAI",
  kategori: "Tenaga Pendukung",
  jurusan: "Teknik Sipil / Teknik Pengairan",
  waktu: "Tutup dalam 5 Hari",
  lokasi: "Provinsi Lampung (Penempatan tersebar)",
  kuota: "12 Orang",
  gaji: "Rp 3.500.000 - Rp 4.500.000",
  deskripsi:
    "Balai Besar Wilayah Sungai (BBWS) Mesuji Sekampung membuka kesempatan bagi tenaga profesional untuk bergabung sebagai Tenaga Pendamping Masyarakat (TPM). Posisi ini akan bertugas dalam program Percepatan Peningkatan Tata Guna Air Irigasi (P3-TGAI) untuk mendampingi Perkumpulan Petani Pemakai Air (P3A) dalam tahap persiapan, perencanaan, pelaksanaan, dan penyelesaian.",
  kualifikasi: [
    "Warga Negara Indonesia (WNI), diutamakan berdomisili di Provinsi Lampung.",
    "Pendidikan minimal D3/S1 dari jurusan Teknik Sipil atau Teknik Pengairan.",
    "Bukan Aparatur Sipil Negara (PNS/PPPK), TNI, atau POLRI aktif.",
    "Tidak sedang terikat kontrak kerja dengan instansi pemerintah atau swasta lain.",
    "Memiliki kemampuan komunikasi yang baik dan mampu bekerja sama dengan masyarakat petani/pedesaan.",
    "Mampu mengoperasikan aplikasi komputer dasar (Ms. Word, Excel) dan aplikasi pelaporan berbasis Android/Web.",
    "Bersedia ditempatkan di seluruh wilayah kerja BBWS Mesuji Sekampung dan memiliki kendaraan roda dua sendiri."
  ],
  berkas: [
    "Surat Lamaran (ditujukan ke Kepala BBWS Mesuji Sekampung).",
    "Curriculum Vitae (CV) / Daftar Riwayat Hidup terbaru.",
    "Scan Kartu Tanda Penduduk (KTP) asli.",
    "Scan Ijazah dan Transkrip Nilai legalisir.",
    "Pas foto berwarna terbaru ukuran 4x6 (latar belakang merah).",
    "Surat Pernyataan Tidak Terikat Kontrak Kerja (Bermaterai 10.000).",
    "Sertifikat keahlian atau surat pengalaman kerja (jika ada)."
  ]
};

const DetailLowongan: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white min-h-screen font-['Poppins']">
      <Navbar />

      {/* --- HERO HEADER --- */}
      <div className="bg-[#0D278D] pt-32 pb-24 relative rounded-b-[2.5rem] md:rounded-b-[4rem] z-10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FEB700]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button 
              onClick={() => navigate('/lowongan')}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-medium mb-10 group"
            >
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
              Kembali ke Lowongan
            </button>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-[#FEB700] text-[#0D278D] text-xs font-bold tracking-widest uppercase shadow-sm">
                {jobDetail.kategori}
              </span>
              <span className="px-4 py-1.5 rounded-full border border-blue-300/30 text-blue-100 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Clock size={14} /> {jobDetail.waktu}
              </span>
            </div>

            {/* Headline Teks Split */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-8 max-w-4xl tracking-tight">
              <span className="text-white drop-shadow-sm">
                {jobDetail.posisi.split(' - ')[0]}
              </span>
              {jobDetail.posisi.split(' - ')[1] && (
                <>
                  <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-[#ffe066] text-3xl md:text-4xl lg:text-5xl mt-2 inline-block drop-shadow-[0_2px_10px_rgba(254,183,0,0.2)]">
                    - {jobDetail.posisi.split(' - ')[1]}
                  </span>
                </>
              )}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-blue-100/80 text-sm font-medium">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#FEB700]" />
                {jobDetail.lokasi}
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-[#FEB700]" />
                {jobDetail.jurusan}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- MAIN CONTENT (CARDLESS / EDITORIAL STYLE) --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* KIRI: KONTEN UTAMA DENGAN WHITESPACE LEGA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 space-y-16"
          >
            {/* Section: Deskripsi */}
            <section>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] mb-6 tracking-tight flex items-center gap-3">
                <Briefcase size={28} className="text-[#FEB700]" />
                Deskripsi Lowongan
              </h2>
              <p className="text-gray-600 leading-[1.8] text-[15px] md:text-[17px] text-justify font-normal">
                {jobDetail.deskripsi}
              </p>
            </section>

            {/* Section: Kualifikasi */}
            <section>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] mb-8 tracking-tight flex items-center gap-3">
                <CheckCircle2 size={28} className="text-[#FEB700]" />
                Kualifikasi & Persyaratan
              </h2>
              <ul className="space-y-5">
                {jobDetail.kualifikasi.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0D278D] transition-colors">
                      <Check size={14} className="text-[#0D278D] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-gray-600 leading-[1.7] text-[15px] md:text-[16px]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section: Berkas */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D278D] tracking-tight flex items-center gap-3">
                  <FileText size={28} className="text-[#FEB700]" />
                  Berkas yang Disiapkan
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 text-[11px] font-bold rounded-lg uppercase tracking-wider w-fit">
                  <UploadCloud size={14} /> Format PDF
                </span>
              </div>
              
              <ul className="space-y-4">
                {jobDetail.berkas.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0D278D] transition-colors">
                      <Check size={14} className="text-[#0D278D] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-gray-600 text-[15px] md:text-[16px] leading-[1.7]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </motion.div>

          {/* KANAN: SIDEBAR MINIMALIS (Garis vertikal, no box) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-4"
          >
            {/* Pakai border-l buat misahin, bukan kotak */}
            <div className="sticky top-32 lg:border-l-2 lg:border-gray-100 lg:pl-10 pb-8">
              
              <h3 className="text-xl font-extrabold text-[#0D278D] flex items-center gap-2 mb-8">
                <ClipboardList size={22} className="text-[#FEB700]" /> 
                Ringkasan Posisi
              </h3>
              
              <div className="space-y-8 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                    <CalendarClock size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Batas Waktu</p>
                    <p className="font-semibold text-gray-800 text-[15px]">{jobDetail.waktu}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                    <UserPlus size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Kebutuhan</p>
                    <p className="font-semibold text-gray-800 text-[15px]">{jobDetail.kuota}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0D278D] shrink-0">
                    <Banknote size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Estimasi Gaji</p>
                    <p className="font-semibold text-gray-800 text-[15px]">{jobDetail.gaji}</p>
                  </div>
                </div>
              </div>

              {/* Warning/Info Teks Biasa (Tanpa box kuning tebal) */}
              <div className="flex gap-3 mb-8 text-gray-500">
                <Info size={18} className="shrink-0 mt-0.5 text-gray-400" />
                <p className="text-[13px] leading-relaxed">
                  Pastikan seluruh dokumen sudah lengkap dan sesuai persyaratan sebelum menekan tombol lamar di bawah ini.
                </p>
              </div>

              {/* Tombol Lamar */}
              <button className="w-full bg-white text-[#0D278D] border-2 border-[#0D278D] py-4 rounded-full font-bold text-[15px] hover:bg-[#0a1e6e] hover:border-[#0a1e6e] hover:text-white hover:shadow-[0_15px_30px_-10px_rgba(13,39,141,0.4)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group">
                Lamar Posisi Ini
                <Send size={18} className="transform group-hover:translate-x-1 transition-transform" /> 
              </button>
            </div>
          </motion.div>
          
        </div>
      </main>
    </div>
  );
};

export default DetailLowongan;