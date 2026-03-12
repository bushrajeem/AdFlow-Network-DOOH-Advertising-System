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
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Admin from "./pages/admin/index.jsx";
import Home from "./pages/home/Home.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  // {path: '/login', element: < **Here insert the login page link** />},

  /* example for landing page team: Admin Routes — all admin routes are handled separately */
  /* See: src/pages/admin/index.jsx */
  {
    path: "/admin",
    element: <Admin />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
