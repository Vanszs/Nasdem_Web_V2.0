"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, GitCompare, TrendingUp, TrendingDown, Minus, Search } from "lucide-react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDebounce } from "@/hooks/use-debounce";

// Types
interface FilterState {
  tahun: string;
  dapil: string;
  kecamatan?: string;
  desa?: string;
  caleg?: string;
}

interface ComparisonData {
  id: string;
  label: string;
  subLabel?: string;
  filter1: number;
  filter2: number;
  selisih: number;
  persentasePerubahan: number;
  color: string;
}

const PARTAI_COLORS: { [key: string]: string } = {
  NasDem: "#FF6B35",
  PDIP: "#DC143C",
  Golkar: "#FFD700",
  Gerindra: "#8B4513",
  PKB: "#006400",
  Demokrat: "#0000CD",
  PKS: "#000000",
  PAN: "#4169E1",
  PPP: "#228B22",
  Perindo: "#FF8C00",
};

const filterOptions = {
  tahun: [
    { label: "2024", value: "2024" },
    { label: "2019", value: "2019" },
  ],
  dapil: [
    { label: "Semua Dapil", value: "ALL_DAPIL" },
    { label: "Dapil I (Sidoarjo Utara)", value: "DAPIL_1" },
    { label: "Dapil II (Sidoarjo Tengah)", value: "DAPIL_2" },
    { label: "Dapil III (Sidoarjo Selatan)", value: "DAPIL_3" },
    { label: "Dapil IV (Sidoarjo Barat)", value: "DAPIL_4" },
  ],
  kecamatan: [
    { label: "Semua Kecamatan", value: "ALL_KECAMATAN" },
    { label: "Candi", value: "KEC_CANDI" },
    { label: "Sidoarjo", value: "KEC_SIDOARJO" },
    { label: "Waru", value: "KEC_WARU" },
    { label: "Krian", value: "KEC_KRIAN" },
  ],
  desa: [
    { label: "Semua Desa", value: "ALL_DESA" },
    { label: "Desa Kebonagung", value: "DESA_KEBONAGUNG" },
    { label: "Desa Pabean", value: "DESA_PABEAN" },
    { label: "Desa Sidokerto", value: "DESA_SIDOKERTO" },
    { label: "Desa Tambakrejo", value: "DESA_TAMBAKREJO" },
  ],
};

const COMPARISON_MODES = [
  { label: "Per Partai", value: "partai" },
  { label: "Per Caleg", value: "caleg" },
] as const;

const CALEG_DATA = [
  { id: "CALEG_NASDEM_1", name: "Adi Nugroho", partai: "NasDem" },
  { id: "CALEG_NASDEM_2", name: "Ratna Kurnia", partai: "NasDem" },
  { id: "CALEG_PDI_1", name: "Budi Santoso", partai: "PDIP" },
  { id: "CALEG_GOLKAR_1", name: "Maya Pratiwi", partai: "Golkar" },
  { id: "CALEG_GERINDRA_1", name: "Surya Pranata", partai: "Gerindra" },
  { id: "CALEG_PKB_1", name: "Rizky Maulana", partai: "PKB" },
  { id: "CALEG_DEMOCRAT_1", name: "Lia Hartati", partai: "Demokrat" },
];

const CALEG_OPTIONS = [
  { label: "Semua Caleg", value: "ALL_CALEG" },
  ...CALEG_DATA.map((caleg) => ({
    label: `${caleg.name} (${caleg.partai})`,
    value: caleg.id,
  })),
];

// Mock data generator
const generateMockData = (
  mode: "partai" | "caleg",
  selectedCaleg: string
): ComparisonData[] => {
  if (mode === "caleg") {
    const calegSourceRaw =
      selectedCaleg === "ALL_CALEG"
        ? CALEG_DATA
        : CALEG_DATA.filter((caleg) => caleg.id === selectedCaleg);
    const calegSource = calegSourceRaw.length > 0 ? calegSourceRaw : CALEG_DATA;

    return calegSource.map((item) => {
      const baseVote = Math.floor(Math.random() * 40000) + 8000;
      const delta = Math.floor(Math.random() * 15000) - 7000;
      const color = PARTAI_COLORS[item.partai] ?? "#1F2937";

      return {
        id: item.id,
        label: item.name,
        subLabel: item.partai,
        color,
        filter1: baseVote,
        filter2: baseVote + delta,
        selisih: 0,
        persentasePerubahan: 0,
      };
    });
  }

  const partaiSource = Object.entries(PARTAI_COLORS).map(([partai, color]) => ({
    id: partai,
    label: partai,
    color,
  }));

  return partaiSource.map((item) => {
    const baseVote = Math.floor(Math.random() * 50000) + 10000;
    const delta = Math.floor(Math.random() * 20000) - 10000;

    return {
      ...item,
      filter1: baseVote,
      filter2: baseVote + delta,
      selisih: 0,
      persentasePerubahan: 0,
    };
  });
};

