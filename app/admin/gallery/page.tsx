"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Search,
  Calendar,
  Eye,
  Camera,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Heart,
  Share2,
  Download,
  Edit,
  X,
  Loader2,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminLayout } from "../components/layout/AdminLayout";
import { PageHeader } from "../components/ui/PageHeader";
import { ContentCard } from "../components/ui/ContentCard";
import { ActionButton } from "../components/ui/ActionButton";

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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const itemsPerPage = 12;
  const router = useRouter();

  // Upload form state
  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    description: "",
    category: "kegiatan" as GalleryItem["category"],
    photographer: "",
    location: "",
    tags: "",
    selectedFiles: [] as File[],
  });
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      toast.warning("Peringatan", {
        description: "Hanya file gambar yang diizinkan",
      });
    }

    setUploadFormData((prev) => ({ ...prev, selectedFiles: imageFiles }));
  };

  const handleUpload = async () => {
    if (!uploadFormData.title || uploadFormData.selectedFiles.length === 0) {
      toast.error("Error", {
        description: "Judul dan minimal 1 gambar wajib diisi",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newItems: GalleryItem[] = uploadFormData.selectedFiles.map(
        (file, index) => ({
          id: `${Date.now()}-${index}`,
          title:
            uploadFormData.selectedFiles.length > 1
              ? `${uploadFormData.title} ${index + 1}`
              : uploadFormData.title,
          description: uploadFormData.description,
          category: uploadFormData.category,
          image: URL.createObjectURL(file),
          uploadDate: new Date().toISOString().split("T")[0],
          photographer: uploadFormData.photographer,
          location: uploadFormData.location,
          tags: uploadFormData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          views: 0,
        })
      );

      setGalleryItems((prev) => [...newItems, ...prev]);

      toast.success("Berhasil", {
        description: `${uploadFormData.selectedFiles.length} gambar berhasil diupload`,
      });

      // Reset form
      setUploadFormData({
        title: "",
        description: "",
        category: "kegiatan",
        photographer: "",
        location: "",
        tags: "",
        selectedFiles: [],
      });
      setIsUploadModalOpen(false);
    } catch (error) {
      toast.error("Gagal", {
        description: "Terjadi kesalahan saat mengupload gambar",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDetailModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleEditModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const categoryConfig = {
    kegiatan: {
      label: "Kegiatan",
      className: "border border-[#001B55]/20 bg-[#001B55] text-white shadow-sm",
      iconColor: "text-[#001B55]",
    },
    dokumentasi: {
      label: "Dokumentasi", 
      className: "border border-emerald-500/20 bg-emerald-500 text-white shadow-sm",
      iconColor: "text-emerald-500",
    },
    event: {
      label: "Event",
      className: "border border-[#001B55]/20 bg-white text-[#001B55] shadow-sm",
      iconColor: "text-[#001B55]",
    },
    lainnya: {
      label: "Lainnya",
      className: "border border-gray-500/20 bg-gray-500 text-white shadow-sm",
      iconColor: "text-gray-500",
    },
  };

  const breadcrumbs = [{ label: "Dashboard", href: "/" }, { label: "Galeri" }];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        {/* Modern Header Section */}
        <div className="bg-white border border-[#001B55]/10 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#001B55] rounded-2xl shadow-lg">
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
                    <div className="w-2 h-2 bg-[#001B55] rounded-full animate-pulse"></div>
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
                className="bg-[#001B55] hover:bg-[#001B55]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                onClick={() => setIsUploadModalOpen(true)}
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
                  className="pl-12 pr-4 py-3 border-2 border-gray-300/70 hover:border-[#001B55]/50 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 rounded-2xl bg-white transition-all duration-300 text-[#001B55] placeholder:text-[#6B7280] shadow-sm"
                />
              </div>
              
              {/* Filter Section */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-[#6B7280]" />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="min-w-[200px] border-2 border-gray-300/70 hover:border-[#001B55]/50 focus:border-[#001B55] rounded-2xl bg-white transition-all duration-300 shadow-sm">
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
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          Dokumentasi
                        </div>
                      </SelectItem>
                      <SelectItem value="event" className="rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#001B55]"></div>
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
                    className="bg-[#001B55]/10 text-[#001B55] border border-[#001B55]/20 px-3 py-1 rounded-full"
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
                  className={`bg-white border border-gray-200/50 shadow-sm hover:shadow-xl hover:border-[#001B55]/30 transition-all duration-300 overflow-hidden group cursor-pointer ${
                    viewMode === "list" ? "flex flex-row h-auto min-h-[280px]" : ""
                  } rounded-3xl`}
                  onClick={() => handleDetailModal(item)}
                >
                  <div
                    className={`relative bg-gray-100 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                      viewMode === "list"
                        ? "w-80 h-auto flex-shrink-0 min-h-[200px] rounded-l-2xl"
                        : "aspect-[4/3]"
                    }`}>

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
                            handleDetailModal(item);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-full w-10 h-10 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditModal(item);
                          }}
                        >
                          <Edit className="h-4 w-4" />
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
                            <h3 className="font-bold text-[#001B55] text-lg leading-tight mb-2 group-hover:text-[#001B55]/80 transition-colors duration-300">
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
                                  onClick={() => handleDetailModal(item)}
                                >
                                  <Eye className="h-4 w-4 text-[#001B55]" />
                                  <span>Lihat Detail</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                                  onClick={() => handleEditModal(item)}
                                >
                                  <Edit className="h-4 w-4 text-[#001B55]" />
                                  <span>Edit Media</span>
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
                              <Calendar className="h-4 w-4 text-[#001B55] flex-shrink-0" />
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
                                    className="text-xs bg-[#F0F0F0] text-[#6B7280] px-3 py-1.5 rounded-full font-medium hover:bg-[#001B55]/10 hover:text-[#001B55] transition-colors duration-200 cursor-pointer"
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
                          <h3 className="font-bold text-[#001B55] text-base leading-tight line-clamp-2 group-hover:text-[#001B55]/80 transition-colors duration-300">
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
                                onClick={() => handleDetailModal(item)}
                              >
                                <Eye className="h-4 w-4 text-[#001B55]" />
                                <span>Lihat Detail</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-3 rounded-xl hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleEditModal(item)}
                              >
                                <Edit className="h-4 w-4 text-[#001B55]" />
                                <span>Edit Media</span>
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
                                className="text-xs bg-[#F0F0F0] text-[#6B7280] px-2 py-1 rounded-full font-medium hover:bg-[#001B55]/10 hover:text-[#001B55] transition-colors duration-200"
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
                      className="border border-gray-200/50 hover:border-[#001B55] hover:bg-[#001B55]/5 hover:text-[#001B55] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-2 transition-all duration-300"
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
                                ? "bg-[#001B55] border-[#001B55] text-white shadow-lg"
                                : "border border-gray-200/50 hover:border-[#001B55] hover:bg-[#001B55]/5 hover:text-[#001B55] text-[#6B7280]"
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
                      className="border border-gray-200/50 hover:border-[#001B55] hover:bg-[#001B55]/5 hover:text-[#001B55] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-2 transition-all duration-300"
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
          <Card className="bg-white border border-[#001B55]/10 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl overflow-hidden">
            <CardContent className="p-16 text-center">
              <div className="max-w-md mx-auto space-y-6">
                {/* Animated Icon */}
                <div className="relative">
                  <div className="w-24 h-24 mx-auto bg-[#001B55]/10 rounded-3xl flex items-center justify-center border border-[#001B55]/20">
                    <ImageIcon className="h-12 w-12 text-[#6B7280]/60" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#001B55] rounded-full flex items-center justify-center shadow-lg animate-bounce">
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
                    className="bg-[#001B55] hover:bg-[#001B55]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-8 py-3 rounded-2xl"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <Upload className="w-5 h-5 mr-3" />
                    Upload Media Pertama
                  </Button>
                  
                  {/* Quick Stats */}
                  <div className="flex items-center justify-center gap-6 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>Foto & Video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#001B55] rounded-full"></div>
                      <span>Organisasi Otomatis</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Modal */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#001B55]" />
                Upload Media Baru
              </DialogTitle>
              <DialogDescription>
                Upload foto atau video untuk kegiatan partai
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* File Upload */}
              <div>
                <Label htmlFor="files">Pilih Media *</Label>
                <div className="mt-2">
                  <input
                    id="files"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="files"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">
                          Klik untuk upload
                        </span>{" "}
                        atau drag & drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG, MP4 (MAX. 10MB per file)
                      </p>
                    </div>
                  </label>
                </div>

                {uploadFormData.selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      {uploadFormData.selectedFiles.length} file terpilih:
                    </p>
                    <div className="text-sm text-gray-600 max-h-20 overflow-y-auto">
                      {uploadFormData.selectedFiles.map((file, index) => (
                        <div key={index} className="truncate">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Judul Kegiatan *</Label>
                  <Input
                    id="title"
                    value={uploadFormData.title}
                    onChange={(e) =>
                      setUploadFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Masukkan judul kegiatan"
                    className="border-2 border-gray-200 hover:border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={uploadFormData.category}
                    onValueChange={(value) =>
                      setUploadFormData((prev) => ({
                        ...prev,
                        category: value as any,
                      }))
                    }
                  >
                    <SelectTrigger className="border-2 border-gray-200 hover:border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kegiatan">Kegiatan</SelectItem>
                      <SelectItem value="dokumentasi">Dokumentasi</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="photographer">Fotografer</Label>
                  <Input
                    id="photographer"
                    value={uploadFormData.photographer}
                    onChange={(e) =>
                      setUploadFormData((prev) => ({
                        ...prev,
                        photographer: e.target.value,
                      }))
                    }
                    placeholder="Nama fotografer"
                    className="border-2 border-gray-200 hover:border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    value={uploadFormData.location}
                    onChange={(e) =>
                      setUploadFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Lokasi pengambilan foto"
                    className="border-2 border-gray-200 hover:border-gray-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Deskripsi Singkat</Label>
                  <Textarea
                    id="description"
                    value={uploadFormData.description}
                    onChange={(e) =>
                      setUploadFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Deskripsi singkat kegiatan"
                    className="border-2 border-gray-200 hover:border-gray-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={uploadFormData.tags}
                    onChange={(e) =>
                      setUploadFormData((prev) => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                    placeholder="Pisahkan dengan koma, contoh: rapat, dpd, 2024"
                    className="border-2 border-gray-200 hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsUploadModalOpen(false)}
                disabled={isUploading}
              >
                Batal
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengupload...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#001B55]" />
                Detail Media
              </DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-4 py-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <Camera className="h-12 w-12 text-gray-400 m-auto" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Judul</Label>
                    <p className="mt-1 text-sm">{selectedItem.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Kategori</Label>
                    <p className="mt-1 text-sm">{categoryConfig[selectedItem.category].label}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tanggal Upload</Label>
                    <p className="mt-1 text-sm">{selectedItem.uploadDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Fotografer</Label>
                    <p className="mt-1 text-sm">{selectedItem.photographer || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Lokasi</Label>
                    <p className="mt-1 text-sm">{selectedItem.location || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Views</Label>
                    <p className="mt-1 text-sm">{selectedItem.views.toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Deskripsi</Label>
                  <p className="mt-1 text-sm">{selectedItem.description}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Tutup
              </Button>
              <Button onClick={() => {
                setIsDetailModalOpen(false);
                handleEditModal(selectedItem!);
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-[#001B55]" />
                Edit Media
              </DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-title">Judul</Label>
                    <Input
                      id="edit-title"
                      defaultValue={selectedItem.title}
                      className="border-2 border-gray-200 hover:border-gray-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-category">Kategori</Label>
                    <Select defaultValue={selectedItem.category}>
                      <SelectTrigger className="border-2 border-gray-200 hover:border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kegiatan">Kegiatan</SelectItem>
                        <SelectItem value="dokumentasi">Dokumentasi</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-photographer">Fotografer</Label>
                    <Input
                      id="edit-photographer"
                      defaultValue={selectedItem.photographer || ""}
                      className="border-2 border-gray-200 hover:border-gray-300"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-location">Lokasi</Label>
                    <Input
                      id="edit-location"
                      defaultValue={selectedItem.location || ""}
                      className="border-2 border-gray-200 hover:border-gray-300"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="edit-description">Deskripsi</Label>
                    <Textarea
                      id="edit-description"
                      defaultValue={selectedItem.description}
                      className="border-2 border-gray-200 hover:border-gray-300"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="edit-tags">Tags</Label>
                    <Input
                      id="edit-tags"
                      defaultValue={selectedItem.tags.join(", ")}
                      className="border-2 border-gray-200 hover:border-gray-300"
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Batal
              </Button>
              <Button onClick={() => {
                toast.success("Berhasil", {
                  description: "Media berhasil diperbarui",
                });
                setIsEditModalOpen(false);
              }}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
