"use client";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Upload,
  Image,
  Target,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  Home,
} from "lucide-react";
import { useState } from "react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { toast } from "sonner";

// Types
interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
}

interface AboutSection {
  id: string;
  imageUrl: string;
  vision: string;
  mission: string;
}

interface ContactInfo {
  id: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  officeHours: string;
  maps: {
    embedCode: string;
    title: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export default function Landing() {
  // State
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([
    {
      id: "1",
      title: "Selamat Datang di DPD NasDem Sidoarjo",
      subtitle: "Bersama membangun Sidoarjo yang lebih baik",
      imageUrl: "/api/placeholder/800/400",
      buttonText: "Pelajari Lebih Lanjut",
      buttonLink: "/about",
      isActive: true,
      order: 1,
    },
    {
      id: "2",
      title: "Komitmen Untuk Rakyat",
      subtitle: "Mewujudkan pemerintahan yang bersih dan transparan",
      imageUrl: "/api/placeholder/800/400",
      buttonText: "Bergabung",
      buttonLink: "/join",
      isActive: true,
      order: 2,
    },
  ]);

  const [aboutSection, setAboutSection] = useState<AboutSection>({
    id: "1",
    imageUrl: "/api/placeholder/600/400",
    vision:
      "Mewujudkan Sidoarjo sebagai daerah yang maju, demokratis, dan berkeadilan sosial melalui gerakan perubahan yang berkelanjutan.",
    mission:
      "Membangun kaderitas yang kuat, melayani masyarakat dengan integritas, dan mengadvokasi kebijakan pro-rakyat.",
  });



  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    id: "1",
    address: "Jl. Raya Sidoarjo No. 123, Sidoarjo, Jawa Timur",
    phone: "+62 31 1234567",
    email: "dpd.sidoarjo@nasdem.id",
    socialMedia: {
      facebook: "https://facebook.com/nasdemsidoarjo",
      instagram: "https://instagram.com/nasdemsidoarjo",
      twitter: "https://twitter.com/nasdemsidoarjo",
      youtube: "https://youtube.com/c/nasdemsidoarjo",
    },
    officeHours: "Senin - Jumat: 08:00 - 16:00 WIB",
    maps: {
      embedCode:
        '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.9..."></iframe>',
      title: "Lokasi Kantor DPD NasDem Sidoarjo",
      coordinates: {
        lat: -7.3434,
        lng: 112.7183,
      },
    },
  });

  // Form states
  const [heroBannerForm, setHeroBannerForm] = useState<Partial<HeroBanner>>({});
  const [aboutForm, setAboutForm] = useState<Partial<AboutSection>>({});
  const [contactForm, setContactForm] = useState<Partial<ContactInfo>>({});

  // Dialog states
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  // Edit states
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // CRUD functions
  const handleSaveBanner = () => {
    if (!heroBannerForm.title || !heroBannerForm.subtitle) {
      toast.error("Error", {
        description: "Silakan lengkapi semua field yang diperlukan",
      });
      return;
    }

    const bannerData: HeroBanner = {
      id: editingBanner?.id || Date.now().toString(),
      title: heroBannerForm.title || "",
      subtitle: heroBannerForm.subtitle || "",
      imageUrl: heroBannerForm.imageUrl || "/api/placeholder/800/400",
      buttonText: heroBannerForm.buttonText || "Pelajari Lebih Lanjut",
      buttonLink: heroBannerForm.buttonLink || "#",
      isActive: heroBannerForm.isActive ?? true,
      order: heroBannerForm.order || heroBanners.length + 1,
    };

    if (editingBanner) {
      setHeroBanners((prev) =>
        prev.map((banner) =>
          banner.id === editingBanner.id ? bannerData : banner
        )
      );
    } else {
      setHeroBanners((prev) => [...prev, bannerData]);
    }

    setHeroBannerForm({});
    setEditingBanner(null);
    setIsBannerDialogOpen(false);

    toast.success("Berhasil", {
      description: `Banner ${editingBanner ? "diupdate" : "ditambahkan"}`,
    });
  };

