import { BarChart3, TrendingUp, Users, MapPin, Calendar, Download, Filter, RefreshCw } from "lucide-react";
import { AdminLayout } from "@/src/components/layout/AdminLayout";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { KPICard } from "@/src/components/dashboard/KPICard";

export function StatistikPemiluPage() {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Statistik Pemilu" }
  ];

  // Mock data untuk statistik pemilu
  const statistikData = {
    totalPemilih: 1247500,
    targetSuara: 187125, // 15% dari total pemilih
    perolehanSuara: 156890,
    tingkatPartisipasi: 78.5,
    wilayahKemenangan: 12,
    totalWilayah: 18
  };

  const wilayahData = [
    { nama: "Sidoarjo Kota", pemilih: 85000, suaraNasDem: 12750, persentase: 15.0, status: "Menang" },
    { nama: "Waru", pemilih: 92000, suaraNasDem: 13800, persentase: 15.0, status: "Menang" },
    { nama: "Gedangan", pemilih: 78000, suaraNasDem: 11700, persentase: 15.0, status: "Menang" },
    { nama: "Taman", pemilih: 115000, suaraNasDem: 14950, persentase: 13.0, status: "Kalah" },
    { nama: "Sukodono", pemilih: 65000, suaraNasDem: 9750, persentase: 15.0, status: "Menang" },
    { nama: "Candi", pemilih: 72000, suaraNasDem: 10080, persentase: 14.0, status: "Menang" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-smooth-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#001B55]">Statistik Pemilu</h1>
              <p className="text-muted-foreground">
                Data dan analisis hasil pemilu NasDem Sidoarjo
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button className="bg-[#FF9C04] hover:bg-[#FF9C04]/90 text-white">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-smooth-xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex gap-2 w-full sm:w-auto">
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                  <SelectItem value="2014">2014</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Jenis Pemilu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presiden">Presiden</SelectItem>
                  <SelectItem value="dprd">DPRD</SelectItem>
                  <SelectItem value="dpd">DPD</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Wilayah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Wilayah</SelectItem>
                  <SelectItem value="sidoarjo">Sidoarjo Kota</SelectItem>
                  <SelectItem value="waru">Waru</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Pemilih"
            value={statistikData.totalPemilih.toLocaleString()}
            icon={Users}
            description="Daftar Pemilih Tetap"
            color="primary"
            className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
          />
          <KPICard
            title="Perolehan Suara"
            value={statistikData.perolehanSuara.toLocaleString()}
            change={{ value: `${((statistikData.perolehanSuara/statistikData.targetSuara)*100-100).toFixed(1)}%`, type: "increase", period: "dari target" }}
            icon={BarChart3}
            description={`Target: ${statistikData.targetSuara.toLocaleString()}`}
            color="accent"
            className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
          />
          <KPICard
            title="Tingkat Partisipasi"
            value={`${statistikData.tingkatPartisipasi}%`}
            change={{ value: "+2.5%", type: "increase", period: "dari pemilu lalu" }}
            icon={TrendingUp}
            description="Partisipasi pemilih"
            color="success"
            className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
          />
          <KPICard
            title="Wilayah Menang"
            value={`${statistikData.wilayahKemenangan}/${statistikData.totalWilayah}`}
            change={{ value: "67%", type: "increase", period: "tingkat kemenangan" }}
            icon={MapPin}
            description="Kecamatan di Sidoarjo"
            color="info"
            className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>

        {/* Statistik per Wilayah */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-smooth-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-[#001B55]/5 via-white/50 to-[#FF9C04]/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#001B55] to-[#001B55]/80 rounded-smooth shadow-md">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#001B55]">Statistik per Wilayah</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wilayahData.map((wilayah, index) => (
                <Card key={index} className="hover:shadow-md transition-all duration-300 border-2 border-gray-200/60">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-[#001B55]">{wilayah.nama}</CardTitle>
                      <Badge 
                        variant={wilayah.status === 'Menang' ? 'default' : 'secondary'}
                        className={wilayah.status === 'Menang' ? 'bg-green-500' : 'bg-red-500'}
                      >
                        {wilayah.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Pemilih:</span>
                      <span className="font-medium">{wilayah.pemilih.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Suara NasDem:</span>
                      <span className="font-medium text-[#FF9C04]">{wilayah.suaraNasDem.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Persentase:</span>
                      <span className="font-bold text-[#001B55]">{wilayah.persentase}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-[#001B55] to-[#FF9C04] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${wilayah.persentase}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default StatistikPemiluPage;
