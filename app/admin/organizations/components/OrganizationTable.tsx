"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import { ImageIcon, Users, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { OrganizationActions } from "./OrganizationActions";
import { useDebounce } from "@/hooks/use-debounce";
import { SimplePagination } from "@/components/ui/pagination";

export type StrukturItem = {
  id: number;
  level: string;
  position: string;
  photoUrl?: string | null;
  region?: { id: number; name: string; type: string } | null;
  sayapType?: { id: number; name: string } | null;
  membersCount?: number;
  members?: { id: number; fullName: string; status?: string; photoUrl?: string | null }[];
};

interface TableFilters {
  search: string;
  level: string;
  position: string;
  regionId: string;
  take: number;
  skip: number;
}

interface OrganizationTableProps {
  data: StrukturItem[];
  totalData: number;
  loading: boolean;
  fetching: boolean;
  error?: any;
  isError: boolean;
  onRefresh: () => void;
  filters: TableFilters;
  onFiltersChange: (filters: TableFilters | ((prev: TableFilters) => TableFilters)) => void;
  regions: { id: number; name: string; type: string }[];
  sayapTypes: { id: number; name: string }[];
}

// Members Dialog Component
interface MembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: { id: number; fullName: string; status?: string; photoUrl?: string | null }[];
  orgTitle: string;
}