  const handleDeleteBanner = (id: string) => {
    setHeroBanners((prev) => prev.filter((banner) => banner.id !== id));
    toast.success("Berhasil", {
      description: "Banner dihapus",
    });
  };

  const handleEditBanner = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setHeroBannerForm(banner);
    setIsBannerDialogOpen(true);
  };

  const handleSaveAbout = () => {
    if (!aboutForm.vision || !aboutForm.mission) {
      toast.error("Error", {
        description: "Silakan lengkapi visi dan misi",
      });
      return;
    }

    const aboutData: AboutSection = {
      id: aboutSection.id,
      imageUrl: aboutForm.imageUrl || aboutSection.imageUrl,
      vision: aboutForm.vision,
      mission: aboutForm.mission,
    };

    setAboutSection(aboutData);
    setAboutForm({});
    setIsAboutDialogOpen(false);

    toast.success("Berhasil", {
      description: "Tentang kami diupdate",
    });
  };



  const handleSaveContact = () => {
    if (!contactForm.address || !contactForm.phone || !contactForm.email) {
      toast.error("Error", {
        description: "Silakan lengkapi informasi kontak",
      });
      return;
    }

    const contactData: ContactInfo = {
      id: contactInfo.id,
      address: contactForm.address || contactInfo.address,
      phone: contactForm.phone || contactInfo.phone,
      email: contactForm.email || contactInfo.email,
      socialMedia: contactForm.socialMedia || contactInfo.socialMedia,
      officeHours: contactForm.officeHours || contactInfo.officeHours,
      maps: contactForm.maps || contactInfo.maps,
    };

    setContactInfo(contactData);
    setContactForm({});
    setIsContactDialogOpen(false);

    toast.success("Berhasil", {
      description: "Informasi kontak diupdate",
    });
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Landing Page" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-[#001B55]/10 via-[#F0F0F0]/20 to-[#FF9C04]/10 p-8 rounded-2xl border border-gray-200/40 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-2xl shadow-lg">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#001B55] leading-tight">
                Manajemen Landing Page
              </h1>
              <p className="text-[#6B7280] mt-1">
                Kelola konten halaman utama website dengan sistem yang terintegrasi
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="hero" className="w-full">
          {/* Modern Navigation Menu */}
          <div className="flex justify-center mb-10">
            <div className="bg-[#FFFFFF] rounded-3xl border border-gray-100 shadow-sm p-1.5 backdrop-blur-sm">
              <TabsList className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-[#F0F0F0] to-[#F0F0F0] p-2 gap-2 min-w-[600px] h-16">
                <TabsTrigger
                  value="hero"
                  className="relative inline-flex items-center justify-center whitespace-nowrap rounded-3xl px-8 py-4 text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55]/20 disabled:pointer-events-none disabled:opacity-50 text-[#6B7280] hover:text-[#001B55] hover:bg-[#FFFFFF] hover:shadow-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/95 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/20 data-[state=active]:z-10 min-w-[180px] h-12 [&[data-state=active]>div>*]:!text-white [&[data-state=active]_*]:!text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Image className="w-4 h-4 text-inherit opacity-80" />
                    <span className="text-inherit font-medium">Hero Banner</span>
                  </div>
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-all duration-300 shadow-sm scale-0 data-[state=active]:scale-100"></div>
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="relative inline-flex items-center justify-center whitespace-nowrap rounded-3xl px-8 py-4 text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55]/20 disabled:pointer-events-none disabled:opacity-50 text-[#6B7280] hover:text-[#001B55] hover:bg-[#FFFFFF] hover:shadow-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/95 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/20 data-[state=active]:z-10 min-w-[180px] h-12 [&[data-state=active]>div>*]:!text-white [&[data-state=active]_*]:!text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-inherit opacity-80" />
                    <span className="text-inherit font-medium">Tentang Kami</span>
                  </div>
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-all duration-300 shadow-sm scale-0 data-[state=active]:scale-100"></div>
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="relative inline-flex items-center justify-center whitespace-nowrap rounded-3xl px-8 py-4 text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55]/20 disabled:pointer-events-none disabled:opacity-50 text-[#6B7280] hover:text-[#001B55] hover:bg-[#FFFFFF] hover:shadow-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/95 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/20 data-[state=active]:z-10 min-w-[180px] h-12 [&[data-state=active]>div>*]:!text-white [&[data-state=active]_*]:!text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-inherit opacity-80" />
                    <span className="text-inherit font-medium">Kontak</span>
                  </div>
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-all duration-300 shadow-sm scale-0 data-[state=active]:scale-100"></div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4 text-sm text-[#6B7280] bg-gradient-to-r from-[#FFFFFF] to-[#F0F0F0]/30 px-6 py-3 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF9C04] animate-pulse shadow-lg shadow-[#FF9C04]/30"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#FF9C04] animate-ping opacity-20"></div>
                </div>
                <span className="font-semibold text-[#001B55]">Live</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <span className="font-medium">Pilih tab untuk mengelola konten</span>
            </div>
          </div>

          {/* Hero Banner Tab */}
          <TabsContent value="hero" className="space-y-6">
            <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-[#001B55]/5 via-[#FFFFFF] to-[#FF9C04]/5 border-b border-gray-100 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-[#001B55]">
                    <div className="p-2 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-2xl shadow-md">
                      <Image className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">Hero Banners ({heroBanners.length})</span>
                  </CardTitle>
                  <Dialog
                    open={isBannerDialogOpen}
                    onOpenChange={setIsBannerDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="bg-[#FF9C04] hover:bg-[#001B55] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        size="default"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Banner
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingBanner ? "Edit Banner" : "Tambah Banner Baru"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Judul</Label>
                          <Input
                            id="title"
                            value={heroBannerForm.title || ""}
                            onChange={(e) =>
                              setHeroBannerForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Masukkan judul banner"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="subtitle">Subjudul</Label>
                          <Textarea
                            id="subtitle"
                            value={heroBannerForm.subtitle || ""}
                            onChange={(e) =>
                              setHeroBannerForm((prev) => ({
                                ...prev,
                                subtitle: e.target.value,
                              }))
                            }
                            placeholder="Masukkan subjudul"
                            rows={3}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="buttonText">Teks Tombol</Label>
                          <Input
                            id="buttonText"
                            value={heroBannerForm.buttonText || ""}
                            onChange={(e) =>
                              setHeroBannerForm((prev) => ({
                                ...prev,
                                buttonText: e.target.value,
                              }))
                            }
                            placeholder="Pelajari Lebih Lanjut"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="buttonLink">Link Tombol</Label>
                          <Input
                            id="buttonLink"
                            value={heroBannerForm.buttonLink || ""}
                            onChange={(e) =>
                              setHeroBannerForm((prev) => ({
                                ...prev,
                                buttonLink: e.target.value,
                              }))
                            }
                            placeholder="/about"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Gambar Banner</Label>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Gambar
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {heroBannerForm.imageUrl
                                ? "Gambar dipilih"
                                : "Belum ada gambar"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setHeroBannerForm({});
                            setEditingBanner(null);
                            setIsBannerDialogOpen(false);
                          }}
                        >
                          Batal
                        </Button>
                        <Button onClick={handleSaveBanner}>
                          {editingBanner ? "Update" : "Simpan"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-200 border-b-2 border-gray-300">
                      <TableHead className="font-bold text-[#001B55]">Preview</TableHead>
                      <TableHead className="font-bold text-[#001B55]">Judul</TableHead>
                      <TableHead className="font-bold text-[#001B55]">Subjudul</TableHead>
                      <TableHead className="font-bold text-[#001B55]">Status</TableHead>
                      <TableHead className="font-bold text-[#001B55]">Urutan</TableHead>
                      <TableHead className="text-right font-bold text-[#001B55]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {heroBanners.map((banner, index) => (
                      <TableRow 
                        key={banner.id} 
                        className="hover:bg-blue-100 transition-colors duration-200"
                        style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eff1f3' }}
                      >
                        <TableCell>
                          <div className="w-16 h-10 bg-gray-200 rounded overflow-hidden">
                            <img
                              src={banner.imageUrl}
                              alt={banner.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {banner.title}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {banner.subtitle}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={banner.isActive ? "default" : "secondary"}
                          >
                            {banner.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell>{banner.order}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditBanner(banner)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteBanner(banner.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Section Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-[#001B55]/5 via-[#FFFFFF] to-[#FF9C04]/5 border-b border-gray-100 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-[#001B55]">
                    <div className="p-2 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-2xl shadow-md">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">Tentang Kami</span>
                  </CardTitle>
                  <Dialog
                    open={isAboutDialogOpen}
                    onOpenChange={setIsAboutDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-[#FF9C04] hover:bg-[#001B55] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>Edit Tentang Kami</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Gambar</Label>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Gambar
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              Gambar saat ini tersedia
                            </span>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="vision">Visi</Label>
                          <Textarea
                            id="vision"
                            value={aboutForm.vision || aboutSection.vision}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                vision: e.target.value,
                              }))
                            }
                            rows={4}
                            placeholder="Masukkan visi organisasi"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="mission">Misi</Label>
                          <Textarea
                            id="mission"
                            value={aboutForm.mission || aboutSection.mission}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                mission: e.target.value,
                              }))
                            }
                            rows={4}
                            placeholder="Masukkan misi organisasi"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setAboutForm({});
                            setIsAboutDialogOpen(false);
                          }}
                        >
                          Batal
                        </Button>
                        <Button
                          className="bg-[#FF9C04] hover:bg-[#001B55] text-white transition-all duration-200"
                          onClick={handleSaveAbout}
                        >
                          Simpan
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={aboutSection.imageUrl}
                        alt="Tentang Kami"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-[#001B55]" />
                        <h3 className="font-semibold">Visi</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {aboutSection.vision}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-[#FF9C04]" />
                        <h3 className="font-semibold">Misi</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {aboutSection.mission}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-[#001B55]/5 via-[#FFFFFF] to-[#FF9C04]/5 border-b border-gray-100 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-[#001B55]">
                    <div className="p-2 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-2xl shadow-md">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">Informasi Kontak</span>
                  </CardTitle>
                  <Dialog
                    open={isContactDialogOpen}
                    onOpenChange={setIsContactDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-[#FF9C04] hover:bg-[#001B55] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Kontak
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Edit Informasi Kontak</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="address">Alamat</Label>
                          <Textarea
                            id="address"
                            value={contactForm.address || contactInfo.address}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                address: e.target.value,
                              }))
                            }
                            placeholder="Alamat lengkap kantor"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="phone">Telepon</Label>
                            <Input
                              id="phone"
                              value={contactForm.phone || contactInfo.phone}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              placeholder="+62 31 1234567"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={contactForm.email || contactInfo.email}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              placeholder="email@domain.com"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="officeHours">Jam Operasional</Label>
                          <Input
                            id="officeHours"
                            value={
                              contactForm.officeHours || contactInfo.officeHours
                            }
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                officeHours: e.target.value,
                              }))
                            }
                            placeholder="Senin - Jumat: 08:00 - 16:00 WIB"
                          />
                        </div>
                        <div className="grid gap-4">
                          <Label>Google Maps Integration</Label>
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="mapTitle">Map Title</Label>
                              <Input
                                id="mapTitle"
                                placeholder="Lokasi Kantor DPD NasDem Sidoarjo"
                                value={
                                  contactForm.maps?.title ||
                                  contactInfo.maps.title
                                }
                                onChange={(e) =>
                                  setContactForm((prev) => ({
                                    ...prev,
                                    maps: {
                                      ...contactInfo.maps,
                                      ...prev.maps,
                                      title: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="mapEmbed">Map Embed Code</Label>
                              <Textarea
                                id="mapEmbed"
                                placeholder="<iframe src=... atau koordinat GPS"
                                value={
                                  contactForm.maps?.embedCode ||
                                  contactInfo.maps.embedCode
                                }
                                onChange={(e) =>
                                  setContactForm((prev) => ({
                                    ...prev,
                                    maps: {
                                      ...contactInfo.maps,
                                      ...prev.maps,
                                      embedCode: e.target.value,
                                    },
                                  }))
                                }
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-4">
                          <Label>Media Sosial</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              placeholder="Facebook URL"
                              value={
                                contactForm.socialMedia?.facebook ||
                                contactInfo.socialMedia.facebook
                              }
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  socialMedia: {
                                    ...contactInfo.socialMedia,
                                    ...prev.socialMedia,
                                    facebook: e.target.value,
                                  },
                                }))
                              }
                            />
                            <Input
                              placeholder="Instagram URL"
                              value={
                                contactForm.socialMedia?.instagram ||
                                contactInfo.socialMedia.instagram
                              }
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  socialMedia: {
                                    ...contactInfo.socialMedia,
                                    ...prev.socialMedia,
                                    instagram: e.target.value,
                                  },
                                }))
                              }
                            />
                            <Input
                              placeholder="Twitter URL"
                              value={
                                contactForm.socialMedia?.twitter ||
                                contactInfo.socialMedia.twitter
                              }
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  socialMedia: {
                                    ...contactInfo.socialMedia,
                                    ...prev.socialMedia,
                                    twitter: e.target.value,
                                  },
                                }))
                              }
                            />
                            <Input
                              placeholder="YouTube URL"
                              value={
                                contactForm.socialMedia?.youtube ||
                                contactInfo.socialMedia.youtube
                              }
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  socialMedia: {
                                    ...contactInfo.socialMedia,
                                    ...prev.socialMedia,
                                    youtube: e.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setContactForm({});
                            setIsContactDialogOpen(false);
                          }}
                        >
                          Batal
                        </Button>
                        <Button
                          className="bg-[#FF9C04] hover:bg-[#001B55] text-white transition-all duration-200"
                          onClick={handleSaveContact}
                        >
                          Simpan
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#001B55]/10 rounded-lg">
                            <MapPin className="w-4 h-4 text-[#001B55]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">Alamat</p>
                            <p className="text-sm text-muted-foreground break-words">
                              {contactInfo.address}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#001B55]/10 rounded-lg">
                            <Phone className="w-4 h-4 text-[#001B55]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">Telepon</p>
                            <p className="text-sm text-muted-foreground">
                              {contactInfo.phone}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#001B55]/10 rounded-lg">
                            <Mail className="w-4 h-4 text-[#001B55]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">Email</p>
                            <p className="text-sm text-muted-foreground">
                              {contactInfo.email}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#001B55]/10 rounded-lg">
                            <Clock className="w-4 h-4 text-[#001B55]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">
                              Jam Operasional
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {contactInfo.officeHours}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Google Maps Section */}
                  <Card className="border-2 border-gray-200">
                    <CardHeader className="bg-gradient-to-r from-[#001B55]/5 to-[#FF9C04]/5">
                      <CardTitle className="flex items-center gap-2 text-[#001B55]">
                        <MapPin className="w-5 h-5" />
                        {contactInfo.maps.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden border">
                        {contactInfo.maps.embedCode.includes("<iframe") ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: contactInfo.maps.embedCode,
                            }}
                            className="w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <div className="text-center">
                              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm">
                                {contactInfo.maps.embedCode ||
                                  "Embed code belum diatur"}
                              </p>
                              {contactInfo.maps.coordinates && (
                                <p className="text-xs mt-1">
                                  Koordinat: {contactInfo.maps.coordinates.lat},{" "}
                                  {contactInfo.maps.coordinates.lng}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
