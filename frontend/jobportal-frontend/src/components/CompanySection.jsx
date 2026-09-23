import "../styles/companySection.css";

import googleLogo from "../assets/images/companies/google.svg";
import microsoftLogo from "../assets/images/companies/microsoft.svg";
import amazonLogo from "../assets/images/companies/amazon.svg";
import ibmLogo from "../assets/images/companies/ibm.svg";
import infosysLogo from "../assets/images/companies/infosys.svg";
import tcsLogo from "../assets/images/companies/tcs.svg";
import accentureLogo from "../assets/images/companies/accenture.svg";
import capgeminiLogo from "../assets/images/companies/capgemini.svg";
import cognizantLogo from "../assets/images/companies/cognizant.svg";
import wiproLogo from "../assets/images/companies/wipro.svg";

const companies = [
  { name: "Google", logo: googleLogo },
  { name: "Microsoft", logo: microsoftLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "IBM", logo: ibmLogo },
  { name: "Infosys", logo: infosysLogo },
  { name: "TCS", logo: tcsLogo },
  { name: "Accenture", logo: accentureLogo },
  { name: "Capgemini", logo: capgeminiLogo },
  { name: "Cognizant", logo: cognizantLogo },
  { name: "Wipro", logo: wiproLogo },
];

function CompanySection() {
  return (
    <section className="company-section">
      <div className="container">
        <div className="section-title text-center mb-5">
          <p className="text-primary fw-semibold mb-2">Trusted Companies</p>

          <h2 className="fw-bold mb-2">Companies Hiring on JobPortal</h2>

          <p className="text-muted mb-0">
            Explore opportunities from leading companies.
          </p>
        </div>

        <div className="row g-3 g-md-4 justify-content-center">
          {companies.map((company) => (
            <div
              className="col-xl-2 col-lg-2 col-md-3 col-6"
              key={company.name}
            >
              <div className="company-card h-100">
                <div className="company-logo-wrapper">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    loading="lazy"
                  />
                </div>

                <h6>{company.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CompanySection;
