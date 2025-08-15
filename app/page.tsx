import NasdemHeader from "@/components/nasdem-header"
import NasdemFooter from "@/components/nasdem-footer"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProgramsSection } from "@/components/programs-section"
import NewsHomepage from "@/components/news-homepage"
import { GallerySection } from "@/components/gallery-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <NewsHomepage />
        <GallerySection />
      </main>
      <NasdemFooter />
    </div>
  )
}
