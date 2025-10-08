"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronDown as ChevronDownLg,
  Search,
  Download,
} from "lucide-react";
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
  logo?: string;
  partaiColor?: string;
}

interface StatistikDataTableProps {
  data: TableData[];
  loading: boolean;
}

type SortDir = "asc" | "desc";
type PivotLevel = "dapil" | "kecamatan" | "desa" | "tps";

interface GroupRow {
  _rowType: "group";
  _groupKey: string;
  partai: string;
  logo?: string;
  partaiColor?: string;
  total: number;
  percent: number;
  columns: Record<string, number>;
  calegCount: number;
}

interface CalegRow {
  _rowType: "caleg";
  _groupKey: string;
  partai: string;
  caleg: string;
  columns: Record<string, number>;
  total: number;
  percent: number;
  partaiColor?: string;
}

type FlatRow = GroupRow | CalegRow;

export function StatistikDataTable({ data, loading }: StatistikDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [sortField, setSortField] = useState<string>("_total"); // _total or dynamic column key
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  // Determine pivot level from data structure
  const pivotLevel: PivotLevel = useMemo(() => {
    if (!data || data.length === 0) return "dapil";
    
    const uniqueDapil = new Set(data.map(d => d.dapil));
    const uniqueKecamatan = new Set(data.map(d => d.kecamatan));
    const uniqueDesa = new Set(data.map(d => d.kelurahan));
    
    // If multiple dapils, pivot by dapil
    if (uniqueDapil.size > 1) return "dapil";
    // If single dapil, multiple kecamatan, pivot by kecamatan
    if (uniqueKecamatan.size > 1) return "kecamatan";
    // If single kecamatan, multiple desa, pivot by desa
    if (uniqueDesa.size > 1) return "desa";
    // Otherwise pivot by TPS
    return "tps";
  }, [data]);

  // Filter raw data by search term only (geographic filters handled by parent)
  const filteredRaw = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return data;
    
    return data.filter((row) => {
      return [
        row.partai,
        row.caleg,
        row.dapil,
        row.kecamatan,
        row.kelurahan,
        row.tps,
      ].some((v) => v.toLowerCase().includes(term));
    });
  }, [data, searchTerm]);

  // Column keys (dinamis)
  const columnKeys = useMemo(() => {
    const set = new Set<string>();
    filteredRaw.forEach((r) => {
      switch (pivotLevel) {
        case "dapil":
          set.add(r.dapil);
          break;
        case "kecamatan":
          set.add(r.kecamatan);
          break;
        case "desa":
          set.add(r.kelurahan);
          break;
        case "tps":
          set.add(r.tps);
          break;
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "id"));
  }, [filteredRaw, pivotLevel]);

  // Helper ambil key utk row
  const getRowKey = (r: TableData) => {
    switch (pivotLevel) {
      case "dapil":
        return r.dapil;
      case "kecamatan":
        return r.kecamatan;
      case "desa":
        return r.kelurahan;
      case "tps":
        return r.tps;
    }
  };

  // Group by partai lalu agregasi per kolom pivot
  const grouped = useMemo(() => {
    interface TmpGroup {
      partai: string;
      logo?: string;
      partaiColor?: string;
      columns: Record<string, number>;
      calegMap: Map<
        string,
        { caleg: string; columns: Record<string, number>; total: number }
      >;
      total: number;
    }

    const map = new Map<string, TmpGroup>();

    filteredRaw.forEach((row) => {
      const key = row.partai;
      if (!map.has(key)) {
        map.set(key, {
          partai: row.partai,
          logo: row.logo,
          partaiColor: row.partaiColor,
          columns: {},
          calegMap: new Map(),
          total: 0,
        });
      }
      const g = map.get(key)!;
      const colKey = getRowKey(row);
      g.columns[colKey] = (g.columns[colKey] || 0) + row.suara;
      g.total += row.suara;

      // candidate
      if (!g.calegMap.has(row.caleg)) {
        g.calegMap.set(row.caleg, {
          caleg: row.caleg,
          columns: {},
          total: 0,
        });
      }
      const c = g.calegMap.get(row.caleg)!;
      c.columns[colKey] = (c.columns[colKey] || 0) + row.suara;
      c.total += row.suara;
    });

    // Hitung grand total
    const grandTotal = Array.from(map.values()).reduce(
      (acc, g) => acc + g.total,
      0
    );

    // Build group rows
    const groupRows: GroupRow[] = Array.from(map.values()).map((g) => ({
      _rowType: "group",
      _groupKey: g.partai,
      partai: g.partai,
      logo: g.logo,
      partaiColor: g.partaiColor,
      total: g.total,
      percent: grandTotal ? (g.total / grandTotal) * 100 : 0,
      columns: columnKeys.reduce((acc, ck) => {
        acc[ck] = g.columns[ck] || 0;
        return acc;
      }, {} as Record<string, number>),
      calegCount: g.calegMap.size,
    }));

    // Sort partai by total desc
    groupRows.sort((a, b) => b.total - a.total);

    // Candidate rows map
    const calegRowsMap: Record<string, CalegRow[]> = {};
    groupRows.forEach((gr) => {
      const orig = map.get(gr.partai)!;
      const arr: CalegRow[] = Array.from(orig.calegMap.values()).map((c) => ({
        _rowType: "caleg",
        _groupKey: gr.partai,
        partai: gr.partai,
        caleg: c.caleg,
        columns: columnKeys.reduce((acc, ck) => {
          acc[ck] = c.columns[ck] || 0;
          return acc;
        }, {} as Record<string, number>),
        total: c.total,
        percent: gr.total ? (c.total / gr.total) * 100 : 0,
        partaiColor: gr.partaiColor,
      }));
      // default sort caleg desc total
      arr.sort((a, b) => b.total - a.total);
      calegRowsMap[gr.partai] = arr;
    });

    return { groupRows, calegRowsMap };
  }, [filteredRaw, columnKeys, pivotLevel]);

  // Sorting (by total or by specific column)
  const sortedGroups = useMemo(() => {
    if (sortField === "_total") {
      const base = [...grouped.groupRows];
      base.sort((a, b) =>
        sortDir === "asc" ? a.total - b.total : b.total - a.total
      );
      return base;
    }
    if (sortField.startsWith("col:")) {
      const key = sortField.replace("col:", "");
      const base = [...grouped.groupRows];
      base.sort((a, b) => {
        const av = a.columns[key] || 0;
        const bv = b.columns[key] || 0;
        return sortDir === "asc" ? av - bv : bv - av;
      });
      return base;
    }
    return grouped.groupRows;
  }, [grouped.groupRows, sortField, sortDir]);

  // Flatten rows with expanded
  const flatRows: FlatRow[] = useMemo(() => {
    const rows: FlatRow[] = [];
    sortedGroups.forEach((g) => {
      rows.push(g);
      if (expanded.has(g._groupKey)) {
        let calegs = grouped.calegRowsMap[g._groupKey];
        // Apply candidate sorting if column sort active (not group reorder; align with same column)
        if (sortField.startsWith("col:")) {
          const key = sortField.replace("col:", "");
          calegs = [...calegs].sort((a, b) => {
            const av = a.columns[key] || 0;
            const bv = b.columns[key] || 0;
            return sortDir === "asc" ? av - bv : bv - av;
          });
        } else if (sortField === "_total") {
          calegs = [...calegs].sort((a, b) =>
            sortDir === "asc" ? a.total - b.total : b.total - a.total
          );
        }
        rows.push(...calegs);
      }
    });
    return rows;
  }, [sortedGroups, expanded, grouped.calegRowsMap, sortField, sortDir]);

  // Pagination
  const itemsPerPage = 30;
  const paginated = useMemo(
    () => flatRows.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [flatRows, page]
  );
  const totalPages = Math.max(1, Math.ceil(flatRows.length / itemsPerPage));

  // Options for selects
  const toggleExpand = (k: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  };

  const handleSortTotal = () => {
    if (sortField === "_total") {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField("_total");
      setSortDir("desc");
    }
  };
  const handleSortColumn = (key: string) => {
    const fieldKey = "col:" + key;
    if (sortField === fieldKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(fieldKey);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ active }: { active: boolean }) => {
    if (!active) return <ChevronUp className="w-3.5 h-3.5 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
    ) : (
      <ChevronDown className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-[#F3F4F6] rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  const levelLabel: Record<PivotLevel, string> = {
    dapil: "Dapil",
    kecamatan: "Kecamatan",
    desa: "Desa",
    tps: "TPS",
  };

  return (
    <div className="bg-white overflow-hidden" style={{ borderRadius: "16px", border: "1px solid #E8F9FF" }}>
      {/* Modern Flat Header */}
      <div className="bg-[#E8F9FF]/50 border-b border-[#C4D9FF]">
        {/* Title Row */}
        <div className="px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#001B55] rounded-full"></div>
            <h3 className="text-lg font-bold text-[#001B55]">
              Data Hasil Pemilu (Pivot {levelLabel[pivotLevel]})
            </h3>
          </div>
          <Button
            size="sm"
            className="bg-[#001B55] hover:bg-[#C5BAFF] hover:text-[#001B55] text-white transition-all duration-300 h-9 px-4 rounded-lg shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Ekspor Data
          </Button>
        </div>

        {/* Search Row */}
        <div className="px-6 pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#001B55]/60" />
            <Input
              placeholder="Cari partai / caleg / wilayah..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 h-10 text-[#001B55] bg-white border border-[#C4D9FF] focus:border-[#C5BAFF] focus:ring-2 focus:ring-[#C5BAFF]/20 rounded-lg transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
            />
          </div>
        </div>
      </div>

      {/* Table Pivot */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-[#E8F9FF] border-b border-[#C4D9FF]">
              <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-[#001B55] w-72">
                Partai / Caleg
              </th>
              {columnKeys.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSortColumn(col)}
                  className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-[#001B55] cursor-pointer hover:bg-[#C4D9FF] transition-colors duration-200 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    {pivotLevel === "dapil" && col.startsWith("Dapil")
                      ? col
                      : col}
                    <SortIcon active={sortField === "col:" + col} />
                  </div>
                </th>
              ))}
              <th
                onClick={handleSortTotal}
                className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-[#001B55] cursor-pointer hover:bg-[#C4D9FF] transition-colors duration-200 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  Total
                  <SortIcon active={sortField === "_total"} />
                </div>
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-[#001B55] whitespace-nowrap">
                %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8F9FF]/50">
            {paginated.map((row, idx) => {
              if (row._rowType === "group") {
                const g = row as GroupRow;
                const isOpen = expanded.has(g._groupKey);
                return (
                  <tr
                    key={`g-${g._groupKey}-${idx}`}
                    className="bg-white hover:bg-[#F0F6FF] transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleExpand(g._groupKey)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border border-[#C4D9FF] bg-white hover:bg-[#E8F9FF] transition-all duration-200 shadow-sm"
                          aria-label={isOpen ? "Collapse" : "Expand"}
                        >
                          {isOpen ? (
                            <ChevronDownLg className="w-4 h-4 text-[#001B55]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-[#001B55]" />
                          )}
                        </button>
                        {g.logo ? (
                          <div className="w-9 h-9 relative rounded-lg overflow-hidden border border-[#E8F9FF] bg-white shadow-sm">
                            <Image
                              src={g.logo}
                              alt={g.partai}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-sm"
                            style={{
                              backgroundColor: g.partaiColor || "#6B7280",
                            }}
                          >
                            {g.partai.substring(0, 1)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: g.partaiColor || "#001B55" }}
                          >
                            {g.partai}
                          </span>
                          <span className="text-xs text-[#475569] font-medium">
                            {g.calegCount} caleg
                          </span>
                        </div>
                      </div>
                    </td>
                    {columnKeys.map((col) => (
                      <td
                        key={col}
                        className="px-4 py-4 text-sm font-semibold text-[#111827]"
                      >
                        {g.columns[col]?.toLocaleString("id-ID") || 0}
                      </td>
                    ))}
                    <td className="px-5 py-4 text-sm font-bold text-[#111827]">
                      {g.total.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#111827]">
                      {g.percent.toFixed(1)}%
                    </td>
                  </tr>
                );
              }

              const c = row as CalegRow;
              return (
                <tr
                  key={`c-${c._groupKey}-${c.caleg}-${idx}`}
                  className="hover:bg-[#F0F6FF] transition-all duration-200 bg-[#E8F9FF]/20"
                >
                  <td className="pl-16 pr-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#001B55]">
                        {c.caleg}
                      </span>
                      <span className="text-xs text-[#475569]">{c.partai}</span>
                    </div>
                  </td>
                  {columnKeys.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-3 text-sm font-medium text-[#001B55]"
                    >
                      {c.columns[col]?.toLocaleString("id-ID") || 0}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-sm font-semibold text-[#001B55]">
                    {c.total.toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-[#001B55]">
                    {c.percent.toFixed(1)}%
                  </td>
                </tr>
              );
            })}

            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={columnKeys.length + 4}
                  className="px-6 py-16 text-center text-sm text-[#475569]"
                >
                  Tidak ada data untuk kombinasi filter saat ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-[#E8F9FF] flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#E8F9FF]/30">
          <div className="text-sm text-[#001B55] font-medium">
            Menampilkan {(page - 1) * itemsPerPage + 1} -{" "}
            {Math.min(page * itemsPerPage, flatRows.length)} dari{" "}
            {flatRows.length} baris
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-9 border-[#C4D9FF] text-[#001B55] hover:bg-[#E8F9FF] disabled:opacity-40 transition-all duration-200"
            >
              Sebelumnya
            </Button>
            <span className="text-sm text-[#001B55] px-4 py-2 bg-[#E8F9FF] rounded-lg font-semibold shadow-sm">
              {page} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 border-[#C4D9FF] text-[#001B55] hover:bg-[#E8F9FF] disabled:opacity-40 transition-all duration-200"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
