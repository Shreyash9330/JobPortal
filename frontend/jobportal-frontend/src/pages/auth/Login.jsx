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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:8080/api/login", {
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

      setMessage("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-form">
        <h2>Welcome Back 👋</h2>

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
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="input-group mb-3">
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

          {/* Remember Me + Forgot Password */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
              />

              <label className="form-check-label" htmlFor="rememberMe">
                Remember Me
              </label>
            </div>

            <Link to="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </Link>
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
              "Signing In..."
            ) : (
              <>
                Sign In
                <FaArrowRight className="ms-2" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="text-center my-4">
          <span className="text-muted">──────── OR ────────</span>
        </div>

        {/* Register */}
        <div className="text-center">
          Don't have an account?
          <Link
            to="/register-choice"
            className="ms-2 text-decoration-none fw-bold"
          >
            Create Account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
