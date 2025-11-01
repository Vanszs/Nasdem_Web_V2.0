"use client";
import { useState, useMemo, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AdminLayout } from "../components/layout/AdminLayout";
import { MemberCard } from "./components/MemberCard";
import { AddMemberDialog } from "./components/AddMemberDialog";
import { MemberDetailDialog } from "./components/MemberDetailDialog";
import { MembersTable } from "./components/MembersTable";
import { useMembers } from "./hooks/useMembers";
import { useDebounce } from "../../../hooks/use-debounce";
import { SimplePagination } from "@/components/ui/pagination";
import { useRegions } from "./hooks/useRegions";
import { TabsFilters } from "./components/TabsFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ActiveTab,
  DpdFilters,
  SayapFilters,
  DpcFilters,
  DprtFilters,
} from "./components/utils/filterMembers";

export default function Members() {
  // TAB STATE
  const [activeTab, setActiveTab] = useState<ActiveTab>("dpd");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Sync from query param on mount and when it changes externally
  useEffect(() => {
    const org = (searchParams.get("organization") || "").toLowerCase();
    const allowed = new Set(["dpd", "sayap", "dpc", "dprt"]);
    if (allowed.has(org)) {
      setActiveTab(org as ActiveTab);
    } else {
      // Ensure default dpd appears in URL if missing/invalid
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("organization", "dpd");
      router.replace(`${pathname}?${params.toString()}`);
      setActiveTab("dpd");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // FILTER STATES PER TAB (mengikuti struktur lama TabsFilters)
  const [dpdFilters, setDpdFilters] = useState<DpdFilters>({ searchTerm: "" });
  const [sayapFilters, setSayapFilters] = useState<SayapFilters>({
    searchTerm: "",
    departmentFilter: "all",
  });
  const [dpcFilters, setDpcFilters] = useState<DpcFilters>({
    searchTerm: "",
    regionFilter: "all",
  });
  const [dprtFilters, setDprtFilters] = useState<DprtFilters>({
    searchTerm: "",
    regionFilter: "all",
    subRegionFilter: "all",
    departmentFilter: "all", // dprt | kader | all
  });

  // Tambahan global (opsional)
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  // DEBOUNCE SEARCH PER TAB (ambil value aktif)
  const currentSearch =
    activeTab === "dpd"
      ? dpdFilters.searchTerm
      : activeTab === "sayap"
      ? sayapFilters.searchTerm
      : activeTab === "dpc"
      ? dpcFilters.searchTerm
      : dprtFilters.searchTerm;

  const debouncedSearch = useDebounce(currentSearch, 400);

  const desaByKecamatan: Record<string, { value: string; label: string }[]> =
    {};

  // MAP TAB → level (OrgLevel) + regionId
  const { levelParam, regionIdParam } = useMemo(() => {
    let level: string | undefined;
    let regionId: number | undefined;

    switch (activeTab) {
      case "dpd":
        level = "dpd";
        break;
      case "sayap":
        level = "sayap";
        break;
      case "dpc":
        level = "dpc";
        if (dpcFilters.regionFilter !== "all") {
          regionId = Number(dpcFilters.regionFilter);
        }
        break;
      case "dprt":
        // Jika pilih "kader" (departmentFilter) → level "kader", else "dprt"
        if (dprtFilters.departmentFilter === "kader") {
          level = "kader";
        } else {
          level = "dprt";
        }
        if (dprtFilters.subRegionFilter !== "all") {
          regionId = Number(dprtFilters.subRegionFilter);
        } else if (dprtFilters.regionFilter !== "all") {
          regionId = Number(dprtFilters.regionFilter);
        }
        break;
    }

    return { levelParam: level, regionIdParam: regionId };
  }, [activeTab, dpcFilters, dprtFilters]);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // RESET PAGE saat filter utama berubah
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    activeTab,
    statusFilter,
    genderFilter,
    levelParam,
    regionIdParam,
    dprtFilters.departmentFilter,
    pageSize,
  ]);

  // QUERY MEMBERS
  const { data, isLoading, isFetching, isError, error, refetch } = useMembers({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    gender: genderFilter !== "all" ? genderFilter : undefined,
    level: levelParam,
    regionId: regionIdParam,
    struktur: true,
  });

  // NORMALISASI DATA
  const members = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((m: any) => {
      // Support both API shapes: `struktur` (current) and legacy `StrukturOrganisasi`
      const so = m.struktur || m.StrukturOrganisasi;
      // Normalize region/subDepartment for display
      let regionLabel: string | undefined =
        so?.region?.name || so?.Region?.name || undefined;
      const regionId: number | undefined =
        so?.region?.id || so?.Region?.id || undefined;
      let subDepartment: string | undefined = undefined;
      if (so?.level?.toLowerCase() === "dprt") {
        // For DPRT, the region is desa; map it to subDepartment
        subDepartment = regionLabel;
        regionLabel = undefined; // kecamatan unknown without parent relation
      }
      return {
        id: String(m.id),
        name: m.fullName,
        email: m.email || "",
        phone: m.phone || "",
        address: m.address || "",
        status: (m.status || "active").toLowerCase(),
        joinDate: m.joinDate || null,
        photo: m.photoUrl || "/placeholder.png",
        department: so?.level || levelParam || "dpd",
        position: so?.position || "anggota",
        region: regionLabel,
        regionId,
        subDepartment,
        description: m.bio || "",
        gender: m.gender || undefined,
        ktpPhotoUrl: m.ktpPhotoUrl || undefined,
        struktur: so,
      };
    });
  }, [data]);

  // SELEKSI MEMBER
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const { data: regionsData } = useRegions();

  // Bentuk opsi kecamatan untuk TabsFilters
  const kecamatanOptions = useMemo(() => {
    // regionsData is already the array from useRegions hook
    if (!Array.isArray(regionsData)) return [];
    return regionsData
      .filter((r: any) => r.type === "kecamatan")
      .sort((a: any, b: any) => a.name.localeCompare(b.name))
      .map((r: any) => ({ value: String(r.id), label: r.name }));
  }, [regionsData]);

  const openDetail = (m: any) => {
    setSelectedMember(m);
    setDetailOpen(true);
  };

  // Edit flow removed as requested

  // STATUS & LEVEL CONFIG (dipertahankan untuk badge)
  const statusConfig = {
    active: {
      label: "Aktif",
      className: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
    },
    inactive: {
      label: "Tidak Aktif",
      className: "bg-gradient-to-r from-slate-400 to-slate-500 text-white",
    },
    suspended: {
      label: "Suspended",
      className: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
    },
  };
  const departmentConfig = {
    dpd: { label: "DPD", className: "bg-[#001B55] text-white" },
    sayap: { label: "Sayap", className: "bg-[#FF9C04] text-white" },
    dpc: { label: "DPC", className: "bg-emerald-600 text-white" },
    dprt: { label: "DPRT", className: "bg-amber-700 text-white" },
    kader: { label: "Kader", className: "bg-purple-600 text-white" },
  };

  const breadcrumbs = [{ label: "Struktur Organisasi" }];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* HEADER + ADD */}
        <div className="bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#001B55]">
                Struktur Organisasi
              </h1>
              <p className="text-muted-foreground">
                Kelola data anggota & struktur Partai NasDem Kabupaten Sidoarjo
              </p>
            </div>
            <Button
              onClick={() => setAddOpen(true)}
              className="bg-gradient-to-r from-[#001B55] to-[#003875] hover:from-[#003875] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Tambahkan Anggota
            </Button>
          </div>
        </div>

        {/* TABS FILTERS (style lama) */}
        <TabsFilters
          activeTab={activeTab}
          setActiveTab={(t) => {
            // update state
            setActiveTab(t);
            setPage(1);
            // update URL query parameter
            const params = new URLSearchParams(
              Array.from(searchParams.entries())
            );
            params.set("organization", t);
            router.replace(`${pathname}?${params.toString()}`);
          }}
          dpdFilters={dpdFilters}
          sayapFilters={sayapFilters}
          dpcFilters={dpcFilters}
          dprtFilters={dprtFilters}
          setDpdFilters={(v) => setDpdFilters(v)}
          setSayapFilters={(v) => setSayapFilters(v)}
          setDpcFilters={(v) => setDpcFilters(v)}
          setDprtFilters={(v) => setDprtFilters(v)}
          onTabChange={() => {
            setPage(1);
          }}
          regions={kecamatanOptions}
          desaByKecamatan={desaByKecamatan}
        />

        {/* EXTRA FILTER (Status & Gender) */}
        <div className="flex flex-wrap gap-3 bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-xl p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm"
          >
            <option value="all">Status: Semua</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm"
          >
            <option value="all">Gender: Semua</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>

        {/* LIST DATA */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 space-y-4">
          {(isLoading || isFetching) && (
            <div className="space-y-6">
              {/* header skeleton for count and size picker */}
              <div className="flex items-center justify-between">
                <div className="h-4 w-48">
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="h-8 w-16">
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
              {/* grid skeletons */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#E5E7EB] rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Skeleton className="h-7 w-16 rounded-lg" />
                      <Skeleton className="h-7 w-10 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isError && (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-red-600 mb-1">
                Gagal memuat data
              </p>
              <p className="text-xs text-[#475569]">
                {(error as any)?.message}
              </p>
            </div>
          )}
          {!isLoading && !isFetching && !isError && members.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#E8F9FF] flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-[#475569]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#001B55] mb-1">
                Tidak Ada Data
              </p>
              <p className="text-xs text-[#475569]">
                Belum ada anggota yang terdaftar pada filter ini
              </p>
            </div>
          )}

          {!isLoading && !isFetching && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {members.map((m: any) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  onClick={() => openDetail(m)}
                  statusConfig={statusConfig}
                  departmentConfig={departmentConfig}
                  getDPRTLeader={() => undefined}
                  getKaderCount={() => 0}
                  onRemoved={() => refetch()}
                />
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Menampilkan{" "}
                {data?.data?.length === 0 ? 0 : (page - 1) * pageSize + 1}-
                {Math.min(page * pageSize, data?.meta.total || 0)} dari{" "}
                {data?.meta.total || 0} anggota
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-16 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SimplePagination
              page={page}
              totalPages={data?.meta.totalPages || 1}
              totalItems={data?.meta.total || 0}
              onChange={(p) => setPage(p)}
            />
          </div>
        </div>

        <MemberDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          member={selectedMember}
          members={members}
          departmentConfig={departmentConfig}
          getDPRTLeader={() => undefined}
          getKaderCount={() => 0}
        />
        <AddMemberDialog open={addOpen} onOpenChange={setAddOpen} />
        <MembersTable
          data={members}
          totalData={data?.meta.total || 0}
          loading={isLoading || isFetching}
          fetching={isFetching}
          error={error}
          isError={isError}
          onRefresh={() => refetch()}
          filters={{
            search: debouncedSearch,
            status: statusFilter,
            gender: genderFilter,
            take: pageSize,
            skip: (page - 1) * pageSize,
          }}
          onFiltersChange={(newFilters: any) => {
            setPage(1);
            setDpdFilters((prev) => ({ ...prev, ...newFilters }));
            setSayapFilters((prev) => ({ ...prev, ...newFilters }));
            setDpcFilters((prev) => ({ ...prev, ...newFilters }));
            setDprtFilters((prev) => ({ ...prev, ...newFilters }));
          }}
          onBatchAction={(action: "delete" | "export", selectedIds: number[]) => {
            if (action === 'delete') {
              // Handle batch delete - this would call your delete API
              console.log('Batch delete:', selectedIds);
              toast.success(`Berhasil menghapus ${selectedIds.length} anggota`);
              refetch();
            } else if (action === 'export') {
              // Handle batch export
              console.log('Batch export:', selectedIds);
              toast.success(`Berhasil mengekspor ${selectedIds.length} anggota`);
            }
          }}
        />
        {/* Edit membership dialog removed */}
      </div>
    </AdminLayout>
  );
}
