import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Pastikan import ini sesuai dengan ekstensi gambar logo kamu (.png / .svg / .jpg)
import logoBbwsms from '../assets/logobbwsms.png';

const Navbar: React.FC = () => {
  // Menggunakan useLocation untuk mendeteksi rute halaman saat ini
  const location = useLocation();

  // Ubah array string menjadi array of objects yang berisi nama dan path rute
  const menuItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Lowongan', path: '/lowongan' },
    { name: 'Status Lamaran', path: '/status' },
    { name: 'Pengumuman', path: '/pengumuman' },
    { name: 'Arsip', path: '/arsip' }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="w-full px-8 md:px-12">
        <div className="flex justify-between h-24 items-center">
          
          {/* Logo Section - Sekarang kalau diklik mengarah ke Beranda (/) */}
          <Link to="/" className="flex items-center">
            <div className="flex items-baseline">
              <span className="italic font-medium text-[#0D278D] text-xl">
                REKRUTMEN<span className="text-[#FEB700]">KITP</span>
              </span>
            </div>
            
            <span className="text-gray-400 text-xs italic font-medium ml-1.5 mr-2.5">
              by
            </span>
            
            <img 
              src={logoBbwsms} 
              alt="Logo BBWS MS" 
              className="h-12 md:h-14 w-auto object-contain transition-all duration-300" 
            />
          </Link>

          {/* Menu Items */}
          <div className="hidden md:flex items-center space-x-10">
            {menuItems.map((item) => {
              // Cek apakah item ini adalah halaman yang sedang aktif
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative text-base font-medium transition-colors duration-300 group ${
                    isActive ? 'text-[#FEB700]' : 'text-[#0D278D] hover:text-[#FEB700]'
                  }`}
                >
                  {item.name}

                  {/* Garis bawah HANYA untuk efek HOVER (Sesuai request kamu sebelumnya) */}
                  <div className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-t-full bg-[#FEB700] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-5">
            <button className="text-[#0D278D] font-bold text-sm hover:text-[#FEB700] transition-colors">
              Masuk
            </button>
            <button className="bg-[#0D278D] text-white px-7 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-[#FEB700] hover:text-[#0D278D] hover:scale-105 transition-all duration-300">
              Daftar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;