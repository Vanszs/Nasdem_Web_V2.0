"use client";

import {
  DataTable,
  DataTableColumn,
  DataTableSkeleton,
} from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

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
  const columns: DataTableColumn[] = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "createdAt", label: "Dibuat" },
    { key: "actions", label: "Aksi", align: "right", width: 140 },
  ];

  if (loading) return <DataTableSkeleton columns={5} rows={8} />;
  if (error) return <div className="text-red-500 text-sm">{error}</div>;

  const rows = data.map((u) => ({
    ...u,
    role: (
      <Badge
        className={
          u.role === "superadmin"
            ? "bg-[#001B55] text-white"
            : u.role === "editor"
            ? "bg-[#C5BAFF] text-[#001B55]"
            : "bg-[#6B7280] text-white"
        }
      >
        {u.role === "superadmin"
          ? "Super Admin"
          : u.role === "editor"
          ? "Editor"
          : "Analyst"}
      </Badge>
    ),
    createdAt: new Date(u.createdAt).toLocaleDateString("id-ID"),
    actions: (
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(u)}>
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(u)}>
          <Trash2 className="w-4 h-4 mr-1" /> Hapus
        </Button>
      </div>
    ),
  }));

  return (
    <DataTable
      columns={columns}
      data={rows as any}
      rowKey="id"
      pagination={{ pageSize: 20 }}
    />
  );
}
