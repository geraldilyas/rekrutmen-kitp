import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, User, X, LogOut, AlertTriangle } from "lucide-react";
import { api } from "../../services/api";
import logoBbwsms from "../../assets/img/logobbwsms.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const menu = [
  { name: "Dashboard", path: "/penyeleksi", icon: LayoutDashboard },
  { name: "Lowongan Saya", path: "/penyeleksi/jobs", icon: Briefcase },
  { name: "Profil Saya", path: "/penyeleksi/profil", icon: User },
];

const PenyeleksiSidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const authUser = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = authUser.name
    ? authUser.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "P";

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // proceed even if the API call fails
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setShowLogoutModal(false);
      navigate("/beranda");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-5 border-b border-gray-50">
            <Link to="/penyeleksi" className="flex items-center gap-3">
              <div className="w-10 h-10 p-1 rounded-xl border border-[#b8b8b8]/30 shadow-sm">
                <img
                  src={logoBbwsms}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">Penyeleksi</h1>
                <p className="text-gray-400 text-[11px]">Panel Penilaian</p>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1">
            <p className="px-3 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Menu
            </p>
            {menu.map((item) => {
              const isActive =
                item.path === "/penyeleksi"
                  ? location.pathname === "/penyeleksi"
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive ? "bg-[#0D278D] text-white shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? "bg-white/20" : "bg-gray-100"}`}
                  >
                    <Icon size={18} />
                  </div>
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-gray-50">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
              <Link 
                to="/penyeleksi/profil"
                onClick={onClose}
                className="flex items-center gap-3 flex-1 min-w-0 group/info"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0D278D] flex items-center justify-center shrink-0 group-hover/info:scale-105 transition-transform">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate group-hover/info:text-[#0D278D] transition-colors">
                    {authUser.name || "Penyeleksi"}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {authUser.email || ""}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                title="Logout"
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
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
    </>
  );
};

export default PenyeleksiSidebar;
