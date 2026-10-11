import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "../utils/auth";
import "../styles/sitenav.css";
import Logo from "./Logo";

const DASHBOARDS = {
  ADMIN: "/admin",
  EMPLOYER: "/employer/dashboard",
  JOBSEEKER: "/jobseeker",
};

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();
  const token = auth?.token;
  const role = auth?.role || "";
  const dashboard = DASHBOARDS[role];

  const close = () => setOpen(false);
  const handleLogout = () => {
    clearAuth();
    close();
    navigate("/");
  };
  const linkClass = ({ isActive }) => "sn-link" + (isActive ? " active" : "");

  return (
    <header className="sn-wrap">
      <nav className="sn-bar" aria-label="Main">
        <Link to="/" className="sn-brand" onClick={close}>
          <Link to="/" className="sn-brand" onClick={close}>
            <Logo />
          </Link>
        </Link>

        <button
          type="button"
          className="sn-burger"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`sn-menu ${open ? "open" : ""}`}>
          <ul className="sn-links">
            <li>
              <NavLink to="/" end className={linkClass} onClick={close}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobs" className={linkClass} onClick={close}>
                Jobs
              </NavLink>
            </li>
            <li>
              <a className="sn-link" href="/#companies" onClick={close}>
                Companies
              </a>
            </li>
            {role === "JOBSEEKER" && (
              <li>
                <NavLink
                  to="/my-applications"
                  className={linkClass}
                  onClick={close}
                >
                  My Applications
                </NavLink>
              </li>
            )}
          </ul>

          <div className="sn-actions">
            {!token ? (
              <>
                <Link to="/login" className="sn-btn ghost" onClick={close}>
                  Login
                </Link>
                <Link
                  to="/register-choice"
                  className="sn-btn dark"
                  onClick={close}
                >
                  Get started <span aria-hidden="true">→</span>
                </Link>
              </>
            ) : (
              <>
                {role && <span className="sn-role">{role.toLowerCase()}</span>}
                {dashboard && (
                  <Link to={dashboard} className="sn-btn dark" onClick={close}>
                    Dashboard <span aria-hidden="true">→</span>
                  </Link>
                )}
                <button
                  type="button"
                  className="sn-btn ghost"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
