"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  UserCheck,
  Search,
  Filter,
  Download,
  Users,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  Briefcase,
  HandHeart,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { KpiCards } from "./components/KpiCards";
import { FiltersBar } from "./components/FiltersBar";
import { RegistrationsTable } from "./components/RegistrationsTable";
import { DetailModal } from "./components/DetailModal";
import {
  useMemberRegistrations,
  useUpdateApplicationStatus,
  type MemberRegistration,
} from "./hooks/useMemberRegistrations";
import { SimplePagination } from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/use-debounce";

// Programs lookup for beneficiary program name
function useProgramsLookup() {
  return useQuery<
    { success: boolean; data: { id: number; name: string }[] },
    Error
  >({
    queryKey: ["programs", "member-regist"],
    queryFn: async () => {
      const res = await fetch(
        "/api/programs?page=1&pageSize=200&status=ongoing"
      );
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Gagal memuat program");
      return json;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export default function MemberRegistPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRegistration, setSelectedRegistration] =
    useState<MemberRegistration | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  // Reset to page 1 whenever search/status/pageSize changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, pageSize]);

  const { data, isLoading, isError, error } = useMemberRegistrations({
    search: debouncedSearch,
    status,
    page,
    pageSize,
  });
  const updateMut = useUpdateApplicationStatus();
  const { data: programsData } = useProgramsLookup();

  const programsMap = useMemo(() => {
    const map = new Map<number, string>();
    (programsData?.data || []).forEach((p) => map.set(p.id, p.name));
    return map;
  }, [programsData]);

  const summary = data?.summary;

  const getProgramName = (programId?: number | null) => {
    if (!programId) return "-";
    return programsMap.get(programId) || "-";
  };
  const handleStatusUpdate = (
    newStatus: "pending" | "reviewed" | "approved" | "rejected"
  ) => {
    if (!selectedRegistration) return;
    updateMut.mutate(
      { id: selectedRegistration.id, status: newStatus },
      {
        onSuccess: () => setShowDetail(false),
      }
    );
  };

  return (
    <AdminLayout
      breadcrumbs={[{ label: "Pending Request" }, { label: "Member Regist" }]}
    >
      <div className="space-y-8">
        {/* KPI Cards */}
        <KpiCards summary={summary} />

        {/* Registrations List */}
        <Card className="rounded-xl border border-[#E8F9FF] shadow-sm">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E8F9FF] flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-[#001B55]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-[#001B55]">
                    Daftar Pendaftar Anggota Baru
                  </CardTitle>
                  <CardDescription className="text-sm text-[#475569]">
                    {summary?.total ?? 0} pendaftar anggota ditemukan
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Filters */}
            <FiltersBar
              search={search}
              onSearch={setSearch}
              status={status}
              onStatus={setStatus}
              pageSize={pageSize}
              onPageSize={(n) => setPageSize(n)}
            />

            {/* Registrations Table */}
            <RegistrationsTable
              data={data?.data || []}
              loading={isLoading}
              error={isError ? error?.message : undefined}
              onDetail={(row) => {
                setSelectedRegistration(row);
                setShowDetail(true);
              }}
              getProgramName={getProgramName}
            />

            {/* Pagination */}
            <SimplePagination
              page={data?.meta.page || page}
              totalPages={data?.meta.totalPages || 1}
              totalItems={data?.meta.total}
              onChange={(p) => setPage(p)}
            />
          </CardContent>
        </Card>

        {/* Detail Modal - Biodata Anggota */}
        <DetailModal
          open={showDetail}
          onClose={() => setShowDetail(false)}
          data={selectedRegistration}
          onUpdateStatus={handleStatusUpdate}
          isUpdating={updateMut.isPending}
          getProgramName={getProgramName}
        />
      </div>
    </AdminLayout>
  );
}
