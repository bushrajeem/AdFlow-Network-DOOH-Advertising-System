/**
 * components/admin/AdminSidebar.jsx — Admin Panel Sidebar Navigation
 *
 * PURPOSE:
 *   Renders the left-side navigation panel for the admin dashboard.
 *   Highlights the currently active route.
 *   Collapses off-screen on mobile; always visible on desktop (lg+).
 *
 * PROPS:
 *   isOpen  {boolean} — controls mobile visibility
 *   onClose {fn}      — called when close button is clicked (mobile)
 *
 * HOW TO USE:
 *   <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
 *
 * HOW TO ADD A NEW NAV ITEM:
 *   Add an object to the NAV_ITEMS array:
 *   { label: "Reports", path: "/admin/reports", icon: <ChartBarIcon /> }
 *
 * BACKEND CONNECTION:
 *   - Later, some nav items may show badge counts (e.g., pending ads)
 *   - Those counts will come from an API call in the parent or via context
 *
 * DESIGN REFERENCE: Figma — Admin sidebar, dark navy theme
 */
 
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Monitor,
  Megaphone,
  ListVideo,
  Users,
  X,
} from "lucide-react";
 
// ─── Navigation item definitions ─────────────────────────────────────────────
// To add a new page, add an entry here AND add the route in AdminRoutes.jsx
const NAV_ITEMS = [
  { label: "Overview",   path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Location",   path: "/admin/location",  icon: <MapPin size={18} /> },
  { label: "Screen",     path: "/admin/screen",    icon: <Monitor size={18} /> },
  { label: "Ads",        path: "/admin/ads",        icon: <Megaphone size={18} /> },
  { label: "Playlists",  path: "/admin/playlists",  icon: <ListVideo size={18} /> },
  { label: "Users",      path: "/admin/users",      icon: <Users size={18} /> },
];
 
function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {/*
        Sidebar panel
        - On mobile: fixed overlay, slides in/out based on `isOpen`
        - On desktop (lg+): always visible as a static column
      */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-56 flex flex-col
          bg-[#1a2340] text-white shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:flex lg:z-auto
        `}
      >
        {/* ── Brand Logo ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="./logo.png" alt="AdFlow Logo" />
          </div>
 
          {/* Close button — only shown on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>
 
        {/* ── Navigation Links ──────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose} // auto-close on mobile after navigation
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                 transition-all duration-150
                 ${
                   isActive
                     ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                     : "text-white/65 hover:bg-white/10 hover:text-white"
                 }`
              }
            >
              {/* Icon */}
              <span className="shrink-0">{item.icon}</span>
              {/* Label */}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
 
        {/* ── Sidebar Footer ────────────────────────────────────────────── */}
        <div className="px-5 py-4 border-t border-white/10 text-xs text-white/30 text-center">
          AdFlow Network © 2025
        </div>
      </aside>
    </>
  );
}
 
export default AdminSidebar;
 