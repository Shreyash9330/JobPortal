import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaFileAlt, FaSearch } from "react-icons/fa";
import StatusBadge from "../../components/StatusBadge";
import "../../styles/dashboard.css";

const FILTERS = ["ALL", "APPLIED", "APPROVED", "REJECTED"];

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [reloadKey, setReloadKey] = useState(0);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get(`/api/applications/user/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApplications(response.data);
      } catch (err) {
        console.log("Applications Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [email, token, reloadKey]);

  const statusOf = (a) => (a.status || "APPLIED").toUpperCase();

  const visible = [...applications]
    .sort((a, b) => b.id - a.id)
    .filter((a) => filter === "ALL" || statusOf(a) === filter);

  const countFor = (f) =>
    f === "ALL"
      ? applications.length
      : applications.filter((a) => statusOf(a) === f).length;

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
          <div className="db-eyebrow">Job seeker</div>
          <h1>My applications</h1>
          <p>Track the status of every job you applied to.</p>
        </div>

        <div className="db-head-actions">
          <Link to="/jobs" className="btn btn-primary">
            <FaSearch className="me-2" />
            Browse jobs
          </Link>
          <Link to="/jobseeker" className="btn btn-outline-primary">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="db-card">
        {error ? (
          <div className="db-empty">
            <span className="db-ico red">
              <FaFileAlt />
            </span>
            <h5>Couldn&apos;t load your applications</h5>
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
              <FaFileAlt />
            </span>
            <h5>No applications found</h5>
            <p>You haven&apos;t applied for any jobs yet.</p>
            <Link to="/jobs" className="btn btn-primary">
              Browse jobs
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
                    <th>#</th>
                    <th>Job</th>
                    <th>Status</th>
                    <th>Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((app) => (
                    <tr key={app.id}>
                      <td className="db-cell-sub">{app.id}</td>
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

                  {visible.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center db-cell-sub py-4">
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

export default MyApplications;
