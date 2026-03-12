// main.jsx — Root Application Component
 
// PURPOSE:
//   This is the top-level component that wraps the entire application.
//   It sets up React Router and defines the global route structure.
 
// HOW TO USE:
//   - Add new top-level routes here (e.g. /signup, /admin)
//   - Do NOT add admin-specific routes here; those live in routes/AdminRoutes.jsx
//   - Do NOT add any layout/UI directly here; keep it clean
 
// BACKEND CONNECTION:
//   - Later, wrap this component with an AuthProvider context
//   - Protected routes (like /admin) will check auth tokens here
 
// TEAM NOTES:
//   - Landing Page team: work in src/pages/home/
//   - Auth team: work in src/pages/auth/
//   - Admin team: work in src/pages/admin/



import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import Home from './pages/home/Home.jsx'

const router = createBrowserRouter([
  {path: '/', element: <Home />},
  // {path: '/login', element: < **Here insert the login page link** />},
  
  
  /* Admin Routes — all admin routes are handled separately */
  /* See: src/routes/AdminRoutes.jsx */
  {
    path: '/admin',
    element: <AdminDashboardPage />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
