import LoadingScreen from "@/components/landing/LoadingScreen";
import ScrollProgress from "@/components/landing/ScrollProgress";
import CursorGlow from "@/components/landing/CursorGlow";
import Hero from "@/components/landing/Hero";
import Drinks from "@/components/landing/Drinks";
import Features from "@/components/landing/Features";
import Story from "@/components/landing/Story";
import Gallery from "@/components/landing/Gallery";
import Testimonials from "@/components/landing/Testimonials";
import AppPromo from "@/components/landing/AppPromo";
import Location from "@/components/landing/Location";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <CursorGlow />
      <ScrollProgress />
      <Hero />
      <Drinks />
      <Features />
      <Story />
      <Gallery />
      <Testimonials />
      <AppPromo />
      <Location />
      <Newsletter />
      <Footer />
    </>
  );
}
