import { Link } from "react-router-dom";
import Logo from "./Logo";
import "../styles/auth.css";

const POINTS = [
  "Apply in one click with your PDF resume",
  "Separate dashboards for seekers, employers and admins",
  "Secure JWT login with OTP password reset",
  "Track every application in one place",
];

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side */}
        <div className="auth-left">
          <Link to="/" className="auth-brand">
            <Logo light size={38} />
          </Link>

          <h2>Build your career with confidence</h2>
          <p>
            Search openings, apply in seconds and keep track of every
            application.
          </p>

          <ul className="auth-features">
            {POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Right Side */}
        <div className="auth-right">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
