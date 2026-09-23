import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

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
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [email, token, navigate]);

  const appliedCount = applications.filter(
    (app) => app.status?.toUpperCase() === "APPLIED",
  ).length;

  const approvedCount = applications.filter(
    (app) => app.status?.toUpperCase() === "APPROVED",
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status?.toUpperCase() === "REJECTED",
  ).length;

  const recentApplications = [...applications]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const getStatusBadge = (status) => {
    const currentStatus = status?.toUpperCase() || "APPLIED";

    if (currentStatus === "APPROVED") {
      return <span className="badge bg-success">APPROVED</span>;
    }

    if (currentStatus === "REJECTED") {
      return <span className="badge bg-danger">REJECTED</span>;
    }

    return <span className="badge bg-warning text-dark">APPLIED</span>;
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Do you want to logout from your account?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <h5>Loading Dashboard...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3 px-md-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">👨‍💻 Job Seeker Dashboard</h2>

          <p className="text-muted mb-0">
            Welcome back, <strong>{email}</strong> 👋
          </p>
        </div>

        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Statistics */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 text-center h-100">
            <div className="card-body py-4">
              <h2 className="fw-bold text-primary">{applications.length}</h2>
              <p className="text-muted mb-0">Total Applications</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 text-center h-100">
            <div className="card-body py-4">
              <h2 className="fw-bold text-warning">{appliedCount}</h2>
              <p className="text-muted mb-0">Applied</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 text-center h-100">
            <div className="card-body py-4">
              <h2 className="fw-bold text-success">{approvedCount}</h2>
              <p className="text-muted mb-0">Approved</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 text-center h-100">
            <div className="card-body py-4">
              <h2 className="fw-bold text-danger">{rejectedCount}</h2>
              <p className="text-muted mb-0">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h3 className="fw-bold mb-4 text-center">Quick Actions</h3>

        <div className="row g-4">
          <div className="col-md-6">
            <button
              className="btn btn-primary w-100 py-3 rounded-4 shadow-sm"
              onClick={() => navigate("/jobs")}
            >
              🔎 Browse Jobs
            </button>
          </div>

          <div className="col-md-6">
            <button
              className="btn btn-outline-primary w-100 py-3 rounded-4 shadow-sm"
              onClick={() => navigate("/my-applications")}
            >
              📄 My Applications
            </button>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card border-0 shadow-sm rounded-4 mt-5">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0">Recent Applications</h3>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate("/my-applications")}
            >
              View All
            </button>
          </div>

          {recentApplications.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "50px" }}>📄</div>

              <h5 className="fw-bold mt-3">No Applications Yet</h5>

              <p className="text-muted">
                Start applying for jobs to track your applications here.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/jobs")}
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Job Title</th>
                    <th>Applicant</th>
                    <th>Status</th>
                    <th>Resume</th>
                  </tr>
                </thead>

                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="fw-semibold">
                        {app.jobTitle || "Job Title Not Available"}
                      </td>

                      <td>{app.userEmail || email}</td>

                      <td>{getStatusBadge(app.status)}</td>

                      <td>
                        {app.resumePath ? (
                          <a
                            href={`http://localhost:8080/api/applications/resume/${app.resumePath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-primary"
                          >
                            View Resume
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
          )}
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;
