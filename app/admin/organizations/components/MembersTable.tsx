"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ImageIcon, Filter, X, CheckSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimplePagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { MembersActions } from "./MembersActions";
import { toast } from "sonner";
import { useState } from "react";
import { useBatchSelection } from "@/hooks/use-batch-selection";
import { BatchActionBar } from "@/components/ui/batch-action-bar";
import { Checkbox } from "@/components/ui/checkbox";
import { BatchConfirmationDialog } from "@/components/ui/batch-confirmation-dialog";

export type MemberListItem = {
  id: number;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  status?: string | null;
  gender?: string | null;
  dateOfBirth?: string | Date | null;
  joinDate?: string | Date | null;
  photoUrl?: string | null;
  ktpPhotoUrl?: string | null;
  bio?: string | null;
  nik?: string | null;
  ktaNumber?: string | null;
  familyCount?: number | null;
  maritalStatus?: string | null;
};

export interface MemberTableFilters {
  search: string;
  status: string;
  gender: string;
  take: number;
  skip: number;
}

interface MembersTableProps {
  data: MemberListItem[];
  totalData: number;
  loading: boolean;
  fetching: boolean;
  error?: any;
  isError: boolean;
  onRefresh: () => void;
  filters: MemberTableFilters;
  onFiltersChange: (
    filters:
      | MemberTableFilters
      | ((prev: MemberTableFilters) => MemberTableFilters)
  ) => void;
  onBatchAction?: (action: 'delete' | 'export', selectedIds: number[]) => void;
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500 text-white",
  inactive: "bg-slate-400 text-white",
  suspended: "bg-amber-500 text-white",
};

const genderLabels: Record<string, string> = {
  male: "Pria",
  female: "Wanita",
};

