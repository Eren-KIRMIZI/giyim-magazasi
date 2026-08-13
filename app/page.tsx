import HeroSection from "@/components/store/HeroSection";
import NewArrivalsSection from "@/components/store/NewArrivalsSection";
import CollectionsSection from "@/components/store/CollectionsSection";

export default function HomePage() {
  return (
    <div className="w-full max-w-container-max mx-auto">
      <HeroSection />
      <NewArrivalsSection />
      <CollectionsSection />
    </div>
  );
}
