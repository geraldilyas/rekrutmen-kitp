import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [active, setActive] = useState('Beranda');

  const menuItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Lowongan', path: '/lowongan' },
    { name: 'Pengumuman', path: '/pengumuman' },
    { name: 'Arsip', path: '/arsip' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0D278D] rounded-lg flex items-center justify-center text-[#FEB700] font-bold text-xl">B</div>
            <span className="font-bold text-[#0D278D] text-xl tracking-tight">Rekrutmen BBWS</span>
          </div>

          {/* Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setActive(item.name)}
                className={`relative text-sm font-medium transition-colors ${
                  active === item.name ? 'text-[#0D278D]' : 'text-gray-500 hover:text-[#0D278D]'
                }`}
              >
                {item.name}
                {active === item.name && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FEB700]"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-4">

            {/* LOGIN */}
            <Link
              to="/login"
              className="text-[#0D278D] font-semibold text-sm hover:opacity-80 transition-opacity"
            >
              Masuk
            </Link>

            {/* REGISTER */}
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