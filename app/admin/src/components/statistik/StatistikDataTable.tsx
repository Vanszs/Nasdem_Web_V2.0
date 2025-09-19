"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Search, Download, Eye, Filter } from "lucide-react";
import Image from "next/image";

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

interface StatistikDataTableProps {
  data: TableData[];
  onTPSClick: (tps: TPSDetail) => void;
  loading: boolean;
}

export function StatistikDataTable({ data, onTPSClick, loading }: StatistikDataTableProps) {
  const [sortField, setSortField] = useState<keyof TableData>("suara");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPartai, setFilterPartai] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("");
  const itemsPerPage = 15;

  const handleSort = (field: keyof TableData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesPartai = !filterPartai || item.partai === filterPartai;
    const matchesKecamatan = !filterKecamatan || item.kecamatan === filterKecamatan;
    
    return matchesSearch && matchesPartai && matchesKecamatan;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * modifier;
    }
    const aStr = aVal?.toString() || "";
    const bStr = bVal?.toString() || "";
    return aStr.localeCompare(bStr) * modifier;
  });

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const uniquePartai = Array.from(new Set(data.map(item => item.partai)));
  const uniqueKecamatan = Array.from(new Set(data.map(item => item.kecamatan)));

  const SortIcon = ({ field }: { field: keyof TableData }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Data Hasil Pemilu</h3>
        </div>
        <div className="p-8">
          <div className="animate-pulse space-y-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Data Hasil Pemilu</h3>
          <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 h-10">
            <Download className="w-4 h-4 mr-2" />
            Ekspor Data
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          
          <select
            value={filterPartai}
            onChange={(e) => setFilterPartai(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium h-10"
          >
            <option value="">Semua Partai</option>
            {uniquePartai.map((partai) => (
              <option key={partai} value={partai}>{partai}</option>
            ))}
          </select>

          <select
            value={filterKecamatan}
            onChange={(e) => setFilterKecamatan(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium h-10"
          >
            <option value="">Semua Kecamatan</option>
            {uniqueKecamatan.map((kecamatan) => (
              <option key={kecamatan} value={kecamatan}>{kecamatan}</option>
            ))}
          </select>

          <div className="flex items-center text-sm text-gray-600 font-medium bg-gray-50 px-4 py-2.5 rounded-lg">
            <Filter className="w-4 h-4 mr-2" />
            {filteredData.length} dari {data.length} data
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {[
                { key: "dapil", label: "Dapil" },
                { key: "kecamatan", label: "Kecamatan" },
                { key: "kelurahan", label: "Kel/Desa" },
                { key: "tps", label: "TPS" },
                { key: "partai", label: "Partai" },
                { key: "caleg", label: "Caleg" },
                { key: "suara", label: "Suara" },
                { key: "persentase", label: "%" },
                { key: "updatedAt", label: "Update" },
                { key: "bukti", label: "Bukti" },
              ].map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort(column.key as keyof TableData)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    <SortIcon field={column.key as keyof TableData} />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((row, index) => (
              <tr
                key={`${row.tps}-${row.caleg}-${index}`}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.dapil}</td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{row.kecamatan}</td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">{row.kelurahan}</td>
                <td className="px-6 py-4 text-sm font-bold text-blue-600">{row.tps}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    {row.logo ? (
                      <div className="w-8 h-8 relative rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={row.logo}
                          alt={`Logo ${row.partai}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: row.partaiColor || "#gray" }}
                      >
                        {row.partai.substring(0, 1)}
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs font-medium">
                      {row.partai}
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row.caleg}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.suara.toLocaleString("id-ID")}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.persentase.toFixed(1)}%</td>
                <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                  {new Date(row.updatedAt).toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 text-sm">
                  {row.bukti ? (
                    <Badge className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold">
                      Tersedia
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 font-semibold">
                      Belum
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      onTPSClick({
                        id: row.tps,
                        name: `TPS ${row.tps}`,
                        dapil: row.dapil,
                        kecamatan: row.kecamatan,
                        kelurahan: row.kelurahan,
                        suaraSah: row.suara,
                        suaraTidakSah: Math.floor(row.suara * 0.02),
                        partisipasi: 75.5,
                        updatedAt: row.updatedAt,
                        petugas: "Ahmad Susanto",
                        bukti: row.bukti ? ["foto1.jpg", "foto2.jpg"] : [],
                        detailSuara: [{ caleg: row.caleg, partai: row.partai, suara: row.suara }],
                      })
                    }
                    className="text-blue-600 hover:bg-blue-50 h-9 w-9 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600 font-medium">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} dari {sortedData.length} data
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="h-9"
            >
              Sebelumnya
            </Button>
            <span className="text-sm text-gray-600 px-4 py-2 bg-gray-50 rounded-lg font-semibold">
              {currentPage} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="h-9"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}