import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedProjects from "@/components/landing/FeaturedProjects";
import Testimonials from "@/components/landing/Testimonials";
import StatsBar from "@/components/landing/StatsBar";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

const LandingPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <HeroSection />
      <WhyChooseUs />
      <HowItWorks />
      <FeaturedProjects />
      <StatsBar />
      <Testimonials />
      <FAQSection />
    </main>
    <Footer />
  </div>
);

export default LandingPage;
