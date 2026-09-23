import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import FeaturedJobs from "../components/FeaturedJobs";
import CompanySection from "../components/CompanySection";
import Stats from "../components/Stats";
import WhyChooseUs from "../components/WhyChooseUs";
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

      <Stats />
      <WhyChooseUs />
      <Footer />
    </>
  );
}

export default Home;
