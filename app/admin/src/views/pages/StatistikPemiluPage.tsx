"use client";

import React, { useState } from "react";
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
import { BarChart3, Calendar, RefreshCw } from "lucide-react";

// Types
interface FilterState {
  tahun: string;
  dapil: string;
  kecamatan: string;
  desa: string;
  tps: string;
  jenisPemilu: string;
  partai: string;
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

function StatistikPemiluPage() {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    tahun: "2024",
    dapil: "ALL_DAPIL",
    kecamatan: "ALL_KECAMATAN",
    desa: "ALL_DESA",
    tps: "ALL_TPS",
    jenisPemilu: "partai",
    partai: "ALL_PARTAI",
  });

  React.useEffect(() => {
    setFilters((prev) => {
      if (
        prev.dapil === "ALL_DAPIL" &&
        (prev.kecamatan !== "ALL_KECAMATAN" ||
          prev.desa !== "ALL_DESA" ||
          prev.tps !== "ALL_TPS")
      ) {
        return {
          ...prev,
          kecamatan: "ALL_KECAMATAN",
          desa: "ALL_DESA",
          tps: "ALL_TPS",
        };
      }
      if (prev.kecamatan === "ALL_KECAMATAN" && prev.desa !== "ALL_DESA") {
        return { ...prev, desa: "ALL_DESA", tps: "ALL_TPS" };
      }
      if (prev.desa === "ALL_DESA" && prev.tps !== "ALL_TPS") {
        return { ...prev, tps: "ALL_TPS" };
      }
      return prev;
    });
  }, [filters.dapil, filters.kecamatan, filters.desa]);

  // Filter options
  const filterOptions = {
    tahun: [
      { value: "2024", label: "2024" },
      { value: "2019", label: "2019" },
      { value: "2014", label: "2014" },
    ],
    dapil: [
      { value: "ALL_DAPIL", label: "Semua Dapil" },
      { value: "Dapil 1", label: "Dapil 1" },
      { value: "Dapil 2", label: "Dapil 2" },
      { value: "Dapil 3", label: "Dapil 3" },
    ],
    // Mapping kecamatan ke dapil baru
    kecamatan: [
      { value: "ALL_KECAMATAN", label: "Semua Kecamatan", dapil: "*" },
      { value: "balongbendo", label: "Balongbendo", dapil: "Dapil 1" },
      { value: "wonoayu", label: "Wonoayu", dapil: "Dapil 1" },
      { value: "waru", label: "Waru", dapil: "Dapil 2" },
      { value: "gedangan", label: "Gedangan", dapil: "Dapil 2" },
      { value: "buduran", label: "Buduran", dapil: "Dapil 3" },
      { value: "sidoarjo", label: "Sidoarjo", dapil: "Dapil 3" },
    ],
    jenisPemilu: [
      { value: "partai", label: "Partai Politik" },
      { value: "caleg", label: "Calon Legislatif" },
    ],
    partai: [
      { value: "ALL_PARTAI", label: "Semua Partai" },
      { value: "NasDem", label: "NasDem" },
      { value: "PDI-P", label: "PDI-P" },
      { value: "Golkar", label: "Golkar" },
      { value: "PKB", label: "PKB" },
      { value: "Gerindra", label: "Gerindra" },
    ],
  } as const;

  // Basis data granular: tiap TPS (mock)
  interface BaseRecord {
    dapil: string;
    kecamatan: string; // lowercase key
    desa: string;
    tps: string; // 001 format
    partai: string;
    caleg: string;
    suara: number;
  }

  const baseRecords: BaseRecord[] = [
    // ==================== EXISTING (tetap) ====================
    // Dapil 1 - Balongbendo, Wonoayu
    {
      dapil: "Dapil 1",
      kecamatan: "balongbendo",
      desa: "Klurak",
      tps: "001",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 132,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "balongbendo",
      desa: "Klurak",
      tps: "002",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 118,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "balongbendo",
      desa: "Seduri",
      tps: "001",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 95,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "wonoayu",
      desa: "Panjunan",
      tps: "003",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 87,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "wonoayu",
      desa: "Siwalanpanji",
      tps: "001",
      partai: "PKB",
      caleg: "Maria Kusuma",
      suara: 76,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "wonoayu",
      desa: "Siwalanpanji",
      tps: "002",
      partai: "Gerindra",
      caleg: "Andi Prasetyo",
      suara: 64,
    },

    // Dapil 2 - Waru, Gedangan
    {
      dapil: "Dapil 2",
      kecamatan: "waru",
      desa: "Jemirahan",
      tps: "001",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 210,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "waru",
      desa: "Kepuhkiriman",
      tps: "002",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 168,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "gedangan",
      desa: "Ketajen",
      tps: "001",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 142,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "gedangan",
      desa: "Sawotratap",
      tps: "001",
      partai: "PKB",
      caleg: "Maria Kusuma",
      suara: 121,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "gedangan",
      desa: "Sawotratap",
      tps: "002",
      partai: "Gerindra",
      caleg: "Andi Prasetyo",
      suara: 97,
    },

    // Dapil 3 - Buduran, Sidoarjo
    {
      dapil: "Dapil 3",
      kecamatan: "buduran",
      desa: "Siwalanpanji",
      tps: "001",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 254,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "buduran",
      desa: "Buduran",
      tps: "001",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 201,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "buduran",
      desa: "Siwalan",
      tps: "001",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 176,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "sidoarjo",
      desa: "Sidokare",
      tps: "001",
      partai: "PKB",
      caleg: "Maria Kusuma",
      suara: 164,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "sidoarjo",
      desa: "Gebang",
      tps: "004",
      partai: "Gerindra",
      caleg: "Andi Prasetyo",
      suara: 148,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "sidoarjo",
      desa: "Urangagung",
      tps: "002",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 188,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "sidoarjo",
      desa: "Celep",
      tps: "001",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 130,
    },

    // ==================== PENAMBAHAN MULTI-CALEG ====================
    // NasDem (tambah caleg lain)
    {
      dapil: "Dapil 1",
      kecamatan: "balongbendo",
      desa: "Klurak",
      tps: "003",
      partai: "NasDem",
      caleg: "Rizky Pratama",
      suara: 105,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "waru",
      desa: "Jemirahan",
      tps: "002",
      partai: "NasDem",
      caleg: "Rizky Pratama",
      suara: 142,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "sidoarjo",
      desa: "Sidokare",
      tps: "002",
      partai: "NasDem",
      caleg: "Dewi Lestari",
      suara: 173,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "buduran",
      desa: "Buduran",
      tps: "002",
      partai: "NasDem",
      caleg: "Dewi Lestari",
      suara: 119,
    },

    // PDI-P (tambahan)
    {
      dapil: "Dapil 1",
      kecamatan: "wonoayu",
      desa: "Panjunan",
      tps: "004",
      partai: "PDI-P",
      caleg: "Arif Wibowo",
      suara: 88,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "gedangan",
      desa: "Ketajen",
      tps: "002",
      partai: "PDI-P",
      caleg: "Arif Wibowo",
      suara: 131,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "sidoarjo",
      desa: "Urangagung",
      tps: "003",
      partai: "PDI-P",
      caleg: "Lina Marlina",
      suara: 156,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "waru",
      desa: "Kepuhkiriman",
      tps: "003",
      partai: "PDI-P",
      caleg: "Lina Marlina",
      suara: 124,
    },

    // Golkar (tambahan)
    {
      dapil: "Dapil 1",
      kecamatan: "wonoayu",
      desa: "Siwalanpanji",
      tps: "003",
      partai: "Golkar",
      caleg: "Yusuf Hakim",
      suara: 69,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "waru",
      desa: "Jemirahan",
      tps: "003",
      partai: "Golkar",
      caleg: "Yusuf Hakim",
      suara: 101,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "buduran",
      desa: "Siwalan",
      tps: "002",
      partai: "Golkar",
      caleg: "Yusuf Hakim",
      suara: 112,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "sidoarjo",
      desa: "Gebang",
      tps: "005",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 134,
    },

    // PKB (tambahan)
    {
      dapil: "Dapil 1",
      kecamatan: "balongbendo",
      desa: "Seduri",
      tps: "002",
      partai: "PKB",
      caleg: "H. Saiful Anam",
      suara: 82,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "gedangan",
      desa: "Sawotratap",
      tps: "003",
      partai: "PKB",
      caleg: "H. Saiful Anam",
      suara: 109,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "sidoarjo",
      desa: "Celep",
      tps: "002",
      partai: "PKB",
      caleg: "H. Saiful Anam",
      suara: 126,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "waru",
      desa: "Kepuhkiriman",
      tps: "004",
      partai: "PKB",
      caleg: "Maria Kusuma",
      suara: 115,
    },

    // Gerindra (tambahan)
    {
      dapil: "Dapil 1",
      kecamatan: "balongbendo",
      desa: "Klurak",
      tps: "004",
      partai: "Gerindra",
      caleg: "Nur Cahyo",
      suara: 71,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "gedangan",
      desa: "Ketajen",
      tps: "003",
      partai: "Gerindra",
      caleg: "Nur Cahyo",
      suara: 108,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "sidoarjo",
      desa: "Urangagung",
      tps: "004",
      partai: "Gerindra",
      caleg: "Nur Cahyo",
      suara: 122,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "buduran",
      desa: "Siwalanpanji",
      tps: "002",
      partai: "Gerindra",
      caleg: "Andi Prasetyo",
      suara: 133,
    },
  ];

  const PARTAI_META: Record<string, { color: string; logo: string }> = {
    NasDem: { color: "#001B55", logo: "/placeholder-logo.png" },
    "PDI-P": { color: "#DC2626", logo: "/placeholder-logo.png" },
    Golkar: { color: "#FFA500", logo: "/placeholder-logo.png" },
    PKB: { color: "#16A085", logo: "/placeholder-logo.png" },
    Gerindra: { color: "#8B4513", logo: "/placeholder-logo.png" },
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
    dptb: 3250,
    dpk: 1850,
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

  // Remove old static getDesaOptions/getTpsOptions (if any) and ensure dynamic versions are defined here
  const getDesaOptions = (): Array<{ value: string; label: string }> => {
    if (!filters.kecamatan || filters.kecamatan === "ALL_KECAMATAN")
      return [{ value: "ALL_DESA", label: "Semua Desa" }];
    const desaSet = new Set<string>();
    baseRecords
      .filter((r) => r.kecamatan === filters.kecamatan)
      .forEach((r) => desaSet.add(r.desa));
    return [
      { value: "ALL_DESA", label: "Semua Desa" },
      ...Array.from(desaSet)
        .sort()
        .map((d) => ({ value: d, label: d })),
    ];
  };

  const getTpsOptions = (): Array<{ value: string; label: string }> => {
    if (!filters.desa || filters.desa === "ALL_DESA")
      return [{ value: "ALL_TPS", label: "Semua TPS" }];
    const tpsSet = new Set<string>();
    baseRecords
      .filter(
        (r) => r.kecamatan === filters.kecamatan && r.desa === filters.desa
      )
      .forEach((r) => tpsSet.add(r.tps));
    return [
      { value: "ALL_TPS", label: "Semua TPS" },
      ...Array.from(tpsSet)
        .sort()
        .map((t) => ({ value: t, label: `TPS ${t}` })),
    ];
  };

  // Filter base records sesuai pilihan user
  const filteredRecords = baseRecords.filter((r) => {
    if (
      filters.dapil !== "ALL_DAPIL" &&
      filters.dapil &&
      r.dapil !== filters.dapil
    )
      return false;
    if (
      filters.kecamatan !== "ALL_KECAMATAN" &&
      filters.kecamatan &&
      r.kecamatan !== filters.kecamatan
    )
      return false;
    if (filters.desa !== "ALL_DESA" && r.desa !== filters.desa) return false;
    if (filters.tps !== "ALL_TPS" && r.tps !== filters.tps) return false;
    if (filters.partai !== "ALL_PARTAI" && r.partai !== filters.partai)
      return false;
    return true;
  });

  // Aggregate untuk chart (partai atau caleg)
  const aggregatedForChart: PartyData[] = (() => {
    const totalSuara = filteredRecords.reduce((s, r) => s + r.suara, 0) || 1;
    if (filters.jenisPemilu === "partai") {
      const byPartai: Record<string, number> = {};
      filteredRecords.forEach((r) => {
        byPartai[r.partai] = (byPartai[r.partai] || 0) + r.suara;
      });
      return Object.entries(byPartai)
        .map(([partai, suara], idx) => ({
          id: partai,
          nama: partai,
          suara,
          persentase: (suara / totalSuara) * 100,
          color: PARTAI_META[partai]?.color || "#3B82F6",
          logo: PARTAI_META[partai]?.logo || "/placeholder-logo.png",
          position: idx + 1,
        }))
        .sort((a, b) => b.suara - a.suara);
    } else {
      const byCaleg: Record<string, { suara: number; partai: string }> = {};
      filteredRecords.forEach((r) => {
        byCaleg[r.caleg] = {
          suara: (byCaleg[r.caleg]?.suara || 0) + r.suara,
          partai: r.partai,
        };
      });
      return Object.entries(byCaleg)
        .map(([caleg, val], idx) => ({
          id: caleg,
          nama: caleg,
          suara: val.suara,
          persentase: (val.suara / totalSuara) * 100,
          color: PARTAI_META[val.partai]?.color || "#3B82F6",
          logo: PARTAI_META[val.partai]?.logo || "/placeholder-logo.png",
          position: idx + 1,
        }))
        .sort((a, b) => b.suara - a.suara);
    }
  })();

  // Table data turunan dari filteredRecords
  const tableData: TableData[] = filteredRecords.map((r) => {
    const totalArea = filteredRecords.reduce((s, rr) => s + rr.suara, 0) || 1;
    return {
      dapil: r.dapil,
      kecamatan:
        filterOptions.kecamatan.find((k) => k.value === r.kecamatan)?.label ||
        r.kecamatan,
      kelurahan: r.desa,
      tps: r.tps,
      partai: r.partai,
      caleg: r.caleg,
      suara: r.suara,
      persentase: (r.suara / totalArea) * 100,
      updatedAt: new Date().toISOString(),
      bukti: true,
      logo: PARTAI_META[r.partai]?.logo,
      partaiColor: PARTAI_META[r.partai]?.color,
    };
  });

  const handleRefreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const chartData = aggregatedForChart; // sebelumnya static

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
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Tahun */}
            <Select
              value={filters.tahun}
              onValueChange={(value) =>
                setFilters({ ...filters, tahun: value })
              }
            >
              <SelectTrigger className="bg-white border border-[#E5E7EB] text-[#111827]">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#E5E7EB] text-[#111827]">
                {filterOptions.tahun.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Jenis Pemilu */}
            <Select
              value={filters.jenisPemilu}
              onValueChange={(value) =>
                setFilters({ ...filters, jenisPemilu: value })
              }
            >
              <SelectTrigger className="bg-white border border-[#E5E7EB] text-[#111827]">
                <SelectValue placeholder="Jenis Pemilu" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#E5E7EB] text-[#111827]">
                {filterOptions.jenisPemilu.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Dapil (level 1) */}
            <Select
              value={filters.dapil}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  dapil: value,
                  // reset turunannya
                  kecamatan: "ALL_KECAMATAN",
                  desa: "ALL_DESA",
                  tps: "ALL_TPS",
                })
              }
            >
              <SelectTrigger className="bg-white border border-[#E5E7EB] text-[#111827]">
                <SelectValue placeholder="Dapil" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#E5E7EB] text-[#111827]">
                {filterOptions.dapil.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Kecamatan (level 2) */}
            <div
              className={
                filters.dapil === "ALL_DAPIL"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
              title={
                filters.dapil === "ALL_DAPIL"
                  ? "Pilih Dapil terlebih dahulu"
                  : ""
              }
            >
              <Select
                value={filters.kecamatan}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    kecamatan: value,
                    desa: "ALL_DESA",
                    tps: "ALL_TPS",
                  })
                }
                disabled={filters.dapil === "ALL_DAPIL"}
              >
                <SelectTrigger className="bg-white border border-[#E5E7EB] text-[#111827]">
                  <SelectValue placeholder="Kecamatan" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#E5E7EB] text-[#111827]">
                  {filterOptions.kecamatan
                    .filter((k) =>
                      filters.dapil === "ALL_DAPIL"
                        ? false
                        : k.dapil === filters.dapil ||
                          k.value === "ALL_KECAMATAN"
                    )
                    .map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Desa (level 3) */}
            <div
              className={
                filters.kecamatan === "ALL_KECAMATAN" ||
                filters.dapil === "ALL_DAPIL"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
              title={
                filters.kecamatan === "ALL_KECAMATAN" ||
                filters.dapil === "ALL_DAPIL"
                  ? "Pilih Kecamatan terlebih dahulu"
                  : ""
              }
            >
              <Select
                value={filters.desa}
                onValueChange={(value) =>
                  setFilters({ ...filters, desa: value, tps: "ALL_TPS" })
                }
                disabled={
                  filters.dapil === "ALL_DAPIL" ||
                  filters.kecamatan === "ALL_KECAMATAN"
                }
              >
                <SelectTrigger className="bg-white border border-[#E5E7EB] text-[#111827]">
                  <SelectValue placeholder="Desa" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#E5E7EB] text-[#111827]">
                  {getDesaOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* TPS (level 4) */}
            <div
              className={
                filters.desa === "ALL_DESA" ||
                filters.kecamatan === "ALL_KECAMATAN" ||
                filters.dapil === "ALL_DAPIL"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
              title={
                filters.desa === "ALL_DESA" ||
                filters.kecamatan === "ALL_KECAMATAN" ||
                filters.dapil === "ALL_DAPIL"
                  ? "Pilih Desa terlebih dahulu"
                  : ""
              }
            >
              <Select
                value={filters.tps}
                onValueChange={(value) =>
                  setFilters({ ...filters, tps: value })
                }
                disabled={
                  filters.dapil === "ALL_DAPIL" ||
                  filters.kecamatan === "ALL_KECAMATAN" ||
                  filters.desa === "ALL_DESA"
                }
              >
                <SelectTrigger className="bg-white border border-[#E5E7EB] text-[#111827]">
                  <SelectValue placeholder="TPS" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#E5E7EB] text-[#111827]">
                  {getTpsOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-600">
              Active filters:
            </span>
            <Badge variant="secondary" className="px-3 py-1">
              {filters.tahun}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              {
                filterOptions.jenisPemilu.find(
                  (j) => j.value === filters.jenisPemilu
                )?.label
              }
            </Badge>
            {filters.dapil !== "ALL_DAPIL" && (
              <Badge variant="secondary" className="px-3 py-1">
                {
                  filterOptions.dapil.find((d) => d.value === filters.dapil)
                    ?.label
                }
              </Badge>
            )}
            {filters.kecamatan !== "ALL_KECAMATAN" && filters.kecamatan && (
              <Badge variant="secondary" className="px-3 py-1">
                {
                  filterOptions.kecamatan.find(
                    (k) => k.value === filters.kecamatan
                  )?.label
                }
              </Badge>
            )}
            {filters.desa && filters.desa !== "ALL_DESA" && (
              <Badge variant="secondary" className="px-3 py-1">
                {filters.desa}
              </Badge>
            )}
            {filters.tps && filters.tps !== "ALL_TPS" && (
              <Badge variant="secondary" className="px-3 py-1">
                TPS {filters.tps}
              </Badge>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <StatistikKPICards data={kpiData} loading={loading} />

        {/* Horizontal Chart Section - Full Width */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Ranking Perolehan Suara (
                {filters.jenisPemilu === "partai" ? "Per Partai" : "Per Caleg"})
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
        <StatistikDataTable data={tableData} loading={loading} />
      </div>
    </AdminLayout>
  );
}

export default StatistikPemiluPage;
