"use client";
import { useState } from "react";
import { AdminLayout } from "@/src/components/layout/AdminLayout";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Users, Plus, Search, Camera, MapPin, Phone, Mail, Building, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/src/hooks/use-toast";

interface Member {
  id: string;
  name: string;
  position: string;
  department: string;
  photo: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: "active" | "inactive";
  description: string;
}

// Mock data for members
const mockMembers: Member[] = [
  {
    id: "1",
    name: "Ahmad Sudrajat",
    position: "Ketua DPD",
    department: "DPD",
    photo: "/api/placeholder/200/200",
    email: "ahmad.sudrajat@nasdem-sidoarjo.org",
    phone: "0812-3456-7890",
    address: "Jl. Veteran No. 10, Sidoarjo",
    joinDate: "2020-01-15",
    status: "active",
    description: "Ketua Dewan Pimpinan Daerah Partai NasDem Kabupaten Sidoarjo periode 2020-2025"
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    position: "Sekretaris",
    department: "DPD",
    photo: "/api/placeholder/200/200",
    email: "siti.nurhaliza@nasdem-sidoarjo.org",
    phone: "0813-4567-8901",
    address: "Jl. Gajah Mada No. 25, Sidoarjo",
    joinDate: "2020-02-20",
    status: "active",
    description: "Sekretaris Dewan Pimpinan Daerah Partai NasDem Kabupaten Sidoarjo"
  },
  {
    id: "3",
    name: "Budi Santoso",
    position: "Bendahara",
    department: "DPD",
    photo: "/api/placeholder/200/200",
    email: "budi.santoso@nasdem-sidoarjo.org",
    phone: "0814-5678-9012",
    address: "Jl. Diponegoro No. 15, Sidoarjo",
    joinDate: "2020-03-10",
    status: "active",
    description: "Bendahara Dewan Pimpinan Daerah Partai NasDem Kabupaten Sidoarjo"
  },
  {
    id: "4",
    name: "Dewi Lestari",
    position: "Ketua Bidang Perempuan dan Anak",
    department: "Sayap",
    photo: "/api/placeholder/200/200",
    email: "dewi.lestari@nasdem-sidoarjo.org",
    phone: "0815-6789-0123",
    address: "Jl. Pemuda No. 30, Sidoarjo",
    joinDate: "2021-01-05",
    status: "active",
    description: "Ketua Bidang Perempuan dan Anak DPD Partai NasDem Kabupaten Sidoarjo"
  }
];

