import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color: "blue" | "yellow" | "green" | "red";
}

const colorConfig = {
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-[#0D278D]",
    iconColor: "text-white",
    accent: "bg-[#0D278D]",
    valueColor: "text-[#0D278D]",
  },
  yellow: {
    bg: "bg-amber-50",
    iconBg: "bg-[#FEB700]",
    iconColor: "text-[#0D278D]",
    accent: "bg-[#FEB700]",
    valueColor: "text-[#FEB700]",
  },
  green: {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    accent: "bg-emerald-500",
    valueColor: "text-emerald-600",
  },
  red: {
    bg: "bg-rose-50",
    iconBg: "bg-rose-500",
    iconColor: "text-white",
    accent: "bg-rose-500",
    valueColor: "text-rose-600",
  },
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color,
}) => {
  const c = colorConfig[color];

  return (
    <div className="group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 overflow-hidden">
      {/* Background Accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 ${c.bg} rounded-bl-[80px] opacity-40 group-hover:opacity-60 transition-opacity`}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-3">{title}</p>
            <div
              className={`text-4xl font-extrabold ${c.valueColor} tracking-tight`}
            >
              {value}
            </div>
          </div>
          <div
            className={`${c.iconBg} ${c.iconColor} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
          >
            {icon}
          </div>
        </div>

        {trend && (
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center gap-0.5 text-xs font-bold ${
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {trend.value}%
            </div>
            <span className="text-xs text-gray-400">vs bulan lalu</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
