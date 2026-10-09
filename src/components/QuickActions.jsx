import { BookPlus, UserPlus, ArrowLeftRight, BarChart3, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { quickActions } from "../data/dashboardData";

const ICONS = { BookPlus, UserPlus, ArrowLeftRight, BarChart3 };

const ACCENTS = {
  blue: "bg-[#EAF3FF] text-[#1479F2] hover:bg-[#DCEBFF]",
  green: "bg-[#E9F9EF] text-[#16A34A] hover:bg-[#D8F3E2]",
  purple: "bg-[#F1ECFE] text-[#7C3AED] hover:bg-[#E6DCFC]",
  navy: "bg-[#EAF0F8] text-[#0B2D5C] hover:bg-[#DEE8F5]",
};

function QuickActions() {
  return (
    <div className="bg-white rounded-2xl border border-[#E7EDF5] shadow-[0_1px_3px_rgba(16,42,67,0.05)] p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <LayoutGrid size={17} className="text-[#1479F2]" />
        <h3 className="text-[15px] font-semibold text-[#102A43]">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = ICONS[action.icon];
          return (
            <Link
              key={action.id}
              to={action.path}
              className={`text-left rounded-xl p-3.5 transition-colors duration-200 ${ACCENTS[action.accent]}`}
            >
              <Icon size={19} className="mb-2" />
              <p className="text-[13px] font-semibold leading-tight">{action.title}</p>
              <p className="text-[11px] opacity-75 mt-1 leading-snug">{action.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
