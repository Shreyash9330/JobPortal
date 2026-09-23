import { useEffect, useState } from "react";
import axios from "axios";

function ViewApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/applications",
        );

        setApplications(response.data);
      } catch (error) {
        console.log(error);
        alert("Failed to load applications");
      }
    };

    loadApplications();
  }, []);
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/applications/${id}/status?status=${status}`,
      );

      alert("Status Updated");

      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Applications</h1>

      {applications.map((app) => (
        <div
          key={app.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>Application ID:</strong> {app.id}
          </p>
          <p>
            <strong>User:</strong> {app.userEmail}
          </p>
          <p>
            <p>
              <strong>Job:</strong> {app.jobTitle}
            </p>
          </p>
          <p>
            <strong>Status:</strong>

            <span
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                color: "white",
                backgroundColor:
                  app.status === "APPLIED"
                    ? "blue"
                    : app.status === "SHORTLISTED"
                      ? "orange"
                      : app.status === "SELECTED"
                        ? "green"
                        : app.status === "REJECTED"
                          ? "red"
                          : "gray",
              }}
            >
              {app.status}
            </span>
          </p>
          <p>
            <strong>Resume:</strong>

            <a
              href={`http://localhost:8080/uploads/${app.resumePath}`}
              target="_blank"
              rel="noreferrer"
            >
              View Resume
            </a>
          </p>

          <select
            onChange={(e) => updateStatus(app.id, e.target.value)}
            defaultValue=""
          >
            <option value="">Change Status</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="REJECTED">Rejected</option>
            <option value="SELECTED">Selected</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default ViewApplications;
