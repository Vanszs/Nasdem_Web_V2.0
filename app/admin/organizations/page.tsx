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
        // Jika desa dipilih (subRegionFilter !== all) gunakan itu,
        // jika tidak dan kecamatan dipilih gunakan kecamatan
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
  const pageSize = 20;

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
  ]);

  // QUERY MEMBERS
  const { data, isLoading, isError, error } = useMembers({
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
  const kecamatanOptions = useMemo(
    () =>
      (regionsData || [])
        .filter((r: any) => r.type === "kecamatan")
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
        .map((r: any) => ({ value: String(r.id), label: r.name })),
    [regionsData]
  );

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

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    { label: "Struktur", href: "/admin/members" },
    { label: "Daftar Anggota" },
  ];

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
            <AddMemberDialog onOpenChange={setAddOpen} />
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
            <div className="py-10 text-center text-sm text-[#6B7280]">
              Memuat data...
            </div>
          )}
          {isError && (
            <div className="py-10 text-center text-sm text-red-600">
              Gagal memuat: {(error as any)?.message}
            </div>
          )}
          {!isLoading && !isError && members.length === 0 && (
            <div className="py-10 text-center text-sm text-[#6B7280]">
              Tidak ada data.
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

          <div className="mt-8">
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
      </div>
    </AdminLayout>
  );
}
