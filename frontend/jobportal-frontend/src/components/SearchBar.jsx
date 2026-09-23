import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/search.css";
import { FaSearch, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

function SearchBar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    navigate("/jobs", {
      state: {
        search,
        location,
      },
    });
  };

  return (
    <section className="search-section">
      <div className="container">
        <div className="search-card">
          <div className="row g-3 align-items-center">
            {/* Job Title */}
            <div className="col-lg-4">
              <div className="search-input">
                <FaSearch className="search-icon" />

                <input
                  type="text"
                  className="form-control"
                  placeholder="Job title or keyword"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Location */}
            <div className="col-lg-3">
              <div className="search-input">
                <FaMapMarkerAlt className="search-icon" />

                <select
                  className="form-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div className="col-lg-3">
              <div className="search-input">
                <FaBriefcase className="search-icon" />

                <select className="form-select">
                  <option value="">Select Category</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="col-lg-2 d-grid">
              <button className="btn btn-primary btn-lg" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
