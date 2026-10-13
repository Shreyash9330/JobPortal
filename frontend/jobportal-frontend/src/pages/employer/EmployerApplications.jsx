import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaInbox, FaCheck, FaTimes } from "react-icons/fa";
import StatusBadge from "../../components/StatusBadge";
import "../../styles/dashboard.css";

const FILTERS = ["ALL", "APPLIED", "APPROVED", "REJECTED"];

function EmployerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [reloadKey, setReloadKey] = useState(0);

  const employerEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(
          `/api/applications/employer/${employerEmail}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setApplications(response.data);
      } catch (err) {
        console.log("Applications Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [employerEmail, token, reloadKey]);

  const updateStatus = async (id, status) => {
    const approve = status === "APPROVED";

    const result = await Swal.fire({
      title: `${approve ? "Approve" : "Reject"} application?`,
      text: `Are you sure you want to ${approve ? "approve" : "reject"} this application?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: approve ? "#198754" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: approve ? "Yes, Approve" : "Yes, Reject",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.put(
        `/api/applications/${id}/status?status=${status}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: response.data.status } : app,
        ),
      );

      Swal.fire({
        icon: "success",
        title: "Status updated",
        text: approve
          ? "Application approved successfully."
          : "Application rejected successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log("Update Status Error:", err);

      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Unable to update application status.",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const statusOf = (a) => (a.status || "APPLIED").toUpperCase();

  const countFor = (f) =>
    f === "ALL"
      ? applications.length
      : applications.filter((a) => statusOf(a) === f).length;

  const visible = [...applications]
    .sort((a, b) => b.id - a.id)
    .filter((a) => filter === "ALL" || statusOf(a) === filter);

  if (loading) {
    return (
      <div className="db-page">
        <div className="db-loading">
          <div className="spinner-border text-primary" />
          <span>Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="db-page">
      <div className="db-head">
        <div>
          <div className="db-eyebrow">Employer</div>
          <h1>Applications received</h1>
          <p>Review and manage applications for your jobs.</p>
        </div>

        <div className="db-head-actions">
          <Link to="/employer/dashboard" className="btn btn-outline-primary">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="db-card">
        {error ? (
          <div className="db-empty">
            <span className="db-ico red">
              <FaInbox />
            </span>
            <h5>Couldn&apos;t load applications</h5>
            <p>The server may be waking up. Please try again.</p>
            <button
              className="btn btn-primary"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              Retry
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className="db-empty">
            <span className="db-ico blue">
              <FaInbox />
            </span>
            <h5>No applications yet</h5>
            <p>You haven&apos;t received any applications yet.</p>
            <Link to="/employer/add-job" className="btn btn-primary">
              Post a job
            </Link>
          </div>
        ) : (
          <>
            <div className="db-tabs">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`db-tab ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "ALL" ? "All" : f[0] + f.slice(1).toLowerCase()} (
                  {countFor(f)})
                </button>
              ))}
            </div>

            <div className="table-responsive">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Applicant</th>
                    <th>Status</th>
                    <th>Resume</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visible.map((app) => {
                    const status = statusOf(app);

                    return (
                      <tr key={app.id}>
                        <td className="db-cell-title">
                          {app.jobTitle || "Job title not available"}
                        </td>
                        <td>{app.userEmail || "Not available"}</td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                        <td>
                          {app.resumePath ? (
                            <a
                              href={`${API_URL}/api/applications/resume/${app.resumePath}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-primary btn-sm"
                            >
                              View resume
                            </a>
                          ) : (
                            <span className="db-cell-sub">Not available</span>
                          )}
                        </td>
                        <td className="db-actions-cell">
                          <div className="db-row-actions">
                            <button
                              className="btn btn-success btn-sm"
                              disabled={status === "APPROVED"}
                              onClick={() => updateStatus(app.id, "APPROVED")}
                            >
                              <FaCheck /> Approve
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              disabled={status === "REJECTED"}
                              onClick={() => updateStatus(app.id, "REJECTED")}
                            >
                              <FaTimes /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {visible.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center db-cell-sub py-4">
                        No applications in this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmployerApplications;
