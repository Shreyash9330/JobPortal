import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

        setJob({
          title: response.data.title || "",
          company: response.data.company || "",
          location: response.data.location || "",
          salary: response.data.salary || "",
          description: response.data.description || "",
        });
      } catch (error) {
        console.log("Load Job Error:", error);

        Swal.fire({
          icon: "error",
          title: "Unable to Load Job",
          text: "Job details could not be loaded.",
          confirmButtonColor: "#dc3545",
        });

        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const updateJob = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !job.title.trim() ||
      !job.company.trim() ||
      !job.location.trim() ||
      !job.salary
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all required fields.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    try {
      setUpdating(true);

      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:8080/api/jobs/${id}`, job, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await Swal.fire({
        icon: "success",
        title: "Job Updated Successfully!",
        text: "The job details have been updated.",
        confirmButtonColor: "#198754",
        confirmButtonText: "View Jobs",
      });

      if (result.isConfirmed) {
        navigate("/jobs");
      }
    } catch (error) {
      console.log("Update Job Error:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Unable to update the job. Please try again.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <h5>Loading Job Details...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4 p-md-5">
              {/* Heading */}
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2">✏️ Edit Job</h2>
                <p className="text-muted mb-0">
                  Update the job information below
                </p>
              </div>

              <form onSubmit={updateJob}>
                {/* Job Title */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Job Title <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={job.title}
                    onChange={handleChange}
                    placeholder="e.g. Java Developer"
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
                    value={job.company}
                    onChange={handleChange}
                    placeholder="e.g. Microsoft"
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
                    value={job.location}
                    onChange={handleChange}
                    placeholder="e.g. Pune"
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
                      value={job.salary}
                      onChange={handleChange}
                      placeholder="e.g. 450000"
                      min="0"
                    />
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
                    rows="5"
                    value={job.description}
                    onChange={handleChange}
                    placeholder="Enter job responsibilities and requirements..."
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
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Update Job"}
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

export default EditJob;
