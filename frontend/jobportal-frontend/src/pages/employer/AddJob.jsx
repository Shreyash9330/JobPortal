import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import JobForm from "../../components/JobForm";
import "../../styles/dashboard.css";

function AddJob() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (job) => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "/api/jobs",
        { ...job, employerEmail: localStorage.getItem("email") },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await Swal.fire({
        icon: "success",
        title: "Job posted!",
        text: "Your job is now live.",
        confirmButtonColor: "#2f5bea",
        confirmButtonText: "View my jobs",
      });

      navigate("/employer/my-jobs");
    } catch (error) {
      console.log("Add Job Error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to post job",
        text: "Unable to add the job. Please try again.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="db-page">
      <div className="db-form-wrap">
        <div className="db-head">
          <div>
            <div className="db-eyebrow">Employer</div>
            <h1>Post a new job</h1>
            <p>Find the right candidate for your company.</p>
          </div>

          <div className="db-head-actions">
            <Link to="/employer/dashboard" className="btn btn-outline-primary">
              Dashboard
            </Link>
          </div>
        </div>

        <div className="db-card">
          <JobForm
            submitLabel="Post job"
            busyLabel="Posting..."
            busy={saving}
            onSubmit={handleSubmit}
            cancelTo="/employer/my-jobs"
          />
        </div>
      </div>
    </div>
  );
}

export default AddJob;
