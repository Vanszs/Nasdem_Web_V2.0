import NasdemHeader from "@/components/nasdem-header"
import NasdemFooter from "@/components/nasdem-footer"
import { VisiMisiSection } from "@/components/visi-misi-section"

export default function VisiMisiPage() {
  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />
      <main>
        <VisiMisiSection />
      </main>
      <NasdemFooter />
    </div>
  )
}
