/**
   components/admin/AdminTopBar.jsx — Admin Panel Top Navigation Bar

PURPOSE:
  The horizontal bar at the top of the admin panel.
  Contains the hamburger menu toggle (for mobile), page title area,
  and user avatar/profile section.

PROPS:
  onToggleSidebar {fn} — called when hamburger button is clicked

HOW TO USE:
   <AdminTopBar onToggleSidebar={toggleSidebar} />

BACKEND CONNECTION:
   - Replace the hardcoded "Admin User" with the actual logged-in user's name
   - The avatar image src should come from the user's profile data (auth context)
   - Add a logout button here that clears the JWT token and redirects to /login

DESIGN REFERENCE: Figma — Top navigation with profile avatar
 */
 
import { Menu, Bell } from "lucide-react";
 
function AdminTopBar({ onToggleSidebar }) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm">
 
      {/* ── Left: Hamburger (mobile only) + Brand ─────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Hamburger button — only visible on small screens */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
 
        {/* Page context label — can be made dynamic later */}
        <span className="text-sm text-gray-400 hidden sm:inline">
          Admin Panel
        </span>
      </div>
 
      {/* ── Right: Notifications + User Profile ───────────────────────── */}
      <div className="flex items-center gap-3">
 
        {/* Notification bell */}
        {/* BACKEND: Connect to a notifications API to show unread count badge */}
        <button className="relative p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
          {/* Notification dot — show conditionally when there are unread alerts */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
 
        {/* User profile section */}
        {/* BACKEND: Replace "Admin User" with auth context user.name */}
        <div className="flex items-center gap-2 cursor-pointer group">
          {/* Avatar circle — replace bg color + initials with real avatar image */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-blue-200">
            A
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-xs font-semibold text-gray-700">Admin User</span>
            <span className="text-[10px] text-gray-400">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
 
export default AdminTopBar;