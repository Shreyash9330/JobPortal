import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBriefcase,
  FaCheckCircle,
  FaInbox,
  FaHourglassHalf,
  FaPlusCircle,
  FaClipboardList,
  FaBuilding,
  FaArrowRight,
} from "react-icons/fa";
import StatusBadge from "../../components/StatusBadge";
import "../../styles/dashboard.css";

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
        const headers = { Authorization: `Bearer ${token}` };

        const [jobsResponse, applicationsResponse] = await Promise.all([
          axios.get(`/api/jobs/employer/${email}`, { headers }),
          axios.get(`/api/applications/employer/${email}`, { headers }),
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

  const pending = applications.filter(
    (a) => (a.status || "APPLIED").toUpperCase() === "APPLIED",
  ).length;

  const recentJobs = [...jobs].sort((a, b) => b.id - a.id).slice(0, 5);

  const stats = [
    {
      icon: <FaBriefcase />,
      tone: "blue",
      value: jobs.length,
      label: "Total jobs",
    },
    {
      icon: <FaCheckCircle />,
      tone: "green",
      value: activeJobs,
      label: "Active jobs",
    },
    {
      icon: <FaInbox />,
      tone: "teal",
      value: applications.length,
      label: "Applications",
    },
    {
      icon: <FaHourglassHalf />,
      tone: "amber",
      value: pending,
      label: "Pending review",
    },
  ];

  const actions = [
    {
      to: "/employer/add-job",
      icon: <FaPlusCircle />,
      tone: "blue",
      title: "Post a new job",
      text: "Create an opening in a minute.",
    },
    {
      to: "/employer/my-jobs",
      icon: <FaClipboardList />,
      tone: "teal",
      title: "My jobs",
      text: "Edit or remove your listings.",
    },
    {
      to: "/employer/applications",
      icon: <FaInbox />,
      tone: "amber",
      title: "Applications",
      text: "Review candidates and resumes.",
    },
    {
      to: "/employer/profile",
      icon: <FaBuilding />,
      tone: "green",
      title: "Company profile",
      text: "Keep your company details fresh.",
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
          <div className="db-eyebrow">Employer</div>
          <h1>Employer dashboard</h1>
          <p>
            Signed in as <strong>{email}</strong>
          </p>
        </div>

        <div className="db-head-actions">
          <Link to="/employer/add-job" className="btn btn-primary">
            <FaPlusCircle className="me-2" />
            Post a job
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

      <h3 className="db-title">Quick actions</h3>
      <div className="db-actions">
        {actions.map((a) => (
          <Link to={a.to} className="db-action" key={a.to}>
            <span className={`db-ico ${a.tone}`}>{a.icon}</span>
            <div>
              <h4>{a.title}</h4>
              <p>{a.text}</p>
            </div>
            <FaArrowRight className="db-go" />
          </Link>
        ))}
      </div>

      <div className="db-card">
        <div className="db-card-head">
          <h3>Recent jobs</h3>
          <Link
            to="/employer/my-jobs"
            className="btn btn-outline-primary btn-sm"
          >
            View all
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="db-empty">
            <span className="db-ico blue">
              <FaBriefcase />
            </span>
            <h5>No jobs posted yet</h5>
            <p>Start by posting your first job.</p>
            <Link to="/employer/add-job" className="btn btn-primary">
              Post a job
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Job title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="db-cell-title">{job.title}</td>
                    <td>{job.location || "Not specified"}</td>
                    <td>{job.jobType || "Not specified"}</td>
                    <td>
                      <StatusBadge status={job.status} fallback="OPEN" />
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
