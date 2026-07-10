import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Phone, X, MessageSquare, ExternalLink } from "lucide-react";
import logoBbwsms from "../../assets/img/logobbwsms.png";
import logoRekrutmen from "../../assets/img/rekrutmenbaru.png";

const Footer: React.FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <footer className="bg-white pt-16 pb-10 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20">

        <motion.svg
          className="relative block w-[200%] h-4"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"

          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >

          <motion.path
            d="M0 10 C 12.5 0, 12.5 20, 25 10 S 37.5 0, 50 10 S 62.5 20, 75 10 S 87.5 0, 100 10 M100 10 C 112.5 0, 112.5 20, 125 10 S 137.5 0, 150 10 S 162.5 20, 175 10 S 187.5 0, 200 10"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"

            animate={{
              stroke: ["#0D278D", "#FEB700", "#0D278D"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.path>
        </motion.svg>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-0">
        <motion.div
          variants={containerVariants as any}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-12 mb-16"
        >
          <motion.div
            variants={itemVariants as any}
            className="md:col-span-12 lg:col-span-5 space-y-8"
          >
            {" "}
            <div className="flex items-center gap-3 sm:gap-4 h-fit">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                <img
                  src={logoBbwsms}
                  alt="PUPR"
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain block transition-all duration-300"
                />
                <div className="h-8 sm:h-10 md:h-12 w-[2px] bg-[#0D278D] self-center shrink-0" />
                <img
                  src={logoRekrutmen}
                  alt="Rekrutmen KITP"
                  className="h-7 sm:h-9 md:h-11 w-auto object-contain block transition-all duration-300"
                />
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm pt-1">
              Direktorat Jenderal Sumber Daya Air. <br />
              Balai Besar Wilayah Sungai Mesuji Sekampung. <br />
              Air Terkelola, Negeri Sejahtera.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-gray-500 group cursor-pointer hover:text-[#0D278D] transition-colors leading-relaxed">
                <MapPin size={16} className="text-[#FEB700] mt-0.5 shrink-0" />
                <span>Jl. Gatot Subroto No.57, Garuntang, Kec. Bumi Waras, Kota Bandar Lampung, Lampung 35401</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 group cursor-pointer hover:text-[#0D278D] transition-colors">
                <Phone size={16} className="text-[#FEB700] shrink-0" />
                <span>0811-7215-700</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 group cursor-pointer hover:text-[#0D278D] transition-colors">
                <Mail size={16} className="text-[#FEB700] shrink-0" />
                <span className="break-all">rekruitmentbbwsms@gmail.com</span>
              </div>
            </div>

            {/* Social Media Row */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/pu_sda_mesuji.sekampung/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0D278D] hover:text-white hover:border-[#0D278D] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-inner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a
                href="https://sda.pu.go.id/balai/bbwsmesujisekampung"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0D278D] hover:text-white hover:border-[#0D278D] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-inner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://sda.pu.go.id/balai/bbwsmesujisekampung"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0D278D] hover:text-white hover:border-[#0D278D] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-inner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@pu_sda_mesuji.sekampung"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0D278D] hover:text-white hover:border-[#0D278D] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-inner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="5" />
                  <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@bbwsmesujisekampung"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0D278D] hover:text-white hover:border-[#0D278D] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-inner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />x
                </svg>
              </a>
              {/* Threads */}
              <a
                href="https://www.threads.net/@pu_sda_mesuji.sekampung"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#0D278D] hover:text-white hover:border-[#0D278D] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-inner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 192 192"
                  fill="currentColor"
                >
                  <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
                </svg>
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants as any}
            className="md:col-span-6 lg:col-span-3 lg:col-start-7 pt-2 md:pt-4"
          >
            <h5 className="font-extrabold text-[#0D278D] mb-6 text-lg">
              Tautan Penting
            </h5>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              {[
                { name: "Profil BBWSMS", url: "https://sda.pu.go.id/balai/bbwsmesujisekampung/" },
                { name: "Peta Wilayah Sungai", url: "https://hydrosmart.bbwsms.com/" },
                { name: "Berita Terkini", url: "https://sda.pu.go.id/balai/bbwsmesujisekampung/pages/category/semua" },
                { name: "WRDC", url: "https://pdsda.sda.pu.go.id/" },
              ].map((item) => (
                <li
                  key={item.name}
                  className="group flex items-center"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full cursor-pointer"
                  >
                    <span className="w-0 h-[2px] bg-[#FEB700] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 ease-out" />
                    <span className="group-hover:text-[#0D278D] group-hover:translate-x-1 transition-all duration-300">
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={itemVariants as any}
            className="md:col-span-6 lg:col-span-3 pt-2 md:pt-4"
          >
            <h5 className="font-extrabold text-[#0D278D] mb-6 text-lg">
              Bantuan & Kontak
            </h5>
            <ul className="space-y-4 text-sm font-medium text-gray-500 mb-8">
              {/* Panduan Aplikasi */}
              <li className="group flex items-center">
                <a
                  href="https://drive.google.com/drive/folders/13rrZqs-FJilJxSqdAesR7AIQEQhPHYH_?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full cursor-pointer"
                >
                  <span className="w-0 h-[2px] bg-[#FEB700] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 ease-out" />
                  <span className="group-hover:text-[#0D278D] group-hover:translate-x-1 transition-all duration-300">
                    Panduan Aplikasi
                  </span>
                </a>
              </li>

              {/* Hubungi Panitia */}
              <li
                onClick={() => setShowContactModal(true)}
                className="group flex items-center cursor-pointer"
              >
                <span className="w-0 h-[2px] bg-[#FEB700] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 ease-out" />
                <span className="group-hover:text-[#0D278D] group-hover:translate-x-1 transition-all duration-300">
                  Hubungi Panitia
                </span>
              </li>

              {/* Lokasi Tes */}
              <li className="group flex items-center">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Balai+Besar+Wilayah+Sungai+Mesuji+Sekampung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full cursor-pointer"
                >
                  <span className="w-0 h-[2px] bg-[#FEB700] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 ease-out" />
                  <span className="group-hover:text-[#0D278D] group-hover:translate-x-1 transition-all duration-300">
                    Lokasi Tes
                  </span>
                </a>
              </li>

              {/* FAQ */}
              <li className="group flex items-center">
                <Link
                  to="/faq"
                  className="flex items-center w-full cursor-pointer"
                >
                  <span className="w-0 h-[2px] bg-[#FEB700] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 ease-out" />
                  <span className="group-hover:text-[#0D278D] group-hover:translate-x-1 transition-all duration-300">
                    FAQ
                  </span>
                </Link>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}

          className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 relative z-10"
        >
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            © 2026 BBWS Kementerian PUPR. Direktorat Jenderal Sumber Daya Air.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-gray-400 font-medium">
            <span className="hover:text-[#0D278D] cursor-pointer transition-colors">
              Kebijakan Privasi
            </span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-300 my-auto" />
            <span className="hover:text-[#0D278D] cursor-pointer transition-colors">
              Syarat & Ketentuan
            </span>
          </div>
        </motion.div>
      </div>

      {/* Hubungi Panitia Modal */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 w-screen h-screen top-0 left-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 w-full h-full bg-black/40 backdrop-blur-[5px]"
              onClick={() => setShowContactModal(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative z-10 border border-[#0D278D]/20 font-['Poppins'] text-center overflow-hidden"
            >
              {/* Decorative gradient top bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0D278D] via-[#FEB700] to-[#0D278D]" />
              
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="w-14 h-14 bg-blue-50 text-[#0D278D] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Phone size={24} />
              </div>

              <h3 className="text-xl font-extrabold text-[#0D278D] tracking-tight mb-2">
                Hubungi Panitia Rekrutmen
              </h3>
              
              <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">
                Silakan hubungi panitia melalui kontak di bawah ini pada jam kerja aktif (Senin - Jumat, 08:00 - 16:00 WIB).
              </p>

              <div className="space-y-3 mb-8">
                {/* Phone Call / WhatsApp Row */}
                <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold px-1">
                    <span className="flex items-center gap-1.5"><MessageSquare size={13} className="text-[#FEB700]" /> Telepon / WhatsApp</span>
                    <span>0811-7215-700</span>
                  </div>
                  <a
                    href="https://wa.me/628117215700"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#25D366] text-white font-bold text-xs rounded-xl hover:bg-[#20ba5a] transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    Chat via WhatsApp <ExternalLink size={12} />
                  </a>
                </div>

                {/* Email Row */}
                <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold px-1">
                    <span className="flex items-center gap-1.5"><Mail size={13} className="text-[#FEB700]" /> Email Panitia</span>
                    <span className="truncate max-w-[200px]">rekruitmentbbwsms@gmail.com</span>
                  </div>
                  <a
                    href="mailto:rekruitmentbbwsms@gmail.com"
                    className="w-full py-2.5 bg-[#0D278D] text-white font-bold text-xs rounded-xl hover:bg-blue-950 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    Kirim Email Resmi <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;