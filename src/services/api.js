/**
 * api.js — All backend API calls live here.
 * Base URL switches automatically between development and production.
 * NEVER scatter fetch() calls inside components — always use this file.
 */

const BASE_URL = "http://localhost:5000/api";

// Helper function to make API requests and handle errors in one place
async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Something went wrong.");
  }

  return res.json();
}

// Dashboard
export const getDashboardStats = () => request("/dashboard/stats");

// Ads
export const getAds = () => request("/ads");
export const createAd = (data) =>
  request("/ads", {
    method: "POST",
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
export const deleteAd = (id) => request(`/ads/${id}`, { method: "DELETE" });

// Locations
export const getLocationsByType = (type) => request(`/locations/type/${type}`);
export const getLocations = () => request("/locations");
export const createLocation = (data) =>
  request("/locations", { method: "POST", body: JSON.stringify(data) });
export const deleteLocation = (id) =>
  request(`/locations/${id}`, { method: "DELETE" });

// Playlists
export const getPlaylists = () => request("/playlists");
export const createPlaylist = (data) =>
  request("/playlists", { method: "POST", body: JSON.stringify(data) });
export const updatePlaylist = (id, data) =>
  request(`/playlists/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deletePlaylist = (id) =>
  request(`/playlists/${id}`, { method: "DELETE" });

// Screens
export const getScreens = () => request("/screens");
export const getScreen = (id) => request(`/screens/${id}`);
export const createScreen = (data) =>
  request("/screens", { method: "POST", body: JSON.stringify(data) });
export const updateScreen = (id, data) =>
  request(`/screens/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteScreen = (id) =>
  request(`/screens/${id}`, { method: "DELETE" });
