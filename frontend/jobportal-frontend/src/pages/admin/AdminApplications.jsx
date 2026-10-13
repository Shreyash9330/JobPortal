import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUserShield, FaSearch } from "react-icons/fa";
import StatusBadge from "../../components/StatusBadge";
import "../../styles/dashboard.css";

const FILTERS = ["ALL", "APPLIED", "APPROVED", "REJECTED"];

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("/api/applications");
        setApplications(response.data);
      } catch (error) {
        console.log("Applications Error:", error);

        Swal.fire({
          icon: "error",
          title: "Failed to Load",
          text: "Unable to fetch applications.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const statusOf = (a) => (a.status || "APPLIED").toUpperCase();

  const countFor = (f) =>
    f === "ALL"
      ? applications.length
      : applications.filter((a) => statusOf(a) === f).length;

  const q = query.trim().toLowerCase();
  const visible = [...applications]
    .sort((a, b) => b.id - a.id)
    .filter((a) => filter === "ALL" || statusOf(a) === filter)
    .filter(
      (a) =>
        !q ||
        (a.jobTitle || "").toLowerCase().includes(q) ||
        (a.userEmail || "").toLowerCase().includes(q),
    );

  return (
    <div className="db-page">
      <div className="db-head">
        <div>
          <div className="db-eyebrow">
            <FaUserShield /> Administration
          </div>
          <h1>Manage applications</h1>
          <p>Review applications submitted by job seekers.</p>
        </div>

        <div className="db-head-actions">
          <Link to="/admin" className="btn btn-outline-primary">
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="db-card">
        <div className="db-toolbar">
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

          <div className="db-search">
            <FaSearch />
            <input
              type="text"
              className="form-control"
              placeholder="Search job or applicant"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search applications"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="db-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Job</th>
                <th>Applicant</th>
                <th>Status</th>
                <th>Resume</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="spinner-border text-primary" />
                    <p className="db-cell-sub mt-2 mb-0">
                      Loading applications...
                    </p>
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 db-cell-sub">
                    No applications found.
                  </td>
                </tr>
              ) : (
                visible.map((app) => (
                  <tr key={app.id}>
                    <td className="db-cell-sub">{app.id}</td>
                    <td className="db-cell-title">{app.jobTitle || "—"}</td>
                    <td>{app.userEmail}</td>
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
                        <span className="db-cell-sub">No resume</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="db-foot">
            Showing {visible.length} of {applications.length} applications
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminApplications;
