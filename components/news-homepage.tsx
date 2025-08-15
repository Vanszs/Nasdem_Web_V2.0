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

export default function NewsHomepage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    const supabase = createClient()
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
      .limit(4)

    if (data) {
      setNews(data)
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

  const featuredNews = news[0]
  const regularNews = news.slice(1, 4)

  return (
    <section id="berita" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-nasdem-orange/10 rounded-full px-4 py-2 mb-4">
            <div className="w-2 h-2 bg-nasdem-orange rounded-full animate-pulse"></div>
            <span className="text-nasdem-blue text-sm font-medium">Berita Terkini</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-nasdem-blue mb-4">
            Berita & <span className="text-nasdem-orange">Kegiatan</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ikuti perkembangan terbaru kegiatan dan program kerja DPD NasDem Sidoarjo.
          </p>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <div className="mb-16">
            <div className="bg-white rounded-2xl overflow-hidden border shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative">
                  <img
                    src={featuredNews.image_url || "/placeholder.svg"}
                    alt={featuredNews.title}
                    className="w-full h-64 lg:h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-nasdem-red text-white text-xs font-medium px-3 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-nasdem-orange/10 text-nasdem-orange text-xs font-medium px-3 py-1 rounded-full">
                      Berita Utama
                    </span>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar size={14} />
                      <span>{new Date(featuredNews.created_at).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-nasdem-blue mb-4 leading-tight">
                    {featuredNews.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{featuredNews.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <User size={14} />
                      <span>{featuredNews.users?.full_name}</span>
                    </div>
                    <Button className="bg-nasdem-orange hover:bg-nasdem-orange/90 text-white group">
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
          {regularNews.map((newsItem) => (
            <article
              key={newsItem.id}
              className="bg-white rounded-xl border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-nasdem-blue/10 text-nasdem-blue text-xs font-medium px-2 py-1 rounded-full">
                    Berita
                  </span>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock size={12} />
                    <span>{new Date(newsItem.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-nasdem-blue mb-3 line-clamp-2 group-hover:text-nasdem-orange transition-colors">
                  {newsItem.title}
                </h4>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{newsItem.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <User size={12} />
                    <span>{newsItem.users?.full_name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-nasdem-blue hover:text-nasdem-orange p-0 h-auto font-medium"
                  >
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
            size="lg"
            className="bg-nasdem-orange hover:bg-nasdem-orange/90 text-white font-semibold px-8 py-3"
            onClick={() => (window.location.href = "/berita")}
          >
            Lihat Semua Berita
          </Button>
        </div>
      </div>
    </section>
  )
}
