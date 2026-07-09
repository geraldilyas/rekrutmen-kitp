import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  HelpCircle,
  Search,
  ChevronDown,
  BookOpen,
  Layers,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: React.ReactNode;
}

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -5, scale: 0.95, transition: { duration: 0.15 } }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "Semua Kategori" },
    { id: "umum", name: "Umum" },
    { id: "akun", name: "Akun & Login" },
    { id: "lamaran", name: "Lamaran & Dokumen" },
    { id: "status", name: "Status & Pengumuman" },
    { id: "teknis", name: "Kendala Teknis" },
  ];

  const faqData: FAQItem[] = [
    // UMUM
    {
      id: "umum-1",
      category: "umum",
      question: "Apa itu website Rekrutmen KI/TP BBWS Mesuji Sekampung?",
      answer: (
        <span>
          Website ini adalah kanal resmi <strong>rekrutmen.bbwsms.com</strong> yang digunakan BBWS Mesuji Sekampung untuk proses seleksi <strong>Konsultan Individual (KI)</strong> dan <strong>Tenaga Pendukung (TP)</strong> secara daring — mulai dari pembuatan akun, pengisian data, unggah dokumen, hingga pengecekan status dan pengumuman hasil seleksi.
        </span>
      ),
    },
    {
      id: "umum-2",
      category: "umum",
      question: "Apa bedanya posisi KI (Konsultan Individual) dan TP (Tenaga Pendukung)?",
      answer: (
        <span>
          <strong>KI</strong> umumnya untuk tenaga profesional/teknis dengan kualifikasi keahlian tertentu (misalnya bidang teknik, keuangan, atau administrasi) yang direkrut per paket pekerjaan. <strong>TP</strong> adalah tenaga pendukung operasional non-ASN. Setiap lowongan mencantumkan kategorinya masing-masing, lengkap dengan kualifikasi dan durasi kontrak, pada halaman pengumuman lowongan.
        </span>
      ),
    },
    {
      id: "umum-3",
      category: "umum",
      question: "Siapa saja yang bisa mendaftar melalui website ini?",
      answer: (
        <span>
          Setiap pelamar yang memenuhi kualifikasi pada lowongan yang sedang dibuka dapat mendaftar, sepanjang memenuhi persyaratan administrasi (pendidikan, pengalaman, dan dokumen pendukung) yang tercantum pada masing-masing paket pekerjaan.
        </span>
      ),
    },
    {
      id: "umum-4",
      category: "umum",
      question: "Apakah pendaftaran melalui website ini dikenakan biaya?",
      answer: (
        <span>
          <strong>Tidak.</strong> Seluruh proses pendaftaran dan seleksi tidak dipungut biaya apa pun. Waspadai pihak yang mengatasnamakan BBWS Mesuji Sekampung dan meminta sejumlah uang dengan janji kelulusan.
        </span>
      ),
    },
    // AKUN
    {
      id: "akun-1",
      category: "akun",
      question: "Bagaimana cara membuat akun di website ini?",
      answer: (
        <span>
          Buka <strong>rekrutmen.bbwsms.com/beranda</strong>, pilih menu <strong>Daftar/Registrasi</strong>, lalu isi data diri sesuai KTP (nama lengkap, NIK, email aktif, dan nomor HP aktif). Gunakan email yang benar-benar bisa diakses karena tautan verifikasi akan dikirim ke sana. Langkah lengkap bergambar tersedia pada manual pendaftaran di bagian bawah halaman ini.
        </span>
      ),
    },
    {
      id: "akun-2",
      category: "akun",
      question: "Saya lupa password, bagaimana cara reset-nya?",
      answer: (
        <span>
          Pada halaman login, klik <strong>Lupa Password</strong>, masukkan email yang terdaftar, lalu ikuti tautan reset yang dikirim ke email tersebut. Jika email tidak kunjung masuk, periksa folder Spam/Promosi atau hubungi tim bantuan (lihat bagian Kontak di bawah).
        </span>
      ),
    },
    {
      id: "akun-3",
      category: "akun",
      question: "Apakah satu orang boleh punya lebih dari satu akun?",
      answer: (
        <span>
          Tidak disarankan. Gunakan satu akun (satu NIK/satu email) untuk seluruh proses pendaftaran agar riwayat lamaran dan status seleksi Anda tetap konsisten dan mudah dilacak oleh panitia.
        </span>
      ),
    },
    {
      id: "akun-4",
      category: "akun",
      question: "Data apa saja yang perlu disiapkan sebelum mendaftar akun?",
      answer: (
        <span>
          Siapkan terlebih dahulu:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>KTP dan NIK</li>
            <li>Email dan nomor HP aktif</li>
            <li>Ijazah &amp; transkrip nilai terakhir</li>
            <li>CV/riwayat pengalaman kerja</li>
            <li>Dokumen pendukung lain sesuai kualifikasi lowongan (SKA/SKT, sertifikat, dsb.)</li>
          </ul>
        </span>
      ),
    },
    // LAMARAN
    {
      id: "lamaran-1",
      category: "lamaran",
      question: "Dokumen apa saja yang wajib diunggah?",
      answer: (
        <span>
          Dokumen wajib umumnya meliputi KTP, ijazah, transkrip nilai, CV, dan pas foto terbaru, ditambah dokumen spesifik sesuai kualifikasi paket pekerjaan yang dilamar (misalnya sertifikat keahlian). Daftar lengkap dan wajib/tidaknya suatu dokumen selalu tercantum pada halaman detail masing-masing lowongan sebelum Anda mulai mengisi formulir.
        </span>
      ),
    },
    {
      id: "lamaran-2",
      category: "lamaran",
      question: "Berapa ukuran maksimal file dan format apa yang didukung?",
      answer: (
        <span>
          Sistem umumnya menerima file <strong>PDF</strong> (dan JPG/PNG untuk foto) dengan ukuran maksimal yang ditampilkan langsung di kolom unggah setiap dokumen. Jika file Anda melebihi batas, kompres terlebih dahulu tanpa mengurangi keterbacaan dokumen sebelum diunggah ulang.
        </span>
      ),
    },
    {
      id: "lamaran-3",
      category: "lamaran",
      question: "Bisakah saya mengedit data/dokumen setelah submit?",
      answer: (
        <span>
          Selama status lamaran masih <strong>Draft</strong> atau belum dikunci sistem, data dan dokumen umumnya masih bisa diperbarui melalui menu Riwayat Lamaran. Setelah lamaran berstatus <strong>Terkirim/Menunggu Verifikasi</strong>, perubahan biasanya tidak lagi dapat dilakukan secara mandiri — hubungi panitia melalui kontak di bawah bila memang diperlukan koreksi data.
        </span>
      ),
    },
    {
      id: "lamaran-4",
      category: "lamaran",
      question: "Bagaimana cara memilih paket pekerjaan/posisi yang saya lamar?",
      answer: (
        <span>
          Buka menu <strong>Lowongan/Paket Pekerjaan</strong>, baca kualifikasi dan persyaratan setiap paket dengan teliti, lalu klik <strong>Lamar</strong> pada paket yang sesuai. Anda hanya disarankan melamar paket yang benar-benar sesuai dengan kualifikasi dan pengalaman Anda agar proses verifikasi berjalan lancar.
        </span>
      ),
    },
    // STATUS
    {
      id: "status-1",
      category: "status",
      question: "Bagaimana cara mengecek status lamaran saya?",
      answer: (
        <span>
          Login ke akun Anda, lalu buka menu <strong>Riwayat/Status Lamaran</strong>. Di sana akan tampil tahapan yang sedang berjalan (misalnya Terkirim, Verifikasi Administrasi, Lolos/Tidak Lolos) untuk setiap paket pekerjaan yang Anda lamar.
        </span>
      ),
    },
    {
      id: "status-2",
      category: "status",
      question: "Kapan dan di mana pengumuman hasil seleksi diumumkan?",
      answer: (
        <span>
          Jadwal setiap tahapan seleksi mengikuti jadwal resmi yang diumumkan pada masing-masing paket pekerjaan. Pengumuman hasil ditampilkan pada dashboard akun Anda dan/atau menu Pengumuman di website ini — pantau secara berkala agar tidak terlewat.
        </span>
      ),
    },
    {
      id: "status-3",
      category: "status",
      question: "Status saya masih 'Menunggu Verifikasi' setelah beberapa hari, apakah normal?",
      answer: (
        <span>
          Wajar. Verifikasi administrasi dilakukan bertahap oleh panitia sesuai jumlah pelamar dan tenggat yang ditetapkan. Selama masa seleksi masih berjalan, status ini bukan berarti lamaran Anda ditolak. Jika masa verifikasi telah lewat dari jadwal yang diumumkan, silakan hubungi tim bantuan.
        </span>
      ),
    },
    // TEKNIS
    {
      id: "teknis-1",
      category: "teknis",
      question: "Website tidak bisa diakses atau muncul error, apa yang harus saya lakukan?",
      answer: (
        <span>
          Coba langkah berikut secara berurutan:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Muat ulang (refresh) halaman atau coba beberapa saat kemudian, terutama menjelang tenggat pendaftaran saat trafik sedang tinggi</li>
            <li>Gunakan browser terbaru (Chrome/Firefox/Edge) dan pastikan koneksi internet stabil</li>
            <li>Hapus cache/cookie browser, atau coba mode penyamaran (incognito)</li>
            <li>Jika masih gagal, tangkap layar (screenshot) pesan errornya lalu laporkan ke tim bantuan</li>
          </ul>
        </span>
      ),
    },
    {
      id: "teknis-2",
      category: "teknis",
      question: "Saya butuh panduan langkah demi langkah, di mana bisa saya dapatkan?",
      answer: (
        <span>
          Manual pendaftaran (bergambar) dan video tutorial penggunaan website tersedia di folder berikut:{" "}
          <a
            className="text-[#0D278D] hover:text-[#FEB700] font-bold underline"
            href="https://drive.google.com/drive/folders/13rrZqs-FJilJxSqdAesR7AIQEQhPHYH_?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Manual &amp; Video Tutorial Pendaftaran
          </a>
          . Disarankan menonton video tersebut sebelum mulai mendaftar agar tidak ada tahapan yang terlewat.
        </span>
      ),
    },
    {
      id: "teknis-3",
      category: "teknis",
      question: "Ke mana saya bisa menghubungi jika kendala saya belum terjawab di sini?",
      answer: (
        <span>
          Hubungi Bagian SDM/Kepegawaian BBWS Mesuji Sekampung melalui kontak resmi yang tercantum pada halaman <strong>Kontak</strong> di website ini, pada jam kerja. Sertakan nama lengkap, NIK, dan tangkapan layar kendala agar dapat ditindaklanjuti lebih cepat.
        </span>
      ),
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;

      const qText = item.question.toLowerCase();
      // Safe string check for React Nodes
      const matchesSearch = qText.includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const getCategoryLabel = (id: string) => {
    return categories.find((c) => c.id === id)?.name ?? "Semua Kategori";
  };

  return (
    <div
      className="bg-white min-h-screen font-['Poppins'] pb-24"
      onClick={() => setOpenDropdown(null)}
    >
      {/* --- HERO BANNER --- */}
      <div className="bg-[#0D278D] pt-32 pb-8 relative rounded-b-[2.5rem] md:rounded-b-[4rem] z-10 overflow-hidden text-center px-4">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FEB700]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
            <HelpCircle size={16} className="text-[#FEB700]" />
            <span className="text-white text-[11px] font-bold tracking-widest uppercase">
              Pusat Bantuan
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            FAQ Rekrutmen KI/TP <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FEB700] to-[#ffe066]">
              BBWS Mesuji Sekampung
            </span>
          </h1>
          <p className="text-blue-100/80 text-[14px] md:text-base font-medium max-w-2xl mx-auto leading-relaxed mb-8">
            Kumpulan pertanyaan yang paling sering ditanyakan seputar pendaftaran Konsultan Individual (KI) dan Tenaga Pendukung (TP) melalui website rekrutmen resmi.
          </p>
        </div>
      </div>

      {/* --- FILTER & SEARCH BLOCK (Lowongan-style design) --- */}
      <div className="max-w-4xl mx-auto px-4 mt-12 relative z-20">
        <div
          className="flex flex-row flex-wrap items-center justify-center gap-4 mb-12 pb-6 border-b border-gray-100 relative z-30 w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-row flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            {/* 1. Dropdown Kategori */}
            <div className="relative w-full sm:w-[220px]">
              <button
                onClick={() => toggleDropdown("category")}
                className={`group w-full bg-white text-[#0D278D] font-bold text-xs pl-10 pr-4 h-[46px] rounded-xl border transition-all duration-300 hover:bg-[#0D278D] hover:text-white flex items-center justify-between cursor-pointer ${openDropdown === "category"
                  ? "border-[#0D278D] ring-4 ring-blue-50/50"
                  : "border-[#0D278D]/20"
                  }`}
              >
                <Layers size={14} className="absolute left-3.5 text-[#0D278D] group-hover:text-white transition-colors" />
                <span className="truncate mr-1">
                  {getCategoryLabel(activeCategory)}
                </span>
                <motion.div
                  animate={{ rotate: openDropdown === "category" ? 180 : 0 }}
                  className="flex items-center shrink-0"
                >
                  <ChevronDown size={14} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openDropdown === "category" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 p-1.5"
                  >
                    {categories.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setActiveCategory(opt.id);
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold text-[#0D278D] hover:bg-gray-50 block cursor-pointer"
                      >
                        {opt.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Search Field */}
            <div className="relative w-full sm:w-[320px]">
              <div className="group w-full bg-white text-[#0D278D] font-bold text-xs pl-10 pr-4 h-[46px] rounded-xl border border-[#0D278D]/20 flex items-center justify-between">
                <Search size={14} className="absolute left-3.5 text-[#0D278D]" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-[#0D278D] text-xs py-2 placeholder-gray-400 font-bold"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-xs text-gray-400 hover:text-[#0D278D] cursor-pointer font-bold shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- FAQ ACCORDIONS LIST --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = expandedId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layout
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isOpen
                      ? "border-[#0D278D] shadow-md shadow-blue-900/5"
                      : "border-[#0D278D]/30 shadow-sm hover:border-[#0D278D]"
                      }`}
                  >
                    {/* Header Question Clickable Row */}
                    <button
                      onClick={() => setExpandedId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left outline-none cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs transition-all duration-300 ${isOpen
                            ? "bg-[#0D278D] text-white"
                            : "bg-blue-50 text-[#0D278D] group-hover:bg-[#0D278D] group-hover:text-white"
                            }`}
                        >
                          ?
                        </span>
                        <span className="text-[14px] md:text-[15px] font-bold text-[#0D278D] leading-snug">
                          {faq.question}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`shrink-0 ${isOpen ? "text-[#0D278D]" : "text-gray-400"
                          }`}
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </button>

                    {/* Expandable Accordion Body */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="pl-16 pr-6 pb-6 text-sm text-gray-600 leading-relaxed font-normal border-t border-[#0D278D]/10 pt-4 bg-gray-50/30">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-[#0D278D]/30"
              >
                <HelpCircle
                  size={48}
                  className="mx-auto text-[#0D278D]/40 mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-[#0D278D] font-extrabold text-xl">
                  Tidak Ada Pertanyaan
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Tidak ada hasil pencarian yang cocok untuk "{searchTerm}".
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- HELP CARD / FOOTER CTA --- */}
        <div className="mt-16 bg-gradient-to-r from-[#0D278D] to-[#1E3A8A] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-lg border border-[#0D278D]">
          <div className="absolute right-[-40px] top-[-40px] w-48 h-48 bg-[#FEB700]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen size={20} className="text-[#FEB700]" /> Masih Butuh Panduan Visual?
              </h3>
              <p className="text-sm text-blue-100 max-w-xl font-light leading-relaxed">
                Ikuti manual pendaftaran bergambar dan video tutorial resmi, langkah demi langkah dari pembuatan akun sampai pengiriman berkas lamaran Anda.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="https://drive.google.com/drive/folders/13rrZqs-FJilJxSqdAesR7AIQEQhPHYH_?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#FEB700] text-[#0D278D] font-bold text-xs md:text-sm rounded-xl transition-all duration-300 hover:bg-[#ffe066] hover:shadow-md block text-center"
              >
                Buka Manual & Video
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
