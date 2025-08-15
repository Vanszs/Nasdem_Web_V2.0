"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Users,
  MapPin,
  Building2,
  User,
  FileText,
  ImageIcon,
  Settings,
  Shield,
  BarChart3,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface DashboardStats {
  kecamatan: number
  desa: number
  tps: number
  kader: number
  users: number
  news: number
  gallery: number
}

interface SuperAdminDashboardProps {
  user: any
  stats: DashboardStats
}

export default function SuperAdminDashboard({ user, stats }: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Sample election data for charts
  const electionData = [
    { name: "Sidoarjo", nasdem: 1250, total: 5000 },
    { name: "Buduran", nasdem: 980, total: 4200 },
    { name: "Candi", nasdem: 1100, total: 4800 },
    { name: "Porong", nasdem: 850, total: 3900 },
    { name: "Krembung", nasdem: 750, total: 3500 },
  ]

  const pieData = [
    { name: "NasDem", value: 4930, color: "#001B55" },
    { name: "Partai Lain", value: 16470, color: "#FF9C04" },
  ]

  const monthlyData = [
    { month: "Jan", kader: 120, tps: 45 },
    { month: "Feb", kader: 135, tps: 48 },
    { month: "Mar", kader: 148, tps: 52 },
    { month: "Apr", kader: 162, tps: 55 },
    { month: "May", kader: 175, tps: 58 },
    { month: "Jun", kader: 189, tps: 62 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-nasdem-blue">Super Admin Dashboard</h1>
              <p className="text-gray-600">DPD Partai NasDem Sidoarjo</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-nasdem-blue">{user.username}</p>
                <Badge className="bg-nasdem-orange text-white">Super Admin</Badge>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <div className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                { id: "analytics", label: "Analisa Data", icon: BarChart3 },
                { id: "users", label: "Pengguna", icon: Users },
                { id: "organization", label: "Organisasi", icon: Building2 },
                { id: "news", label: "Berita", icon: FileText },
                { id: "gallery", label: "Galeri", icon: ImageIcon },
                { id: "security", label: "Keamanan", icon: Shield },
                { id: "settings", label: "Pengaturan", icon: Settings },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                      activeTab === item.id ? "bg-nasdem-blue text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-nasdem-blue to-nasdem-blue/80 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Total Kecamatan</p>
                        <p className="text-2xl font-bold">{stats.kecamatan}</p>
                      </div>
                      <Building2 className="h-8 w-8 text-white/80" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-nasdem-orange to-nasdem-orange/80 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Total TPS</p>
                        <p className="text-2xl font-bold">{stats.tps}</p>
                      </div>
                      <MapPin className="h-8 w-8 text-white/80" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Total Kader</p>
                        <p className="text-2xl font-bold">{stats.kader}</p>
                      </div>
                      <Users className="h-8 w-8 text-white/80" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Total Pengguna</p>
                        <p className="text-2xl font-bold">{stats.users}</p>
                      </div>
                      <User className="h-8 w-8 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-nasdem-blue">Perolehan Suara per Kecamatan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={electionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="nasdem" fill="#001B55" name="NasDem" />
                        <Bar dataKey="total" fill="#FF9C04" name="Total Suara" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-nasdem-blue">Distribusi Suara</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-nasdem-blue">Pertumbuhan Organisasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="kader" stroke="#001B55" name="Kader" strokeWidth={2} />
                      <Line type="monotone" dataKey="tps" stroke="#FF9C04" name="TPS" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-nasdem-blue">Analisa Data Pemilu</h2>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Filter Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter & Pencarian Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Partai</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Semua Partai</option>
                        <option>NasDem</option>
                        <option>PDI-P</option>
                        <option>Golkar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Dapil</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Semua Dapil</option>
                        <option>Dapil 1</option>
                        <option>Dapil 2</option>
                        <option>Dapil 3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Kecamatan</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Semua Kecamatan</option>
                        <option>Sidoarjo</option>
                        <option>Buduran</option>
                        <option>Candi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">TPS</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Semua TPS</option>
                        <option>TPS 001</option>
                        <option>TPS 002</option>
                        <option>TPS 003</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Hasil Pemilu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-nasdem-blue text-white">
                          <th className="border border-gray-300 p-2">TPS</th>
                          <th className="border border-gray-300 p-2">Kecamatan</th>
                          <th className="border border-gray-300 p-2">NasDem</th>
                          <th className="border border-gray-300 p-2">PDI-P</th>
                          <th className="border border-gray-300 p-2">Golkar</th>
                          <th className="border border-gray-300 p-2">Total</th>
                          <th className="border border-gray-300 p-2">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { tps: "001", kecamatan: "Sidoarjo", nasdem: 125, pdip: 98, golkar: 87, total: 450 },
                          { tps: "002", kecamatan: "Sidoarjo", nasdem: 142, pdip: 76, golkar: 92, total: 420 },
                          { tps: "003", kecamatan: "Buduran", nasdem: 98, pdip: 112, golkar: 65, total: 380 },
                        ].map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{row.tps}</td>
                            <td className="border border-gray-300 p-2">{row.kecamatan}</td>
                            <td className="border border-gray-300 p-2 font-semibold text-nasdem-blue">{row.nasdem}</td>
                            <td className="border border-gray-300 p-2">{row.pdip}</td>
                            <td className="border border-gray-300 p-2">{row.golkar}</td>
                            <td className="border border-gray-300 p-2 font-semibold">{row.total}</td>
                            <td className="border border-gray-300 p-2">
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-nasdem-blue">Manajemen Pengguna</h2>
                <Button className="bg-nasdem-orange hover:bg-nasdem-orange/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Pengguna
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Daftar Pengguna</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-nasdem-blue text-white">
                          <th className="border border-gray-300 p-2">Username</th>
                          <th className="border border-gray-300 p-2">Role</th>
                          <th className="border border-gray-300 p-2">Kecamatan</th>
                          <th className="border border-gray-300 p-2">Status</th>
                          <th className="border border-gray-300 p-2">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            username: "admin1",
                            role: "super_admin",
                            kecamatan: "-",
                            status: "Aktif",
                          },
                          {
                            username: "admin2",
                            role: "kecamatan_admin",
                            kecamatan: "Sidoarjo",
                            status: "Aktif",
                          },
                          {
                            username: "admin3",
                            role: "admin",
                            kecamatan: "-",
                            status: "Aktif",
                          },
                        ].map((user, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{user.username}</td>
                            <td className="border border-gray-300 p-2">
                              <Badge
                                className={
                                  user.role === "super_admin"
                                    ? "bg-red-500"
                                    : user.role === "kecamatan_admin"
                                      ? "bg-nasdem-orange"
                                      : "bg-gray-500"
                                }
                              >
                                {user.role}
                              </Badge>
                            </td>
                            <td className="border border-gray-300 p-2">{user.kecamatan}</td>
                            <td className="border border-gray-300 p-2">
                              <Badge className="bg-green-500">{user.status}</Badge>
                            </td>
                            <td className="border border-gray-300 p-2">
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs with placeholder content */}
          {["organization", "news", "gallery", "security", "settings"].includes(activeTab) && (
            <div className="text-center py-12">
              <div className="h-16 w-16 text-gray-400 mx-auto mb-4">
                {activeTab === "organization" && <Building2 className="h-16 w-16" />}
                {activeTab === "news" && <FileText className="h-16 w-16" />}
                {activeTab === "gallery" && <ImageIcon className="h-16 w-16" />}
                {activeTab === "security" && <Shield className="h-16 w-16" />}
                {activeTab === "settings" && <Settings className="h-16 w-16" />}
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {activeTab === "organization" && "Manajemen Organisasi"}
                {activeTab === "news" && "Manajemen Berita"}
                {activeTab === "gallery" && "Manajemen Galeri"}
                {activeTab === "security" && "Keamanan & Hak Akses"}
                {activeTab === "settings" && "Pengaturan Sistem"}
              </h3>
              <p className="text-gray-500">
                {activeTab === "organization" && "Kelola struktur organisasi, kecamatan, desa, TPS, dan kader"}
                {activeTab === "news" && "Kelola berita dan artikel"}
                {activeTab === "gallery" && "Kelola foto dan media"}
                {activeTab === "security" && "Kelola keamanan sistem dan hak akses pengguna"}
                {activeTab === "settings" && "Konfigurasi sistem dan pengaturan umum"}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
