/**
 * DashboardPage.jsx — Admin overview page. Route: /admin/dashboard
 * BACKEND: fetch('/api/admin/stats') to replace placeholder stats.
 */

function DashboardPage() {
  // BACKEND: replace these with real values from API response
  const stats = [
    { label: "Locations", value: 1,  color: "bg-blue-500"   },
    { label: "Screens",   value: 3,  color: "bg-green-500"  },
    { label: "Ads",       value: 3,  color: "bg-yellow-500" },
    { label: "Users",     value: 3,  color: "bg-red-500"    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Overview</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-white font-bold text-lg`}>
              {stat.value}
            </div>
            <span className="text-sm text-gray-600">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;