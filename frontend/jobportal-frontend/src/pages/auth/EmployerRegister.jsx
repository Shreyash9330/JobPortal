import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import "../../styles/auth.css";
import axios from "axios";
import Swal from "sweetalert2";

import {
  FaBuilding,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaIndustry,
  FaUsers,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";

function EmployerRegister() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [employer, setEmployer] = useState({
    companyName: "",
    hrName: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    companySize: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmployer({
      ...employer,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    // Required fields validation
    if (
      !employer.companyName.trim() ||
      !employer.hrName.trim() ||
      !employer.email.trim() ||
      !employer.phone.trim() ||
      !employer.industry ||
      !employer.companySize ||
      !employer.password
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all required fields.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    // Password validation
    if (employer.password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Password and Confirm Password do not match.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    // Terms validation
    if (!acceptTerms) {
      Swal.fire({
        icon: "warning",
        title: "Terms Required",
        text: "Please accept the Terms & Conditions.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8080/api/auth/register/employer",
        employer,
      );

      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your employer account has been created successfully.",
        confirmButtonColor: "#198754",
      });

      navigate("/login");
    } catch (error) {
      console.log("Employer Registration Error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to create employer account. Please try again.";

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
        <h2>Create Employer Account 🏢</h2>

        <p className="auth-subtitle">
          Register your company and start hiring talented professionals.
        </p>

        {/* Company Name */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaBuilding />
          </span>

          <input
            type="text"
            className="form-control"
            placeholder="Company Name"
            name="companyName"
            value={employer.companyName}
            onChange={handleChange}
          />
        </div>

        {/* HR Name */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaUserTie />
          </span>

          <input
            type="text"
            className="form-control"
            placeholder="HR / Recruiter Name"
            name="hrName"
            value={employer.hrName}
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
            className="form-control"
            placeholder="Official Company Email"
            name="email"
            value={employer.email}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaPhone />
          </span>

          <input
            type="tel"
            className="form-control"
            placeholder="Phone Number"
            name="phone"
            value={employer.phone}
            onChange={handleChange}
          />
        </div>

        {/* Website */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaGlobe />
          </span>

          <input
            type="url"
            className="form-control"
            placeholder="Company Website"
            name="website"
            value={employer.website}
            onChange={handleChange}
          />
        </div>

        {/* Industry */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaIndustry />
          </span>

          <select
            className="form-select"
            name="industry"
            value={employer.industry}
            onChange={handleChange}
          >
            <option value="">Select Industry</option>
            <option value="Software">Software</option>
            <option value="Banking">Banking</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="E-Commerce">E-Commerce</option>
            <option value="Manufacturing">Manufacturing</option>
          </select>
        </div>

        {/* Company Size */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaUsers />
          </span>

          <select
            className="form-select"
            name="companySize"
            value={employer.companySize}
            onChange={handleChange}
          >
            <option value="">Select Company Size</option>
            <option value="1-10">1 - 10</option>
            <option value="11-50">11 - 50</option>
            <option value="51-200">51 - 200</option>
            <option value="201-1000">201 - 1000</option>
            <option value="1000+">1000+</option>
          </select>
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
            name="password"
            value={employer.password}
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

        {/* Terms */}
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />

          <label className="form-check-label">
            I agree to the Terms & Conditions
          </label>
        </div>

        {/* Submit */}
        <button
          type="button"
          className="btn btn-success w-100 py-2"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? (
            "Creating Account..."
          ) : (
            <>
              Create Employer Account
              <FaArrowRight className="ms-2" />
            </>
          )}
        </button>

        {/* Sign In */}
        <div className="text-center mt-4">
          Already have an account?
          <Link to="/login" className="ms-2">
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default EmployerRegister;
