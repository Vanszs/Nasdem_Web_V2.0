"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Mail, Phone, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MemberRegistration } from "../hooks/useMemberRegistrations";
import { getStatusBadge } from "./DetailModal";
import { useState } from "react";
import { useBatchSelection } from "@/hooks/use-batch-selection";
import { BatchActionBar } from "@/components/ui/batch-action-bar";
import { Checkbox } from "@/components/ui/checkbox";
import { BatchConfirmationDialog } from "@/components/ui/batch-confirmation-dialog";
import { toast } from "sonner";

export function RegistrationsTable({
  data,
  onDetail,
  loading,
  error,
  getProgramName,
}: {
  data: MemberRegistration[];
  onDetail: (row: MemberRegistration) => void;
  loading?: boolean;
  error?: string;
  getProgramName: (id?: number | null) => string;
}) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Initialize batch selection
  const batchSelection = useBatchSelection({
    data,
    idField: "id",
    persistKey: "registrations-batch-selection",
    enablePersistence: false,
    enableSelectionMode: true,
    onBatchAction: async (action, selectedIds) => {
      if (action === "approve" || action === "reject") {
        setPendingAction(action);
        setConfirmDialogOpen(true);
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

  // Handle batch approve/reject confirmation
  const handleBatchAction = async () => {
    if (!batchSelection.selectedIds.length || !pendingAction) return;

    const isApprove = pendingAction === "approve";
    const endpoint = isApprove
      ? "/api/membership-applications/batch-approve"
      : "/api/membership-applications/batch-reject";
    const successMessage = isApprove
      ? `Berhasil menyetujui ${batchSelection.selectedIds.length} pendaftaran`
      : `Berhasil menolak ${batchSelection.selectedIds.length} pendaftaran`;
    const errorMessage = isApprove
      ? "Gagal menyetujui pendaftaran"
      : "Gagal menolak pendaftaran";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: batchSelection.selectedIds }),
      });

      if (!response.ok) throw new Error(errorMessage);

      toast.success(successMessage);
      batchSelection.clearSelection();
      setConfirmDialogOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error(errorMessage, {
        description: (err as Error).message,
      });
    }
  };
  const columns = React.useMemo<ColumnDef<MemberRegistration>[]>(
    () => {
      const baseColumns: ColumnDef<MemberRegistration>[] = [];

      // Conditionally add select column
      if (isSelectMode) {
        baseColumns.push({
          id: "select",
          header: () => (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={batchSelection.isAllSelected}
                onCheckedChange={batchSelection.toggleAllSelection}
                aria-label="Pilih semua pendaftaran"
              />
            </div>
          ),
          cell: ({ row }) => (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={batchSelection.isRowSelected(row.original.id)}
                onCheckedChange={() => batchSelection.toggleRowSelection(row.original.id)}
                aria-label={`Pilih pendaftaran ${row.original.fullName}`}
              />
            </div>
          ),
          size: 50,
        });
      }

      baseColumns.push(
      {
        header: "Nama Lengkap",
        accessorKey: "fullName",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#C5BAFF] rounded-full flex-shrink-0" />
            <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
              {row.original.fullName}
            </span>
          </div>
        ),
      },
      { header: "NIK", accessorKey: "nik" },
      {
        header: "Kontak",
        accessorKey: "email",
        cell: ({ row }) => (
          <div className="space-y-0.5 text-xs">
            <div className="flex items-center gap-1.5 text-text-secondary whitespace-nowrap">
              <Mail className="w-3 h-3" />
              <span className="truncate max-w-[180px]">
                {row.original.email}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary whitespace-nowrap">
              <Phone className="w-3 h-3" />
              {row.original.phone}
            </div>
          </div>
        ),
      },
      {
        header: "Tanggal Lahir",
        accessorKey: "dateOfBirth",
        cell: ({ row }) =>
          row.original.dateOfBirth
            ? new Date(row.original.dateOfBirth).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
      },
      {
        header: "Jenis Kelamin",
        accessorKey: "gender",
        cell: ({ row }) =>
          row.original.gender === "male"
            ? "Laki-laki"
            : row.original.gender === "female"
            ? "Perempuan"
            : "-",
      },
      {
        header: "Status Nikah",
        accessorKey: "maritalStatus",
        cell: () => "Belum Menikah",
      },
      {
        header: "Jumlah Keluarga",
        accessorKey: "familyMemberCount",
        cell: () => "4 Orang",
      },
      {
        header: "Alamat",
        accessorKey: "address",
        cell: ({ row }) => (
          <span className="truncate block max-w-[200px] text-sm text-text-secondary">
            {row.original.address}
          </span>
        ),
      },
      {
        header: "Pekerjaan",
        accessorKey: "occupation",
      },
      {
        header: "Program",
        accessorKey: "beneficiaryProgramId",
        cell: ({ row }) => (
          <span className="font-medium text-text-primary">
            {row.original.isBeneficiary
              ? getProgramName(row.original.beneficiaryProgramId)
              : "-"}
          </span>
        ),
      },
      {
        header: "Deskripsi",
        accessorKey: "notes",
        cell: ({ row }) => (
          <span className="truncate block max-w-[200px] text-sm text-text-secondary">
            {row.original.notes || "-"}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        header: "Terdaftar",
        accessorKey: "submittedAt",
        cell: ({ row }) =>
          new Date(row.original.submittedAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
      },
      {
        id: "actions",
        header: () => (
          <div className="text-right sticky right-0 bg-gray-200 z-10 whitespace-nowrap px-4 py-3">
            Aksi
          </div>
        ),
        cell: ({ row }) => (
          <div className="px-4 py-3 text-right sticky right-0 bg-card z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.02)]">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDetail(row.original)}
              className="text-xs h-8 rounded-lg border-border hover:bg-muted hover:border-brand-primary text-brand-primary transition-all"
            >
              Detail
            </Button>
          </div>
        ),
      });

      return baseColumns;
    },
    [onDetail, getProgramName, batchSelection, isSelectMode]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
        <div className="p-6 text-sm text-text-secondary">
          Memuat data pendaftar...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
        <div className="p-6 text-sm text-red-600">{error}</div>
      </div>
    );
  }

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
            Pilih pendaftaran untuk disetujui atau ditolak
          </div>
        )}
      </div>

      {/* Batch Actions - Only show when selection mode is active */}
      {isSelectMode && batchSelection.selectedCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-[#E8F9FF] border border-[#C4D9FF] rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#001B55]">
              {batchSelection.selectedCount} dari {data.length} terpilih
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={batchSelection.clearSelection}
              className="text-xs text-muted-foreground hover:text-[#001B55]"
            >
              Batal Pilih
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => batchSelection.executeBatchAction("approve")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Setujui ({batchSelection.selectedCount})
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => batchSelection.executeBatchAction("reject")}
            >
              Tolak ({batchSelection.selectedCount})
            </Button>
          </div>
        </div>
      )}

      {/* Batch Confirmation Dialog */}
      <BatchConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={pendingAction === "approve" ? "Setujui Pendaftaran Terpilih" : "Tolak Pendaftaran Terpilih"}
        description={`Apakah Anda yakin ingin ${pendingAction === "approve" ? "menyetujui" : "menolak"} ${batchSelection.selectedCount} pendaftaran yang dipilih?`}
        action={pendingAction === "approve" ? "approve" : "reject"}
        itemCount={batchSelection.selectedCount}
        itemDetails={[
          { label: "Jumlah Pendaftaran", value: batchSelection.selectedCount },
          { label: "Total Data", value: data.length },
        ]}
        onConfirm={handleBatchAction}
        onCancel={() => setConfirmDialogOpen(false)}
        loading={batchSelection.actionState.loading}
        progress={batchSelection.actionState.progress}
        error={batchSelection.actionState.error}
      />

      <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#C5BAFF #f0f0f0" }}
      >
        <table className="w-full">
          <thead className="bg-gray-200 border-b border-border sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap"
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
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-text-secondary"
                >
                  Tidak ada data pendaftar anggota
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap"
                    >
                      {cell.column.columnDef.cell
                        ? flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        : String(cell.getValue() ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
