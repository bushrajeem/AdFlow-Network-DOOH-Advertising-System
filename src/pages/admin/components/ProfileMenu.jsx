import { useState } from "react";
import { LogOut, User } from "lucide-react";

function ProfileMenu() {
  const [open, setOpen] = useState(false);

  const user = {
    name: "AdFlow-Network",
    email: "abc@gmail.com",
  };

  const getInitial = (name) => name.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="relative">
      
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {user.name}
        </span>

        <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
          {getInitial(user.name)}
        </div>
      </button>

      
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border z-50">

          
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
              {getInitial(user.name)}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {user.name}
              </p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="border-t"></div>

          
          <div className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer">
            <User size={16} />
            Profile
          </div>

         
          <div
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 hover:bg-red-100 text-red-500 cursor-pointer"
          >
            <LogOut size={16} />
            Sign Out
          </div>

        </div>
      )}
    </div>
  );
}

export default ProfileMenu;