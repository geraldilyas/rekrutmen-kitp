import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatusChartProps {
  data: { month: string; applicants: number; accepted: number }[];
}

// Hapus import Tremor, ganti Recharts untuk kontrol penuh styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-4 backdrop-blur-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}:</span>
            <span className="text-sm font-bold text-gray-900">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Tren Pendaftaran</h3>
          <p className="text-sm text-gray-500 mt-1">
            Pelamar vs yang diterima per bulan
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#0D278D]" />
            <span className="text-xs font-medium text-gray-500">Pelamar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FEB700]" />
            <span className="text-xs font-medium text-gray-500">Diterima</span>
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D278D" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#0D278D" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FEB700" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#FEB700" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="applicants"
              name="Pelamar"
              stroke="#0D278D"
              strokeWidth={2}
              fill="url(#colorApplicants)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#0D278D",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
            <Area
              type="monotone"
              dataKey="accepted"
              name="Diterima"
              stroke="#FEB700"
              strokeWidth={2}
              fill="url(#colorAccepted)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#FEB700",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusChart;
