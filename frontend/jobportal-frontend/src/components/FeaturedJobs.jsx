import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import JobCard from "./JobCard";
import "../styles/featuredJobs.css";

function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get("http://localhost:8080/api/jobs");

        // Latest 6 jobs
        const latestJobs = response.data.slice().reverse().slice(0, 6);

        setJobs(latestJobs);
      } catch (error) {
        console.log("Featured Jobs Error:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  return (
    <section className="featured-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-title text-center mb-5">
          <h2>🔥 Featured Jobs</h2>

          <p>Discover the latest opportunities from top companies.</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3"></div>

            <h5 className="text-muted">Loading latest jobs...</h5>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-5">
            <div style={{ fontSize: "45px" }}>⚠️</div>

            <h5 className="fw-bold mt-3">Unable to Load Jobs</h5>

            <p className="text-muted">Please try again later.</p>

            <Link to="/jobs" className="btn btn-primary">
              Browse All Jobs
            </Link>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: "50px" }}>💼</div>

            <h5 className="fw-bold mt-3">No Jobs Available</h5>

            <p className="text-muted">
              New job opportunities will appear here.
            </p>

            <Link to="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Jobs */}
        {!loading && !error && jobs.length > 0 && (
          <>
            <div className="row g-4">
              {jobs.map((job) => (
                <div className="col-xl-4 col-lg-4 col-md-6" key={job.id}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>

            {/* View All */}
            <div className="text-center mt-5">
              <Link to="/jobs" className="btn btn-outline-primary px-4">
                View All Jobs →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default FeaturedJobs;
