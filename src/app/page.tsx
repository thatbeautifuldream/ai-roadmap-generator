import Confetti from "@/components/landing/roadmap-confetti";
import RoadmapFeatures from "@/components/landing/roadmap-features";
import RoadmapFooter from "@/components/landing/roadmap-footer";
import RoadmapHero from "@/components/landing/roadmap-hero";
import RoadmapPricing from "@/components/landing/roadmap-pricing";
import RoadmapTeam from "@/components/landing/roadmap-team";

export default function Home() {
  return (
    <>
      <Confetti />
      <RoadmapHero />
      <RoadmapFeatures />
      <RoadmapPricing />
      <RoadmapTeam />
      <RoadmapFooter />
    </>
  );
}
