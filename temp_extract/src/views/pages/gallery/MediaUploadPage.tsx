"use client";
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, Eye, ArrowLeft, Image, Plus, X, MapPin, Camera, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

export function MediaUploadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "kegiatan",
    photographer: "",
    location: "",
    tags: [] as string[],
    currentTag: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const previews = files.map(file => URL.createObjectURL(file));
      
      setImageFiles(prev => [...prev, ...files]);
      setImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleAddTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ""
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Submitting media:", formData, imageFiles);
    
    // Show success message
    alert("Media berhasil diupload!");
    
    // Navigate back to gallery
    router.push("/gallery");
  };

  const handlePreview = () => {
    // Simulate preview functionality
    alert("Pratinjau media");
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Galeri", href: "/gallery" },
    { label: "Upload Media" }
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
                onClick={() => router.push("/gallery")}
                className="border-2 border-gray-200 hover:border-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Upload Media</h1>
                <p className="text-muted-foreground">Upload dan organisir foto dan media</p>
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
                className="bg-brand-accent border-2 border-brand-accent/20 hover:border-brand-accent/40 transition-all duration-300"
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
                    <label className="block text-sm font-medium mb-2">Judul Media *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Masukkan judul media"
                      className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Deskripsi *</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Masukkan deskripsi media"
                      className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Foto *</label>
                    {imagePreviews.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={preview} 
                                alt={`Preview ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white border-2 border-gray-200"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                          <label className="cursor-pointer">
                            <div className="flex flex-col items-center justify-center">
                              <Plus className="h-8 w-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600">Tambah Foto</span>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <Image className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-3">Upload foto untuk galeri</p>
                        <label className="cursor-pointer">
                          <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-accent hover:bg-brand-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent">
                            <Upload className="mr-2 h-4 w-4" />
                            Pilih Foto
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    )}
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
                  <Image className="h-5 w-5" />
                  Informasi Media
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori</label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary">
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
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Fotografer
                  </label>
                  <Input
                    value={formData.photographer}
                    onChange={(e) => handleInputChange("photographer", e.target.value)}
                    placeholder="Nama fotografer"
                    className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Lokasi
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Lokasi foto diambil"
                    className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tag
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.currentTag}
                      onChange={(e) => handleInputChange("currentTag", e.target.value)}
                      placeholder="Tambah tag"
                      className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button 
                      variant="outline"
                      onClick={handleAddTag}
                      className="border-2 border-gray-200 hover:border-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
