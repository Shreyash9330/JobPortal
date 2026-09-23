import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let decoded;

  try {
    decoded = jwtDecode(token);
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    return <Navigate to="/login" replace />;
  }

  // Support single role or multiple roles
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(decoded.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
