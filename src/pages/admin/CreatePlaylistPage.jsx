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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Mock data — replace with API calls 
// TODO: fetch from GET /api/admin/ads
const MOCK_ADS = [
    { id: 1, name: "Nokia Ad", duration: "15s" },
    { id: 2, name: "Brand Ad", duration: "15s" },
    { id: 3, name: "Choco Chip Ad", duration: "15s" },
    { id: 4, name: "Summer Sale", duration: "15s" },
];

// TODO: fetch from GET /api/admin/locations
const MOCK_LOCATIONS = [
    { id: 1, name: "PriyoShop HQ" },
    { id: 2, name: "Agora Dhanmondi" },
    { id: 3, name: "Shwapno Mirpur" },
];

// ── SelectableItem — reusable selectable card
// Used for both ads and locations.
// Props:
//   label    {string}  — primary text shown on the card
//   sub      {string}  — optional secondary text (e.g. duration)
//   selected {boolean} — whether this item is currently selected
//   onToggle {fn}      — called when the card is clicked
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

// ── SectionLabel — reusable label + optional count badge
// Props:
//   title {string} — section heading
//   count {number} — number of selected items (0 hides the badge)
//   note  {string} — optional right-side note e.g. "Optional"
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

    // Required field
    const [playlistName, setPlaylistName] = useState("");

    // Selected IDs — stored as Sets for O(1) toggle/lookup
    // Set is ideal here: toggling an id is just add() or delete()
    const [selectedAds, setSelectedAds] = useState(new Set());
    const [selectedLocations, setSelectedLocations] = useState(new Set());

    // Toggle logic — if id is already in the Set, remove it; otherwise add it
    // Returns a NEW Set so React detects the state change
    const toggle = (set, setFn, id) => {
        const next = new Set(set);
        next.has(id) ? next.delete(id) : next.add(id);
        setFn(next);
    };

    const handleSave = () => {
        if (!playlistName.trim()) return alert("Please enter a playlist name.");

        const payload = {
            name: playlistName.trim(),
            adIds: [...selectedAds],        // convert Set → array for API
            locationIds: [...selectedLocations],  // convert Set → array for API
        };

        // TODO: POST /api/admin/playlists with payload
        console.log("Save playlist:", payload);
        // On success: navigate("/admin/playlists");
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

                {/*  Ads Selection — optional, multiple */}
                {/*
          Renders each ad as a SelectableItem.
          Clicking toggles it in/out of selectedAds Set.
          SectionLabel shows the live count of selected ads.
        */}
                <div>
                    <SectionLabel
                        title="Select Ads"
                        count={selectedAds.size}
                        note="Optional"
                    />
                    <div className="flex flex-col gap-2">
                        {/* TODO: replace MOCK_ADS with data fetched from GET /api/admin/ads */}
                        {MOCK_ADS.map((ad) => (
                            <SelectableItem
                                key={ad.id}
                                label={ad.name}
                                sub={`Duration: ${ad.duration}`}
                                selected={selectedAds.has(ad.id)}
                                onToggle={() => toggle(selectedAds, setSelectedAds, ad.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Locations Selection — optional, multiple */}
                {/*
          Same pattern as ads selection above.
          Clicking toggles location in/out of selectedLocations Set.
        */}
                <div>
                    <SectionLabel
                        title="Assign Locations"
                        count={selectedLocations.size}
                        note="Optional"
                    />
                    <div className="flex flex-col gap-2">
                        {/* TODO: replace MOCK_LOCATIONS with GET /api/admin/locations */}
                        {MOCK_LOCATIONS.map((loc) => (
                            <SelectableItem
                                key={loc.id}
                                label={loc.name}
                                selected={selectedLocations.has(loc.id)}
                                onToggle={() => toggle(selectedLocations, setSelectedLocations, loc.id)}
                            />
                        ))}
                    </div>
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