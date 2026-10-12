const TONES = {
  APPROVED: "success",
  ACTIVE: "success",
  OPEN: "success",
  APPLIED: "warning",
  PENDING: "warning",
  REJECTED: "danger",
  CLOSED: "danger",
};

function StatusBadge({ status, fallback = "APPLIED" }) {
  const label = (status || fallback).toUpperCase();
  const tone = TONES[label] || "muted";

  return <span className={`db-badge ${tone}`}>{label}</span>;
}

export default StatusBadge;
