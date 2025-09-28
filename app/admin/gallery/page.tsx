"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Image,
  Upload,
  Plus,
  Search,
  Calendar,
  Eye,
  Camera,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Heart,
  Share2,
  Download,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "../components/layout/AdminLayout";

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
    description:
      "Rapat koordinasi pengurus DPD Partai NasDem Sidoarjo membahas program kerja 2024",
    category: "kegiatan",
    image: "/api/placeholder/400/300",
    uploadDate: "2024-01-15",
    photographer: "Tim Media NasDem",
    location: "Kantor DPD NasDem Sidoarjo",
    tags: ["rapat", "koordinasi", "dpd", "2024"],
    views: 1250,
  },
  {
    id: "2",
    title: "Blusukan ke Pasar Tradisional",
    description:
      "Kegiatan blusukan pengurus ke pasar tradisional untuk mendengarkan aspirasi pedagang",
    category: "kegiatan",
    image: "/api/placeholder/400/300",
    uploadDate: "2024-01-10",
    photographer: "Ahmad Fotografer",
    location: "Pasar Sidoarjo",
    tags: ["blusukan", "pasar", "aspirasi", "pedagang"],
    views: 890,
  },
  {
    id: "3",
    title: "Bakti Sosial Ramadan",
    description:
      "Program bakti sosial membagikan sembako kepada masyarakat kurang mampu",
    category: "event",
    image: "/api/placeholder/400/300",
    uploadDate: "2024-01-05",
    photographer: "Tim Humas",
    location: "Kelurahan Sidoarjo",
    tags: ["baksos", "ramadan", "sembako", "sosial"],
    views: 1560,
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
    views: 780,
  },
];

