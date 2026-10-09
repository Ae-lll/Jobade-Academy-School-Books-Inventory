import { useEffect, useState } from "react";
import { Building2, CalendarDays, BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function getGreeting(date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Hello";
}

function WelcomeBanner() {
  const { profile } = useAuth();
  const [now, setNow] = useState(() => new Date());

  // Check the time again every minute so the greeting updates by itself
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const firstName = profile?.full_name?.trim().split(" ")[0];
  const name = firstName || (profile?.role === "admin" ? "Admin" : "there");

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAF3FF] via-[#EAF3FF] to-[#DCEBFF] px-6 sm:px-8 py-7 sm:py-8">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-[28px] font-bold text-[#0B2D5C]">
            {getGreeting(now)}, {name} 👋
          </h2>
          <p className="text-[#3D5A80] text-sm sm:text-[15px] mt-2 max-w-md">
            Here's an overview of your school book inventory and distribution.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-5">
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm text-[#0B2D5C] text-[13px] font-medium px-3.5 py-1.5 rounded-full">
              <Building2 size={14} />
              Jobade Academy
            </span>
            <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm text-[#0B2D5C] text-[13px] font-medium px-3.5 py-1.5 rounded-full">
              <CalendarDays size={14} />
              Academic Session: 2026 / 2027
            </span>
          </div>
        </div>

        {/* Illustration: stacked books, CSS/SVG only */}
        <div className="hidden md:flex items-end gap-1.5 shrink-0 self-end pr-2" aria-hidden="true">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-14 h-3 rounded-sm bg-[#1479F2] shadow-sm" />
            <div className="w-16 h-3 rounded-sm bg-[#0B2D5C] shadow-sm" />
            <div className="w-[70px] h-3.5 rounded-sm bg-[#2588F5] shadow-sm" />
          </div>
          <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center -translate-y-1">
            <BookOpen size={22} className="text-[#1479F2]" />
          </div>
        </div>
      </div>

      {/* subtle decorative circles */}
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/30 blur-2xl" aria-hidden="true" />
      <div className="absolute right-24 bottom-0 w-24 h-24 rounded-full bg-white/20 blur-xl" aria-hidden="true" />
    </div>
  );
}

export default WelcomeBanner;