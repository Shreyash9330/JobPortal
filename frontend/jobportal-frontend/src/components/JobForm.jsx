import { useState } from "react";
import { Link } from "react-router-dom";

const JOB_TYPES = ["Full Time", "Part Time", "Internship", "Contract", "Remote"];

export const EMPTY_JOB = {
  title: "",
  company: "",
  location: "",
  salary: "",
  experience: "",
  jobType: "",
  skills: "",
  description: "",
};

function JobForm({ initial = EMPTY_JOB, submitLabel, busyLabel, busy, onSubmit, cancelTo }) {
  const [job, setJob] = useState({ ...EMPTY_JOB, ...initial });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!job.title.trim()) next.title = "Job title is required";
    if (!job.company.trim()) next.company = "Company is required";
    if (!job.location.trim()) next.location = "Location is required";
    if (job.salary === "" || Number(job.salary) < 0 || Number.isNaN(Number(job.salary))) {
      next.salary = "Enter a valid yearly salary";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...job,
      title: job.title.trim(),
      company: job.company.trim(),
      location: job.location.trim(),
      skills: job.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", "),
    });
  };

  const field = (name) => `form-control${errors[name] ? " is-invalid" : ""}`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="db-form">
        <div className="full">
          <label htmlFor="title">
            Job title <span className="req">*</span>
          </label>
          <input id="title" name="title" type="text" className={field("title")} placeholder="e.g. Java Backend Developer" value={job.title} onChange={handleChange} />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>

        <div>
          <label htmlFor="company">
            Company <span className="req">*</span>
          </label>
          <input id="company" name="company" type="text" className={field("company")} placeholder="e.g. TechNova Solutions" value={job.company} onChange={handleChange} />
          {errors.company && <div className="invalid-feedback">{errors.company}</div>}
        </div>

        <div>
          <label htmlFor="location">
            Location <span className="req">*</span>
          </label>
          <input id="location" name="location" type="text" className={field("location")} placeholder="e.g. Pune" value={job.location} onChange={handleChange} />
          {errors.location && <div className="invalid-feedback">{errors.location}</div>}
        </div>

        <div>
          <label htmlFor="salary">
            Salary per year <span className="req">*</span>
          </label>
          <div className="input-group has-validation">
            <span className="input-group-text">₹</span>
            <input id="salary" name="salary" type="number" min="0" className={field("salary")} placeholder="e.g. 500000" value={job.salary} onChange={handleChange} />
            {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
          </div>
        </div>

        <div>
          <label htmlFor="experience">Experience</label>
          <input id="experience" name="experience" type="text" className="form-control" placeholder="e.g. 0-1 years" value={job.experience} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="jobType">Job type</label>
          <select id="jobType" name="jobType" className="form-select" value={job.jobType} onChange={handleChange}>
            <option value="">Select job type</option>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="skills">Skills</label>
          <input id="skills" name="skills" type="text" className="form-control" placeholder="Java, Spring Boot, MySQL" value={job.skills} onChange={handleChange} />
          <div className="form-text">Separate skills with commas.</div>
        </div>

        <div className="full">
          <label htmlFor="description">Job description</label>
          <textarea id="description" name="description" className="form-control" rows="5" placeholder="Responsibilities, requirements, perks..." value={job.description} onChange={handleChange} />
        </div>
      </div>

      <div className="db-form-actions">
        <Link to={cancelTo} className="btn btn-outline-secondary">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? busyLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default JobForm;
