import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import Home from './pages/home/Home.jsx'

const router = createBrowserRouter([
  {path: '/', element: <Home />},
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
