import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaBuilding, FaBriefcase, FaFileAlt } from "react-icons/fa";
import "../styles/stats.css";

function Stats() {
  const [stats, setStats] = useState({
    users: 0,
    companies: 0,
    jobs: 0,
    applications: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [usersRes, companiesRes, jobsRes, applicationsRes] =
          await Promise.all([
            axios.get("http://localhost:8080/api/users/count"),
            axios.get("http://localhost:8080/api/employer"),
            axios.get("http://localhost:8080/api/jobs/count"),
            axios.get("http://localhost:8080/api/applications/count"),
          ]);

        setStats({
          users: Number(usersRes.data) || 0,
          companies: Array.isArray(companiesRes.data)
            ? companiesRes.data.length
            : 0,
          jobs: Number(jobsRes.data) || 0,
          applications: Number(applicationsRes.data) || 0,
        });
      } catch (error) {
        console.log("Stats Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statItems = [
    {
      icon: <FaUsers />,
      value: stats.users,
      label: "Registered Users",
    },
    {
      icon: <FaBuilding />,
      value: stats.companies,
      label: "Companies",
    },
    {
      icon: <FaBriefcase />,
      value: stats.jobs,
      label: "Jobs Posted",
    },
    {
      icon: <FaFileAlt />,
      value: stats.applications,
      label: "Applications",
    },
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="text-center mb-5">
          <p className="text-primary fw-semibold mb-2">Platform Overview</p>

          <h2 className="fw-bold mb-2">JobPortal at a Glance</h2>

          <p className="text-muted mb-0">
            Real-time platform statistics from our database.
          </p>
        </div>

        <div className="row g-4">
          {statItems.map((item, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
              <div className="stat-card h-100">
                <div className="stat-icon">{item.icon}</div>

                <h3>{loading ? "..." : item.value.toLocaleString("en-IN")}</h3>

                <p>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
