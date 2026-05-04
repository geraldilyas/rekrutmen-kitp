import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [active, setActive] = useState('Beranda');

  const menuItems = ['Beranda', 'Lowongan', 'Pengumuman', 'Arsip'];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0D278D] rounded-lg flex items-center justify-center text-[#FEB700] font-bold text-xl">B</div>
            <span className="font-bold text-[#0D278D] text-xl tracking-tight">Rekrutmen BBWS</span>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`relative text-sm font-medium transition-colors ${
                  active === item ? 'text-[#0D278D]' : 'text-gray-500 hover:text-[#0D278D]'
                }`}
              >
                {item}
                {active === item && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FEB700]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button className="text-[#0D278D] font-semibold text-sm hover:opacity-80 transition-opacity">Masuk</button>
            <button className="bg-[#0D278D] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform">
              Daftar
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;