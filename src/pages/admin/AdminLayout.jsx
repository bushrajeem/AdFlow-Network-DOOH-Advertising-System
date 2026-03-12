import React from 'react'
import useSidebarToggle from '../../hooks/useSidebarToggle';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarToggle();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
 
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
 
      {/* ── Mobile overlay: clicking it closes the sidebar ───────────────── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}
 
      {/* ── Right side: Top bar + Main content ───────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation bar */}
        <AdminTopBar onToggleSidebar={toggleSidebar} />
 
        {/* Main content area — each admin page renders here via <Outlet /> */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
