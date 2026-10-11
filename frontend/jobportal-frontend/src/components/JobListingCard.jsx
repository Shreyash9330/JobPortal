import { Link } from "react-router-dom";
import "../styles/joblist.css";

function Icon({ children }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const AVATARS = [
  ["#e8eeff", "#1e3fb8"],
  ["#ddf7f3", "#0f766e"],
  ["#fff1d6", "#b45309"],
  ["#fde8e9", "#b42318"],
  ["#ede9fe", "#5b21b6"],
];

export function formatSalary(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return `₹${n.toLocaleString("en-IN")} / yr`;
}

function timeAgo(iso) {
  if (!iso) return "";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (Number.isNaN(days)) return "";
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days} days ago`;
  return `Posted ${Math.floor(days / 30)} mo ago`;
}

export function JobCardSkeleton() {
  return (
    <div className="jl-card" aria-hidden="true">
      <div className="jl-head">
        <div className="jl-avatar skel" />
        <div className="jl-titles">
          <div className="skel line w60" />
          <div className="skel line w40" />
        </div>
      </div>
      <div className="skel line w80" />
      <div className="skel line w70" />
      <div className="skel line w90" />
    </div>
  );
}

function JobListingCard({
  job,
  role = "",
  isApplied = false,
  canManage = false,
  onApply,
  onDelete,
  linkTo,
}) {
  const skills = job.skills
    ? job.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const closed = job.status?.toUpperCase() === "CLOSED";
  const company = job.company || "Company";
  const [bg, ink] = AVATARS[company.charCodeAt(0) % AVATARS.length];
  const salary = formatSalary(job.salary);
  const posted = timeAgo(job.createdAt);
  const showApply = !linkTo && (role === "JOBSEEKER" || !role);

  return (
    <article className="jl-card">
      <header className="jl-head">
        <div className="jl-avatar" style={{ background: bg, color: ink }}>
          {company.charAt(0).toUpperCase()}
        </div>
        <div className="jl-titles">
          <h3 className="jl-title">{job.title || "Untitled job"}</h3>
          <p className="jl-company">{company}</p>
        </div>
        {closed && <span className="jl-closed">Closed</span>}
      </header>

      <ul className="jl-meta">
        <li>
          <Icon>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </Icon>
          <span>{job.location || "Not specified"}</span>
        </li>
        <li>
          <Icon>
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
          </Icon>
          <span>{salary || "Not disclosed"}</span>
        </li>
        {job.jobType && (
          <li>
            <Icon>
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </Icon>
            <span>{job.jobType}</span>
          </li>
        )}
        {job.experience && (
          <li>
            <Icon>
              <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
              <path d="M22 10v6" />
              <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
            </Icon>
            <span>{job.experience}</span>
          </li>
        )}
      </ul>

      {skills.length > 0 && (
        <div className="jl-skills">
          {skills.slice(0, 4).map((skill) => (
            <span className="jl-chip" key={skill}>
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="jl-chip more">+{skills.length - 4}</span>
          )}
        </div>
      )}

      <p className="jl-desc">
        {job.description || "No description available."}
      </p>

      <footer className="jl-foot">
        <span className="jl-posted">{posted}</span>
        <div className="jl-actions">
          {linkTo && (
            <Link className="jl-btn primary" to={linkTo}>
              View &amp; Apply
            </Link>
          )}

          {showApply &&
            (isApplied ? (
              <button type="button" className="jl-btn applied" disabled>
                ✓ Applied
              </button>
            ) : (
              <button
                type="button"
                className="jl-btn primary"
                onClick={() => onApply(job)}
                disabled={closed}
              >
                {closed ? "Closed" : "Apply now"}
              </button>
            ))}

          {canManage && (
            <>
              {role === "EMPLOYER" && (
                <Link
                  className="jl-btn ghost"
                  to={`/employer/edit-job/${job.id}`}
                >
                  Edit
                </Link>
              )}
              <button
                type="button"
                className="jl-btn danger"
                onClick={() => onDelete(job.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </footer>
    </article>
  );
}

export default JobListingCard;
