import "../styles/home.css";

function Icon({ children }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const FEATURES = [
  {
    title: "Smart job search",
    text: "Filter by title, location, job type and experience to find the right fit fast.",
    icon: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
  },
  {
    title: "Role-based access",
    text: "Separate dashboards and permissions for job seekers, employers and admins.",
    icon: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Employer profiles",
    text: "Employers create a company profile and manage every job they post.",
    icon: (
      <>
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
      </>
    ),
  },
  {
    title: "Simple applications",
    text: "Upload a PDF resume and apply directly. See your status any time.",
    icon: (
      <>
        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
        <path d="m21.854 2.147-10.94 10.939" />
      </>
    ),
  },
];

function WhyChooseUs() {
  return (
    <section className="hm-section hm-alt">
      <div className="hm-container">
        <div className="hm-head">
          <span className="hm-eyebrow">Platform features</span>
          <h2>Everything you need in one place</h2>
          <p>Search, post and manage jobs without the clutter.</p>
        </div>

        <div className="hm-features">
          {FEATURES.map((feature) => (
            <div className="hm-feature" key={feature.title}>
              <div className="hm-feature-icon">
                <Icon>{feature.icon}</Icon>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
