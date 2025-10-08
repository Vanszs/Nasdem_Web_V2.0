"use client";

import { useState } from "react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
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
  Upload,
  FileSpreadsheet,
  Vote,
  Info,
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
  category: string; // Kategori manfaat
  familyCount: number; // Jumlah keluarga
  proposerName: string; // Nama pengusul
  status: "Aktif" | "Menunggu" | "Selesai" | "Ditolak";
  registeredAt: string;
  updatedAt: string;
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
      address: "Jl. Raya Sidoarjo No. 123, RT 05 RW 03, Kel. Lemahputro, Kec. Sidoarjo",
      dateOfBirth: "1985-05-15",
      gender: "Laki-laki",
      occupation: "Pedagang",
      program: "Pemberdayaan UMKM",
      programId: "1",
      category: "Bantuan Modal Usaha",
      familyCount: 4,
      proposerName: "Budi Santoso",
      status: "Aktif",
      registeredAt: "2024-01-15",
      updatedAt: "2024-01-15",
      notes: "Memiliki usaha kuliner di pasar tradisional",
    },
    {
      id: "2",
      fullName: "Siti Aminah",
      nik: "3515012345670002",
      email: "siti.aminah@email.com",
      phone: "081234567891",
      address: "Jl. Pahlawan No. 45, RT 02 RW 01, Kel. Bulusidokare, Kec. Sidoarjo",
      dateOfBirth: "1990-08-20",
      gender: "Perempuan",
      occupation: "Ibu Rumah Tangga",
      program: "Beasiswa Prestasi",
      programId: "2",
      category: "Beasiswa Pendidikan",
      familyCount: 3,
      proposerName: "Dewi Kusuma",
      status: "Aktif",
      registeredAt: "2024-02-01",
      updatedAt: "2024-02-01",
      notes: "Anak berprestasi di bidang akademik, juara olimpiade matematika",
    },
    {
      id: "3",
      fullName: "Budi Santoso",
      nik: "3515012345670003",
      email: "budi.santoso@email.com",
      phone: "081234567892",
      address: "Jl. Merdeka No. 78, RT 07 RW 04, Kel. Magersari, Kec. Sidoarjo",
      dateOfBirth: "1988-03-10",
      gender: "Laki-laki",
      occupation: "Petani",
      program: "Pemberdayaan UMKM",
      programId: "1",
      category: "Bantuan Alat Pertanian",
      familyCount: 5,
      proposerName: "Ahmad Sulaiman",
      status: "Menunggu",
      registeredAt: "2024-02-10",
      updatedAt: "2024-02-10",
      notes: "Membutuhkan alat pertanian untuk meningkatkan produktivitas",
    },
    {
      id: "4",
      fullName: "Dewi Kusuma",
      nik: "3515012345670004",
      email: "dewi.kusuma@email.com",
      phone: "081234567893",
      address: "Jl. Kartini No. 90, RT 03 RW 02, Kel. Cemengkalang, Kec. Sidoarjo",
      dateOfBirth: "1992-11-25",
      gender: "Perempuan",
      occupation: "Guru",
      program: "Beasiswa Prestasi",
      programId: "2",
      category: "Bantuan Kesehatan",
      familyCount: 2,
      proposerName: "Siti Aminah",
      status: "Selesai",
      registeredAt: "2024-01-20",
      updatedAt: "2024-03-01",
      notes: "Bantuan biaya operasi kesehatan telah selesai diberikan",
    },
    {
      id: "5",
      fullName: "Joko Widodo",
      nik: "3515012345670005",
      email: "joko.widodo@email.com",
      phone: "081234567894",
      address: "Jl. Sudirman No. 12, RT 01 RW 01, Kel. Sekardangan, Kec. Sidoarjo",
      dateOfBirth: "1987-07-18",
      gender: "Laki-laki",
      occupation: "Montir",
      program: "Pemberdayaan UMKM",
      programId: "1",
      category: "Bantuan Renovasi Rumah",
      familyCount: 6,
      proposerName: "Joko Santoso",
      status: "Aktif",
      registeredAt: "2024-02-05",
      updatedAt: "2024-02-05",
      notes: "Renovasi rumah untuk kondisi yang lebih layak",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProgram, setFilterProgram] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    nik: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",
    programId: "",
    category: "",
    familyCount: "1",
    proposerName: "",
    notes: "",
  });

  // Categories for benefit types
  const categories = [
    "Bantuan Modal Usaha",
    "Bantuan Alat Pertanian",
    "Bantuan Pendidikan",
    "Bantuan Kesehatan",
    "Bantuan Renovasi Rumah",
    "Lainnya",
  ];

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
      beneficiary.nik.includes(searchTerm) ||
      beneficiary.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.proposerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === "all" || beneficiary.status === filterStatus;

    const matchProgram =
      filterProgram === "all" || beneficiary.programId === filterProgram;

    const matchCategory =
      filterCategory === "all" || beneficiary.category === filterCategory;

    return matchSearch && matchStatus && matchProgram && matchCategory;
  });

  // Statistics
  const totalFamily = beneficiaries.reduce(
    (sum, b) => sum + b.familyCount,
    0
  );
  const potentialVotes = Math.round(
    (beneficiaries.length + totalFamily) / 2
  );

  const stats = {
    total: beneficiaries.length,
    active: beneficiaries.filter((b) => b.status === "Aktif").length,
    waiting: beneficiaries.filter((b) => b.status === "Menunggu").length,
    completed: beneficiaries.filter((b) => b.status === "Selesai").length,
    totalFamily,
    potentialVotes,
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
    setFormData({
      fullName: beneficiary.fullName,
      nik: beneficiary.nik,
      email: beneficiary.email,
      phone: beneficiary.phone,
      address: beneficiary.address,
      dateOfBirth: beneficiary.dateOfBirth,
      gender: beneficiary.gender,
      occupation: beneficiary.occupation,
      programId: beneficiary.programId,
      category: beneficiary.category,
      familyCount: beneficiary.familyCount.toString(),
      proposerName: beneficiary.proposerName,
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    toast.success("Berhasil", {
      description: "Penerima manfaat berhasil dihapus",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedBeneficiary) {
      // Update existing
      setBeneficiaries((prev) =>
        prev.map((b) =>
          b.id === selectedBeneficiary.id
            ? {
                ...b,
                fullName: formData.fullName,
                nik: formData.nik,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender as "Laki-laki" | "Perempuan",
                occupation: formData.occupation,
                programId: formData.programId,
                category: formData.category,
                familyCount: parseInt(formData.familyCount) || 1,
                proposerName: formData.proposerName,
                updatedAt: new Date().toISOString(),
              }
            : b
        )
      );
      toast.success("Berhasil", {
        description: "Data penerima manfaat berhasil diupdate",
      });
    } else {
      // Add new
      const programName =
        programs.find((p) => p.id === formData.programId)?.name || "";
      const newBeneficiary: Beneficiary = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        nik: formData.nik,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as "Laki-laki" | "Perempuan",
        occupation: formData.occupation,
        program: programName,
        programId: formData.programId,
        category: formData.category,
        familyCount: parseInt(formData.familyCount) || 1,
        proposerName: formData.proposerName,
        status: "Menunggu",
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBeneficiaries((prev) => [newBeneficiary, ...prev]);
      toast.success("Berhasil", {
        description: "Penerima manfaat baru berhasil ditambahkan",
      });
    }

    setIsDialogOpen(false);
    setSelectedBeneficiary(null);
    setFormData({
      fullName: "",
      nik: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      gender: "",
      occupation: "",
      programId: "",
      category: "",
      familyCount: "1",
      proposerName: "",
      notes: "",
    });
  };

  const handleExport = () => {
    const csvHeaders = [
      "No",
      "Nama Lengkap",
      "NIK",
      "Email",
      "Telepon",
      "Alamat Lengkap",
      "Tanggal Lahir",
      "Jenis Kelamin",
      "Pekerjaan",
      "Program",
      "Kategori",
      "Jumlah Keluarga",
      "Nama Pengusul",
      "Status",
      "Tgl. Daftar",
    ];

    const csvRows = filteredBeneficiaries.map((b, index) => [
      index + 1,
      b.fullName,
      b.nik,
      b.email,
      b.phone,
      b.address,
      new Date(b.dateOfBirth).toLocaleDateString("id-ID"),
      b.gender,
      b.occupation,
      programs.find((p) => p.id === b.programId)?.name || "-",
      b.category,
      b.familyCount,
      b.proposerName,
      b.status,
      new Date(b.registeredAt).toLocaleDateString("id-ID"),
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `penerima-manfaat-${new Date().getTime()}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export Data", {
      description: "Data penerima manfaat berhasil diexport",
    });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split("\n");
        const headers = lines[0].split(",");

        const newBeneficiaries: Beneficiary[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim());

          const programName = values[9] || "";
          newBeneficiaries.push({
            id: Date.now().toString() + i,
            fullName: values[1] || "",
            nik: values[2] || "",
            email: values[3] || "",
            phone: values[4] || "",
            address: values[5] || "",
            dateOfBirth: values[6] || new Date().toISOString(),
            gender: (values[7] as "Laki-laki" | "Perempuan") || "Laki-laki",
            occupation: values[8] || "",
            program: programName,
            programId: programs.find((p) => p.name === programName)?.id || "1",
            category: values[10] || "Lainnya",
            familyCount: parseInt(values[11]) || 1,
            proposerName: values[12] || "",
            status: (values[13] as Beneficiary["status"]) || "Menunggu",
            registeredAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        setBeneficiaries((prev) => [...newBeneficiaries, ...prev]);
        setIsCsvDialogOpen(false);
        toast.success("Berhasil", {
          description: `${newBeneficiaries.length} penerima manfaat berhasil diimport`,
        });
      } catch (error) {
        toast.error("Gagal", {
          description: "Format CSV tidak valid",
        });
      }
    };
    reader.readAsText(file);
  };

  const downloadCsvTemplate = () => {
    const templateHeaders = [
      "No",
      "Nama Lengkap",
      "NIK",
      "Email",
      "Telepon",
      "Alamat Lengkap",
      "Tanggal Lahir (YYYY-MM-DD)",
      "Jenis Kelamin",
      "Pekerjaan",
      "Program",
      "Kategori",
      "Jumlah Keluarga",
      "Nama Pengusul",
      "Status",
    ];

    const templateRow = [
      "1",
      "Contoh Nama",
      "3515010101900001",
      "contoh@email.com",
      "081234567890",
      "Jl. Contoh No. 123, RT 01 RW 02, Kel. Contoh, Kec. Contoh",
      "1990-01-01",
      "Laki-laki",
      "Wiraswasta",
      "Pemberdayaan UMKM",
      "Bantuan Modal Usaha",
      "4",
      "Nama Pengusul",
      "Menunggu",
    ];

    const csvContent = [
      templateHeaders.join(","),
      templateRow.map((cell) => `"${cell}"`).join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template-penerima-manfaat.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Template Downloaded", {
      description: "Template CSV berhasil didownload",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            role="status"
            aria-label="KPI Total Penerima"
            className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Total Penerima
              </span>
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-primary" />
              </div>
            </div>
            <div className="text-num font-semibold text-text-primary">
              {stats.total}
            </div>
          </div>

          <div
            role="status"
            aria-label="KPI Status Aktif"
            className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Status Aktif
              </span>
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-brand-primary" />
              </div>
            </div>
            <div className="text-num font-semibold text-text-primary">
              {stats.active}
            </div>
          </div>

          <div
            role="status"
            aria-label="KPI Menunggu"
            className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Menunggu
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#FF9C04]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FF9C04]" />
              </div>
            </div>
            <div className="text-num font-semibold text-[#FF9C04]">
              {stats.waiting}
            </div>
          </div>

          <div
            role="status"
            aria-label="KPI Selesai"
            className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Selesai
              </span>
              <div className="w-10 h-10 rounded-lg bg-brand-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-success" />
              </div>
            </div>
            <div className="text-num font-semibold text-brand-success">
              {stats.completed}
            </div>
          </div>

          <div
            role="status"
            aria-label="KPI Total Keluarga"
            className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Total Keluarga
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#E8F9FF] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#001B55]" />
              </div>
            </div>
            <div className="text-num font-semibold text-[#001B55]">
              {stats.totalFamily}
            </div>
          </div>

          <div
            role="status"
            aria-label="KPI Potensi Suara"
            className="rounded-xl bg-gradient-to-br from-[#C5BAFF] to-[#C4D9FF] shadow-md p-5 border border-[#C5BAFF] hover:shadow-lg transition-all duration-200 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#001B55] font-semibold">
                Potensi Suara
              </span>
              <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
                <Vote className="w-5 h-5 text-[#001B55]" />
              </div>
            </div>
            <div className="text-num font-bold text-[#001B55]">
              {stats.potentialVotes}
            </div>
            <div className="text-xs text-[#001B55]/70 font-medium">
              (Total Penerima + Keluarga) / 2
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <Card className="rounded-xl border border-[#E8F9FF] shadow-sm">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E8F9FF] flex items-center justify-center">
                  <HandHeart className="w-5 h-5 text-[#001B55]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-[#001B55]">
                    Daftar Penerima Manfaat
                  </CardTitle>
                  <CardDescription className="text-sm text-[#475569]">
                    {filteredBeneficiaries.length} penerima manfaat ditemukan
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="rounded-lg border border-[#C4D9FF] hover:bg-[#E8F9FF] text-[#001B55] font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button
                  onClick={() => setIsCsvDialogOpen(true)}
                  variant="outline"
                  className="rounded-lg border border-[#C5BAFF] hover:bg-[#C5BAFF]/10 text-[#001B55] font-medium"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
                <Button
                  onClick={() => {
                    setSelectedBeneficiary(null);
                    setFormData({
                      fullName: "",
                      nik: "",
                      email: "",
                      phone: "",
                      address: "",
                      dateOfBirth: "",
                      gender: "",
                      occupation: "",
                      programId: "",
                      category: "",
                      familyCount: "1",
                      proposerName: "",
                      notes: "",
                    });
                    setIsDialogOpen(true);
                  }}
                  className="rounded-lg bg-[#001B55] hover:bg-[#001B55]/90 text-white font-medium shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Penerima Manfaat
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nama, alamat, pengusul..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF] transition-all"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF]">
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
                <SelectTrigger className="h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF]">
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

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter Kategori" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-[#E8F9FF] overflow-hidden">
              <Table>
                <TableHeader className="bg-[#E8F9FF]">
                  <TableRow className="hover:bg-[#E8F9FF]">
                    <TableHead className="font-semibold text-[#001B55]">
                      Nama Lengkap
                    </TableHead>
                    <TableHead className="font-semibold text-[#001B55]">
                      NIK
                    </TableHead>
                    <TableHead className="font-semibold text-[#001B55]">
                      Kontak
                    </TableHead>
                    <TableHead className="font-semibold text-[#001B55]">
                      Alamat Lengkap
                    </TableHead>
                    <TableHead className="font-semibold text-[#001B55]">
                      Program
                    </TableHead>
                    <TableHead className="font-semibold text-[#001B55]">
                      Kategori
                    </TableHead>
                    <TableHead className="font-semibold text-[#001B55] text-center">
                      Jml. Keluarga
                    </TableHead>
                    <TableHead className="font-semibold text-[#001B55]">
                      Pengusul
                    </TableHead>
                    <TableHead className="font-semibold text-[#001B55]">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-[#001B55]">
                      Terdaftar
                    </TableHead>
                    <TableHead className="font-semibold text-[#001B55] text-right">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBeneficiaries.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center py-8 text-gray-500"
                      >
                        Tidak ada data penerima manfaat
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBeneficiaries.map((beneficiary, index) => (
                      <TableRow
                        key={beneficiary.id}
                        className={`hover:bg-[#F0F6FF] transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-[#E8F9FF]/30"
                        }`}
                      >
                        <TableCell className="font-semibold text-[#001B55]">
                          {beneficiary.fullName}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
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
                        <TableCell className="text-gray-600 text-sm max-w-[200px]">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">
                              {beneficiary.address}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {beneficiary.program}
                        </TableCell>
                        <TableCell className="text-sm">
                          <Badge className="bg-[#C5BAFF]/20 text-[#001B55] border border-[#C5BAFF]/30 font-medium">
                            {beneficiary.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Users className="w-4 h-4 text-[#001B55]" />
                            <span className="font-semibold text-[#001B55]">
                              {beneficiary.familyCount}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {beneficiary.proposerName}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(beneficiary.status)}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
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
                              className="rounded-lg border-[#C4D9FF] hover:bg-[#E8F9FF] text-[#001B55]"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(beneficiary)}
                              className="rounded-lg border-[#C4D9FF] hover:bg-[#E8F9FF] text-[#001B55]"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(beneficiary.id)}
                              className="rounded-lg border-[#F87171]/20 hover:bg-[#F87171]/5 text-[#F87171]"
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
          <DialogContent className="max-w-2xl rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#001B55] flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F9FF] rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#001B55]" />
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
                        Kategori Manfaat
                      </Label>
                      <Badge className="bg-[#C5BAFF]/20 text-[#001B55] border border-[#C5BAFF]/30 font-medium">
                        {selectedBeneficiary.category}
                      </Badge>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        Jumlah Keluarga
                      </Label>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#001B55]" />
                        <span className="text-[#001B55] font-semibold">
                          {selectedBeneficiary.familyCount} orang
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm font-medium mb-1 block">
                        Nama Pengusul
                      </Label>
                      <p className="text-gray-700">
                        {selectedBeneficiary.proposerName}
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
                  <div className="p-4 bg-[#E8F9FF]/50 rounded-lg border border-[#C4D9FF]">
                    <Label className="text-gray-600 text-sm font-medium mb-2 block">
                      Catatan
                    </Label>
                    <p className="text-gray-700">{selectedBeneficiary.notes}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-[#E8F9FF]">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                    className="rounded-lg border-[#C4D9FF] hover:bg-[#E8F9FF] text-[#001B55]"
                  >
                    Tutup
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleEdit(selectedBeneficiary);
                    }}
                    className="rounded-lg bg-[#001B55] hover:bg-[#001B55]/90 text-white font-semibold"
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
          <DialogContent className="max-w-4xl rounded-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#001B55] flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F9FF] rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-[#001B55]" />
                </div>
                {selectedBeneficiary
                  ? "Edit Penerima Manfaat"
                  : "Tambah Penerima Manfaat"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Lengkap */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Masukkan nama lengkap"
                    required
                    className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]"
                  />
                </div>

                {/* NIK */}
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK *</Label>
                  <Input
                    id="nik"
                    value={formData.nik}
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value })
                    }
                    placeholder="16 digit NIK"
                    required
                    maxLength={16}
                    className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    required
                    className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Telepon *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="08xxxxxxxxxx"
                    required
                    className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Tanggal Lahir *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    required
                    className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]"
                  />
                </div>

                {/* Jenis Kelamin */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                    required
                  >
                    <SelectTrigger className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pekerjaan */}
                <div className="space-y-2">
                  <Label htmlFor="occupation">Pekerjaan *</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) =>
                      setFormData({ ...formData, occupation: e.target.value })
                    }
                    placeholder="Masukkan pekerjaan"
                    required
                    className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]"
                  />
                </div>

                {/* Program */}
                <div className="space-y-2">
                  <Label htmlFor="programId">Program *</Label>
                  <Select
                    value={formData.programId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, programId: value })
                    }
                    required
                  >
                    <SelectTrigger className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]">
                      <SelectValue placeholder="Pilih program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Kategori */}
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori Manfaat *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Jumlah Keluarga */}
                <div className="space-y-2">
                  <Label htmlFor="familyCount">Jumlah Keluarga *</Label>
                  <Input
                    id="familyCount"
                    type="number"
                    min="1"
                    value={formData.familyCount}
                    onChange={(e) =>
                      setFormData({ ...formData, familyCount: e.target.value })
                    }
                    placeholder="1"
                    required
                    className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]"
                  />
                </div>

                {/* Nama Pengusul */}
                <div className="space-y-2">
                  <Label htmlFor="proposerName">Nama Pengusul *</Label>
                  <Input
                    id="proposerName"
                    value={formData.proposerName}
                    onChange={(e) =>
                      setFormData({ ...formData, proposerName: e.target.value })
                    }
                    placeholder="Nama yang mengusulkan"
                    required
                    className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]"
                  />
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap (dengan RT/RW) *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Jl. Nama Jalan No. XX, RT XX RW XX, Kel. XXX, Kec. XXX"
                  required
                  rows={3}
                  className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]"
                />
              </div>

              {/* Catatan */}
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Catatan tambahan (opsional)"
                  rows={3}
                  className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8F9FF]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-lg border-[#C4D9FF] hover:bg-[#E8F9FF] text-[#001B55]"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="rounded-lg bg-[#001B55] hover:bg-[#001B55]/90 text-white"
                >
                  {selectedBeneficiary ? "Update" : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* CSV Import Dialog */}
        <Dialog open={isCsvDialogOpen} onOpenChange={setIsCsvDialogOpen}>
          <DialogContent className="max-w-2xl rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#001B55] flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C5BAFF]/20 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-[#001B55]" />
                </div>
                Import Data dari CSV
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="p-4 bg-[#E8F9FF] rounded-lg border border-[#C4D9FF]">
                <h4 className="font-semibold text-[#001B55] mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Panduan Import CSV
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 ml-6 list-disc">
                  <li>Download template CSV terlebih dahulu</li>
                  <li>Isi data sesuai format yang tersedia</li>
                  <li>Upload file CSV yang sudah diisi</li>
                  <li>
                    Pastikan format tanggal dalam bentuk YYYY-MM-DD (contoh:
                    2024-01-15)
                  </li>
                  <li>Jumlah keluarga harus berupa angka</li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={downloadCsvTemplate}
                  variant="outline"
                  className="rounded-lg border-[#C4D9FF] hover:bg-[#E8F9FF] text-[#001B55] w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template CSV
                </Button>

                <div className="relative">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF] cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#C5BAFF] file:text-[#001B55] file:font-semibold hover:file:bg-[#C5BAFF]/80"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8F9FF]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCsvDialogOpen(false)}
                  className="rounded-lg border-[#C4D9FF] hover:bg-[#E8F9FF] text-[#001B55]"
                >
                  Tutup
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
