"use client";

import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, RefreshCw } from "lucide-react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { StatistikChartsSection } from "../components/statistik/StatistikChartsSection";
import { StatistikDataTable } from "../components/statistik/StatistikDataTable";
import { StatistikKPICards } from "../components/statistik/StatistikKPICards";

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

  // State untuk filter tabel (terpisah dari filter chart)
  const [tableFilters, setTableFilters] = useState<FilterState>({
    tahun: "2024",
    dapil: "", // Default kosong untuk placeholder "Pilih Dapil"
    kecamatan: "ALL_KECAMATAN",
    desa: "ALL_DESA",
    tps: "ALL_TPS",
    jenisPemilu: "partai",
    partai: "ALL_PARTAI",
  });

  // Auto-show table when Dapil is selected (including "Semua Dapil")
  const showTable = useMemo(() => {
    return tableFilters.dapil !== ""; // Muncul selama dapil sudah dipilih (termasuk ALL_DAPIL)
  }, [tableFilters.dapil]);

  React.useEffect(() => {
    // Auto-reset hierarchy when parent changes
    if (filters.dapil === "ALL_DAPIL") {
      setFilters((prev) => ({
        ...prev,
        kecamatan: "ALL_KECAMATAN",
        desa: "ALL_DESA",
        tps: "ALL_TPS",
      }));
    }
  }, [filters.dapil]);

  React.useEffect(() => {
    // Auto-reset desa & tps when kecamatan changes to ALL
    if (filters.kecamatan === "ALL_KECAMATAN") {
      setFilters((prev) => ({
        ...prev,
        desa: "ALL_DESA",
        tps: "ALL_TPS",
      }));
    }
  }, [filters.kecamatan]);

  React.useEffect(() => {
    // Auto-reset tps when desa changes to ALL
    if (filters.desa === "ALL_DESA") {
      setFilters((prev) => ({
        ...prev,
        tps: "ALL_TPS",
      }));
    }
  }, [filters.desa]);

  // Filter options
  const filterOptions = {
    tahun: [
      { value: "2024", label: "2024" },
      { value: "2019", label: "2019" },
      { value: "2014", label: "2014" },
    ],
    dapil: [
      { value: "ALL_DAPIL", label: "Semua Dapil" },
      { value: "Dapil 1", label: "Dapil 1 (10 kursi)" },
      { value: "Dapil 2", label: "Dapil 2 (9 kursi)" },
      { value: "Dapil 3", label: "Dapil 3 (8 kursi)" },
      { value: "Dapil 4", label: "Dapil 4 (7 kursi)" },
      { value: "Dapil 5", label: "Dapil 5 (8 kursi)" },
      { value: "Dapil 6", label: "Dapil 6 (8 kursi)" },
    ],
    // Mapping kecamatan ke dapil sesuai data resmi Pemilu 2024
    kecamatan: [
      // Dapil 1: Buduran, Sedati, Sidoarjo (10 kursi)
      { value: "buduran", label: "Buduran", dapil: "Dapil 1" },
      { value: "sedati", label: "Sedati", dapil: "Dapil 1" },
      { value: "sidoarjo", label: "Sidoarjo", dapil: "Dapil 1" },
      // Dapil 2: Candi, Jabon, Porong, Tanggulangin (9 kursi)
      { value: "candi", label: "Candi", dapil: "Dapil 2" },
      { value: "jabon", label: "Jabon", dapil: "Dapil 2" },
      { value: "porong", label: "Porong", dapil: "Dapil 2" },
      { value: "tanggulangin", label: "Tanggulangin", dapil: "Dapil 2" },
      // Dapil 3: Krembung, Prambon, Tulangan, Wonoayu (8 kursi)
      { value: "krembung", label: "Krembung", dapil: "Dapil 3" },
      { value: "prambon", label: "Prambon", dapil: "Dapil 3" },
      { value: "tulangan", label: "Tulangan", dapil: "Dapil 3" },
      { value: "wonoayu", label: "Wonoayu", dapil: "Dapil 3" },
      // Dapil 4: Balongbendo, Krian, Tarik (7 kursi)
      { value: "balongbendo", label: "Balongbendo", dapil: "Dapil 4" },
      { value: "krian", label: "Krian", dapil: "Dapil 4" },
      { value: "tarik", label: "Tarik", dapil: "Dapil 4" },
      // Dapil 5: Sukodono, Taman (8 kursi)
      { value: "sukodono", label: "Sukodono", dapil: "Dapil 5" },
      { value: "taman", label: "Taman", dapil: "Dapil 5" },
      // Dapil 6: Gedangan, Waru (8 kursi)
      { value: "gedangan", label: "Gedangan", dapil: "Dapil 6" },
      { value: "waru", label: "Waru", dapil: "Dapil 6" },
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

  // Dynamic options based on selection
  const getKecamatanOptions = (): Array<{ value: string; label: string; disabled?: boolean }> => {
    if (filters.dapil === "ALL_DAPIL") {
      return [{ value: "ALL_KECAMATAN", label: "Mohon pilih Dapil terlebih dahulu", disabled: true }];
    }
    return [
      { value: "ALL_KECAMATAN", label: "Semua Kecamatan" },
      ...filterOptions.kecamatan.filter((k) => k.dapil === filters.dapil)
    ];
  };

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
    // ==================== DAPIL 1: Buduran, Sedati, Sidoarjo (10 kursi) ====================
    // Buduran
    {
      dapil: "Dapil 1",
      kecamatan: "buduran",
      desa: "Siwalanpanji",
      tps: "001",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 142,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "buduran",
      desa: "Siwalanpanji",
      tps: "002",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 128,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "buduran",
      desa: "Buduran",
      tps: "001",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 115,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "buduran",
      desa: "Banjarkemantren",
      tps: "001",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 98,
    },
    // Sedati
    {
      dapil: "Dapil 1",
      kecamatan: "sedati",
      desa: "Sedatiagung",
      tps: "001",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 156,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "sedati",
      desa: "Sedatigede",
      tps: "001",
      partai: "PKB",
      caleg: "Maria Kusuma",
      suara: 134,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "sedati",
      desa: "Pabean",
      tps: "001",
      partai: "Gerindra",
      caleg: "Andi Prasetyo",
      suara: 121,
    },
    // Sidoarjo
    {
      dapil: "Dapil 1",
      kecamatan: "sidoarjo",
      desa: "Celep",
      tps: "001",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 188,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "sidoarjo",
      desa: "Sidokare",
      tps: "001",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 167,
    },
    {
      dapil: "Dapil 1",
      kecamatan: "sidoarjo",
      desa: "Urangagung",
      tps: "001",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 145,
    },

    // ==================== DAPIL 2: Candi, Jabon, Porong, Tanggulangin (9 kursi) ====================
    // Candi
    {
      dapil: "Dapil 2",
      kecamatan: "candi",
      desa: "Candi",
      tps: "001",
      partai: "NasDem",
      caleg: "Dr. Rizky Pratama",
      suara: 132,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "candi",
      desa: "Sepande",
      tps: "001",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 118,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "candi",
      desa: "Larangan",
      tps: "001",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 105,
    },
    // Jabon
    {
      dapil: "Dapil 2",
      kecamatan: "jabon",
      desa: "Permisan",
      tps: "001",
      partai: "NasDem",
      caleg: "Dr. Rizky Pratama",
      suara: 124,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "jabon",
      desa: "Kedungcangkring",
      tps: "001",
      partai: "PKB",
      caleg: "Maria Kusuma",
      suara: 112,
    },
    // Porong
    {
      dapil: "Dapil 2",
      kecamatan: "porong",
      desa: "Porong",
      tps: "001",
      partai: "NasDem",
      caleg: "Dr. Rizky Pratama",
      suara: 145,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "porong",
      desa: "Gedang",
      tps: "001",
      partai: "Gerindra",
      caleg: "Andi Prasetyo",
      suara: 128,
    },
    // Tanggulangin
    {
      dapil: "Dapil 2",
      kecamatan: "tanggulangin",
      desa: "Penatarsewu",
      tps: "001",
      partai: "NasDem",
      caleg: "Dr. Rizky Pratama",
      suara: 156,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "tanggulangin",
      desa: "Ketegan",
      tps: "001",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 141,
    },

    // ==================== DAPIL 3: Krembung, Prambon, Tulangan, Wonoayu (8 kursi) ====================
    // Krembung
    {
      dapil: "Dapil 3",
      kecamatan: "krembung",
      desa: "Krembung",
      tps: "001",
      partai: "NasDem",
      caleg: "Hj. Fatma Saifullah",
      suara: 138,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "krembung",
      desa: "Wangkal",
      tps: "001",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 122,
    },
    // Prambon
    {
      dapil: "Dapil 3",
      kecamatan: "prambon",
      desa: "Prambon",
      tps: "001",
      partai: "NasDem",
      caleg: "Hj. Fatma Saifullah",
      suara: 145,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "prambon",
      desa: "Kedungsugo",
      tps: "001",
      partai: "PKB",
      caleg: "Maria Kusuma",
      suara: 131,
    },
    // Tulangan
    {
      dapil: "Dapil 3",
      kecamatan: "tulangan",
      desa: "Tulangan",
      tps: "001",
      partai: "NasDem",
      caleg: "Hj. Fatma Saifullah",
      suara: 152,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "tulangan",
      desa: "Modong",
      tps: "001",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 136,
    },
    // Wonoayu
    {
      dapil: "Dapil 3",
      kecamatan: "wonoayu",
      desa: "Wonoayu",
      tps: "001",
      partai: "NasDem",
      caleg: "Hj. Fatma Saifullah",
      suara: 164,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "wonoayu",
      desa: "Panjunan",
      tps: "001",
      partai: "Gerindra",
      caleg: "Andi Prasetyo",
      suara: 148,
    },

    // ==================== DAPIL 4: Balongbendo, Krian, Tarik (7 kursi) ====================
    // Balongbendo
    {
      dapil: "Dapil 4",
      kecamatan: "balongbendo",
      desa: "Balongbendo",
      tps: "001",
      partai: "NasDem",
      caleg: "Ir. Bambang Wibowo",
      suara: 129,
    },
    {
      dapil: "Dapil 4",
      kecamatan: "balongbendo",
      desa: "Seduri",
      tps: "001",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 115,
    },
    // Krian
    {
      dapil: "Dapil 4",
      kecamatan: "krian",
      desa: "Krian",
      tps: "001",
      partai: "NasDem",
      caleg: "Ir. Bambang Wibowo",
      suara: 142,
    },
    {
      dapil: "Dapil 4",
      kecamatan: "krian",
      desa: "Tropodo",
      tps: "001",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 128,
    },
    // Tarik
    {
      dapil: "Dapil 4",
      kecamatan: "tarik",
      desa: "Tarik",
      tps: "001",
      partai: "NasDem",
      caleg: "Ir. Bambang Wibowo",
      suara: 135,
    },
    {
      dapil: "Dapil 4",
      kecamatan: "tarik",
      desa: "Kedinding",
      tps: "001",
      partai: "PKB",
      caleg: "Maria Kusuma",
      suara: 121,
    },

    // ==================== DAPIL 5: Sukodono, Taman (8 kursi) ====================
    // Sukodono
    {
      dapil: "Dapil 5",
      kecamatan: "sukodono",
      desa: "Sukodono",
      tps: "001",
      partai: "NasDem",
      caleg: "H. Abdul Malik",
      suara: 148,
    },
    {
      dapil: "Dapil 5",
      kecamatan: "sukodono",
      desa: "Panjunan",
      tps: "001",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 132,
    },
    // Taman
    {
      dapil: "Dapil 5",
      kecamatan: "taman",
      desa: "Taman",
      tps: "001",
      partai: "NasDem",
      caleg: "H. Abdul Malik",
      suara: 156,
    },
    {
      dapil: "Dapil 5",
      kecamatan: "taman",
      desa: "Sepanjang",
      tps: "001",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 141,
    },

    // ==================== DAPIL 6: Gedangan, Waru (8 kursi) ====================
    // Gedangan
    {
      dapil: "Dapil 6",
      kecamatan: "gedangan",
      desa: "Gedangan",
      tps: "001",
      partai: "NasDem",
      caleg: "Dra. Yuliana Sari",
      suara: 152,
    },
    {
      dapil: "Dapil 6",
      kecamatan: "gedangan",
      desa: "Ketajen",
      tps: "001",
      partai: "PDI-P",
      caleg: "Siti Nurhaliza",
      suara: 138,
    },
    // Waru
    {
      dapil: "Dapil 6",
      kecamatan: "waru",
      desa: "Waru",
      tps: "001",
      partai: "NasDem",
      caleg: "Dra. Yuliana Sari",
      suara: 165,
    },
    {
      dapil: "Dapil 6",
      kecamatan: "waru",
      desa: "Janti",
      tps: "001",
      partai: "Golkar",
      caleg: "Budi Santoso",
      suara: 149,
    },

    // ==================== DATA TAMBAHAN MULTI-CALEG PER PARTAI ====================
    // Tambahan caleg NasDem untuk variasi data
    {
      dapil: "Dapil 1",
      kecamatan: "buduran",
      desa: "Wadungasin",
      tps: "001",
      partai: "NasDem",
      caleg: "Dr. Rizky Pratama",
      suara: 105,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "candi",
      desa: "Bligo",
      tps: "001",
      partai: "NasDem",
      caleg: "Hj. Fatma Saifullah",
      suara: 98,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "wonoayu",
      desa: "Pilang",
      tps: "001",
      partai: "NasDem",
      caleg: "Ir. Bambang Wibowo",
      suara: 112,
    },
    {
      dapil: "Dapil 4",
      kecamatan: "krian",
      desa: "Kemasan",
      tps: "001",
      partai: "NasDem",
      caleg: "H. Abdul Malik",
      suara: 108,
    },
    {
      dapil: "Dapil 5",
      kecamatan: "taman",
      desa: "Trosobo",
      tps: "001",
      partai: "NasDem",
      caleg: "Dra. Yuliana Sari",
      suara: 115,
    },
    {
      dapil: "Dapil 6",
      kecamatan: "waru",
      desa: "Bungurasih",
      tps: "001",
      partai: "NasDem",
      caleg: "Ahmad Muhaimin",
      suara: 125,
    },

    // Tambahan caleg partai lain untuk variasi data
    {
      dapil: "Dapil 1",
      kecamatan: "sedati",
      desa: "Betro",
      tps: "001",
      partai: "PDI-P",
      caleg: "Drs. Arif Wibowo",
      suara: 122,
    },
    {
      dapil: "Dapil 2",
      kecamatan: "jabon",
      desa: "Kupang",
      tps: "001",
      partai: "Golkar",
      caleg: "H. Yusuf Hakim",
      suara: 109,
    },
    {
      dapil: "Dapil 3",
      kecamatan: "prambon",
      desa: "Temu",
      tps: "001",
      partai: "PKB",
      caleg: "H. Saiful Anam",
      suara: 118,
    },
    {
      dapil: "Dapil 4",
      kecamatan: "tarik",
      desa: "Singgogalih",
      tps: "001",
      partai: "Gerindra",
      caleg: "Nur Cahyo",
      suara: 103,
    },
    {
      dapil: "Dapil 5",
      kecamatan: "sukodono",
      desa: "Suruh",
      tps: "001",
      partai: "PDI-P",
      caleg: "Hj. Nurul Hidayati",
      suara: 125,
    },
    {
      dapil: "Dapil 6",
      kecamatan: "gedangan",
      desa: "Sawotratap",
      tps: "001",
      partai: "Golkar",
      caleg: "Dr. Agus Salim",
      suara: 131,
    },
  ];

  const PARTAI_META: Record<string, { color: string; logo: string }> = {
    NasDem: { color: "#001B55", logo: "/logo-nasdem.png" },
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
      logo: "/logo-nasdem.png",
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
  const getDesaOptions = (): Array<{ value: string; label: string; disabled?: boolean }> => {
    if (filters.kecamatan === "ALL_KECAMATAN") {
      return [{ value: "ALL_DESA", label: "Mohon pilih Kecamatan terlebih dahulu", disabled: true }];
    }
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

  const getTpsOptions = (): Array<{ value: string; label: string; disabled?: boolean }> => {
    if (filters.desa === "ALL_DESA") {
      return [{ value: "ALL_TPS", label: "Mohon pilih Desa terlebih dahulu", disabled: true }];
    }
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

  // Dynamic options for TABLE filters
  const getTableKecamatanOptions = (): Array<{ value: string; label: string; disabled?: boolean }> => {
    if (!tableFilters.dapil || tableFilters.dapil === "ALL_DAPIL") {
      return [{ value: "ALL_KECAMATAN", label: "Mohon pilih Dapil terlebih dahulu", disabled: true }];
    }
    return [
      { value: "ALL_KECAMATAN", label: "Semua Kecamatan" },
      ...filterOptions.kecamatan.filter((k) => k.dapil === tableFilters.dapil)
    ];
  };

  const getTableDesaOptions = (): Array<{ value: string; label: string; disabled?: boolean }> => {
    if (tableFilters.kecamatan === "ALL_KECAMATAN") {
      return [{ value: "ALL_DESA", label: "Mohon pilih Kecamatan terlebih dahulu", disabled: true }];
    }
    const desaSet = new Set<string>();
    baseRecords
      .filter((r) => r.kecamatan === tableFilters.kecamatan)
      .forEach((r) => desaSet.add(r.desa));
    return [
      { value: "ALL_DESA", label: "Semua Desa" },
      ...Array.from(desaSet)
        .sort()
        .map((d) => ({ value: d, label: d })),
    ];
  };

  const getTableTpsOptions = (): Array<{ value: string; label: string; disabled?: boolean }> => {
    if (tableFilters.desa === "ALL_DESA") {
      return [{ value: "ALL_TPS", label: "Mohon pilih Desa terlebih dahulu", disabled: true }];
    }
    const tpsSet = new Set<string>();
    baseRecords
      .filter(
        (r) => r.kecamatan === tableFilters.kecamatan && r.desa === tableFilters.desa
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

  // Filtered records untuk TABLE (berdasarkan tableFilters)
  const tableFilteredRecords = showTable ? baseRecords.filter((r) => {
    if (
      tableFilters.dapil !== "ALL_DAPIL" &&
      tableFilters.dapil &&
      r.dapil !== tableFilters.dapil
    )
      return false;
    if (
      tableFilters.kecamatan !== "ALL_KECAMATAN" &&
      tableFilters.kecamatan &&
      r.kecamatan !== tableFilters.kecamatan
    )
      return false;
    if (tableFilters.desa !== "ALL_DESA" && r.desa !== tableFilters.desa) return false;
    if (tableFilters.tps !== "ALL_TPS" && r.tps !== tableFilters.tps) return false;
    return true;
  }) : [];

  // Table data untuk tampilan tabel
  const finalTableData: TableData[] = tableFilteredRecords.map((r) => {
    const totalArea = tableFilteredRecords.reduce((s, rr) => s + rr.suara, 0) || 1;
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

  const handleRefreshData = React.useCallback(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const chartData = aggregatedForChart; // sebelumnya static

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#001B55] rounded-xl shadow-sm">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#001B55] leading-tight">
                  Analytics Statistik Pemilu
                </h1>
                <p className="text-[#6B7280] mt-1 text-sm">
                  Dashboard analisis real-time hasil pemilihan umum
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <Calendar className="w-4 h-4" />
                Update: {new Date().toLocaleString("id-ID")}
              </div>
              <Button
                onClick={handleRefreshData}
                size="sm"
                variant="outline"
                disabled={loading}
                className="h-9 bg-[#F0F0F0] text-[#001B55] hover:bg-[#001B55] hover:text-white border border-[#F0F0F0] hover:border-[#001B55] transition-all duration-300"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Tahun */}
            <Select
              value={filters.tahun}
              onValueChange={(value) =>
                setFilters({ ...filters, tahun: value })
              }
            >
              <SelectTrigger className="h-10 w-[140px] bg-white border-2 border-gray-300 text-[#001B55] hover:border-[#001B55] focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-colors">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {filterOptions.tahun.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-[#F0F0F0]">
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
              <SelectTrigger className="h-10 w-[180px] bg-white border-2 border-gray-300 text-[#001B55] hover:border-[#001B55] focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-colors">
                <SelectValue placeholder="Jenis Pemilu" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {filterOptions.jenisPemilu.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-[#F0F0F0]">
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
              <SelectTrigger className="h-10 w-[160px] bg-white border-2 border-gray-300 text-[#001B55] hover:border-[#001B55] focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-colors">
                <SelectValue placeholder="Dapil" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {filterOptions.dapil.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-[#F0F0F0]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Kecamatan (level 2) */}
            <Select
              value={filters.kecamatan}
              onValueChange={(value) => {
                // Hanya update jika bukan opsi disabled
                if (filters.dapil !== "ALL_DAPIL") {
                  setFilters({
                    ...filters,
                    kecamatan: value,
                    desa: "ALL_DESA",
                    tps: "ALL_TPS",
                  });
                }
              }}
            >
              <SelectTrigger className="h-10 w-[180px] bg-white border-2 border-gray-300 text-[#001B55] hover:border-[#001B55] focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-colors">
                <SelectValue>
                  {filters.dapil === "ALL_DAPIL" 
                    ? "Pilih Kecamatan" 
                    : filters.kecamatan === "ALL_KECAMATAN"
                    ? "Semua Kecamatan"
                    : getKecamatanOptions().find(k => k.value === filters.kecamatan)?.label || "Pilih Kecamatan"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {getKecamatanOptions().map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value} 
                    disabled={option.disabled}
                    className={option.disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-[#F0F0F0]"}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Desa (level 3) */}
            <Select
              value={filters.desa}
              onValueChange={(value) => {
                // Hanya update jika parent sudah dipilih
                if (filters.kecamatan !== "ALL_KECAMATAN") {
                  setFilters({ ...filters, desa: value, tps: "ALL_TPS" });
                }
              }}
            >
              <SelectTrigger className="h-10 w-[160px] bg-white border-2 border-gray-300 text-[#001B55] hover:border-[#001B55] focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-colors">
                <SelectValue>
                  {filters.kecamatan === "ALL_KECAMATAN"
                    ? "Pilih Desa"
                    : filters.desa === "ALL_DESA"
                    ? "Semua Desa"
                    : getDesaOptions().find(d => d.value === filters.desa)?.label || "Pilih Desa"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {getDesaOptions().map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                    className={option.disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-[#F0F0F0]"}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* TPS (level 4) - DISABLED sementara */}
            <Select
              value={filters.tps}
              onValueChange={(value) => {
                // Hanya update jika parent sudah dipilih
                if (filters.desa !== "ALL_DESA") {
                  setFilters({ ...filters, tps: value });
                }
              }}
              disabled={true}
            >
              <SelectTrigger className="h-10 w-[150px] bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed transition-colors">
                <SelectValue>
                  Pilih TPS
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {getTpsOptions().map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                    className={option.disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-[#F0F0F0]"}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active filters */}
          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[#001B55]">
              Filter Aktif:
            </span>
            <Badge className="px-3 py-1 border border-[#001B55]/20 bg-white text-[#001B55] text-xs">
              {filters.tahun}
            </Badge>
            <Badge className="px-3 py-1 border border-[#001B55]/20 bg-white text-[#001B55] text-xs">
              {
                filterOptions.jenisPemilu.find(
                  (j) => j.value === filters.jenisPemilu
                )?.label
              }
            </Badge>
            {filters.dapil !== "ALL_DAPIL" && (
              <Badge className="px-3 py-1 border border-emerald-500/20 bg-white text-emerald-600 text-xs">
                {
                  filterOptions.dapil.find((d) => d.value === filters.dapil)
                    ?.label
                }
              </Badge>
            )}
            {filters.kecamatan !== "ALL_KECAMATAN" && filters.kecamatan && (
              <Badge className="px-3 py-1 border border-blue-500/20 bg-white text-blue-600 text-xs">
                {
                  filterOptions.kecamatan.find(
                    (k) => k.value === filters.kecamatan
                  )?.label
                }
              </Badge>
            )}
            {filters.desa && filters.desa !== "ALL_DESA" && (
              <Badge className="px-3 py-1 border border-gray-400/20 bg-white text-gray-600 text-xs">
                {filters.desa}
              </Badge>
            )}
            {filters.tps && filters.tps !== "ALL_TPS" && (
              <Badge className="px-3 py-1 border border-red-500/20 bg-white text-red-600 text-xs">
                TPS {filters.tps}
              </Badge>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <StatistikKPICards data={kpiData} loading={loading} />

        {/* Horizontal Chart Section - Full Width */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#001B55]">
                Ranking Perolehan Suara (
                {filters.jenisPemilu === "partai" ? "Per Partai" : "Per Caleg"})
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Diagram batang horizontal dengan peringkat terbaru
              </p>
            </div>
            <div className="text-xs text-[#6B7280] bg-[#F0F0F0] px-3 py-1 rounded-full">
              Update: {new Date().toLocaleTimeString("id-ID")}
            </div>
          </div>
          <StatistikChartsSection
            data={chartData}
            view={filters.jenisPemilu}
            loading={loading}
          />
        </div>

        {/* Data Table - Full Width */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#001B55] mb-2">
              Tabel Data Hasil Pemilu (Pivot Dapil)
            </h2>
            <p className="text-sm text-[#6B7280]">
              Terapkan filter untuk menampilkan data tabel
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Tahun */}
            <Select
              value={tableFilters.tahun}
              onValueChange={(value) =>
                setTableFilters({ ...tableFilters, tahun: value })
              }
            >
              <SelectTrigger className="h-10 w-[140px] bg-white border-2 border-gray-300 text-[#001B55] hover:border-[#001B55] focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-colors">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {filterOptions.tahun.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-[#F0F0F0]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Jenis Pemilu */}
            <Select
              value={tableFilters.jenisPemilu}
              onValueChange={(value) =>
                setTableFilters({ ...tableFilters, jenisPemilu: value })
              }
            >
              <SelectTrigger className="h-10 w-[180px] bg-white border-2 border-gray-300 text-[#001B55] hover:border-[#001B55] focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-colors">
                <SelectValue placeholder="Jenis Pemilu" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {filterOptions.jenisPemilu.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-[#F0F0F0]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Dapil */}
            <Select
              value={tableFilters.dapil}
              onValueChange={(value) =>
                setTableFilters({
                  ...tableFilters,
                  dapil: value,
                  kecamatan: "ALL_KECAMATAN",
                  desa: "ALL_DESA",
                  tps: "ALL_TPS",
                })
              }
            >
              <SelectTrigger className="h-10 w-[160px] bg-white border-2 border-gray-300 text-[#001B55] hover:border-[#001B55] focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-colors">
                <SelectValue placeholder="Pilih Dapil">
                  {tableFilters.dapil 
                    ? filterOptions.dapil.find(d => d.value === tableFilters.dapil)?.label || "Pilih Dapil"
                    : "Pilih Dapil"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {filterOptions.dapil.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-[#F0F0F0]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Kecamatan */}
            <Select
              value={tableFilters.kecamatan}
              onValueChange={(value) => {
                if (tableFilters.dapil && tableFilters.dapil !== "ALL_DAPIL") {
                  setTableFilters({
                    ...tableFilters,
                    kecamatan: value,
                    desa: "ALL_DESA",
                    tps: "ALL_TPS",
                  });
                }
              }}
            >
              <SelectTrigger className="h-10 w-[180px] bg-white border-2 border-gray-300 text-[#001B55] hover:border-[#001B55] focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-colors">
                <SelectValue>
                  {!tableFilters.dapil || tableFilters.dapil === "ALL_DAPIL"
                    ? "Pilih Kecamatan" 
                    : tableFilters.kecamatan === "ALL_KECAMATAN"
                    ? "Semua Kecamatan"
                    : getTableKecamatanOptions().find(k => k.value === tableFilters.kecamatan)?.label || "Pilih Kecamatan"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {getTableKecamatanOptions().map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value} 
                    disabled={option.disabled}
                    className={option.disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-[#F0F0F0]"}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Desa */}
            <Select
              value={tableFilters.desa}
              onValueChange={(value) => {
                if (tableFilters.kecamatan !== "ALL_KECAMATAN") {
                  setTableFilters({ ...tableFilters, desa: value, tps: "ALL_TPS" });
                }
              }}
            >
              <SelectTrigger className="h-10 w-[160px] bg-white border-2 border-gray-300 text-[#001B55] hover:border-[#001B55] focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-colors">
                <SelectValue>
                  {tableFilters.kecamatan === "ALL_KECAMATAN"
                    ? "Pilih Desa"
                    : tableFilters.desa === "ALL_DESA"
                    ? "Semua Desa"
                    : getTableDesaOptions().find(d => d.value === tableFilters.desa)?.label || "Pilih Desa"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {getTableDesaOptions().map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                    className={option.disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-[#F0F0F0]"}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* TPS - Disabled */}
            <Select
              value={tableFilters.tps}
              onValueChange={(value) => {
                if (tableFilters.desa !== "ALL_DESA") {
                  setTableFilters({ ...tableFilters, tps: value });
                }
              }}
              disabled={true}
            >
              <SelectTrigger className="h-10 w-[150px] bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed transition-colors">
                <SelectValue>
                  Pilih TPS
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#F0F0F0] text-[#001B55]">
                {getTableTpsOptions().map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                    className={option.disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-[#F0F0F0]"}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table or Empty State */}
          {showTable ? (
            <StatistikDataTable data={finalTableData} loading={loading} />
          ) : (
            <div className="text-center py-12 bg-[#F0F0F0]/30 rounded-xl border-2 border-dashed border-gray-300">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-[#001B55]/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-[#001B55]" />
                </div>
                <h3 className="text-lg font-semibold text-[#001B55]">
                  Pilih Dapil untuk Menampilkan Data
                </h3>
                <p className="text-sm text-[#6B7280] max-w-md">
                  Tabel akan otomatis muncul setelah Anda memilih Dapil atau filter lainnya
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default StatistikPemiluPage;
