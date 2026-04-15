/**
 * DashboardPage.jsx — Admin overview page. Route: /admin/dashboard
 * BACKEND: fetch('/api/admin/stats') to replace placeholder stats.
 */
import ProfileMenu from "./components/ProfileMenu";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/api";

const Stat_config = [
  { key: "locations", label: "Locations", icon: "📍", color: "bg-orange-500", path: "/admin/location" },
  { key: "screens", label: "Screens", icon: "🖥️", color: "bg-green-500", path: "/admin/screen" },
  { key: "ads", label: "Ads", icon: "📢", color: "bg-yellow-500", path: "/admin/ads" },
  { key: "playlists", label: "Playlists", icon: "▶️", color: "bg-blue-500", path: "/admin/playlists" },
  { key: "users", label: "Users", icon: "👤", color: "bg-red-500", path: "/admin/users" },
]

function DashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-400 p-6">Loading stats...</p>;
  if (error) return <p className="text-sm text-red-400 p-6">{error}</p>;
  if (!stats) return <Navigate to="/admin/dashboard" />;

  return (
   
    <div>
      
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
  <ProfileMenu />
</div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Overview</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Stat_config.map((stat) => (
          <button
            key={stat.key}
            onClick={() => navigate(stat.path)}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:border-blue-300 hover:shadow-sm transition-all text-left"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white text-xl shrink-0`}>
              {stat.icon}
            </div>
            <div>
              {/* Real count from backend */}
              <p className="text-2xl font-bold text-gray-800">{stats[stat.key]}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick action buttons */}

      {/* <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "+ Add Screen", path: "/admin/screen/create" },
            { label: "+ Upload Ad", path: "/admin/ads/create" },
            { label: "+ Add Playlist", path: "/admin/playlists/create" },
            { label: "+ Add Location", path: "/admin/location" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 hover:bg-[#002B6B] hover:text-white hover:border-[#002B6B] transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div> */}

    </div>
  );
}

export default DashboardPage;