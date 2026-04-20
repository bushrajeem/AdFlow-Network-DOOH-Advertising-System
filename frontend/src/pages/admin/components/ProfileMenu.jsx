import { useState } from "react";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Avatar */}
      <button onClick={() => setOpen(!open)}>
        👤
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "10px",
          width: "120px"
        }}>
          <div style={{ cursor: "pointer", marginBottom: "8px" }}>
            Profile
          </div>

          <div 
            style={{ cursor: "pointer", color: "red" }}
            onClick={handleLogout}
          >
            Sign Out
          </div>
        </div>
      )}
    </div>
  );
}