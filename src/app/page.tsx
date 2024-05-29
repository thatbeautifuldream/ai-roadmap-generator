import RoadmapHero from "@/components/landing/roadmap-hero";
import RoadmapFeatures from "@/components/landing/roadmap-features";
import RoadmapTestimonial from "@/components/testimonials/roadmap-testimonial";
import RoadmapTeam from "@/components/landing/roadmap-team";
import RoadmapFooter from "@/components/landing/roadmap-footer";
import RoadmapStats from "@/components/landing/roadmap-stats";
import CTA from "@/components/marketing/cta";

export default function Home() {
  return (
    <>
      <RoadmapHero />
      <RoadmapFeatures />
      <RoadmapStats />
      <RoadmapTestimonial />
      <CTA />
      <RoadmapTeam />
      <RoadmapFooter />
    </>
  );
}
