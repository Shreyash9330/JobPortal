import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaFileAlt,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import StatusBadge from "../../components/StatusBadge";
import "../../styles/dashboard.css";

function JobSeekerDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        if (!email || !token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`/api/applications/user/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApplications(response.data);
      } catch (error) {
        console.log("Applications Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [email, token, navigate]);

  const countBy = (s) =>
    applications.filter((a) => (a.status || "APPLIED").toUpperCase() === s)
      .length;

  const recent = [...applications].sort((a, b) => b.id - a.id).slice(0, 5);
  const name = email ? email.split("@")[0] : "there";

  const stats = [
    {
      icon: <FaFileAlt />,
      tone: "blue",
      value: applications.length,
      label: "Total applications",
    },
    {
      icon: <FaHourglassHalf />,
      tone: "amber",
      value: countBy("APPLIED"),
      label: "Under review",
    },
    {
      icon: <FaCheckCircle />,
      tone: "green",
      value: countBy("APPROVED"),
      label: "Approved",
    },
    {
      icon: <FaTimesCircle />,
      tone: "red",
      value: countBy("REJECTED"),
      label: "Rejected",
    },
  ];

  if (loading) {
    return (
      <div className="db-page">
        <div className="db-loading">
          <div className="spinner-border text-primary" />
          <span>Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="db-page">
      <div className="db-head">
        <div>
          <div className="db-eyebrow">Job seeker</div>
          <h1>Welcome back, {name}</h1>
          <p>Track your applications and find your next role.</p>
        </div>

        <div className="db-head-actions">
          <Link to="/jobs" className="btn btn-primary">
            <FaSearch className="me-2" />
            Browse jobs
          </Link>
          <Link to="/my-applications" className="btn btn-outline-primary">
            My applications
          </Link>
        </div>
      </div>

      <div className="db-stats">
        {stats.map((s) => (
          <div className="db-stat" key={s.label}>
            <span className={`db-ico ${s.tone}`}>{s.icon}</span>
            <div>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="db-card">
        <div className="db-card-head">
          <h3>Recent applications</h3>
          <Link
            to="/my-applications"
            className="btn btn-outline-primary btn-sm"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="db-empty">
            <span className="db-ico blue">
              <FaFileAlt />
            </span>
            <h5>No applications yet</h5>
            <p>Apply to a job and it will show up here.</p>
            <Link to="/jobs" className="btn btn-primary">
              Browse jobs <FaArrowRight className="ms-2" />
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Status</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((app) => (
                  <tr key={app.id}>
                    <td className="db-cell-title">
                      {app.jobTitle || "Job title not available"}
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>
                      {app.resumePath ? (
                        <a
                          href={`${API_URL}/api/applications/resume/${app.resumePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          View resume
                        </a>
                      ) : (
                        <span className="db-cell-sub">Not available</span>
                      )}
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

export default JobSeekerDashboard;
