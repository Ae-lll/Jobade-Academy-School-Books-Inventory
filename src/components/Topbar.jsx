import { Search, Bell, LogOut, Menu } from "lucide-react";

function Topbar({ onMenuClick, profile, email, onSignOut }) {
  const displayName = profile?.full_name || email || "Staff";

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden shrink-0 p-2 rounded-lg text-[#102A43] hover:bg-[#F4F8FD] transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            type="text"
            placeholder="Search books, students, classes..."
            aria-label="Search books, students, classes"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F8FD] text-sm text-[#102A43] placeholder:text-[#94A3B8]
            border border-transparent focus:border-[#1479F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1479F2]/15 transition-all"
          />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            className="relative p-2.5 rounded-xl hover:bg-[#F4F8FD] transition-colors"
            aria-label="Notifications, 3 unread"
          >
            <Bell size={20} className="text-[#64748B]" />
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-semibold">
              3
            </span>
          </button>

          <div className="hidden sm:block w-px h-8 bg-[#E2E8F0]" />

          <div className="flex items-center gap-2.5 pl-1 pr-1.5 sm:pr-2 py-1">
            <div className="w-9 h-9 rounded-full bg-[#EAF3FF] flex items-center justify-center text-[#1479F2] font-semibold text-sm shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-[13px] font-semibold text-[#102A43]">{displayName}</p>
              <p className="text-[11px] text-[#64748B]">{profile?.role || "Staff"}</p>
            </div>
            <button onClick={onSignOut} className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F4F8FD]" aria-label="Sign out">
              <LogOut size={16} />
              <span className="hidden md:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
