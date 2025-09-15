"use client";
import { useState } from "react";
import { AdminLayout } from "@/src/components/layout/AdminLayout";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Image, Upload, Plus, Search, Calendar, Eye, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: "kegiatan" | "dokumentasi" | "event" | "lainnya";
  image: string;
  uploadDate: string;
  photographer?: string;
  location?: string;
  tags: string[];
  views: number;
}

// Mock data for gallery
const mockGalleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Rapat Koordinasi DPD",
    description: "Rapat koordinasi pengurus DPD Partai NasDem Sidoarjo membahas program kerja 2024",
    category: "kegiatan",
    image: "/api/placeholder/400/300",
    uploadDate: "2024-01-15",
    photographer: "Tim Media NasDem",
    location: "Kantor DPD NasDem Sidoarjo",
    tags: ["rapat", "koordinasi", "dpd", "2024"],
    views: 1250
  },
  {
    id: "2",
    title: "Blusukan ke Pasar Tradisional",
    description: "Kegiatan blusukan pengurus ke pasar tradisional untuk mendengarkan aspirasi pedagang",
    category: "kegiatan", 
    image: "/api/placeholder/400/300",
    uploadDate: "2024-01-10",
    photographer: "Ahmad Fotografer",
    location: "Pasar Sidoarjo",
    tags: ["blusukan", "pasar", "aspirasi", "pedagang"],
    views: 890
  },
  {
    id: "3",
    title: "Bakti Sosial Ramadan",
    description: "Program bakti sosial membagikan sembako kepada masyarakat kurang mampu",
    category: "event",
    image: "/api/placeholder/400/300",
    uploadDate: "2024-01-05",
    photographer: "Tim Humas",
    location: "Kelurahan Sidoarjo",
    tags: ["baksos", "ramadan", "sembako", "sosial"],
    views: 1560
  },
  {
    id: "4",
    title: "Dokumentasi Kantor DPD",
    description: "Foto dokumentasi gedung kantor DPD Partai NasDem Sidoarjo",
    category: "dokumentasi",
    image: "/api/placeholder/400/300", 
    uploadDate: "2024-01-01",
    photographer: "Staff Admin",
    location: "Kantor DPD NasDem",
    tags: ["kantor", "gedung", "dokumentasi"],
    views: 780
  }
];

export function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(mockGalleryItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalItems = filteredItems.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const categoryConfig = {
    kegiatan: { 
      label: "Kegiatan", 
      className: "bg-brand-primary text-white border-2 border-brand-primary/20"
    },
    dokumentasi: { 
      label: "Dokumentasi", 
      className: "bg-success text-white border-2 border-success/20"
    },
    event: { 
      label: "Event", 
      className: "bg-info text-white border-2 border-info/20"
    },
    lainnya: { 
      label: "Lainnya", 
      className: "bg-muted text-muted-foreground border-2 border-muted/20"
    },
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Galeri" }
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header Section with Border */}
        <div className="bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Kelola Galeri</h1>
              <p className="text-muted-foreground">Upload dan organisir foto dan media</p>
            </div>
            <Button 
              className="bg-brand-accent border-2 border-brand-accent/20 hover:border-brand-accent/40 transition-all duration-300"
              onClick={() => router.push("/gallery/upload")}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="border-2 border-gray-300/80 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari judul, deskripsi atau tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px] border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary">
                  <SelectValue placeholder="Filter kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="kegiatan">Kegiatan</SelectItem>
                  <SelectItem value="dokumentasi">Dokumentasi</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        {paginatedItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedItems.map((item) => (
                <Card key={item.id} className="border-2 border-gray-300/80 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                    <Camera className="h-12 w-12 text-gray-400" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="h-4 w-4" />
                          {item.views}
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-8 text-xs bg-white/20 hover:bg-white/30 text-white border-white/30"
                          onClick={() => router.push(`/gallery/${item.id}`)}
                        >
                          Lihat Detail
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        className={categoryConfig[item.category].className}
                      >
                        {categoryConfig[item.category].label}
                      </Badge>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.uploadDate).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                    {item.photographer && (
                      <p className="text-xs text-muted-foreground">📸 {item.photographer}</p>
                    )}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{item.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Modern Pagination Controls untuk Galeri */}
            {totalItems > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between pt-6">
                <div className="text-sm text-muted-foreground">
                  Halaman {currentPage} dari {totalPages} ({totalItems} total media)
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-2 border-gray-200 hover:border-gray-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Sebelumnya
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      return page <= totalPages ? (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`min-w-[40px] border-2 ${
                            page === currentPage 
                              ? 'bg-brand-primary border-brand-primary text-white' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {page}
                        </Button>
                      ) : null;
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-2 border-gray-200 hover:border-gray-300"
                  >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 hover:border-gray-300/90 shadow-lg hover:shadow-xl transition-all duration-300 p-12 text-center">
            <Image className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4 p-2 border-2 border-dashed border-gray-300/60 rounded-2xl" />
            <h3 className="text-lg font-semibold mb-2">Galeri Media</h3>
            <p className="text-muted-foreground mb-4">Unggah foto untuk mulai membangun galeri.</p>
            <Button 
              className="bg-brand-accent border-2 border-brand-accent/20 hover:border-brand-accent/40 transition-all duration-300"
              onClick={() => router.push("/gallery/upload")}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