export function MemberListPage() {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "DPD",
    email: "",
    phone: "",
    address: "",
    description: "",
    photoFile: null as File | null
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photoFile: file }));
    }
  };

  const handleAddMember = () => {
    if (!formData.name || !formData.position) {
      toast({
        title: "Error",
        description: "Nama dan posisi wajib diisi",
        variant: "destructive"
      });
      return;
    }

    // Simulate adding member
    const newMember: Member = {
      id: `${Date.now()}`,
      name: formData.name,
      position: formData.position,
      department: formData.department,
      photo: formData.photoFile ? URL.createObjectURL(formData.photoFile) : "/api/placeholder/200/200",
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      joinDate: new Date().toISOString().split('T')[0],
      status: "active",
      description: formData.description
    };

    setMembers(prev => [newMember, ...prev]);
    
    toast({
      title: "Berhasil",
      description: `Anggota "${formData.name}" berhasil ditambahkan`,
    });

    // Reset form
    setFormData({
      name: "",
      position: "",
      department: "DPD",
      email: "",
      phone: "",
      address: "",
      description: "",
      photoFile: null
    });
    setIsAddDialogOpen(false);
  };

  const statusConfig = {
    active: { 
      label: "Aktif", 
      className: "bg-success text-white border-2 border-success/20"
    },
    inactive: { 
      label: "Tidak Aktif", 
      className: "bg-muted text-muted-foreground border-2 border-muted/20"
    }
  };

  const departmentConfig = {
    DPD: { 
      label: "DPD", 
      className: "bg-brand-primary text-white border-2 border-brand-primary/20"
    },
    Sayap: { 
      label: "Sayap", 
      className: "bg-brand-accent text-white border-2 border-brand-accent/20"
    },
    DPC: { 
      label: "DPC", 
      className: "bg-info text-white border-2 border-info/20"
    },
    DPRT: { 
      label: "DPRT", 
      className: "bg-warning text-white border-2 border-warning/20"
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Struktur", href: "/structure/dpd" },
    { label: "Daftar Anggota" }
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Daftar Anggota</h1>
              <p className="text-muted-foreground">Kelola data anggota Partai NasDem Sidoarjo</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brand-accent border-2 border-brand-accent/20 hover:border-brand-accent/40 transition-all duration-300">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Anggota
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl border-2 border-gray-300/80">
                <DialogHeader>
                  <DialogTitle>Tambah Anggota Baru</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {/* Photo Upload */}
                  <div>
                    <Label htmlFor="photo">Foto Anggota</Label>
                    <div className="mt-2 flex flex-col items-center">
                      <div className="relative mb-4">
                        <Avatar className="w-24 h-24 border-2 border-gray-200">
                          <AvatarImage src={formData.photoFile ? URL.createObjectURL(formData.photoFile) : ""} />
                          <AvatarFallback className="bg-brand-primary text-white">
                            <Camera className="h-8 w-8" />
                          </AvatarFallback>
                        </Avatar>
                        <label
                          htmlFor="photo-upload"
                          className="absolute bottom-0 right-0 bg-brand-accent text-white rounded-full p-1.5 cursor-pointer hover:bg-brand-accent/90 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                        </label>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Masukkan nama lengkap"
                        className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="position">Posisi/Jabatan *</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="Masukkan posisi/jabatan"
                        className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="department">Departemen</Label>
                      <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                        <SelectTrigger className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DPD">DPD</SelectItem>
                          <SelectItem value="Sayap">Sayap</SelectItem>
                          <SelectItem value="DPC">DPC</SelectItem>
                          <SelectItem value="DPRT">DPRT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@example.com"
                        className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Telepon</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="0812-3456-7890"
                        className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Alamat</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Masukkan alamat"
                        className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Deskripsi tugas dan peran"
                        className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-2 border-gray-200 hover:border-gray-300">
                    Batal
                  </Button>
                  <Button onClick={handleAddMember} className="bg-brand-accent border-2 border-brand-accent/20 hover:border-brand-accent/40">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Anggota
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="border-2 border-gray-300/80 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari nama atau posisi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary pl-10"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[200px] border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary">
                  <SelectValue placeholder="Filter departemen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Departemen</SelectItem>
                  <SelectItem value="DPD">DPD</SelectItem>
                  <SelectItem value="Sayap">Sayap</SelectItem>
                  <SelectItem value="DPC">DPC</SelectItem>
                  <SelectItem value="DPRT">DPRT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Members Grid */}
        {paginatedMembers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedMembers.map((member) => (
                <Card key={member.id} className="border-2 border-gray-300/80 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex flex-col items-center">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                        <AvatarImage src={member.photo} />
                        <AvatarFallback className="bg-brand-primary text-white text-lg">
                          {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="mt-3 text-center">
                        <CardTitle className="text-lg font-bold">{member.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{member.position}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <Badge 
                          className={departmentConfig[member.department as keyof typeof departmentConfig]?.className}
                        >
                          {departmentConfig[member.department as keyof typeof departmentConfig]?.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{member.phone}</span>
                      </div>
                      
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="line-clamp-2">{member.address}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <Badge 
                          className={statusConfig[member.status].className}
                        >
                          {statusConfig[member.status].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Bergabung: {new Date(member.joinDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6">
                <div className="text-sm text-muted-foreground">
                  Halaman {currentPage} dari {totalPages} ({filteredMembers.length} total anggota)
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                          onClick={() => setCurrentPage(page)}
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
          <Card className="border-2 border-gray-300/80 shadow-lg">
            <CardContent className="p-12 text-center">
              <Users className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum ada anggota</h3>
              <p className="text-muted-foreground mb-4">Tambahkan anggota pertama untuk memulai</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-brand-accent border-2 border-brand-accent/20 hover:border-brand-accent/40">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Anggota
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
