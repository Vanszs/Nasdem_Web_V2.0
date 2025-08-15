"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight, Clock, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface NewsItem {
  id: string
  title: string
  content: string
  excerpt: string
  image_url: string
  created_at: string
  author: {
    full_name: string
  }
}

interface NewsContentProps {
  news: NewsItem[]
  recentNews: NewsItem[]
  currentPage: number
  totalPages: number
  totalCount: number
}

export default function NewsContent({ news, recentNews, currentPage, totalPages, totalCount }: NewsContentProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handlePageChange = (page: number) => {
    router.push(`/berita?page=${page}`)
  }

  const featuredNews = news[0]
  const regularNews = news.slice(1)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Featured News */}
        {featuredNews && (
          <div className="mb-16">
            <Card className="overflow-hidden border-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.16)] transition-all duration-300">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative">
                  <Image
                    src={featuredNews.image_url || "/placeholder.svg?height=400&width=600&query=NasDem featured news"}
                    alt={featuredNews.title}
                    width={600}
                    height={400}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-nasdem-dark-red text-white text-xs font-medium px-3 py-1 rounded-full">
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
                      <span>{formatDate(featuredNews.created_at)}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-nasdem-blue mb-4 leading-tight">
                    {featuredNews.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{featuredNews.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <User size={14} />
                      <span>{featuredNews.author?.full_name || "Admin"}</span>
                    </div>
                    <Button className="hover-fade-up bg-nasdem-orange hover:bg-nasdem-blue group">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main News */}
          <div className="lg:col-span-2 space-y-8">
            {/* Regular News Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {regularNews.map((newsItem) => (
                <Card
                  key={newsItem.id}
                  className="overflow-hidden border hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                >
                  <div className="relative">
                    <Image
                      src={newsItem.image_url || "/placeholder.svg?height=200&width=400&query=NasDem news"}
                      alt={newsItem.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-nasdem-blue/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Berita
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock size={12} />
                        <span>{formatDate(newsItem.created_at)}</span>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-nasdem-blue mb-3 line-clamp-2 group-hover:text-nasdem-orange transition-colors">
                      {newsItem.title}
                    </h4>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{newsItem.excerpt}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <User size={12} />
                        <span>{newsItem.author?.full_name || "Admin"}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover-fade-up text-nasdem-orange hover:text-white hover:bg-nasdem-blue p-0 h-auto font-medium"
                      >
                        Baca →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-nasdem-orange text-nasdem-orange bg-transparent hover:bg-nasdem-orange hover:text-white"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      className={
                        page === currentPage
                          ? "bg-nasdem-orange text-white hover:bg-nasdem-orange/90"
                          : "border-nasdem-orange text-nasdem-orange hover:bg-nasdem-orange hover:text-white"
                      }
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  size="sm"
                  className="border-nasdem-orange text-nasdem-orange bg-transparent hover:bg-nasdem-orange hover:text-white"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Stats */}
            <div className="text-center text-gray-500 text-sm">
              Menampilkan {news.length} dari {totalCount} berita
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent News */}
            <Card className="p-6 border-0 shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
              <h3 className="text-xl font-bold text-nasdem-blue mb-6 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-nasdem-orange" />
                Berita Terbaru
              </h3>
              <div className="space-y-4">
                {recentNews.map((item) => (
                  <div key={item.id} className="flex gap-3 group cursor-pointer">
                    <Image
                      src={item.image_url || "/placeholder.svg?height=60&width=80&query=NasDem news thumbnail"}
                      alt={item.title}
                      width={80}
                      height={60}
                      className="w-20 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-nasdem-blue mb-1 line-clamp-2 group-hover:text-nasdem-orange transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Categories */}
            <Card className="p-6 border-0 shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
              <h3 className="text-xl font-bold text-nasdem-blue mb-6">Kategori</h3>
              <div className="space-y-2">
                {[
                  "Program Kerja",
                  "Kegiatan Sosial",
                  "Pendidikan Politik",
                  "UMKM",
                  "Kesehatan",
                  "Lingkungan",
                  "Kaderisasi",
                  "Kerja Sama",
                ].map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-nasdem-orange hover:bg-nasdem-orange/5 transition-colors"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Newsletter Signup */}
            <Card className="p-6 border-0 shadow-[0_4px_20px_rgb(0,0,0,0.08)] bg-gradient-to-br from-nasdem-blue to-nasdem-blue/90 text-white">
              <h3 className="text-xl font-bold mb-4">Berlangganan Berita</h3>
              <p className="text-white/80 text-sm mb-4">
                Dapatkan update terbaru kegiatan NasDem Sidoarjo langsung di email Anda.
              </p>
              <Button className="w-full bg-nasdem-orange hover:bg-nasdem-orange/90 text-white">Berlangganan</Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
