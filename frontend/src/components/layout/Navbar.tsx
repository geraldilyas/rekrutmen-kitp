import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, UserPlus } from "lucide-react"; 
import logoBbwsms from "../../assets/img/logobbwsms.png";
import logoRekrutmen from "../../assets/img/rekrutmenbaru.png";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !location.search.includes("status=logout");

  const publicMenu = [
    { name: "Beranda", path: "/beranda" },
    { name: "Pengumuman", path: "/pengumuman" },
  ];

  const privateMenu = [
    { name: "Beranda", path: "/beranda" },
    { name: "Lowongan", path: "/lowongan" },
    { name: "Status Lamaran", path: "/status" },
    { name: "Pengumuman", path: "/pengumuman" },
    { name: "Arsip", path: "/arsip" },
  ];

  const menuItems = isLoggedIn ? privateMenu : publicMenu;

 const handleLogout = () => {
    navigate("/beranda?status=logout");
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

          <div className="hidden md:flex items-center mx-auto  gap-2 lg:gap-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (

                <Link
                  key={item.name}
                  to={`${item.path}${!isLoggedIn ? "?status=logout" : ""}`}
                  className={`group relative text-sm font-semibold transition-all duration-300 px-1 py-0.5 ${
                    isActive
                      ? "text-[#FEB700]" // Warna kuning emas kalau tombol lagi aktif/diklik
                      : "text-[#0D278D] hover:text-[#FEB700]" // Warna biru utama kalau didiemin
                  }`}
                >
                  {item.name} 
                  <span
                    className={`absolute left-0 -bottom-1 h-[2.5px] w-full bg-[#FEB700] rounded-full transition-transform duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="group flex items-center gap-2 text-[#0D278D] border-2 border-transparent px-4 py-2.5 rounded-xl text-sm font-bold hover:text-[#FEB700] transition-all duration-300"
                >
                  <LogIn size={16} className="text-[#0D278D] group-hover:text-[#FEB700] transition-colors" />
                  <span>Masuk</span>
                </Link>
                <Link
                  to="/register"
                  className="group flex items-center gap-2 bg-[#0d278d] text-white  px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#FEB700] hover:text-white transition-all duration-300 shadow-sm hover:shadow-sm"
                >
                  <UserPlus size={16} className="text-white group-hover:text-white transition-colors" />
                  <span>Daftar</span>
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