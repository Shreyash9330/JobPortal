import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/employerDashboard.css";

function EmployerDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [jobsResponse, applicationsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/jobs/employer/${email}`, {
            headers,
          }),
          axios.get(
            `http://localhost:8080/api/applications/employer/${email}`,
            { headers },
          ),
        ]);

        setJobs(jobsResponse.data);
        setApplications(applicationsResponse.data);
      } catch (error) {
        console.log("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (email && token) {
      loadDashboard();
    } else {
      navigate("/login");
    }
  }, [email, token, navigate]);

  const activeJobs = jobs.filter(
    (job) => job.status && job.status.toUpperCase() === "ACTIVE",
  ).length;

  const recentJobs = [...jobs].sort((a, b) => b.id - a.id).slice(0, 5);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-container text-center py-5">
        <div className="spinner-border text-primary mb-3"></div>
        <h5>Loading Dashboard...</h5>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>🏢 Employer Dashboard</h2>
          <p>
            Welcome back, <strong>{email}</strong> 👋
          </p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{jobs.length}</h3>
          <p>Total Jobs</p>
        </div>

        <div className="stat-card">
          <h3>{activeJobs}</h3>
          <p>Active Jobs</p>
        </div>

        <div className="stat-card">
          <h3>{applications.length}</h3>
          <p>Applications</p>
        </div>

        <div className="stat-card">
          <h3>N/A</h3>
          <p>Company Rating</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="section-title">Quick Actions</h3>

      <div className="action-grid">
        <Link to="/employer/add-job" className="action-card">
          ➕ Post New Job
        </Link>

        <Link to="/employer/my-jobs" className="action-card">
          📋 My Jobs
        </Link>

        <Link to="/employer/applications" className="action-card">
          📄 Applications
        </Link>

        <Link to="/employer/profile" className="action-card">
          🏢 Company Profile
        </Link>
      </div>

      {/* Recent Jobs */}
      <div className="dashboard-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Recent Jobs</h3>

          <Link
            to="/employer/my-jobs"
            className="btn btn-outline-primary btn-sm"
          >
            View All
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-4">
            <h5>No Jobs Posted Yet</h5>
            <p className="text-muted">Start by posting your first job.</p>

            <Link to="/employer/add-job" className="btn btn-primary">
              Post New Job
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Job Type</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.location || "Not specified"}</td>
                    <td>{job.jobType || "Not specified"}</td>
                    <td>
                      <span
                        className={
                          job.status?.toUpperCase() === "ACTIVE"
                            ? "badge bg-success"
                            : "badge bg-secondary"
                        }
                      >
                        {job.status || "Open"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;
