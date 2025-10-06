import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";
import NasdemHero from "@/components/nasdem-hero";
import { AboutSection } from "@/components/about-section";
import { ProgramsSection } from "@/components/programs-section";
import NewsHomepage from "@/components/news-homepage";
import { GallerySection } from "@/components/gallery-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />
      <main>
        <NasdemHero />
        <AboutSection />
        <ProgramsSection />
        <NewsHomepage />
        <GallerySection />
      </main>
      <NasdemFooter />
    </div>
  );
}
