import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import "../styles/search.css";

function SearchBar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/jobs", { state: { search, location, jobType } });
  };

  return (
    <section className="search-section">
      <div className="search-wrap">
        <form className="search-card" onSubmit={handleSearch}>
          <div className="search-input">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Job title or keyword"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Job title or keyword"
            />
          </div>

          <div className="search-input">
            <FaMapMarkerAlt className="search-icon" />
            <select
              className="form-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Location"
            >
              <option value="">All locations</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="search-input">
            <FaBriefcase className="search-icon" />
            <select
              className="form-select"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              aria-label="Job type"
            >
              <option value="">All job types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <button type="submit" className="search-btn">
            Search jobs
          </button>
        </form>
      </div>
    </section>
  );
}

export default SearchBar;
