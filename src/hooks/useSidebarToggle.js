/*
 *hooks/useSidebarToggle.js — Sidebar Open/Close State Hook*

PURPOSE:
   Manages the boolean state that controls whether the admin sidebar is
   open or closed. Especially useful on mobile where the sidebar is hidden
   by default and toggled by a hamburger button.

INPUTS:
   None — the hook manages its own state internally.

OUTPUTS:
   {
    isSidebarOpen: boolean  — true if sidebar is visible
    toggleSidebar: fn       — flips the current state (open ↔ close)
    openSidebar:   fn       — forces sidebar open
    closeSidebar:  fn       — forces sidebar closed
   }

EXAMPLE USAGE:
   import useSidebarToggle from '../hooks/useSidebarToggle';

   function MyLayout() {
   const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebarToggle();
   return (
       <>
         <button onClick={toggleSidebar}>☰</button>
         <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
       </>
    );
    }

TEAM NOTES:
   - The sidebar is OPEN by default on desktop (lg screens)
   - On mobile it starts CLOSED
   - You can change the default by adjusting the useState initial value
*/
 
import { useState } from "react";
 
function useSidebarToggle() {
  // Default: sidebar is open on load (suitable for desktop-first layout)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 
  // Flip: open → closed, closed → open
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
 
  // Force open
  const openSidebar = () => setIsSidebarOpen(true);
 
  // Force close (used when mobile overlay is clicked)
  const closeSidebar = () => setIsSidebarOpen(false);
 
  return { isSidebarOpen, toggleSidebar, openSidebar, closeSidebar };
}
 
export default useSidebarToggle;
 