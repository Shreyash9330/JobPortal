import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { formatSalary } from "../../components/JobListingCard";
import StatusBadge from "../../components/StatusBadge";
import "../../styles/dashboard.css";

function ViewJob() {
  const { id } = useParams();

  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setJob(response.data);
      } catch (error) {
        console.log("Load Job Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const skillList = job.skills
    ? job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="db-page">
        <div className="db-loading">
          <div className="spinner-border text-primary" />
          <span>Loading job details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="db-page">
      <div className="db-form-wrap">
        <div className="db-head">
          <div>
            <div className="db-eyebrow">Job details</div>
            <h1>{job.title || "Job title not available"}</h1>
            <p>{job.company || "Company not available"}</p>
          </div>

          <div className="db-head-actions">
            <Link to="/employer/my-jobs" className="btn btn-outline-primary">
              ← My jobs
            </Link>
            <Link to={`/employer/edit-job/${job.id ?? id}`} className="btn btn-primary">
              <FaPen className="me-2" />
              Edit job
            </Link>
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-head">
            <h3>Overview</h3>
            <StatusBadge status={job.status} fallback="ACTIVE" />
          </div>

          <div className="db-detail-grid">
            <div className="db-detail">
              <small>Location</small>
              <strong>{job.location || "Not specified"}</strong>
            </div>
            <div className="db-detail">
              <small>Salary</small>
              <strong>{formatSalary(job.salary) || "Not specified"}</strong>
            </div>
            <div className="db-detail">
              <small>Experience</small>
              <strong>{job.experience || "Not specified"}</strong>
            </div>
            <div className="db-detail">
              <small>Job type</small>
              <strong>{job.jobType || "Not specified"}</strong>
            </div>
          </div>

          <div className="db-section">
            <h4>Skills required</h4>
            {skillList.length > 0 ? (
              <div className="db-chips">
                {skillList.map((skill) => (
                  <span key={skill} className="db-chip">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="db-cell-sub mb-0">No specific skills listed.</p>
            )}
          </div>

          <div className="db-section">
            <h4>Job description</h4>
            {job.description ? (
              <p className="db-desc">{job.description}</p>
            ) : (
              <p className="db-cell-sub mb-0">No description available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewJob;
