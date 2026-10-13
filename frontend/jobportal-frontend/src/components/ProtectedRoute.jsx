import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/auth";
import Navbar from "./Navbar";

function ProtectedRoute({ role, children }) {
  const auth = getAuth();

  if (!auth) return <Navigate to="/login" replace />;

  const allowed = Array.isArray(role) ? role : [role];
  if (role && !allowed.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default ProtectedRoute;
