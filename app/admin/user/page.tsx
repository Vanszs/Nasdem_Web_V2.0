import {
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
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
import { AdminLayout } from "../components/layout/AdminLayout";

export function UserPage() {
  const breadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    { label: "User Management" },
  ];

  // Mock data untuk user
  const users = [
    {
      id: 1,
      name: "Ahmad Soekarno",
      email: "ahmad@nasdem.id",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-15",
    },
    {
      id: 2,
      name: "Siti Rahmawati",
      email: "siti@nasdem.id",
      role: "Editor",
      status: "Active",
      lastLogin: "2024-01-14",
    },
    {
      id: 3,
      name: "Budi Santoso",
      email: "budi@nasdem.id",
      role: "Contributor",
      status: "Inactive",
      lastLogin: "2024-01-10",
    },
    {
      id: 4,
      name: "Dewi Kusuma",
      email: "dewi@nasdem.id",
      role: "Editor",
      status: "Active",
      lastLogin: "2024-01-13",
    },
    {
      id: 5,
      name: "Eko Prasetyo",
      email: "eko@nasdem.id",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-15",
    },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-smooth-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#001B55]">
                User Management
              </h1>
              <p className="text-muted-foreground">
                Kelola pengguna sistem admin panel NasDem Sidoarjo
              </p>
            </div>
            <Button className="bg-[#FF9C04] hover:bg-[#FF9C04]/90 text-white font-semibold border-2 border-[#FF9C04]/20 hover:border-[#FF9C04]/40 focus-ring transition-all duration-300 shadow-lg hover:shadow-xl">
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah User Baru
            </Button>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-smooth-xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari user..."
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Total: {users.length} users</Badge>
              <Badge variant="default" className="bg-green-500">
                Active: {users.filter((u) => u.status === "Active").length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-smooth-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200/50">
            <h3 className="text-lg font-semibold text-[#001B55]">
              Daftar Pengguna
            </h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-gray-600">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "Admin"
                            ? "default"
                            : user.role === "Editor"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          user.role === "Admin"
                            ? "bg-[#001B55]"
                            : user.role === "Editor"
                            ? "bg-[#FF9C04]"
                            : ""
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          user.status === "Active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default UserPage;
