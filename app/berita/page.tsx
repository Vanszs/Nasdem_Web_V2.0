import NasdemHeader from "@/components/nasdem-header"
import NasdemFooter from "@/components/nasdem-footer"
import { createClient } from "@/lib/supabase/server"
import NewsContent from "@/components/news-content"

async function getNewsData(page = 1, limit = 6) {
  const supabase = createClient()
  
  // Check if Supabase is configured
  if (!supabase || typeof supabase.from !== 'function') {
    console.warn("Supabase is not configured. Using mock data.")
    // Return mock data when Supabase is not configured
    const mockNews = [
      {
        id: "1",
        title: "Berita Contoh 1",
        content: "Ini adalah konten berita contoh yang ditampilkan saat Supabase tidak dikonfigurasi.",
        excerpt: "Ini adalah contoh berita yang ditampilkan saat Supabase tidak dikonfigurasi.",
        image_url: "/placeholder.jpg",
        created_at: new Date().toISOString(),
        author: {
          full_name: "Admin"
        }
      },
      {
        id: "2",
        title: "Berita Contoh 2",
        content: "Ini adalah konten berita contoh lainnya yang ditampilkan saat Supabase tidak dikonfigurasi.",
        excerpt: "Ini adalah contoh berita lainnya yang ditampilkan saat Supabase tidak dikonfigurasi.",
        image_url: "/placeholder.jpg",
        created_at: new Date().toISOString(),
        author: {
          full_name: "Admin"
        }
      },
      {
        id: "3",
        title: "Berita Contoh 3",
        content: "Ini adalah konten berita contoh ketiga yang ditampilkan saat Supabase tidak dikonfigurasi.",
        excerpt: "Ini adalah contoh berita ketiga yang ditampilkan saat Supabase tidak dikonfigurasi.",
        image_url: "/placeholder.jpg",
        created_at: new Date().toISOString(),
        author: {
          full_name: "Admin"
        }
      }
    ]
    
    return {
      news: mockNews,
      totalCount: mockNews.length,
      totalPages: Math.ceil(mockNews.length / limit),
    }
  }
  
  const offset = (page - 1) * limit

  // Get total count
  const { count } = await supabase.from("news").select("*", { count: "exact", head: true }).eq("published", true)

  // Get news with pagination
  const { data: news, error } = await supabase
    .from("news")
    .select(`
      id,
      title,
      content,
      excerpt,
      image_url,
      created_at,
      author:users!author_id (
        full_name
      )
    `)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching news:", error)
    return { news: [], totalCount: 0, totalPages: 0 }
  }

  return {
    news: news || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

async function getRecentNews() {
  const supabase = createClient()
  
  // Check if Supabase is configured
  if (!supabase || typeof supabase.from !== 'function') {
    console.warn("Supabase is not configured. Using mock data.")
    // Return mock data when Supabase is not configured
    return [
      {
        id: "1",
        title: "Berita Contoh 1",
        image_url: "/placeholder.jpg",
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        title: "Berita Contoh 2",
        image_url: "/placeholder.jpg",
        created_at: new Date().toISOString()
      },
      {
        id: "3",
        title: "Berita Contoh 3",
        image_url: "/placeholder.jpg",
        created_at: new Date().toISOString()
      }
    ]
  }

  const { data: recentNews } = await supabase
    .from("news")
    .select(`
      id,
      title,
      image_url,
      created_at
    `)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(4)

  return recentNews || []
}

async function getNewsCategories() {
  return [
    { name: "Semua", value: "all" },
    { name: "Kerja Sama", value: "kerjasama" },
    { name: "Kaderisasi", value: "kaderisasi" },
    { name: "Aksi Sosial", value: "sosial" },
    { name: "Ekonomi", value: "ekonomi" },
    { name: "Kebijakan", value: "kebijakan" },
  ]
}

export default async function BeritaPage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number.parseInt(searchParams.page || "1")
  const { news, totalCount, totalPages } = await getNewsData(currentPage)
  const recentNews = await getRecentNews()
  const categories = await getNewsCategories()

  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />

      {/* Header */}
      <section className="bg-nasdem-blue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-nasdem-orange rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Berita Terkini</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Berita & <span className="text-nasdem-orange">Kegiatan</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Ikuti perkembangan terbaru kegiatan dan program kerja DPD NasDem Sidoarjo
            </p>
          </div>
        </div>
      </section>

      <NewsContent
        news={news}
        recentNews={recentNews}
        categories={categories}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
      />

      <NasdemFooter />
    </div>
  )
}
