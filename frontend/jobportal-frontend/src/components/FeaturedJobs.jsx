import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import JobListingCard, { JobCardSkeleton } from "./JobListingCard";
import "../styles/featuredjobs.css";

function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const wake = setTimeout(() => setSlow(true), 4000);

    const loadJobs = async () => {
      try {
        const response = await axios.get("/api/jobs");
        // Latest 6 jobs
        setJobs(response.data.slice().reverse().slice(0, 6));
      } catch (err) {
        console.log("Featured Jobs Error:", err);
        setError(true);
      } finally {
        clearTimeout(wake);
        setSlow(false);
        setLoading(false);
      }
    };

    loadJobs();
    return () => clearTimeout(wake);
  }, []);

  return (
    <section className="featured-section">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2>Latest openings</h2>
          <p>Fresh opportunities from employers on JobPortal.</p>
        </div>

        {loading && slow && (
          <div className="jl-wake">
            <strong>Server is waking up.</strong> This demo runs on free
            hosting, so the first load can take up to a minute.
          </div>
        )}

        {loading && (
          <div className="jl-grid">
            {[0, 1, 2].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="jl-empty">
            <h4>Unable to load jobs</h4>
            <p>Please try again in a moment.</p>
            <Link to="/jobs" className="jl-btn primary">
              Browse all jobs
            </Link>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="jl-empty">
            <h4>No jobs available yet</h4>
            <p>New job opportunities will appear here.</p>
            <Link to="/jobs" className="jl-btn primary">
              Browse jobs
            </Link>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <>
            <div className="jl-grid">
              {jobs.map((job) => (
                <JobListingCard key={job.id} job={job} linkTo="/jobs" />
              ))}
            </div>

            <div className="text-center mt-5">
              <Link to="/jobs" className="jl-btn ghost">
                View all jobs →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default FeaturedJobs;
