const TONES = {
  APPROVED: "success",
  ACTIVE: "success",
  OPEN: "success",
  SELECTED: "primary",
  SHORTLISTED: "info",
  APPLIED: "warning",
  PENDING: "warning",
  REJECTED: "danger",
  CLOSED: "danger",
  ADMIN: "danger",
  EMPLOYER: "success",
  JOBSEEKER: "primary",
};

const LABELS = {
  JOBSEEKER: "JOB SEEKER",
};

function StatusBadge({ status, fallback = "APPLIED" }) {
  const key = (status || fallback).toUpperCase();
  const tone = TONES[key] || "muted";

  return <span className={`db-badge ${tone}`}>{LABELS[key] || key}</span>;
}

export default StatusBadge;