export default function PerbandinganStatistikPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [comparisonMode, setComparisonMode] = useState<"partai" | "caleg">(
    (searchParams.get("mode") as "partai" | "caleg") || "partai"
  );
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [filter1, setFilter1] = useState<FilterState>({
    tahun: searchParams.get("filter1_tahun") || "2024",
    dapil: searchParams.get("filter1_dapil") || "ALL_DAPIL",
    kecamatan: searchParams.get("filter1_kecamatan") || "ALL_KECAMATAN",
    desa: searchParams.get("filter1_desa") || "ALL_DESA",
    caleg: searchParams.get("filter1_caleg") || "ALL_CALEG",
  });

  const [filter2, setFilter2] = useState<FilterState>({
    tahun: searchParams.get("filter2_tahun") || "2024",
    dapil: searchParams.get("filter2_dapil") || "ALL_DAPIL",
    kecamatan: searchParams.get("filter2_kecamatan") || "ALL_KECAMATAN",
    desa: searchParams.get("filter2_desa") || "ALL_DESA",
    caleg: searchParams.get("filter2_caleg") || "ALL_CALEG",
  });

  const handleModeChange = useCallback((value: "partai" | "caleg") => {
    setComparisonMode(value);
    if (value === "partai") {
      setFilter1((prev) => ({ ...prev, caleg: "ALL_CALEG" }));
      setFilter2((prev) => ({ ...prev, caleg: "ALL_CALEG" }));
    }
  }, []);

  const handleFilterChange = useCallback(
    (key: "filter1" | "filter2", field: keyof FilterState, value: string) => {
      if (field === "caleg") {
        setFilter1((prev) => ({ ...prev, caleg: value }));
        setFilter2((prev) => ({ ...prev, caleg: value }));
        return;
      }

      if (key === "filter1") {
        setFilter1((prev) => ({ ...prev, [field]: value }));
      } else {
        setFilter2((prev) => ({ ...prev, [field]: value }));
      }
    },
    []
  );

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("mode", comparisonMode);
    params.set("filter1_tahun", filter1.tahun);
    params.set("filter1_dapil", filter1.dapil);
    params.set("filter1_kecamatan", filter1.kecamatan || "ALL_KECAMATAN");
    params.set("filter1_desa", filter1.desa || "ALL_DESA");

    params.set("filter2_tahun", filter2.tahun);
    params.set("filter2_dapil", filter2.dapil);
    params.set("filter2_kecamatan", filter2.kecamatan || "ALL_KECAMATAN");
    params.set("filter2_desa", filter2.desa || "ALL_DESA");

    if (comparisonMode === "caleg") {
      params.set("filter1_caleg", filter1.caleg || "ALL_CALEG");
      params.set("filter2_caleg", filter2.caleg || "ALL_CALEG");
    } else {
      params.delete("filter1_caleg");
      params.delete("filter2_caleg");
    }

    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";

    router.replace(url, { scroll: false });
  }, [
    comparisonMode,
    filter1.tahun,
    filter1.dapil,
    filter1.kecamatan,
    filter1.desa,
    filter1.caleg,
    filter2.tahun,
    filter2.dapil,
    filter2.kecamatan,
    filter2.desa,
    filter2.caleg,
    router,
  ]);

  // Generate comparison data
  const comparisonData = useMemo(() => {
    const calegId = filter1.caleg || "ALL_CALEG";
    const mockData = generateMockData(comparisonMode, calegId);

    return mockData.map((item) => ({
      ...item,
      selisih: item.filter2 - item.filter1,
      persentasePerubahan:
        item.filter1 > 0 ? ((item.filter2 - item.filter1) / item.filter1) * 100 : 0,
    }));
  }, [
    comparisonMode,
    filter1.caleg,
    filter1.tahun,
    filter1.dapil,
    filter1.kecamatan,
    filter1.desa,
    filter2.tahun,
    filter2.dapil,
    filter2.kecamatan,
    filter2.desa,
  ]);

  const renderFilterCard = (
    key: "filter1" | "filter2",
    title: string,
    indicator: string,
    filterState: FilterState
  ) => {
    const fieldConfigs: Array<{
      field: keyof FilterState;
      label: string;
      options: { label: string; value: string }[];
    }> = [
      { field: "tahun", label: "Tahun Pemilu", options: filterOptions.tahun },
      { field: "dapil", label: "Daerah Pemilihan", options: filterOptions.dapil },
      { field: "kecamatan", label: "Kecamatan", options: filterOptions.kecamatan },
      { field: "desa", label: "Desa / Kelurahan", options: filterOptions.desa },
    ];

    if (comparisonMode === "caleg") {
      fieldConfigs.push({ field: "caleg", label: "Caleg", options: CALEG_OPTIONS });
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#001B55] text-sm font-semibold text-white">
              {indicator}
            </span>
            <div>
              <p className="text-sm font-semibold text-[#001B55]">{title}</p>
              <p className="text-xs text-[#6B7280]">
                Atur parameter untuk melihat performa
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {fieldConfigs.map(({ field, label, options }) => {
            const value = (filterState[field] as string | undefined) ?? options[0].value;

            return (
              <div key={field as string} className="space-y-2">
                <Label className="text-xs font-medium text-[#475569] uppercase tracking-wide">
                  {label}
                </Label>
                <Select
                  value={value}
                  onValueChange={(val) => handleFilterChange(key, field, val)}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white/90 text-sm font-medium text-[#001B55] shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 bg-white shadow-lg">
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-sm">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!debouncedSearch) return comparisonData;
    
    const term = debouncedSearch.toLowerCase();
    return comparisonData.filter((item) => {
      return (
        item.label.toLowerCase().includes(term) ||
        (item.subLabel && item.subLabel.toLowerCase().includes(term))
      );
    });
  }, [comparisonData, debouncedSearch]);

  // Sort filtered data by total votes
  const sortedData = [...filteredData].sort((a, b) => b.filter1 + b.filter2 - (a.filter1 + a.filter2));

  // Calculate totals
  const totals = useMemo(() => {
    const filter1Total = comparisonData.reduce((sum, item) => sum + item.filter1, 0);
    const filter2Total = comparisonData.reduce((sum, item) => sum + item.filter2, 0);
    return {
      filter1: filter1Total,
      filter2: filter2Total,
      selisih: filter2Total - filter1Total,
      persentasePerubahan: filter1Total > 0 ? ((filter2Total - filter1Total) / filter1Total) * 100 : 0,
    };
  }, [comparisonData]);

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    { label: "Statistik Pemilu", href: "/admin/statistik-pemilu" },
    { label: "Perbandingan Filter" },
  ];

  const entityLabel = comparisonMode === "partai" ? "Partai" : "Caleg";

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="mx-auto max-w-screen-xl space-y-8 px-3 py-6 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="h-9 rounded-full border border-slate-200 bg-white/80 px-4 text-sm font-medium text-[#001B55] backdrop-blur hover:bg-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>

        <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-[#001B55] p-3 text-white">
                  <GitCompare className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-[#001B55]">
                    Perbandingan Statistik Pemilu
                  </h1>
                  <p className="mt-1 max-w-xl text-sm text-[#475569]">
                    Analisis performa {entityLabel.toLowerCase()} berdasarkan dua konfigurasi filter yang berbeda.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
                {COMPARISON_MODES.map((mode) => (
                  <Button
                    key={mode.value}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleModeChange(mode.value)}
                    className={`rounded-full px-4 text-sm font-medium transition ${
                      comparisonMode === mode.value
                        ? "bg-white text-[#001B55] shadow-sm"
                        : "text-[#475569] hover:text-[#001B55]"
                    }`}
                  >
                    {mode.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {renderFilterCard("filter1", "Filter Pertama", "1", filter1)}
              {renderFilterCard("filter2", "Filter Kedua", "2", filter2)}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-none">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Total Filter 1
                </p>
                <p className="mt-2 text-2xl font-bold text-[#001B55]">
                  {totals.filter1.toLocaleString("id-ID")}
                </p>
                <Badge className="mt-3 w-fit rounded-full border border-slate-200 bg-white text-xs font-medium text-[#001B55]">
                  {filterOptions.tahun.find((item) => item.value === filter1.tahun)?.label}
                </Badge>
              </Card>

              <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-none">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Selisih Suara
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {totals.selisih > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : totals.selisih < 0 ? (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  ) : (
                    <Minus className="h-5 w-5 text-slate-400" />
                  )}
                  <p
                    className={`text-2xl font-bold ${
                      totals.selisih > 0
                        ? "text-green-600"
                        : totals.selisih < 0
                        ? "text-red-600"
                        : "text-[#001B55]"
                    }`}
                  >
                    {totals.selisih > 0 ? "+" : ""}
                    {totals.selisih.toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="mt-2 text-xs font-medium text-[#64748B]">
                  {totals.persentasePerubahan > 0 ? "+" : ""}
                  {totals.persentasePerubahan.toFixed(2)}%
                </p>
              </Card>

              <Card className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-none">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Total Filter 2
                </p>
                <p className="mt-2 text-2xl font-bold text-[#001B55]">
                  {totals.filter2.toLocaleString("id-ID")}
                </p>
                <Badge className="mt-3 w-fit rounded-full border border-slate-200 bg-white text-xs font-medium text-[#001B55]">
                  {filterOptions.tahun.find((item) => item.value === filter2.tahun)?.label}
                </Badge>
              </Card>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#001B55]">
                Grafik Perbandingan {entityLabel}
              </h2>
              <p className="text-sm text-[#64748B]">
                Visualisasi performa {entityLabel.toLowerCase()} untuk masing-masing filter.
              </p>
            </div>
          </div>
          <div className="mt-6 h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                  }}
                />
                <Legend />
                <Bar dataKey="filter1" name="Filter 1" fill="#001B55" radius={[10, 10, 0, 0]} />
                <Bar dataKey="filter2" name="Filter 2" fill="#C5BAFF" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#001B55]">Detail Perbandingan</h2>
              <p className="text-sm text-[#64748B]">
                Lihat agregasi suara dan tren untuk tiap {entityLabel.toLowerCase()}.
              </p>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#001B55]/60" />
              <Input
                placeholder={`Cari ${entityLabel.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 w-full rounded-xl border-slate-200 bg-white/90 text-sm font-medium text-[#001B55] shadow-none focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all duration-200"
              />
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-100 text-left text-sm text-[#001B55]">
                  <th className="rounded-l-2xl px-4 py-3 font-semibold">{entityLabel}</th>
                  <th className="px-4 py-3 text-right font-semibold">Filter 1</th>
                  <th className="px-4 py-3 text-right font-semibold">Filter 2</th>
                  <th className="px-4 py-3 text-right font-semibold">Selisih</th>
                  <th className="px-4 py-3 text-right font-semibold">Perubahan</th>
                  <th className="rounded-r-2xl px-4 py-3 text-center font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`text-sm transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    } hover:bg-slate-100/70`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <span
                          className="mt-1 h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <p className="font-semibold text-[#001B55]">{item.label}</p>
                          {item.subLabel && (
                            <p className="text-xs text-[#64748B]">{item.subLabel}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#001B55]">
                      {item.filter1.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#001B55]">
                      {item.filter2.toLocaleString("id-ID")}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        item.selisih > 0
                          ? "text-green-600"
                          : item.selisih < 0
                          ? "text-red-600"
                          : "text-[#475569]"
                      }`}
                    >
                      {item.selisih > 0 ? "+" : ""}
                      {item.selisih.toLocaleString("id-ID")}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        item.persentasePerubahan > 0
                          ? "text-green-600"
                          : item.persentasePerubahan < 0
                          ? "text-red-600"
                          : "text-[#475569]"
                      }`}
                    >
                      {item.persentasePerubahan > 0 ? "+" : ""}
                      {item.persentasePerubahan.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.persentasePerubahan > 0 ? (
                        <TrendingUp className="mx-auto h-5 w-5 text-green-500" />
                      ) : item.persentasePerubahan < 0 ? (
                        <TrendingDown className="mx-auto h-5 w-5 text-red-500" />
                      ) : (
                        <Minus className="mx-auto h-5 w-5 text-slate-400" />
                      )}
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#64748B]">
                      {debouncedSearch ? `Tidak ada ${entityLabel.toLowerCase()} yang cocok dengan pencarian "${debouncedSearch}"` : `Tidak ada data ${entityLabel.toLowerCase()}`}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 text-sm font-semibold text-[#001B55]">
                  <td className="rounded-bl-2xl px-4 py-3">TOTAL</td>
                  <td className="px-4 py-3 text-right">
                    {totals.filter1.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {totals.filter2.toLocaleString("id-ID")}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${
                      totals.selisih > 0
                        ? "text-green-600"
                        : totals.selisih < 0
                        ? "text-red-600"
                        : "text-[#475569]"
                    }`}
                  >
                    {totals.selisih > 0 ? "+" : ""}
                    {totals.selisih.toLocaleString("id-ID")}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${
                      totals.persentasePerubahan > 0
                        ? "text-green-600"
                        : totals.persentasePerubahan < 0
                        ? "text-red-600"
                        : "text-[#475569]"
                    }`}
                  >
                    {totals.persentasePerubahan > 0 ? "+" : ""}
                    {totals.persentasePerubahan.toFixed(2)}%
                  </td>
                  <td className="rounded-br-2xl px-4 py-3 text-center">
                    {totals.persentasePerubahan > 0 ? (
                      <TrendingUp className="mx-auto h-5 w-5 text-green-500" />
                    ) : totals.persentasePerubahan < 0 ? (
                      <TrendingDown className="mx-auto h-5 w-5 text-red-500" />
                    ) : (
                      <Minus className="mx-auto h-5 w-5 text-slate-400" />
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
