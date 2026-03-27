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

import { ArrowLeft, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteScreen,
  getLocationsByType,
  getPlaylists,
  getScreens,
  updateScreen,
} from "../../services/api";
import { io } from "socket.io-client";

const RAW_SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || "").trim();
const SOCKET_URL = RAW_SOCKET_URL
  ? (/^https?:\/\//i.test(RAW_SOCKET_URL) ? RAW_SOCKET_URL : `https://${RAW_SOCKET_URL}`)
  : "http://localhost:5000";

function ScreenPage() {
  const navigate = useNavigate();

  const [screens, setScreens] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //edit
  const [editScreen, setEditScreen] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPlaylist, setEditPlaylist] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getScreens(),
      getPlaylists(),
      getLocationsByType("location"),
    ]).then(([s, p, l]) => {
      setScreens(s);
      setPlaylists(p);
      setLocations(l);
    }).catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {

    const socket = io(SOCKET_URL);
    // Listen for screen status changes
    socket.on("screen-status", ({ screenId, status }) => {
      setScreens((prev) =>
        prev.map((s) =>
          String(s._id) === String(screenId) ? { ...s, status } : s,
        )
      );
    });
    return () => socket.disconnect();
  }, []);


  const filtered = screens.filter((s) =>
    (s.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  // TODO: open modal or navigate to add screen form
  const handleAdd = () => navigate("/admin/screen/create");


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this screen?")) return;
    try {
      await deleteScreen(id);
      setScreens((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  //open edit drawer
  const openEdit = (screen) => {
    setEditScreen(screen);
    setEditName(screen.name);
    setEditPlaylist(screen.playlist?._id || "");
    setEditLocation(screen.location?._id || "");
  };

  const closeEdit = () => {
    setEditScreen(null);
    setEditName("");
    setEditPlaylist("");
    setEditLocation("");
  }

  const handleSave = async () => {
    if (!editName.trim()) return alert("Screen name is required.");
    setSaving(true);
    try {
      const updated = await updateScreen(editScreen._id, {
        name: editName.trim(),
        playlistId: editPlaylist || null,
        locationId: editLocation || null,
      });
      setScreens((prev) =>
        prev.map((s) => (String(s._id) === String(updated._id) ? updated : s)),
      );
      closeEdit();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);

    }
  }

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
              <th className="px-4 py-3 text-center font-medium">Screen Code</th>
              <th className="px-4 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
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

                  {/* Short screen code */}
                  <td className="px-4 py-4 text-center">
                    <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {screen.screenCode || "—"}
                    </span>
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
                        onClick={() => openEdit(screen)}
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

      {/* edit drawer */}
      {editScreen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={closeEdit}
        />

      )}
      {/* slide in panel from right */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50
        transition-transform duration-300
        ${editScreen ? "translate-x-0" : "translate-x-full"}
      `}>
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">Edit Screen</h2>
          <button
            onClick={closeEdit}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {/* body */}
        <div className="flex flex-col gap-5 p-5">

          {/* Screen Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Screen Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          {/* playlist */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Playlist</label>
              <span className="text-xs text-gray-400">Optional</span>
            </div>
            <select
              value={editPlaylist}
              onChange={(e) => setEditPlaylist(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white">
              <option value="">Select a playlist</option>
              {playlists.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <span className="text-xs text-gray-400">Optional</span>
            </div>
            <select
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="">-- No location --</option>
              {locations.map((l) => (
                <option key={l._id} value={l._id}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Screen Code — read only info */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Screen Code</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
              <span className="font-mono text-sm text-gray-700">
                {editScreen?.screenCode || "—"}
              </span>
              <span className="text-xs text-gray-400 ml-auto">Read only</span>
            </div>
            <p className="text-xs text-gray-400">
              Player URL: /player/{editScreen?.screenCode}
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#002B6B] hover:bg-blue-900 disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-lg tracking-wide transition-colors"
          >
            {saving ? "Saving..." : "SAVE CHANGES"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScreenPage;
