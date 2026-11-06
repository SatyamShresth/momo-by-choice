import Hero from "../components/home/Hero.jsx";
import Marquee from "../components/ui/Marquee.jsx";
import MomoTypes from "../components/home/MomoTypes.jsx";
import Popular from "../components/home/Popular.jsx";
import About from "../components/home/About.jsx";
import ReviewHighlights from "../components/home/ReviewHighlights.jsx";
import VisitUs from "../components/home/VisitUs.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <MomoTypes />
      <Popular />
      <About />
      <ReviewHighlights />
      <VisitUs />
    </>
  );
}