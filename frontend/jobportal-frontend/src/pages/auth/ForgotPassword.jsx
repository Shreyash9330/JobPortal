import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      await axios.post("/api/auth/forgot-password", { email });
      setStep(2);
      setMsg({
        type: "success",
        text: "If this email is registered, an OTP has been sent. It is valid for 10 minutes.",
      });
    } catch {
      setMsg({
        type: "danger",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      await axios.post("/api/auth/reset-password", { email, otp, newPassword });
      setMsg({
        type: "success",
        text: "Password updated. Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg({
        type: "danger",
        text:
          err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          "Invalid or expired OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: 420 }}>
        <h4 className="mb-1">Forgot Password</h4>
        <p className="text-muted small">
          {step === 1
            ? "Enter your registered email to get an OTP."
            : "Enter the OTP and your new password."}
        </p>

        {msg.text && (
          <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>
        )}

        {step === 1 ? (
          <form onSubmit={sendOtp}>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="form-control mb-3"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="New password (min 8 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
            <button
              type="button"
              className="btn btn-link w-100 mt-2"
              onClick={() => setStep(1)}
            >
              Use a different email
            </button>
          </form>
        )}

        <div className="text-center mt-3">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
