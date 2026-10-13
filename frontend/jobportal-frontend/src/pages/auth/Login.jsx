import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AuthLayout from "../../components/AuthLayout";
import "../../styles/auth.css";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";

const DEMO_PASSWORD = "Demo@1234";
const DEMO_ACCOUNTS = [
  { label: "Job Seeker", email: "seeker@jobportal.com" },
  { label: "Employer", email: "employer@jobportal.com" },
  { label: "Admin", email: "admin@jobportal.com" },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(DEMO_PASSWORD);
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/login", {
        email: email.trim(),
        password: password,
      });

      // Save login data
      localStorage.setItem("token", response.data);
      localStorage.setItem("email", email.trim());

      const decoded = jwtDecode(response.data);

      setMessage("Login Successful! Redirecting...");

      setTimeout(() => {
        if (decoded.role === "ADMIN") {
          navigate("/admin");
        } else if (decoded.role === "EMPLOYER") {
          navigate("/employer/dashboard");
        } else {
          navigate("/jobseeker");
        }
      }, 500);
    } catch (error) {
      console.log("Login Error:", error);

      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        setMessage("Invalid Email or Password");
      } else {
        setMessage(
          "Server is waking up or unreachable. Please wait a few seconds and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-form">
        <h2>Welcome back</h2>

        <p className="auth-subtitle">Login to continue your career journey.</p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="input-group mb-3">
            <span className="input-group-text">
              <FaEnvelope />
            </span>

            <input
              type="email"
              className="form-control"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="input-group mb-2">
            <span className="input-group-text">
              <FaLock />
            </span>

            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="auth-forgot">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`alert ${
                message.includes("Invalid") || message.includes("Please")
                  ? "alert-danger"
                  : "alert-success"
              }`}
            >
              {message}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign in
                <FaArrowRight className="ms-2" />
              </>
            )}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="demo-box">
          <div className="demo-title">Try the live demo</div>
          <div className="demo-chips">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                type="button"
                className="demo-chip"
                key={account.email}
                onClick={() => fillDemo(account)}
              >
                {account.label}
              </button>
            ))}
          </div>
          <small>Click a role to fill the form, then press Sign in.</small>
        </div>

        <div className="auth-divider">
          <span>or</span>
        </div>

        {/* Register */}
        <div className="text-center">
          Don&apos;t have an account?
          <Link
            to="/register-choice"
            className="ms-2 text-decoration-none fw-bold"
          >
            Create account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
