import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "../utils/auth";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();
  const token = auth?.token;
  const role = auth?.role || "";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const goToDashboard = () => {
    if (role === "ADMIN") {
      navigate("/admin");
    } else if (role === "EMPLOYER") {
      navigate("/employer/dashboard");
    } else if (role === "JOBSEEKER") {
      navigate("/jobseeker");
    }
    closeMenu();
  };

  const handleLogout = () => {
    clearAuth();

    closeMenu();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-3">
      <div className="container">
        {/* Logo */}
        <Link
          className="navbar-brand fw-bold fs-2 text-primary"
          to="/"
          onClick={closeMenu}
        >
          💼 JobPortal
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar */}
        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto gap-lg-3">
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold text-primary"
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/jobs" onClick={closeMenu}>
                Jobs
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/#companies" onClick={closeMenu}>
                Companies
              </a>
            </li>
          </ul>

          {/* Auth / User Actions */}
          <div className="d-flex gap-2 mt-3 mt-lg-0">
            {!token ? (
              <>
                <Link
                  className="btn btn-outline-primary px-4"
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  className="btn btn-primary rounded-pill px-4"
                  to="/register-choice"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={goToDashboard}>
                  Dashboard
                </button>

                {role === "JOBSEEKER" && (
                  <Link
                    className="btn btn-info text-white"
                    to="/my-applications"
                    onClick={closeMenu}
                  >
                    📄 My Applications
                  </Link>
                )}

                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
