"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  DialogDescription,
  DialogFooter,
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
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import CsvDownloader from "react-csv-downloader";
import { BeneficiaryFormDialog } from "./components/BeneficiaryFormDialog";
import { DeleteBeneficiaryDialog } from "./components/DeleteBeneficiaryDialog";
import type {
  Beneficiary as ApiBeneficiary,
  CreateBeneficiaryInput,
} from "./types";

// Types
interface Beneficiary {
  id: number | string;
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
  category: string; // gunakan program.category
  familyCount: number;
  proposerName: string;
  status: "Menunggu" | "Selesai";
  registeredAt: string;
  updatedAt: string;
  notes?: string;
}

export default function BeneficiariesPage() {
  const queryClient = useQueryClient();
  // Data dari API
  const { data: programsRes } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const res = await fetch("/api/programs", { credentials: "include" });
      if (!res.ok) throw new Error("Gagal memuat program");
      return res.json();
    },
  });
  const programs: { id: string; name: string; category: string }[] = useMemo(
    () =>
      ((programsRes?.data ?? []) as any[]).map((p: any) => ({
        id: String(p.id),
        name: p.name as string,
        category: p.category as string,
      })),
    [programsRes]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProgram, setFilterProgram] = useState<string>("all");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const debouncedStatus = useDebounce(filterStatus, 400);
  const debouncedProgram = useDebounce(filterProgram, 400);
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [beneficiaryToDelete, setBeneficiaryToDelete] =
    useState<Beneficiary | null>(null);

  // Edit state via reusable dialog
  const [editing, setEditing] = useState<ApiBeneficiary | null>(null);

  // Import CSV mutation: create many sequentially
  const importMutation = useMutation({
    mutationFn: async (items: CreateBeneficiaryInput[]) => {
      let success = 0;
      for (const item of items) {
        const res = await fetch("/api/beneficiaries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(item),
        });
        if (res.ok) success++;
      }
      return { success, total: items.length };
    },
    onSuccess: ({ success, total }) => {
      toast.success("Import selesai", {
        description: `${success}/${total} baris berhasil disimpan`,
      });
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      setIsCsvDialogOpen(false);
    },
    onError: (e: any) =>
      toast.error(e?.message || "Gagal import data dari CSV"),
  });

  // Ambil data beneficiaries dari API dan mapping ke UI
  const { data: beneficiariesRes, isLoading } = useQuery({
    queryKey: [
      "beneficiaries",
      {
        search: debouncedSearch,
        status: debouncedStatus,
        programId: debouncedProgram,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("pageSize", "200");
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (debouncedStatus !== "all") params.set("status", debouncedStatus);
      if (debouncedProgram !== "all") params.set("programId", debouncedProgram);
      const res = await fetch(`/api/beneficiaries?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal memuat data penerima manfaat");
      return res.json();
    },
  });

  const beneficiaries: Beneficiary[] = useMemo(() => {
    const api: ApiBeneficiary[] = beneficiariesRes?.data ?? [];
    const mapGender = (g?: string | null) =>
      g === "female" ? "Perempuan" : "Laki-laki";
    const mapStatus = (s: string) =>
      s === "completed" ? "Selesai" : "Menunggu";
    return api.map((b) => ({
      id: b.id,
      fullName: b.fullName,
      nik: b.nik ?? "",
      email: b.email ?? "",
      phone: b.phone ?? "",
      address: b.fullAddress ?? "",
      dateOfBirth: b.dateOfBirth ?? "",
      gender: mapGender(b.gender as any) as any,
      occupation: b.occupation ?? "",
      program: b.program?.name ?? String(b.programId),
      programId: String(b.programId),
      category: b.program?.category ?? "",
      familyCount: b.familyMemberCount ?? 0,
      proposerName: b.proposerName ?? "",
      status: mapStatus(b.status) as any,
      registeredAt: b.receivedAt,
      updatedAt: b.receivedAt,
      notes: b.notes ?? "",
    }));
  }, [beneficiariesRes]);

  // API handles filtering; use server results directly
  const filteredBeneficiaries = beneficiaries;

  // Statistics
  const totalFamily = beneficiaries.reduce((sum, b) => sum + b.familyCount, 0);
  const potentialVotes = Math.round((beneficiaries.length + totalFamily) / 2);

  const stats = {
    total: beneficiaries.length,
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
    // Open reusable dialog with prefilled data
    setEditing({
      id: Number(beneficiary.id),
      programId: parseInt(beneficiary.programId, 10),
      receivedAt: beneficiary.registeredAt,
      fullName: beneficiary.fullName,
      email: beneficiary.email,
      nik: beneficiary.nik,
      phone: beneficiary.phone,
      dateOfBirth: beneficiary.dateOfBirth,
      gender: beneficiary.gender === "Perempuan" ? "female" : "male",
      occupation: beneficiary.occupation,
      familyMemberCount: beneficiary.familyCount,
      proposerName: beneficiary.proposerName,
      fullAddress: beneficiary.address,
      notes: beneficiary.notes,
      status: beneficiary.status === "Selesai" ? "completed" : "pending",
    });
  };

  // Delete handled by DeleteBeneficiaryDialog (API + invalidasi query)

  const openDeleteDialog = (beneficiary: Beneficiary) => {
    setBeneficiaryToDelete(beneficiary);
    setIsDeleteDialogOpen(true);
  };

  // Submit ditangani oleh BeneficiaryFormDialog

  // Export handled by CsvDownloader

  // CSV parser util: split by commas outside quotes and unquote values
  const splitCsvLine = (line: string) => {
    const parts: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        parts.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    parts.push(current);
    return parts.map((v) => v.trim());
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = (event.target?.result as string) || "";
        const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) throw new Error("CSV kosong");

        const headerCells = splitCsvLine(lines[0]).map((h) =>
          h.replace(/^"|"$/g, "")
        );
        const headerIndex: Record<string, number> = {};
        headerCells.forEach((h, idx) => {
          headerIndex[h] = idx;
        });

        const required = ["programId", "fullName"];
        const missing = required.filter((r) => !(r in headerIndex));
        if (missing.length) {
          throw new Error(`Kolom wajib hilang: ${missing.join(", ")}`);
        }

        const newItems: CreateBeneficiaryInput[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = splitCsvLine(lines[i]).map((v) =>
            v.replace(/^"|"$/g, "")
          );
          if (row.length === 0 || row.every((c) => c.trim() === "")) continue;

          const programId = row[headerIndex["programId"]] || "";
          const programName =
            headerIndex["programName"] !== undefined
              ? row[headerIndex["programName"]]
              : programs.find((p) => p.id === programId)?.name || "";
          const fullName = row[headerIndex["fullName"]] || "";
          const nik =
            headerIndex["nik"] !== undefined ? row[headerIndex["nik"]] : "";
          const email =
            headerIndex["email"] !== undefined ? row[headerIndex["email"]] : "";
          const phone =
            headerIndex["phone"] !== undefined ? row[headerIndex["phone"]] : "";
          const fullAddress =
            headerIndex["fullAddress"] !== undefined
              ? row[headerIndex["fullAddress"]]
              : "";
          const dateOfBirth =
            headerIndex["dateOfBirth"] !== undefined
              ? row[headerIndex["dateOfBirth"]]
              : "";
          const genderRaw =
            headerIndex["gender"] !== undefined
              ? row[headerIndex["gender"]]
              : "";
          const occupation =
            headerIndex["occupation"] !== undefined
              ? row[headerIndex["occupation"]]
              : "";
          const familyMemberCount =
            headerIndex["familyMemberCount"] !== undefined
              ? row[headerIndex["familyMemberCount"]]
              : "";
          const proposerName =
            headerIndex["proposerName"] !== undefined
              ? row[headerIndex["proposerName"]]
              : "";
          const statusRaw =
            headerIndex["status"] !== undefined
              ? row[headerIndex["status"]]
              : "";
          const receivedAt =
            headerIndex["receivedAt"] !== undefined
              ? row[headerIndex["receivedAt"]]
              : "";
          const notes =
            headerIndex["notes"] !== undefined ? row[headerIndex["notes"]] : "";

          const gender = ((): "male" | "female" | null => {
            const g = (genderRaw || "").toLowerCase();
            if (g === "female" || g === "perempuan" || g === "p")
              return "female";
            if (g === "male" || g === "laki-laki" || g === "l") return "male";
            return null;
          })();

          const status = ((): "pending" | "completed" => {
            const s = (statusRaw || "").toLowerCase();
            if (s === "completed" || s === "selesai") return "completed";
            return "pending";
          })();

          const resolvedProgramId = programId
            ? Number(programId)
            : Number(programs.find((p) => p.name === programName)?.id ?? 0);

          newItems.push({
            programId: resolvedProgramId,
            fullName,
            email: email || null,
            nik: nik || null,
            phone: phone || null,
            dateOfBirth: dateOfBirth || null,
            gender,
            occupation: occupation || null,
            familyMemberCount:
              parseInt(String(familyMemberCount), 10) || undefined,
            proposerName: proposerName || null,
            fullAddress: fullAddress || null,
            notes: notes || null,
            status,
          });
        }

        if (newItems.length === 0) {
          toast.error("Gagal", { description: "Tidak ada baris valid" });
          return;
        }
        importMutation.mutate(newItems);
      } catch (error) {
        toast.error("Gagal", {
          description: "Format CSV tidak valid",
        });
      }
    };
    reader.readAsText(file);
  };

  // CSV columns aligned with ProgramBenefitRecipient schema
  const CSV_COLUMNS = [
    { id: "programId", displayName: "programId" },
    { id: "programName", displayName: "programName" },
    { id: "fullName", displayName: "fullName" },
    { id: "nik", displayName: "nik" },
    { id: "email", displayName: "email" },
    { id: "phone", displayName: "phone" },
    { id: "fullAddress", displayName: "fullAddress" },
    { id: "dateOfBirth", displayName: "dateOfBirth" },
    { id: "gender", displayName: "gender" },
    { id: "occupation", displayName: "occupation" },
    { id: "familyMemberCount", displayName: "familyMemberCount" },
    { id: "proposerName", displayName: "proposerName" },
    { id: "status", displayName: "status" },
    { id: "receivedAt", displayName: "receivedAt" },
    { id: "notes", displayName: "notes" },
  ];

  const exportRows = useMemo(() => {
    const mapStatusToEnum = (s: Beneficiary["status"]) => {
      if (s === "Selesai") return "completed";
      return "pending";
    };
    const mapGender = (g: Beneficiary["gender"]) =>
      g === "Perempuan" ? "female" : "male";

    return filteredBeneficiaries.map((b) => ({
      programId: b.programId,
      programName: b.program,
      fullName: b.fullName,
      nik: b.nik,
      email: b.email,
      phone: b.phone,
      fullAddress: b.address,
      dateOfBirth: b.dateOfBirth?.slice(0, 10),
      gender: mapGender(b.gender),
      occupation: b.occupation,
      familyMemberCount: b.familyCount,
      proposerName: b.proposerName,
      status: mapStatusToEnum(b.status),
      receivedAt: b.registeredAt?.slice(0, 10),
      notes: b.notes || "",
    }));
  }, [filteredBeneficiaries]);

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
                    {beneficiaries.length} penerima manfaat ditemukan
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <CsvDownloader
                  filename={`program-beneficiaries-${Date.now()}`}
                  extension=".csv"
                  columns={CSV_COLUMNS}
                  datas={exportRows}
                >
                  <Button
                    variant="outline"
                    className="rounded-lg border border-[#C4D9FF] hover:bg-[#E8F9FF] text-[#001B55] font-medium"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </CsvDownloader>
                <Button
                  onClick={() => setIsCsvDialogOpen(true)}
                  variant="outline"
                  className="rounded-lg border border-[#C5BAFF] hover:bg-[#C5BAFF]/10 text-[#001B55] font-medium"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import CSV
                </Button>
                <BeneficiaryFormDialog
                  editing={editing}
                  onClose={() => setEditing(null)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nama, alamat, pengusul..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF] transition-all"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-10 w-full rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF]">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Filter Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterProgram} onValueChange={setFilterProgram}>
                  <SelectTrigger className="h-10 w-full rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF]">
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
            </div>

            {/* Table */}
            <div className="rounded-lg border border-[#E8F9FF] overflow-hidden">
              <div className="overflow-x-auto">
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
                      <TableHead className="font-semibold text-[#001B55] text-right sticky right-0 bg-[#E8F9FF] z-10 min-w-[200px]">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beneficiaries.length === 0 ? (
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
                          <TableCell className="text-right sticky right-0 bg-white z-10 min-w-[200px] shadow-[ -5px 0 5px -5px rgba(0,0,0,0.1)]">
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
                                onClick={() => openDeleteDialog(beneficiary)}
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
            </div>
          </CardContent>
        </Card>

        {/* View Detail Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-auto rounded-xl">
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
                      <p className="text-gray-700">
                        {selectedBeneficiary.gender}
                      </p>
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

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#E8F9FF]">
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

        {/* Add/Edit handled by BeneficiaryFormDialog */}

        {/* CSV Import Dialog */}
        <Dialog open={isCsvDialogOpen} onOpenChange={setIsCsvDialogOpen}>
          <DialogContent className="max-w-3xl rounded-xl">
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
                  <li>Download template CSV terlebih dahulu.</li>
                  <li>
                    Kolom wajib: <b>programId</b>, <b>fullName</b>.
                  </li>
                  <li>
                    Gunakan format tanggal YYYY-MM-DD untuk <b>dateOfBirth</b>{" "}
                    dan <b>receivedAt</b>.
                  </li>
                  <li>
                    Nilai <b>gender</b>: male atau female.
                  </li>
                  <li>
                    Nilai <b>status</b>: pending atau completed.
                  </li>
                  <li>
                    <b>familyMemberCount</b> harus berupa angka.
                  </li>
                  <li>
                    Opsional: <b>programName</b> untuk memudahkan verifikasi
                    visual.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <CsvDownloader
                  filename="template-program-beneficiaries"
                  extension=".csv"
                  columns={CSV_COLUMNS}
                  datas={[]}
                >
                  <Button
                    variant="outline"
                    className="rounded-lg border-[#C4D9FF] hover:bg-[#E8F9FF] text-[#001B55] w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template CSV
                  </Button>
                </CsvDownloader>

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

      <DeleteBeneficiaryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        beneficiary={
          beneficiaryToDelete
            ? {
                id: Number(beneficiaryToDelete.id),
                programId: Number(beneficiaryToDelete.programId),
                receivedAt: beneficiaryToDelete.registeredAt,
                fullName: beneficiaryToDelete.fullName,
                email: beneficiaryToDelete.email || null,
                nik: beneficiaryToDelete.nik || null,
                phone: beneficiaryToDelete.phone || null,
                dateOfBirth: beneficiaryToDelete.dateOfBirth || null,
                gender: (beneficiaryToDelete.gender === "Perempuan"
                  ? "female"
                  : "male") as any,
                occupation: beneficiaryToDelete.occupation || null,
                familyMemberCount: beneficiaryToDelete.familyCount || null,
                proposerName: beneficiaryToDelete.proposerName || null,
                fullAddress: beneficiaryToDelete.address || null,
                notes: beneficiaryToDelete.notes || null,
                status:
                  beneficiaryToDelete.status === "Selesai"
                    ? "completed"
                    : ("pending" as any),
                program: undefined,
              }
            : null
        }
      />
    </AdminLayout>
  );
}
