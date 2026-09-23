import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand">
              <h3>
                <FaBriefcase className="me-2" />
                JobPortal
              </h3>

              <p>
                A full-stack job portal for job seekers and employers to search,
                post, and manage job opportunities.
              </p>

              <div className="footer-social">
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>

                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5>Quick Links</h5>

            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/jobs">Jobs</Link>
              </li>

              <li>
                <a href="/#companies">Companies</a>
              </li>

              <li>
                <Link to="/login">Login</Link>
              </li>

              <li>
                <Link to="/register-choice">Register</Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div className="col-lg-2 col-md-6">
            <h5>For Users</h5>

            <ul className="footer-links">
              <li>
                <Link to="/jobs">Browse Jobs</Link>
              </li>

              <li>
                <Link to="/my-applications">My Applications</Link>
              </li>

              <li>
                <Link to="/jobseeker">Job Seeker Dashboard</Link>
              </li>

              <li>
                <Link to="/employer/dashboard">Employer Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <h5>Contact</h5>

            <div className="footer-contact">
              <p>
                <FaMapMarkerAlt />
                Pune, Maharashtra, India
              </p>

              <p>
                <FaEnvelope />
                support@jobportal.com
              </p>

              <p>
                <FaPhoneAlt />
                +91 98765 43210
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>

          <p>Built with React & Spring Boot</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
