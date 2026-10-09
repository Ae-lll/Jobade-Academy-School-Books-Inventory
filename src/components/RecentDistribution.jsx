import { ArrowLeftRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEduStock } from "../context/EduStockContext";

function RecentDistribution() {
  const { distributions, students, classBooks } = useEduStock();
  const recentDistribution = [...distributions].reverse().slice(0, 5).map((transaction) => {
    const student = students.find((item) => String(item.id) === String(transaction.studentId));
    const book = classBooks.find((item) => String(item.id) === String(transaction.bookId));
    return { ...transaction, student, book };
  }).filter((transaction) => transaction.student && transaction.book);

  return (
    <div className="bg-white rounded-2xl border border-[#E7EDF5] shadow-[0_1px_3px_rgba(16,42,67,0.05)] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <ArrowLeftRight size={17} className="text-[#1479F2]" />
          <h3 className="text-[15px] font-semibold text-[#102A43]">Recent Distribution</h3>
        </div>
        <Link to="/distribution" className="text-[12.5px] font-medium text-[#1479F2] hover:underline">View All</Link>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-120 text-left border-collapse">
          <thead>
            <tr className="text-[11.5px] uppercase tracking-wide text-[#94A3B8] border-b border-[#E7EDF5]">
              <th className="py-2.5 px-3 font-semibold">Student Name</th>
              <th className="py-2.5 px-3 font-semibold">Class</th>
              <th className="py-2.5 px-3 font-semibold">Book</th>
              <th className="py-2.5 px-3 font-semibold">Date</th>
              <th className="py-2.5 px-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentDistribution.map((row) => (
              <tr key={row.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F9FBFE] transition-colors">
                <td className="py-3 px-3 text-[13.5px] font-medium text-[#102A43]">{row.student.name}</td>
                <td className="py-3 px-3 text-[13.5px] text-[#64748B]">{row.student.className}</td>
                <td className="py-3 px-3 text-[13.5px] text-[#64748B]">{row.book.title}</td>
                <td className="py-3 px-3 text-[13.5px] text-[#64748B]">{new Date(row.date).toLocaleDateString()}</td>
                <td className="py-3 px-3">
                  <span className={`inline-block text-[12px] font-semibold px-2.5 py-1 rounded-full ${row.action === "issued" ? "bg-[#E9F9EF] text-[#16A34A]" : "bg-[#EAF3FF] text-[#1479F2]"}`}>
                    {row.action === "issued" ? "Issued" : "Returned"}
                  </span>
                </td>
              </tr>
            ))}
            {recentDistribution.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-sm text-[#94A3B8]">No distributions recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentDistribution;
