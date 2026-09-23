import "../styles/auth.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side */}
        <div className="auth-left">
          <h1>JobPortal</h1>

          <h2>Build Your Career With Confidence</h2>

          <p>
            Discover thousands of verified jobs, connect with top companies, and
            apply easily from one platform.
          </p>

          <div className="auth-features">
            <div>✔ 500+ Hiring Companies</div>

            <div>✔ 8,000+ Active Jobs</div>

            <div>✔ One Click Apply</div>

            <div>✔ Trusted by Thousands</div>
          </div>
        </div>

        {/* Right Side */}
        <div className="auth-right">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
