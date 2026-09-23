import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
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
      await axios.delete(`http://localhost:8080/api/users/${id}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

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

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <p className="text-primary fw-semibold mb-1">👥 Administration</p>

          <h2 className="fw-bold mb-1">Manage Users</h2>

          <p className="text-muted mb-0">
            View and manage registered users and their roles.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/admin")}
        >
          ← Dashboard
        </button>
      </div>

      {/* Users Card */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="px-4">ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="spinner-border text-primary"></div>
                      <p className="text-muted mt-2 mb-0">Loading users...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 fw-semibold">{user.id}</td>

                      <td>{user.name || "—"}</td>

                      <td>{user.email}</td>

                      <td>
                        <span
                          className={`badge ${
                            user.role === "ADMIN"
                              ? "bg-danger"
                              : user.role === "EMPLOYER"
                                ? "bg-success"
                                : "bg-primary"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="text-center">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteUser(user.id, user.name)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-muted mt-3">
          Total Users: <strong>{users.length}</strong>
        </p>
      )}
    </div>
  );
}

export default AdminUsers;
