import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logoBbwsms from "../assets/logobbwsms.png";

const Navbar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Beranda", path: "/beranda" },
    { name: "Lowongan", path: "/lowongan" },
    { name: "Status Lamaran", path: "/status" },
    { name: "Pengumuman", path: "/pengumuman" },
    { name: "Arsip", path: "/arsip" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="w-full px-8 md:px-12">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <Link to="/beranda" className="flex items-center gap-3">
            <img
              src={logoBbwsms}
              alt="Logo BBWS"
              className="h-10 w-auto object-contain"
            />
            <span className="font-bold text-[#0D278D] text-lg">
              Rekrutmen KITP
            </span>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-[#0D278D]"
                      : "text-gray-500 hover:text-[#0D278D]"
                  }`}
                >
                  {item.name}

                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FEB700]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-[#0D278D] font-semibold text-sm hover:opacity-80"
            >
              Masuk
            </Link>

            <Link
              to="/register"
              className="bg-[#0D278D] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform"
            >
              Daftar
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;