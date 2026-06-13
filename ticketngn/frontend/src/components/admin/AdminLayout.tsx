import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarDays, QrCode, LogOut, Ticket } from "lucide-react";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Events", icon: CalendarDays, end: false },
  { to: "/admin/scan", label: "Scan QR", icon: QrCode, end: false },
];

export function AdminLayout() {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login", { replace: true });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-100 bg-white flex flex-col shadow-sm">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-gray-100">
          <div className="h-7 w-7 rounded-lg btn-gradient flex items-center justify-center">
            <Ticket size={13} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">
            Ticket<span className="gradient-text">NGN</span>
          </span>
          <span className="ml-1 text-xs text-gray-400 font-medium">Admin</span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => { logout(); navigate("/admin/login"); }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors font-medium"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
