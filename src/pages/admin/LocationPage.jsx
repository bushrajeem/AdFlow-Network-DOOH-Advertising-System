/**
 * LocationPage.jsx — Manage locations (Countries, Cities, Locations).
 * Route: /admin/location
 *
 * Three tabs: Countries | Cities | Locations
 * Each tab has a form on the left and a data table on the right.
 *
 * BACKEND: All TODO comments mark where API calls will be connected.
 */

import { useState } from "react";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Tab definitions — add new tabs here if needed
const TABS = ["Countries", "Cities", "Locations"];

// Mock data — TODO: replace with API call GET /api/admin/countries
const MOCK_COUNTRIES = [
  { id: 1, name: "Bangladesh", timezone: "Asia/Dhaka" },
  { id: 2, name: "Bangladesh", timezone: "Asia/Chittagong" },
];

function LocationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Countries");

  // Form state — TODO: extend for Cities and Locations tabs
  const [countryName, setCountryName] = useState("");
  const [timezone, setTimezone]       = useState("");
  const [search, setSearch]           = useState("");

  // TODO: replace with useState + useEffect fetching from API
  const countries = MOCK_COUNTRIES;

  // Filter table by search input
  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // TODO: connect to POST /api/admin/countries
  const handleCreate = () => {
    console.log("Create country:", { countryName, timezone });
  };

  // TODO: connect to DELETE /api/admin/countries/:id
  const handleDelete = (id) => {
    console.log("Delete country:", id);
  };

  // TODO: connect to PATCH /api/admin/countries/:id
  const handleEdit = (id) => {
    console.log("Edit country:", id);
  };

  return (
    <div>

     {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Location</h1>
      </div>

      {/*Tabs */}
      <div className="flex ml-0.5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors
              ${activeTab === tab
                ? "bg-[#002B6B] text-white"
                : "text-gray-500 hover:text-gray-700 bg-white"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content*/}
      {/* TODO: render different form + table for Cities and Locations tabs */}
      {activeTab === "Countries" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">

          {/* Section title */}
          <p className="font-semibold text-gray-700">Countries</p>
          <p className="text-sm text-gray-400 mb-6">Add new countries</p>

          <div className="flex gap-6">

            {/* ── Left: Create Form ──────────────────────────────────────── */}
            <div className="flex flex-col gap-4 w-80">

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 py-1">Country Name</label>
                <input
                  type="text"
                  placeholder="Enter country name"
                  value={countryName}
                  onChange={(e) => setCountryName(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 py-1">Timezone</label>
                {/* TODO: replace with a timezone dropdown library e.g. react-select */}
                <input
                  type="text"
                  placeholder="Select timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 mb-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <button
                onClick={handleCreate}
                className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold py-4 rounded-lg tracking-wide transition-colors"
              >
                CREATE COUNTRY
              </button>

            </div>

            {/* Right: Countries Table*/}
            <div className="flex-1">

              {/* Table header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Countries</p>
                  <p className="text-xs text-gray-400 mb-1">Review existing countries and update their details</p>
                </div>
                {/* TODO: connect Per Page to pagination logic */}
                <select className="text-[14px] border border-gray-200 rounded-lg px-2 py-1.5 outline-none">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>

              <div className=" border-2 border-gray-200 rounded-lg ">
                {/* Search */}
              <div className="px-5 py-3 mt-2">
                <input
                type="text"
                placeholder="Search by country name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-300"
              />
              </div>

              {/* Table */}
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#002B6B" }} className="text-white">
                    <th className="px-4 py-3 text-left font-medium">Country</th>
                    <th className="px-4 py-3 text-left font-medium">Timezone</th>
                    <th className="px-4 py-3" />
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
                      <tr key={country.id} className="border-b border-gray-100">
                        <td className="px-4 py-4 font-medium text-gray-800">{country.name}</td>
                        <td className="px-4 py-4 text-gray-600">{country.timezone}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3 justify-end">
                            <button
                              onClick={() => handleDelete(country.id)}
                              className=" hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(country.id)}
                              className=" hover:text-blue-600 transition-colors"
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
      )}

      {/* TODO: build Cities tab content — same pattern as Countries */}
      {activeTab === "Cities" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-400 text-sm">
          Cities tab — coming soon
        </div>
      )}

      {/* TODO: build Locations tab content — same pattern as Countries */}
      {activeTab === "Locations" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-400 text-sm">
          Locations tab — coming soon
        </div>
      )}

    </div>
  );
}

export default LocationPage;