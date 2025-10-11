"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ImageIcon, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  bio?: string | null;
  nik?: string | null;
  ktaNumber?: string | null;
  familyCount?: number | null;
  maritalStatus?: string | null;
};

export interface MemberTableFilters {
  name: string;
  email: string;
  status: string;
  gender: string;
  address: string;
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
}: MembersTableProps) {
  const columns = React.useMemo<ColumnDef<MemberListItem>[]>(
    () => [
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
        accessorKey: "address",
        header: "Alamat",
        cell: ({ row }) => (
          <span className="text-sm text-[#374151] block max-w-[240px] truncate">
            {row.original.address || "-"}
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
          <MembersActions member={row.original} onChanged={onRefresh} />
        ),
      },
    ],
    [onRefresh]
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
      [
        filters.name,
        filters.email,
        filters.status,
        filters.gender,
        filters.address,
      ].filter(Boolean).length,
    [
      filters.address,
      filters.email,
      filters.gender,
      filters.name,
      filters.status,
    ]
  );

  const currentPage = Math.floor(filters.skip / filters.take) + 1;
  const totalPages = Math.ceil(Math.max(totalData, 1) / filters.take);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-5">
          <Input
            placeholder="Cari nama"
            value={filters.name}
            onChange={(e) =>
              onFiltersChange((prev) => ({
                ...prev,
                name: e.target.value,
                skip: 0,
              }))
            }
            className="h-9 border-2 border-gray-300 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20"
          />
          <Input
            placeholder="Cari email"
            value={filters.email}
            onChange={(e) =>
              onFiltersChange((prev) => ({
                ...prev,
                email: e.target.value,
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
            <SelectTrigger className="h-9 border-2 border-gray-300 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20">
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
            <SelectTrigger className="h-9 border-2 border-gray-300 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Semua Gender</SelectItem>
              <SelectItem value="male">Pria</SelectItem>
              <SelectItem value="female">Wanita</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Cari alamat"
            value={filters.address}
            onChange={(e) =>
              onFiltersChange((prev) => ({
                ...prev,
                address: e.target.value,
                skip: 0,
              }))
            }
            className="h-9 border-2 border-gray-300 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20"
          />
        </div>

        {activeFilters > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Filter aktif:
            </span>
            {filters.name && (
              <Badge variant="secondary" className="text-xs">
                Nama: {filters.name}
                <button
                  type="button"
                  onClick={() =>
                    onFiltersChange((prev) => ({ ...prev, name: "", skip: 0 }))
                  }
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.email && (
              <Badge variant="secondary" className="text-xs">
                Email: {filters.email}
                <button
                  type="button"
                  onClick={() =>
                    onFiltersChange((prev) => ({ ...prev, email: "", skip: 0 }))
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
            {filters.address && (
              <Badge variant="secondary" className="text-xs">
                Alamat: {filters.address}
                <button
                  type="button"
                  onClick={() =>
                    onFiltersChange((prev) => ({
                      ...prev,
                      address: "",
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
                      className="text-left font-semibold px-4 py-3 border-b border-[#E5E7EB] text-xs uppercase tracking-wide"
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
                        className="px-4 py-3 border-b border-[#F1F2F4] align-middle"
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
