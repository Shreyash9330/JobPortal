import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ViewJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:8080/api/jobs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setJob(response.data);
      } catch (error) {
        console.log("Load Job Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const getStatusBadge = (status) => {
    const currentStatus = status?.toUpperCase() || "ACTIVE";

    if (currentStatus === "ACTIVE") {
      return <span className="badge bg-success px-3 py-2">ACTIVE</span>;
    }

    if (currentStatus === "CLOSED") {
      return <span className="badge bg-danger px-3 py-2">CLOSED</span>;
    }

    return (
      <span className="badge bg-secondary px-3 py-2">{currentStatus}</span>
    );
  };

  const skillList = job.skills
    ? job.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3"></div>
        <h5>Loading Job Details...</h5>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            {/* Header */}
            <div className="card-body p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                <div>
                  <p className="text-primary fw-semibold mb-1">
                    💼 Job Opportunity
                  </p>

                  <h2 className="fw-bold mb-2">
                    {job.title || "Job Title Not Available"}
                  </h2>

                  <h5 className="text-muted mb-0">
                    🏢 {job.company || "Company Not Available"}
                  </h5>
                </div>

                <div>{getStatusBadge(job.status)}</div>
              </div>

              {/* Job Information */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
                    <small className="text-muted d-block mb-1">
                      📍 Location
                    </small>
                    <strong>{job.location || "Not specified"}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
                    <small className="text-muted d-block mb-1">💰 Salary</small>
                    <strong className="text-success">
                      ₹ {Number(job.salary || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
                    <small className="text-muted d-block mb-1">
                      🎓 Experience
                    </small>
                    <strong>{job.experience || "Not specified"}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
                    <small className="text-muted d-block mb-1">
                      💼 Job Type
                    </small>
                    <strong>{job.jobType || "Not specified"}</strong>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">🛠 Skills Required</h5>

                {skillList.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {skillList.map((skill, index) => (
                      <span
                        key={index}
                        className="badge bg-primary-subtle text-primary border px-3 py-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">No specific skills listed.</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">📝 Job Description</h5>

                <div className="border rounded-3 p-4 bg-light">
                  {job.description ? (
                    <p className="mb-0">{job.description}</p>
                  ) : (
                    <p className="text-muted mb-0">No description available.</p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2 flex-wrap pt-2">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => navigate("/employer/my-jobs")}
                >
                  ← Back to My Jobs
                </button>

                <button
                  className="btn btn-primary px-4"
                  onClick={() => navigate(`/employer/edit-job/${job.id}`)}
                >
                  ✏️ Edit Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewJob;
