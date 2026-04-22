import { Navigate, useLocation } from "react-router-dom";

function RequireAdmin({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAdmin;
