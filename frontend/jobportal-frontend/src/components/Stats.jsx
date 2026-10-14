import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";

function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/stats");
        setStats([
          { label: "Registered users", value: data.users },
          { label: "Employers", value: data.employers },
          { label: "Jobs posted", value: data.jobs },
          { label: "Applications", value: data.applications },
        ]);
      } catch {
        setStats([{ label: "", value: null }]);
      }
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
