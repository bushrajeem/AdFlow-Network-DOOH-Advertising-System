import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAd, getAds } from "../../services/api";


function AdsPage() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAds()
      .then((data) => setAds(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // TODO: open modal or navigate to add Ads form
  const handleAdd = () => navigate("/admin/ads/create");

  // TODO: connect to DELETE /api/admin/ads/:id
  const handleDelete = async (id) => {
    if (!confirm("Delete this ad?")) return;
    try {
      await deleteAd(id);
      setAds(ads.filter((ad) => ad._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter table by search input
  const filtered = ads.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <p className="text-sm text-gray-400">Loading ads...</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;


  // TODO: connect to PATCH /api/admin/ads/:id
  const handleEdit = (id) => console.log("Edit Ads:", id);

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
        <h1 className="text-2xl font-bold text-gray-800">Ads</h1>
      </div>

      {/*Action Row */}
      <div className="flex items-center justify-between mb-5">
        <span className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg tracking-wide transition-colors"
          >
            + ADD NEW AD
          </button>
          <button
            onClick={handleAdd}
            className="bg-white hover:bg-red-500 hover:text-white text-black text-sm font-semibold px-5 py-2.5 rounded-lg tracking-wide transition-colors"
          >
            <span className="flex items-center">
              <Trash2 size={14} /> Delete ADs
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
            placeholder="Search by Ad's name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-72 outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="bg-[#002B6B] text-white">
            <tr>
              <th className="w-12 px-4 py-3" />
              <th className="px-4 py-3 text-left font-medium">Ad's Name</th>
              <th className="px-4 py-3 text-center font-medium">Playlist</th>
              <th className="px-4 py-3 text-center font-medium">Play Count</th>
              <th className="px-4 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No Ads found
                </td>
              </tr>
            ) : (
              filtered.map((ad) => (
                <tr
                  key={ad._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {/* Ads color indicator */}
                  <td className="px-4 py-4">
                    <div className="w-6 h-6 rounded-sm bg-[#002B6B]" />
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-800">
                    {ad.name}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800 text-center ">
                    {ad.playlist}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800 text-center hover:text-red-500">
                    {ad.Play_Count}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(ad._id)}
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

export default AdsPage;
