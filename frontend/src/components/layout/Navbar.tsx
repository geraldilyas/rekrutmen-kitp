import React from "react";
import { Link, useLocation } from "react-router-dom";
import logoBbwsms from "../../assets/img/logobbwsms.png";

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
    <nav className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-gray-100">
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
                      ? "text-[#FEB700]"
                      : "text-[#0D278D] hover:text-[#FEB700]"
                  }`}
                >
                  {item.name}

                  {/* underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full bg-[#FEB700] transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-[#0D278D] font-semibold text-sm hover:text-[#FEB700]"
            >
              Masuk
            </Link>

            <Link
              to="/register"
              className="bg-[#0D278D] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#FEB700] hover:text-[#0D278D] transition-all"
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
