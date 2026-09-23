import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

function AddJob() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "",
    skills: "",
    description: "",
    employerEmail: localStorage.getItem("email"),
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields validation
    if (!job.title || !job.company || !job.location || !job.salary) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all required fields.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post("http://localhost:8080/api/jobs", job, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await Swal.fire({
        icon: "success",
        title: "Job Posted Successfully!",
        text: "Your job has been added successfully.",
        confirmButtonColor: "#198754",
        confirmButtonText: "View Jobs",
      });

      if (result.isConfirmed) {
        navigate("/jobs");
      }
    } catch (error) {
      console.log("Add Job Error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to Post Job",
        text: "Unable to add the job. Please try again.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4 p-md-5">
              {/* Heading */}
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2">💼 Post a New Job</h2>
                <p className="text-muted mb-0">
                  Find the right candidate for your company
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Job Title */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Job Title <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Java Developer"
                    value={job.title}
                    onChange={handleChange}
                  />
                </div>

                {/* Company */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Company <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="company"
                    className="form-control"
                    placeholder="e.g. Microsoft"
                    value={job.company}
                    onChange={handleChange}
                  />
                </div>

                {/* Location */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Location <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g. Pune"
                    value={job.location}
                    onChange={handleChange}
                  />
                </div>

                {/* Salary */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Salary <span className="text-danger">*</span>
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">₹</span>

                    <input
                      type="number"
                      name="salary"
                      className="form-control"
                      placeholder="e.g. 450000"
                      min="0"
                      value={job.salary}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Experience</label>

                  <input
                    type="text"
                    name="experience"
                    className="form-control"
                    placeholder="e.g. 0, 1, 2, 3+"
                    value={job.experience}
                    onChange={handleChange}
                  />
                </div>

                {/* Job Type */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Job Type</label>

                  <select
                    name="jobType"
                    className="form-select"
                    value={job.jobType}
                    onChange={handleChange}
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                {/* Skills */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Skills</label>

                  <input
                    type="text"
                    name="skills"
                    className="form-control"
                    placeholder="Java, Spring Boot, MySQL, React"
                    value={job.skills}
                    onChange={handleChange}
                  />

                  <div className="form-text">
                    Separate multiple skills with commas.
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Job Description
                  </label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    placeholder="Enter job responsibilities and requirements..."
                    value={job.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2">
                  <Link to="/jobs" className="btn btn-outline-secondary w-50">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="btn btn-primary w-50"
                    disabled={loading}
                  >
                    {loading ? "Posting..." : "Post Job"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddJob;