function MembersDialog({ open, onOpenChange, members, orgTitle }: MembersDialogProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);
  
  const debouncedSearch = useDebounce(search, 300);

  const filteredMembers = React.useMemo(() => {
    let filtered = members;
    
    if (debouncedSearch) {
      filtered = filtered.filter(m => 
        m.fullName.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(m => m.status === statusFilter);
    }
    
    return filtered;
  }, [members, debouncedSearch, statusFilter]);

  const paginatedMembers = React.useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, pageIndex, pageSize]);

  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  const statuses = React.useMemo(() => {
    const unique = [...new Set(members.map(m => m.status).filter(Boolean))];
    return unique;
  }, [members]);

  React.useEffect(() => {
    if (open) {
      setSearch("");
      setStatusFilter("");
      setPageIndex(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#16A34A] rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-[#001B55]">
                Daftar Anggota
              </DialogTitle>
              <p className="text-sm text-gray-500">{orgTitle}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <Input
                placeholder="Cari nama anggota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 rounded-lg border border-gray-300 focus-visible:ring-[#16A34A]"
              />
            </div>
            {statuses.length > 0 && (
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger className="w-48 h-9">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Semua Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status!}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={pageSize.toString()} onValueChange={(v) => {
              setPageSize(Number(v));
              setPageIndex(0);
            }}>
              <SelectTrigger className="w-24 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#16A34A]/5">
                  <tr>
                    <th className="text-left font-semibold px-4 py-3 border-b border-gray-200 text-xs uppercase tracking-wide text-[#16A34A]">
                      No
                    </th>
                    <th className="text-left font-semibold px-4 py-3 border-b border-gray-200 text-xs uppercase tracking-wide text-[#16A34A]">
                      Foto
                    </th>
                    <th className="text-left font-semibold px-4 py-3 border-b border-gray-200 text-xs uppercase tracking-wide text-[#16A34A]">
                      Nama Lengkap
                    </th>
                    <th className="text-left font-semibold px-4 py-3 border-b border-gray-200 text-xs uppercase tracking-wide text-[#16A34A] sticky right-0 bg-[#16A34A]/5 z-10 min-w-[100px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMembers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        {search || statusFilter ? "Tidak ada data sesuai filter" : "Tidak ada anggota"}
                      </td>
                    </tr>
                  ) : (
                    paginatedMembers.map((member, idx) => (
                      <tr 
                        key={member.id} 
                        className="hover:bg-blue-100 transition-colors"
                        style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#eff1f3' }}
                      >
                        <td className="px-4 py-3 border-b border-gray-100">
                          {pageIndex * pageSize + idx + 1}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-100">
                          {member.photoUrl ? (
                            <img
                              src={member.photoUrl}
                              alt={member.fullName}
                              className="h-10 w-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-100 font-medium text-gray-900">
                          {member.fullName}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-100 sticky right-0 bg-white z-10 min-w-[100px] shadow-[ -5px 0 5px -5px rgba(0,0,0,0.1)]">
                          {member.status ? (
                            <Badge variant="secondary" className="text-xs">
                              {member.status}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <SimplePagination
            page={pageIndex + 1}
            totalPages={totalPages}
            onChange={(page) => setPageIndex(page - 1)}
            totalItems={filteredMembers.length}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

const levelColors: Record<string, string> = {
  dpd: "bg-[#001B55] text-white",
  dpc: "bg-emerald-600 text-white",
  dprt: "bg-amber-600 text-white",
  sayap: "bg-blue-500 text-white",
  kader: "bg-purple-600 text-white",
};

const positionColors: Record<string, string> = {
  ketua: "bg-gradient-to-r from-[#001B55] to-[#0b378d] text-white",
  sekretaris: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
  bendahara: "bg-gradient-to-r from-[#FF9C04] to-[#ffb53f] text-[#001B55]",
  wakil: "bg-gradient-to-r from-sky-500 to-sky-600 text-white",
  anggota: "bg-gray-200 text-[#001B55]",
};

export function OrganizationTable({
  data,
  totalData,
  loading,
  fetching,
  error,
  isError,
  onRefresh,
  filters,
  onFiltersChange,
  regions,
  sayapTypes,
}: OrganizationTableProps) {
  const [membersDialog, setMembersDialog] = React.useState<{
    open: boolean;
    members: { id: number; fullName: string; status?: string }[];
    title: string;
  }>({ open: false, members: [], title: "" });

  const [regionSearch, setRegionSearch] = React.useState("");
  const [showRegionDropdown, setShowRegionDropdown] = React.useState(false);
  const regionInputRef = React.useRef<HTMLInputElement>(null);

  // Filter regions based on search
  const filteredRegions = React.useMemo(() => {
    if (!regionSearch.trim()) return regions;
    return regions.filter((r) =>
      r.name.toLowerCase().includes(regionSearch.toLowerCase())
    );
  }, [regions, regionSearch]);

  // Get selected region name
  const selectedRegion = React.useMemo(() => {
    return regions.find((r) => r.id.toString() === filters.regionId);
  }, [regions, filters.regionId]);

  // Close region dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        regionInputRef.current &&
        !regionInputRef.current.contains(event.target as Node)
      ) {
        setShowRegionDropdown(false);
      }
    };

    if (showRegionDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showRegionDropdown]);

  const clearFilter = (key: keyof TableFilters) => {
    onFiltersChange(prev => ({ ...prev, [key]: "" }));
  };

  const activeFiltersCount = React.useMemo(() => {
    return [filters.level, filters.position, filters.regionId].filter(Boolean).length;
  }, [filters.level, filters.position, filters.regionId]);

  const currentPage = Math.floor(filters.skip / filters.take) + 1;
  const totalPages = Math.ceil(totalData / filters.take);

  const handlePageChange = (newPage: number) => {
    const newSkip = (newPage - 1) * filters.take;
    onFiltersChange(prev => ({ ...prev, skip: newSkip }));
  };

  const handlePageSizeChange = (newSize: number) => {
    onFiltersChange(prev => ({ ...prev, take: newSize, skip: 0 }));
  };

  const columns = React.useMemo<ColumnDef<StrukturItem>[]>(
    () => [
      {
        accessorKey: "level",
        header: "Level",
        cell: ({ row }) => {
          const val = row.original.level;
          return (
            <Badge
              className={cn(
                "font-medium rounded-md px-2 py-1 text-xs",
                levelColors[val] || "bg-gray-200 text-[#001B55]"
              )}
            >
              {val.toUpperCase()}
            </Badge>
          );
        },
      },
      {
        accessorKey: "position",
        header: "Posisi",
        cell: ({ row }) => {
          const val = row.original.position;
          return (
            <Badge
              className={cn(
                "font-medium rounded-md px-2 py-1 text-[11px]",
                positionColors[val] || "bg-gray-100 text-[#001B55]"
              )}
            >
              {val}
            </Badge>
          );
        },
      },
      {
        id: "photo",
        header: "Foto",
        cell: ({ row }) =>
          row.original.photoUrl ? (
            <img
              src={row.original.photoUrl}
              alt="foto"
              className="h-8 w-8 object-cover rounded-md border"
            />
          ) : (
            <div className="h-8 w-8 flex items-center justify-center rounded-md border text-[#6B7280] bg-gray-50">
              <ImageIcon className="h-4 w-4" />
            </div>
          ),
      },
      {
        accessorKey: "region.name",
        header: "Region",
        cell: ({ row }) => row.original.region?.name || "-",
      },
      {
        accessorKey: "sayapType.name",
        header: "Sayap",
        cell: ({ row }) => row.original.sayapType?.name || "-",
      },
      {
        accessorKey: "membersCount",
        header: "Anggota",
        cell: ({ row }) => {
          const count = row.original.membersCount ?? 0;
          const members = row.original.members ?? [];
          
          if (count === 0) {
            return <span className="text-gray-400">0</span>;
          }

          return (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs hover:bg-[#001B55] hover:text-white border-[#001B55] text-[#001B55]"
              onClick={() => setMembersDialog({
                open: true,
                members,
                title: `${row.original.level.toUpperCase()} - ${row.original.position} ${row.original.region?.name ? `- ${row.original.region.name}` : ''}`
              })}
            >
              <Users className="h-3 w-3 mr-1" />
              {count}
            </Button>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="sticky right-0 bg-white z-10 min-w-[100px] shadow-[ -5px 0 5px -5px rgba(0,0,0,0.1)]">
            <OrganizationActions
              item={row.original}
              regions={regions}
              sayapTypes={sayapTypes}
            />
          </div>
        ),
      },
    ],
    [regions, sayapTypes]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1">
            <Input
              placeholder="Cari level / posisi / region..."
              value={filters.search}
              onChange={(e) => onFiltersChange(prev => ({ ...prev, search: e.target.value, skip: 0 }))}
              className="pl-3 pr-3 py-2 rounded-xl border border-[#E5E7EB] focus-visible:ring-[#FF9C04]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select 
              value={filters.level} 
              onValueChange={(val) =>
                onFiltersChange(prev => ({
                  ...prev,
                  level: val === "__all__" ? "" : val,
                  skip: 0,
                }))
              }
            >
              <SelectTrigger className="w-32 h-9">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Semua Level</SelectItem>
                <SelectItem value="dpd">DPD</SelectItem>
                <SelectItem value="dpc">DPC</SelectItem>
                <SelectItem value="dprt">DPRT</SelectItem>
                <SelectItem value="sayap">Sayap</SelectItem>
                <SelectItem value="kader">Kader</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.position} 
              onValueChange={(val) =>
                onFiltersChange(prev => ({
                  ...prev,
                  position: val === "__all__" ? "" : val,
                  skip: 0,
                }))
              }
            >
              <SelectTrigger className="w-32 h-9">
                <SelectValue placeholder="Posisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Semua Posisi</SelectItem>
                <SelectItem value="ketua">Ketua</SelectItem>
                <SelectItem value="sekretaris">Sekretaris</SelectItem>
                <SelectItem value="bendahara">Bendahara</SelectItem>
                <SelectItem value="wakil">Wakil</SelectItem>
                <SelectItem value="anggota">Anggota</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative w-40">
              <Input
                ref={regionInputRef}
                placeholder="Cari region..."
                value={selectedRegion ? selectedRegion.name : regionSearch}
                onChange={(e) => {
                  setRegionSearch(e.target.value);
                  setShowRegionDropdown(true);
                  if (!e.target.value) {
                    onFiltersChange(prev => ({ ...prev, regionId: "", skip: 0 }));
                  }
                }}
                onFocus={() => setShowRegionDropdown(true)}
                className="h-9"
              />
              {showRegionDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        onFiltersChange(prev => ({ ...prev, regionId: "", skip: 0 }));
                        setRegionSearch("");
                        setShowRegionDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded"
                    >
                      Semua Region
                    </button>
                    {filteredRegions.map((region) => (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => {
                          onFiltersChange(prev => ({ ...prev, regionId: region.id.toString(), skip: 0 }));
                          setRegionSearch("");
                          setShowRegionDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        {region.name}
                        <span className="text-xs text-gray-500 ml-2">
                          ({region.type})
                        </span>
                      </button>
                    ))}
                    {filteredRegions.length === 0 && regionSearch && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Tidak ditemukan "{regionSearch}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Filter aktif:
            </span>
            {filters.level && (
              <Badge variant="secondary" className="text-xs">
                Level: {filters.level.toUpperCase()}
                <button 
                  onClick={() => clearFilter('level')}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.position && (
              <Badge variant="secondary" className="text-xs">
                Posisi: {filters.position}
                <button 
                  onClick={() => clearFilter('position')}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.regionId && (
              <Badge variant="secondary" className="text-xs">
                Region: {regions.find(r => r.id.toString() === filters.regionId)?.name}
                <button 
                  onClick={() => {
                    clearFilter('regionId');
                    setRegionSearch("");
                  }}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center text-xs text-[#6B7280]">
        <span>
          Menampilkan {filters.skip + 1}-{Math.min(filters.skip + filters.take, totalData)} dari {totalData} data
        </span>
        <Select 
          value={filters.take.toString()} 
          onValueChange={(val) => handlePageSizeChange(Number(val))}
        >
          <SelectTrigger className="w-20 h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#001B55]/5 text-[#001B55]">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className={cn(
                        "text-left font-semibold px-4 py-3 border-b border-[#E5E7EB] text-xs uppercase tracking-wide",
                        h.id === "actions" ? "sticky right-0 bg-[#001B55]/5 z-10 min-w-[100px]" : ""
                      )}
                    >
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-10 text-center text-[#6B7280]"
                  >
                    Memuat data...
                  </td>
                </tr>
              )}
              {isError && !loading && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-10 text-center text-red-600"
                  >
                    {error?.message || "Gagal memuat data"}
                  </td>
                </tr>
              )}
              {!loading &&
                !isError &&
                data.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-10 text-center text-[#6B7280]"
                    >
                      Tidak ada data.
                    </td>
                  </tr>
                )}
              {data.map((row, idx) => (
                <tr
                  key={row.id}
                  className="hover:bg-blue-100 transition-colors"
                  style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#eff1f3' }}
                >
                  {table.getRowModel().rows[idx]?.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-4 py-3 border-b border-[#F1F2F4] align-middle",
                        cell.column.id === "actions" ? "sticky right-0 bg-white z-10 min-w-[100px] shadow-[ -5px 0 5px -5px rgba(0,0,0,0.1)]" : ""
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <SimplePagination
        page={currentPage}
        totalPages={totalPages}
        onChange={handlePageChange}
        totalItems={totalData}
      />

      {/* Members Dialog */}
      <MembersDialog
        open={membersDialog.open}
        onOpenChange={(open) => setMembersDialog(prev => ({ ...prev, open }))}
        members={membersDialog.members}
        orgTitle={membersDialog.title}
      />
    </div>
  );
}
