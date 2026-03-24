
import { ArrowLeft, Pencil, PlusCircle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLocation, deleteLocation, getLocations } from "../../../services/api";

function LocationsPage() {
    const navigate = useNavigate();

    const [allEntries, setAllEntries] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [locationName, setLocationName] = useState("");

    useEffect(() => {
        getLocations()
            .then((data) => setAllEntries(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const locations = allEntries.filter((item) => item.type === "location" || !item.type);

    const typedCountryNames = allEntries
        .filter((item) => item.type === "country")
        .map((item) => item.name)
        .filter(Boolean);
    const typedCityNames = allEntries
        .filter((item) => item.type === "city")
        .map((item) => item.name)
        .filter(Boolean);

    const fallbackCountryNames = allEntries
        .filter((item) => !item.type)
        .map((item) => item.country)
        .filter(Boolean);
    const fallbackCityNames = allEntries
        .filter((item) => !item.type)
        .map((item) => item.city)
        .filter(Boolean);

    const uniqueCountries = [...new Set(typedCountryNames.length ? typedCountryNames : fallbackCountryNames)];
    const uniqueCities = [...new Set(typedCityNames.length ? typedCityNames : fallbackCityNames)];

    const handleSaveLocation = async () => {
        if (!locationName.trim()) return alert("Enter a location name.");
        try {
            await createLocation({
                type: "location",
                name: locationName.trim(),
                city: selectedCity,
                country: selectedCountry,
            });
            const updated = await getLocations();
            setAllEntries(updated);
            setShowModal(false);
            setStep(1);
            setSelectedCountry("");
            setSelectedCity("");
            setLocationName("");
        } catch (err) {
            alert("Failed to save location.", err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this location?")) return;
        try {
            await deleteLocation(id);
            setAllEntries((prev) => prev.filter((l) => l._id !== id));
        } catch (err) {
            alert("Failed to delete.", err);
        }
    };

    const filtered = locations.filter((l) =>
        l.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <p className="text-sm text-gray-400 p-6">Loading...</p>;

    return (
        <div>

            {/* Page Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate("/admin/location")}
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Locations</h1>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <p className="font-semibold text-gray-700">Locations</p>
                        <p className="text-sm text-gray-400">View and manage all physical store locations.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate("/admin/location/countries")}
                            className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-[#002B6B] hover:text-white transition-colors"
                        >
                            + Go to Countries
                        </button>
                        <button
                            onClick={() => navigate("/admin/location/cities")}
                            className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-[#002B6B] hover:text-white transition-colors"
                        >
                            + Go to Cities
                        </button>
                    </div>
                </div>

                {/* Stat Cards — real counts */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: "Countries", value: uniqueCountries.length, icon: "🌐", color: "text-orange-500" },
                        { label: "Cities", value: uniqueCities.length, icon: "🏙️", color: "text-blue-500" },
                        { label: "Locations", value: locations.length, icon: "📍", color: "text-green-500" },
                    ].map((stat) => (
                        <div key={stat.label} className="border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                    ))}
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => { setShowModal(true); setStep(1); }}
                        className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg tracking-wide transition-colors"
                    >
                        + ADD NEW LOCATION
                    </button>
                    <select className="text-[14px] border border-gray-200 rounded-lg px-2 py-1.5 outline-none">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by location name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-72 mb-4 outline-none focus:ring-2 focus:ring-blue-300"
                />

                {/* Table */}
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ backgroundColor: "#002B6B" }} className="text-white">
                            <th className="px-5 py-3 text-left font-medium">Location</th>
                            <th className="px-5 py-3 text-left font-medium">City</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-8 text-gray-400">
                                    No locations found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((loc) => (
                                <tr key={loc._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-4 font-medium text-[#002B6B]">{loc.name}</td>
                                    <td className="px-5 py-4 text-gray-600">{loc.city}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3 justify-end">
                                            <button
                                                onClick={() => handleDelete(loc._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => console.log("Edit:", loc._id)}
                                                className="text-gray-400 hover:text-blue-600 transition-colors mr-3"
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

            {/* Add New Location Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6 relative">

                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <h2 className="text-lg font-bold text-[#002B6B] mb-5">
                            Add New Location
                        </h2>

                        <div className="border border-gray-200 rounded-xl p-5 flex flex-col gap-4">

                            {/* Step 1 — Country */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                    Step 1: Select Country
                                </p>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedCountry}
                                        onChange={(e) => { setSelectedCountry(e.target.value); setStep(2); }}
                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                                    >
                                        <option value="">Choose a country</option>
                                        {uniqueCountries.map((name) => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => { setShowModal(false); navigate("/admin/location/countries"); }}
                                        className="flex items-center gap-1.5 bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                                    >
                                        <PlusCircle size={15} />
                                        ADD NEW
                                    </button>
                                </div>
                            </div>

                            {/* Step 2 — City */}
                            {step >= 2 && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Step 2: Select City
                                    </p>
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedCity}
                                            onChange={(e) => { setSelectedCity(e.target.value); setStep(3); }}
                                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                                        >
                                            <option value="">Choose a city</option>
                                            {uniqueCities.map((name) => (
                                                <option key={name} value={name}>{name}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => { setShowModal(false); navigate("/admin/location/cities"); }}
                                            className="flex items-center gap-1.5 bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                                        >
                                            <PlusCircle size={15} />
                                            ADD NEW
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3 — Location Name */}
                            {step >= 3 && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Step 3: Location Name
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="e.g. PriyoShop HQ"
                                        value={locationName}
                                        onChange={(e) => setLocationName(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                            )}

                            {/* Save */}
                            {step >= 3 && (
                                <button
                                    onClick={handleSaveLocation}
                                    className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold py-2.5 rounded-lg tracking-wide transition-colors"
                                >
                                    SAVE LOCATION
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default LocationsPage;