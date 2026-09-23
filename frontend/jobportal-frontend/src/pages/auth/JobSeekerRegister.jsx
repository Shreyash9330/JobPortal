import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
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
} from "react-icons/fa";

function JobSeekerRegister() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    experience: "FRESHER",
    jobPreference: "Frontend Developer",
    gender: "Male",
    password: "",
    role: "JOBSEEKER",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Required fields
    if (
      !user.name.trim() ||
      !user.email.trim() ||
      !user.phone.trim() ||
      !user.city.trim() ||
      !user.password
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all required fields.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(user.phone.trim())) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Phone Number",
        text: "Please enter a valid 10-digit phone number.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    // Password validation
    if (user.password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must contain at least 6 characters.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    // Confirm password
    if (user.password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Password and Confirm Password do not match.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    // Terms
    if (!acceptTerms) {
      Swal.fire({
        icon: "warning",
        title: "Terms Required",
        text: "Please accept the Terms & Conditions.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:8080/api/users", user);

      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your Job Seeker account has been created successfully.",
        confirmButtonColor: "#198754",
      });

      navigate("/login");
    } catch (error) {
      console.log("Job Seeker Registration Error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to create your account. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: message,
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-form">
        <h2>Create Job Seeker Account 👨‍💼</h2>

        <p className="auth-subtitle">
          Create your profile and start applying for jobs.
        </p>

        <form onSubmit={handleRegister}>
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
              autoComplete="name"
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
              name="password"
              className="form-control"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
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
              autoComplete="new-password"
            />

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Phone */}
          <div className="input-group mb-3">
            <span className="input-group-text">
              <FaPhone />
            </span>

            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Phone Number"
              value={user.phone}
              onChange={handleChange}
              maxLength="10"
            />
          </div>

          {/* City */}
          <div className="input-group mb-3">
            <span className="input-group-text">
              <FaMapMarkerAlt />
            </span>

            <input
              type="text"
              name="city"
              className="form-control"
              placeholder="City"
              value={user.city}
              onChange={handleChange}
            />
          </div>

          {/* Experience */}
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

          {/* Gender */}
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

          {/* Job Preference */}
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
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Java Developer">Java Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Software Engineer">Software Engineer</option>
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

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Create Account
                <FaArrowRight className="ms-2" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="text-center my-4">
          <span className="text-muted">──────── OR ────────</span>
        </div>

        {/* Sign In */}
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

export default JobSeekerRegister;
