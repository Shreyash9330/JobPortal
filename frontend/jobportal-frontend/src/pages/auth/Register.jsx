import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import "../../styles/auth.css";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaVenusMars,
  FaUserTie,
} from "react-icons/fa";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    experience: "FRESHER",
    jobPreference: "Frontend Developer",
    gender: "Male",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (!user.name.trim()) {
      alert("Please enter your full name");
      return;
    }

    if (!user.email.trim()) {
      alert("Please enter your email");
      return;
    }

    if (!user.password.trim()) {
      alert("Please enter your password");
      return;
    }

    if (user.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // ADD THIS HERE
    if (!acceptTerms) {
      alert("Please accept the Terms & Conditions");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/users", user);

      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  return (
    <AuthLayout>
      <div className="login-form">
        <h2>Create Account 🚀</h2>

        <p className="auth-subtitle">
          Join JobPortal and start your career journey.
        </p>

        {/* Full Name */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaUser />
          </span>

          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Full Name"
            value={user.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaEnvelope />
          </span>

          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaLock />
          </span>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="form-control"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
          />

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaLock />
          </span>

          <input
            type={showConfirmPassword ? "text" : "password"}
            className="form-control"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaPhone />
          </span>

          <input
            type="tel"
            className="form-control"
            placeholder="Phone Number"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaMapMarkerAlt />
          </span>

          <input
            type="text"
            className="form-control"
            placeholder="City"
            name="city"
            value={user.city}
            onChange={handleChange}
          />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaBriefcase />
          </span>

          <select
            className="form-select"
            name="experience"
            value={user.experience}
            onChange={handleChange}
          >
            <option value="FRESHER">Fresher</option>
            <option value="1 Year">1 Year</option>
            <option value="2 Years">2 Years</option>
            <option value="3+ Years">3+ Years</option>
          </select>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaVenusMars />
          </span>

          <select
            className="form-select"
            name="gender"
            value={user.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaBriefcase />
          </span>

          <select
            className="form-select"
            name="jobPreference"
            value={user.jobPreference}
            onChange={handleChange}
          >
            <option>Select Preference</option>
            <option>Frontend Developer</option>
            <option>Java Developer</option>
            <option>Full Stack Developer</option>
            <option>Backend Developer</option>
            <option>UI/UX Designer</option>
            <option>Software Engineer</option>
          </select>
        </div>

        {/* Role */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaUserTie />
          </span>

          <span className="input-group-text fw-semibold">Role</span>

          <select
            className="form-select"
            name="role"
            value={user.role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="JOBSEEKER">Job Seeker</option>
            <option value="EMPLOYER">Employer</option>
          </select>
        </div>

        {/* Terms */}

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />

          <label className="form-check-label" htmlFor="terms">
            I agree to the Terms & Conditions
          </label>
        </div>

        {/* Register Button */}
        <button className="btn btn-primary w-100 py-2" onClick={handleRegister}>
          Create Account
          <FaArrowRight className="ms-2" />
        </button>

        <div className="text-center my-4">
          <span className="text-muted">──────── OR ────────</span>
        </div>

        <div className="text-center">
          Already have an account?
          <Link to="/login" className="ms-2 fw-bold text-decoration-none">
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;
