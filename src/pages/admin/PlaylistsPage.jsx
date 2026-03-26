import { ArrowLeft, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePlaylist, getAds, getLocationsByType, getPlaylists, updatePlaylist } from "../../services/api";

function PlaylistsPage() {
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);
  const [locations, setLocations] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  //edit
  const [editPlaylist, setEditPlaylist] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAds, setEditAds] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getPlaylists(),
      getAds(),
      getLocationsByType("location"),
    ]).then(([p, a, l]) => {
      setPlaylists(p);
      setAds(a);
      setLocations(l);
    }).catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getPlaylistLocationNames = (playlistId) => {
    const names = playlists
      .filter((playlist) => {
        const PlaylistId =
          typeof playlist.playlist === "object"
            ? playlist.playlist?._id
            : playlist.playlist;
        return String(PlaylistId) === String(playlistId);
      })
      .map((playlist) =>
        typeof playlist.location === "object"
          ? playlist.location?.name
          : null,
      )
      .filter(Boolean);

    return [...new Set(names)];
  };

  const getDisplayLocationNames = (playlist) => {
    const fromPlaylist = (playlist.locations || [])
      .map((loc) => (typeof loc === "object" ? loc?.name : null))
      .filter(Boolean);

    if (fromPlaylist.length) return [...new Set(fromPlaylist)];

    // Fallback for old playlists created before locations[] was persisted
    return getPlaylistLocationNames(playlist._id);
  };

  // Filter table by search input
  const filtered = playlists.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => navigate("/admin/playlists/create");


  const handleDelete = async (id) => {
    if (!confirm("Delete this playlist?")) return;
    try {
      await deletePlaylist(id);
      setPlaylists((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  //open edit drawer
  const handleEdit = (playlist) => {
    setEditPlaylist(playlist);
    setEditName(playlist.name);
    setEditAds(playlist.ads?._id || "");
    setEditLocation(playlist.location?._id || "");
  };

  const closeEdit = () => {
    setEditPlaylist(null);
    setEditName("");
    setEditAds("");
    setEditLocation("");
  }

  const handleSave = async () => {
    if (!editName.trim()) return alert("Playlist name is required.");
    setSaving(true);
    try {
      const updated = await updatePlaylist(editPlaylist._id, {
        name: editName.trim(),
        adsId: editAds || null,
        locationId: editLocation || null,
      });
      setPlaylists((prev) =>
        prev.map((s) => (String(s._id) === String(updated._id) ? updated : s)),
      );
      closeEdit();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);

    }
  }

  if (loading) return <p className="text-sm text-gray-400 p-6">Loading playlists...</p>;
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
        <h1 className="text-2xl font-bold text-gray-800">Playlists</h1>
      </div>

      {/*Action Row */}
      <div className="flex items-center justify-between mb-5">
        <span className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg tracking-wide transition-colors"
          >
            + ADD NEW PLAYLIST
          </button>
          <button
            onClick={handleAdd}
            className="bg-white hover:bg-red-500 hover:text-white text-black text-sm font-semibold px-5 py-2.5 rounded-lg tracking-wide transition-colors"
          >
            <span className="flex items-center">
              <Trash2 size={14} /> Delete Playlists
            </span>
          </button>
        </span>

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
            placeholder="Search by Playlist name..."
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
              <th className="px-4 py-3 text-left font-medium">Playlist Name</th>
              <th className="px-4 py-3 text-center font-medium">Total Ads</th>
              <th className="px-4 py-3 text-center font-medium">Locations</th>
              <th className="px-4 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No Playlists found
                </td>
              </tr>
            ) : (
              filtered.map((playlist) => (
                <tr
                  key={playlist._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {/* Playlist color indicator */}
                  <td className="px-4 py-4">
                    <div className="w-6 h-6 rounded-sm bg-[#002B6B]" />
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-800">
                    {playlist.name}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800 text-center ">
                    {playlist.ads?.length || 0}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800 text-center hover:text-red-500">
                    {(() => {
                      const locationNames = getDisplayLocationNames(playlist);
                      return locationNames.length ? locationNames.join(", ") : "--";
                    })()}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleDelete(playlist._id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(playlist)}
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
      {editPlaylist && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={closeEdit}
        />

      )}
      {/* slide in panel from right */}
      <div className={`
              fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50
              transition-transform duration-300
              ${editPlaylist ? "translate-x-0" : "translate-x-full"}
            `}>
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">Edit Playlist</h2>
          <button
            onClick={closeEdit}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {/* body */}
        <div className="flex flex-col gap-5 p-5">

          {/* Playlist Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Playlist Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          {/* ads */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Ads</label>
              <span className="text-xs text-gray-400">Optional</span>
            </div>
            <select
              value={editAds}
              onChange={(e) => setEditAds(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white">
              <option value="">Select ads</option>
              {ads.map((ad) => (
                <option key={ad._id} value={ad._id}>{ad.name}</option>
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

export default PlaylistsPage;
