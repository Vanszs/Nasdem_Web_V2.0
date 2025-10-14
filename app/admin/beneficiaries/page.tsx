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
  Plus,
  Search,
  Filter,
  Download,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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

  const queryParams = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (status !== "all") p.set("status", status);
    if (programId !== "all") p.set("programId", programId);
    return p.toString();
  }, [search, status, programId]);

  const { data, isLoading } = useQuery({
    queryKey: ["beneficiaries", queryParams],
    queryFn: async () => {
      const res = await fetch(`/api/beneficiaries?${queryParams}`);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <BeneficiaryFormDialog
                  editing={selected}
                  onClose={() => setSelected(null)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nama, alamat, pengusul..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF] transition-all"
                />
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF]">
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

              <Select value={programId} onValueChange={setProgramId}>
                <SelectTrigger className="h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter Program" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Program</SelectItem>
                  {(data?.data ?? []).map((b: Beneficiary) => (
                    <SelectItem
                      key={b.program?.id ?? b.programId}
                      value={String(b.program?.id ?? b.programId)}
                    >
                      {b.program?.name ?? b.programId}
                    </SelectItem>
                  ))}
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
      </div>
    </AdminLayout>
  );
}
