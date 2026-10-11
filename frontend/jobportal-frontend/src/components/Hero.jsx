import { Link } from "react-router-dom";
import { getAuth } from "../utils/auth";
import "../styles/home.css";

const DASHBOARDS = {
  ADMIN: "/admin",
  EMPLOYER: "/employer/dashboard",
  JOBSEEKER: "/jobseeker",
};

function Hero() {
  const auth = getAuth();
  const dashboard = auth?.token ? DASHBOARDS[auth?.role] : null;

  return (
    <section className="hm-hero">
      <div className="hm-container hm-hero-grid">
        <div className="hm-hero-copy">
          <span className="hm-pill">
            <span className="hm-dot" /> Live demo · Spring Boot + React
          </span>

          <h1>
            Find the role that fits <span>your skills.</span>
          </h1>

          <p>
            Search openings, apply with your resume in seconds, and track every
            application from one clean dashboard.
          </p>

          <div className="hm-cta">
            <Link to="/jobs" className="hm-btn primary">
              Browse jobs
            </Link>
            {dashboard ? (
              <Link to={dashboard} className="hm-btn ghost">
                Go to dashboard
              </Link>
            ) : (
              <Link to="/register-choice" className="hm-btn ghost">
                Create free account
              </Link>
            )}
          </div>

          <ul className="hm-trust">
            <li>One-click apply</li>
            <li>Role-based dashboards</li>
            <li>Secure JWT login</li>
          </ul>
        </div>

        <div className="hm-visual" aria-hidden="true">
          <div className="hm-vcard a">
            <div className="hm-vrow">
              <div className="hm-vavatar">T</div>
              <div>
                <strong>Java Backend Developer</strong>
                <small>TechNova Solutions · Pune</small>
              </div>
            </div>
            <div className="hm-vchips">
              <span>Java</span>
              <span>Spring Boot</span>
              <span>MySQL</span>
            </div>
            <div className="hm-vmeta">₹5,00,000 / yr · Full Time</div>
          </div>

          <div className="hm-vcard b">
            <div className="hm-vrow">
              <div className="hm-vcheck">✓</div>
              <div>
                <strong>Application submitted</strong>
                <small>React Frontend Developer</small>
              </div>
            </div>
          </div>

          <div className="hm-vcard c">
            <small className="hm-vlabel">Resume</small>
            <strong>my_resume.pdf</strong>
            <div className="hm-vbar">
              <span />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
