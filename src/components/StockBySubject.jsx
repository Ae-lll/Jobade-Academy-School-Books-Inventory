import { PieChart } from "lucide-react";
import { useEduStock } from "../context/EduStockContext";

const SIZE = 180;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function StockBySubject() {
  const { classBooks, getInventory } = useEduStock();
  const palette = ["#1479F2", "#0B2D5C", "#16A34A", "#F59E0B", "#7C3AED", "#94A3B8"];
  const bySubject = new Map();
  classBooks.forEach((book) => {
    bySubject.set(book.subject, (bySubject.get(book.subject) || 0) + getInventory(book.id).total);
  });
  const stockBySubject = [...bySubject].map(([label, value], index) => ({
    id: label,
    label,
    value,
    color: palette[index % palette.length],
  }));
  const totalBooksInSubjectChart = stockBySubject.reduce((sum, item) => sum + item.value, 0);

  const chartSlices = stockBySubject.reduce((slices, slice) => {
    const dash = (slice.value / totalBooksInSubjectChart) * CIRCUMFERENCE;
    const previous = slices[slices.length - 1];
    const offset = previous ? previous.offset + previous.dash : 0;

    return [...slices, { slice, dash, offset }];
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#E7EDF5] shadow-[0_1px_3px_rgba(16,42,67,0.05)] p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <PieChart size={17} className="text-[#1479F2]" />
          <h3 className="text-[15px] font-semibold text-[#102A43]">Stock by Subject</h3>
        </div>
        <span className="text-[12.5px] font-medium text-[#64748B]">Current stock</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
            <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#F1F5F9" strokeWidth={STROKE} />
            {chartSlices.map(({ slice, dash, offset }) => (
                <circle
                  key={slice.id}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-bold text-[#102A43]">{totalBooksInSubjectChart.toLocaleString()}</p>
            <p className="text-[11px] text-[#64748B]">Total Books</p>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2.5">
          {stockBySubject.map((slice) => (
            <div key={slice.id} className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="text-[#102A43] font-medium">{slice.label}</span>
              </div>
              <span className="text-[#64748B]">
                {slice.value} ({totalBooksInSubjectChart ? Math.round((slice.value / totalBooksInSubjectChart) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StockBySubject;
