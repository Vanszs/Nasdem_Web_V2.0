"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberRegistration } from "../hooks/useMemberRegistrations";
import { getStatusBadge } from "./DetailModal";

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
  const columns = React.useMemo<ColumnDef<MemberRegistration>[]>(
    () => [
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
      },
    ],
    [onDetail]
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
  );
}
