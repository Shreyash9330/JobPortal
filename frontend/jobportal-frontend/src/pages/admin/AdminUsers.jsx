import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUserShield, FaSearch, FaTrashAlt } from "react-icons/fa";
import StatusBadge from "../../components/StatusBadge";
import "../../styles/dashboard.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.log("Users Error:", error);

        Swal.fire({
          icon: "error",
          title: "Failed to Load Users",
          text: "Unable to fetch users.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id, name) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete ${name || "this user"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/users/${id}`);

      setUsers((prev) => prev.filter((user) => user.id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "User deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log("Delete User Error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Unable to delete the user.",
      });
    }
  };

  const q = query.trim().toLowerCase();
  const visible = users.filter(
    (u) =>
      !q ||
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.role || "").toLowerCase().includes(q),
  );

  return (
    <div className="db-page">
      <div className="db-head">
        <div>
          <div className="db-eyebrow">
            <FaUserShield /> Administration
          </div>
          <h1>Manage users</h1>
          <p>View registered users and their roles.</p>
        </div>

        <div className="db-head-actions">
          <Link to="/admin" className="btn btn-outline-primary">
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="db-card">
        <div className="db-toolbar">
          <div className="db-search">
            <FaSearch />
            <input
              type="text"
              className="form-control"
              placeholder="Search name, email or role"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search users"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="db-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="spinner-border text-primary" />
                    <p className="db-cell-sub mt-2 mb-0">Loading users...</p>
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 db-cell-sub">
                    No users found.
                  </td>
                </tr>
              ) : (
                visible.map((user) => (
                  <tr key={user.id}>
                    <td className="db-cell-sub">{user.id}</td>
                    <td className="db-cell-title">{user.name || "—"}</td>
                    <td>{user.email}</td>
                    <td>
                      <StatusBadge status={user.role} />
                    </td>
                    <td className="db-actions-cell">
                      {user.role === "ADMIN" ? (
                        <span className="db-cell-sub">Protected</span>
                      ) : (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteUser(user.id, user.name)}
                        >
                          <FaTrashAlt className="me-1" />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="db-foot">
            Showing {visible.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
