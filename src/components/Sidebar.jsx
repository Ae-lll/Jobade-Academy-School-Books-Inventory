import { NavLink } from "react-router-dom";
import { BookOpen, Boxes, BarChart3, LayoutDashboard, Settings, Users, ArrowLeftRight, X } from "lucide-react";
import { navItems } from "../data/dashboardData";
import logo from "../assets/jobade-logo.png";

const iconMap = {
  LayoutDashboard,
  BookOpen,
  Boxes,
  Users,
  ArrowLeftRight,
  BarChart3,
  Settings,
};

function Sidebar({ isOpen, onClose }) {
  const menuItems = navItems.map((item) => {
    const Icon = iconMap[item.icon] || LayoutDashboard;

    return {
      ...item,
      Icon,
    };
  });

  return (
    <>
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-72 bg-[#0B1F33] text-slate-100 shadow-2xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:self-start lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1 shadow-lg shadow-black/20">
               <img src={logo} alt="Jobade Academy logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide">Jobade Academy</p>
                <p className="text-[11px] text-slate-300">School Book Inventory</p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-auto px-3 py-4">
            {menuItems.map(({ id, label, path, Icon }) => (
              <NavLink
                key={id}
                to={path}
                end={path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#1479F2] text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-white/10 px-4 py-4">
            <div className="rounded-xl bg-white/5 p-3 text-sm text-slate-300">
              <p className="font-medium text-white">Inventory Health</p>
              <p className="mt-1 text-xs text-slate-400">94% stocked this session</p>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && <div className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={onClose} />} 
    </>
  );
}

export default Sidebar;
