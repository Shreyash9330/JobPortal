import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import "../../styles/auth.css";
import { FaUserTie, FaBriefcase } from "react-icons/fa";

function RegisterChoice() {
  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="mb-3">Create Your Account 🚀</h2>

        <p className="text-muted mb-4">Choose how you want to use JobPortal.</p>

        {/* Job Seeker Card */}
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body">
            <FaUserTie size={45} className="text-primary mb-3" />

            <h4>Job Seeker</h4>

            <p className="text-muted">
              Search jobs, apply instantly and build your career.
            </p>

            <Link to="/register/jobseeker" className="btn btn-primary w-100">
              Continue as Job Seeker
            </Link>
          </div>
        </div>

        {/* Employer Card */}
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <FaBriefcase size={45} className="text-success mb-3" />

            <h4>Employer</h4>

            <p className="text-muted">
              Post jobs and hire talented professionals.
            </p>

            <Link to="/register/employer" className="btn btn-success w-100">
              Continue as Employer
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default RegisterChoice;
