"use client";
import React, { Fragment, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Crown,
  Medal,
  Award,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { KPICard } from "../../components/dashboard/KPICard";

export function StatistikPemiluPage() {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Statistik Pemilu" },
  ];

  // State for filters with cascading support
  const [filters, setFilters] = useState({
    tahun: "2024",
    tingkatWilayah: "kecamatan",
    wilayahTerpilih: "all",
    jenisPemilu: "partai",
    // Cascading filters for TPS
    kecamatanTerpilih: "",
    desaTerpilih: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedParty, setSelectedParty] = useState<{ [key: string]: string }>(
    {}
  );

  // Filter options data with correct Sidoarjo hierarchy
  const filterOptions = {
    tahun: ["2024", "2019", "2014"],
    tingkatWilayah: [
      { value: "dapil", label: "Dapil" },
      { value: "kecamatan", label: "Kecamatan" },
      { value: "desa", label: "Desa/Kelurahan" },
      { value: "tps", label: "TPS" },
    ],
    wilayahData: {
      dapil: [
        {
          value: "dapil1",
          label: "Dapil 1 - Sidoarjo Utara",
          kecamatan: ["sidoarjo", "buduran", "sukodono"],
        },
        {
          value: "dapil2",
          label: "Dapil 2 - Sidoarjo Selatan",
          kecamatan: ["waru", "gedangan", "sedati"],
        },
        {
          value: "dapil3",
          label: "Dapil 3 - Sidoarjo Timur",
          kecamatan: ["taman", "wonoayu", "krian"],
        },
      ],
      kecamatan: [
        {
          value: "sidoarjo",
          label: "Sidoarjo",
          desa: ["kemiri", "sekardangan", "bulusidokare", "magersari"],
        },
        {
          value: "waru",
          label: "Waru",
          desa: ["kepuhkiriman", "tropodo", "bundaran", "medaengkulon"],
        },
        {
          value: "gedangan",
          label: "Gedangan",
          desa: ["kedungbanteng", "sawotratap", "ketajen", "buncitan"],
        },
        {
          value: "taman",
          label: "Taman",
          desa: ["jemundo", "sepanjang", "trosobo", "kramatjegu"],
        },
        {
          value: "sukodono",
          label: "Sukodono",
          desa: ["sukodono", "prambon", "gelam", "lebo"],
        },
        {
          value: "buduran",
          label: "Buduran",
          desa: ["siwalanpanji", "buduran", "sawohan", "banjarkemantren"],
        },
      ],
      desa: [
        // Kemiri (Sidoarjo)
        {
          value: "kemiri",
          label: "Kemiri",
          tps: ["001", "002", "003", "004", "005"],
        },
        {
          value: "sekardangan",
          label: "Sekardangan",
          tps: ["001", "002", "003", "004"],
        },
        {
          value: "bulusidokare",
          label: "Bulusidokare",
          tps: ["001", "002", "003"],
        },
        {
          value: "magersari",
          label: "Magersari",
          tps: ["001", "002", "003", "004", "005", "006"],
        },
        // Waru
        {
          value: "kepuhkiriman",
          label: "Kepuh Kiriman",
          tps: ["001", "002", "003", "004"],
        },
        {
          value: "tropodo",
          label: "Tropodo",
          tps: ["001", "002", "003", "004", "005"],
        },
        { value: "bundaran", label: "Bundaran", tps: ["001", "002", "003"] },
        {
          value: "medaengkulon",
          label: "Medaeng Kulon",
          tps: ["001", "002", "003", "004"],
        },
      ],
      tps: [
        { value: "001", label: "TPS 001" },
        { value: "002", label: "TPS 002" },
        { value: "003", label: "TPS 003" },
        { value: "004", label: "TPS 004" },
        { value: "005", label: "TPS 005" },
        { value: "006", label: "TPS 006" },
      ],
    },
    jenisPemilu: [
      { value: "partai", label: "Partai" },
      { value: "caleg", label: "Caleg" },
    ],
  };

  // Helper functions for cascading filters
  const getAvailableWilayah = () => {
    const tingkat = filters.tingkatWilayah;
    if (tingkat === "dapil") return filterOptions.wilayahData.dapil;
    if (tingkat === "kecamatan") return filterOptions.wilayahData.kecamatan;
    if (tingkat === "desa") {
      // For desa, show all available desa
      return filterOptions.wilayahData.desa;
    }
    if (tingkat === "tps") {
      // For TPS, we need cascading selection
      return [];
    }
    return [];
  };

  const getAvailableKecamatan = () => {
    return filterOptions.wilayahData.kecamatan;
  };

  const getAvailableDesa = () => {
    if (filters.kecamatanTerpilih) {
      const selectedKecamatan = filterOptions.wilayahData.kecamatan.find(
        (k) => k.value === filters.kecamatanTerpilih
      );
      if (selectedKecamatan && selectedKecamatan.desa) {
        return selectedKecamatan.desa.map((desa) => ({
          value: desa,
          label:
            filterOptions.wilayahData.desa.find((d) => d.value === desa)
              ?.label || desa,
        }));
      }
    }
    return [];
  };

  const getAvailableTPS = () => {
    if (filters.desaTerpilih) {
      const selectedDesa = filterOptions.wilayahData.desa.find(
        (d) => d.value === filters.desaTerpilih
      );
      if (selectedDesa && selectedDesa.tps) {
        return selectedDesa.tps.map((tps) => ({
          value: tps,
          label: `TPS ${tps}`,
        }));
      }
    }
    return [];
  };

  // Mock data untuk statistik pemilu dan data pemilih
  const statistikData = {
    totalPemilih: 1247500,
    targetSuara: 187125, // 15% dari total pemilih
    perolehanSuara: 156890,
    tingkatPartisipasi: 78.5,
    wilayahKemenangan: 12,
    totalWilayah: 18,
  };

  // Data Daftar Pemilih Tetap (DPT), DPTb, DPK
  const dataPemilih = {
    dpt: 1125480, // Daftar Pemilih Tetap
    dptb: 89720, // Daftar Pemilih Tetap Tambahan
    dpk: 32300, // Daftar Pemilih Khusus
    totalPenggunaHakPilih: 1125480 + 89720 + 32300, // Total dari ketiga data diatas
  };

  // Data podium berdasarkan filter
  const getPodiumData = () => {
    if (filters.jenisPemilu === "partai") {
      return [
        {
          position: 1,
          nama: "NasDem",
          suara: 156890,
          persentase: 25.2,
          color: "#001B55",
          logo: "https://3ddf5d7fd7925dee0e85e0f90f634610.cdn.bubble.io/cdn-cgi/image/w=,h=,f=auto,dpr=1,fit=contain/f1725810719774x866964533797845800/NASDEM.png",
        },
        {
          position: 2,
          nama: "PDI-P",
          suara: 142300,
          persentase: 22.8,
          color: "#DC2626",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFvwgvCiFnFZPZv21EAA6u2LQg_pCem8lHIw&s",
        },
        {
          position: 3,
          nama: "Golkar",
          suara: 128450,
          persentase: 20.6,
          color: "#EAB308",
          logo: "https://hetifah.id/wp-content/uploads/Partai-Golkar-web.jpg",
        },
      ];
    } else {
      // Data caleg
      return [
        {
          position: 1,
          nama: "Dr. Ahmad Mulyadi",
          partai: "NasDem",
          suara: 45890,
          persentase: 18.2,
          color: "#001B55",
          logo: "https://3ddf5d7fd7925dee0e85e0f90f634610.cdn.bubble.io/cdn-cgi/image/w=,h=,f=auto,dpr=1,fit=contain/f1725810719774x866964533797845800/NASDEM.png",
        },
        {
          position: 2,
          nama: "Siti Nurhaliza, S.H",
          partai: "PDI-P",
          suara: 42300,
          persentase: 16.8,
          color: "#DC2626",
          logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFvwgvCiFnFZPZv21EAA6u2LQg_pCem8lHIw&s",
        },
        {
          position: 3,
          nama: "Budi Santoso, M.Si",
          partai: "Golkar",
          suara: 38450,
          persentase: 15.3,
          color: "#EAB308",
          logo: "https://hetifah.id/wp-content/uploads/Partai-Golkar-web.jpg",
        },
      ];
    }
  };

  // Data chart untuk perolehan suara keseluruhan
  const getChartData = () => {
    if (filters.jenisPemilu === "partai") {
      return [
        { nama: "NasDem", suara: 156890, persentase: 25.2, color: "#001B55" },
        { nama: "PDI-P", suara: 142300, persentase: 22.8, color: "#DC2626" },
        { nama: "Golkar", suara: 128450, persentase: 20.6, color: "#EAB308" },
        { nama: "Gerindra", suara: 95200, persentase: 15.3, color: "#8B4513" },
        { nama: "PKB", suara: 78500, persentase: 12.6, color: "#10B981" },
        { nama: "Demokrat", suara: 62800, persentase: 10.1, color: "#3B82F6" },
        { nama: "PKS", suara: 45600, persentase: 7.3, color: "#000000" },
        { nama: "Lainnya", suara: 38250, persentase: 6.1, color: "#6B7280" },
      ];
    } else {
      return [
        {
          nama: "Dr. Ahmad Mulyadi (NasDem)",
          suara: 45890,
          persentase: 18.2,
          color: "#001B55",
        },
        {
          nama: "Siti Nurhaliza (PDI-P)",
          suara: 42300,
          persentase: 16.8,
          color: "#DC2626",
        },
        {
          nama: "Budi Santoso (Golkar)",
          suara: 38450,
          persentase: 15.3,
          color: "#EAB308",
        },
        {
          nama: "Andi Wijaya (Gerindra)",
          suara: 35200,
          persentase: 14.0,
          color: "#8B4513",
        },
        {
          nama: "Maria Sari (PKB)",
          suara: 32500,
          persentase: 12.9,
          color: "#10B981",
        },
        {
          nama: "Tommy Hasan (Demokrat)",
          suara: 28800,
          persentase: 11.4,
          color: "#3B82F6",
        },
        {
          nama: "Fatimah Zahra (PKS)",
          suara: 25600,
          persentase: 10.2,
          color: "#000000",
        },
        { nama: "Lainnya", suara: 28250, persentase: 11.2, color: "#6B7280" },
      ];
    }
  };

  const podiumData = getPodiumData();
  const chartData = getChartData();

  // Data untuk tabel statistik per wilayah berdasarkan tingkatan
  const getStatistikWilayahData = () => {
    const tingkat = filters.tingkatWilayah;

    if (tingkat === "dapil") {
      // Jika tingkat dapil, tampilkan data kecamatan
      return {
        headers: [
          "NasDem",
          "PDI-P",
          "Golkar",
          "Gerindra",
          "PKB",
          "Kecamatan",
          "Total Pemilih",
        ],
        data: [
          {
            nama: "Sidoarjo",
            totalPemilih: 125480,
            hasil: {
              nasdem: 18750,
              pdip: 16890,
              golkar: 15430,
              gerindra: 12340,
              pkb: 10560,
            },
            calegData: {
              nasdem: [
                { nama: "Dr. Ahmad Mulyadi", suara: 8500 },
                { nama: "Siti Aminah, S.H", suara: 6200 },
                { nama: "Budi Hartono", suara: 4050 },
              ],
              pdip: [
                { nama: "Ir. Soekarno Jr", suara: 7800 },
                { nama: "Megawati Putri", suara: 5600 },
                { nama: "Joko Widodo", suara: 3490 },
              ],
              golkar: [
                { nama: "Tommy Soeharto", suara: 7200 },
                { nama: "Airlangga Muda", suara: 5130 },
                { nama: "Bambang Trihatmodjo", suara: 3100 },
              ],
              gerindra: [
                { nama: "Prabowo Jr", suara: 5800 },
                { nama: "Sandiaga Salahudin", suara: 4200 },
                { nama: "Fadli Zonk", suara: 2340 },
              ],
              pkb: [
                { nama: "Gus Dur Muda", suara: 4900 },
                { nama: "Cak Imin Jr", suara: 3560 },
                { nama: "Mahfud MD", suara: 2100 },
              ],
            },
          },
          {
            nama: "Waru",
            totalPemilih: 142300,
            hasil: {
              nasdem: 21340,
              pdip: 19250,
              golkar: 17560,
              gerindra: 14080,
              pkb: 12010,
            },
            calegData: {
              nasdem: [
                { nama: "Dra. Siti Nurhaliza", suara: 9800 },
                { nama: "H. Ahmad Dahlan", suara: 7200 },
                { nama: "Ir. Bambang Waru", suara: 4340 },
              ],
              pdip: [
                { nama: "Taufik Kiemas Jr", suara: 8900 },
                { nama: "Hasto Kristiyanto", suara: 6450 },
                { nama: "Djarot Saiful", suara: 3900 },
              ],
              golkar: [
                { nama: "Setya Novanto Jr", suara: 8200 },
                { nama: "Ade Komarudin", suara: 5860 },
                { nama: "Fadel Muhammad", suara: 3500 },
              ],
              gerindra: [
                { nama: "Edhy Prabowo", suara: 6600 },
                { nama: "Rachmat Gobel", suara: 4800 },
                { nama: "Andre Rosiade", suara: 2680 },
              ],
              pkb: [
                { nama: "Said Aqil Siradj", suara: 5600 },
                { nama: "Abdul Kadir Karding", suara: 4010 },
                { nama: "Jazilul Fawaid", suara: 2400 },
              ],
            },
          },
          {
            nama: "Gedangan",
            totalPemilih: 98720,
            hasil: {
              nasdem: 14810,
              pdip: 13340,
              golkar: 12150,
              gerindra: 9750,
              pkb: 8320,
            },
            calegData: {
              nasdem: [
                { nama: "H. Surya Paloh Jr", suara: 6800 },
                { nama: "Johnny Plate", suara: 4900 },
                { nama: "Taufik Basari", suara: 3110 },
              ],
              pdip: [
                { nama: "Prananda Paloh", suara: 6200 },
                { nama: "Eva Kusuma Sundari", suara: 4540 },
                { nama: "Maruarar Sirait", suara: 2600 },
              ],
              golkar: [
                { nama: "Bahlil Lahadalia", suara: 5700 },
                { nama: "Dave Laksono", suara: 4050 },
                { nama: "Ridwan Bae", suara: 2400 },
              ],
              gerindra: [
                { nama: "Ahmad Riza Patria", suara: 4600 },
                { nama: "Sugiono", suara: 3350 },
                { nama: "Thomas Djiwandono", suara: 1800 },
              ],
              pkb: [
                { nama: "Helmy Faishal", suara: 3900 },
                { nama: "Daniel Johan", suara: 2820 },
                { nama: "Abdul Muhaimin", suara: 1600 },
              ],
            },
          },
        ],
      };
    } else if (tingkat === "kecamatan") {
      // Jika tingkat kecamatan, tampilkan data desa
      return {
        headers: [
          "NasDem",
          "PDI-P",
          "Golkar",
          "Gerindra",
          "PKB",
          "Desa/Kelurahan",
          "Total Pemilih",
        ],
        data: [
          {
            nama: "Kemiri",
            totalPemilih: 28450,
            hasil: {
              nasdem: 4270,
              pdip: 3850,
              golkar: 3510,
              gerindra: 2810,
              pkb: 2400,
            },
            calegData: {
              nasdem: [
                { nama: "H. Agus Kemiri", suara: 1950 },
                { nama: "Siti Khadijah", suara: 1420 },
                { nama: "Bambang Sutrisno", suara: 900 },
              ],
              pdip: [
                { nama: "Wahyu Setiawan", suara: 1800 },
                { nama: "Indira Chunda", suara: 1280 },
                { nama: "Adian Napitupulu", suara: 770 },
              ],
              golkar: [
                { nama: "Zulkifli Hasan Jr", suara: 1640 },
                { nama: "Melani Leimena", suara: 1170 },
                { nama: "Bobby Adhityo", suara: 700 },
              ],
              gerindra: [
                { nama: "Sufmi Dasco", suara: 1320 },
                { nama: "Martin Manurung", suara: 950 },
                { nama: "Habiburokhman", suara: 540 },
              ],
              pkb: [
                { nama: "Djan Faridz", suara: 1120 },
                { nama: "Anisah Syakur", suara: 810 },
                { nama: "Ali Taher", suara: 470 },
              ],
            },
          },
          {
            nama: "Sekardangan",
            totalPemilih: 35200,
            hasil: {
              nasdem: 5280,
              pdip: 4760,
              golkar: 4340,
              gerindra: 3470,
              pkb: 2970,
            },
            calegData: {
              nasdem: [
                { nama: "Dr. Ratna Juwita", suara: 2400 },
                { nama: "Ahmad Sahroni", suara: 1780 },
                { nama: "Dede Yusuf Macan", suara: 1100 },
              ],
              pdip: [
                { nama: "Puan Maharani Jr", suara: 2200 },
                { nama: "Ribka Tjiptaning", suara: 1560 },
                { nama: "Charles Honoris", suara: 1000 },
              ],
              golkar: [
                { nama: "Agus Gumiwang", suara: 2000 },
                { nama: "Erwin Aksa", suara: 1440 },
                { nama: "Dito Ganinduto", suara: 900 },
              ],
              gerindra: [
                { nama: "Dedi Mulyadi", suara: 1620 },
                { nama: "Yorrys Raweyai", suara: 1150 },
                { nama: "Junimart Girsang", suara: 700 },
              ],
              pkb: [
                { nama: "Muhaimin Iskandar Jr", suara: 1380 },
                { nama: "Marwan Dasopang", suara: 990 },
                { nama: "Abdul Hakam", suara: 600 },
              ],
            },
          },
        ],
      };
    } else if (tingkat === "desa" || tingkat === "tps") {
      // Jika tingkat desa atau tps, tampilkan data TPS
      return {
        headers: [
          "NasDem",
          "PDI-P",
          "Golkar",
          "Gerindra",
          "PKB",
          "TPS",
          "Total Pemilih",
        ],
        data: [
          {
            nama: "TPS 001",
            totalPemilih: 250,
            hasil: {
              nasdem: 38,
              pdip: 34,
              golkar: 31,
              gerindra: 25,
              pkb: 21,
            },
            calegData: {
              nasdem: [
                { nama: "Ahmad Basuki", suara: 18 },
                { nama: "Siti Aminah", suara: 12 },
                { nama: "Bambang Hadi", suara: 8 },
              ],
              pdip: [
                { nama: "Joko Widodo Jr", suara: 16 },
                { nama: "Megawati Jr", suara: 11 },
                { nama: "Ganjar Pranowo", suara: 7 },
              ],
              golkar: [
                { nama: "Airlangga Jr", suara: 15 },
                { nama: "Ridwan Kamil", suara: 10 },
                { nama: "Bambang Soesatyo", suara: 6 },
              ],
              gerindra: [
                { nama: "Prabowo Jr", suara: 12 },
                { nama: "Sandiaga Uno Jr", suara: 8 },
                { nama: "Fadli Zon Jr", suara: 5 },
              ],
              pkb: [
                { nama: "Gus Dur Jr", suara: 10 },
                { nama: "Cak Imin Jr", suara: 7 },
                { nama: "Said Aqil Jr", suara: 4 },
              ],
            },
          },
          {
            nama: "TPS 002",
            totalPemilih: 275,
            hasil: {
              nasdem: 41,
              pdip: 37,
              golkar: 34,
              gerindra: 27,
              pkb: 23,
            },
            calegData: {
              nasdem: [
                { nama: "Dr. Surya Muda", suara: 20 },
                { nama: "Ratna Dewi", suara: 13 },
                { nama: "Agus Santoso", suara: 8 },
              ],
              pdip: [
                { nama: "Hasto Jr", suara: 18 },
                { nama: "Djarot Jr", suara: 12 },
                { nama: "Risma Tri", suara: 7 },
              ],
              golkar: [
                { nama: "Setya Jr", suara: 16 },
                { nama: "Ade Yasin", suara: 11 },
                { nama: "Fadel Jr", suara: 7 },
              ],
              gerindra: [
                { nama: "Edhy Jr", suara: 13 },
                { nama: "Rachmat Jr", suara: 9 },
                { nama: "Andre Jr", suara: 5 },
              ],
              pkb: [
                { nama: "Jazilul Jr", suara: 11 },
                { nama: "Abdul Jr", suara: 8 },
                { nama: "Mahfud Jr", suara: 4 },
              ],
            },
          },
        ],
      };
    }

    return { headers: [], data: [] };
  };

  const statistikWilayahData = getStatistikWilayahData();

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-smooth-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#001B55]">
                Statistik Pemilu
              </h1>
              <p className="text-[#64748b]">
                Data dan analisis hasil pemilu NasDem Sidoarjo
              </p>
              {/* Active Filters Display */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-[#64748b]">Filter:</span>
                <Badge
                  variant="outline"
                  className="bg-white text-[#001B55] border-[#001B55]/20"
                >
                  {
                    filterOptions.tingkatWilayah.find(
                      (t) => t.value === filters.tingkatWilayah
                    )?.label
                  }{" "}
                  - {filters.tahun}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white text-[#FF9C04] border-[#FF9C04]/20"
                >
                  {
                    filterOptions.jenisPemilu.find(
                      (j) => j.value === filters.jenisPemilu
                    )?.label
                  }
                </Badge>
                {filters.wilayahTerpilih !== "all" && (
                  <Badge
                    variant="outline"
                    className="bg-white text-[#10B981] border-[#10B981]/20"
                  >
                    {
                      getAvailableWilayah().find(
                        (w) => w.value === filters.wilayahTerpilih
                      )?.label
                    }
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#001B55]/20 text-white hover:bg-[#001B55]/5"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-2xl">
                  <DialogHeader className="pb-6 border-b border-gray-200/30">
                    <DialogTitle className="text-2xl font-bold text-[#001B55] flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-[#001B55] to-[#001B55]/80 rounded-xl shadow-lg">
                        <Filter className="w-5 h-5 text-white" />
                      </div>
                      Filter Statistik Pemilu
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-6">
                    {/* Tahun */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="tahun"
                        className="text-sm font-semibold text-[#334155] flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-[#FF9C04]" />
                        Tahun Pemilu
                      </Label>
                      <Select
                        value={filters.tahun}
                        onValueChange={(value) =>
                          setFilters({ ...filters, tahun: value })
                        }
                      >
                        <SelectTrigger className="h-12 border-2 border-gray-300 hover:border-[#001B55]/50 focus:border-[#001B55] transition-colors bg-white text-black">
                          <SelectValue
                            placeholder="Pilih Tahun"
                            className="text-[#334155]"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                          {filterOptions.tahun.map((tahun) => (
                            <SelectItem
                              key={tahun}
                              value={tahun}
                              className="hover:bg-[#001B55]/10 focus:bg-[#001B55]/15 text-[#334155] cursor-pointer"
                            >
                              {tahun}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tingkat Wilayah */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="tingkatWilayah"
                        className="text-sm font-semibold text-[#334155] flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-[#10B981]" />
                        Tingkat Wilayah
                      </Label>
                      <Select
                        value={filters.tingkatWilayah}
                        onValueChange={(value) =>
                          setFilters({
                            ...filters,
                            tingkatWilayah: value,
                            wilayahTerpilih: "all",
                            kecamatanTerpilih: "",
                            desaTerpilih: "",
                          })
                        }
                      >
                        <SelectTrigger className="h-12 border-2 border-gray-300 hover:border-[#001B55]/50 focus:border-[#001B55] transition-colors bg-white text-black">
                          <SelectValue
                            placeholder="Pilih Tingkat Wilayah"
                            className="text-[#334155]"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                          {filterOptions.tingkatWilayah.map((tingkat) => (
                            <SelectItem
                              key={tingkat.value}
                              value={tingkat.value}
                              className="hover:bg-[#001B55]/10 focus:bg-[#001B55]/15 text-[#334155] cursor-pointer"
                            >
                              {tingkat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Wilayah Spesifik - Non TPS */}
                    {filters.tingkatWilayah !== "tps" && (
                      <div className="space-y-3">
                        <Label
                          htmlFor="wilayahTerpilih"
                          className="text-sm font-semibold text-[#334155] flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4 text-[#3B82F6]" />
                          {
                            filterOptions.tingkatWilayah.find(
                              (t) => t.value === filters.tingkatWilayah
                            )?.label
                          }{" "}
                          Spesifik
                        </Label>
                        <Select
                          value={filters.wilayahTerpilih}
                          onValueChange={(value) =>
                            setFilters({ ...filters, wilayahTerpilih: value })
                          }
                        >
                          <SelectTrigger className="h-12 border-2 border-gray-300 hover:border-[#001B55]/50 focus:border-[#001B55] transition-colors bg-white text-black">
                            <SelectValue
                              placeholder={`Pilih ${
                                filterOptions.tingkatWilayah.find(
                                  (t) => t.value === filters.tingkatWilayah
                                )?.label
                              }`}
                              className="text-[#334155]"
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-2 border-gray-200 shadow-xl max-h-60">
                            <SelectItem
                              value="all"
                              className="hover:bg-[#001B55]/10 focus:bg-[#001B55]/15 text-[#334155] cursor-pointer font-medium"
                            >
                              Semua{" "}
                              {
                                filterOptions.tingkatWilayah.find(
                                  (t) => t.value === filters.tingkatWilayah
                                )?.label
                              }
                            </SelectItem>
                            {getAvailableWilayah().map((wilayah) => (
                              <SelectItem
                                key={wilayah.value}
                                value={wilayah.value}
                                className="hover:bg-[#001B55]/10 focus:bg-[#001B55]/15 text-[#334155] cursor-pointer"
                              >
                                {wilayah.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Cascading TPS Filters */}
                    {filters.tingkatWilayah === "tps" && (
                      <>
                        {/* Kecamatan Selection for TPS */}
                        <div className="space-y-3">
                          <Label
                            htmlFor="kecamatanTerpilih"
                            className="text-sm font-semibold text-[#334155] flex items-center gap-2"
                          >
                            <MapPin className="w-4 h-4 text-[#3B82F6]" />
                            Kecamatan
                          </Label>
                          <Select
                            value={filters.kecamatanTerpilih}
                            onValueChange={(value) =>
                              setFilters({
                                ...filters,
                                kecamatanTerpilih: value,
                                desaTerpilih: "",
                                wilayahTerpilih: "",
                              })
                            }
                          >
                            <SelectTrigger className="h-12 border-2 border-gray-300 hover:border-[#001B55]/50 focus:border-[#001B55] transition-colors bg-white text-black">
                              <SelectValue
                                placeholder="Pilih Kecamatan"
                                className="text-[#334155]"
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                              {getAvailableKecamatan().map((kecamatan) => (
                                <SelectItem
                                  key={kecamatan.value}
                                  value={kecamatan.value}
                                  className="hover:bg-[#001B55]/10 focus:bg-[#001B55]/15 text-[#334155] cursor-pointer"
                                >
                                  {kecamatan.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Desa Selection for TPS */}
                        {filters.kecamatanTerpilih && (
                          <div className="space-y-3">
                            <Label
                              htmlFor="desaTerpilih"
                              className="text-sm font-semibold text-[#334155] flex items-center gap-2"
                            >
                              <MapPin className="w-4 h-4 text-[#10B981]" />
                              Desa/Kelurahan
                            </Label>
                            <Select
                              value={filters.desaTerpilih}
                              onValueChange={(value) =>
                                setFilters({
                                  ...filters,
                                  desaTerpilih: value,
                                  wilayahTerpilih: "",
                                })
                              }
                            >
                              <SelectTrigger className="h-12 border-2 border-gray-300 hover:border-[#001B55]/50 focus:border-[#001B55] transition-colors bg-white text-black">
                                <SelectValue
                                  placeholder="Pilih Desa/Kelurahan"
                                  className="text-[#334155]"
                                />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                                {getAvailableDesa().map((desa) => (
                                  <SelectItem
                                    key={desa.value}
                                    value={desa.value}
                                    className="hover:bg-[#001B55]/10 focus:bg-[#001B55]/15 text-[#334155] cursor-pointer"
                                  >
                                    {desa.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* TPS Selection */}
                        {filters.desaTerpilih && (
                          <div className="space-y-3">
                            <Label
                              htmlFor="wilayahTerpilih"
                              className="text-sm font-semibold text-[#334155] flex items-center gap-2"
                            >
                              <MapPin className="w-4 h-4 text-[#FF9C04]" />
                              TPS
                            </Label>
                            <Select
                              value={filters.wilayahTerpilih}
                              onValueChange={(value) =>
                                setFilters({
                                  ...filters,
                                  wilayahTerpilih: value,
                                })
                              }
                            >
                              <SelectTrigger className="h-12 border-2 border-gray-300 hover:border-[#001B55]/50 focus:border-[#001B55] transition-colors bg-white">
                                <SelectValue
                                  placeholder="Pilih TPS"
                                  className="text-[#334155]"
                                />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                                <SelectItem
                                  value="all"
                                  className="hover:bg-[#001B55]/10 focus:bg-[#001B55]/15 text-[#334155] cursor-pointer font-medium"
                                >
                                  Semua TPS
                                </SelectItem>
                                {getAvailableTPS().map((tps) => (
                                  <SelectItem
                                    key={tps.value}
                                    value={tps.value}
                                    className="hover:bg-[#001B55]/10 focus:bg-[#001B55]/15 text-[#334155] cursor-pointer"
                                  >
                                    {tps.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </>
                    )}

                    {/* Jenis Pemilu */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="jenisPemilu"
                        className="text-sm font-semibold text-[#334155] flex items-center gap-2"
                      >
                        <Users className="w-4 h-4 text-[#FF9C04]" />
                        Jenis Pemilu
                      </Label>
                      <Select
                        value={filters.jenisPemilu}
                        onValueChange={(value) =>
                          setFilters({ ...filters, jenisPemilu: value })
                        }
                      >
                        <SelectTrigger className="h-12 border-2 border-gray-300 hover:border-[#001B55]/50 focus:border-[#001B55] transition-colors bg-white text-black">
                          <SelectValue
                            placeholder="Pilih Jenis Pemilu"
                            className="text-[#334155]"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
                          {filterOptions.jenisPemilu.map((jenis) => (
                            <SelectItem
                              key={jenis.value}
                              value={jenis.value}
                              className="hover:bg-[#001B55]/10 focus:bg-[#001B55]/15 text-[#334155] cursor-pointer"
                            >
                              {jenis.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200/30">
                      <Button
                        variant="outline"
                        className="flex-1 h-12 border-2 border-gray-300 text-white hover:bg-gray-50 hover:border-gray-400 hover:text-[#334155] transition-all"
                        onClick={() => {
                          setFilters({
                            tahun: "2024",
                            tingkatWilayah: "kecamatan",
                            wilayahTerpilih: "all",
                            jenisPemilu: "partai",
                            kecamatanTerpilih: "",
                            desaTerpilih: "",
                          });
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        <span className="font-medium">Reset</span>
                      </Button>
                      <Button
                        className="flex-1 h-12 bg-gradient-to-r from-[#001B55] to-[#001B55]/90 hover:from-[#001B55]/90 hover:to-[#001B55]/80 text-white shadow-lg hover:shadow-xl transition-all"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        <span className="font-medium">Terapkan Filter</span>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                className="border-[#64748b]/20 text-white hover:bg-gray-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button className="bg-[#FF9C04] hover:bg-[#FF9C04]/90 text-white shadow-lg hover:shadow-xl transition-all">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Podium Juara Partai */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-smooth-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-[#001B55]/5 via-white/50 to-[#FF9C04]/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-smooth shadow-md">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#001B55]">
                Podium Juara{" "}
                {filters.jenisPemilu === "partai" ? "Partai" : "Caleg"}
              </h3>
            </div>
          </div>
          <div className="p-8">
            <div className="flex items-end justify-center gap-4 max-w-4xl mx-auto">
              {/* Posisi 2 - Kiri */}
              <div className="flex flex-col items-center">
                <div className="mb-4 p-4 bg-gradient-to-br from-[#C0C0C0]/20 to-[#C0C0C0]/10 rounded-smooth-xl border-2 border-[#C0C0C0]/30 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[180px]">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8] rounded-full flex items-center justify-center shadow-md">
                      <Medal className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-white rounded-lg shadow-md">
                      <img
                        src={podiumData[1].logo}
                        alt={`Logo ${podiumData[1].nama}`}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <h4 className="font-bold text-[#334155] text-lg mb-1">
                      {podiumData[1].nama}
                    </h4>
                    {filters.jenisPemilu === "caleg" &&
                      "partai" in podiumData[1] && (
                        <p className="text-xs text-[#64748b] mb-1">
                          ({podiumData[1].partai})
                        </p>
                      )}
                    <p className="text-sm text-[#64748b] mb-2">
                      {podiumData[1].suara.toLocaleString()} suara
                    </p>
                    <div
                      className="text-lg font-bold"
                      style={{ color: podiumData[1].color }}
                    >
                      {podiumData[1].persentase}%
                    </div>
                  </div>
                </div>
                {/* Podium base - Posisi 2 */}
                <div className="w-32 h-20 bg-gradient-to-t from-[#C0C0C0] to-[#E5E5E5] rounded-t-lg shadow-lg border-2 border-[#C0C0C0]/50 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
              </div>

              {/* Posisi 1 - Tengah (Tertinggi) */}
              <div className="flex flex-col items-center">
                <div className="mb-4 p-6 bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 rounded-smooth-xl border-2 border-[#FFD700]/30 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px] relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Crown className="w-8 h-8 text-[#FFD700] drop-shadow-lg" />
                  </div>
                  <div className="text-center pt-2">
                    <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-md">
                      <Crown className="w-7 h-7 text-white" />
                    </div>
                    <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center bg-white rounded-lg shadow-md">
                      <img
                        src={podiumData[0].logo}
                        alt={`Logo ${podiumData[0].nama}`}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <h4 className="font-bold text-[#334155] text-xl mb-1">
                      {podiumData[0].nama}
                    </h4>
                    {filters.jenisPemilu === "caleg" &&
                      "partai" in podiumData[0] && (
                        <p className="text-sm text-[#64748b] mb-1">
                          ({podiumData[0].partai})
                        </p>
                      )}
                    <p className="text-sm text-[#64748b] mb-2">
                      {podiumData[0].suara.toLocaleString()} suara
                    </p>
                    <div
                      className="text-xl font-bold"
                      style={{ color: podiumData[0].color }}
                    >
                      {podiumData[0].persentase}%
                    </div>
                  </div>
                </div>
                {/* Podium base - Posisi 1 (Tertinggi) */}
                <div className="w-36 h-28 bg-gradient-to-t from-[#FFD700] to-[#FFF700] rounded-t-lg shadow-lg border-2 border-[#FFD700]/50 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl drop-shadow-md">
                    1
                  </span>
                </div>
              </div>

              {/* Posisi 3 - Kanan */}
              <div className="flex flex-col items-center">
                <div className="mb-4 p-4 bg-gradient-to-br from-[#CD7F32]/20 to-[#CD7F32]/10 rounded-smooth-xl border-2 border-[#CD7F32]/30 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[180px]">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#CD7F32] to-[#A0522D] rounded-full flex items-center justify-center shadow-md">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-white rounded-lg shadow-md">
                      <img
                        src={podiumData[2].logo}
                        alt={`Logo ${podiumData[2].nama}`}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <h4 className="font-bold text-[#334155] text-lg mb-1">
                      {podiumData[2].nama}
                    </h4>
                    {filters.jenisPemilu === "caleg" &&
                      "partai" in podiumData[2] && (
                        <p className="text-xs text-[#64748b] mb-1">
                          ({podiumData[2].partai})
                        </p>
                      )}
                    <p className="text-sm text-[#64748b] mb-2">
                      {podiumData[2].suara.toLocaleString()} suara
                    </p>
                    <div
                      className="text-lg font-bold"
                      style={{ color: podiumData[2].color }}
                    >
                      {podiumData[2].persentase}%
                    </div>
                  </div>
                </div>
                {/* Podium base - Posisi 3 */}
                <div className="w-32 h-16 bg-gradient-to-t from-[#CD7F32] to-[#DAA520] rounded-t-lg shadow-lg border-2 border-[#CD7F32]/50 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
              </div>
            </div>

            {/* Statistik Tambahan */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {podiumData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/60 rounded-lg p-4 border border-gray-200/60"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border">
                        <img
                          src={item.logo}
                          alt={`Logo ${item.nama}`}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[#334155]">
                          {item.nama}
                        </p>
                        <p className="text-sm text-[#64748b]">
                          Posisi {item.position}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="font-bold text-lg"
                        style={{ color: item.color }}
                      >
                        {item.persentase}%
                      </p>
                      <p className="text-sm text-[#64748b]">
                        {item.suara.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Perolehan Suara Keseluruhan */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-smooth-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-[#001B55]/5 via-white/50 to-[#FF9C04]/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#001B55] to-[#001B55]/80 rounded-smooth shadow-md">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#001B55]">
                Perolehan Suara{" "}
                {filters.jenisPemilu === "partai" ? "Partai" : "Caleg"}
              </h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {chartData.map((item, index) => {
                const maxSuara = Math.max(...chartData.map((d) => d.suara));
                const barWidth = (item.suara / maxSuara) * 100;

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: item.color }}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#334155] truncate">
                            {item.nama}
                          </p>
                          <p className="text-sm text-[#64748b]">
                            {item.suara.toLocaleString()} suara
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p
                          className="font-bold text-lg"
                          style={{ color: item.color }}
                        >
                          {item.persentase}%
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                        style={{
                          width: `${barWidth}%`,
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}CC)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#001B55]/5 to-[#FF9C04]/5 rounded-lg border border-gray-200/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-[#001B55]">
                    {chartData
                      .reduce((sum, item) => sum + item.suara, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-[#64748b]">Total Suara</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#FF9C04]">
                    {chartData.length}
                  </p>
                  <p className="text-sm text-[#64748b]">Peserta</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#10B981]">
                    {chartData[0]?.persentase || 0}%
                  </p>
                  <p className="text-sm text-[#64748b]">Tertinggi</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#64748b]">
                    {
                      filterOptions.tingkatWilayah.find(
                        (t) => t.value === filters.tingkatWilayah
                      )?.label
                    }
                  </p>
                  <p className="text-sm text-[#64748b]">Tingkat Data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards - Data Pemilih */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="DPT"
            value={dataPemilih.dpt.toLocaleString()}
            icon={Users}
            description="Daftar Pemilih Tetap"
            color="#001B55"
            className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
          />
          <KPICard
            title="DPTb"
            value={dataPemilih.dptb.toLocaleString()}
            icon={Users}
            description="Daftar Pemilih Tetap Tambahan"
            color="#FF9C04"
            className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
          />
          <KPICard
            title="DPK"
            value={dataPemilih.dpk.toLocaleString()}
            icon={Users}
            description="Daftar Pemilih Khusus"
            color="#10B981"
            className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
          />
          <KPICard
            title="Total Pengguna Hak Pilih"
            value={dataPemilih.totalPenggunaHakPilih.toLocaleString()}
            change={{
              value: `${(
                (dataPemilih.totalPenggunaHakPilih /
                  statistikData.totalPemilih) *
                100
              ).toFixed(1)}%`,
              type: "increase",
              period: "dari total pemilih",
            }}
            icon={TrendingUp}
            description="Jumlah total DPT + DPTb + DPK"
            color="#3B82F6"
            className="hover:scale-[1.02] border-2 border-gray-300/80 hover:border-gray-400/90 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>

        {/* Tabel Statistik per Wilayah - Layout Vertikal */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-smooth-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-[#001B55]/5 via-white/50 to-[#FF9C04]/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#001B55] to-[#001B55]/80 rounded-smooth shadow-md">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#001B55]">
                Statistik per{" "}
                {filters.tingkatWilayah === "dapil"
                  ? "Kecamatan"
                  : filters.tingkatWilayah === "kecamatan"
                  ? "Desa/Kelurahan"
                  : "TPS"}
              </h3>
              <Badge
                variant="outline"
                className="bg-white text-[#FF9C04] border-[#FF9C04]/20 ml-auto"
              >
                {filters.jenisPemilu === "partai"
                  ? "Data Partai"
                  : "Data Caleg"}
              </Badge>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    {/* Header Partai - Sticky Left */}
                    <th className="text-left py-4 px-4 font-semibold text-[#334155] min-w-[160px] sticky left-0 bg-white z-20 border-r-2 border-gray-200">
                      Partai
                    </th>
                    {/* Header Wilayah */}
                    {statistikWilayahData.data.map((area, index) => (
                      <th
                        key={index}
                        className="text-center py-4 px-4 font-semibold text-[#334155] min-w-[120px]"
                      >
                        {area.nama}
                      </th>
                    ))}
                    {/* Header Total */}
                    <th className="text-center py-4 px-4 font-semibold text-[#334155] min-w-[120px]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* NasDem Row */}
                  <tr className="border-b border-gray-100 hover:bg-[#001B55]/5 transition-colors">
                    <td className="sticky left-0 bg-white z-10 py-4 px-4 font-semibold text-[#001B55] border-r-2 border-gray-200">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const currentExpanded =
                              expandedRows.includes("nasdem");
                            if (currentExpanded) {
                              setExpandedRows(
                                expandedRows.filter((id) => id !== "nasdem")
                              );
                            } else {
                              setExpandedRows([...expandedRows, "nasdem"]);
                            }
                          }}
                          className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                          {expandedRows.includes("nasdem") ? (
                            <Minus className="w-3 h-3 text-[#001B55]" />
                          ) : (
                            <Plus className="w-3 h-3 text-[#001B55]" />
                          )}
                        </button>
                        <div className="w-3 h-3 bg-[#001B55] rounded-full"></div>
                        NasDem
                      </div>
                    </td>
                    {statistikWilayahData.data.map((area, index) => (
                      <td key={index} className="py-4 px-4 text-center">
                        <span className="font-bold text-[#001B55] block">
                          {area.hasil.nasdem.toLocaleString()}
                        </span>
                      </td>
                    ))}
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-[#001B55]">
                        {statistikWilayahData.data
                          .reduce((sum, area) => sum + area.hasil.nasdem, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                  </tr>

                  {/* NasDem Detail Rows */}
                  {expandedRows.includes("nasdem") && (
                    <tr className="bg-[#001B55]/5">
                      <td className="sticky left-0 bg-[#001B55]/5 z-10 py-2 px-4 text-sm text-[#001B55] border-r-2 border-gray-200">
                        <div className="pl-7">Detail Caleg</div>
                      </td>
                      <td
                        colSpan={statistikWilayahData.data.length + 1}
                        className="py-4 px-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {statistikWilayahData.data.map((area, areaIndex) => (
                            <div
                              key={areaIndex}
                              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                            >
                              <h5 className="font-semibold text-[#001B55] mb-3 text-center border-b border-gray-200 pb-2">
                                {area.nama}
                              </h5>
                              <div className="space-y-2">
                                {area.calegData?.nasdem?.map(
                                  (caleg, calegIndex) => (
                                    <div
                                      key={calegIndex}
                                      className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-[#001B55] text-white text-xs rounded-full flex items-center justify-center">
                                          {calegIndex + 1}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">
                                          {caleg.nama}
                                        </span>
                                      </div>
                                      <span className="font-bold text-[#001B55] text-sm">
                                        {caleg.suara.toLocaleString()}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-semibold text-[#001B55]">
                                <span>Total:</span>
                                <span>
                                  {area.hasil.nasdem.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* PDI-P Row */}
                  <tr className="border-b border-gray-100 hover:bg-[#DC2626]/5 transition-colors">
                    <td className="sticky left-0 bg-white z-10 py-4 px-4 font-semibold text-[#DC2626] border-r-2 border-gray-200">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const currentExpanded =
                              expandedRows.includes("pdip");
                            if (currentExpanded) {
                              setExpandedRows(
                                expandedRows.filter((id) => id !== "pdip")
                              );
                            } else {
                              setExpandedRows([...expandedRows, "pdip"]);
                            }
                          }}
                          className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                          {expandedRows.includes("pdip") ? (
                            <Minus className="w-3 h-3 text-[#DC2626]" />
                          ) : (
                            <Plus className="w-3 h-3 text-[#DC2626]" />
                          )}
                        </button>
                        <div className="w-3 h-3 bg-[#DC2626] rounded-full"></div>
                        PDI-P
                      </div>
                    </td>
                    {statistikWilayahData.data.map((area, index) => (
                      <td key={index} className="py-4 px-4 text-center">
                        <span className="font-bold text-[#DC2626] block">
                          {area.hasil.pdip.toLocaleString()}
                        </span>
                      </td>
                    ))}
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-[#DC2626]">
                        {statistikWilayahData.data
                          .reduce((sum, area) => sum + area.hasil.pdip, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                  </tr>

                  {/* PDI-P Detail Rows */}
                  {expandedRows.includes("pdip") && (
                    <tr className="bg-[#DC2626]/5">
                      <td className="sticky left-0 bg-[#DC2626]/5 z-10 py-2 px-4 text-sm text-[#DC2626] border-r-2 border-gray-200">
                        <div className="pl-7">Detail Caleg</div>
                      </td>
                      <td
                        colSpan={statistikWilayahData.data.length + 1}
                        className="py-4 px-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {statistikWilayahData.data.map((area, areaIndex) => (
                            <div
                              key={areaIndex}
                              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                            >
                              <h5 className="font-semibold text-[#DC2626] mb-3 text-center border-b border-gray-200 pb-2">
                                {area.nama}
                              </h5>
                              <div className="space-y-2">
                                {area.calegData?.pdip?.map(
                                  (caleg, calegIndex) => (
                                    <div
                                      key={calegIndex}
                                      className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-[#DC2626] text-white text-xs rounded-full flex items-center justify-center">
                                          {calegIndex + 1}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">
                                          {caleg.nama}
                                        </span>
                                      </div>
                                      <span className="font-bold text-[#DC2626] text-sm">
                                        {caleg.suara.toLocaleString()}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-semibold text-[#DC2626]">
                                <span>Total:</span>
                                <span>{area.hasil.pdip.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Golkar Row */}
                  <tr className="border-b border-gray-100 hover:bg-[#EAB308]/5 transition-colors">
                    <td className="sticky left-0 bg-white z-10 py-4 px-4 font-semibold text-[#EAB308] border-r-2 border-gray-200">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const currentExpanded =
                              expandedRows.includes("golkar");
                            if (currentExpanded) {
                              setExpandedRows(
                                expandedRows.filter((id) => id !== "golkar")
                              );
                            } else {
                              setExpandedRows([...expandedRows, "golkar"]);
                            }
                          }}
                          className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                          {expandedRows.includes("golkar") ? (
                            <Minus className="w-3 h-3 text-[#EAB308]" />
                          ) : (
                            <Plus className="w-3 h-3 text-[#EAB308]" />
                          )}
                        </button>
                        <div className="w-3 h-3 bg-[#EAB308] rounded-full"></div>
                        Golkar
                      </div>
                    </td>
                    {statistikWilayahData.data.map((area, index) => (
                      <td key={index} className="py-4 px-4 text-center">
                        <span className="font-bold text-[#EAB308] block">
                          {area.hasil.golkar.toLocaleString()}
                        </span>
                      </td>
                    ))}
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-[#EAB308]">
                        {statistikWilayahData.data
                          .reduce((sum, area) => sum + area.hasil.golkar, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                  </tr>

                  {/* Golkar Detail Rows */}
                  {expandedRows.includes("golkar") && (
                    <tr className="bg-[#EAB308]/5">
                      <td className="sticky left-0 bg-[#EAB308]/5 z-10 py-2 px-4 text-sm text-[#EAB308] border-r-2 border-gray-200">
                        <div className="pl-7">Detail Caleg</div>
                      </td>
                      <td
                        colSpan={statistikWilayahData.data.length + 1}
                        className="py-4 px-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {statistikWilayahData.data.map((area, areaIndex) => (
                            <div
                              key={areaIndex}
                              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                            >
                              <h5 className="font-semibold text-[#EAB308] mb-3 text-center border-b border-gray-200 pb-2">
                                {area.nama}
                              </h5>
                              <div className="space-y-2">
                                {area.calegData?.golkar?.map(
                                  (caleg, calegIndex) => (
                                    <div
                                      key={calegIndex}
                                      className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-[#EAB308] text-white text-xs rounded-full flex items-center justify-center">
                                          {calegIndex + 1}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">
                                          {caleg.nama}
                                        </span>
                                      </div>
                                      <span className="font-bold text-[#EAB308] text-sm">
                                        {caleg.suara.toLocaleString()}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-semibold text-[#EAB308]">
                                <span>Total:</span>
                                <span>
                                  {area.hasil.golkar.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Gerindra Row */}
                  <tr className="border-b border-gray-100 hover:bg-[#8B4513]/5 transition-colors">
                    <td className="sticky left-0 bg-white z-10 py-4 px-4 font-semibold text-[#8B4513] border-r-2 border-gray-200">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const currentExpanded =
                              expandedRows.includes("gerindra");
                            if (currentExpanded) {
                              setExpandedRows(
                                expandedRows.filter((id) => id !== "gerindra")
                              );
                            } else {
                              setExpandedRows([...expandedRows, "gerindra"]);
                            }
                          }}
                          className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                          {expandedRows.includes("gerindra") ? (
                            <Minus className="w-3 h-3 text-[#8B4513]" />
                          ) : (
                            <Plus className="w-3 h-3 text-[#8B4513]" />
                          )}
                        </button>
                        <div className="w-3 h-3 bg-[#8B4513] rounded-full"></div>
                        Gerindra
                      </div>
                    </td>
                    {statistikWilayahData.data.map((area, index) => (
                      <td key={index} className="py-4 px-4 text-center">
                        <span className="font-bold text-[#8B4513] block">
                          {area.hasil.gerindra.toLocaleString()}
                        </span>
                      </td>
                    ))}
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-[#8B4513]">
                        {statistikWilayahData.data
                          .reduce((sum, area) => sum + area.hasil.gerindra, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                  </tr>

                  {/* Gerindra Detail Rows */}
                  {expandedRows.includes("gerindra") && (
                    <tr className="bg-[#8B4513]/5">
                      <td className="sticky left-0 bg-[#8B4513]/5 z-10 py-2 px-4 text-sm text-[#8B4513] border-r-2 border-gray-200">
                        <div className="pl-7">Detail Caleg</div>
                      </td>
                      <td
                        colSpan={statistikWilayahData.data.length + 1}
                        className="py-4 px-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {statistikWilayahData.data.map((area, areaIndex) => (
                            <div
                              key={areaIndex}
                              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                            >
                              <h5 className="font-semibold text-[#8B4513] mb-3 text-center border-b border-gray-200 pb-2">
                                {area.nama}
                              </h5>
                              <div className="space-y-2">
                                {area.calegData?.gerindra?.map(
                                  (caleg, calegIndex) => (
                                    <div
                                      key={calegIndex}
                                      className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-[#8B4513] text-white text-xs rounded-full flex items-center justify-center">
                                          {calegIndex + 1}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">
                                          {caleg.nama}
                                        </span>
                                      </div>
                                      <span className="font-bold text-[#8B4513] text-sm">
                                        {caleg.suara.toLocaleString()}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-semibold text-[#8B4513]">
                                <span>Total:</span>
                                <span>
                                  {area.hasil.gerindra.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* PKB Row */}
                  <tr className="border-b border-gray-100 hover:bg-[#10B981]/5 transition-colors">
                    <td className="sticky left-0 bg-white z-10 py-4 px-4 font-semibold text-[#10B981] border-r-2 border-gray-200">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const currentExpanded =
                              expandedRows.includes("pkb");
                            if (currentExpanded) {
                              setExpandedRows(
                                expandedRows.filter((id) => id !== "pkb")
                              );
                            } else {
                              setExpandedRows([...expandedRows, "pkb"]);
                            }
                          }}
                          className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                          {expandedRows.includes("pkb") ? (
                            <Minus className="w-3 h-3 text-[#10B981]" />
                          ) : (
                            <Plus className="w-3 h-3 text-[#10B981]" />
                          )}
                        </button>
                        <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                        PKB
                      </div>
                    </td>
                    {statistikWilayahData.data.map((area, index) => (
                      <td key={index} className="py-4 px-4 text-center">
                        <span className="font-bold text-[#10B981] block">
                          {area.hasil.pkb.toLocaleString()}
                        </span>
                      </td>
                    ))}
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-[#10B981]">
                        {statistikWilayahData.data
                          .reduce((sum, area) => sum + area.hasil.pkb, 0)
                          .toLocaleString()}
                      </span>
                    </td>
                  </tr>

                  {/* PKB Detail Rows */}
                  {expandedRows.includes("pkb") && (
                    <tr className="bg-[#10B981]/5">
                      <td className="sticky left-0 bg-[#10B981]/5 z-10 py-2 px-4 text-sm text-[#10B981] border-r-2 border-gray-200">
                        <div className="pl-7">Detail Caleg</div>
                      </td>
                      <td
                        colSpan={statistikWilayahData.data.length + 1}
                        className="py-4 px-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {statistikWilayahData.data.map((area, areaIndex) => (
                            <div
                              key={areaIndex}
                              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                            >
                              <h5 className="font-semibold text-[#10B981] mb-3 text-center border-b border-gray-200 pb-2">
                                {area.nama}
                              </h5>
                              <div className="space-y-2">
                                {area.calegData?.pkb?.map(
                                  (caleg, calegIndex) => (
                                    <div
                                      key={calegIndex}
                                      className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-[#10B981] text-white text-xs rounded-full flex items-center justify-center">
                                          {calegIndex + 1}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">
                                          {caleg.nama}
                                        </span>
                                      </div>
                                      <span className="font-bold text-[#10B981] text-sm">
                                        {caleg.suara.toLocaleString()}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-semibold text-[#10B981]">
                                <span>Total:</span>
                                <span>{area.hasil.pkb.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Total Row */}
                  <tr className="border-t-2 border-gray-300 bg-gray-100/50 font-semibold">
                    <td className="sticky left-0 bg-gray-100/50 z-10 py-4 px-4 text-[#334155] border-r-2 border-gray-200">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Total Pemilih
                      </div>
                    </td>
                    {statistikWilayahData.data.map((area, index) => (
                      <td
                        key={index}
                        className="py-4 px-4 text-center text-[#334155]"
                      >
                        {area.totalPemilih.toLocaleString()}
                      </td>
                    ))}
                    <td className="py-4 px-4 text-center text-[#334155]">
                      {statistikWilayahData.data
                        .reduce((sum, area) => sum + area.totalPemilih, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#001B55]/5 to-[#FF9C04]/5 rounded-lg border border-gray-200/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-[#001B55]">
                    {statistikWilayahData.data
                      .reduce((sum, row) => sum + row.totalPemilih, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-[#64748b]">Total Pemilih</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#FF9C04]">
                    {statistikWilayahData.data
                      .reduce((sum, row) => sum + row.hasil.nasdem, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-[#64748b]">Total Suara NasDem</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#10B981]">
                    {(
                      (statistikWilayahData.data.reduce(
                        (sum, row) => sum + row.hasil.nasdem,
                        0
                      ) /
                        statistikWilayahData.data.reduce(
                          (sum, row) => sum + row.totalPemilih,
                          0
                        )) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                  <p className="text-sm text-[#64748b]">Persentase NasDem</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#64748b]">
                    {statistikWilayahData.data.length}
                  </p>
                  <p className="text-sm text-[#64748b]">
                    Total{" "}
                    {filters.tingkatWilayah === "dapil"
                      ? "Kecamatan"
                      : filters.tingkatWilayah === "kecamatan"
                      ? "Desa"
                      : "TPS"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default StatistikPemiluPage;
