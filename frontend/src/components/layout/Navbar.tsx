import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; 
import logoBbwsms from "../../assets/img/logobbwsms.png";
import logoRekrutmen from "../../assets/img/rekrutmenbaru.png";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /*
    ===========================
    AUTH MODE
    false = public navbar
    true  = user sudah login
    ===========================
  */
  const isLoggedIn = true;

  /*
    ===========================
    MENU PUBLIC
    ===========================
  */
  const publicMenu = [
    { name: "Beranda", path: "/beranda" },
    { name: "Pengumuman", path: "/pengumuman" },
  ];

  /*
    ===========================
    MENU PRIVATE
    ===========================
  */
  const privateMenu = [
    { name: "Beranda", path: "/beranda" },
    { name: "Lowongan", path: "/lowongan" },
    { name: "Status Lamaran", path: "/status" },
    { name: "Pengumuman", path: "/pengumuman" },
    { name: "Arsip", path: "/arsip" },
  ];

  const menuItems = isLoggedIn ? privateMenu : publicMenu;

  const handleLogout = () => {
    // nanti hapus token/session disini
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-inner">
      <div className="w-full px-8 md:px-12">
        <div className="flex justify-between h-20 items-center">
          
          <Link to="/beranda" className="flex items-center gap-4 group">
            <div className="flex items-center shrink-0">
              <img
                src={logoBbwsms}
                alt="Logo BBWS Utama"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="h-7 w-[2px] bg-[#0D278D] self-center shrink-0" />
            <div className="flex items-center shrink-0">
              <img
                src={logoRekrutmen}
                alt="Logo Rekrutmen"
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group relative text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-[#FEB700]"
                      : "text-[#0D278D] hover:text-[#FEB700]"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full bg-[#FEB700] rounded-full transition-transform duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-[#0D278D] font-semibold text-sm hover:text-[#FEB700] transition-colors duration-300"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-[#0D278D] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#FEB700] hover:text-[#0D278D] transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Daftar
                </Link>
              </>
            ) : (
              <>

                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 bg-transparent text-[#0D278D] border border-[#0D278D] px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:text-white hover:bg-[#0d278d] transition-all duration-300"
                >
                  <LogOut size={16} className="text-[#0D278D] group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-300" />
                  <span>Keluar</span>
                </button>

                <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-gray-50/60 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0D278D] to-blue-700 text-white flex items-center justify-center text-sm font-bold shadow-sm tracking-wider">
                    A
                  </div>
                  <div className="leading-tight pr-1">
                    <h4 className="text-sm font-bold text-[#0D278D]">
                      Abelian
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                      Pelamar
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 