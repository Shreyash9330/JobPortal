import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";

const toCount = (data) =>
  Array.isArray(data) ? data.length : Number(data) || 0;

function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const results = await Promise.allSettled([
        axios.get("/api/users/count"),
        axios.get("/api/employer"),
        axios.get("/api/jobs/count"),
        axios.get("/api/applications/count"),
      ]);

      const value = (r) =>
        r.status === "fulfilled" ? toCount(r.value.data) : null;

      setStats([
        { label: "Registered users", value: value(results[0]) },
        { label: "Employers", value: value(results[1]) },
        { label: "Jobs posted", value: value(results[2]) },
        { label: "Applications", value: value(results[3]) },
      ]);
    };

    load();
  }, []);

  if (stats && stats.every((s) => s.value === null)) return null;

  return (
    <section className="hm-stats">
      <div className="hm-container">
        <div className="hm-head light">
          <h2>JobPortal at a glance</h2>
          <p>Live numbers straight from the database.</p>
        </div>

        <div className="hm-stats-grid">
          {(stats || [0, 1, 2, 3]).map((item, i) =>
            item.value === null ? null : (
              <div className="hm-stat" key={item.label || i}>
                {stats ? (
                  <>
                    <div className="hm-stat-n">
                      {item.value.toLocaleString("en-IN")}
                    </div>
                    <div className="hm-stat-l">{item.label}</div>
                  </>
                ) : (
                  <>
                    <div className="hm-skel-line big" />
                    <div className="hm-skel-line" />
                  </>
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default Stats;
