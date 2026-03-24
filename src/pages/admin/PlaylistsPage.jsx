import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePlaylist, getPlaylists } from "../../services/api";

function PlaylistsPage() {
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getPlaylists()
      .then((data) => setPlaylists(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

  const handleEdit = (id) => console.log("Edit Playlist:", id);
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
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No Playlists found
                </td>
              </tr>
            ) : (
              filtered.map((playlist) => (
                <tr
                  key={playlist.id}
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
                    {playlist.locations?.length || 0}
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
                        onClick={() => handleEdit(playlist.id)}
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

export default PlaylistsPage;
