import React, { useState, useEffect } from "react";
import { Menu, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<Props> = ({ onMenuClick }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <Link
            to="/admin/profil"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-[#0D278D] hover:bg-[#0D278D] hover:text-white transition-all font-bold text-xs shadow-sm border border-gray-100"
          >
            <User size={14} />
            <span>Profil Saya</span>
          </Link>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0D278D] text-white">
            <Clock size={14} className="text-[#FEB700]" />
            <span className="text-xs font-bold tabular-nums">
              {time.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
