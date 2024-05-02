import RoadmapHero from "@/components/landing/roadmap-hero";
import RoadmapFeatures from "@/components/landing/roadmap-features";
import RoadmapTestimonial from "@/components/testimonials/roadmap-testimonial";
import RoadmapPricing from "@/components/landing/roadmap-pricing";
import RoadmapTeam from "@/components/landing/roadmap-team";
import RoadmapFooter from "@/components/landing/roadmap-footer";
import RoadmapStats from "@/components/landing/roadmap-stats";
import Confetti from "@/components/landing/roadmap-confetti";

export default function Home() {
  return (
    <>
      <Confetti />
      <RoadmapHero />
      <RoadmapFeatures />
      <RoadmapStats />
      <RoadmapTestimonial />
      <RoadmapPricing />
      <RoadmapTeam />
      <RoadmapFooter />
    </>
  );
}
