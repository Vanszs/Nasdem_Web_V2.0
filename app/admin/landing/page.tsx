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
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Upload,
  Image,
  Target,
  Users,
  TrendingUp,
  ChevronDown,
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

interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "Berlangsung" | "Selesai" | "Tertunda" | "Perencanaan";
  startDate: string;
  endDate: string;
  budget: number;
  targetBeneficiaries: number;
  currentBeneficiaries: number;
  progress: number;
  timeline: string;
  target: string;
  details: string[];
  achievements: string[];
  coordinator?: string;
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

  const [programs, setPrograms] = useState<Program[]>([
    {
      id: "1",
      name: "Pemberdayaan UMKM",
      description:
        "Program pelatihan dan pendampingan usaha mikro, kecil, dan menengah",
      category: "Ekonomi",
      status: "Berlangsung",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      budget: 500000000,
      targetBeneficiaries: 1000,
      currentBeneficiaries: 750,
      progress: 75,
      timeline: "2024-2026",
      target: "1000 UMKM binaan",
      details: [
        "Pelatihan manajemen keuangan untuk UMKM",
        "Pendampingan pengembangan produk",
        "Akses permodalan dengan bunga rendah",
        "Pelatihan pemasaran digital",
      ],
      achievements: [
        "750 UMKM telah mendapat pelatihan",
        "200 UMKM mendapat akses permodalan",
        "15 produk unggulan diluncurkan",
      ],
      coordinator: "Dr. Siti Aminah, M.E.",
    },
    {
      id: "2",
      name: "Beasiswa Prestasi",
      description:
        "Program beasiswa untuk siswa berprestasi dari keluarga kurang mampu",
      category: "Pendidikan",
      status: "Berlangsung",
      startDate: "2024-02-01",
      endDate: "2024-11-30",
      budget: 300000000,
      targetBeneficiaries: 200,
      currentBeneficiaries: 150,
      progress: 75,
      timeline: "2024-2025",
      target: "200 penerima beasiswa",
      details: [
        "Beasiswa pendidikan SMA sederajat",
        "Beasiswa kuliah untuk mahasiswa berprestasi",
        "Bantuan buku dan seragam sekolah",
        "Program mentoring akademik",
      ],
      achievements: [
        "150 siswa mendapat beasiswa",
        "50 mahasiswa lulus cumlaude",
        "25 siswa meraih prestasi olimpiade",
      ],
      coordinator: "Prof. Ahmad Mujahid, Ph.D.",
    },
  ]);

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
  const [programForm, setProgramForm] = useState<Partial<Program>>({});
  const [contactForm, setContactForm] = useState<Partial<ContactInfo>>({});

  // Dialog states
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  // Edit states
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getStatusBadge = (status: Program["status"]) => {
    const variants = {
      Berlangsung: "default",
      Selesai: "outline",
      Tertunda: "secondary",
      Perencanaan: "secondary",
    } as const;

    const colors = {
      Berlangsung:
        "bg-[#001B55]/10 text-[#001B55] border border-[#001B55]/20 font-semibold",
      Selesai:
        "bg-[#FF9C04]/10 text-[#FF9C04] border border-[#FF9C04]/20 font-semibold",
      Tertunda:
        "bg-yellow-100 text-yellow-700 border border-yellow-200 font-semibold",
      Perencanaan:
        "bg-purple-100 text-purple-700 border border-purple-200 font-semibold",
    };

    return <Badge className={colors[status]}>{status}</Badge>;
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

  const handleSaveProgram = () => {
    if (!programForm.name || !programForm.description) {
      toast.error("Error", {
        description: "Silakan lengkapi nama dan deskripsi program",
      });
      return;
    }

    const programData: Program = {
      id: editingProgram?.id || Date.now().toString(),
      name: programForm.name || "",
      description: programForm.description || "",
      category: programForm.category || "Umum",
      status: programForm.status || "Berlangsung",
      startDate:
        programForm.startDate || new Date().toISOString().split("T")[0],
      endDate: programForm.endDate || new Date().toISOString().split("T")[0],
      budget: programForm.budget || 0,
      targetBeneficiaries: programForm.targetBeneficiaries || 0,
      currentBeneficiaries: programForm.currentBeneficiaries || 0,
      progress: programForm.progress || 0,
      timeline: programForm.timeline || "",
      target: programForm.target || "",
      details: programForm.details || [],
      achievements: programForm.achievements || [],
      coordinator: programForm.coordinator || "",
    };

    if (editingProgram) {
      setPrograms((prev) =>
        prev.map((program) =>
          program.id === editingProgram.id ? programData : program
        )
      );
    } else {
      setPrograms((prev) => [...prev, programData]);
    }

    setProgramForm({});
    setEditingProgram(null);
    setIsProgramDialogOpen(false);

    toast.success("Berhasil", {
      description: `Program ${editingProgram ? "diupdate" : "ditambahkan"}`,
    });
  };

  const handleDeleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((program) => program.id !== id));
    toast.success("Berhasil", {
      description: "Program dihapus",
    });
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setProgramForm(program);
    setIsProgramDialogOpen(true);
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
        <div className="bg-gradient-to-r from-[#001B55]/5 via-white to-[#FF9C04]/5 p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#FF9C04]/10 rounded-lg">
              <Home className="w-6 h-6 text-[#FF9C04]" />
            </div>
            <h1 className="text-3xl font-bold text-[#001B55]">
              Manajemen Landing Page
            </h1>
          </div>
          <p className="text-muted-foreground ml-11">
            Kelola konten halaman utama website dengan sistem yang terintegrasi
          </p>
        </div>

        <Tabs defaultValue="hero" className="w-full">
          {/* Enhanced Navigation Menu */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-2 backdrop-blur-sm">
              <TabsList className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-1.5 gap-1 min-w-[800px]">
                <TabsTrigger
                  value="hero"
                  className="relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-600 hover:text-[#001B55] hover:bg-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/90 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/25 data-[state=active]:border data-[state=active]:border-[#FF9C04]/30 min-w-[180px] h-12"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300"></div>
                    <Image className="w-4 h-4" />
                    Hero Banner
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-600 hover:text-[#001B55] hover:bg-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/90 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/25 data-[state=active]:border data-[state=active]:border-[#FF9C04]/30 min-w-[180px] h-12"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300"></div>
                    <Users className="w-4 h-4" />
                    Tentang Kami
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="programs"
                  className="relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-600 hover:text-[#001B55] hover:bg-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/90 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/25 data-[state=active]:border data-[state=active]:border-[#FF9C04]/30 min-w-[180px] h-12"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300"></div>
                    <TrendingUp className="w-4 h-4" />
                    Program Kerja
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-600 hover:text-[#001B55] hover:bg-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/90 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/25 data-[state=active]:border data-[state=active]:border-[#FF9C04]/30 min-w-[180px] h-12"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300"></div>
                    <Phone className="w-4 h-4" />
                    Kontak
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Navigation Status Indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#FF9C04]"></div>
                <span>Aktif</span>
              </div>
              <span>•</span>
              <span>Pilih tab untuk mengelola konten</span>
            </div>
          </div>

          {/* Hero Banner Tab */}
          <TabsContent value="hero" className="space-y-6">
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="bg-gradient-to-r from-[#001B55]/10 via-white to-[#FF9C04]/10 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-[#001B55]">
                    <div className="p-2 bg-[#FF9C04]/10 rounded-lg">
                      <Image className="w-5 h-5 text-[#FF9C04]" />
                    </div>
                    Hero Banners ({heroBanners.length})
                  </CardTitle>
                  <Dialog
                    open={isBannerDialogOpen}
                    onOpenChange={setIsBannerDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="bg-[#FF9C04] hover:bg-[#001B55] text-white font-semibold border-2 border-[#FF9C04] hover:border-[#001B55] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
                    <TableRow>
                      <TableHead>Preview</TableHead>
                      <TableHead>Judul</TableHead>
                      <TableHead>Subjudul</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Urutan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {heroBanners.map((banner) => (
                      <TableRow key={banner.id}>
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
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="bg-gradient-to-r from-[#001B55]/10 via-white to-[#FF9C04]/10 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-[#001B55]">
                    <div className="p-2 bg-[#FF9C04]/10 rounded-lg">
                      <Users className="w-5 h-5 text-[#FF9C04]" />
                    </div>
                    Tentang Kami
                  </CardTitle>
                  <Dialog
                    open={isAboutDialogOpen}
                    onOpenChange={setIsAboutDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-[#FF9C04] hover:bg-[#001B55] text-white font-semibold border-2 border-[#FF9C04] hover:border-[#001B55] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
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
                          className="bg-[#FF9C04] hover:bg-[#001B55] text-white"
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

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-6">
            <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-[#001B55]/5 to-[#FF9C04]/5 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FF9C04]/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-[#FF9C04]" />
                </div>
                <h2 className="text-2xl font-bold text-[#001B55]">
                  Program Kerja
                </h2>
              </div>
              <Dialog
                open={isProgramDialogOpen}
                onOpenChange={setIsProgramDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-[#FF9C04] hover:bg-[#001B55] text-white font-semibold border-2 border-[#FF9C04] hover:border-[#001B55] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Program
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProgram ? "Edit Program" : "Tambah Program Baru"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="programName">Nama Program</Label>
                        <Input
                          id="programName"
                          value={programForm.name || ""}
                          onChange={(e) =>
                            setProgramForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Masukkan nama program"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Select
                          value={programForm.category || ""}
                          onValueChange={(value) =>
                            setProgramForm((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ekonomi">Ekonomi</SelectItem>
                            <SelectItem value="Pendidikan">
                              Pendidikan
                            </SelectItem>
                            <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                            <SelectItem value="Sosial">Sosial</SelectItem>
                            <SelectItem value="Lingkungan">
                              Lingkungan
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        value={programForm.description || ""}
                        onChange={(e) =>
                          setProgramForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Masukkan deskripsi program"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input
                        id="timeline"
                        value={programForm.timeline || ""}
                        onChange={(e) =>
                          setProgramForm((prev) => ({
                            ...prev,
                            timeline: e.target.value,
                          }))
                        }
                        placeholder="2024-2026"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="target">Target</Label>
                      <Input
                        id="target"
                        value={programForm.target || ""}
                        onChange={(e) =>
                          setProgramForm((prev) => ({
                            ...prev,
                            target: e.target.value,
                          }))
                        }
                        placeholder="1000 penerima manfaat"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="coordinator">Koordinator</Label>
                      <Input
                        id="coordinator"
                        value={programForm.coordinator || ""}
                        onChange={(e) =>
                          setProgramForm((prev) => ({
                            ...prev,
                            coordinator: e.target.value,
                          }))
                        }
                        placeholder="Dr. Ahmad Mujahid"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">Tanggal Mulai</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={programForm.startDate || ""}
                          onChange={(e) =>
                            setProgramForm((prev) => ({
                              ...prev,
                              startDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endDate">Tanggal Selesai</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={programForm.endDate || ""}
                          onChange={(e) =>
                            setProgramForm((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="budget">Anggaran (Rp)</Label>
                        <Input
                          id="budget"
                          type="number"
                          value={programForm.budget || ""}
                          onChange={(e) =>
                            setProgramForm((prev) => ({
                              ...prev,
                              budget: parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder="500000000"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={programForm.status || ""}
                          onValueChange={(value: Program["status"]) =>
                            setProgramForm((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Berlangsung">
                              Berlangsung
                            </SelectItem>
                            <SelectItem value="Selesai">Selesai</SelectItem>
                            <SelectItem value="Tertunda">Tertunda</SelectItem>
                            <SelectItem value="Perencanaan">
                              Perencanaan
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="targetBeneficiaries">
                          Target Penerima Manfaat
                        </Label>
                        <Input
                          id="targetBeneficiaries"
                          type="number"
                          value={programForm.targetBeneficiaries || ""}
                          onChange={(e) =>
                            setProgramForm((prev) => ({
                              ...prev,
                              targetBeneficiaries:
                                parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder="1000"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="currentBeneficiaries">
                          Penerima Manfaat Saat Ini
                        </Label>
                        <Input
                          id="currentBeneficiaries"
                          type="number"
                          value={programForm.currentBeneficiaries || ""}
                          onChange={(e) =>
                            setProgramForm((prev) => ({
                              ...prev,
                              currentBeneficiaries:
                                parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder="750"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="progress">Progress (%)</Label>
                        <Input
                          id="progress"
                          type="number"
                          min="0"
                          max="100"
                          value={programForm.progress || ""}
                          onChange={(e) =>
                            setProgramForm((prev) => ({
                              ...prev,
                              progress: parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder="75"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setProgramForm({});
                        setEditingProgram(null);
                        setIsProgramDialogOpen(false);
                      }}
                    >
                      Batal
                    </Button>
                    <Button onClick={handleSaveProgram}>
                      {editingProgram ? "Update" : "Simpan"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {programs.map((program) => (
                <Card
                  key={program.id}
                  className="border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gradient-to-r hover:from-[#001B55]/5 hover:to-[#FF9C04]/5 transition-all duration-200 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <CardTitle className="text-lg text-[#001B55] flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#FF9C04] rounded-full"></div>
                                {program.name}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(program.status)}
                                <ChevronDown className="w-4 h-4 transition-transform text-[#FF9C04]" />
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">
                              {program.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1 text-[#001B55]">
                                <Target className="w-4 h-4 text-[#FF9C04]" />
                                {program.target}
                              </span>
                              <span className="text-[#FF9C04] font-semibold">
                                {program.progress}% tercapai
                              </span>
                              <span className="text-muted-foreground">
                                Timeline: {program.timeline}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="grid gap-4 border-t border-gray-200 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2 text-[#001B55]">
                                <div className="p-1 bg-[#FF9C04]/10 rounded">
                                  <TrendingUp className="w-4 h-4 text-[#FF9C04]" />
                                </div>
                                Status & Progress
                              </h4>
                              <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">
                                    Status:
                                  </span>
                                  {getStatusBadge(program.status)}
                                </div>
                                <div>
                                  <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">
                                      Progress
                                    </span>
                                    <span className="text-[#FF9C04] font-bold">
                                      {program.progress}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={program.progress}
                                    className="h-3 bg-gray-200"
                                  />
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">
                                    Penerima Manfaat:
                                  </span>
                                  <span className="text-[#001B55]">
                                    {program.currentBeneficiaries} /{" "}
                                    {program.targetBeneficiaries}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">Anggaran:</span>
                                  <span className="text-[#001B55] font-semibold">
                                    {formatCurrency(program.budget)}
                                  </span>
                                </div>
                                {program.coordinator && (
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium">
                                      Koordinator:
                                    </span>
                                    <span className="text-[#001B55]">
                                      {program.coordinator}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 text-[#001B55]">
                                Detail Program:
                              </h4>
                              <ul className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                                {program.details.map((detail, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="w-2 h-2 bg-[#FF9C04] rounded-full mt-1.5 flex-shrink-0"></span>
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">
                              Capaian Terkini:
                            </h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {program.achievements.map(
                                (achievement, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 bg-[#FF9C04] rounded-full mt-2 flex-shrink-0"></span>
                                    {achievement}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                            <Button
                              className="bg-[#001B55] hover:bg-[#001B55]/90 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                              size="sm"
                              onClick={() => handleEditProgram(program)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              className="bg-red-500 hover:bg-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                              size="sm"
                              onClick={() => handleDeleteProgram(program.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="border-2 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-[#001B55]/10 via-white to-[#FF9C04]/10 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-[#001B55]">
                    <div className="p-2 bg-[#FF9C04]/10 rounded-lg">
                      <Phone className="w-5 h-5 text-[#FF9C04]" />
                    </div>
                    Informasi Kontak
                  </CardTitle>
                  <Dialog
                    open={isContactDialogOpen}
                    onOpenChange={setIsContactDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-[#FF9C04] hover:bg-[#001B55] text-white font-semibold border-2 border-[#FF9C04] hover:border-[#001B55] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
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
                          className="bg-[#FF9C04] hover:bg-[#001B55] text-white"
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
