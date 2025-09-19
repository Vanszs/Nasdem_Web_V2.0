import { 
  FileText, 
  Image, 
  Users, 
  Calendar, 
  Eye, 
  TrendingUp,
  Clock,
  Archive,
  Sparkles 
} from "lucide-react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { KPICard } from "../../components/dashboard/KPICard";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { RecentActivity } from "../../components/dashboard/RecentActivity";
import { Badge } from "../../components/ui/badge";

const Index = () => {
  const breadcrumbs = [
    { label: "Dashboard" }
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-[#F0F0F0]">
        <div className="space-y-6">
          {/* Modern Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#001B55] via-[#001B55]/90 to-[#FF9C04]/20 text-white shadow-lg">
            {/* Clean Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)]" />
            
            {/* Subtle Floating Elements */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-[#FF9C04]/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-6 left-6 w-14 h-14 bg-white/10 rounded-full blur-lg animate-pulse delay-1000" />
            
            <div className="relative p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <Badge className="bg-[#FF9C04] text-white border-0 text-sm">
                  v2.0 Modern
                </Badge>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Selamat Datang di Admin Panel
              </h1>
              <p className="text-white/90 text-lg mb-1 font-medium">
                DPD Partai NasDem Kabupaten Sidoarjo
              </p>
              <p className="text-white/70 text-base max-w-2xl leading-relaxed">
                Kelola konten, berita, galeri, dan struktur organisasi dengan antarmuka modern yang intuitive dan powerful.
              </p>
              
              {/* Status Indicators */}
              <div className="mt-6 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse" />
                  <span className="text-white/80">Sistem Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
                  <span className="text-white/80">Database Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full" />
                  <span className="text-white/80">Auto Backup Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary KPI Grid */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-10 bg-gradient-to-b from-[#001B55] to-[#FF9C04] rounded-full"></div>
                <h2 className="text-3xl font-bold text-[#001B55]">Overview Statistik</h2>
              </div>
              <p className="text-[#6B7280] text-lg">Ringkasan performa dan aktivitas sistem real-time</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <KPICard
                title="Total Berita"
                value={47}
                change={{ value: "8", type: "increase", period: "bulan ini" }}
                icon={FileText}
                description="23 published, 5 draft"
                color="primary"
              />
              <KPICard
                title="Berita Terbaca"
                value="12.4K"
                change={{ value: "15%", type: "increase", period: "minggu ini" }}
                icon={Eye}
                description="Pengunjung unik"
                color="success"
              />
              <KPICard
                title="Media Galeri"
                value={238}
                change={{ value: "24", type: "increase", period: "bulan ini" }}
                icon={Image}
                description="15 album aktif"
                color="info"
              />
              <KPICard
                title="Struktur Aktif"
                value={156}
                change={{ value: "3", type: "increase", period: "bulan ini" }}
                icon={Users}
                description="DPD, Sayap, DPC, DPRT"
                color="accent"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="pt-6 border-t border-gray-200/60">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-gradient-to-b from-[#FF9C04] to-[#001B55] rounded-full"></div>
                <h3 className="text-xl font-semibold text-[#001B55]">Aktivitas & Jadwal</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  title="Berita Terjadwal"
                  value={3}
                  icon={Clock}
                  description="Siap publikasi otomatis"
                  color="warning"
                />
                <KPICard
                  title="Draft Tersimpan"
                  value={8}
                  icon={Archive}
                  description="Menunggu review"
                  color="info"
                />
                <KPICard
                  title="Aktivitas Hari Ini"
                  value={15}
                  change={{ value: "12", type: "increase" }}
                  icon={TrendingUp}
                  description="Pembaruan konten"
                  color="success"
                />
                <KPICard
                  title="Event Mendatang"
                  value={2}
                  icon={Calendar}
                  description="7 hari ke depan"
                  color="accent"
                />
              </div>
            </div>
          </section>

          {/* Dashboard Content Grid */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-10 bg-gradient-to-b from-[#001B55] to-[#FF9C04] rounded-full"></div>
                  <h3 className="text-xl font-semibold text-[#001B55]">Aktivitas Terbaru</h3>
                </div>
                <RecentActivity />
              </div>
            </div>
            
            <div className="xl:col-span-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-10 bg-gradient-to-b from-[#FF9C04] to-[#001B55] rounded-full"></div>
                  <h3 className="text-xl font-semibold text-[#001B55]">Quick Actions</h3>
                </div>
                <QuickActions />
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Index;
