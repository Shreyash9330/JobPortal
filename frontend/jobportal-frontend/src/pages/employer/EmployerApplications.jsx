import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function EmployerApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const employerEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/applications/employer/${employerEmail}`,
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
        text: "Something went wrong while loading applications.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const actionText = status === "APPROVED" ? "approve" : "reject";

    const result = await Swal.fire({
      title: `${status === "APPROVED" ? "Approve" : "Reject"} Application?`,
      text: `Are you sure you want to ${actionText} this application?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: status === "APPROVED" ? "#198754" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: status === "APPROVED" ? "Yes, Approve" : "Yes, Reject",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/applications/${id}/status?status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === id ? { ...app, status: response.data.status } : app,
        ),
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text:
          status === "APPROVED"
            ? "Application approved successfully."
            : "Application rejected successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log("Update Status Error:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Unable to update application status.",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const getStatusBadge = (status) => {
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
          <h2 className="fw-bold mb-1">📄 Applications Received</h2>

          <p className="text-muted mb-0">
            Review and manage applications received for your jobs.
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/employer/dashboard")}
        >
          Dashboard
        </button>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <div style={{ fontSize: "50px" }}>📄</div>

            <h4 className="fw-bold mt-3">No Applications Found</h4>

            <p className="text-muted">
              You haven't received any job applications yet.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/employer/add-job")}
            >
              Post a New Job
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
                    <th className="px-3 py-3">Job Title</th>
                    <th>Applicant Email</th>
                    <th>Status</th>
                    <th>Resume</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => {
                    const status = app.status?.toUpperCase();

                    return (
                      <tr key={app.id}>
                        <td className="px-3 fw-semibold">
                          {app.jobTitle || "Job Title Not Available"}
                        </td>

                        <td>{app.userEmail || "Not Available"}</td>

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
                            <span className="text-muted">Not Available</span>
                          )}
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            {status === "APPROVED" ? (
                              <span className="badge bg-success px-3 py-2">
                                ✓ Approved
                              </span>
                            ) : (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => updateStatus(app.id, "APPROVED")}
                              >
                                ✓ Approve
                              </button>
                            )}

                            {status === "REJECTED" ? (
                              <span className="badge bg-danger px-3 py-2">
                                ✕ Rejected
                              </span>
                            ) : (
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => updateStatus(app.id, "REJECTED")}
                              >
                                ✕ Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerApplications;
