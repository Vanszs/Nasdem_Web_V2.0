"use client"

import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"

// Static news data
const newsData = [
  {
    id: "1",
    title: "Silaturahmi & Diskusi dengan PD Muhammadiyah Sidoarjo",
    excerpt: "Membahas pendidikan inklusif, ekonomi kerakyatan, dan program pemberdayaan masyarakat bersama PD Muhammadiyah Sidoarjo.",
    date: "25 Juli 2025",
    author: "Tim Media",
    category: "Kerja Sama",
    image: "/placeholder.jpg",
    featured: true
  },
  {
    id: "2",
    title: "Launching Program Ekonomi Kerakyatan",
    excerpt: "NasDem Sidoarjo meluncurkan program pemberdayaan ekonomi masyarakat untuk mendukung UMKM lokal.",
    date: "20 Juli 2025",
    author: "Humas NasDem",
    category: "Program",
    image: "/placeholder.jpg"
  },
  {
    id: "3",
    title: "Rapat Koordinasi DPC Se-Sidoarjo",
    excerpt: "Membahas strategi politik dan persiapan program kerja untuk periode mendatang.",
    date: "18 Juli 2025",
    author: "Sekretariat DPD",
    category: "Internal",
    image: "/placeholder.jpg"
  },
  {
    id: "4",
    title: "Bakti Sosial di Kecamatan Taman",
    excerpt: "Kegiatan bakti sosial berupa santunan anak yatim dan pembagian sembako untuk masyarakat kurang mampu.",
    date: "15 Juli 2025",
    author: "DPC Taman",
    category: "Sosial",
    image: "/placeholder.jpg"
  }
]

export default function NewsHomepage() {
  const featuredNews = newsData.find(newsItem => newsItem.featured) || newsData[0]
  const regularNews = newsData.filter(newsItem => !newsItem.featured).slice(0, 3)

  return (
    <section id="berita" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-4">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span className="text-primary text-sm font-medium">Berita Terkini</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Berita & <span className="text-secondary">Kegiatan</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ikuti perkembangan terbaru dan kegiatan DPD NasDem Sidoarjo
          </p>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-primary/10">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-video md:aspect-square relative overflow-hidden">
                  <img
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredNews.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{featuredNews.author}</span>
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-3 line-clamp-2">
                    {featuredNews.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {featuredNews.excerpt}
                  </p>
                  <Button className="self-start bg-primary hover:bg-primary/90">
                    Baca Selengkapnya
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular News Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {regularNews.slice(0, 3).map((newsItem) => (
            <div
              key={newsItem.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-primary/10 hover:border-secondary/30"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <div className="bg-primary/90 text-white px-2 py-1 rounded text-xs font-medium">
                    {newsItem.category}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{newsItem.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{newsItem.author}</span>
                  </div>
                </div>
                <h4 className="font-bold text-primary mb-2 line-clamp-2 text-sm">
                  {newsItem.title}
                </h4>
                <p className="text-muted-foreground text-xs line-clamp-3 mb-3">
                  {newsItem.excerpt}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-primary/20 hover:bg-primary hover:text-white"
                >
                  Baca Lebih Lanjut
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="hover-fade-up font-semibold border-nasdem-blue bg-nasdem-blue/5 text-nasdem-blue hover:bg-nasdem-blue hover:text-white px-8 py-3" 
            onClick={() => window.location.href = '/berita'}
          >
            Lihat Semua Berita
          </Button>
        </div>
      </div>
    </section>
  )
}
