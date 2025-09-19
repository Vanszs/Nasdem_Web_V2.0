"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { StatistikKPICards } from "../../components/statistik/StatistikKPICards";
import { StatistikChartsSection } from "../../components/statistik/StatistikChartsSection";
import { StatistikDataTable } from "../../components/statistik/StatistikDataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  BarChart3,
  Calendar,
  Filter,
  RefreshCw,
  Settings,
  Download,
} from "lucide-react";

// Types
interface FilterState {
  tahun: string;
  tingkatWilayah: string;
  wilayah: string;
  jenisPemilu: "partai" | "caleg";
}

interface PartyData {
  id: string;
  nama: string;
  suara: number;
  persentase: number;
  color: string;
  logo: string;
  position: number;
}

interface TableData {
  dapil: string;
  kecamatan: string;
  kelurahan: string;
  tps: string;
  partai: string;
  caleg: string;
  suara: number;
  persentase: number;
  updatedAt: string;
  bukti: boolean;
  logo?: string;
  partaiColor?: string;
}

interface TPSDetail {
  id: string;
  name: string;
  dapil: string;
  kecamatan: string;
  kelurahan: string;
  suaraSah: number;
  suaraTidakSah: number;
  partisipasi: number;
  updatedAt: string;
  petugas: string;
  bukti: string[];
  detailSuara: Array<{ caleg: string; partai: string; suara: number }>;
}

