/**
 * AdminLayout.jsx — Shell wrapper for all admin pages.
 * Renders sidebar + topbar. Active page loads inside <Outlet />.
 */

import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import useSidebarToggle from "../../../hooks/useSidebarToggle";
import AdminTopBar from "./AdminTopBar";

function AdminLayout() {
  const { isSidebarOpen, toggleSidebar } = useSidebarToggle();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* Sidebar — shrinks to w-0 when closed, expands to w-52 when open */}
      <AdminSidebar isOpen={isSidebarOpen} />

      {/* Right side: topbar + page content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopBar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default AdminLayout;