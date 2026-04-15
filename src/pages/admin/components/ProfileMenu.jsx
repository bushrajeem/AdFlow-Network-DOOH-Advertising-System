<<<<<<< HEAD
import { useState } from "react";
=======
 import{ useState } from "react";
>>>>>>> 888b8cb (Added profile menu and updated dashboard)

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ position: "relative" }}>
<<<<<<< HEAD
      {/* Avatar */}
=======
      
      {/* Avatar Button */}
>>>>>>> 888b8cb (Added profile menu and updated dashboard)
      <button onClick={() => setOpen(!open)}>
        👤
      </button>

<<<<<<< HEAD
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
=======
      {/* Dropdown Menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "10px",
            width: "120px",
          }}
        >
          <div
            style={{
              cursor: "pointer",
              marginBottom: "8px",
            }}
          >
            Profile
          </div>

          <div
            style={{
              cursor: "pointer",
              color: "red",
            }}
>>>>>>> 888b8cb (Added profile menu and updated dashboard)
            onClick={handleLogout}
          >
            Sign Out
          </div>
        </div>
      )}
    </div>
  );
}