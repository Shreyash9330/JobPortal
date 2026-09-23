import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router-dom";

function JobList() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");

  const [resume, setResume] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const locationState = useLocation();

  const [search, setSearch] = useState(locationState.state?.search || "");

  const [location, setLocation] = useState(locationState.state?.location || "");
  // Get user role from JWT
  let role = "";

  if (token && token.includes(".")) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (error) {
      console.log("Invalid token");
    }
  }

  const fetchJobs = async (
    filters = {
      search,
      location,
      jobType,
      experience,
    },
  ) => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8080/api/jobs/filter",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            title: filters.search,
            location: filters.location,
            jobType: filters.jobType,
            experience: filters.experience,
          },
        },
      );

      setJobs(response.data);

      // Check already applied jobs
      if (email && role === "JOBSEEKER") {
        const results = await Promise.all(
          response.data.map((job) =>
            axios.get("http://localhost:8080/api/applications/check", {
              params: {
                jobId: job.id,
                email: email,
              },
            }),
          ),
        );

        const applied = response.data
          .map((job, index) => (results[index].data ? job.id : null))
          .filter((id) => id !== null);

        setAppliedJobs(applied);
      } else {
        setAppliedJobs([]);
      }
    } catch (error) {
      console.log("Fetch Jobs Error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Jobs",
        text: "Something went wrong while loading jobs.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Initial load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setResume(null);
      return;
    }

    // PDF validation
    if (file.type !== "application/pdf") {
      Swal.fire({
        icon: "warning",
        title: "Invalid Resume",
        text: "Please upload your resume in PDF format.",
        confirmButtonColor: "#0d6efd",
      });

      e.target.value = "";
      setResume(null);
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File Too Large",
        text: "Resume size should be less than 5 MB.",
        confirmButtonColor: "#0d6efd",
      });

      e.target.value = "";
      setResume(null);
      return;
    }

    setResume(file);
  };

  const applyJob = async (jobId, jobTitle) => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login before applying for a job.",
        confirmButtonColor: "#0d6efd",
      });

      navigate("/login");
      return;
    }

    if (!resume) {
      Swal.fire({
        icon: "warning",
        title: "Resume Required",
        text: "Please select your PDF resume before applying.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    try {
      setApplyingJobId(jobId);

      const formData = new FormData();
      formData.append("file", resume);

      // Upload Resume
      const uploadResponse = await axios.post(
        "http://localhost:8080/api/applications/upload",
        formData,
      );

      const resumePath = uploadResponse.data;

      // Save Application
      await axios.post(
        "http://localhost:8080/api/applications",
        {
          jobId: jobId,
          jobTitle: jobTitle,
          userEmail: email,
          resumePath: resumePath,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAppliedJobs((prev) => [...prev, jobId]);
      setResume(null);

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: "Your application has been submitted successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log("Apply Error:", error);

      Swal.fire({
        icon: "error",
        title: "Application Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setApplyingJobId(null);
    }
  };

  const deleteJob = async (id) => {
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
      await axios.delete(`http://localhost:8080/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const goToDashboard = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (role === "ADMIN") {
      navigate("/admin");
    } else if (role === "EMPLOYER") {
      navigate("/employer/dashboard");
    } else {
      navigate("/jobseeker");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setExperience("");

    fetchJobs({
      search: "",
      location: "",
      jobType: "",
      experience: "",
    });
  };

  const getStatusBadge = (status) => {
    const currentStatus = status?.toUpperCase();

    if (currentStatus === "ACTIVE") {
      return <span className="badge bg-success">ACTIVE</span>;
    }

    if (currentStatus === "CLOSED") {
      return <span className="badge bg-danger">CLOSED</span>;
    }

    return null;
  };

  return (
    <div className="container-fluid py-4 px-3 px-lg-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="fw-bold mb-1">💼 All Jobs</h1>
          <p className="text-muted mb-0">
            Find the right opportunity for your career.
          </p>
        </div>
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {(role === "EMPLOYER" || role === "ADMIN") && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/view-applications")}
            >
              📄 View Applications
            </button>
          )}

          {token && (
            <>
              <button className="btn btn-secondary" onClick={goToDashboard}>
                Dashboard
              </button>

              {role === "JOBSEEKER" && (
                <button
                  className="btn btn-info"
                  onClick={() => navigate("/my-applications")}
                >
                  📄 My Applications
                </button>
              )}

              {(role === "EMPLOYER" || role === "ADMIN") && (
                <Link to="/employer/add-job">
                  <button className="btn btn-success">➕ Add Job</button>
                </Link>
              )}

              <button
                className="btn btn-danger"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("email");
                  localStorage.removeItem("role");
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3">
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold">Search Job</label>

              <input
                type="text"
                className="form-control"
                placeholder="e.g. Java Developer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label fw-semibold">Location</label>

              <select
                className="form-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label fw-semibold">Job Type</label>

              <select
                className="form-select"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">All Job Types</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-6">
              <label className="form-label fw-semibold">Experience</label>

              <select
                className="form-select"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="0">Fresher (less than 1 year)</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
              </select>
            </div>

            <div className="col-lg-3 d-flex align-items-end gap-2">
              <button
                className="btn btn-primary flex-grow-1"
                onClick={() =>
                  fetchJobs({
                    search,
                    location,
                    jobType,
                    experience,
                  })
                }
              >
                🔎 Search
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Resume */}
      {role === "JOBSEEKER" && resume && (
        <div className="alert alert-info d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>
            📄 Selected Resume: <strong>{resume.name}</strong>
          </span>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => setResume(null)}
          >
            Remove
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3"></div>
          <h5>Loading Jobs...</h5>
        </div>
      ) : jobs.length === 0 ? (
        /* Empty State */
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <div style={{ fontSize: "55px" }}>🔍</div>

            <h4 className="fw-bold mt-3">No Jobs Found</h4>

            <p className="text-muted">
              Try changing your search or filter options.
            </p>

            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Result Count */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-bold">
              {jobs.length} Job{jobs.length !== 1 ? "s" : ""} Found
            </h5>
          </div>

          {/* Job Cards */}
          <div className="row g-4">
            {jobs.map((job) => {
              const skills = job.skills
                ? job.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                : [];

              const isApplied = appliedJobs.includes(job.id);
              const isApplying = applyingJobId === job.id;

              return (
                <div className="col-xl-4 col-lg-6" key={job.id}>
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4 d-flex flex-column">
                      {/* Title */}
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                        <div>
                          <h4 className="fw-bold mb-1">
                            {job.title || "Untitled Job"}
                          </h4>

                          <p className="text-primary fw-semibold mb-0">
                            🏢 {job.company || "Company Not Available"}
                          </p>
                        </div>

                        {getStatusBadge(job.status)}
                      </div>

                      {/* Job Details */}
                      <div className="mb-3">
                        <div className="mb-2">
                          📍 <strong>Location:</strong>{" "}
                          {job.location || "Not specified"}
                        </div>

                        <div className="mb-2">
                          💰 <strong>Salary:</strong>{" "}
                          {job.salary
                            ? `₹ ${Number(job.salary).toLocaleString("en-IN")}`
                            : "Not specified"}
                        </div>

                        <div className="mb-2">
                          🎓 <strong>Experience:</strong>{" "}
                          {job.experience || "Not specified"}
                        </div>

                        <div>
                          💼 <strong>Job Type:</strong>{" "}
                          {job.jobType || "Not specified"}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-3">
                        {skills.length > 0 ? (
                          <div className="d-flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                              <span
                                key={index}
                                className="badge bg-primary-subtle text-primary px-2 py-2"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted small">
                            No specific skills listed
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-muted flex-grow-1 mb-4">
                        {job.description
                          ? job.description
                          : "No description available."}
                      </p>

                      {/* Job Seeker Actions */}
                      {role === "JOBSEEKER" && (
                        <div className="mt-auto">
                          {!isApplied && (
                            <div className="mb-3">
                              <label className="form-label fw-semibold small">
                                Resume (PDF, max 5 MB)
                              </label>

                              <input
                                type="file"
                                className="form-control form-control-sm"
                                accept=".pdf,application/pdf"
                                onChange={handleResumeChange}
                              />
                            </div>
                          )}

                          {isApplied ? (
                            <button className="btn btn-success w-100" disabled>
                              ✓ Applied
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => applyJob(job.id, job.title)}
                              disabled={isApplying}
                            >
                              {isApplying ? "Submitting..." : "Apply Now"}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Employer/Admin Actions */}
                      {(role === "EMPLOYER" || role === "ADMIN") && (
                        <div className="d-flex gap-2 mt-auto">
                          <Link
                            to={`/employer/edit-job/${job.id}`}
                            className="btn btn-outline-primary flex-grow-1"
                          >
                            ✏️ Edit
                          </Link>

                          <button
                            className="btn btn-outline-danger flex-grow-1"
                            onClick={() => deleteJob(job.id)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default JobList;
