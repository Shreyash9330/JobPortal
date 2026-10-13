import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";
import JobForm from "../../components/JobForm";
import "../../styles/dashboard.css";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const d = response.data;

        setJob({
          title: d.title || "",
          company: d.company || "",
          location: d.location || "",
          salary: d.salary ?? "",
          experience: d.experience || "",
          jobType: d.jobType || "",
          skills: d.skills || "",
          description: d.description || "",
        });
      } catch (error) {
        console.log("Load Job Error:", error);

        await Swal.fire({
          icon: "error",
          title: "Unable to load job",
          text: "Job details could not be loaded.",
          confirmButtonColor: "#dc3545",
        });

        navigate("/employer/my-jobs");
      }
    };

    loadJob();
  }, [id, navigate]);

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await axios.put(`/api/jobs/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Swal.fire({
        icon: "success",
        title: "Job updated!",
        text: "The job details have been saved.",
        confirmButtonColor: "#2f5bea",
        confirmButtonText: "Back to my jobs",
      });

      navigate("/employer/my-jobs");
    } catch (error) {
      console.log("Update Job Error:", error);

      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Unable to update the job. Please try again.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!job) {
    return (
      <div className="db-page">
        <div className="db-loading">
          <div className="spinner-border text-primary" />
          <span>Loading job details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="db-page">
      <div className="db-form-wrap">
        <div className="db-head">
          <div>
            <div className="db-eyebrow">Employer</div>
            <h1>Edit job</h1>
            <p>Update the job information below.</p>
          </div>

          <div className="db-head-actions">
            <Link to="/employer/my-jobs" className="btn btn-outline-primary">
              My jobs
            </Link>
          </div>
        </div>

        <div className="db-card">
          <JobForm
            initial={job}
            submitLabel="Save changes"
            busyLabel="Saving..."
            busy={saving}
            onSubmit={handleSubmit}
            cancelTo="/employer/my-jobs"
          />
        </div>
      </div>
    </div>
  );
}

export default EditJob;
