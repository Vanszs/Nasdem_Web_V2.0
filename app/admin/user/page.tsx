import {
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Users,
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
import { PageHeader } from "../components/ui/PageHeader";
import { ContentCard } from "../components/ui/ContentCard";
import { ActionButton } from "../components/ui/ActionButton";

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
        <PageHeader
          icon={<Users className="w-6 h-6 text-[#001B55]" />}
          title="User Management"
          description="Kelola pengguna sistem admin panel NasDem Sidoarjo"
          action={
            <ActionButton icon={<UserPlus className="w-4 h-4" />} variant="primary">
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
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex gap-3">
              <Badge variant="outline" className="border border-[#001B55]/20 bg-white text-[#001B55] font-medium px-3 py-1.5 rounded-lg">
                Total: {users.length} users
              </Badge>
              <Badge variant="outline" className="border border-emerald-500/20 bg-white text-emerald-600 font-medium px-3 py-1.5 rounded-lg">
                Active: {users.filter((u) => u.status === "Active").length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <ContentCard
          title="Daftar Pengguna"
          icon={<Users className="w-5 h-5 text-[#001B55]" />}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200 border-b-2 border-gray-300">
                  <TableHead className="py-4 px-6 text-[#001B55] font-bold text-sm">Nama</TableHead>
                  <TableHead className="py-4 px-6 text-[#001B55] font-bold text-sm">Email</TableHead>
                  <TableHead className="py-4 px-6 text-[#001B55] font-bold text-sm">Role</TableHead>
                  <TableHead className="py-4 px-6 text-[#001B55] font-bold text-sm">Status</TableHead>
                  <TableHead className="py-4 px-6 text-[#001B55] font-bold text-sm">Last Login</TableHead>
                  <TableHead className="py-4 px-6 text-[#001B55] font-bold text-sm">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow 
                    key={user.id} 
                    className="border-b border-gray-100 hover:bg-blue-100 transition-all duration-200"
                    style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eff1f3' }}
                  >
                    <TableCell className="py-5 px-6 font-medium text-[#001B55]">{user.name}</TableCell>
                    <TableCell className="py-5 px-6 text-gray-600">
                      {user.email}
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <Badge
                        variant="outline"
                        className={`border-0 font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md ${
                          user.role === "Admin"
                            ? "bg-[#001B55] hover:bg-[#001B55]/90"
                            : user.role === "Editor"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-500 hover:bg-gray-600"
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
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : "bg-gray-400 hover:bg-gray-500"
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
        </ContentCard>
      </div>
    </AdminLayout>
  );
}

export default UserPage;
