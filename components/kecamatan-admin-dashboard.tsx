"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, MapPin, Plus, Edit, Trash2, LogOut, User, Building2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface KecamatanStats {
  desa: number
  tps: number
  kader: number
  coordinators: number
}

interface KecamatanAdminDashboardProps {
  user: any
  kecamatan: string
  stats: KecamatanStats
}

export default function KecamatanAdminDashboard({ user, kecamatan, stats }: KecamatanAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddCoordinator, setShowAddCoordinator] = useState(false)
  const [showAddKader, setShowAddKader] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-nasdem-blue">Admin Kecamatan Dashboard</h1>
              <p className="text-gray-600">Kelola Anggota & Kader - Kecamatan {kecamatan}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-nasdem-blue">{user.email}</p>
                <Badge className="bg-green-500 text-white">Admin Kecamatan</Badge>
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
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent space-y-1">
                <TabsTrigger
                  value="dashboard"
                  className="w-full justify-start data-[state=active]:bg-nasdem-blue data-[state=active]:text-white"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="coordinators"
                  className="w-full justify-start data-[state=active]:bg-nasdem-blue data-[state=active]:text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Koordinator TPS
                </TabsTrigger>
                <TabsTrigger
                  value="kaders"
                  className="w-full justify-start data-[state=active]:bg-nasdem-blue data-[state=active]:text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Kader
                </TabsTrigger>
              </TabsList>

              {/* Main Content */}
              <div className="flex-1 p-6">
                <TabsContent value="dashboard" className="mt-0">
                  <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-gradient-to-r from-nasdem-blue to-nasdem-blue/80 text-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/80 text-sm">Total Desa</p>
                              <p className="text-2xl font-bold">{stats.desa}</p>
                            </div>
                            <MapPin className="h-8 w-8 text-white/80" />
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
                            <Building2 className="h-8 w-8 text-white/80" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/80 text-sm">Koordinator</p>
                              <p className="text-2xl font-bold">{stats.coordinators}</p>
                            </div>
                            <User className="h-8 w-8 text-white/80" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
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
                    </div>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-nasdem-blue">Aksi Cepat</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button
                            onClick={() => setShowAddCoordinator(true)}
                            className="bg-nasdem-blue hover:bg-nasdem-blue/90 h-16"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Tambah Koordinator TPS
                          </Button>
                          <Button
                            onClick={() => setShowAddKader(true)}
                            className="bg-nasdem-orange hover:bg-nasdem-orange/90 h-16"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Tambah Kader
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="coordinators" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-nasdem-blue">Koordinator TPS</h2>
                      <Button className="bg-nasdem-blue hover:bg-nasdem-blue/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Koordinator
                      </Button>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Daftar Koordinator TPS</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-nasdem-blue text-white">
                                <th className="border border-gray-300 p-2 text-left">Nama</th>
                                <th className="border border-gray-300 p-2 text-left">Email</th>
                                <th className="border border-gray-300 p-2 text-left">TPS</th>
                                <th className="border border-gray-300 p-2 text-left">Jumlah Kader</th>
                                <th className="border border-gray-300 p-2 text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                {
                                  name: "Budi Santoso",
                                  email: "koordinator1@nasdemsidoarjo.id",
                                  tps: "TPS 001 Sidokare",
                                  kaderCount: 10,
                                },
                                {
                                  name: "Siti Rahayu",
                                  email: "koordinator2@nasdemsidoarjo.id",
                                  tps: "TPS 002 Sidokare",
                                  kaderCount: 10,
                                },
                                {
                                  name: "Ahmad Wijaya",
                                  email: "koordinator3@nasdemsidoarjo.id",
                                  tps: "TPS 001 Lemahputro",
                                  kaderCount: 8,
                                },
                              ].map((coordinator, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="border border-gray-300 p-2">{coordinator.name}</td>
                                  <td className="border border-gray-300 p-2">{coordinator.email}</td>
                                  <td className="border border-gray-300 p-2">{coordinator.tps}</td>
                                  <td className="border border-gray-300 p-2">
                                    <Badge className={coordinator.kaderCount === 10 ? "bg-green-500" : "bg-yellow-500"}>
                                      {coordinator.kaderCount}/10
                                    </Badge>
                                  </td>
                                  <td className="border border-gray-300 p-2">
                                    <div className="flex justify-center space-x-1">
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
                </TabsContent>

                <TabsContent value="kaders" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-nasdem-blue">Kelola Kader</h2>
                      <Button className="bg-nasdem-orange hover:bg-nasdem-orange/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Kader
                      </Button>
                    </div>

                    {/* Add Kader Form */}
                    {showAddKader && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Tambah Kader Baru</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="kader-name">Nama Lengkap</Label>
                              <Input id="kader-name" placeholder="Masukkan nama lengkap" />
                            </div>
                            <div>
                              <Label htmlFor="kader-phone">No. Telepon</Label>
                              <Input id="kader-phone" placeholder="Masukkan no. telepon" />
                            </div>
                            <div>
                              <Label htmlFor="kader-tps">TPS</Label>
                              <select id="kader-tps" className="w-full p-2 border rounded-md">
                                <option>Pilih TPS</option>
                                <option>TPS 001 Sidokare</option>
                                <option>TPS 002 Sidokare</option>
                                <option>TPS 001 Lemahputro</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="kader-coordinator">Koordinator</Label>
                              <select id="kader-coordinator" className="w-full p-2 border rounded-md">
                                <option>Pilih Koordinator</option>
                                <option>Budi Santoso</option>
                                <option>Siti Rahayu</option>
                                <option>Ahmad Wijaya</option>
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="kader-address">Alamat</Label>
                              <Input id="kader-address" placeholder="Masukkan alamat lengkap" />
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button className="bg-nasdem-orange hover:bg-nasdem-orange/90">Simpan Kader</Button>
                            <Button variant="outline" onClick={() => setShowAddKader(false)}>
                              Batal
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Kaders List */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Daftar Kader per TPS</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {[
                            {
                              tps: "TPS 001 Sidokare",
                              coordinator: "Budi Santoso",
                              kaders: [
                                { name: "Agus Setiawan", phone: "081234567890", address: "Jl. Merdeka No. 1" },
                                { name: "Rina Wati", phone: "081234567891", address: "Jl. Merdeka No. 2" },
                                { name: "Bambang Sutrisno", phone: "081234567892", address: "Jl. Merdeka No. 3" },
                              ],
                            },
                            {
                              tps: "TPS 002 Sidokare",
                              coordinator: "Siti Rahayu",
                              kaders: [
                                { name: "Joko Widodo", phone: "082234567890", address: "Jl. Pahlawan No. 1" },
                                { name: "Sri Mulyani", phone: "082234567891", address: "Jl. Pahlawan No. 2" },
                              ],
                            },
                          ].map((tpsData, index) => (
                            <Card key={index} className="bg-gray-50">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <CardTitle className="text-lg text-nasdem-blue">{tpsData.tps}</CardTitle>
                                    <p className="text-sm text-gray-600">Koordinator: {tpsData.coordinator}</p>
                                  </div>
                                  <Badge className="bg-nasdem-orange">{tpsData.kaders.length}/10 Kader</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {tpsData.kaders.map((kader, kaderIndex) => (
                                    <div key={kaderIndex} className="bg-white p-3 rounded border">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-medium text-gray-900">{kader.name}</p>
                                          <p className="text-sm text-gray-600">{kader.phone}</p>
                                          <p className="text-xs text-gray-500">{kader.address}</p>
                                        </div>
                                        <div className="flex space-x-1">
                                          <Button size="sm" variant="outline">
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                          <Button size="sm" variant="outline">
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </nav>
        </aside>
      </div>
    </div>
  )
}
