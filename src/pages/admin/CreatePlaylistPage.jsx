/**
 * CreatePlaylistPage.jsx — Form to create a new playlist.
 * Route: /admin/playlists/create
 *
 * Playlist depends on ads and locations — both are optional selections.
 * Only playlist name is required to save.
 *
 * BACKEND:
 *   GET  /api/admin/ads        → replace MOCK_ADS
 *   GET  /api/admin/locations  → replace MOCK_LOCATIONS
 *   POST /api/admin/playlists  → save playlist
 *   Body: { name, adIds[], locationIds[] }
 */

import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPlaylist, getAds, getLocationsByType } from "../../services/api";


function SelectableItem({ label, sub, selected, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className={`flex items-center justify-between px-4 py-3 rounded-lg border text-left text-sm transition-colors w-full
        ${selected
                    ? "border-blue-500 bg-blue-50 text-blue-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
        >
            <div className="flex flex-col gap-0.5">
                <span className="font-medium">{label}</span>
                {sub && <span className="text-xs text-gray-400">{sub}</span>}
            </div>

            {/* Checkmark — only visible when selected */}
            {selected && (
                <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-white" />
                </span>
            )}
        </button>
    );
}

function SectionLabel({ title, count, note }) {
    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{title}</span>
                {/* Badge shows count only when at least one item is selected */}
                {count > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                        {count} selected
                    </span>
                )}
            </div>
            {note && <span className="text-xs text-gray-400">{note}</span>}
        </div>
    );
}

function CreatePlaylistPage() {
    const navigate = useNavigate();

    const [playlistName, setPlaylistName] = useState("");
    const [ads, setAds] = useState([]);
    const [selectedAds, setSelectedAds] = useState(new Set());
    const [locations, setLocations] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState(new Set());
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAds()
            .then((data) => setAds(data))
            .catch((err) => console.error("Failed to fetch ads:", err))
            .finally(() => setLoading(false));
        getLocationsByType("location")
            .then((data) => setLocations(data))
            .catch(console.error);
    }, []);

    const toggle = (set, setFn, id) => {
        const next = new Set(set);
        next.has(id) ? next.delete(id) : next.add(id);
        setFn(next);
    };

    const handleSave = async () => {
        if (!playlistName.trim()) return alert("Please enter a playlist name.");

        try {
            await createPlaylist({
                name: playlistName.trim(),
                adIds: Array.from(selectedAds),
                locationIds: Array.from(selectedLocations)
            });
            navigate("/admin/playlists");
        } catch (err) {
            alert("Failed to create playlist.", err);
        }
    };

    return (
        <div className="max-w-lg">

            {/* Page Header */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => navigate("/admin/playlists")}
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Create Playlist</h1>
            </div>

            <div className="flex flex-col gap-6">

                {/* Playlist Name — required */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                        Playlist Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Playlist - 01"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>

                {/*  Ads Selection */}
                <div>
                    <SectionLabel
                        title="Select Ads"
                        count={selectedAds.size}
                        note="Optional"
                    />
                    {loading ? (
                        <p className="text-sm text-gray-400">Loading ads...</p>
                    ) : ads.length === 0 ? (
                        <p className="text-sm text-gray-400">
                            No ads found.{" "}
                            <button
                                onClick={() => navigate("/admin/ads/create")}
                                className="text-blue-500 hover:underline"
                            >
                                Create one first.
                            </button>
                        </p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {ads.map((ad) => (
                                <SelectableItem
                                    key={ad._id}
                                    label={ad.name}
                                    sub={`Duration: ${ad.duration}s`}
                                    selected={selectedAds.has(ad._id)}
                                    onToggle={() => toggle(selectedAds, setSelectedAds, ad._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {/* Locations Selection — optional, multiple */}

                <div>
                    <SectionLabel
                        title="Assign Locations"
                        count={selectedLocations.size}
                        note="Optional"
                    />
                    {locations.length === 0 ? (
                        <p className="text-sm text-gray-400">No locations found.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {locations.map((loc) => (
                                <SelectableItem
                                    key={loc._id}
                                    label={loc.name}
                                    sub={loc.city}
                                    selected={selectedLocations.has(loc._id)}
                                    onToggle={() => toggle(selectedLocations, setSelectedLocations, loc._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Save */}
                <button
                    onClick={handleSave}
                    className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold px-8 py-3 rounded-lg tracking-wide transition-colors w-fit"
                >
                    SAVE PLAYLIST
                </button>

            </div>
        </div>
    );
}

export default CreatePlaylistPage;