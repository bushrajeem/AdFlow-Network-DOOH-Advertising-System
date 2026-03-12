/**
 * AdminSidebar.jsx — Admin panel sidebar navigation.
 * Background: #002B6B | Inactive items: #8AB9FF | Active item: #FFA7A7
 * Controlled by toggleSidebar in AdminTopBar via AdminLayout.
 *
 * To add a new page:
 *   1. Add an entry to NAV_ITEMS
 *   2. Add the route in App.jsx
 */

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Monitor,
  Megaphone,
  ListVideo,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview",  path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Location",  path: "/admin/location",  icon: <MapPin size={18} /> },
  { label: "Screen",    path: "/admin/screen",    icon: <Monitor size={18} /> },
  { label: "Ads",       path: "/admin/ads",       icon: <Megaphone size={18} /> },
  { label: "Playlists", path: "/admin/playlists", icon: <ListVideo size={18} /> },
  { label: "Users",     path: "/admin/users",     icon: <Users size={18} /> },
];

function AdminSidebar({ isOpen }) {
  return (
    <aside
      style={{ backgroundColor: "#002B6B", width: isOpen ? "208px" : "0px" }}
      className="h-full flex flex-col transition-all duration-300 overflow-hidden shrink-0"
    >
      {/* min-w keeps content from wrapping during animation */}
      <nav className="pt-20 px-3 space-y-1" style={{ minWidth: "208px" }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? "text-[#FFA7A7]"
                : "text-[#8AB9FF] hover:text-white hover:bg-white/10"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;