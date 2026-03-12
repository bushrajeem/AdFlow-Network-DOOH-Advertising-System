/**
 * AdminTopBar.jsx — Admin panel header.
 * Shows logo + sidebar toggle on the left, user profile on the right.
 * BACKEND: Replace hardcoded name and avatar with auth context user data.
 */

import { Menu } from "lucide-react";

function AdminTopBar({ onToggleSidebar }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-10 py-10">
      {/* ── Left: Logo + Sidebar Toggle ───*/}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle button */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-blue-400 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <div className="leading-tight">
          <img className="w-30 h-20" src="./logo.png" alt="Logo" />
        </div>
      </div>

      {/* ── Right: User Profile ─────────────────────────────────── */}
      {/* BACKEND: Replace avatar src and "Jeem" with auth context user */}
      <div className="flex items-center gap-2 bg-blue-600 text-white pl-1 pr-4 py-1 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/32"
          alt="User avatar"
          className="w-8 h-8 rounded-md object-cover"
        />

        {/* Name */}
        <span className="text-sm font-medium">Jeem</span>
      </div>
    </header>
  );
}

export default AdminTopBar;
