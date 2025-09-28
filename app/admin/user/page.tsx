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
        <div className="bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
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
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl p-4 shadow-lg">
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
            <div className="flex gap-3">
              <Badge variant="outline" className="border-0 bg-gradient-to-r from-[#001B55] to-[#001B55]/90 text-white font-medium px-3 py-1.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                Total: {users.length} users
              </Badge>
              <Badge variant="outline" className="border-0 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-medium px-3 py-1.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                Active: {users.filter((u) => u.status === "Active").length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="px-8 py-6 border-b border-gray-50 bg-gradient-to-r from-[#001B55]/5 to-transparent">
            <h3 className="text-lg font-semibold text-[#001B55] tracking-tight">
              Daftar Pengguna
            </h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F0F0F0]/30 border-b border-gray-100 hover:bg-[#F0F0F0]/50 transition-colors duration-200">
                  <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm tracking-wide">Nama</TableHead>
                  <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm tracking-wide">Email</TableHead>
                  <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm tracking-wide">Role</TableHead>
                  <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm tracking-wide">Status</TableHead>
                  <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm tracking-wide">Last Login</TableHead>
                  <TableHead className="py-4 px-6 text-[#001B55] font-semibold text-sm tracking-wide">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-[#001B55]/3 hover:to-transparent transition-all duration-250 group">
                    <TableCell className="py-5 px-6 font-medium text-[#001B55] group-hover:text-[#001B55]">{user.name}</TableCell>
                    <TableCell className="py-5 px-6 text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                      {user.email}
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <Badge
                        variant="outline"
                        className={`border-0 font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md ${
                          user.role === "Admin"
                            ? "bg-gradient-to-r from-[#001B55] to-[#001B55]/90 hover:from-[#001B55]/90 hover:to-[#001B55]"
                            : user.role === "Editor"
                            ? "bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#FF9C04]/90 hover:to-[#FF9C04]"
                            : "bg-gradient-to-r from-gray-500 to-gray-400 hover:from-gray-400 hover:to-gray-500"
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <Badge
                        variant="outline"
                        className={`border-0 font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md ${
                          user.status === "Active"
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-500"
                            : "bg-gradient-to-r from-gray-400 to-gray-300 hover:from-gray-300 hover:to-gray-400"
                        }`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 px-6 text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-[#001B55]/10 hover:text-[#001B55] transition-all duration-200 rounded-xl border border-transparent hover:border-[#001B55]/20"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="border border-gray-100 shadow-lg rounded-2xl bg-white/95 backdrop-blur-sm"
                        >
                          <DropdownMenuItem className="hover:bg-[#001B55]/5 hover:text-[#001B55] transition-colors duration-200 rounded-xl mx-1 my-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[#C81E1E] hover:bg-red-50 hover:text-[#C81E1E] transition-colors duration-200 rounded-xl mx-1 my-1">
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
