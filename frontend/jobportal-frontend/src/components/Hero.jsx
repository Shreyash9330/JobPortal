import "./../styles/hero.css";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        {/* Left Side */}
        <div className="hero-content">
          <span className="hero-tag">🚀 India's Trusted Job Portal</span>

          <h1>
            Find Your <span>Dream Job</span>
            <br />
            With Top Companies
          </h1>

          <p>
            Discover thousands of verified jobs from leading companies across
            India. Apply quickly and build your career with confidence.
          </p>

          <div className="hero-buttons">
            <Link to="/jobs" className="btn btn-primary btn-lg">
              Browse Jobs
            </Link>

            <Link
              to="/register-choice"
              className="btn btn-outline-primary btn-lg"
            >
              Get Started
              <FaArrowRight className="ms-2" />
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700"
            alt="Hero"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
