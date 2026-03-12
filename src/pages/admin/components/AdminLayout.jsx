/**
 * AdminLayout.jsx — Shell wrapper for all admin pages.
 * Renders sidebar + topbar. Active page loads inside <Outlet />.
 */

import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import useSidebarToggle from "../../../hooks/useSidebarToggle";
import AdminTopBar from "./AdminTopBar";

function AdminLayout() {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarToggle();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 "
          onClick={closeSidebar}
        />
      )}

      {/* Right side */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Topbar */}
        <AdminTopBar onToggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;