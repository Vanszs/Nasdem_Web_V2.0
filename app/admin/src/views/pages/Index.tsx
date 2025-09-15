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
import heroImage from "../../assets/dashboard-hero.jpg";

const Index = () => {
  const breadcrumbs = [
    { label: "Dashboard" }
  ];

  const heroBg = typeof heroImage === 'string' ? (heroImage as unknown as string) : (heroImage as any)?.src ?? '';

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30">
        <div className="space-y-8">
          {/* Modern Hero Section with Enhanced Borders */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent text-white shadow-2xl border border-white/20 backdrop-blur-sm">
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_transparent_0%,_rgba(255,255,255,0.1)_50%,_transparent_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
              style={{ backgroundImage: `url(${heroBg})` }}
            />
            
            {/* Floating Elements */}
            <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-white/10 to-accent/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-accent/10 to-white/10 rounded-full blur-xl animate-pulse delay-1000" />
            
            <div className="relative p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <Badge className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  v2.0 Modern
                </Badge>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text">
                Selamat Datang di Admin Panel
              </h1>
              <p className="text-white/90 text-xl mb-2 font-medium">
                DPD Partai NasDem Kabupaten Sidoarjo
              </p>
              <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
                Kelola konten, berita, galeri, dan struktur organisasi dengan antarmuka modern yang intuitive dan powerful.
              </p>
              
              {/* Quick Stats */}
              <div className="mt-8 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/80">Sistem Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-white/80">Database Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-white/80">Auto Backup Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary KPI Grid with Enhanced Borders */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-300/80 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-10 bg-gradient-to-b from-primary to-accent rounded-full shadow-md"></div>
                <h2 className="text-3xl font-bold text-foreground">Overview Statistik</h2>
              </div>
              <p className="text-muted-foreground text-lg">Ringkasan performa dan aktivitas sistem real-time</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <KPICard
                title="Total Berita"
                value={47}
                change={{ value: "8", type: "increase", period: "bulan ini" }}
                icon={FileText}
                description="23 published, 5 draft"
                color="primary"
                className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
              />
              <KPICard
                title="Berita Terbaca"
                value="12.4K"
                change={{ value: "15%", type: "increase", period: "minggu ini" }}
                icon={Eye}
                description="Pengunjung unik"
                color="success"
                className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
              />
              <KPICard
                title="Media Galeri"
                value={238}
                change={{ value: "24", type: "increase", period: "bulan ini" }}
                icon={Image}
                description="15 album aktif"
                color="info"
                className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
              />
              <KPICard
                title="Struktur Aktif"
                value={156}
                change={{ value: "3", type: "increase", period: "bulan ini" }}
                icon={Users}
                description="DPD, Sayap, DPC, DPRT"
                color="accent"
                className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="pt-6 border-t border-gray-200/60">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-gradient-to-b from-accent to-primary rounded-full"></div>
                <h3 className="text-xl font-semibold text-foreground">Aktivitas & Jadwal</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  title="Berita Terjadwal"
                  value={3}
                  icon={Clock}
                  description="Siap publikasi otomatis"
                  color="warning"
                  className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
                />
                <KPICard
                  title="Draft Tersimpan"
                  value={8}
                  icon={Archive}
                  description="Menunggu review"
                  color="info"
                  className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
                />
                <KPICard
                  title="Aktivitas Hari Ini"
                  value={15}
                  change={{ value: "12", type: "increase" }}
                  icon={TrendingUp}
                  description="Pembaruan konten"
                  color="success"
                  className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
                />
                <KPICard
                  title="Event Mendatang"
                  value={2}
                  icon={Calendar}
                  description="7 hari ke depan"
                  color="accent"
                  className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </div>
            </div>
          </section>

          {/* Dashboard Content Grid with Enhanced Layout */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-300/80 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-10 bg-gradient-to-b from-primary to-accent rounded-full shadow-md"></div>
                  <h3 className="text-xl font-semibold text-foreground">Aktivitas Terbaru</h3>
                </div>
                <RecentActivity />
              </div>
            </div>
            
            <div className="xl:col-span-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-300/80 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-10 bg-gradient-to-b from-accent to-primary rounded-full shadow-md"></div>
                  <h3 className="text-xl font-semibold text-foreground">Quick Actions</h3>
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
