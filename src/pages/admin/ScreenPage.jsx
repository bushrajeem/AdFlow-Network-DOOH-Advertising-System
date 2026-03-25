/**
 * ScreenPage.jsx — Manage digital screens.
 * Route: /admin/screen
 *
 * BACKEND:
 *   GET    /api/admin/screens        → replace MOCK_SCREENS
 *   POST   /api/admin/screens        → handleAdd
 *   DELETE /api/admin/screens/:id    → handleDelete
 *   PATCH  /api/admin/screens/:id    → handleEdit
 */

import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteScreen, getScreens } from "../../services/api";


function ScreenPage() {
  const navigate = useNavigate();

  const [screens, setScreens] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getScreens()
      .then((data) => setScreens(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);


  const filtered = screens.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  // TODO: open modal or navigate to add screen form
  const handleAdd = () => navigate("/admin/screen/create");


  const handleDelete = async (id) => {
    if (!confirm("Delete this screen?")) return;
    try {
      await deleteScreen(id);
      setScreens((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }


  const handleEdit = (id) => console.log("Edit screen:", id);

  if (loading) return <p className="text-sm text-gray-400 p-6">Loading screens...</p>;
  if (error) return <p className="text-sm text-red-400 p-6">{error}</p>;

  return (
    <div>
      {/* Page Header*/}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Screen</h1>
      </div>

      {/*Action Row */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={handleAdd}
          className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg tracking-wide transition-colors"
        >
          + ADD NEW SCREEN
        </button>

        {/* TODO: connect to pagination logic */}
        <select className="text-[14px] border bg-white border-gray-200 rounded-lg px-2 py-2 outline-none">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
      </div>

      {/* Table Card*/}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search by screen name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-72 outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#002B6B" }} className="text-white">
              <th className="w-12 px-4 py-3" />
              <th className="px-4 py-3 text-left font-medium">Ad's Name</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Location</th>
              <th className="px-4 py-3 text-center font-medium">Playlist</th>
              <th className="px-4 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No screens found
                </td>
              </tr>
            ) : (
              filtered.map((screen) => (
                <tr
                  key={screen._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {/* Screen color indicator */}
                  <td className="px-4 py-4">
                    <div className="w-6 h-6 rounded-sm bg-[#002B6B]" />
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-800">
                    {screen.name}
                  </td>

                  {/* Status with dot indicator */}
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`flex items-center justify-center gap-1.5 font-medium
                      ${screen.status === "Online" ? "text-green-500" : "text-red-500"}`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full
                        ${screen.status === "Online" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      {screen.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center text-gray-700">
                    {screen.location?.name || "--"}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-700">
                    {screen.playlist?.name || "--"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleDelete(screen._id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(screen._id)}
                        className="hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScreenPage;
