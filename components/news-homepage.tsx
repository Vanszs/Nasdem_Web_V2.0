"use client"

import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface NewsItem {
  id: string
  title: string
  excerpt: string
  image_url: string
  created_at: string
  users: {
    full_name: string
  }
}

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
    title: "Pembukaan Pendaftaran NasDem Muda 2025",
    excerpt: "Program kaderisasi untuk pemuda 17-30 tahun dengan fokus edukasi politik dan pelatihan kepemimpinan.",
    date: "25 Maret 2025",
    author: "Sekretariat DPD",
    category: "Kaderisasi"
  },
  {
    id: "3",
    title: "Aksi Fogging & Bantuan Sembako di Desa Sidorejo",
    excerpt: "Bersama NasDem Muda melakukan pencegahan DBD dan memberikan bantuan kepada warga Krian.",
    date: "Juli 2025",
    author: "NasDem Muda",
    category: "Aksi Sosial"
  },
  {
    id: "4",
    title: "Penyaluran 709 Ton Benih Padi ke 103 Kelompok Tani",
    excerpt: "Dukungan swasembada pangan melalui pemberdayaan kelompok tani di seluruh Sidoarjo.",
    date: "2025",
    author: "Bidang Ekonomi",
    category: "Ekonomi"
  },
  {
    id: "5",
    title: "Catatan Fraksi NasDem-Demokrat atas RPJMD Sidoarjo 2025-2029",
    excerpt: "Memberikan masukan konstruktif terkait sinkronisasi program dan penyelarasan antar sektor.",
    date: "2025",
    author: "Fraksi DPRD",
    category: "Kebijakan"
  }
]

export default function NewsHomepage() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    const supabase = createClient()
    
    // Check if Supabase is configured
    if (!supabase || typeof supabase.from !== 'function') {
      console.warn("Supabase is not configured. Using mock data.")
      // Use static news data when Supabase is not configured
      setNews(newsData)
      setLoading(false)
      return
    }
    
    const { data, error } = await supabase
      .from("news")
      .select(`
        id,
        title,
        excerpt,
        image_url,
        created_at,
        users!author_id (
          full_name
        )
      `)
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(5)

    if (data && data.length > 0) {
      setNews(data)
    } else {
      // Fallback to static data if no data from database
      setNews(newsData)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <section id="berita" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading berita...</div>
          </div>
        </div>
      </section>
    )
  }

  const featuredNews = news.find(newsItem => newsItem.featured) || news[0]
  const regularNews = news.filter(newsItem => !newsItem.featured).slice(0, 3)

  return (
    <section id="berita" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-4 py-2 mb-4">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span className="text-primary text-sm font-medium">Berita Terkini</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Berita & <span className="text-secondary">Kegiatan</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ikuti perkembangan terbaru kegiatan dan program kerja DPD NasDem Sidoarjo.
          </p>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <div className="mb-16">
            <div className="bg-card rounded-2xl overflow-hidden border shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.16)] transition-shadow">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img
                    src={featuredNews.image_url || featuredNews.image || "/placeholder.svg"}
                    alt={featuredNews.title}
                    className="w-full h-64 lg:h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-destructive text-destructive-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-secondary/10 text-secondary text-xs font-medium px-3 py-1 rounded-full">
                      {featuredNews.category || "Berita Utama"}
                    </span>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar size={14} />
                      <span>{featuredNews.date || new Date(featuredNews.created_at).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                    {featuredNews.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredNews.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <User size={14} />
                      <span>{featuredNews.author || featuredNews.users?.full_name}</span>
                    </div>
                    <Button variant="secondary" className="hover-scale group">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {regularNews.slice(0, 3).map((newsItem) => (
            <article 
              key={newsItem.id}
              className="bg-card rounded-xl border hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                    {newsItem.category || "Berita"}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock size={12} />
                    <span>{newsItem.date || new Date(newsItem.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {newsItem.title}
                </h4>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                  {newsItem.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <User size={12} />
                    <span>{newsItem.author || newsItem.users?.full_name}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-secondary p-0 h-auto font-medium">
                    Baca →
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="hover-scale font-semibold border-primary bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground" 
            onClick={() => window.location.href = '/berita'}
          >
            Lihat Semua Berita
          </Button>
        </div>
      </div>
    </section>
  )
}
