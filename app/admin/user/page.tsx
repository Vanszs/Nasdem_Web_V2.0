"use client";

import { useState } from "react";
import {
  UserPlus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AdminLayout } from "../components/layout/AdminLayout";
import { PageHeader } from "../components/ui/PageHeader";
import { ContentCard } from "../components/ui/ContentCard";
import { ActionButton } from "../components/ui/ActionButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SimplePagination } from "@/components/ui/pagination";
import { UserFormDialog } from "./components/UserFormDialog";
import { DeleteUserDialog } from "./components/DeleteUserDialog";
import { UserTable, UserRow } from "./components/UserTable";
import {
  createUserSchema,
  updateUserSchema,
  CreateUserInput,
  UpdateUserInput,
} from "./components/schemas";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

type UsersResponse = {
  success: boolean;
  data: Array<{
    id: number;
    username: string;
    email: string;
    role: "superadmin" | "editor" | "analyst";
    createdAt: string;
    updatedAt: string;
  }>;
  meta: { total: number; totalPages: number; page: number; pageSize: number };
};

// Forms handled by RHF+Zod in components

export function UserPage() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<
    "all" | "superadmin" | "editor" | "analyst"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const breadcrumbs = [{ label: "Pengguna Aplikasi" }];

  // Fetch users
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery<UsersResponse>({
    queryKey: ["users", page, debouncedSearch, roleFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "20",
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(roleFilter && roleFilter !== "all" && { role: roleFilter }),
      });
      const res = await fetch(`/api/users?${params}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Gagal memuat pengguna");
      }
      const data = (await res.json()) as UsersResponse;
      return data;
    },
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: async (payload: CreateUserInput) => {
      const parsed = createUserSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error(parsed.error.errors[0]?.message || "Data tidak valid");
      }
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || "Gagal menambah user");
      }
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsCreateDialogOpen(false);
      toast.success("User berhasil ditambahkan");
    },
    onError: (err: any) => {
      toast.error(
        typeof err?.message === "string" ? err.message : "Gagal menambah user"
      );
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateUserInput) => {
      const { id, ...rest } = payload;
      const parsed = updateUserSchema.safeParse(rest);
      if (!parsed.success) {
        throw new Error(parsed.error.errors[0]?.message || "Data tidak valid");
      }
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || "Gagal mengubah user");
      }
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      toast.success("Perubahan disimpan");
    },
    onError: (err: any) => {
      toast.error(
        typeof err?.message === "string" ? err.message : "Gagal mengubah user"
      );
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || "Gagal menghapus user");
      }
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast.success("User dihapus");
    },
    onError: (err: any) => {
      toast.error(
        typeof err?.message === "string" ? err.message : "Gagal menghapus user"
      );
    },
  });

  const handleCreate = () => setIsCreateDialogOpen(true);
  const handleEdit = (user: UserRow) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };
  const handleDelete = (user: UserRow) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const users = (usersData?.data as any[]) || [];
  const meta = usersData?.meta || {
    total: 0,
    totalPages: 1,
    page: 1,
    pageSize: 20,
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-[#001B55]";
      case "editor":
        return "bg-[#C5BAFF]";
      case "analyst":
        return "bg-[#6B7280]";
      default:
        return "bg-gray-400";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "superadmin":
        return "Super Admin";
      case "editor":
        return "Editor";
      case "analyst":
        return "Analyst";
      default:
        return role;
    }
  };

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header Section */}
        <PageHeader
          icon={<Users className="w-6 h-6 text-[#001B55]" />}
          title="User Management"
          description="Kelola pengguna sistem admin panel NasDem Sidoarjo"
          action={
            <ActionButton
              icon={<UserPlus className="w-4 h-4" />}
              variant="primary"
              onClick={handleCreate}
            >
              Tambah User Baru
            </ActionButton>
          }
        />

        {/* Filter and Search Section */}
        <div className="bg-white border border-[#001B55]/10 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari user..."
                  className="pl-10 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={roleFilter}
                onValueChange={(v) => setRoleFilter(v as any)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Semua Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Badge
                variant="outline"
                className="border border-[#001B55]/20 bg-white text-[#001B55] font-medium px-3 py-1.5 rounded-lg"
              >
                Total: {meta.total} users
              </Badge>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <ContentCard
          title="Daftar Pengguna"
          icon={<Users className="w-5 h-5 text-[#001B55]" />}
        >
          <UserTable
            data={users as UserRow[]}
            loading={isLoading}
            error={error instanceof Error ? error.message : null}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </ContentCard>

        {/* Pagination */}
        <SimplePagination
          page={page}
          totalPages={meta.totalPages || 1}
          onChange={(p) => setPage(p)}
          totalItems={meta.total}
        />

        <UserFormDialog
          mode="create"
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={(values) =>
            createMutation.mutate(values as CreateUserInput)
          }
          isSubmitting={createMutation.isPending}
        />

        <UserFormDialog
          mode="edit"
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={selectedUser as any}
          onSubmit={(values) =>
            updateMutation.mutate(values as UpdateUserInput)
          }
          isSubmitting={updateMutation.isPending}
        />

        <DeleteUserDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={() =>
            selectedUser && deleteMutation.mutate(selectedUser.id)
          }
          isPending={deleteMutation.isPending}
        />
      </div>
    </AdminLayout>
  );
}

export default UserPage;
