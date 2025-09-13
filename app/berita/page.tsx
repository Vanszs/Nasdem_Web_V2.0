import NasdemHeader from "@/components/nasdem-header"
import NasdemFooter from "@/components/nasdem-footer"
import NewsContent from "@/components/news-content"

// Static news data - updated to match NewsItem interface
const newsData = [
  {
    id: "1",
    title: "Silaturahmi & Diskusi dengan PD Muhammadiyah Sidoarjo",
    content: "DPD NasDem Sidoarjo melakukan silaturahmi dan diskusi dengan PD Muhammadiyah Sidoarjo membahas berbagai isu pendidikan inklusif, ekonomi kerakyatan, dan program pemberdayaan masyarakat. Pertemuan ini diharapkan dapat memperkuat sinergitas antara kedua organisasi dalam membangun Sidoarjo yang lebih baik. Kegiatan ini merupakan bagian dari upaya NasDem untuk membangun komunikasi yang baik dengan berbagai organisasi masyarakat di Sidoarjo.",
    excerpt: "DPD NasDem Sidoarjo melakukan silaturahmi dan diskusi dengan PD Muhammadiyah Sidoarjo membahas berbagai isu pendidikan inklusif, ekonomi kerakyatan, dan program pemberdayaan masyarakat.",
    image_url: "/placeholder.jpg",
    created_at: "2025-07-25",
    author: {
      full_name: "Tim Media NasDem"
    }
  },
  {
    id: "2",
    title: "Launching Program Ekonomi Kerakyatan NasDem Sidoarjo",
    content: "Program ekonomi kerakyatan resmi diluncurkan dengan fokus pemberdayaan UMKM lokal, pelatihan kewirausahaan, dan akses permodalan untuk masyarakat Sidoarjo. Program ini merupakan wujud komitmen NasDem dalam meningkatkan kesejahteraan ekonomi rakyat. Berbagai kegiatan telah disiapkan untuk mendukung program ini termasuk workshop, pelatihan, dan pameran produk UMKM.",
    excerpt: "Program ekonomi kerakyatan resmi diluncurkan dengan fokus pemberdayaan UMKM lokal, pelatihan kewirausahaan, dan akses permodalan untuk masyarakat Sidoarjo.",
    image_url: "/placeholder.jpg",
    created_at: "2025-07-20",
    author: {
      full_name: "Humas NasDem Sidoarjo"
    }
  },
  {
    id: "3",
    title: "Rapat Koordinasi DPC Se-Sidoarjo Bahas Strategi Politik",
    content: "Rapat koordinasi tingkat DPD dengan seluruh DPC se-Sidoarjo membahas strategi politik dan persiapan program kerja untuk periode mendatang. Agenda utama meliputi konsolidasi organisasi dan penguatan basis massa di tingkat akar rumput. Semua DPC berkomitmen untuk memperkuat koordinasi dan sinergi dalam menjalankan program-program partai.",
    excerpt: "Rapat koordinasi tingkat DPD dengan seluruh DPC se-Sidoarjo membahas strategi politik dan persiapan program kerja untuk periode mendatang.",
    image_url: "/placeholder.jpg",
    created_at: "2025-07-18",
    author: {
      full_name: "Sekretariat DPD"
    }
  },
  {
    id: "4",
    title: "Bakti Sosial NasDem di Kecamatan Taman",
    content: "Kegiatan bakti sosial berupa santunan anak yatim dan pembagian sembako untuk masyarakat kurang mampu di Kecamatan Taman. Kegiatan ini sebagai wujud kepedulian NasDem Sidoarjo terhadap masyarakat yang membutuhkan. Lebih dari 200 keluarga mendapat bantuan sembako dan santunan dalam kegiatan ini.",
    excerpt: "Kegiatan bakti sosial berupa santunan anak yatim dan pembagian sembako untuk masyarakat kurang mampu di Kecamatan Taman.",
    image_url: "/placeholder.jpg",
    created_at: "2025-07-15",
    author: {
      full_name: "DPC Taman"
    }
  },
  {
    id: "5",
    title: "Dialog Publik Pendidikan Gratis untuk Semua",
    content: "Dialog publik dengan tema 'Pendidikan Gratis untuk Semua' menghadirkan berbagai stakeholder pendidikan di Sidoarjo. Diskusi membahas implementasi pendidikan gratis dan peningkatan kualitas pendidikan di daerah. Hadir dalam acara ini kepala sekolah, guru, dan orang tua siswa dari berbagai daerah di Sidoarjo.",
    excerpt: "Dialog publik dengan tema 'Pendidikan Gratis untuk Semua' menghadirkan berbagai stakeholder pendidikan di Sidoarjo.",
    image_url: "/placeholder.jpg",
    created_at: "2025-07-12",
    author: {
      full_name: "Tim Pendidikan"
    }
  },
  {
    id: "6",
    title: "Sosialisasi Program Kesehatan Masyarakat",
    content: "Program sosialisasi kesehatan masyarakat dengan fokus pencegahan penyakit dan pola hidup sehat. Kegiatan ini melibatkan tenaga kesehatan dan kader posyandu di berbagai wilayah Sidoarjo. Materi sosialisasi mencakup pencegahan stunting, imunisasi, dan pola hidup sehat untuk keluarga.",
    excerpt: "Program sosialisasi kesehatan masyarakat dengan fokus pencegahan penyakit dan pola hidup sehat.",
    image_url: "/placeholder.jpg", 
    created_at: "2025-07-10",
    author: {
      full_name: "Tim Kesehatan"
    }
  }
]

export default function BeritaPage() {
  // Just pass static data, no need for async function
  const news = newsData
  const recentNews = newsData.slice(0, 3) // Use first 3 as recent news
  const categories = [
    { name: "Semua", value: "all" },
    { name: "Program", value: "program" },
    { name: "Sosial", value: "sosial" },
    { name: "Pendidikan", value: "pendidikan" },
    { name: "Kesehatan", value: "kesehatan" },
    { name: "Internal", value: "internal" }
  ]
  const currentPage = 1
  const totalPages = 1
  const totalCount = news.length

  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />
      <main>
        <NewsContent 
          news={news} 
          recentNews={recentNews}
          categories={categories}
          currentPage={currentPage} 
          totalPages={totalPages} 
          totalCount={totalCount}
        />
      </main>
      <NasdemFooter />
    </div>
  )
}