export function MembersTable({
  data,
  totalData,
  loading,
  fetching,
  error,
  isError,
  onRefresh,
  filters,
  onFiltersChange,
  onBatchAction,
}: MembersTableProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Initialize batch selection
  const batchSelection = useBatchSelection({
    data,
    idField: "id",
    persistKey: "members-batch-selection",
    enablePersistence: false,
    enableSelectionMode: true,
    onBatchAction: async (action, selectedIds) => {
      if (action === "delete") {
        setPendingAction("delete");
        setConfirmDialogOpen(true);
      } else if (action === "export") {
        onBatchAction?.(action, selectedIds);
      }
    },
  });

  // Toggle selection mode
  const toggleSelectMode = () => {
    if (isSelectMode) {
      batchSelection.clearSelection();
      setIsSelectMode(false);
    } else {
      setIsSelectMode(true);
    }
  };

  // Handle batch delete confirmation
  const handleBatchDelete = async () => {
    if (!batchSelection.selectedIds.length) return;

    try {
      const response = await fetch("/api/members/batch-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: batchSelection.selectedIds }),
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus anggota");
      }

      toast.success(`Berhasil menghapus ${batchSelection.selectedIds.length} anggota`);
      batchSelection.clearSelection();
      setConfirmDialogOpen(false);
      onRefresh();
    } catch (err) {
      toast.error("Gagal menghapus anggota", {
        description: (err as Error).message,
      });
    }
  };
  const columns = React.useMemo<ColumnDef<MemberListItem>[]>(
    () => {
      const baseColumns: ColumnDef<MemberListItem>[] = [];

      // Conditionally add select column
      if (isSelectMode) {
        baseColumns.push({
          id: "select",
          header: () => (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={batchSelection.isAllSelected}
                onCheckedChange={batchSelection.toggleAllSelection}
                aria-label="Pilih semua anggota"
              />
            </div>
          ),
          cell: ({ row }) => (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={batchSelection.isRowSelected(row.original.id)}
                onCheckedChange={() => batchSelection.toggleRowSelection(row.original.id)}
                aria-label={`Pilih anggota ${row.original.fullName}`}
              />
            </div>
          ),
          size: 50,
        });
      }

      baseColumns.push(
      {
        id: "photo",
        header: "Foto",
        cell: ({ row }) =>
          row.original.photoUrl ? (
            <img
              src={row.original.photoUrl}
              alt={row.original.fullName}
              className="h-10 w-10 rounded-md object-cover border"
            />
          ) : (
            <div className="h-10 w-10 flex items-center justify-center rounded-md border text-[#6B7280] bg-gray-50">
              <ImageIcon className="h-4 w-4" />
            </div>
          ),
      },
      {
        accessorKey: "fullName",
        header: "Nama",
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-[#111827]">
              {row.original.fullName}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "nik",
        header: "NIK",
        cell: ({ row }) => (
          <span className="text-sm text-[#374151]">
            {row.original.nik || "-"}
          </span>
        ),
      },
      {
        accessorKey: "ktaNumber",
        header: "No. KTA",
        cell: ({ row }) => (
          <span className="text-sm text-[#374151]">
            {row.original.ktaNumber || "-"}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-sm text-[#374151]">
            {row.original.email || "-"}
          </span>
        ),
      },
      {
        accessorKey: "phone",
        header: "Telepon",
        cell: ({ row }) => (
          <span className="text-sm text-[#374151]">
            {row.original.phone || "-"}
          </span>
        ),
      },
      {
        accessorKey: "familyCount",
        header: "Jml. Keluarga",
        cell: ({ row }) => (
          <span className="text-sm text-[#374151]">
            {row.original.familyCount || "-"}
          </span>
        ),
      },
      {
        accessorKey: "maritalStatus",
        header: "Status",
        cell: ({ row }) => (
          <span className="text-sm text-[#374151]">
            {row.original.maritalStatus || "-"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={cn(
              "rounded-md px-2 py-0.5 text-[11px] font-medium",
              statusStyles[row.original.status ?? ""] ||
                "bg-gray-200 text-[#001B55]"
            )}
          >
            {row.original.status || "-"}
          </Badge>
        ),
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => (
          <span className="capitalize">
            {genderLabels[row.original.gender ?? ""] ||
              row.original.gender ||
              "-"}
          </span>
        ),
      },
      {
        accessorKey: "joinDate",
        header: "Bergabung",
        cell: ({ row }) => (
          <span className="text-xs text-[#374151]">
            {row.original.joinDate
              ? new Date(row.original.joinDate).toLocaleDateString("id-ID")
              : "-"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="sticky right-0 bg-white z-10 min-w-[100px] shadow-[-5px 0 5px -5px rgba(0,0,0,0.1)]">
            <MembersActions member={row.original} onChanged={onRefresh} />
          </div>
        ),
      });

      return baseColumns;
    },
    [onRefresh, batchSelection, isSelectMode]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalData / filters.take) || 1,
  });

  const activeFilters = React.useMemo(
    () =>
      [filters.search, filters.status, filters.gender].filter(Boolean).length,
    [filters.search, filters.status, filters.gender]
  );

  const currentPage = Math.floor(filters.skip / filters.take) + 1;
  const totalPages = Math.ceil(Math.max(totalData, 1) / filters.take);

  return (
    <div className="space-y-4">
      {/* Toggle Selection Mode Button */}
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant={isSelectMode ? "default" : "outline"}
          size="sm"
          onClick={toggleSelectMode}
          className={cn(
            "transition-all duration-200",
            isSelectMode
              ? "bg-[#001B55] text-white hover:bg-[#001B55]/90 shadow-md"
              : "border-[#C4D9FF] hover:bg-[#E8F9FF] hover:border-[#001B55]/30 text-[#001B55]"
          )}
          aria-label={isSelectMode ? "Nonaktifkan mode pemilihan" : "Aktifkan mode pemilihan"}
        >
          <CheckSquare className={cn("h-4 w-4 mr-2", isSelectMode && "animate-pulse")} />
          {isSelectMode ? "Keluar Mode Pilih" : "Mode Pilih"}
        </Button>
        
        {isSelectMode && (
          <div className="text-sm text-muted-foreground animate-in fade-in slide-in-from-left-2 duration-300">
            Pilih anggota yang ingin Anda kelola
          </div>
        )}
      </div>

      {/* Batch Actions Bar - Only show when selection mode is active */}
      {isSelectMode && (
        <BatchActionBar
          selectedCount={batchSelection.selectedCount}
          totalCount={data.length}
          isAllSelected={batchSelection.isAllSelected}
          onSelectAll={batchSelection.toggleAllSelection}
          onClearSelection={batchSelection.clearSelection}
          onDelete={() => batchSelection.executeBatchAction("delete")}
        />
      )}

      {/* Batch Confirmation Dialog */}
      <BatchConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Hapus Anggota Terpilih"
        description={`Apakah Anda yakin ingin menghapus ${batchSelection.selectedCount} anggota yang dipilih?`}
        action="delete"
        itemCount={batchSelection.selectedCount}
        itemDetails={[
          { label: "Jumlah Anggota", value: batchSelection.selectedCount },
          { label: "Total Data", value: data.length },
        ]}
        onConfirm={handleBatchDelete}
        onCancel={() => setConfirmDialogOpen(false)}
        loading={batchSelection.actionState.loading}
        progress={batchSelection.actionState.progress}
        error={batchSelection.actionState.error}
      />

      {/* Filters */}
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            placeholder="Cari nama, email, atau alamat"
            value={filters.search}
            onChange={(e) =>
              onFiltersChange((prev) => ({
                ...prev,
                search: e.target.value,
                skip: 0,
              }))
            }
            className="h-9 border-2 border-gray-300 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20"
          />
          <Select
            value={filters.status || "__all__"}
            onValueChange={(val) =>
              onFiltersChange((prev) => ({
                ...prev,
                status: val === "__all__" ? "" : val,
                skip: 0,
              }))
            }
          >
            <SelectTrigger className="h-9 w-full border-2 border-gray-300 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Tidak Aktif</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.gender || "__all__"}
            onValueChange={(val) =>
              onFiltersChange((prev) => ({
                ...prev,
                gender: val === "__all__" ? "" : val,
                skip: 0,
              }))
            }
          >
            <SelectTrigger className="h-9 w-full border-2 border-gray-300 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Semua Gender</SelectItem>
              <SelectItem value="male">Pria</SelectItem>
              <SelectItem value="female">Wanita</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activeFilters > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Filter aktif:
            </span>
            {filters.search && (
              <Badge variant="secondary" className="text-xs">
                Pencarian: {filters.search}
                <button
                  type="button"
                  onClick={() =>
                    onFiltersChange((prev) => ({
                      ...prev,
                      search: "",
                      skip: 0,
                    }))
                  }
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.status && (
              <Badge variant="secondary" className="text-xs">
                Status: {filters.status}
                <button
                  type="button"
                  onClick={() =>
                    onFiltersChange((prev) => ({
                      ...prev,
                      status: "",
                      skip: 0,
                    }))
                  }
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.gender && (
              <Badge variant="secondary" className="text-xs">
                Gender: {filters.gender}
                <button
                  type="button"
                  onClick={() =>
                    onFiltersChange((prev) => ({
                      ...prev,
                      gender: "",
                      skip: 0,
                    }))
                  }
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
      <div className="flex flex-col gap-2 text-xs text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
        <span>
          Menampilkan {totalData === 0 ? 0 : filters.skip + 1}-
          {Math.min(filters.skip + filters.take, totalData)} dari {totalData}{" "}
          data
        </span>
        <div className="flex items-center gap-2">
          {fetching && <span className="text-[#001B55]">Memuat...</span>}
          <Select
            value={filters.take.toString()}
            onValueChange={(val) =>
              onFiltersChange((prev) => ({
                ...prev,
                take: Number(val),
                skip: 0,
              }))
            }
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
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#001B55]/5 text-[#001B55]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "text-left font-semibold px-4 py-3 border-b border-[#E5E7EB] text-xs uppercase tracking-wide",
                        header.id === "actions"
                          ? "sticky right-0 bg-[#001B55]/5 z-10 min-w-[100px]"
                          : ""
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
              {!loading && !isError && data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-10 text-center text-[#6B7280]"
                  >
                    Tidak ada data.
                  </td>
                </tr>
              )}
              {data.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#001B55]/3 transition-colors"
                >
                  {table
                    .getRowModel()
                    .rows[rowIndex]?.getVisibleCells()
                    .map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-4 py-3 border-b border-[#F1F2F4] align-middle",
                          cell.column.id === "actions"
                            ? "sticky right-0 bg-white z-10 min-w-[100px] shadow-[ -5px 0 5px -5px rgba(0,0,0,0.1)]"
                            : ""
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
        totalPages={totalPages || 1}
        onChange={(page) =>
          onFiltersChange((prev) => ({
            ...prev,
            skip: (page - 1) * prev.take,
          }))
        }
        totalItems={totalData}
      />
    </div>
  );
}
