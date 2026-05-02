/**
 * useSidebarToggle.js — manages sidebar open/close state.
 *
 * Returns: { isSidebarOpen, toggleSidebar, closeSidebar }
 *
 * Usage:
 *   const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarToggle();
 */

import { useState } from "react";

function useSidebarToggle() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar  = () => setIsSidebarOpen(false);

  return { isSidebarOpen, toggleSidebar, closeSidebar };
}

export default useSidebarToggle;