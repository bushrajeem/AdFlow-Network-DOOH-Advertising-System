/**
 * AdminTopBar.jsx — Admin panel header.
 * Shows logo + sidebar toggle on the left, user profile on the right.
 * BACKEND: Replace hardcoded name and avatar with auth context user data.
 */

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}


function AdminTopBar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".relative")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // get logged-in user from storage
  const currentUser = JSON.parse(localStorage.getItem("user"));
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 py-10">
      {/*Left: Logo + Sidebar Toggle*/}
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
          <Link to="/">
            <img className="w-30 h-17.5" src="/logo.png" alt="Logo" />
          </Link>
        </div>
      </div>

      {/*Right: User Profile  */}
      {/* BACKEND: Replace avatar src and "Jeem" with auth context user */}
      <div className="flex items-center gap-2 bg-blue-600 text-white pl-1 pr-4 py-1 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
        {/* Avatar */}

          {/* Avatar + Name */}
          <div className="relative">
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                {getInitials(currentUser?.name || "User")}
              </div>
            </div>

            {/* Dropdown */}
            {showMenu && (
              <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-md w-40 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
      </div>
    </header>
  );
}

export default AdminTopBar;
