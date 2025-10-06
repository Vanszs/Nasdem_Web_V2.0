"use client";

import { useState } from "react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HandHeart,
  Plus,
  Search,
  Filter,
  Download,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

// Types
interface Beneficiary {
  id: string;
  fullName: string;
  nik: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: "Laki-laki" | "Perempuan";
  occupation: string;
  program: string;
  programId: string;
  status: "Aktif" | "Menunggu" | "Selesai" | "Ditolak";
  registeredAt: string;
  notes?: string;
}

export default function BeneficiariesPage() {
  // Mock Data
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: "1",
      fullName: "Ahmad Sulaiman",
      nik: "3515012345670001",
      email: "ahmad.sulaiman@email.com",
      phone: "081234567890",
      address: "Jl. Raya Sidoarjo No. 123, Sidoarjo",
      dateOfBirth: "1985-05-15",
      gender: "Laki-laki",
      occupation: "Pedagang",
      program: "Pemberdayaan UMKM",
      programId: "1",
      status: "Aktif",
      registeredAt: "2024-01-15",
      notes: "Memiliki usaha kuliner",
    },
    {
      id: "2",
      fullName: "Siti Aminah",
      nik: "3515012345670002",
      email: "siti.aminah@email.com",
      phone: "081234567891",
      address: "Jl. Pahlawan No. 45, Sidoarjo",
      dateOfBirth: "1990-08-20",
      gender: "Perempuan",
      occupation: "Ibu Rumah Tangga",
      program: "Beasiswa Prestasi",
      programId: "2",
      status: "Aktif",
      registeredAt: "2024-02-01",
      notes: "Anak berprestasi di bidang akademik",
    },
    {
      id: "3",
      fullName: "Budi Santoso",
      nik: "3515012345670003",
      email: "budi.santoso@email.com",
      phone: "081234567892",
      address: "Jl. Merdeka No. 78, Sidoarjo",
      dateOfBirth: "1988-03-10",
      gender: "Laki-laki",
      occupation: "Petani",
      program: "Pemberdayaan UMKM",
      programId: "1",
      status: "Menunggu",
      registeredAt: "2024-03-15",
      notes: "Sedang proses verifikasi",
    },
    {
      id: "4",
      fullName: "Dewi Kusuma",
      nik: "3515012345670004",
      email: "dewi.kusuma@email.com",
      phone: "081234567893",
      address: "Jl. Kartini No. 90, Sidoarjo",
      dateOfBirth: "1995-11-25",
      gender: "Perempuan",
      occupation: "Guru",
      program: "Beasiswa Prestasi",
      programId: "2",
      status: "Selesai",
      registeredAt: "2023-06-10",
      notes: "Program telah selesai diikuti",
    },
    {
      id: "5",
      fullName: "Joko Widodo",
      nik: "3515012345670005",
      email: "joko.widodo@email.com",
      phone: "081234567894",
      address: "Jl. Sudirman No. 12, Sidoarjo",
      dateOfBirth: "1992-07-18",
      gender: "Laki-laki",
      occupation: "Wiraswasta",
      program: "Pemberdayaan UMKM",
      programId: "1",
      status: "Aktif",
      registeredAt: "2024-02-20",
      notes: "Usaha konveksi",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProgram, setFilterProgram] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Mock Programs for filter
  const programs = [
    { id: "1", name: "Pemberdayaan UMKM" },
    { id: "2", name: "Beasiswa Prestasi" },
  ];

  // Filter beneficiaries
  const filteredBeneficiaries = beneficiaries.filter((beneficiary) => {
    const matchSearch =
      beneficiary.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.phone.includes(searchTerm) ||
      beneficiary.nik.includes(searchTerm);

    const matchStatus =
      filterStatus === "all" || beneficiary.status === filterStatus;

    const matchProgram =
      filterProgram === "all" || beneficiary.programId === filterProgram;

    return matchSearch && matchStatus && matchProgram;
  });

  // Statistics
  const stats = {
    total: beneficiaries.length,
    active: beneficiaries.filter((b) => b.status === "Aktif").length,
    waiting: beneficiaries.filter((b) => b.status === "Menunggu").length,
    completed: beneficiaries.filter((b) => b.status === "Selesai").length,
  };

  const getStatusBadge = (status: Beneficiary["status"]) => {
    const colors = {
      Aktif: "bg-[#001B55]/10 text-[#001B55] border border-[#001B55]/20",
      Menunggu: "bg-[#FF9C04]/10 text-[#FF9C04] border border-[#FF9C04]/20",
      Selesai: "bg-green-500/10 text-green-700 border border-green-500/20",
      Ditolak: "bg-[#C81E1E]/10 text-[#C81E1E] border border-[#C81E1E]/20",
    };
    return (
      <Badge className={`${colors[status]} font-semibold`}>{status}</Badge>
    );
  };

  const handleView = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsDialogOpen(true);
    toast.info("Edit Penerima Manfaat", {
      description: "Fitur edit akan segera tersedia",
    });
  };

  const handleDelete = (id: string) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    toast.success("Berhasil", {
      description: "Penerima manfaat berhasil dihapus",
    });
  };

  const handleExport = () => {
    toast.success("Export Data", {
      description: "Data penerima manfaat berhasil diexport",
    });
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Program Kerja", href: "/admin/programs" },
        { label: "Penerima Manfaat" },
      ]}
    >
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-3xl border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-gray-600 font-medium">
                  Total Penerima
                </CardDescription>
                <div className="p-3 bg-gradient-to-br from-[#001B55]/10 to-[#001B55]/5 rounded-2xl">
                  <Users className="w-6 h-6 text-[#001B55]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-4xl font-bold text-[#001B55] mb-2">
                {stats.total}
              </CardTitle>
              <p className="text-sm text-gray-500">Penerima manfaat terdaftar</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-gray-600 font-medium">
                  Status Aktif
                </CardDescription>
                <div className="p-3 bg-gradient-to-br from-[#001B55]/10 to-[#001B55]/5 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-[#001B55]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-4xl font-bold text-[#001B55] mb-2">
                {stats.active}
              </CardTitle>
              <p className="text-sm text-gray-500">Sedang menerima manfaat</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-gray-600 font-medium">
                  Menunggu
                </CardDescription>
                <div className="p-3 bg-gradient-to-br from-[#FF9C04]/10 to-[#FF9C04]/5 rounded-2xl">
                  <Clock className="w-6 h-6 text-[#FF9C04]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-4xl font-bold text-[#FF9C04] mb-2">
                {stats.waiting}
              </CardTitle>
              <p className="text-sm text-gray-500">Proses verifikasi</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-gray-600 font-medium">
                  Selesai
                </CardDescription>
                <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-4xl font-bold text-green-600 mb-2">
                {stats.completed}
              </CardTitle>
              <p className="text-sm text-gray-500">Program selesai diikuti</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="rounded-3xl border-2 border-gray-100 shadow-xl">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-[#001B55]/10 to-[#001B55]/5 rounded-2xl">
                  <HandHeart className="w-6 h-6 text-[#001B55]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-[#001B55]">
                    Daftar Penerima Manfaat
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {filteredBeneficiaries.length} penerima manfaat ditemukan
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="rounded-full border-2 border-[#001B55]/20 hover:bg-[#001B55]/5 text-[#001B55] font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button
                  onClick={() => {
                    setSelectedBeneficiary(null);
                    setIsDialogOpen(true);
                  }}
                  className="rounded-full bg-gradient-to-r from-[#001B55] to-[#001B55]/90 hover:from-[#FF9C04] hover:to-[#FF9C04]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Penerima Manfaat
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Cari nama, NIK, email, atau telepon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 rounded-xl border-2 focus:border-[#FF9C04] transition-all"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-14 rounded-xl border-2 focus:border-[#FF9C04]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Menunggu">Menunggu</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterProgram} onValueChange={setFilterProgram}>
                <SelectTrigger className="h-14 rounded-xl border-2 focus:border-[#FF9C04]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter Program" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Program</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-200">
                  <TableRow className="hover:bg-gray-200">
                    <TableHead className="font-bold text-[#001B55]">
                      Nama Lengkap
                    </TableHead>
                    <TableHead className="font-bold text-[#001B55]">
                      NIK
                    </TableHead>
                    <TableHead className="font-bold text-[#001B55]">
                      Kontak
                    </TableHead>
                    <TableHead className="font-bold text-[#001B55]">
                      Program
                    </TableHead>
                    <TableHead className="font-bold text-[#001B55]">
                      Status
                    </TableHead>
                    <TableHead className="font-bold text-[#001B55]">
                      Terdaftar
                    </TableHead>
                    <TableHead className="font-bold text-[#001B55] text-right">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBeneficiaries.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        Tidak ada data penerima manfaat
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBeneficiaries.map((beneficiary, index) => (
                      <TableRow
                        key={beneficiary.id}
                        className={`hover:bg-gray-100 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <TableCell className="font-semibold text-[#001B55]">
                          {beneficiary.fullName}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {beneficiary.nik}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-3 h-3" />
                              {beneficiary.phone}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-3 h-3" />
                              {beneficiary.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {beneficiary.program}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(beneficiary.status)}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(
                            beneficiary.registeredAt
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(beneficiary)}
                              className="rounded-full border-[#001B55]/20 hover:bg-[#001B55]/5 text-[#001B55]"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(beneficiary)}
                              className="rounded-full border-[#001B55]/20 hover:bg-[#001B55]/5 text-[#001B55]"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(beneficiary.id)}
                              className="rounded-full border-[#C81E1E]/20 hover:bg-[#C81E1E]/5 text-[#C81E1E]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Detail Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#001B55] flex items-center gap-3">
                <div className="p-2 bg-[#001B55]/10 rounded-xl">
                  <Eye className="w-6 h-6 text-[#001B55]" />
                </div>
                Detail Penerima Manfaat
              </DialogTitle>
            </DialogHeader>

            {selectedBeneficiary && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        Nama Lengkap
                      </Label>
                      <p className="text-[#001B55] font-semibold text-lg">
                        {selectedBeneficiary.fullName}
                      </p>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        NIK
                      </Label>
                      <p className="text-gray-700 font-medium">
                        {selectedBeneficiary.nik}
                      </p>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        Tanggal Lahir
                      </Label>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-[#FF9C04]" />
                        {new Date(
                          selectedBeneficiary.dateOfBirth
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        Jenis Kelamin
                      </Label>
                      <p className="text-gray-700">{selectedBeneficiary.gender}</p>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        Pekerjaan
                      </Label>
                      <p className="text-gray-700">
                        {selectedBeneficiary.occupation}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        Email
                      </Label>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-[#FF9C04]" />
                        {selectedBeneficiary.email}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        Telepon
                      </Label>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-[#FF9C04]" />
                        {selectedBeneficiary.phone}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        Alamat
                      </Label>
                      <div className="flex items-start gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-[#FF9C04] mt-1 flex-shrink-0" />
                        <span>{selectedBeneficiary.address}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        Program
                      </Label>
                      <p className="text-[#001B55] font-semibold">
                        {selectedBeneficiary.program}
                      </p>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        Status
                      </Label>
                      {getStatusBadge(selectedBeneficiary.status)}
                    </div>
                  </div>
                </div>

                {selectedBeneficiary.notes && (
                  <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                    <Label className="text-gray-600 text-sm font-medium mb-2 block">
                      Catatan
                    </Label>
                    <p className="text-gray-700">{selectedBeneficiary.notes}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                    className="rounded-full border-2 border-gray-200 hover:bg-gray-50"
                  >
                    Tutup
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleEdit(selectedBeneficiary);
                    }}
                    className="rounded-full bg-[#001B55] hover:bg-[#FF9C04] text-white font-semibold"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Data
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl rounded-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#001B55] flex items-center gap-3">
                <div className="p-2 bg-[#001B55]/10 rounded-xl">
                  <Plus className="w-6 h-6 text-[#001B55]" />
                </div>
                {selectedBeneficiary
                  ? "Edit Penerima Manfaat"
                  : "Tambah Penerima Manfaat"}
              </DialogTitle>
            </DialogHeader>

            <div className="py-6">
              <div className="p-6 bg-gradient-to-r from-[#FF9C04]/10 to-[#FF9C04]/5 rounded-2xl border-2 border-[#FF9C04]/20">
                <p className="text-[#001B55] font-semibold text-center">
                  🚧 Fitur ini akan segera tersedia
                </p>
                <p className="text-gray-600 text-sm text-center mt-2">
                  Saat ini masih menggunakan mock data untuk testing UI
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
