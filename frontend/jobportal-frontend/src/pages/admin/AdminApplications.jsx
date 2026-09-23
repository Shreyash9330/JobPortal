import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function AdminApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/applications",
      );

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

  const getStatusBadge = (status) => {
    if (status === "APPROVED") {
      return <span className="badge bg-success">Approved</span>;
    }

    if (status === "REJECTED") {
      return <span className="badge bg-danger">Rejected</span>;
    }

    if (status === "SHORTLISTED") {
      return <span className="badge bg-info text-dark">Shortlisted</span>;
    }

    if (status === "SELECTED") {
      return <span className="badge bg-primary">Selected</span>;
    }

    return <span className="badge bg-warning text-dark">Applied</span>;
  };

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <p className="text-primary fw-semibold mb-1">📄 Administration</p>

          <h2 className="fw-bold mb-1">Manage Applications</h2>

          <p className="text-muted mb-0">
            Review applications submitted by job seekers.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/admin")}
        >
          ← Dashboard
        </button>
      </div>

      {/* Applications Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="px-4">ID</th>
                  <th>Job Title</th>
                  <th>Applicant Email</th>
                  <th>Status</th>
                  <th>Resume</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="spinner-border text-primary"></div>

                      <p className="text-muted mt-2 mb-0">
                        Loading applications...
                      </p>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-4 fw-semibold">{app.id}</td>

                      <td>{app.jobTitle || "—"}</td>

                      <td>{app.userEmail}</td>

                      <td>{getStatusBadge(app.status)}</td>

                      <td>
                        {app.resumePath ? (
                          <a
                            href={`http://localhost:8080/api/applications/resume/${app.resumePath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-primary btn-sm"
                          >
                            📄 View Resume
                          </a>
                        ) : (
                          <span className="text-muted">No Resume</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-muted mt-3">
          Total Applications: <strong>{applications.length}</strong>
        </p>
      )}
    </div>
  );
}

export default AdminApplications;
