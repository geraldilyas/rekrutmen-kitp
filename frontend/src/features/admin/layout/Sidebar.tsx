import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";
import logoBbwsms from "../../../assets/img/logobbwsms.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    description: "Ringkasan data",
  },
  {
    name: "Admin",
    path: "/admin/users",
    icon: Users,
    description: "Manajemen admin",
  },
  {
    name: "Lowongan",
    path: "/admin/lowongan",
    icon: Briefcase,
    description: "Kelola lowongan",
  },
  {
    name: "Pendaftar",
    path: "/admin/applications",
    icon: FileText,
    description: "Data pelamar",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-all duration-300 ease-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-[72px] px-5 border-b border-gray-50">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 p-1 rounded-xl flex items-center justify-center shadow-sm">
                <img
                  src={logoBbwsms}
                  alt="Logo BBWS"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">KITP Admin</h1>
                <p className="text-gray-400 text-[11px] font-medium">
                  Rekrutmen
                </p>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            <p className="px-3 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Menu Utama
            </p>
            {menuItems.map((item) => {
              const isActive =
                item.path === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#0D278D] text-white shadow-lg shadow-blue-900/20"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-white/20"
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{item.name}</p>
                    {isActive && (
                      <p className="text-[11px] text-white/60 mt-0.5 font-medium">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <ChevronRight size={16} className="text-white/60" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-gray-50">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
              <div className="w-8 h-8 rounded-lg bg-[#0D278D] flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900">
                  Admin KITP
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  admin@kitp.go.id
                </p>
              </div>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
