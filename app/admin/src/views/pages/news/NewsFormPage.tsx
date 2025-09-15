"use client";
import { useState } from "react";
import { AdminLayout } from "../../../components/layout/AdminLayout";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { FileText, Save, Eye, ArrowLeft, Calendar, Image, Plus, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export function NewsFormPage() {
  const router = useRouter();
  const params = useParams<{ type?: string }>();
  const type = params?.type;
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "Admin",
    publishDate: new Date().toISOString().split('T')[0],
    status: "DRAFT",
    category: "Kegiatan",
    featured: false,
    image: null as File | null,
    imageUrl: "",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file,
        imageUrl: URL.createObjectURL(file)
      }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imageUrl: ""
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Submitting news:", formData);
    
    // Show success message
    alert("Berita berhasil disimpan!");
    
    // Navigate back to news list
    router.push("/news");
  };

  const handlePreview = () => {
    // Simulate preview functionality
    alert("Pratinjau berita");
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Berita", href: "/news" },
    { label: type === "new" ? "Tulis Berita" : "Edit Berita" }
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push("/news")}
                className="border-2 border-gray-200 hover:border-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {type === "new" ? "Tulis Berita Baru" : "Edit Berita"}
                </h1>
                <p className="text-muted-foreground">
                  {type === "new" ? "Buat dan publikasi artikel berita" : "Edit artikel berita"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handlePreview}
                className="border-2 border-gray-200 hover:border-gray-300"
              >
                <Eye className="mr-2 h-4 w-4" />
                Pratinjau
              </Button>
              <Button 
                className="bg-[#FF9C04] hover:bg-[#001B55] text-white border-2 border-[#FF9C04] hover:border-[#001B55] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleSubmit}
              >
                <Save className="mr-2 h-4 w-4" />
                Simpan
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-gray-300/80 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Judul Berita *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Masukkan judul berita"
                      className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Ringkasan *</label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      placeholder="Masukkan ringkasan berita"
                      className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Konten Berita *</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      placeholder="Tulis konten berita di sini..."
                      className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary min-h-[300px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-gray-300/80 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Publikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal Publikasi</label>
                  <Input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => handleInputChange("publishDate", e.target.value)}
                    className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori</label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Dokumentasi">Dokumentasi</SelectItem>
                      <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">Featured</label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      checked={formData.featured}
                      onChange={(e) => handleInputChange("featured", e.target.checked)}
                      className="sr-only"
                      id="featured-toggle"
                    />
                    <label 
                      htmlFor="featured-toggle" 
                      className={`block h-6 w-10 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                        formData.featured ? 'bg-[#FF9C04]' : 'bg-gray-300'
                      }`}
                    >
                      <span 
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          formData.featured ? 'transform translate-x-4' : ''
                        }`}
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-gray-300/80 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Gambar Utama
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                {formData.imageUrl ? (
                  <div className="relative">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white border-2 border-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-3">Upload gambar utama berita</p>
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF9C04] hover:bg-[#FF9C04]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9C04]">
                        <Plus className="mr-2 h-4 w-4" />
                        Pilih Gambar
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-2">Penulis</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    placeholder="Nama penulis"
                    className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
