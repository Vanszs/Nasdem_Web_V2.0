"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AdminLayout } from "../../components/layout/AdminLayout";
import {
  useOrganizations,
  useOrganizationMutations,
} from "@/app/admin/organizations/hooks/useOrganizations";
import {
  useRegionsLookup,
  useSayapTypesLookup,
} from "@/app/admin/organizations/hooks/useLookups";
import { AddOrganizationDialog } from "../components/AddOrganizationDialog";
import { EditOrganizationDialog } from "../components/EditOrganizationDialog";

type StrukturItem = {
  id: number;
  level: string;
  position: string;
  region?: { id: number; name: string; type: string } | null;
  sayapType?: { id: number; name: string } | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  membersCount?: number;
};

interface SavePayload {
  id?: number;
  level: string;
  position: string;
  regionId?: number | null;
  sayapTypeId?: number | null;
  startDate?: string | null;
  endDate?: string | null;
}

const levelColors: Record<string, string> = {
  dpd: "bg-[#001B55] text-white",
  dpc: "bg-emerald-600 text-white",
  dprt: "bg-amber-600 text-white",
  sayap: "bg-[#FF9C04] text-white",
  kader: "bg-purple-600 text-white",
};

const positionColors: Record<string, string> = {
  ketua: "bg-gradient-to-r from-[#001B55] to-[#0b378d] text-white",
  sekretaris: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
  bendahara: "bg-gradient-to-r from-[#FF9C04] to-[#ffb53f] text-[#001B55]",
  wakil: "bg-gradient-to-r from-sky-500 to-sky-600 text-white",
  anggota: "bg-gray-200 text-[#001B55]",
};

const breadcrumbs = [
  { label: "Struktur", href: "/admin/organizations" },
  { label: "Kelola Organisasi" },
];

