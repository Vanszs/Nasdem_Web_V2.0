"use client";
import { useState, useMemo, useEffect } from "react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { MemberCard } from "./components/MemberCard";
import { AddMemberDialog } from "./components/AddMemberDialog";
import { MemberDetailDialog } from "./components/MemberDetailDialog";
import { useMembers } from "./hooks/useMembers";
import { useDebounce } from "../../../hooks/use-debounce";
import { SimplePagination } from "@/components/ui/pagination";
import { useRegions } from "./hooks/useRegions";
import { TabsFilters } from "./components/TabsFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
  const { data, isLoading, isError, error, refetch } = useMembers({
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
      const so = m.StrukturOrganisasi;
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
        region: so?.Region?.name || undefined,
        subDepartment: undefined, // tidak ada di schema baru
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

  // Debug effect to log state changes
  useEffect(() => {
    console.log("Add dialog open state:", addOpen);
  }, [addOpen]);

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
            setActiveTab(t);
            setPage(1);
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
          {isLoading && (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#C5BAFF] border-t-[#001B55] rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium text-[#475569]">
                Memuat data...
              </p>
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
          {!isLoading && !isError && members.length === 0 && (
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
              />
            ))}
          </div>

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
      </div>
    </AdminLayout>
  );
}
