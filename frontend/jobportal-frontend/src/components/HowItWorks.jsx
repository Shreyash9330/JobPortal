import "../styles/home.css";

const STEPS = [
  {
    n: "1",
    title: "Create your account",
    text: "Sign up as a job seeker or an employer in under a minute.",
  },
  {
    n: "2",
    title: "Find and apply",
    text: "Filter jobs by title, location, type and experience, then apply with your PDF resume.",
  },
  {
    n: "3",
    title: "Track everything",
    text: "Seekers follow their applications. Employers review applicants from their dashboard.",
  },
];

function HowItWorks() {
  return (
    <section className="hm-section">
      <div className="hm-container">
        <div className="hm-head">
          <span className="hm-eyebrow">How it works</span>
          <h2>From sign-up to offer, in three steps</h2>
        </div>

        <div className="hm-steps">
          {STEPS.map((step) => (
            <div className="hm-step" key={step.n}>
              <div className="hm-step-n">{step.n}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
