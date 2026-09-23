import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaBuilding,
  FaBriefcase,
  FaFileAlt,
  FaUserShield,
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

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
        const [
          usersResponse,
          employersResponse,
          jobsResponse,
          applicationsResponse,
        ] = await Promise.all([
          axios.get("http://localhost:8080/api/users/count"),
          axios.get("http://localhost:8080/api/employer"),
          axios.get("http://localhost:8080/api/jobs/count"),
          axios.get("http://localhost:8080/api/applications/count"),
        ]);

        setStats({
          users: Number(usersResponse.data) || 0,
          employers: Array.isArray(employersResponse.data)
            ? employersResponse.data.length
            : 0,
          jobs: Number(jobsResponse.data) || 0,
          applications: Number(applicationsResponse.data) || 0,
        });
      } catch (error) {
        console.log("Admin Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Do you want to logout from the admin account?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const statItems = [
    {
      icon: <FaUsers />,
      value: stats.users,
      label: "Registered Users",
      className: "text-primary",
    },
    {
      icon: <FaBuilding />,
      value: stats.employers,
      label: "Employers",
      className: "text-success",
    },
    {
      icon: <FaBriefcase />,
      value: stats.jobs,
      label: "Jobs Posted",
      className: "text-warning",
    },
    {
      icon: <FaFileAlt />,
      value: stats.applications,
      label: "Applications",
      className: "text-info",
    },
  ];

  return (
    <div className="container-fluid py-4 px-3 px-lg-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <p className="text-primary fw-semibold mb-1">
            <FaUserShield className="me-2" />
            Administration
          </p>

          <h2 className="fw-bold mb-1">Admin Dashboard</h2>

          <p className="text-muted mb-0">
            Manage users, jobs, employers, and applications.
          </p>
        </div>

        <button className="btn btn-danger px-4" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Statistics */}
      <div className="row g-4 mb-5">
        {statItems.map((item, index) => (
          <div className="col-xl-3 col-md-6" key={index}>
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold mb-1">
                      {loading ? "..." : item.value}
                    </h3>

                    <p className="text-muted mb-0">{item.label}</p>
                  </div>

                  <div className={`fs-2 ${item.className}`}>{item.icon}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h4 className="fw-bold mb-4">Quick Actions</h4>

        <div className="row g-4">
          {/* Manage Users */}
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="fs-2 text-primary mb-3">👥</div>

                <h5 className="fw-bold">Manage Users</h5>

                <p className="text-muted">
                  View and manage registered users and their roles.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/admin/users")}
                >
                  Manage Users →
                </button>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="fs-2 text-info mb-3">📄</div>

                <h5 className="fw-bold">Manage Applications</h5>

                <p className="text-muted">
                  Review job applications submitted by job seekers.
                </p>

                <button
                  className="btn btn-info text-white"
                  onClick={() => navigate("/admin/applications")}
                >
                  View Applications →
                </button>
              </div>
            </div>
          </div>

          {/* Jobs */}
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="fs-2 text-warning mb-3">💼</div>

                <h5 className="fw-bold">Manage Jobs</h5>

                <p className="text-muted">
                  View, edit, and remove jobs posted on the platform.
                </p>

                <button
                  className="btn btn-warning"
                  onClick={() => navigate("/jobs")}
                >
                  Manage Jobs →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Summary */}
      <div className="card border-0 shadow-sm rounded-4 mt-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">📊 System Overview</h5>

          <div className="row text-center">
            <div className="col-md-3 col-6 mb-3 mb-md-0">
              <h4 className="fw-bold">{loading ? "..." : stats.users}</h4>
              <small className="text-muted">Users</small>
            </div>

            <div className="col-md-3 col-6 mb-3 mb-md-0">
              <h4 className="fw-bold">{loading ? "..." : stats.employers}</h4>
              <small className="text-muted">Employers</small>
            </div>

            <div className="col-md-3 col-6">
              <h4 className="fw-bold">{loading ? "..." : stats.jobs}</h4>
              <small className="text-muted">Jobs</small>
            </div>

            <div className="col-md-3 col-6">
              <h4 className="fw-bold">
                {loading ? "..." : stats.applications}
              </h4>
              <small className="text-muted">Applications</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
