import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, ChevronDown, SlidersHorizontal, MoreVertical, BookOpen } from "lucide-react";
import { useEduStock } from "../context/EduStockContext";

const STATUS_STYLES = {
  Available: "bg-[#E9F9EF] text-[#16A34A]",
  "Low Stock": "bg-[#FEF3E2] text-[#F59E0B]",
  "Out of Stock": "bg-[#FDEAEA] text-[#EF4444]",
};

function BookInventory() {
  const [query, setQuery] = useState("");
  const { classBooks, getInventory } = useEduStock();

  const filtered = classBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.subject.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E7EDF5] shadow-[0_1px_3px_rgba(16,42,67,0.05)] p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] flex items-center justify-center shrink-0">
            <BookOpen size={18} className="text-[#1479F2]" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-[#102A43]">Book Inventory</h3>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              View and manage all books in your school inventory.
            </p>
          </div>
        </div>
        <Link to="/class-books" className="inline-flex items-center gap-1.5 bg-[#1479F2] hover:bg-[#0f66d1] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0">
          <Plus size={16} />
          Add Book
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search book title or subject..."
            aria-label="Search book title or subject"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F4F8FD] text-sm text-[#102A43] placeholder:text-[#94A3B8] border border-transparent focus:border-[#1479F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1479F2]/15 transition-all"
          />
        </div>
        <button className="inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] text-sm text-[#102A43] hover:bg-[#EAF3FF] transition-colors">
          All Classes <ChevronDown size={15} className="text-[#94A3B8]" />
        </button>
        <button className="inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] text-sm text-[#102A43] hover:bg-[#EAF3FF] transition-colors">
          All Subjects <ChevronDown size={15} className="text-[#94A3B8]" />
        </button>
        <button className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#102A43] hover:bg-[#F4F8FD] transition-colors">
          <SlidersHorizontal size={15} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-5 -mx-1">
        <table className="w-full min-w-[610] text-left border-collapse">
          <thead>
            <tr className="text-[12px] uppercase tracking-wide text-[#94A3B8] border-b border-[#E7EDF5]">
              <th className="py-2.5 px-3 font-semibold">Book Title</th>
              <th className="py-2.5 px-3 font-semibold">Subject</th>
              <th className="py-2.5 px-3 font-semibold">Class</th>
              <th className="py-2.5 px-3 font-semibold">Total Stock</th>
              <th className="py-2.5 px-3 font-semibold">Available</th>
              <th className="py-2.5 px-3 font-semibold">Status</th>
              <th className="py-2.5 px-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((book) => {
              const stock = getInventory(book.id);
              const status = stock.available <= 0 ? "Out of Stock" : stock.available <= 15 ? "Low Stock" : "Available";
              return (
              <tr
                key={book.id}
                className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F9FBFE] transition-colors"
              >
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-10 rounded-md shrink-0"
                      style={{ backgroundColor: book.coverColor }}
                      aria-hidden="true"
                    />
                    <span className="text-[13.5px] font-medium text-[#102A43]">{book.title}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-[13.5px] text-[#64748B]">{book.subject}</td>
                <td className="py-3 px-3 text-[13.5px] text-[#64748B]">{book.className}</td>
                <td className="py-3 px-3 text-[13.5px] text-[#64748B]">{stock.total}</td>
                <td className="py-3 px-3 text-[13.5px] text-[#64748B]">{stock.available}</td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block text-[12px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}
                  >
                    {status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]"
                    aria-label={`Actions for ${book.title}`}
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookInventory;
