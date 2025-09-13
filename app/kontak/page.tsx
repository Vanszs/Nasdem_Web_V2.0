import NasdemHeader from "@/components/nasdem-header"
import NasdemFooter from "@/components/nasdem-footer"
import { ContactSection } from "@/components/contact-section-new"

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />
      <main>
        <ContactSection />
      </main>
      <NasdemFooter />
    </div>
  )
}
