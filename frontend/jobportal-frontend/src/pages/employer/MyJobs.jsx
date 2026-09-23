import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { deleteJob } from "../../services/jobService";
import { useNavigate } from "react-router-dom";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const employerEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/jobs/employer/${employerEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setJobs(response.data);
    } catch (error) {
      console.log("Fetch Jobs Error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Jobs",
        text: "Something went wrong while loading your jobs.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

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

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Job deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log("Delete Job Error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Unable to delete the job.",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const getStatusBadge = (status) => {
    const currentStatus = status?.toUpperCase() || "ACTIVE";

    if (currentStatus === "ACTIVE") {
      return <span className="badge bg-success">ACTIVE</span>;
    }

    if (currentStatus === "CLOSED") {
      return <span className="badge bg-danger">CLOSED</span>;
    }

    return <span className="badge bg-secondary">{currentStatus}</span>;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <h5>Loading Your Jobs...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">📋 My Jobs</h2>
          <p className="text-muted mb-0">
            Manage the jobs posted by your company.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/employer/add-job")}
        >
          ➕ Post New Job
        </button>
      </div>

      {/* Empty State */}
      {jobs.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <div style={{ fontSize: "50px" }}>💼</div>

            <h4 className="fw-bold mt-3">No Jobs Posted Yet</h4>

            <p className="text-muted">
              Start posting jobs to find the right candidates.
            </p>

            <button
              className="btn btn-primary mt-2"
              onClick={() => navigate("/employer/add-job")}
            >
              Post Your First Job
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
                    <th>Company</th>
                    <th>Location</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="px-3">
                        <div className="fw-semibold">
                          {job.title || "Untitled Job"}
                        </div>
                      </td>

                      <td>{job.company || "Not specified"}</td>

                      <td>📍 {job.location || "Not specified"}</td>

                      <td>
                        ₹ {Number(job.salary || 0).toLocaleString("en-IN")}
                      </td>

                      <td>{getStatusBadge(job.status)}</td>

                      <td>
                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                          <button
                            className="btn btn-info btn-sm text-white"
                            onClick={() =>
                              navigate(`/employer/view-job/${job.id}`)
                            }
                          >
                            👁 View
                          </button>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              navigate(`/employer/edit-job/${job.id}`)
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(job.id)}
                          >
                            🗑 Delete
                          </button>
                        </div>
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

export default MyJobs;
