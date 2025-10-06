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
  Target,
  TrendingUp,
  ChevronDown,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { toast } from "sonner";

// Types
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

export default function ProgramsPage() {
  // State
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

  // Form states
  const [programForm, setProgramForm] = useState<Partial<Program>>({});
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getStatusBadge = (status: Program["status"]) => {
    const colors = {
      Berlangsung:
        "bg-[#001B55]/10 text-[#001B55] border border-[#001B55]/20 font-semibold",
      Selesai:
        "bg-[#FF9C04]/10 text-[#FF9C04] border border-[#FF9C04]/20 font-semibold",
      Tertunda:
        "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 font-semibold",
      Perencanaan:
        "bg-[#6B7280]/10 text-[#6B7280] border border-[#6B7280]/20 font-semibold",
    };

    return <Badge className={colors[status]}>{status}</Badge>;
  };

  // CRUD functions
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

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Program Kerja" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#001B55] rounded-2xl shadow-lg">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#001B55] leading-tight">
                  Program Kerja
                </h1>
                <p className="text-[#6B7280] mt-1">
                  Kelola program kerja DPD NasDem Sidoarjo
                </p>
              </div>
            </div>
            <Dialog
              open={isProgramDialogOpen}
              onOpenChange={setIsProgramDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="h-14 px-8 rounded-full bg-[#FF9C04] hover:bg-[#E08A00] text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <Plus className="w-5 h-5 mr-2" />
                  Tambah Program
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-[#001B55]">
                    {editingProgram ? "Edit Program" : "Tambah Program Baru"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="programName" className="font-bold text-[#001B55]">
                        Nama Program <span className="text-[#C81E1E]">*</span>
                      </Label>
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
                        className="h-12 rounded-xl border-2"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category" className="font-bold text-[#001B55]">
                        Kategori <span className="text-[#C81E1E]">*</span>
                      </Label>
                      <Select
                        value={programForm.category || ""}
                        onValueChange={(value) =>
                          setProgramForm((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger className="h-12 rounded-xl border-2">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ekonomi">Ekonomi</SelectItem>
                          <SelectItem value="Pendidikan">Pendidikan</SelectItem>
                          <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                          <SelectItem value="Sosial">Sosial</SelectItem>
                          <SelectItem value="Lingkungan">Lingkungan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="font-bold text-[#001B55]">
                      Deskripsi <span className="text-[#C81E1E]">*</span>
                    </Label>
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
                      className="rounded-xl border-2 resize-none"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timeline" className="font-bold text-[#001B55]">
                      Timeline
                    </Label>
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
                      className="h-12 rounded-xl border-2"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="target" className="font-bold text-[#001B55]">
                      Target
                    </Label>
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
                      className="h-12 rounded-xl border-2"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coordinator" className="font-bold text-[#001B55]">
                      Koordinator
                    </Label>
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
                      className="h-12 rounded-xl border-2"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate" className="font-bold text-[#001B55]">
                        Tanggal Mulai
                      </Label>
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
                        className="h-12 rounded-xl border-2"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate" className="font-bold text-[#001B55]">
                        Tanggal Selesai
                      </Label>
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
                        className="h-12 rounded-xl border-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="budget" className="font-bold text-[#001B55]">
                        Anggaran (Rp)
                      </Label>
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
                        className="h-12 rounded-xl border-2"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status" className="font-bold text-[#001B55]">
                        Status
                      </Label>
                      <Select
                        value={programForm.status || ""}
                        onValueChange={(value: Program["status"]) =>
                          setProgramForm((prev) => ({
                            ...prev,
                            status: value,
                          }))
                        }
                      >
                        <SelectTrigger className="h-12 rounded-xl border-2">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Berlangsung">Berlangsung</SelectItem>
                          <SelectItem value="Selesai">Selesai</SelectItem>
                          <SelectItem value="Tertunda">Tertunda</SelectItem>
                          <SelectItem value="Perencanaan">Perencanaan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="targetBeneficiaries" className="font-bold text-[#001B55]">
                        Target Penerima
                      </Label>
                      <Input
                        id="targetBeneficiaries"
                        type="number"
                        value={programForm.targetBeneficiaries || ""}
                        onChange={(e) =>
                          setProgramForm((prev) => ({
                            ...prev,
                            targetBeneficiaries: parseInt(e.target.value) || 0,
                          }))
                        }
                        placeholder="1000"
                        className="h-12 rounded-xl border-2"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="currentBeneficiaries" className="font-bold text-[#001B55]">
                        Penerima Saat Ini
                      </Label>
                      <Input
                        id="currentBeneficiaries"
                        type="number"
                        value={programForm.currentBeneficiaries || ""}
                        onChange={(e) =>
                          setProgramForm((prev) => ({
                            ...prev,
                            currentBeneficiaries: parseInt(e.target.value) || 0,
                          }))
                        }
                        placeholder="750"
                        className="h-12 rounded-xl border-2"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="progress" className="font-bold text-[#001B55]">
                        Progress (%)
                      </Label>
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
                        className="h-12 rounded-xl border-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setProgramForm({});
                      setEditingProgram(null);
                      setIsProgramDialogOpen(false);
                    }}
                    className="h-12 px-6 rounded-full font-bold"
                  >
                    Batal
                  </Button>
                  <Button 
                    onClick={handleSaveProgram}
                    className="h-12 px-8 rounded-full bg-[#001B55] hover:bg-[#002060] font-bold"
                  >
                    {editingProgram ? "Update" : "Simpan"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl rounded-3xl bg-gradient-to-br from-[#001B55] to-[#003080] text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">
                    Total Program
                  </p>
                  <p className="text-4xl font-bold">{programs.length}</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <ClipboardList className="w-7 h-7" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-xl rounded-3xl bg-gradient-to-br from-[#FF9C04] to-[#FFB04A] text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">
                    Berlangsung
                  </p>
                  <p className="text-4xl font-bold">
                    {programs.filter((p) => p.status === "Berlangsung").length}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <TrendingUp className="w-7 h-7" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-xl rounded-3xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Total Anggaran
                  </p>
                  <p className="text-2xl font-bold text-[#001B55]">
                    {formatCurrency(
                      programs.reduce((sum, p) => sum + p.budget, 0)
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-xl rounded-3xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Penerima Manfaat
                  </p>
                  <p className="text-2xl font-bold text-[#001B55]">
                    {programs.reduce((sum, p) => sum + p.currentBeneficiaries, 0)} /{" "}
                    {programs.reduce((sum, p) => sum + p.targetBeneficiaries, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Programs List */}
        <div className="grid gap-6">
          {programs.map((program) => (
            <Card
              key={program.id}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-white overflow-hidden"
            >
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-[#F0F0F0]/50 transition-all duration-200 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <CardTitle className="text-xl text-[#001B55] flex items-center gap-3">
                            <div className="w-3 h-3 bg-[#FF9C04] rounded-full shadow-sm"></div>
                            <span className="font-bold">{program.name}</span>
                          </CardTitle>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(program.status)}
                            <ChevronDown className="w-5 h-5 transition-transform text-[#FF9C04]" />
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {program.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                          <span className="flex items-center gap-2 text-[#001B55] font-medium">
                            <Target className="w-4 h-4 text-[#FF9C04]" />
                            {program.target}
                          </span>
                          <span className="text-[#FF9C04] font-bold">
                            {program.progress}% tercapai
                          </span>
                          <span className="text-gray-600">
                            Timeline: {program.timeline}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-6 pb-6">
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold mb-4 flex items-center gap-2 text-[#001B55] text-lg">
                            <div className="p-2 bg-[#FF9C04]/10 rounded-xl">
                              <TrendingUp className="w-5 h-5 text-[#FF9C04]" />
                            </div>
                            Status & Progress
                          </h4>
                          <div className="space-y-4 bg-[#F0F0F0] p-6 rounded-2xl">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-[#001B55]">
                                Status:
                              </span>
                              {getStatusBadge(program.status)}
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-3">
                                <span className="font-bold text-[#001B55]">
                                  Progress
                                </span>
                                <span className="text-[#FF9C04] font-bold text-lg">
                                  {program.progress}%
                                </span>
                              </div>
                              <Progress
                                value={program.progress}
                                className="h-4 bg-gray-200"
                              />
                            </div>
                            <div className="flex justify-between text-sm pt-2">
                              <span className="font-bold text-[#001B55]">
                                Penerima Manfaat:
                              </span>
                              <span className="text-[#001B55] font-bold">
                                {program.currentBeneficiaries} /{" "}
                                {program.targetBeneficiaries}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-bold text-[#001B55]">
                                Anggaran:
                              </span>
                              <span className="text-[#001B55] font-bold">
                                {formatCurrency(program.budget)}
                              </span>
                            </div>
                            {program.coordinator && (
                              <div className="flex justify-between text-sm">
                                <span className="font-bold text-[#001B55]">
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
                          <h4 className="font-bold mb-4 text-[#001B55] text-lg">
                            Detail Program:
                          </h4>
                          <ul className="space-y-3 text-sm bg-[#F0F0F0] p-6 rounded-2xl">
                            {program.details.map((detail, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-gray-700"
                              >
                                <span className="w-2 h-2 bg-[#FF9C04] rounded-full mt-2 flex-shrink-0"></span>
                                <span className="leading-relaxed">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold mb-4 text-[#001B55] text-lg">
                          Capaian Terkini:
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-700">
                          {program.achievements.map((achievement, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm"
                            >
                              <span className="w-2 h-2 bg-[#FF9C04] rounded-full mt-2 flex-shrink-0"></span>
                              <span className="leading-relaxed">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                        <Button
                          className="h-12 px-8 rounded-full bg-[#001B55] hover:bg-[#002060] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          onClick={() => handleEditProgram(program)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          className="h-12 px-8 rounded-full bg-[#C81E1E] hover:bg-[#A01818] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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

        {programs.length === 0 && (
          <Card className="border-0 shadow-xl rounded-3xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#001B55] mb-2">
                Belum Ada Program
              </h3>
              <p className="text-gray-600 mb-6">
                Mulai tambahkan program kerja untuk ditampilkan di sini
              </p>
              <Button
                onClick={() => setIsProgramDialogOpen(true)}
                className="h-14 px-8 rounded-full bg-[#FF9C04] hover:bg-[#E08A00] text-white font-bold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Program Pertama
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
