import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/applications/user/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApplications(response.data);
    } catch (error) {
      console.log("Applications Error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Applications",
        text: "Something went wrong while loading your applications.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBadge = (status) => {
    const currentStatus = status?.toUpperCase() || "APPLIED";

    if (currentStatus === "APPROVED") {
      return <span className="badge bg-success px-3 py-2">APPROVED</span>;
    }

    if (currentStatus === "REJECTED") {
      return <span className="badge bg-danger px-3 py-2">REJECTED</span>;
    }

    return (
      <span className="badge bg-warning text-dark px-3 py-2">APPLIED</span>
    );
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <h5>Loading Applications...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">📄 My Applications</h2>

          <p className="text-muted mb-0">
            Track the status of your job applications.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/jobs")}
          >
            🔎 Browse Jobs
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/jobseeker")}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <div style={{ fontSize: "50px" }}>📄</div>

            <h4 className="fw-bold mt-3">No Applications Found</h4>

            <p className="text-muted">You haven't applied for any jobs yet.</p>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/jobs")}
            >
              Browse Jobs
            </button>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th className="px-3 py-3">ID</th>
                    <th>Job Title</th>
                    <th>Status</th>
                    <th>Resume</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-3">{app.id}</td>

                      <td>
                        <span className="fw-semibold">
                          {app.jobTitle || "Job Title Not Available"}
                        </span>
                      </td>

                      <td>{getBadge(app.status)}</td>

                      <td>
                        {app.resumePath ? (
                          <a
                            href={`http://localhost:8080/api/applications/resume/${app.resumePath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary btn-sm"
                          >
                            📄 View Resume
                          </a>
                        ) : (
                          <span className="text-muted">Not Available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyApplications;
