"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

export interface UserRow {
  id: number;
  username: string;
  email: string;
  role: "superadmin" | "editor" | "analyst";
  createdAt: string;
}

interface Props {
  data: UserRow[];
  loading?: boolean;
  error?: string | null;
  onEdit: (u: UserRow) => void;
  onDelete: (u: UserRow) => void;
}

export function UserTable({ data, loading, error, onEdit, onDelete }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<UserRow>[]>(
    () => [
      {
        accessorKey: "username",
        header: ({ column }) => (
          <HeaderCell
            label="Username"
            sortable
            onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
            state={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.username}</span>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <HeaderCell
            label="Email"
            sortable
            onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
            state={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => <span>{row.original.email}</span>,
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <HeaderCell
            label="Role"
            sortable
            onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
            state={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => {
          const r = row.original.role;
          const cls =
            r === "superadmin"
              ? "bg-[#001B55] text-white"
              : r === "editor"
              ? "bg-[#C5BAFF] text-[#001B55]"
              : "bg-[#6B7280] text-white";
          const label =
            r === "superadmin"
              ? "Super Admin"
              : r === "editor"
              ? "Editor"
              : "Analyst";
          return <Badge className={cls}>{label}</Badge>;
        },
        sortingFn: "alphanumeric",
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <HeaderCell
            label="Dibuat"
            sortable
            onSort={() => column.toggleSorting(column.getIsSorted() === "asc")}
            state={column.getIsSorted()}
          />
        ),
        cell: ({ row }) => (
          <span>
            {new Date(row.original.createdAt).toLocaleDateString("id-ID")}
          </span>
        ),
        sortingFn: (a, b, id) => {
          const da = new Date(a.getValue(id) as string).getTime();
          const db = new Date(b.getValue(id) as string).getTime();
          return da === db ? 0 : da > db ? 1 : -1;
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Aksi</div>,
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(u)}>
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(u)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Hapus
              </Button>
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }).map((__, j) => (
                  <TableCell key={j}>
                    <div className="h-4 w-full max-w-[180px] bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-sm">{error}</div>;

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : (
                    <div className="select-none">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-sm text-gray-500"
              >
                Tidak ada data pengguna
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function HeaderCell({
  label,
  sortable,
  onSort,
  state,
}: {
  label: string;
  sortable?: boolean;
  onSort?: () => void;
  state?: false | "asc" | "desc";
}) {
  if (!sortable)
    return (
      <span className="text-sm font-semibold text-[#001B55]">{label}</span>
    );
  return (
    <button
      type="button"
      onClick={onSort}
      className="inline-flex items-center gap-1 text-sm font-semibold text-[#001B55] hover:text-[#001B55]"
    >
      {label}
      {state === "asc" ? (
        <ArrowUp className="w-3.5 h-3.5" />
      ) : state === "desc" ? (
        <ArrowDown className="w-3.5 h-3.5" />
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
      )}
    </button>
  );
}
