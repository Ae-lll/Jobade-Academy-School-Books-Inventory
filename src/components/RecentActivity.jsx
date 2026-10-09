import { BookPlus, UserPlus, ArrowLeftRight, RefreshCcw, History } from "lucide-react";
import { Link } from "react-router-dom";
import { useEduStock } from "../context/EduStockContext";

const ICONS = { BookPlus, UserPlus, ArrowLeftRight, RefreshCcw };

const ACCENTS = {
  blue: "bg-[#EAF3FF] text-[#1479F2]",
  green: "bg-[#E9F9EF] text-[#16A34A]",
  purple: "bg-[#F1ECFE] text-[#7C3AED]",
  navy: "bg-[#EAF0F8] text-[#0B2D5C]",
};

function RecentActivity() {
  const { distributions, students, classBooks } = useEduStock();
  const recentActivity = [...distributions].reverse().slice(0, 4).map((transaction) => {
    const student = students.find((item) => String(item.id) === String(transaction.studentId));
    const book = classBooks.find((item) => String(item.id) === String(transaction.bookId));
    return {
      id: transaction.id,
      icon: "ArrowLeftRight",
      title: transaction.action === "issued" ? "Book issued" : "Book returned",
      detail: student && book ? `${book.title} (${student.className}) → ${student.name}` : "Distribution record",
      time: new Date(transaction.date).toLocaleString(),
      accent: transaction.action === "issued" ? "purple" : "green",
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E7EDF5] shadow-[0_1px_3px_rgba(16,42,67,0.05)] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <History size={17} className="text-[#1479F2]" />
          <h3 className="text-[15px] font-semibold text-[#102A43]">Recent Activity</h3>
        </div>
        <Link to="/distribution" className="text-[12.5px] font-medium text-[#1479F2] hover:underline">View All</Link>
      </div>

      <ul className="space-y-4">
        {recentActivity.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${ACCENTS[item.accent]}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium text-[#102A43]">{item.title}</p>
                <p className="text-[12.5px] text-[#64748B] truncate">{item.detail}</p>
              </div>
              <span className="text-[11.5px] text-[#94A3B8] shrink-0 whitespace-nowrap">{item.time}</span>
            </li>
          );
        })}
        {recentActivity.length === 0 && <li className="text-sm text-[#94A3B8]">No recent activity.</li>}
      </ul>
    </div>
  );
}

export default RecentActivity;
