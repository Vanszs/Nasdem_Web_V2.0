"use client";

import { AdminLayout } from "../layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Images, Upload, Plus, Calendar, Eye, Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
}

// Dummy data
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
  },
];

export function GalleryUploadPage() {
  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>(mockGalleryItems);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "kegiatan" as GalleryItem["category"],
    photographer: "",
    location: "",
    tags: "",
    selectedFiles: [] as File[],
  });

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    { label: "Galeri", href: "/admin/gallery" },
    { label: "Upload Media" },
  ];

  const filteredItems = galleryItems.filter(
    (item) => categoryFilter === "all" || item.category === categoryFilter
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      toast.warning("Peringatan", {
        description: "Hanya file gambar yang diizinkan",
      });
    }

    setFormData((prev) => ({ ...prev, selectedFiles: imageFiles }));
  };

  const handleUpload = () => {
    if (!formData.title || formData.selectedFiles.length === 0) {
      toast.error("Error", {
        description: "Judul dan minimal 1 gambar wajib diisi",
      });
      return;
    }

    // Simulate upload
    const newItems: GalleryItem[] = formData.selectedFiles.map(
      (file, index) => ({
        id: `${Date.now()}-${index}`,
        title:
          formData.selectedFiles.length > 1
            ? `${formData.title} ${index + 1}`
            : formData.title,
        description: formData.description,
        category: formData.category,
        image: URL.createObjectURL(file),
        uploadDate: new Date().toISOString().split("T")[0],
        photographer: formData.photographer,
        location: formData.location,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      })
    );

    setGalleryItems((prev) => [...newItems, ...prev]);

    toast.success("Berhasil", {
      description: `${formData.selectedFiles.length} gambar berhasil diupload`,
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "kegiatan",
      photographer: "",
      location: "",
      tags: "",
      selectedFiles: [],
    });
    setIsUploadOpen(false);
  };

  const categoryConfig = {
    kegiatan: {
      label: "Kegiatan",
      className: "text-white border-2",
      style: {
        backgroundColor: "var(--color-primary)",
        borderColor: "var(--color-primary)",
      },
    },
    dokumentasi: {
      label: "Dokumentasi",
      className: "text-white border-2",
      style: {
        backgroundColor: "var(--color-success)",
        borderColor: "var(--color-success)",
      },
    },
    event: {
      label: "Event",
      className: "text-white border-2",
      style: {
        backgroundColor: "var(--color-info)",
        borderColor: "var(--color-info)",
      },
    },
    lainnya: {
      label: "Lainnya",
      className: "text-white border-2",
      style: {
        backgroundColor: "var(--color-muted)",
        borderColor: "var(--color-muted)",
      },
    },
  };

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header Section */}
        <div
          className="backdrop-blur-sm border-2 border-gray-300/80 rounded-2xl p-6 shadow-lg"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                Galeri Media
              </h1>
              <p style={{ color: "var(--color-muted)" }}>
                Kelola foto dan dokumentasi kegiatan partai
              </p>
            </div>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                    border: "2px solid var(--color-accent)",
                    borderRadius: "0.75rem",
                  }}
                  className="hover:opacity-90 focus-ring transition-all duration-300 font-medium"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Media
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl border-2 border-gray-300/80">
                <DialogHeader>
                  <DialogTitle>Upload Foto Baru</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* File Upload */}
                  <div>
                    <Label htmlFor="files">Pilih Foto *</Label>
                    <div className="mt-2">
                      <input
                        id="files"
                        type="file"
                        multiple
                        accept="image/*"
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
                            PNG, JPG, JPEG (MAX. 5MB per file)
                          </p>
                        </div>
                      </label>
                    </div>

                    {formData.selectedFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          {formData.selectedFiles.length} file terpilih:
                        </p>
                        <div className="text-sm text-gray-600">
                          {formData.selectedFiles.map((file, index) => (
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
                      <Label htmlFor="title">Judul Foto *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Masukkan judul foto"
                        className="border-2 border-gray-200 hover:border-gray-300"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
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
                          <SelectItem value="dokumentasi">
                            Dokumentasi
                          </SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="photographer">Fotografer</Label>
                      <Input
                        id="photographer"
                        value={formData.photographer}
                        onChange={(e) =>
                          setFormData((prev) => ({
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
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="Lokasi pengambilan foto"
                        className="border-2 border-gray-200 hover:border-gray-300"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Deskripsi foto atau kegiatan"
                        className="border-2 border-gray-200 hover:border-gray-300"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData((prev) => ({
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

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleUpload}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card
            className="border-2 border-gray-300/80 shadow-lg"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <CardContent className="p-4">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {galleryItems.length}
              </div>
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                Total Foto
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-gray-300/80 shadow-lg"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <CardContent className="p-4">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {galleryItems.filter((i) => i.category === "kegiatan").length}
              </div>
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                Kegiatan
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-gray-300/80 shadow-lg"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <CardContent className="p-4">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--color-info)" }}
              >
                {galleryItems.filter((i) => i.category === "event").length}
              </div>
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                Event
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-gray-300/80 shadow-lg"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <CardContent className="p-4">
              <div
                className="text-2xl font-bold"
                style={{ color: "var(--color-success)" }}
              >
                {
                  galleryItems.filter((i) => i.category === "dokumentasi")
                    .length
                }
              </div>
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                Dokumentasi
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="border-2 border-gray-300/80 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Images className="h-5 w-5" />
                Galeri Foto ({filteredItems.length})
              </CardTitle>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] border-2 border-gray-200 hover:border-gray-300">
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
          </CardHeader>
          <CardContent>
            {paginatedItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedItems.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-primary/50 transition-all duration-300 bg-white shadow-md hover:shadow-lg">
                        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                          <Camera className="h-12 w-12 text-gray-400" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center gap-1 text-sm">
                              <Eye className="h-4 w-4" />
                              Lihat Detail
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              className={
                                categoryConfig[item.category].className
                              }
                              style={categoryConfig[item.category].style}
                            >
                              {categoryConfig[item.category].label}
                            </Badge>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.uploadDate).toLocaleDateString(
                                "id-ID"
                              )}
                            </div>
                          </div>
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {item.description}
                          </p>
                          {item.photographer && (
                            <p className="text-xs text-muted-foreground">
                              📸 {item.photographer}
                            </p>
                          )}
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{item.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="border-2 border-gray-200 hover:border-gray-300"
                    >
                      Sebelumnya
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="border-2 border-gray-200 hover:border-gray-300 min-w-[2.5rem]"
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="border-2 border-gray-200 hover:border-gray-300"
                    >
                      Selanjutnya
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Images className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Belum ada foto</h3>
                <p className="text-muted-foreground mb-4">
                  Upload foto pertama untuk memulai galeri
                </p>
                <Button onClick={() => setIsUploadOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Foto
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