export default function ManageOrganizationPage() {
  const [filters, setFilters] = React.useState<{
    search: string;
    take: number;
    skip: number;
  }>({
    search: "",
    take: 100,
    skip: 0,
  });
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [editing, setEditing] = React.useState<StrukturItem | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<StrukturItem | null>(
    null
  );

  // Debug effects
  React.useEffect(() => {
    console.log("Add dialog open state:", openAdd);
  }, [openAdd]);

  React.useEffect(() => {
    console.log("Edit dialog open state:", openEdit);
  }, [openEdit]);

  const {
    data: orgData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useOrganizations(filters);

  const struktur = orgData?.data || [];

  const { data: regions = [] } = useRegionsLookup();
  const { data: sayapTypes = [] } = useSayapTypesLookup();

  const {
    create: createMut,
    update: updateMut,
    remove: deleteMut,
  } = useOrganizationMutations();

  const filteredData = React.useMemo(() => {
    if (!filters.search) return struktur;
    const g = filters.search.toLowerCase();
    return struktur.filter(
      (row: any) =>
        row.level.toLowerCase().includes(g) ||
        row.position.toLowerCase().includes(g) ||
        (row.region?.name?.toLowerCase().includes(g) ?? false) ||
        (row.sayapType?.name?.toLowerCase().includes(g) ?? false)
    );
  }, [struktur, filters.search]);

  React.useEffect(() => {
    setOpenEdit(!!editing);
  }, [editing]);

  function handleCreate(payload: any) {
    createMut.mutate(payload, {
      onSuccess: () => setOpenAdd(false),
    });
  }

  function handleUpdate(id: number, payload: any) {
    updateMut.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          setEditing(null);
          setOpenEdit(false);
        },
      }
    );
  }

  const columns = React.useMemo<ColumnDef<StrukturItem>[]>(
    () => [
      {
        accessorKey: "level",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Level
            <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        ),
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
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Posisi
            <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        ),
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
        accessorKey: "startDate",
        header: "Mulai",
        cell: ({ row }) =>
          row.original.startDate
            ? format(new Date(row.original.startDate), "dd MMM yyyy")
            : "-",
      },
      {
        accessorKey: "endDate",
        header: "Akhir",
        cell: ({ row }) =>
          row.original.endDate
            ? format(new Date(row.original.endDate), "dd MMM yyyy")
            : "-",
      },
      {
        accessorKey: "membersCount",
        header: "Members",
        cell: ({ row }) => row.original.membersCount ?? 0,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#001B55]"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => {
                    setEditing(item);
                  }}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setConfirmDelete(item)}
                  className="gap-2 text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200/70 rounded-2xl px-6 py-5 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-[#001B55]">
              Kelola Struktur Organisasi
            </h1>
            <p className="text-sm text-[#6B7280]">
              Pengaturan hierarki, posisi & sayap organisasi
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-[#001B55]/30 text-[#001B55]"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4 mr-2",
                  isFetching && "animate-spin text-[#001B55]"
                )}
              />
              Refresh
            </Button>
            {/* <Button
              onClick={() => {
                console.log("Add button clicked");
                setEditing(null);
                setOpenAdd(true);
                console.log("openAdd set to:", true);
              }}
              className="bg-[#001B55] hover:bg-[#0b377f] text-white cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </Button> */}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative w-full md:w-72">
            <Input
              placeholder="Cari level / posisi / region..."
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              className="pl-3 pr-3 py-2 rounded-xl border border-[#E5E7EB] focus-visible:ring-[#FF9C04]"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#001B55]/5 text-[#001B55]">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th
                        key={h.id}
                        className="text-left font-semibold px-4 py-3 border-b border-[#E5E7EB] text-xs uppercase tracking-wide"
                      >
                        {h.isPlaceholder
                          ? null
                          : flexRender(
                              h.column.columnDef.header,
                              h.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-10 text-center text-[#6B7280]"
                    >
                      Memuat data...
                    </td>
                  </tr>
                )}
                {isError && !isLoading && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="py-10 text-center text-red-600"
                    >
                      {(error as any)?.message || "Gagal memuat data"}
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  !isError &&
                  table.getRowModel().rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="py-10 text-center text-[#6B7280]"
                      >
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-[#001B55]/3 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
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

        {/* Add Dialog */}
        <AddOrganizationDialog
          open={openAdd}
          onOpenChange={setOpenAdd}
          regions={regions}
          sayapTypes={sayapTypes}
          onCreate={handleCreate}
          creating={createMut.isPending}
        />

        {/* Edit Dialog */}
        <EditOrganizationDialog
          open={openEdit}
          onOpenChange={(o) => {
            if (!o) setEditing(null);
            setOpenEdit(o);
          }}
          item={editing}
          regions={regions}
          sayapTypes={sayapTypes}
          onUpdate={handleUpdate}
          updating={updateMut.isPending}
        />

        {/* Delete Confirm */}
        <Dialog
          open={!!confirmDelete}
          onOpenChange={(o) => !o && setConfirmDelete(null)}
        >
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-[#001B55]">
                Hapus Struktur?
              </DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan. Data terkait tetap ada
                (member tidak dihapus).
              </DialogDescription>
            </DialogHeader>
            <div className="pt-2 space-y-2 text-sm">
              <p>
                Level:{" "}
                <span className="font-semibold">
                  {confirmDelete?.level.toUpperCase()}
                </span>
              </p>
              <p>
                Posisi:{" "}
                <span className="font-semibold">{confirmDelete?.position}</span>
              </p>
            </div>
            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => setConfirmDelete(null)}
                className="border-[#001B55]/30"
              >
                Batal
              </Button>
              <Button
                onClick={() =>
                  confirmDelete &&
                  deleteMut.mutate(confirmDelete.id, {
                    onSuccess: () => setConfirmDelete(null),
                  })
                }
                disabled={deleteMut.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMut.isPending ? "Menghapus..." : "Hapus"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
