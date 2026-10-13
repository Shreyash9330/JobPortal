import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaBriefcase,
  FaPlusCircle,
  FaEye,
  FaPen,
  FaTrashAlt,
} from "react-icons/fa";
import { deleteJob } from "../../services/jobservice";
import { formatSalary } from "../../components/JobListingCard";
import StatusBadge from "../../components/StatusBadge";
import "../../styles/dashboard.css";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const employerEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(
          `/api/jobs/employer/${employerEmail}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setJobs(response.data);
      } catch (err) {
        console.log("Fetch Jobs Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [employerEmail, token, reloadKey]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Job?",
      text: "This job will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteJob(id, token);

      setJobs((prev) => prev.filter((job) => job.id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Job deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log("Delete Job Error:", err);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Unable to delete the job.",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  if (loading) {
    return (
      <div className="db-page">
        <div className="db-loading">
          <div className="spinner-border text-primary" />
          <span>Loading your jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="db-page">
      <div className="db-head">
        <div>
          <div className="db-eyebrow">Employer</div>
          <h1>My jobs</h1>
          <p>Manage the jobs posted by your company.</p>
        </div>

        <div className="db-head-actions">
          <Link to="/employer/dashboard" className="btn btn-outline-primary">
            Dashboard
          </Link>
          <Link to="/employer/add-job" className="btn btn-primary">
            <FaPlusCircle className="me-2" />
            Post a job
          </Link>
        </div>
      </div>

      <div className="db-card">
        {error ? (
          <div className="db-empty">
            <span className="db-ico red">
              <FaBriefcase />
            </span>
            <h5>Couldn&apos;t load your jobs</h5>
            <p>The server may be waking up. Please try again.</p>
            <button
              className="btn btn-primary"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              Retry
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="db-empty">
            <span className="db-ico blue">
              <FaBriefcase />
            </span>
            <h5>No jobs posted yet</h5>
            <p>Start posting jobs to find the right candidates.</p>
            <Link to="/employer/add-job" className="btn btn-primary">
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="db-cell-title">
                        {job.title || "Untitled job"}
                      </div>
                      <div className="db-cell-sub">
                        {job.company || "Company not specified"}
                        {job.jobType ? ` · ${job.jobType}` : ""}
                      </div>
                    </td>
                    <td>{job.location || "Not specified"}</td>
                    <td>{formatSalary(job.salary) || "Not specified"}</td>
                    <td>
                      <StatusBadge status={job.status} fallback="ACTIVE" />
                    </td>
                    <td className="db-actions-cell">
                      <div className="db-row-actions">
                        <Link
                          to={`/employer/view-job/${job.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <FaEye /> View
                        </Link>
                        <Link
                          to={`/employer/edit-job/${job.id}`}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <FaPen /> Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(job.id)}
                        >
                          <FaTrashAlt /> Delete
                        </button>
                      </div>
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

export default MyJobs;
