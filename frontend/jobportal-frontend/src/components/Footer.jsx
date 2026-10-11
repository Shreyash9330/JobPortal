import { Link } from "react-router-dom";
import Logo from "./Logo";
import "../styles/home.css";

function Footer() {
  return (
    <footer className="hm-footer">
      <div className="hm-container hm-footer-grid">
        <div>
          <Logo light />
          <p className="hm-footer-about">
            A full-stack job portal built with Spring Boot, React and MySQL.
          </p>
        </div>

        <div>
          <h4>Product</h4>
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <a href="/#companies">Companies</a>
        </div>

        <div>
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register-choice">Register</Link>
        </div>

        <div>
          <h4>Project</h4>
          <a
            href="https://github.com/Shreyash9330/JobPortal"
            target="_blank"
            rel="noreferrer"
          >
            GitHub repository
          </a>
          <a
            href="https://jobportal-neqm.onrender.com/swagger-ui.html"
            target="_blank"
            rel="noreferrer"
          >
            API docs (Swagger)
          </a>
          <a
            href="https://www.linkedin.com/in/shreyash-gawande9330"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <div className="hm-container hm-footer-bottom">
        © {new Date().getFullYear()} JobPortal · Built by Shreyash, Pune
      </div>
    </footer>
  );
}

export default Footer;
