import { XCircle, AlertTriangle, ChevronRight, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useEduStock } from "../context/EduStockContext";

const ICONS = { XCircle, AlertTriangle };

const ACCENTS = {
  red: "bg-[#FDEAEA] text-[#EF4444]",
  orange: "bg-[#FEF3E2] text-[#F59E0B]",
  blue: "bg-[#EAF3FF] text-[#1479F2]",
};

function StockAlerts() {
  const { classBooks, getInventory } = useEduStock();
  const outOfStock = classBooks.filter((book) => getInventory(book.id).available <= 0).length;
  const lowStock = classBooks.filter((book) => {
    const available = getInventory(book.id).available;
    return available > 0 && available <= 15;
  }).length;
  const stockAlerts = [
    { id: "out-of-stock", icon: "XCircle", label: "Out of Stock", count: `${outOfStock} books`, accent: "red" },
    { id: "low-stock", icon: "AlertTriangle", label: "Low Stock", count: `${lowStock} books`, accent: "orange" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E7EDF5] shadow-[0_1px_3px_rgba(16,42,67,0.05)] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Bell size={17} className="text-[#1479F2]" />
          <h3 className="text-[15px] font-semibold text-[#102A43]">Stock Alerts</h3>
        </div>
        <button className="text-[12.5px] font-medium text-[#1479F2] hover:underline">View All</button>
      </div>

      <div className="space-y-1.5">
        {stockAlerts.map((alert) => {
          const Icon = ICONS[alert.icon];
          return (
            <Link
              to="/inventory"
              key={alert.id}
              className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-[#F9FBFE] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${ACCENTS[alert.accent]}`}>
                  <Icon size={16} />
                </div>
                <div className="text-left">
                  <p className="text-[13.5px] font-medium text-[#102A43]">{alert.label}</p>
                  <p className="text-[12px] text-[#64748B]">{alert.count}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#94A3B8] shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default StockAlerts;
