import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, AlertTriangle, LogIn, UserPlus } from "lucide-react";
import logoBbwsms from "../../assets/img/logobbwsms.png";
import logoRekrutmen from "../../assets/img/rekrutmenbaru.png";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Status token reaktif
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return !!token && token !== "undefined" && token !== "null";
  });

  // Data user reaktif
  const [userData, setUserData] = useState<any>(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;  
  });

  // Pemicu sinkronisasi status login setiap rute berubah
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");
    const checkLogin = !!currentToken && currentToken !== "undefined" && currentToken !== "null";
    
    setIsLoggedIn(checkLogin);

    if (!currentToken || !checkLogin) {
      setUserData(null);
      return;
    }

    if (cachedUser) {
      setUserData(JSON.parse(cachedUser));
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${currentToken}` },
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Gagal mengambil data profil terbaru");
        return r.json();
      })
      .then((data) => {
        setUserData(data);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((err) => {
        console.warn("Background profile fetch skipped/failed:", err.message);
      });
  }, [location.pathname]);

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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    navigate("/beranda?status=logout");
  };

  return (
    <>
      {/* ================= 1. FIXED TOP NAVBAR SECTION ================= */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-inner font-['Poppins']">
        <div className="w-full px-8 md:px-12">
          <div className="flex justify-between h-20 items-center">
            
            {/* Brand Logo Group */}
            <Link to="/beranda" className="flex items-center gap-3 group">
              <img
                src={logoBbwsms}
                alt="Logo BBWS"
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="h-7 w-[2px] bg-[#0D278D] self-center shrink-0" />
              <img
                src={logoRekrutmen}
                alt="Logo Rekrutmen"
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Dynamic Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.name}
                    to={`${item.path}${!isLoggedIn ? "?status=logout" : ""}`}
                    className={`group relative text-sm font-semibold transition-all duration-300 px-1 py-0.5 ${
                      isActive
                        ? "text-[#FEB700]"
                        : "text-[#0D278D] hover:text-[#FEB700]"
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

            {/* Right Action Buttons System */}
            <div className="flex items-center gap-2">
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
                    className="group flex items-center gap-2 bg-[#0d278d] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#FEB700] hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <UserPlus size={16} className="text-white group-hover:text-white transition-colors" />
                    <span>Daftar</span>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="group flex items-center gap-2 bg-transparent text-[#0D278D] border border-[#0D278D] px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer hover:text-white hover:bg-[#0d278d]"
                  >
                    <LogOut size={16} className="text-[#0D278D] group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-300" />
                    <span>Keluar</span>
                  </button>

                  <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-gray-50/60 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0D278D] to-blue-700 text-white flex items-center justify-center text-sm font-bold shadow-sm tracking-wider">
                      {userData?.name?.charAt(0) || <User size={16} />}
                    </div>
                    <div className="leading-tight pr-1 text-left">
                      <h4 className="text-sm font-bold text-[#0D278D] max-w-[100px] truncate">
                        {userData?.name || "Memuat..."}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        {userData?.role || "Pelamar"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* ============================================================================
          🚀 2. GLOBAL OVERLAY PORTAL: SEKARANG DI LUAR NAV AGAR MATIIN BLUR FULL SCREEN
          ============================================================================ */}
      {showLogoutModal && (
        <div className="fixed inset-0 w-screen h-screen top-0 left-0 z-[99999] flex items-center justify-center p-4">
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes modalBorderSpin {
              0% { transform: translate(-50%, -50%) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .animate-modal-beam {
              animation: modalBorderSpin 3.5s linear infinite !important;
            }
          `}} />

          {/* 🛠️ ADJUST BLUR: Menggunakan backdrop-blur-[4px] agar efek buramnya pas dan ga terlalu burem banget */}
          <div 
            className="fixed inset-0 w-full h-full bg-black/30 backdrop-blur-[5px] transition-all duration-300"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* MODAL BOX CONTAINER */}
          <div className="relative w-full max-w-sm p-[1.5px] rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-[0_25px_60px_-10px_rgba(8,24,90,0.5)] bg-gray-100 z-10">
            
            {/* LAYER BORDER BEAM */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] bg-[conic-gradient(from_0deg,transparent_40%,#FEB700_48%,#FFFFFF_50%,#FEB700_52%,transparent_60%)] animate-modal-beam" />
            </div>

            {/* MODAL CONTENT INSIDE */}
            <div className="relative bg-white rounded-[1.4rem] p-6 text-center z-10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full blur-xl pointer-events-none z-0" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <AlertTriangle size={26} className="text-red-500" strokeWidth={2.3} />
                </div>

                <h3 className="text-xl font-black text-[#0D278D] tracking-tight mb-1.5">
                  Keluar dari Akun?
                </h3>
                
                <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[280px] mx-auto mb-6">
                  Anda akan mengakhiri sesi pelamar ini. Pastikan semua progres pengisian berkas Anda telah tersimpan.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100/80 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-all duration-300"
                  >
                    Batal
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 px-4 py-3 rounded-xl bg-white text-red-500 border border-red-500 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    <span>Ya, Keluar</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default Navbar;