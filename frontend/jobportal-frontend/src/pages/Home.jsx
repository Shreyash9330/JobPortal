import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import FeaturedJobs from "../components/FeaturedJobs";
import CompanySection from "../components/CompanySection";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import Stats from "../components/Stats";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Hero />
      <SearchBar />
      <FeaturedJobs />

      <section id="companies">
        <CompanySection />
      </section>

      <HowItWorks />
      <WhyChooseUs />
      <Stats />
      <Footer />
    </>
  );
}

export default Home;
