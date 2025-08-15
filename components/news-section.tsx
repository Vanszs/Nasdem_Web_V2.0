"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

export function NewsSection() {
  const news = [
    {
      title: "Kerja Sama Strategis dengan PD Muhammadiyah Sidoarjo",
      excerpt: "Silaturahmi dan diskusi membahas pendidikan inklusif, ekonomi kerakyatan, dan pemberdayaan UMKM.",
      date: "25 Juli 2025",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Pembukaan Pendaftaran NasDem Muda 2025",
      excerpt: "Program kaderisasi untuk pemuda 17-30 tahun dengan fokus edukasi politik dan kepemimpinan.",
      date: "25 Maret 2025",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Aksi Sosial Fogging dan Bantuan Sembako",
      excerpt: "NasDem Muda melakukan fogging anti DBD dan pembagian sembako di Desa Sidorejo, Krian.",
      date: "15 Juli 2025",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <section id="berita" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Berita & Kegiatan Terbaru</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ikuti perkembangan terbaru kegiatan dan program DPD NasDem Sidoarjo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {news.map((item, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="overflow-hidden rounded-t-lg">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  {item.date}
                </div>
                <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{item.excerpt}</p>
                <Button
                  variant="ghost"
                  className="hover-fade-up p-0 h-auto text-accent hover:text-white hover:bg-nasdem-blue group"
                >
                  Baca Selengkapnya
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in-up">
          <Button
            variant="outline"
            size="lg"
            className="hover-fade-up font-semibold border-nasdem-blue bg-nasdem-blue/5 text-nasdem-blue hover:bg-nasdem-blue hover:text-white px-8 py-3"
            onClick={() => (window.location.href = "/berita")}
          >
            Lihat Semua Berita
          </Button>
        </div>
      </div>
    </section>
  )
}
