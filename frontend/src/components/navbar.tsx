import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import bbwsmsbaru from "../assets/bbwsmsbaru.png";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const menuItems = [
    { name: "Beranda", path: "/beranda" },
    { name: "Lowongan", path: "/lowongan" },
    { name: "Status Lamaran", path: "/status" },
    { name: "Pengumuman", path: "/pengumuman" },
    { name: "Arsip", path: "/arsip" },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white border-b border-gray-100 shadow-sm">
      {/* MENGUBAH max-w-7xl mx-auto MENJADI w-full. 
         Gunakan px-4 sampai px-16 untuk menjaga jarak aman di pinggiran layar.
      */}
      <div className="w-full px-4 sm:px-10 lg:px-16">
        <div className="flex justify-between h-20 items-center">
          
          {/* --- LOGO AREA (RATA KIRI) --- */}
          <Link to="/beranda" className="flex items-center gap-2 sm:gap-3 relative z-[110] shrink-0">
            <img
              src={bbwsmsbaru}
              alt="Logo BBWS"
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <span className="font-bold text-[#0D278D] text-base sm:text-lg whitespace-nowrap">
              Rekrutmen KITP
            </span>
          </Link>

          {/* --- DESKTOP MENU (TETAP DI TENGAH ANTARA LOGO & BUTTON) --- */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="relative text-sm font-semibold transition-colors duration-300 group text-[#0D278D] hover:text-[#FEB700] whitespace-nowrap"
              >
                {item.name}
                <div className={`absolute -bottom-1.5 left-0 right-0 h-[2.5px] rounded-t-full bg-[#FEB700] transition-transform duration-300 origin-left ${location.pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            ))}
          </div>

          {/* --- DESKTOP AUTH (RATA KANAN) --- */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/login" className="text-[#0D278D] font-semibold text-sm hover:text-[#FEB700] transition-colors">
              Masuk
            </Link>
            <Link to="/register" className="bg-[#0D278D] text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-900/10 hover:bg-[#FEB700] hover:text-[#0D278D] transition-all duration-300">
              Daftar
            </Link>
          </div>

          {/* --- HAMBURGER BUTTON (MOBILE) --- */}
          <div className="lg:hidden flex items-center relative z-[110]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#0D278D] hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current rounded-full origin-center"
                />
                <motion.span
                  animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  className="w-full h-0.5 bg-current rounded-full"
                />
                <motion.span
                  animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-current rounded-full origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* --- MENU OVERLAY TETAP SAMA --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#0D278D]/20 backdrop-blur-sm z-[90] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] sm:w-[350px] bg-white z-[100] lg:hidden shadow-2xl flex flex-col p-8"
            >
              <div className="mt-16 flex flex-col space-y-1">
                {menuItems.map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={item.name}
                  >
                    <Link
                      to={item.path}
                      className={`block py-4 text-lg font-bold transition-colors ${
                        location.pathname === item.path ? "text-[#FEB700]" : "text-[#0D278D]"
                      } hover:text-[#FEB700]`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto space-y-4">
                <hr className="border-gray-100 mb-6" />
                <Link to="/login" className="block w-full py-3.5 text-center font-bold text-[#0D278D] border-2 border-[#0D278D] rounded-xl hover:bg-gray-50 transition-colors">
                  Masuk
                </Link>
                <Link to="/register" className="block w-full py-4 text-center font-bold text-white bg-[#0D278D] rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-transform">
                  Daftar Sekarang
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;