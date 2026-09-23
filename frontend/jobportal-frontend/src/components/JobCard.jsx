import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaBriefcase,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/jobCard.css";

function JobCard({ job }) {
  return (
    <div className="job-card shadow-sm">
      <div className="job-header">
        <div>
          <h5>{job.company}</h5>
          <h4>{job.title}</h4>
        </div>

        <span className="job-type">{job.jobType || "Full-Time"}</span>
      </div>

      <div className="job-details">
        <p>
          <FaMapMarkerAlt className="icon" />
          {job.location}
        </p>

        <p>
          <FaMoneyBillWave className="icon" />₹{" "}
          {Number(job.salary).toLocaleString()}
        </p>

        <p>
          <FaBriefcase className="icon" />
          {job.experience || "Fresher"}
        </p>

        <p>
          <FaClock className="icon" />
          Recently Posted
        </p>
      </div>

      <div className="job-skills">
        {job.skills ? (
          job.skills
            .split(",")
            .map((skill, index) => <span key={index}>{skill.trim()}</span>)
        ) : (
          <span>General</span>
        )}
      </div>

      <Link to={`/jobs`} className="btn btn-primary w-100 mt-3">
        View & Apply
      </Link>
    </div>
  );
}

export default JobCard;
