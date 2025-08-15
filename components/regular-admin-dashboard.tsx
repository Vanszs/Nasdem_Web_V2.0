"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, ImageIcon, Plus, Edit, Trash2, Eye, LogOut, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AdminStats {
  news: number
  gallery: number
  published: number
  draft: number
}

interface RegularAdminDashboardProps {
  user: any
  stats: AdminStats
}

export default function RegularAdminDashboard({ user, stats }: RegularAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
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
              <h1 className="text-2xl font-bold text-nasdem-blue">Admin Dashboard</h1>
              <p className="text-gray-600">Kelola Berita & Galeri - DPD NasDem Sidoarjo</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-nasdem-blue">{user.email}</p>
                <Badge className="bg-nasdem-orange text-white">Admin</Badge>
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
                  <FileText className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="news"
                  className="w-full justify-start data-[state=active]:bg-nasdem-blue data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Kelola Berita
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="w-full justify-start data-[state=active]:bg-nasdem-blue data-[state=active]:text-white"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Kelola Galeri
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
                              <p className="text-white/80 text-sm">Total Berita</p>
                              <p className="text-2xl font-bold">{stats.news}</p>
                            </div>
                            <FileText className="h-8 w-8 text-white/80" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/80 text-sm">Berita Published</p>
                              <p className="text-2xl font-bold">{stats.published}</p>
                            </div>
                            <Eye className="h-8 w-8 text-white/80" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/80 text-sm">Draft Berita</p>
                              <p className="text-2xl font-bold">{stats.draft}</p>
                            </div>
                            <Edit className="h-8 w-8 text-white/80" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-r from-nasdem-orange to-nasdem-orange/80 text-white">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/80 text-sm">Total Galeri</p>
                              <p className="text-2xl font-bold">{stats.gallery}</p>
                            </div>
                            <ImageIcon className="h-8 w-8 text-white/80" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-nasdem-blue">Aktivitas Terbaru</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              action: "Berita baru dipublikasi",
                              title: "Rapat Koordinasi DPD NasDem Sidoarjo",
                              time: "2 jam yang lalu",
                              type: "news",
                            },
                            {
                              action: "Foto ditambahkan ke galeri",
                              title: "Kegiatan Bakti Sosial di Kecamatan Buduran",
                              time: "5 jam yang lalu",
                              type: "gallery",
                            },
                            {
                              action: "Draft berita dibuat",
                              title: "Program Kerja 2024 DPD NasDem Sidoarjo",
                              time: "1 hari yang lalu",
                              type: "news",
                            },
                          ].map((activity, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  activity.type === "news" ? "bg-nasdem-blue" : "bg-nasdem-orange"
                                }`}
                              >
                                {activity.type === "news" ? (
                                  <FileText className="h-5 w-5 text-white" />
                                ) : (
                                  <ImageIcon className="h-5 w-5 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{activity.action}</p>
                                <p className="text-sm text-gray-600">{activity.title}</p>
                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {activity.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="news" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-nasdem-blue">Kelola Berita</h2>
                      <Button className="bg-nasdem-orange hover:bg-nasdem-orange/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Berita
                      </Button>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Daftar Berita</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-nasdem-blue text-white">
                                <th className="border border-gray-300 p-2 text-left">Judul</th>
                                <th className="border border-gray-300 p-2 text-left">Status</th>
                                <th className="border border-gray-300 p-2 text-left">Tanggal</th>
                                <th className="border border-gray-300 p-2 text-left">Penulis</th>
                                <th className="border border-gray-300 p-2 text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                {
                                  title: "Rapat Koordinasi DPD NasDem Sidoarjo",
                                  status: "published",
                                  date: "2024-01-15",
                                  author: "Admin",
                                },
                                {
                                  title: "Program Kerja 2024 DPD NasDem Sidoarjo",
                                  status: "draft",
                                  date: "2024-01-14",
                                  author: "Admin",
                                },
                                {
                                  title: "Bakti Sosial di Kecamatan Buduran",
                                  status: "published",
                                  date: "2024-01-13",
                                  author: "Admin",
                                },
                              ].map((news, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="border border-gray-300 p-2">{news.title}</td>
                                  <td className="border border-gray-300 p-2">
                                    <Badge className={news.status === "published" ? "bg-green-500" : "bg-yellow-500"}>
                                      {news.status === "published" ? "Published" : "Draft"}
                                    </Badge>
                                  </td>
                                  <td className="border border-gray-300 p-2">{news.date}</td>
                                  <td className="border border-gray-300 p-2">{news.author}</td>
                                  <td className="border border-gray-300 p-2">
                                    <div className="flex justify-center space-x-1">
                                      <Button size="sm" variant="outline">
                                        <Eye className="h-3 w-3" />
                                      </Button>
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

                <TabsContent value="gallery" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-nasdem-blue">Kelola Galeri</h2>
                      <Button className="bg-nasdem-orange hover:bg-nasdem-orange/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Foto
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        {
                          title: "Rapat Koordinasi DPD",
                          date: "2024-01-15",
                          image: "/placeholder.svg?height=200&width=300",
                        },
                        {
                          title: "Bakti Sosial Buduran",
                          date: "2024-01-13",
                          image: "/placeholder.svg?height=200&width=300",
                        },
                        {
                          title: "Kunjungan Lapangan",
                          date: "2024-01-12",
                          image: "/placeholder.svg?height=200&width=300",
                        },
                      ].map((item, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <Button size="sm" variant="secondary" className="bg-white/80">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="secondary" className="bg-white/80">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-nasdem-blue mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {item.date}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
