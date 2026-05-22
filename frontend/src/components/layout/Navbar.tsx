import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, AlertTriangle, LogIn, UserPlus } from "lucide-react";
import logoBbwsms from "../../assets/img/logobbwsms.png";
import logoRekrutmen from "../../assets/img/rekrutmenbaru.png";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState<any>(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;  
  });
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token && token !== "undefined" && token !== "null";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        setUserData(data);
        localStorage.setItem("user", JSON.stringify(data)); // keep in sync
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUserData(null);
      });
  }, []);

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
    setShowLogoutModal(false);
    navigate("/beranda");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm font-['Poppins']">
      <div className="w-full px-8 md:px-12">
        <div className="flex justify-between h-20 items-center">
          
          <Link to="/beranda" className="flex items-center gap-3 group">
            <img
              src={logoBbwsms}
              alt="Logo BBWS"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-[#0D278D] text-lg">
                Rekrutmen KITP
              </span>
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

          <div className="flex items-center gap-4">
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
                  onClick={() => setShowLogoutModal(true)}
                  className="group flex items-center gap-2 bg-transparent text-[#0D278D] border border-[#0D278D] px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer hover:text-white hover:bg-[#0d278d] "
                >
                  <LogOut size={16} className="text-[#0D278D] group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-300" />
                  <span>Keluar</span>
                </button>

                <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-gray-50/60  transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0D278D] to-blue-700 text-white flex items-center justify-center text-sm font-bold shadow-sm tracking-wider">
                    {userData?.name?.charAt(0) || <User size={16} />}
                  </div>
                  <div className="leading-tight pr-1 text-left">
                    <h4 className="text-sm font-bold text-[#0D278D] max-w-[100px] truncate">
                      {userData?.name || "Memuat..."}
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                      {userData?.role || "User"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">
              Keluar dari Akun?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Anda akan keluar dari sesi ini. Pastikan semua pekerjaan sudah tersimpan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 