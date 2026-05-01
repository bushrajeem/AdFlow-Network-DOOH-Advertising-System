// main.jsx — Root Application Component

// PURPOSE:
//   This is the top-level component that wraps the entire application.
//   It sets up React Router and defines the global route structure.

// HOW TO USE:
//   - Add new top-level routes here (e.g. /signup, /admin)
//   - Do NOT add admin-specific routes here
//   - Do NOT add any layout/UI directly here; keep it clean

// BACKEND CONNECTION:
//   - Later, wrap this component with an AuthProvider context
//   - Protected routes (like /admin) will check auth tokens here

// TEAM NOTES:
//   - Landing Page team: work in src/pages/home/
//   - Auth team: work in src/pages/auth/
//   - Admin team: work in src/pages/admin/

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdsPage from "./pages/admin/AdsPage.jsx";
import CreateAdPage from "./pages/admin/CreateAdPage.jsx";
import CreatePlaylistPage from "./pages/admin/CreatePlaylistPage.jsx";
import CreateScreenPage from "./pages/admin/CreateScreenPage.jsx";
import Admin from "./pages/admin/index.jsx";
import CityPage from "./pages/admin/location/CityPage.jsx";
import CountryPage from "./pages/admin/location/CountryPage.jsx";
import LocationIndex from "./pages/admin/location/index.jsx";
import LocationsPage from "./pages/admin/location/LocationsPage.jsx";
import PlaylistsPage from "./pages/admin/PlaylistsPage.jsx";
import RequireAdmin from "./pages/admin/RequireAdmin.jsx";
import ScreenPage from "./pages/admin/ScreenPage.jsx";
import UsersPage from "./pages/admin/UsersPage.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import Home from "./pages/home/Home.jsx";
import PaymentCancel from "./pages/payment/PaymentCancel.jsx";
import Paymentpage from "./pages/payment/Paymentpage.jsx";
import { default as PaymentFail, default as PaymentSuccess } from "./pages/payment/PaymentSuccess.jsx";
import PlayerPage from "./pages/player/PlayerPage.jsx";



const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: '/login', element: < Login /> },
  { path: "/signup", element: <Signup /> },

  /* example for landing page team: Admin Routes — all admin routes are handled separately */
  /* See: src/pages/admin/index.jsx */


  // admin side
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <Admin />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "location", element: <LocationIndex /> },
      { path: "location/countries", element: <CountryPage /> },
      { path: "location/cities", element: <CityPage /> },
      { path: "location/locations", element: <LocationsPage /> },
      { path: "screen", element: <ScreenPage /> },
      { path: "ads", element: <AdsPage /> },
      { path: "ads/create", element: <CreateAdPage /> },
      { path: "screen/create", element: <CreateScreenPage /> },
      { path: "playlists/create", element: <CreatePlaylistPage /> },
      { path: "playlists", element: <PlaylistsPage /> },
      { path: "users", element: <UsersPage /> },
    ],
  },
  { path: "/player/:screenCode", element: <PlayerPage /> },
  { path: "/payment", element: <Paymentpage /> },
  { path: "/payment/success", element: <PaymentSuccess /> },
  { path: "/payment/fail", element: <PaymentFail /> },
  { path: "/payment/cancel", element: <PaymentCancel /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);


