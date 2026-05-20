import React, { useState, useEffect } from "react";
import { Menu, Clock } from "lucide-react";

interface Props {
  onMenuClick: () => void;
}

const PenyeleksiHeader: React.FC<Props> = ({ onMenuClick }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
          >
            <Menu size={20} />
          </button>
        </div>
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
    </header>
  );
};

export default PenyeleksiHeader;
