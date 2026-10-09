import { BookOpen, Users, Package, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";

const ICONS = { BookOpen, Users, Package, AlertTriangle };

const ACCENTS = {
  blue: { bg: "bg-[#EAF3FF]", icon: "text-[#1479F2]" },
  green: { bg: "bg-[#E9F9EF]", icon: "text-[#16A34A]" },
  purple: { bg: "bg-[#F1ECFE]", icon: "text-[#7C3AED]" },
  red: { bg: "bg-[#FDEAEA]", icon: "text-[#EF4444]" },
};

function StatCard({ icon, title, value, change, trend, note, accent }) {
  const Icon = ICONS[icon];
  const colors = ACCENTS[accent] || ACCENTS.blue;
  const isUp = trend === "up";

  return (
    <div className="bg-white rounded-2xl border border-[#E7EDF5] shadow-[0_1px_3px_rgba(16,42,67,0.05)] p-5 hover:shadow-[0_4px_16px_rgba(16,42,67,0.08)] transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-full ${colors.bg} flex items-center justify-center`}>
          <Icon size={20} className={colors.icon} />
        </div>
      </div>
      <p className="text-[13px] text-[#64748B] font-medium">{title}</p>
      <p className="text-[26px] font-bold text-[#102A43] mt-1">{value}</p>
      {change && <div className="flex items-center gap-1 mt-2">
        <span
          className={`inline-flex items-center gap-0.5 text-[12px] font-semibold ${
            isUp ? "text-[#16A34A]" : "text-[#EF4444]"
          }`}
        >
          {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {change}
        </span>
        <span className="text-[12px] text-[#94A3B8]">{note}</span>
      </div>}
    </div>
  );
}

export default StatCard;
