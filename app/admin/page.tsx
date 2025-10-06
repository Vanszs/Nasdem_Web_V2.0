import {
  FileText,
  Image,
  Users,
  Calendar,
  Eye,
  TrendingUp,
  Clock,
  Archive,
  Sparkles,
  ArrowUpRight,
  Activity,
  BarChart3,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { AdminLayout } from "./components/layout/AdminLayout";
import { KPICard } from "./components/dashboard/KPICard";
import { RecentActivity } from "./components/dashboard/RecentActivity";
import { QuickActions } from "./components/dashboard/QuickActions";

const Index = () => {
  const breadcrumbs = [{ label: "Dashboard" }];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Modern Hero Section with Animated Background */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001B55] via-[#002266] to-[#001B55] text-white shadow-2xl">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-64 h-64 bg-[#FF9C04]/10 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-10 left-10 w-48 h-48 bg-[#FF9C04]/5 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,156,4,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,156,4,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>

          <div className="relative p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#FF9C04]/20 rounded-2xl backdrop-blur-sm border border-[#FF9C04]/30">
                <Sparkles className="h-6 w-6 text-[#FF9C04]" />
              </div>
              <Badge className="bg-[#FF9C04] hover:bg-[#FF9C04]/90 text-white border-0 text-sm px-4 py-1.5 rounded-full shadow-lg">
                Admin Dashboard v2.0
              </Badge>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text">
              Selamat Datang di Admin Panel
            </h1>
            <p className="text-white/90 text-xl mb-2 font-semibold">
              DPD Partai NasDem Kabupaten Sidoarjo
            </p>
            <p className="text-white/70 text-base max-w-3xl leading-relaxed">
              Kelola konten, berita, galeri, dan struktur organisasi dengan
              antarmuka modern yang intuitif dan powerful.
            </p>

            {/* Status Indicators with Icons */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="text-white/90 text-sm font-medium">
                  Sistem Online
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/20">
                <Activity className="w-4 h-4 text-[#2563EB]" />
                <span className="text-white/90 text-sm font-medium">
                  Database Sync
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/20">
                <BarChart3 className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-white/90 text-sm font-medium">
                  Auto Backup Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary KPI Grid with Modern Cards */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-12 bg-gradient-to-b from-[#001B55] to-[#FF9C04] rounded-full"></div>
                <div>
                  <h2 className="text-3xl font-bold text-[#001B55]">
                    Overview Statistik
                  </h2>
                  <p className="text-gray-500 text-base mt-1">
                    Ringkasan performa dan aktivitas sistem real-time
                  </p>
                </div>
              </div>
              <button className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-[#001B55] hover:bg-[#FF9C04] text-white rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl">
                <span className="font-medium">Lihat Laporan</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              change={{
                value: "15%",
                type: "increase",
                period: "minggu ini",
              }}
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

          {/* Secondary Metrics with Better Spacing */}
          <div className="pt-8 border-t-2 border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1.5 h-8 bg-gradient-to-b from-[#FF9C04] to-[#001B55] rounded-full"></div>
              <h3 className="text-xl font-bold text-[#001B55]">
                Aktivitas & Jadwal
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
        </div>

        {/* Dashboard Content Grid with Modern Spacing */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-10 bg-gradient-to-b from-[#001B55] to-[#FF9C04] rounded-full"></div>
                <h3 className="text-2xl font-bold text-[#001B55]">
                  Aktivitas Terbaru
                </h3>
              </div>
              <RecentActivity />
            </div>
          </div>

          <div className="xl:col-span-4">
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-10 bg-gradient-to-b from-[#FF9C04] to-[#001B55] rounded-full"></div>
                <h3 className="text-2xl font-bold text-[#001B55]">
                  Quick Actions
                </h3>
              </div>
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Index;
