import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/home.css";

const AVATARS = [
  ["#e8eeff", "#1e3fb8"],
  ["#ddf7f3", "#0f766e"],
  ["#fff1d6", "#b45309"],
  ["#fde8e9", "#b42318"],
  ["#ede9fe", "#5b21b6"],
];

function CompanySection() {
  const [companies, setCompanies] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get("/api/jobs");
        const counts = {};

        response.data.forEach((job) => {
          const name = job.company?.trim();
          if (!name || job.status?.toUpperCase() === "CLOSED") return;
          counts[name] = (counts[name] || 0) + 1;
        });

        const list = Object.entries(counts)
          .map(([name, openRoles]) => ({ name, openRoles }))
          .sort((a, b) => b.openRoles - a.openRoles)
          .slice(0, 8);

        setCompanies(list);
      } catch (error) {
        console.log("Companies Error:", error);
        setCompanies([]);
      }
    };

    load();
  }, []);

  if (companies && companies.length === 0) return null;

  return (
    <section className="hm-section hm-alt">
      <div className="hm-container">
        <div className="hm-head">
          <span className="hm-eyebrow">Employers</span>
          <h2>Companies hiring now</h2>
          <p>Employers with open roles on JobPortal right now.</p>
        </div>

        <div className="hm-company-grid">
          {companies === null
            ? [0, 1, 2, 3].map((i) => (
                <div className="hm-company hm-skel-box" key={i} />
              ))
            : companies.map((company) => {
                const [bg, ink] =
                  AVATARS[company.name.charCodeAt(0) % AVATARS.length];
                return (
                  <Link to="/jobs" className="hm-company" key={company.name}>
                    <div
                      className="hm-company-avatar"
                      style={{ background: bg, color: ink }}
                    >
                      {company.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{company.name}</strong>
                      <small>
                        {company.openRoles} open role
                        {company.openRoles !== 1 ? "s" : ""}
                      </small>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}

export default CompanySection;
