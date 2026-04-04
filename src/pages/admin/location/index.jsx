import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cards = [
    {
        label: "Countries",
        description: "Manage countries and timezones",
        path: "/admin/location/countries",
        icon: "🌐",
        color: "text-orange-500",
    },
    {
        label: "Cities",
        description: "Manage cities under countries",
        path: "/admin/location/cities",
        icon: "🏙️",
        color: "text-blue-500",
    },
    {
        label: "Locations",
        description: "Manage physical store locations",
        path: "/admin/location/locations",
        icon: "📍",
        color: "text-green-500",
    }
]

function LocationIndex() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="text-gray-500 hover:text-gray-800 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Location</h1>
            </div>

            {/* cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Cards.map((card) => (
                    <button
                        key={card.label}
                        onClick={() => navigate(card.path)}
                        className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                        <span className="text-3xl">{card.icon}</span>
                        <p className={`text-lg font-bold mt-3 ${card.color}`}>
                            {card.label}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">{card.description}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default LocationIndex
