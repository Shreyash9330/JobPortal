import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAuth } from "../../utils/auth";
import JobListingCard, {
  JobCardSkeleton,
} from "../../components/JobListingCard";
import "../../styles/joblist.css";

function JobList() {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const auth = getAuth();
  const email = auth?.email;
  const role = auth?.role || "";

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(routerLocation.state?.search || "");
  const [location, setLocation] = useState(
    routerLocation.state?.location || "",
  );
  const [jobType, setJobType] = useState(routerLocation.state?.jobType || "");
  const [experience, setExperience] = useState("");

  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applyTarget, setApplyTarget] = useState(null);
  const [resume, setResume] = useState(null);
  const [applying, setApplying] = useState(false);

  const markApplied = async (list) => {
    if (!email || role !== "JOBSEEKER" || list.length === 0) {
      setAppliedJobs([]);
      return;
    }
    try {
      const results = await Promise.all(
        list.map((job) =>
          axios.get("/api/applications/check", {
            params: { jobId: job.id, email },
          }),
        ),
      );
      setAppliedJobs(
        list.filter((job, i) => results[i].data).map((job) => job.id),
      );
    } catch (error) {
      console.log("Applied check error:", error);
    }
  };

  const fetchJobs = async (
    filters = { search, location, jobType, experience },
  ) => {
    let wake;
    try {
      setLoading(true);
      setLoadError(false);
      wake = setTimeout(() => setSlow(true), 4000);

      const response = await axios.get("/api/jobs/filter", {
        params: {
          title: filters.search,
          location: filters.location,
          jobType: filters.jobType,
          experience: filters.experience,
        },
      });

      setJobs(response.data);
      clearTimeout(wake);
      setSlow(false);
      setLoading(false);

      await markApplied(response.data);
    } catch (error) {
      console.log("Fetch Jobs Error:", error);
      setLoadError(true);
    } finally {
      clearTimeout(wake);
      setSlow(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    if (file.type !== "application/pdf") {
      Swal.fire({
        icon: "warning",
        title: "Invalid Resume",
        text: "Please upload your resume in PDF format.",
        confirmButtonColor: "#2f5bea",
      });
      e.target.value = "";
      setResume(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File Too Large",
        text: "Resume size should be less than 5 MB.",
        confirmButtonColor: "#2f5bea",
      });
      e.target.value = "";
      setResume(null);
      return;
    }

    setResume(file);
  };

  const openApply = (job) => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login before applying for a job.",
        confirmButtonColor: "#2f5bea",
      });
      navigate("/login");
      return;
    }
    setResume(null);
    setApplyTarget(job);
  };

  const closeApply = () => {
    if (applying) return;
    setApplyTarget(null);
    setResume(null);
  };

  const submitApplication = async () => {
    if (!applyTarget || !resume) return;

    try {
      setApplying(true);

      const formData = new FormData();
      formData.append("file", resume);

      const uploadResponse = await axios.post(
        "/api/applications/upload",
        formData,
      );

      await axios.post("/api/applications", {
        jobId: applyTarget.id,
        jobTitle: applyTarget.title,
        userEmail: email,
        resumePath: uploadResponse.data,
      });

      setAppliedJobs((prev) => [...prev, applyTarget.id]);
      setApplyTarget(null);
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
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#e5484d",
      });
    } finally {
      setApplying(false);
    }
  };

  const deleteJob = async (id) => {
    const result = await Swal.fire({
      title: "Delete Job?",
      text: "This job will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e5484d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job.id !== id));
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
        text: error.response?.data?.message || "Unable to delete the job.",
        confirmButtonColor: "#e5484d",
      });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setExperience("");
    fetchJobs({ search: "", location: "", jobType: "", experience: "" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs({ search, location, jobType, experience });
  };

  return (
    <div className="jl-page">
      {/* Header */}
      <div className="jl-top">
        <div>
          <h1>Find your next role</h1>
          <p>Browse openings and apply in a couple of clicks.</p>
        </div>

        <div className="jl-top-actions">
          {role === "EMPLOYER" && (
            <>
              <button
                type="button"
                className="jl-btn ghost"
                onClick={() => navigate("/employer/applications")}
              >
                View applications
              </button>
              <Link to="/employer/add-job" className="jl-btn primary">
                + Add job
              </Link>
            </>
          )}
          {role === "ADMIN" && (
            <button
              type="button"
              className="jl-btn ghost"
              onClick={() => navigate("/admin/applications")}
            >
              Applications
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <form className="jl-filters" onSubmit={handleSearch}>
        <div className="jl-field jl-field-grow">
          <label htmlFor="jl-search">Search</label>
          <input
            id="jl-search"
            type="text"
            className="form-control"
            placeholder="e.g. Java Developer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="jl-field">
          <label htmlFor="jl-location">Location</label>
          <select
            id="jl-location"
            className="form-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All locations</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="jl-field">
          <label htmlFor="jl-type">Job type</label>
          <select
            id="jl-type"
            className="form-select"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">All job types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="jl-field">
          <label htmlFor="jl-exp">Experience</label>
          <select
            id="jl-exp"
            className="form-select"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="">Any experience</option>
            <option value="0">Fresher (less than 1 year)</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5 years</option>
          </select>
        </div>

        <div className="jl-filter-actions">
          <button type="submit" className="jl-btn primary">
            Search
          </button>
          <button type="button" className="jl-btn ghost" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </form>

      {/* Results */}
      {loading && slow && (
        <div className="jl-wake">
          <strong>Server is waking up.</strong> This demo runs on free hosting,
          so the first load can take up to a minute. Thanks for your patience!
        </div>
      )}

      {loading ? (
        <div className="jl-grid">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : loadError ? (
        <div className="jl-empty">
          <h4>Couldn&apos;t load jobs</h4>
          <p>Please check your connection and try again.</p>
          <button
            type="button"
            className="jl-btn primary"
            onClick={() => fetchJobs()}
          >
            Retry
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="jl-empty">
          <h4>No jobs found</h4>
          <p>Try changing your search or filter options.</p>
          <button
            type="button"
            className="jl-btn primary"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="jl-count">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
          </p>

          <div className="jl-grid">
            {jobs.map((job) => {
              // Employer: only own jobs. Admin: every job (delete only).
              const canManage =
                role === "ADMIN" ||
                (role === "EMPLOYER" &&
                  job.employerEmail?.toLowerCase() === email?.toLowerCase());

              return (
                <JobListingCard
                  key={job.id}
                  job={job}
                  role={role}
                  isApplied={appliedJobs.includes(job.id)}
                  canManage={canManage}
                  onApply={openApply}
                  onDelete={deleteJob}
                />
              );
            })}
          </div>
        </>
      )}

      {/* Apply modal */}
      {applyTarget && (
        <>
          <div className="modal-backdrop show" onClick={closeApply} />
          <div
            className="modal d-block"
            role="dialog"
            aria-modal="true"
            tabIndex="-1"
            onClick={closeApply}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content jl-modal">
                <div className="jl-modal-head">
                  <h5>Apply for {applyTarget.title}</h5>
                  <p>{applyTarget.company}</p>
                </div>

                <label htmlFor="jl-resume" className="form-label">
                  Resume (PDF, max 5 MB)
                </label>
                <input
                  id="jl-resume"
                  type="file"
                  className="form-control"
                  accept=".pdf,application/pdf"
                  onChange={handleResumeChange}
                />
                {resume && <p className="jl-file">📄 {resume.name}</p>}

                <div className="jl-modal-foot">
                  <button
                    type="button"
                    className="jl-btn ghost"
                    onClick={closeApply}
                    disabled={applying}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="jl-btn primary"
                    onClick={submitApplication}
                    disabled={!resume || applying}
                  >
                    {applying ? "Submitting..." : "Submit application"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default JobList;
