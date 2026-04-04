/**
 * CreateScreenPage.jsx — Form to register a new screen.
 * Route: /admin/screen/create
 *
 * Screen is the independent entity.
 * Playlist and location are optional — screen saves without them.
 *
 * BACKEND:
 *   GET /api/admin/playlists  → populate playlist dropdown
 *   GET /api/admin/locations  → populate location dropdown
 *   POST /api/admin/screens   → save screen record
 *   Body: { name, playlistId?, locationId? }
 */

import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createScreen, getLocationsByType, getPlaylists } from "../../services/api";


function CreateScreenPage() {
  const navigate = useNavigate();

  const [screenName, setScreenName] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [playlists, setPlaylists] = useState([]); 
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getPlaylists()
      .then((data) => setPlaylists(data))
      .catch(console.error);

    getLocationsByType("location")
      .then((data) => setLocations(data))
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    if (!screenName.trim()) return alert("Please enter a screen name.");
    try{
      await createScreen({
        name: screenName.trim(),
        playlistId: playlistId || null,
        locationId: locationId || null,
      });
      navigate("/admin/screen");
    } catch(err) {
      return alert(err.message);
    }
  };

  return (
    <div className="max-w-lg">

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/admin/screen")}
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Create Screen</h1>
      </div>

      <div className="flex flex-col gap-6">

        {/* Screen Name — required */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Screen Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Private Screen - 01"
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Playlist — optional */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Playlist</label>
            <span className="text-xs text-gray-400">Optional</span>
          </div>
          <select
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          >
            <option value="">-- No playlist assigned --</option>
            {/* TODO: replace MOCK_PLAYLISTS with API response */}
            {playlists.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Location — optional */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <span className="text-xs text-gray-400">Optional</span>
          </div>
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          >
            <option value="">-- No location assigned --</option>
            {/* TODO: replace MOCK_LOCATIONS with API response */}
            {locations.map((l) => (
              <option key={l._id} value={l._id}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold px-8 py-3 rounded-lg tracking-wide transition-colors w-fit"
        >
          SAVE SCREEN
        </button>

      </div>
    </div>
  );
}

export default CreateScreenPage;