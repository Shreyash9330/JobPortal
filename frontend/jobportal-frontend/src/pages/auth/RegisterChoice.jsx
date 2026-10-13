import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import "../../styles/auth.css";
import "../../styles/dashboard.css";
import { FaUserTie, FaBriefcase, FaArrowRight } from "react-icons/fa";

function RegisterChoice() {
  return (
    <AuthLayout>
      <div className="login-form">
        <h2>Create your account</h2>
        <p className="auth-subtitle">Choose how you want to use JobPortal.</p>

        <Link to="/register/jobseeker" className="role-card">
          <span className="db-ico blue">
            <FaUserTie />
          </span>
          <div>
            <h4>I&apos;m a job seeker</h4>
            <p>Search jobs, apply with your resume and track every application.</p>
          </div>
        </Link>

        <Link to="/register/employer" className="role-card">
          <span className="db-ico teal">
            <FaBriefcase />
          </span>
          <div>
            <h4>I&apos;m an employer</h4>
            <p>Post jobs, review applicants and manage your company profile.</p>
          </div>
        </Link>

        <div className="text-center mt-4">
          Already have an account?
          <Link to="/login" className="ms-2 text-decoration-none fw-bold">
            Sign in <FaArrowRight size={11} />
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default RegisterChoice;
