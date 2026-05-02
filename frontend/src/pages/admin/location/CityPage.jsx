
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLocation, deleteLocation, getLocations } from "../../../services/api";

function CityPage() {
    const navigate = useNavigate();

    const [cities, setCities] = useState([]);
    const [availableCountries, setAvailableCountries] = useState([]);
    const [cityName, setCityName] = useState("");
    const [cityCountry, setCityCountry] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLocations()
            .then((data) => {
                setCities(data.filter((item) => item.type === "city"));

                const countriesFromCountryType = data
                    .filter((item) => item.type === "country")
                    .map((item) => item.name?.trim())
                    .filter(Boolean);

                const fallbackCountries = data
                    .map((item) => item.country?.trim())
                    .filter(Boolean);

                const uniqueCountries = [
                    ...new Set(
                        countriesFromCountryType.length
                            ? countriesFromCountryType
                            : fallbackCountries
                    ),
                ];

                setAvailableCountries(uniqueCountries);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async () => {
        if (!cityName.trim() || !cityCountry.trim())
            return alert("Please fill in all fields.");
        try {
            await createLocation({
                type: "city",
                name: cityName.trim(),
                country: cityCountry.trim(),
            });
            const updated = await getLocations();
            setCities(updated.filter((item) => item.type === "city"));

            const countriesFromCountryType = updated
                .filter((item) => item.type === "country")
                .map((item) => item.name?.trim())
                .filter(Boolean);

            const fallbackCountries = updated
                .map((item) => item.country?.trim())
                .filter(Boolean);

            const uniqueCountries = [
                ...new Set(
                    countriesFromCountryType.length
                        ? countriesFromCountryType
                        : fallbackCountries
                ),
            ];

            setAvailableCountries(uniqueCountries);
            setCityName("");
            setCityCountry("");
        } catch (err) {
            alert("Failed to create city.", err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this city?")) return;
        try {
            await deleteLocation(id);
            setCities((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            alert("Failed to delete.", err);
        }
    };

    const filtered = cities.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
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
                <h1 className="text-2xl font-bold text-gray-800">Cities</h1>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="font-semibold text-gray-700">Cities</p>
                <p className="text-sm text-gray-400 mb-6">Add and manage cities</p>
                <div className="flex gap-6">
                    {/* Left: Form */}
                    <div className="flex flex-col gap-4 w-80">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500 py-1">City Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Dhaka"
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500 py-1">Country</label>
                            <select
                                value={cityCountry}
                                onChange={(e) => setCityCountry(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                            >
                                <option value="">Select country</option>
                                {availableCountries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold py-3 rounded-lg tracking-wide transition-colors"
                        >
                            CREATE CITY
                        </button>
                    </div>

                    {/* Right: Table */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="font-semibold text-gray-700">All Cities</p>
                                <p className="text-xs text-gray-400 py-1">Review and update existing cities</p>
                            </div>
                            <select className="text-[14px] border border-gray-200 rounded-lg px-2 py-1.5 outline-none">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                        </div>

                        <div className="border-2 border-gray-200 rounded-lg">
                            <div className="px-5 py-3 mt-2">
                                <input
                                    type="text"
                                    placeholder="Search by city name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ backgroundColor: "#002B6B" }} className="text-white">
                                        <th className="px-5 py-3 text-left font-medium">City</th>
                                        <th className="px-5 py-3 text-left font-medium">Country</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-8 text-gray-400">
                                                No cities found
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((city) => (
                                            <tr key={city._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4 font-medium text-gray-800">{city.name}</td>
                                                <td className="px-5 py-4 text-gray-600">{city.country}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3 justify-end">
                                                        <button
                                                            onClick={() => handleDelete(city._id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => console.log("Edit:", city._id)}
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CityPage;