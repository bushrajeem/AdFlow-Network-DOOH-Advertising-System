import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLocation, deleteLocation, getLocations } from '../../../services/api';

function CountryPage() {
    const navigate = useNavigate();

    const [countries, setCountries] = useState([]);
    const [countryName, setCountryName] = useState("");
    const [timezone, setTimezone] = useState("");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getLocations()
            .then((data) =>
                setCountries(data.filter((item) => item.type === "country"))
            )
            .catch((err) => console.error("Error fetching locations:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async () => {
        if (!countryName.trim() || !timezone.trim()) {
            return alert("Please fill in all fields.");
        }
        try {
            await createLocation({
                type: "country",
                name: countryName.trim(),
                timezone: timezone.trim(),
            })
            const updated = await getLocations();
            setCountries(updated.filter((item) => item.type === "country"));
            setCountryName("");
            setTimezone("");
        } catch (error) {
            alert("Failed to create location: " + error.message);
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Delete this location?")) return;
        try {
            await deleteLocation(id);
            setCountries((prev) => prev.filter((c) => c._id !== id));
        } catch (error) {
            alert("Failed to delete location: " + error.message);

        }
    }

    const filtered = countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );
    if (loading) return <p className="text-sm text-gray-400 p-6">Loading locations...</p>;

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
                <h1 className="text-2xl font-bold text-gray-800">Countries</h1>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="font-semibold text-gray-700">Countries</p>
                <p className="text-sm text-gray-400 mb-6">Add and manage countries</p>

                <div className="flex gap-6">

                    {/* Left: Form */}
                    <div className="flex flex-col gap-4 w-80">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500 py-1">Country Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Bangladesh"
                                value={countryName}
                                onChange={(e) => setCountryName(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500 py-1">Timezone</label>
                            <input
                                type="text"
                                placeholder="e.g. Asia/Dhaka"
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold py-3 rounded-lg tracking-wide transition-colors"
                        >
                            CREATE COUNTRY
                        </button>
                    </div>

                    {/* Right: Table */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="font-semibold text-gray-700">All Countries</p>
                                <p className="text-xs text-gray-400 py-1">Review and update existing countries</p>
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
                                    placeholder="Search by country name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ backgroundColor: "#002B6B" }} className="text-white">
                                        <th className="px-5 py-3 text-left font-medium">Country</th>
                                        <th className="px-5 py-3 text-left font-medium">Timezone</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-8 text-gray-400">
                                                No countries found
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((country) => (
                                            <tr key={country._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4 font-medium text-gray-800">{country.name}</td>
                                                <td className="px-5 py-4 text-gray-600">{country.timezone}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3 justify-end">
                                                        <button
                                                            onClick={() => handleDelete(country._id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => console.log("Edit:", country._id)}
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
    )
}

export default CountryPage
