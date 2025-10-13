import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";
import NewsDetailClient from "./NewsDetailClient";

export default function BeritaDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />
      <main>
        <NewsDetailClient />
      </main>
      <NasdemFooter />
    </div>
  );
}
