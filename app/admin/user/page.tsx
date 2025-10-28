"use client";

import { useState } from "react";
import {
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Loader2,
  X,
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
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

interface User {
  id: number;
  username: string;
  email: string;
  role: "superadmin" | "editor" | "analyst";
  createdAt: string;
  updatedAt: string;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: "superadmin" | "editor" | "analyst";
}

export function UserPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    password: "",
    role: "editor",
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  const breadcrumbs = [{ label: "Pengguna Aplikasi" }];

  // Fetch users
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ["users", page, debouncedSearch, roleFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "20",
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(roleFilter && roleFilter !== "all" && { role: roleFilter }),
      });

      console.log("Fetching users with params:", params.toString());

      const res = await fetch(`/api/users?${params}`, {
        credentials: "include",
      });
      
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Failed to fetch users");
      }
      
      const data = await res.json();
      console.log("Users data received:", data);
      return data;
    },
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success("User berhasil ditambahkan");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<UserFormData> & { id: number }) => {
      const { id, ...updateData } = data;
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      resetForm();
      toast.success("User berhasil diupdate");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast.success("User berhasil dihapus");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "editor",
    });
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    const updateData: any = {
      id: selectedUser.id,
      username: formData.username,
      email: formData.email,
      role: formData.role,
    };
    
    // Only include password if it's been changed
    if (formData.password) {
      updateData.password = formData.password;
    }
    
    updateMutation.mutate(updateData);
  };

  const users = usersData?.data || [];
  const meta = usersData?.meta || { total: 0, totalPages: 1 };

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
              <Select value={roleFilter} onValueChange={setRoleFilter}>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#001B55]" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Error: {error instanceof Error ? error.message : "Failed to load users"}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Tidak ada user ditemukan
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F3F4F6] border-b border-gray-300">
                    <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm first:rounded-tl-xl">
                      Username
                    </TableHead>
                    <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm">
                      Email
                    </TableHead>
                    <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm">
                      Role
                    </TableHead>
                    <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm">
                      Dibuat
                    </TableHead>
                    <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm sticky right-0 bg-[#F3F4F6] z-10 min-w-[100px] last:rounded-tr-xl">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User, index: number) => {
                    const bgColor = index % 2 === 0 ? "#FBFBFB" : "#F9FAFB";
                    const isLast = index === users.length - 1;
                    return (
                      <TableRow
                        key={user.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-100 transition-colors duration-150"
                        style={{
                          backgroundColor: bgColor,
                        }}
                      >
                        <TableCell className={`py-4 px-6 font-medium text-[#001B55] ${isLast ? 'rounded-bl-xl' : ''}`}>
                          {user.username}
                        </TableCell>
                        <TableCell className="py-4 px-6 text-gray-700">
                          {user.email}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge
                            variant="outline"
                            className={`border-0 font-medium rounded-md px-3 py-1 text-xs w-[110px] inline-flex items-center justify-center ${
                              user.role === 'editor' 
                                ? 'bg-[#C5BAFF] text-[#001B55]' 
                                : `text-white ${getRoleBadgeColor(user.role)}`
                            }`}
                          >
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-gray-600 text-sm">
                          {new Date(user.createdAt).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell 
                          className={`py-4 px-6 sticky right-0 z-10 min-w-[100px] ${isLast ? 'rounded-br-xl' : ''}`}
                          style={{ backgroundColor: bgColor }}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-[#C5BAFF]/20 hover:text-[#001B55] transition-colors duration-150 rounded-md"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="border border-gray-200 shadow-sm rounded-lg bg-white min-w-[140px]"
                            >
                              <DropdownMenuItem
                                onClick={() => handleEdit(user)}
                                className="hover:bg-[#E8F9FF] hover:text-[#001B55] transition-colors duration-150 rounded-md mx-1 my-0.5 cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(user)}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 rounded-md mx-1 my-0.5 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </ContentCard>

        {/* Create User Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
              <DialogDescription>
                Isi form di bawah untuk menambahkan user baru ke sistem
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitCreate}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Masukkan username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Masukkan email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Min. 8 karakter"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={createMutation.isPending}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-[#001B55] hover:bg-[#001B55]/90"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update informasi user. Kosongkan password jika tidak ingin mengubahnya
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitEdit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username *</Label>
                  <Input
                    id="edit-username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Masukkan username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Masukkan email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-password">Password (opsional)</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Kosongkan jika tidak diubah"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={updateMutation.isPending}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-[#001B55] hover:bg-[#001B55]/90"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus user{" "}
                <strong>{selectedUser?.username}</strong>? Aksi ini tidak dapat
                dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedUser && deleteMutation.mutate(selectedUser.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Hapus"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

export default UserPage;
