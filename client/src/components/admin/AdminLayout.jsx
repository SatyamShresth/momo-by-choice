import { Link, NavLink, Outlet } from "react-router-dom";
import { ExternalLink, LogOut, MessageSquare, QrCode, Settings, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const tabs = [
  { to: "/admin", label: "Menu", icon: UtensilsCrossed, end: true },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/qr", label: "QR Code", icon: QrCode },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-cream-dark print:bg-white">
      <header className="border-b-2 border-cocoa-900 bg-cream print:hidden">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <h1 className="text-xl sm:text-2xl">Admin Panel</h1>
            <p className="text-xs text-ink/60">{user?.name} · {user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/menu" target="_blank" className="inline-flex items-center gap-1 text-sm font-bold text-chili hover:underline">
              Public site <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button type="button" onClick={logout} className="inline-flex items-center gap-1 rounded-full border-2 border-cocoa-900 px-3 py-1.5 text-sm font-bold hover:bg-spice">
              <LogOut className="h-4 w-4" aria-hidden="true" /> Logout
            </button>
          </div>
        </div>

        <nav className="container-page flex gap-2 overflow-x-auto pb-3" aria-label="Admin sections">
          {tabs.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-cocoa-900 px-4 py-1.5 text-sm font-bold transition-colors ${
                  isActive ? "bg-cocoa-900 text-cream" : "bg-white hover:bg-spice/40"
                }`
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" /> {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="container-page py-6 print:max-w-none print:p-0">
        <Outlet />
      </main>
    </div>
  );
}