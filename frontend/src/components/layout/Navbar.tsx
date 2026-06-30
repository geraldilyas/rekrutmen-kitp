import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, User, AlertTriangle, LogIn, UserPlus, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; 
import logoBbwsms from "../../assets/img/logobbwsms.png";
import logoRekrutmen from "../../assets/img/rekrutmenbaru.png";
import { api } from "../../services/api";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  const BACKEND_URL = "http://localhost:8000";


  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return !!token && token !== "undefined" && token !== "null";
  });


  const [userData, setUserData] = useState<any>(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;  
  });

  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    setImageError(false);
  }, [location.pathname, userData?.avatar_path]);

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");
    
    const hasValidToken = !!currentToken && currentToken !== "undefined" && currentToken !== "null";
    
    setIsLoggedIn(hasValidToken);

    if (!hasValidToken) {
      setUserData(null);
      return;
    }

    if (cachedUser && cachedUser !== "undefined" && cachedUser !== "null") {
      try {
        const parsed = JSON.parse(cachedUser);
        if (!userData || userData.id !== parsed.id) {
          setUserData(parsed);
        }
      } catch (e) {
        console.error("Format cache user rusak:", e);
      }
    }

    api.get("/auth/me")
      .then((res: any) => {
        console.log("Sync User Data:", res.data);
        const user = res.data.user || res.data;
        setUserData(user);
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch((err: any) => {
        console.warn("Background profile fetch skipped/failed:", err.message);
        
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          setUserData(null);
          window.location.replace("/beranda");
        }
      });
  }, [location.pathname]); 

  useEffect(() => {
    setIsMobileMenuOpen(false);
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
    { name: "Profil", path: "/profil" },
  ];

  const menuItems = isLoggedIn ? privateMenu : publicMenu;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    setIsMobileMenuOpen(false);
    window.location.replace("/beranda");
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white backdrop-blur-xl border-b border-gray-100 shadow-inner font-['Poppins']">
        <div className="w-full px-4 sm:px-8 md:px-12">
          <div className="flex justify-between h-20 items-center">
            
            {/* Brand Logo Group */}
            <Link to="/beranda" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <img
                src={logoBbwsms}
                alt="Logo BBWS"
                className="h-7 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="h-6 sm:h-7 w-[2px] bg-[#0D278D] self-center shrink-0" />
              <img
                src={logoRekrutmen}
                alt="Logo Rekrutmen"
                className="h-6 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.name}
                    to={item.path}
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

            {/* Right Action Buttons System (Desktop Only Layer) */}
            <div className="hidden md:flex items-center gap-2">
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

                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-gray-50/60 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0D278D] to-blue-700 text-white flex items-center justify-center text-sm font-bold shadow-sm tracking-wider overflow-hidden shrink-0 border border-blue-100">
                      {userData?.avatar_path && !imageError ? (
                        <img 
                          src={`${BACKEND_URL}/storage/${userData.avatar_path}`} 
                          alt="Profil" 
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        userData?.name?.charAt(0).toUpperCase() || <User size={16} />
                      )}
                    </div>

                    <Link
                      to="/profil"
                      onClick={() => console.log("Klik Profil")}
                      className="leading-tight pr-1 text-left cursor-pointer group block text-decoration-none select-none"
                    >
                      <h4 className="text-sm font-bold text-[#0D278D] max-w-[100px] truncate group-hover:text-blue-600 transition-colors duration-200">
                        {userData?.name || "Memuat..."}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 group-hover:text-gray-500 transition-colors duration-200">
                        {userData?.role || "Pelamar"}
                      </p>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Hamburger Trigger Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-[#0D278D] hover:bg-white transition-colors cursor-pointer relative w-10 h-10 flex items-center justify-center overflow-hidden"
                aria-label="Toggle Menu Navigasi"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 110, duration: 0.55 }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="px-6 pt-4 pb-6 flex flex-col space-y-3">
                {menuItems.map((item, idx) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.35 }}
                    >
                      <Link
                        to={item.path}
                        className={`block py-2 text-sm font-bold transition-all rounded-lg pl-2 ${
                          isActive ? "text-[#FEB700] bg-amber-50/50" : "text-[#0D278D] hover:text-[#FEB700]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="border-t border-gray-100 my-2 pt-4 flex flex-col gap-2">
                  {!isLoggedIn ? (
                    <>
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center gap-2 text-[#0D278D] border border-[#0D278D] py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                      >
                        <LogIn size={16} />
                        <span>Masuk</span>
                      </Link>
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center gap-2 bg-[#0d278d] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#FEB700] transition-all text-center"
                      >
                        <UserPlus size={16} />
                        <span>Daftar Akun</span>
                      </Link>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0D278D] to-blue-700 text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0 overflow-hidden border border-blue-100">
                          {userData?.avatar_path && !imageError ? (
                            <img 
                              src={`${BACKEND_URL}/storage/${userData.avatar_path}`} 
                              alt="Profil" 
                              className="w-full h-full object-cover"
                              onError={() => setImageError(true)}
                            />
                          ) : (
                            userData?.name?.charAt(0).toUpperCase() || <User size={16} />
                          )}
                        </div>
                        <div className="leading-tight truncate">
                          <h4 className="text-sm font-bold text-[#0D278D] truncate">
                            {userData?.name || "Memuat..."}
                          </h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {userData?.role || "Pelamar"}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setShowLogoutModal(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-transparent text-[#0D278D] border border-[#0D278D] py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer hover:bg-[#0d278d] hover:text-white"
                      >
                        <LogOut size={16} />
                        <span>Keluar Aplikasi</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

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

          <div 
            className="fixed inset-0 w-full h-full bg-black/30 backdrop-blur-[5px] transition-all duration-300"
            onClick={() => setShowLogoutModal(false)}
          />

          <div className="relative w-full max-w-sm p-[1.5px] rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-[0_25px_60px_-10px_rgba(8,24,90,0.5)] bg-gray-100 z-10">
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] bg-[conic-gradient(from_0deg,transparent_40%,#FEB700_48%,#FFFFFF_50%,#FEB700_52%,transparent_60%)] animate-modal-beam" />
            </div>

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