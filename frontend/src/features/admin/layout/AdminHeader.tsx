import React, { useState, useEffect } from "react";
import { Menu, Calendar, Clock } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-gray-100">
      <div className="flex items-center justify-between h-[72px] px-6 lg:px-10">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-gray-400">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Cari data..."
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none w-48"
            />
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-bold text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: Tanggal & Waktu Real-time */}
        <div className="flex items-center gap-3">
          {/* Tanggal */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-600">
              {formatDate(currentDateTime)}
            </span>
          </div>

          {/* Jam */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0D278D] text-white">
            <Clock size={14} className="text-[#FEB700]" />
            <span className="text-xs font-bold tracking-wider tabular-nums">
              {formatTime(currentDateTime)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
