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
import { ArrowLeft, Trash2, Pencil, X, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Tab definitions — add new tabs here if needed
const TABS = ["Countries", "Cities", "Locations"];

// Mock data — TODO: replace with API call GET /api/admin/countries
const MOCK_COUNTRIES = [
  { id: 1, name: "Bangladesh", timezone: "Asia/Dhaka" },
  { id: 2, name: "Bangladesh", timezone: "Asia/Chittagong" },
];
const MOCK_LOCATIONS = [
  { id: 1, name: "PriyoShop HQ", city: "Dhaka" },
  { id: 2, name: "DhakaUddan", city: "Dhaka" },
];
// TODO: replace with GET /api/admin/cities
const MOCK_CITIES = [
  { id: 1, name: "Dhaka", country: "Bangladesh" },
  { id: 2, name: "Chittagong", country: "Bangladesh" },
];

function LocationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Countries");

  // Form state
  const [countryName, setCountryName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [search, setSearch] = useState("");

  const [cityName, setCityName] = useState("");
  const [cityCountry, setCityCountry] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [locationName, setLocationName] = useState("");

  // TODO: replace with useState + useEffect fetching from API
  const countries = MOCK_COUNTRIES;

  // Filter table by search input
  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
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

  // TODO: connect to POST /api/admin/cities
  const handleCreateCity = () => {
    if (!cityName || !cityCountry) return alert("Fill in all fields.");
    console.log("Create city:", { cityName, cityCountry });
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
              ${
                activeTab === tab
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
                <label className="text-sm text-gray-500 py-1">
                  Country Name
                </label>
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
                  <p className="font-semibold text-gray-700">Countries</p>
                  <p className="text-xs text-gray-400 py-1">
                    Review existing countries and update their details
                  </p>
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
                    <tr
                      style={{ backgroundColor: "#002B6B" }}
                      className="text-white"
                    >
                      <th className="px-4 py-3 text-left font-medium">
                        Country
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        Timezone
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center py-8 text-gray-400"
                        >
                          No countries found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((country) => (
                        <tr
                          key={country.id}
                          className="border-b border-gray-100"
                        >
                          <td className="px-4 py-4 font-medium text-gray-800">
                            {country.name}
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {country.timezone}
                          </td>
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Section title */}
          <p className="font-semibold text-gray-700">Cities</p>
          <p className="text-sm text-gray-400 mb-6">Add new cities</p>

          <div className="flex gap-6">
            {/* ── Left: Create Form ────────────────────────────────────── */}
            <div className="flex flex-col gap-4 w-80">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 py-1">City Name</label>
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500 py-1">Country</label>
                {/* TODO: replace with dynamic list from GET /api/admin/countries */}
                <select
                  value={cityCountry}
                  onChange={(e) => setCityCountry(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 mb-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Select country</option>
                  {MOCK_COUNTRIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCreateCity}
                className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold py-4 rounded-lg tracking-wide transition-colors"
              >
                CREATE CITY
              </button>
            </div>

            {/*Right: Cities Table*/}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-700">Cities</p>
                  <p className="text-xs text-gray-400 py-1">
                    Review existing cities and update their details
                  </p>
                </div>
                {/* TODO: connect to pagination */}
                <select className="text-[14px] border border-gray-200 rounded-lg px-2 py-1.5 outline-none">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>

              <div className=" border-2 border-gray-200 rounded-lg">
                <div className="px-5 py-3 mt-2">
                  <input
                    type="text"
                    placeholder="Search by city name..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{ backgroundColor: "#002B6B" }}
                      className="text-white"
                    >
                      <th className="px-4 py-3 text-left font-medium">City</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Country
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {/* TODO: replace MOCK_CITIES with GET /api/admin/cities */}
                    {MOCK_CITIES.filter((c) =>
                      c.name.toLowerCase().includes(citySearch.toLowerCase()),
                    ).length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center py-8 text-gray-400"
                        >
                          No cities found
                        </td>
                      </tr>
                    ) : (
                      MOCK_CITIES.filter((c) =>
                        c.name.toLowerCase().includes(citySearch.toLowerCase()),
                      ).map((city) => (
                        <tr
                          key={city.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 font-medium text-gray-800">
                            {city.name}
                          </td>
                          <td className="px-4 py-4 text-gray-600">
                            {city.country}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3 justify-end">
                              <button
                                onClick={() =>
                                  console.log("Edit city", city.id)
                                }
                                className="hover:text-blue-600 transition-colors"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  console.log("Delete city", city.id)
                                }
                                className="hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
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

      {/* TODO: build Locations tab content — same pattern as Countries */}
      {activeTab === "Locations" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="font-semibold text-gray-700">Locations</p>
              <p className="text-sm text-gray-400 py-1">
                View and manage all locations across your countries and cities.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* TODO: navigate to Countries tab */}
              <button
                onClick={() => setActiveTab("Countries")}
                className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-[#002B6B] hover:text-white transition-colors"
              >
                + Go to Countries
              </button>
              {/* TODO: navigate to Cities tab */}
              <button
                onClick={() => setActiveTab("Cities")}
                className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-[#002B6B] hover:text-white transition-colors"
              >
                + Go to Cities
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          {/* TODO: replace values with API response from GET /api/admin/locations/stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Countries",
                value: 1,
                icon: "🌐",
                color: "text-orange-500",
              },
              { label: "Cities", value: 1, icon: "🏙️", color: "text-gray-800" },
              {
                label: "Locations",
                value: 1,
                icon: "📍",
                color: "text-green-500",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                setShowModal(true);
                setStep(1);
              }}
              className="bg-[#002B6B] hover:bg-[#003A88] text-white text-sm font-semibold px-5 py-2.5 rounded-lg tracking-wide transition-colors"
            >
              + ADD NEW LOCATION
            </button>
            {/* TODO: connect to pagination */}
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none">
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
            className="border border-gray-200 rounded-lg px-3 py-3 text-sm w-72 mb-3 outline-none focus:ring-2 focus:ring-blue-300"
          />

          {/* Table */}
          {/* TODO: replace MOCK_LOCATIONS with GET /api/admin/locations */}
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#002B6B] text-white">
                <th className="px-4 py-3 text-left font-medium">Locations</th>
                <th className="px-4 py-3 text-left font-medium">City Name</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LOCATIONS.filter((l) =>
                l.name.toLowerCase().includes(search.toLowerCase()),
              ).length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center py-8 text-gray-400">
                    No locations found
                  </td>
                </tr>
              ) : (
                MOCK_LOCATIONS.filter((l) =>
                  l.name.toLowerCase().includes(search.toLowerCase()),
                ).map((loc) => (
                  <tr
                    key={loc.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2">
                        <span className="text-red-400 font-medium">
                          {loc.name}
                        </span>
                        <button
                          onClick={() => console.log("Edit", loc.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => console.log("Delete", loc.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{loc.city}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Add New Location Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6 relative">
                {/* Close */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X size={18} />
                </button>

                <h2 className="text-lg font-bold text-orange-500 mb-5">
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
                        onChange={(e) => {
                          setSelectedCountry(e.target.value);
                          setStep(2);
                        }}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <option value="">Choose a country</option>
                        {/* TODO: replace with API GET /api/admin/countries */}
                        {MOCK_COUNTRIES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setActiveTab("Countries")}
                        className="flex items-center gap-1.5 bg-[#002B6B] hover:bg-[#003A88] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
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
                          onChange={(e) => {
                            setSelectedCity(e.target.value);
                            setStep(3);
                          }}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300"
                        >
                          <option value="">Choose a city</option>
                          {/* TODO: replace with API GET /api/admin/cities?country={selectedCountry} */}
                          {MOCK_CITIES.filter(
                            (c) => c.country === selectedCountry,
                          ).map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setActiveTab("Cities")}
                          className="flex items-center gap-1.5 bg-[#002B6B] hover:bg-[#003A88] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
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
                        placeholder="Enter location name e.g. PriyoShop HQ"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-300"
                      />
                    </div>
                  )}

                  {/* Save — only shown on step 3 */}
                  {step >= 3 && (
                    <button
                      onClick={() => {
                        if (!locationName)
                          return alert("Enter a location name.");
                        // TODO: POST /api/admin/locations { country, city, name }
                        console.log("Save location:", {
                          selectedCountry,
                          selectedCity,
                          locationName,
                        });
                        setShowModal(false);
                        setStep(1);
                        setSelectedCountry("");
                        setSelectedCity("");
                        setLocationName("");
                      }}
                      className="bg-[#002B6B] hover:bg-[#003A88] text-white text-sm font-semibold py-2.5 rounded-lg tracking-wide transition-colors"
                    >
                      SAVE LOCATION
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationPage;
