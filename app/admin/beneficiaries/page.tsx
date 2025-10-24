"use client";

import { useMemo, useState } from "react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HandHeart,
  Search,
  Filter,
  Users,
  Clock,
  TrendingUp,
  Download,
  Plus,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import type { Beneficiary } from "./types";
import { BeneficiariesList } from "./components/BeneficiariesList";
import { BeneficiaryFormDialog } from "./components/BeneficiaryFormDialog";
import { DeleteBeneficiaryDialog } from "./components/DeleteBeneficiaryDialog";

export default function BeneficiariesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [programId, setProgramId] = useState<string>("all");
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<Beneficiary | null>(null);
  const [openImport, setOpenImport] = useState(false);
  const queryClient = useQueryClient();

  // Fetch program options for filter
  const { data: programsRes, isLoading: loadingPrograms } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const res = await fetch("/api/programs", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal memuat program");
      return res.json();
    },
  });
  const programs: { id: number; name: string }[] = useMemo(
    () =>
      programsRes?.data?.map((p: any) => ({ id: p.id, name: p.name })) ?? [],
    [programsRes]
  );

  // Debounced filters
  const dSearch = useDebounce(search, 400);
  const dStatus = useDebounce(status, 400);
  const dProgramId = useDebounce(programId, 400);

  const queryParams = useMemo(() => {
    const p = new URLSearchParams();
    if (dSearch) p.set("search", dSearch);
    if (dStatus !== "all") p.set("status", dStatus);
    if (dProgramId !== "all") p.set("programId", dProgramId);
    return p.toString();
  }, [dSearch, dStatus, dProgramId]);

  const { data, isLoading } = useQuery({
    queryKey: ["beneficiaries", queryParams],
    queryFn: async () => {
      const res = await fetch(`/api/beneficiaries?${queryParams}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal memuat data");
      return res.json();
    },
  });

  const beneficiaries: Beneficiary[] = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const waiting = beneficiaries.filter((b) => b.status === "pending").length;
  const completed = beneficiaries.filter(
    (b) => b.status === "completed"
  ).length;
  const totalFamily = beneficiaries.reduce(
    (sum, b) => sum + (b.familyMemberCount ?? 0),
    0
  );
  const potentialVotes = Math.round((beneficiaries.length + totalFamily) / 2);

  return (
    <AdminLayout breadcrumbs={[{ label: "Penerima Manfaat" }]}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Total Penerima
              </span>
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-primary" />
              </div>
            </div>
            <div className="text-num font-semibold text-text-primary">
              {total}
            </div>
          </div>

          <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Menunggu
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#FF9C04]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FF9C04]" />
              </div>
            </div>
            <div className="text-num font-semibold text-[#FF9C04]">
              {waiting}
            </div>
          </div>

          <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Total Keluarga
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#E8F9FF] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#001B55]" />
              </div>
            </div>
            <div className="text-num font-semibold text-[#001B55]">
              {totalFamily}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-[#C5BAFF] to-[#C4D9FF] shadow-md p-5 border border-[#C5BAFF] hover:shadow-lg transition-all duration-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#001B55] font-semibold">
                Potensi Suara
              </span>
              <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#001B55]" />
              </div>
            </div>
            <div className="text-num font-bold text-[#001B55]">
              {potentialVotes}
            </div>
            <div className="text-xs text-[#001B55]/70 font-medium">
              (Total Penerima + Keluarga) / 2
            </div>
          </div>
          <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Selesai
              </span>
              <div className="w-10 h-10 rounded-lg bg-brand-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-brand-success" />
              </div>
            </div>
            <div className="text-num font-semibold text-brand-success">
              {completed}
            </div>
          </div>
        </div>

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
                    {total} penerima manfaat ditemukan
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => {
                    try {
                      const headers = [
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
                        "Jumlah Keluarga",
                        "Nama Pengusul",
                        "Status",
                        "Tgl. Terima",
                      ];
                      const rows = beneficiaries.map((b, i) => [
                        i + 1,
                        b.fullName ?? "",
                        b.nik ?? "",
                        b.email ?? "",
                        b.phone ?? "",
                        b.fullAddress ?? "",
                        b.dateOfBirth ?? "",
                        b.gender ?? "",
                        b.occupation ?? "",
                        b.program?.name ?? String(b.programId),
                        b.familyMemberCount ?? "",
                        b.proposerName ?? "",
                        b.status,
                        b.receivedAt ?? "",
                      ]);
                      const csv = [
                        headers.join(","),
                        ...rows.map((r) =>
                          r
                            .map((c) => `"${String(c).replace(/"/g, '""')}"`)
                            .join(",")
                        ),
                      ].join("\n");
                      const blob = new Blob([csv], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `beneficiaries-${Date.now()}.csv`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    } catch (e) {
                      toast.error("Gagal export CSV");
                    }
                  }}
                  variant="outline"
                  className="rounded-lg border border-[#C4D9FF] hover:bg-[#E8F9FF] text-[#001B55] font-medium"
                >
                  <Download className="w-4 h-4 mr-2" /> Export Data
                </Button>

                <Button
                  onClick={() => setOpenImport(true)}
                  variant="outline"
                  className="rounded-lg border border-[#C5BAFF] hover:bg-[#C5BAFF]/10 text-[#001B55] font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" /> Import CSV
                </Button>
                <BeneficiaryFormDialog
                  editing={selected}
                  onClose={() => setSelected(null)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nama, alamat, pengusul..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 rounded-md border border-[#C4D9FF] focus:border-[#C5BAFF] transition-all"
                />
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-9 rounded-md border border-[#C4D9FF] focus:border-[#C5BAFF]">
                  <div className="flex items-center gap-1.5">
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

              <Select value={programId} onValueChange={setProgramId}>
                <SelectTrigger className="h-9 rounded-md border border-[#C4D9FF] focus:border-[#C5BAFF]">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter Program" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Program</SelectItem>
                  {loadingPrograms ? (
                    <SelectItem value="loading" disabled>
                      Memuat...
                    </SelectItem>
                  ) : (
                    programs.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <BeneficiariesList
              data={beneficiaries}
              isLoading={isLoading}
              onEdit={(b) => setSelected(b)}
              onDelete={(b) => {
                setSelected(b);
                setOpenDelete(true);
              }}
            />
          </CardContent>
        </Card>

        <DeleteBeneficiaryDialog
          open={openDelete}
          beneficiary={selected}
          onOpenChange={(v) => setOpenDelete(v)}
        />

        {/* Import CSV Dialog */}
        <Dialog open={openImport} onOpenChange={setOpenImport}>
          <DialogContent className="max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#001B55]">
                Import CSV
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <p className="text-sm text-[#475569]">
                Unggah file CSV dengan kolom: Nama Lengkap, NIK, Email, Telepon,
                Alamat Lengkap, Tanggal Lahir (YYYY-MM-DD), Jenis Kelamin
                (male/female), Pekerjaan, Program (ID atau Nama), Jumlah
                Keluarga, Nama Pengusul, Status (pending/completed)
              </p>
              <Input
                type="file"
                accept=".csv"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const lines = text.split(/\r?\n/).filter(Boolean);
                    if (lines.length <= 1) throw new Error("CSV kosong");
                    // Naive CSV parse (no complex quoting)
                    const rows = lines.slice(1).map((l) =>
                      l.split(",").map((v) =>
                        v
                          .replace(/^\"|\"$/g, "")
                          .replace(/\"\"/g, '"')
                          .trim()
                      )
                    );
                    const mapByName = new Map<string, number>(
                      programs.map((p) => [p.name.toLowerCase(), p.id])
                    );

                    for (const cols of rows) {
                      const [
                        ,
                        fullName,
                        nik,
                        email,
                        phone,
                        fullAddress,
                        dateOfBirth,
                        gender,
                        occupation,
                        programCol,
                        familyCount,
                        proposerName,
                        statusCol,
                      ] = cols;
                      const progIdNum = Number(programCol);
                      const mappedProgramId =
                        !isNaN(progIdNum) &&
                        programs.some((p) => p.id === progIdNum)
                          ? progIdNum
                          : mapByName.get(
                              String(programCol || "").toLowerCase()
                            ) ?? null;
                      if (!mappedProgramId || !fullName) continue;
                      await fetch("/api/beneficiaries", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          programId: mappedProgramId,
                          fullName,
                          nik: nik || null,
                          email: email || null,
                          phone: phone || null,
                          fullAddress: fullAddress || null,
                          dateOfBirth: dateOfBirth || null,
                          gender: gender || null,
                          occupation: occupation || null,
                          familyMemberCount: familyCount
                            ? Number(familyCount)
                            : null,
                          proposerName: proposerName || null,
                          status:
                            statusCol === "completed" ? "completed" : "pending",
                        }),
                      });
                    }
                    toast.success("Import CSV selesai");
                    setOpenImport(false);
                    queryClient.invalidateQueries({
                      queryKey: ["beneficiaries"],
                    });
                  } catch (err: any) {
                    toast.error(err?.message || "Gagal import CSV");
                  }
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