export default function Gallery() {
  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>(mockGalleryItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 12;
  const router = useRouter();

  const filteredItems = galleryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
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
      className: "bg-gradient-to-r from-[#001B55] to-[#001B55]/90 text-white border border-[#001B55]/20 shadow-sm",
      iconColor: "text-[#001B55]",
    },
    dokumentasi: {
      label: "Dokumentasi", 
      className: "bg-gradient-to-r from-[#16A34A] to-[#16A34A]/90 text-white border border-[#16A34A]/20 shadow-sm",
      iconColor: "text-[#16A34A]",
    },
    event: {
      label: "Event",
      className: "bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 text-white border border-[#FF9C04]/20 shadow-sm",
      iconColor: "text-[#FF9C04]",
    },
    lainnya: {
      label: "Lainnya",
      className: "bg-gradient-to-r from-[#6B7280] to-[#6B7280]/90 text-white border border-[#6B7280]/20 shadow-sm",
      iconColor: "text-[#6B7280]",
    },
  };

  const breadcrumbs = [{ label: "Dashboard", href: "/" }, { label: "Galeri" }];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        {/* Modern Header Section */}
        <div className="bg-gradient-to-br from-[#FFFFFF] via-[#F0F0F0]/30 to-[#FF9C04]/5 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-2xl shadow-lg">
                  <ImageIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#001B55] leading-tight">
                    Kelola Galeri Media
                  </h1>
                  <p className="text-[#6B7280] mt-1">
                    Upload, organisir, dan kelola koleksi foto & video terbaru
                  </p>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-[#FFFFFF] rounded-2xl px-4 py-3 border border-gray-200/50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#FF9C04] rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-[#001B55]">{totalItems} Media</span>
                  </div>
                </div>
                <div className="bg-[#FFFFFF] rounded-2xl px-4 py-3 border border-gray-200/50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-[#001B55]">{galleryItems.reduce((sum, item) => sum + item.views, 0)} Views</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="bg-white border-2 border-[#001B55]/30 text-[#001B55] shadow-sm transition-all duration-300 hover:!bg-[#001B55] hover:!text-white hover:!border-[#001B55] hover:shadow-md group"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                <span className="flex items-center transition-colors duration-300 group-hover:text-white">
                  {viewMode === "grid" ? (
                    <List className="w-4 h-4 mr-2 transition-colors duration-300 group-hover:text-white" />
                  ) : (
                    <Grid3X3 className="w-4 h-4 mr-2 transition-colors duration-300 group-hover:text-white" />
                  )}
                  {viewMode === "grid" ? "List View" : "Grid View"}
                </span>
              </Button>
              <Button
                className="bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                onClick={() => router.push("/admin/gallery/upload")}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Media
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <Card className="bg-[#FFFFFF] border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]">
                  <Search className="h-5 w-5" />
                </div>
                <Input
                  placeholder="Cari judul, deskripsi, atau tag media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 border-2 border-gray-300/70 hover:border-[#FF9C04]/50 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 rounded-2xl bg-white transition-all duration-300 text-[#001B55] placeholder:text-[#6B7280] shadow-sm"
                />
              </div>
              
              {/* Filter Section */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-[#6B7280]" />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="min-w-[200px] border-2 border-gray-300/70 hover:border-[#FF9C04]/50 focus:border-[#FF9C04] rounded-2xl bg-white transition-all duration-300 shadow-sm">
                      <SelectValue placeholder="Filter kategori" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-gray-200/50 shadow-xl">
                      <SelectItem value="all" className="rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                          Semua Kategori
                        </div>
                      </SelectItem>
                      <SelectItem value="kegiatan" className="rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#001B55]"></div>
                          Kegiatan
                        </div>
                      </SelectItem>
                      <SelectItem value="dokumentasi" className="rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#16A34A]"></div>
                          Dokumentasi
                        </div>
                      </SelectItem>
                      <SelectItem value="event" className="rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#FF9C04]"></div>
                          Event
                        </div>
                      </SelectItem>
                      <SelectItem value="lainnya" className="rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#6B7280]"></div>
                          Lainnya
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Quick Filter Tags */}
            {searchTerm || categoryFilter !== "all" ? (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200/50">
                {searchTerm && (
                  <Badge 
                    variant="secondary" 
                    className="bg-[#FF9C04]/10 text-[#FF9C04] border border-[#FF9C04]/20 px-3 py-1 rounded-full"
                  >
                    Search: "{searchTerm}"
                  </Badge>
                )}
                {categoryFilter !== "all" && (
                  <Badge 
                    variant="secondary"
                    className="bg-[#001B55]/10 text-[#001B55] border border-[#001B55]/20 px-3 py-1 rounded-full"
                  >
                    Category: {categoryConfig[categoryFilter as keyof typeof categoryConfig]?.label}
                  </Badge>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Enhanced Gallery Grid/List */}
        {paginatedItems.length > 0 ? (
          <>
            <div className={`${
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
            }`}>
              {paginatedItems.map((item) => (
                <Card
                  key={item.id}
                  className={`bg-white border border-gray-200/50 shadow-sm hover:shadow-xl hover:border-[#FF9C04]/30 transition-all duration-300 overflow-hidden group cursor-pointer ${
                    viewMode === "list" ? "flex flex-row h-auto min-h-[280px]" : ""
                  } rounded-3xl`}
                  onClick={() => router.push(`/admin/gallery/${item.id}`)}
                >
                  <div
                    className={`relative bg-gradient-to-br from-[#F0F0F0] to-gray-100 flex items-center justify-center overflow-hidden group-hover:bg-gradient-to-br group-hover:from-[#001B55]/20 group-hover:to-[#FF9C04]/20 transition-all duration-300 ${
                      viewMode === "list"
                        ? "w-80 h-auto flex-shrink-0 min-h-[200px] rounded-l-2xl"
                        : "aspect-[4/3]"
                    }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#001B55]/5 to-[#FF9C04]/5"></div>
                    <Camera className="h-12 w-12 text-[#6B7280]/40 relative z-10" />
                    
                    {/* Enhanced Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-20" />
                    
                    {/* Action Buttons on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-full w-10 h-10 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view action
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-full w-10 h-10 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit action
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-full w-10 h-10 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle download action
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Views Counter */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium flex items-center gap-1 z-20">
                      <Eye className="h-3 w-3" />
                      {item.views.toLocaleString()}
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-20">
                      <Badge className={`${categoryConfig[item.category].className} text-xs font-semibold px-3 py-1 rounded-full`}>
                        {categoryConfig[item.category].label}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className={`${viewMode === "list" ? "flex-1 p-6 flex flex-col justify-between min-w-0" : "p-5"}`}>
                    {viewMode === "list" ? (
                      <div className="space-y-4 flex-1">
                        {/* Header with Action Menu */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-[#001B55] text-lg leading-tight mb-2 group-hover:text-[#FF9C04] transition-colors duration-300">
                              {item.title}
                            </h3>
                            <Badge className={`${categoryConfig[item.category].className} text-xs font-semibold px-3 py-1 rounded-full inline-block`}>
                              {categoryConfig[item.category].label}
                            </Badge>
                          </div>
                          
                          {/* Dropdown Menu - Always Visible and Clickable */}
                          <div className="flex-shrink-0">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full border border-gray-200/60 hover:border-gray-300 transition-all duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <MoreVertical className="h-4 w-4 text-[#6B7280]" />
                                  <span className="sr-only">Menu aksi</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-gray-200/60">
                                <DropdownMenuItem 
                                  className="flex items-center gap-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                                  onClick={() => router.push(`/admin/gallery/${item.id}`)}
                                >
                                  <Eye className="h-4 w-4 text-[#001B55]" />
                                  <span>Lihat Detail</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="flex items-center gap-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                                  onClick={() => router.push(`/admin/gallery/edit/${item.id}`)}
                                >
                                  <Edit className="h-4 w-4 text-[#FF9C04]" />
                                  <span>Edit Media</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="flex items-center gap-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                                  onClick={() => {
                                    // Handle download
                                    console.log('Download:', item.id);
                                  }}
                                >
                                  <Download className="h-4 w-4 text-[#16A34A]" />
                                  <span>Download</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        {/* Full Description - No truncation */}
                        <p className="text-sm text-[#6B7280] leading-relaxed">
                          {item.description}
                        </p>
                        
                        {/* Full Metadata Display */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#6B7280]">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#FF9C04] flex-shrink-0" />
                              <span className="font-medium">Tanggal Upload:</span>
                              <span>{new Date(item.uploadDate).toLocaleDateString("id-ID", { 
                                day: "numeric", 
                                month: "long", 
                                year: "numeric" 
                              })}</span>
                            </div>
                            
                            {item.photographer && (
                              <div className="flex items-center gap-2">
                                <Camera className="h-4 w-4 text-[#001B55] flex-shrink-0" />
                                <span className="font-medium">Uploader:</span>
                                <span className="truncate">{item.photographer}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-[#16A34A] flex-shrink-0" />
                              <span className="font-medium">Views:</span>
                              <span>{item.views.toLocaleString()} kali dilihat</span>
                            </div>
                          </div>
                          
                          {/* Tags - Full Display */}
                          {item.tags.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-sm font-medium text-[#001B55]">Tags:</span>
                              <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs bg-[#F0F0F0] text-[#6B7280] px-3 py-1.5 rounded-full font-medium hover:bg-[#FF9C04]/10 hover:text-[#FF9C04] transition-colors duration-200 cursor-pointer"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Grid View Content (unchanged) */}
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-[#001B55] text-base leading-tight line-clamp-2 group-hover:text-[#FF9C04] transition-colors duration-300">
                            {item.title}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full w-8 h-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-gray-200/60">
                              <DropdownMenuItem 
                                className="flex items-center gap-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                                onClick={() => router.push(`/admin/gallery/${item.id}`)}
                              >
                                <Eye className="h-4 w-4 text-[#001B55]" />
                                <span>Lihat Detail</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center gap-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                                onClick={() => router.push(`/admin/gallery/edit/${item.id}`)}
                              >
                                <Edit className="h-4 w-4 text-[#FF9C04]" />
                                <span>Edit Media</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center gap-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                  // Handle download
                                  console.log('Download:', item.id);
                                }}
                              >
                                <Download className="h-4 w-4 text-[#16A34A]" />
                                <span>Download</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <p className="text-sm text-[#6B7280] line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-[#6B7280]">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(item.uploadDate).toLocaleDateString("id-ID", { 
                              day: "numeric", 
                              month: "short", 
                              year: "numeric" 
                            })}</span>
                          </div>
                          {item.photographer && (
                            <div className="flex items-center gap-2">
                              <Camera className="h-3 w-3" />
                              <span className="truncate max-w-[120px]">{item.photographer}</span>
                            </div>
                          )}
                        </div>
                        
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-[#F0F0F0] text-[#6B7280] px-2 py-1 rounded-full font-medium hover:bg-[#FF9C04]/10 hover:text-[#FF9C04] transition-colors duration-200"
                              >
                                #{tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="text-xs text-[#6B7280] px-2 py-1 font-medium">
                                +{item.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enhanced Modern Pagination */}
            {totalItems > 0 && totalPages > 1 && (
              <div className="bg-[#FFFFFF] border border-gray-200/50 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-sm text-[#6B7280] font-medium">
                    Menampilkan <span className="text-[#001B55] font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="text-[#001B55] font-bold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span className="text-[#001B55] font-bold">{totalItems}</span> media
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border border-gray-200/50 hover:border-[#FF9C04] hover:bg-[#FF9C04]/5 hover:text-[#FF9C04] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-2 transition-all duration-300"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let page: number;
                        if (totalPages <= 7) {
                          page = i + 1;
                        } else if (currentPage <= 4) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                          page = totalPages - 6 + i;
                        } else {
                          page = currentPage - 3 + i;
                        }
                        
                        return page > 0 && page <= totalPages ? (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`min-w-[40px] h-10 rounded-xl font-semibold transition-all duration-300 ${
                              page === currentPage
                                ? "bg-gradient-to-r from-[#001B55] to-[#001B55]/90 border-[#001B55] text-white shadow-lg"
                                : "border border-gray-200/50 hover:border-[#FF9C04] hover:bg-[#FF9C04]/5 hover:text-[#FF9C04] text-[#6B7280]"
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
                      className="border border-gray-200/50 hover:border-[#FF9C04] hover:bg-[#FF9C04]/5 hover:text-[#FF9C04] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-2 transition-all duration-300"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <Card className="bg-gradient-to-br from-[#FFFFFF] via-[#F0F0F0]/30 to-[#FF9C04]/5 border border-gray-200/50 hover:border-[#FF9C04]/30 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="max-w-md mx-auto space-y-6">
                {/* Animated Icon */}
                <div className="relative">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#FF9C04]/10 to-[#001B55]/10 rounded-3xl flex items-center justify-center border border-gray-200/50">
                    <ImageIcon className="h-12 w-12 text-[#6B7280]/60" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#001B55]">Galeri Media Kosong</h3>
                  <p className="text-[#6B7280] leading-relaxed">
                    Belum ada media yang diunggah. Mulai membangun koleksi galeri Anda dengan mengupload foto dan video pertama.
                  </p>
                </div>
                
                {/* CTA Button */}
                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-8 py-3 rounded-2xl"
                    onClick={() => router.push("/admin/gallery/upload")}
                  >
                    <Upload className="w-5 h-5 mr-3" />
                    Upload Media Pertama
                  </Button>
                  
                  {/* Quick Stats */}
                  <div className="flex items-center justify-center gap-6 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#16A34A] rounded-full"></div>
                      <span>Foto & Video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#FF9C04] rounded-full"></div>
                      <span>Organisasi Otomatis</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
