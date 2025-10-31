import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";
import NasdemHero from "@/components/nasdem-hero";
import { AboutSection } from "@/components/about-section";
import { ProgramsSection } from "@/components/programs-section";
import { GallerySection } from "@/components/gallery-section";
import { LoadingFallback } from "@/components/loading-fallback";
import { Suspense } from "react";

type LandingData = {
  heroBanners: Array<{ id: number; imageUrl: string; order?: number }>;
  about: {
    vision?: string | null;
    mission?: string | null;
    videoUrl?: string | null;
  } | null;
  programs: Array<{
    id: number;
    name: string;
    description?: string | null;
    category?: string | null;
    status?: string | null;
    photoUrl?: string | null;
  }>;
  activities: Array<{
    id: number;
    title: string;
    description?: string | null;
    category?: string | null;
    media: Array<{
      id: number;
      type: "image" | "video";
      url: string;
      caption?: string | null;
    }>;
  }>;
};

async function getLandingData(): Promise<LandingData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/landing-data`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Gagal memuat data landing");
  const json = await res.json();
  return json.data as LandingData;
}

export default async function HomePage() {
  const data = await getLandingData();
  const { heroBanners, about, programs, activities } = data;

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingFallback />}>
        <main>
          <NasdemHero banners={heroBanners} />
          <AboutSection about={about ?? undefined} />
          <ProgramsSection programs={programs} />
          <GallerySection activities={activities} />
        </main>
      </Suspense>
    </div>
  );
}
