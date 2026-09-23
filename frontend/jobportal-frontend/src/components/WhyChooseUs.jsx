import {
  FaSearch,
  FaShieldAlt,
  FaBuilding,
  FaPaperPlane,
} from "react-icons/fa";
import "../styles/whyChooseUs.css";

function WhyChooseUs() {
  const features = [
    {
      icon: <FaSearch />,
      title: "Easy Job Search",
      description:
        "Search and filter job opportunities by title, location, job type, and experience.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Role-Based Access",
      description:
        "Separate dashboards and access for job seekers, employers, and administrators.",
    },
    {
      icon: <FaBuilding />,
      title: "Employer Profiles",
      description:
        "Employers can create company profiles and manage their posted job opportunities.",
    },
    {
      icon: <FaPaperPlane />,
      title: "Easy Applications",
      description:
        "Upload your resume and apply for suitable jobs directly from the platform.",
    },
  ];

  return (
    <section className="why-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <p className="text-primary fw-semibold mb-2">Platform Features</p>

          <h2 className="fw-bold mb-2">Why Choose JobPortal?</h2>

          <p className="text-muted mb-0">
            Everything you need to search, post, and manage jobs in one place.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-xl-3 col-lg-3 col-md-6" key={index}>
              <div className="feature-card h-100">
                <div className="feature-icon">{feature.icon}</div>

                <h4>{feature.title}</h4>

                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