function StatistikPemiluPage() {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    tahun: "2024",
    tingkatWilayah: "kabupaten",
    wilayah: "sidoarjo",
    jenisPemilu: "partai",
  });

  // Filter options
  const filterOptions = {
    tahun: [
      { value: "2024", label: "2024" },
      { value: "2019", label: "2019" },
      { value: "2014", label: "2014" },
    ],
    tingkatWilayah: [
      { value: "nasional", label: "Nasional" },
      { value: "provinsi", label: "Provinsi" },
      { value: "kabupaten", label: "Kabupaten/Kota" },
      { value: "kecamatan", label: "Kecamatan" },
    ],
    wilayah: [
      { value: "all", label: "Semua Wilayah" },
      { value: "sidoarjo", label: "Kabupaten Sidoarjo" },
      { value: "surabaya", label: "Kota Surabaya" },
      { value: "gresik", label: "Kabupaten Gresik" },
    ],
    jenisPemilu: [
      { value: "partai", label: "Partai Politik" },
      { value: "caleg", label: "Calon Legislatif" },
    ],
  };

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    { label: "Statistik Pemilu", href: "/admin/statistik-pemilu" },
  ];

  // Mock data
  const kpiData = {
    totalSuaraSah: 125420,
    suaraTidakSah: 2840,
    tpsMasuk: 234,
    totalTPS: 250,
    partisipasi: 78.5,
    totalDPT: 185000,
  };

  const partaiData: PartyData[] = [
    {
      id: "1",
      nama: "NasDem",
      suara: 44120,
      persentase: 35.2,
      color: "#001B55",
      logo: "/placeholder-logo.png",
      position: 1,
    },
    {
      id: "2",
      nama: "PDI-P",
      suara: 31500,
      persentase: 25.1,
      color: "#DC2626",
      logo: "/placeholder-logo.png",
      position: 2,
    },
    {
      id: "3",
      nama: "Golkar",
      suara: 22180,
      persentase: 17.7,
      color: "#FFA500",
      logo: "/placeholder-logo.png",
      position: 3,
    },
    {
      id: "4",
      nama: "PKB",
      suara: 14800,
      persentase: 11.8,
      color: "#16A085",
      logo: "/placeholder-logo.png",
      position: 4,
    },
    {
      id: "5",
      nama: "Gerindra",
      suara: 12820,
      persentase: 10.2,
      color: "#8B4513",
      logo: "/placeholder-logo.png",
      position: 5,
    },
  ];

  const calegData: PartyData[] = [
    {
      id: "1",
      nama: "Ahmad Muhaimin Iskandar",
      suara: 26300,
      persentase: 21.0,
      color: "#001B55",
      logo: "/placeholder-logo.png",
      position: 1,
    },
    {
      id: "2",
      nama: "Siti Nurhaliza Wahid",
      suara: 22200,
      persentase: 17.7,
      color: "#DC2626",
      logo: "/placeholder-logo.png",
      position: 2,
    },
    {
      id: "3",
      nama: "Budi Santoso",
      suara: 18100,
      persentase: 14.5,
      color: "#FFA500",
      logo: "/placeholder-logo.png",
      position: 3,
    },
  ];

  const tableData: TableData[] = [
    {
      dapil: "Jatim IX",
      kecamatan: "Sidoarjo",
      kelurahan: "Sidokare",
      tps: "001",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 245,
      persentase: 35.2,
      updatedAt: new Date().toISOString(),
      bukti: true,
      logo: "/placeholder-logo.png",
      partaiColor: "#001B55",
    },
    {
      dapil: "Jatim IX",
      kecamatan: "Sidoarjo",
      kelurahan: "Urangagung",
      tps: "002",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 189,
      persentase: 28.1,
      updatedAt: new Date().toISOString(),
      bukti: true,
      logo: "/placeholder-logo.png",
      partaiColor: "#DC2626",
    },
    {
      dapil: "Jatim IX",
      kecamatan: "Gedangan",
      kelurahan: "Ketajen",
      tps: "003",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 167,
      persentase: 22.8,
      updatedAt: new Date().toISOString(),
      bukti: false,
      logo: "/placeholder-logo.png",
      partaiColor: "#FFA500",
    },
    {
      dapil: "Jatim IX",
      kecamatan: "Sidoarjo",
      kelurahan: "Gebang",
      tps: "004",
      partai: "PKB",
      caleg: "Maria Kusuma",
      suara: 134,
      persentase: 18.5,
      updatedAt: new Date().toISOString(),
      bukti: true,
      logo: "/placeholder-logo.png",
      partaiColor: "#16A085",
    },
    {
      dapil: "Jatim IX",
      kecamatan: "Buduran",
      kelurahan: "Siwalanpanji",
      tps: "005",
      partai: "Gerindra",
      caleg: "Andi Prasetyo",
      suara: 112,
      persentase: 15.2,
      updatedAt: new Date().toISOString(),
      bukti: true,
      logo: "/placeholder-logo.png",
      partaiColor: "#8B4513",
    },
  ];

  const handleTPSClick = (tps: TPSDetail) => {
    console.log("TPS clicked:", tps);
    // Handle TPS detail view
  };

  const handleRefreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const chartData = filters.jenisPemilu === "partai" ? partaiData : calegData;

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#001B55] rounded-xl">
                <BarChart3 className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  Analytics Statistik Pemilu
                </h1>
                <p className="text-gray-600 mt-1">
                  Dashboard analisis real-time hasil pemilihan umum
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                Last update: {new Date().toLocaleString("id-ID")}
              </div>
              <Button
                onClick={handleRefreshData}
                size="sm"
                variant="outline"
                disabled={loading}
                className="h-9"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Tahun
              </label>
              <Select
                value={filters.tahun}
                onValueChange={(value) => setFilters({ ...filters, tahun: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.tahun.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Tingkat
              </label>
              <Select
                value={filters.tingkatWilayah}
                onValueChange={(value) => setFilters({ ...filters, tingkatWilayah: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.tingkatWilayah.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Wilayah
              </label>
              <Select
                value={filters.wilayah}
                onValueChange={(value) => setFilters({ ...filters, wilayah: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.wilayah.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Jenis
              </label>
              <Select
                value={filters.jenisPemilu}
                onValueChange={(value) => setFilters({ ...filters, jenisPemilu: value as "partai" | "caleg" })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.jenisPemilu.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Actions
              </label>
              <div className="flex gap-3">
                <Button size="sm" variant="outline" className="h-10">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm" variant="outline" className="h-10">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Active filters */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-600">Active filters:</span>
            <Badge variant="secondary" className="px-3 py-1">
              {filters.tahun}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              {filterOptions.tingkatWilayah.find(t => t.value === filters.tingkatWilayah)?.label}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              {filterOptions.jenisPemilu.find(j => j.value === filters.jenisPemilu)?.label}
            </Badge>
          </div>
        </div>

        {/* KPI Cards */}
        <StatistikKPICards data={kpiData} loading={loading} />

        {/* Horizontal Chart Section - Full Width */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Ranking Perolehan Suara ({filters.jenisPemilu === "partai" ? "Per Partai" : "Per Caleg"})
              </h2>
              <p className="text-sm text-gray-600">
                Diagram batang horizontal dengan peringkat terbaru
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Pembaruan: {new Date().toLocaleTimeString("id-ID")}
            </div>
          </div>
          <StatistikChartsSection
            data={chartData}
            view={filters.jenisPemilu}
            loading={loading}
          />
        </div>

        {/* Data Table - Full Width */}
        <StatistikDataTable 
          data={tableData} 
          onTPSClick={handleTPSClick} 
          loading={loading} 
        />
      </div>
    </AdminLayout>
  );
}

export default StatistikPemiluPage;