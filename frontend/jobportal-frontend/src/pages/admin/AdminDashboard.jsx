import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaUsers,
  FaBuilding,
  FaBriefcase,
  FaFileAlt,
  FaUserShield,
  FaArrowRight,
} from "react-icons/fa";
import "../../styles/dashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    employers: 0,
    jobs: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const results = await Promise.allSettled([
          axios.get("/api/users/count", config),
          axios.get("/api/employer", config),
          axios.get("/api/jobs/count", config),
          axios.get("/api/applications/count", config),
        ]);

        const [u, e, j, a] = results.map((r) =>
          r.status === "fulfilled" ? r.value.data : null,
        );

        setStats({
          users: Number(u) || 0,
          employers: Array.isArray(e) ? e.length : 0,
          jobs: Number(j) || 0,
          applications: Number(a) || 0,
        });
      } catch (error) {
        console.log("Admin Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

  const statItems = [
    {
      icon: <FaUsers />,
      tone: "blue",
      value: stats.users,
      label: "Registered users",
    },
    {
      icon: <FaBuilding />,
      tone: "green",
      value: stats.employers,
      label: "Employers",
    },
    {
      icon: <FaBriefcase />,
      tone: "amber",
      value: stats.jobs,
      label: "Jobs posted",
    },
    {
      icon: <FaFileAlt />,
      tone: "teal",
      value: stats.applications,
      label: "Applications",
    },
  ];

  const actions = [
    {
      to: "/admin/users",
      icon: <FaUsers />,
      tone: "blue",
      title: "Manage users",
      text: "View registered users and their roles.",
    },
    {
      to: "/admin/applications",
      icon: <FaFileAlt />,
      tone: "teal",
      title: "Manage applications",
      text: "Review applications and update their status.",
    },
    {
      to: "/jobs",
      icon: <FaBriefcase />,
      tone: "amber",
      title: "Manage jobs",
      text: "View, edit and remove jobs on the platform.",
    },
  ];

  return (
    <div className="db-page">
      <div className="db-head">
        <div>
          <div className="db-eyebrow">
            <FaUserShield /> Administration
          </div>
          <h1>Admin dashboard</h1>
          <p>Manage users, jobs, employers and applications.</p>
        </div>
      </div>

      <div className="db-stats">
        {statItems.map((s) => (
          <div className="db-stat" key={s.label}>
            <span className={`db-ico ${s.tone}`}>{s.icon}</span>
            <div>
              <strong>{loading ? "…" : s.value}</strong>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <h3 className="db-title">Quick actions</h3>
      <div className="db-actions">
        {actions.map((a) => (
          <Link to={a.to} className="db-action" key={a.to}>
            <span className={`db-ico ${a.tone}`}>{a.icon}</span>
            <div>
              <h4>{a.title}</h4>
              <p>{a.text}</p>
            </div>
            <FaArrowRight className="db-go" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
