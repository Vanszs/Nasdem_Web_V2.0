import NasdemHeader from "@/components/nasdem-header"
import NasdemFooter from "@/components/nasdem-footer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"

export default function GaleriPage() {
  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />

      {/* Header */}
      <section className="bg-nasdem-blue text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Galeri Kegiatan</h1>
          <p className="text-xl text-white/90">Dokumentasi kegiatan dan program NasDem Sidoarjo</p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["Semua", "Program Kerja", "Kegiatan Sosial", "Rapat", "Kampanye", "Pelatihan"].map((filter) => (
              <Button
                key={filter}
                variant={filter === "Semua" ? "default" : "outline"}
                className={
                  filter === "Semua"
                    ? "bg-nasdem-orange text-white"
                    : "border-nasdem-orange text-nasdem-orange hover:bg-nasdem-orange hover:text-white"
                }
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((item) => (
              <div
                key={item}
                className="relative group overflow-hidden rounded-lg bg-white shadow-lg border-2 border-nasdem-blue/20 hover:border-nasdem-blue/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={`/placeholder.svg?height=250&width=300&query=NasDem Sidoarjo political event ${item}`}
                  alt={`Galeri ${item}`}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-nasdem-blue/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" className="bg-white text-nasdem-blue hover:bg-nasdem-orange hover:text-white">
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-nasdem-blue mb-1">Kegiatan Program Kerja {item}</h3>
                  <p className="text-sm text-gray-500">15 Januari 2025</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <Button variant="outline" size="sm" className="border-nasdem-orange text-nasdem-orange bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="sm"
                className={page === 1 ? "bg-nasdem-orange text-white" : "border-nasdem-orange text-nasdem-orange"}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="border-nasdem-orange text-nasdem-orange bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <NasdemFooter />
    </div>
  )
}
