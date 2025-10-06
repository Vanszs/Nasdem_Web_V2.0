"use client";

import * as React from "react";
import {
  RefreshCw,
  Plus,
  Building2,
  ImageIcon,
  Users,
  Upload,
  Link,
  X,
  CalendarIcon,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "../../components/layout/AdminLayout";
import {
  useOrganizations,
  useOrganizationMutations,
} from "@/app/admin/organizations/hooks/useOrganizations";
import {
  useRegionsLookup,
  useSayapTypesLookup,
  useMembersLookup,
} from "@/app/admin/organizations/hooks/useLookups";

type MemberLookupItem = { id: number; fullName: string; status?: string };

import { OrganizationTable } from "../components/OrganizationTable";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const breadcrumbs = [
  { label: "Struktur", href: "/admin/organizations" },
  { label: "Kelola Organisasi" },
];

interface AddFormState {
  level: string;
  position: string;
  regionId?: number;
  sayapTypeId?: number;
  photoUrl?: string;
  photoFile?: File | null;
  useFileUpload: boolean;
  startDate: string;
  endDate: string;
  memberIds: number[];
}

const initialAddForm: AddFormState = {
  level: "dpd",
  position: "ketua",
  regionId: undefined,
  sayapTypeId: undefined,
  photoUrl: "",
  photoFile: null,
  useFileUpload: false,
  startDate: "",
  endDate: "",
  memberIds: [],
};

export default function ManageOrganizationPage() {
  const [filters, setFilters] = React.useState({
    search: "",
    level: "",
    position: "",
    regionId: "",
    take: 10,
    skip: 0,
  });
  const debouncedSearch = useDebounce(filters.search, 400);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [addForm, setAddForm] = React.useState<AddFormState>(initialAddForm);
  const [memberSearch, setMemberSearch] = React.useState("");
  const [regionSearch, setRegionSearch] = React.useState("");
  const [showRegionDropdown, setShowRegionDropdown] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const regionInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!openAdd) {
      setAddForm(initialAddForm);
      setMemberSearch("");
      setRegionSearch("");
      setShowRegionDropdown(false);
    }
  }, [openAdd]);

  // Close region dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        regionInputRef.current &&
        !regionInputRef.current.contains(event.target as Node)
      ) {
        setShowRegionDropdown(false);
      }
    };

    if (showRegionDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showRegionDropdown]);

  const {
    data: orgData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useOrganizations({ ...filters, search: debouncedSearch });
  const struktur = orgData?.data || [];
  const { data: regions = [] } = useRegionsLookup();
  const { data: sayapTypes = [] } = useSayapTypesLookup();
  const { data: members = [], isLoading: loadingMembers } = useMembersLookup(
    memberSearch
  ) as { data: MemberLookupItem[]; isLoading: boolean } as any;

  const { create: createMut } = useOrganizationMutations();

  const showRegion = ["dpd", "dpc", "dprt", "kader"].includes(addForm.level);
  const showSayap = addForm.level === "sayap";

  // Filter regions based on search
  const filteredRegions = React.useMemo(() => {
    if (!regionSearch.trim()) return regions;
    return regions.filter((r) =>
      r.name.toLowerCase().includes(regionSearch.toLowerCase())
    );
  }, [regions, regionSearch]);

  // Get selected region name
  const selectedRegion = React.useMemo(() => {
    return regions.find((r) => r.id === addForm.regionId);
  }, [regions, addForm.regionId]);

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        return result.url;
      }
      throw new Error(result.error || "Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  async function handleSubmitAdd(e: React.FormEvent) {
    e.preventDefault();

    let finalPhotoUrl = addForm.photoUrl;

    // Handle file upload if selected
    if (addForm.useFileUpload && addForm.photoFile) {
      const uploadedUrl = await handleFileUpload(addForm.photoFile);
      if (uploadedUrl) {
        finalPhotoUrl = uploadedUrl;
      } else {
        // Handle upload error - could show toast here
        return;
      }
    }

    createMut.mutate(
      {
        level: addForm.level,
        position: addForm.position,
        regionId: addForm.regionId,
        sayapTypeId: addForm.sayapTypeId,
        photoUrl: finalPhotoUrl || undefined,
        startDate: addForm.startDate || undefined,
        endDate: addForm.endDate || undefined,
        memberIds: addForm.memberIds,
      },
      {
        onSuccess: () => setOpenAdd(false),
      }
    );
  }

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200/70 rounded-2xl px-6 py-5 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-[#001B55]">
              Kelola Struktur Organisasi
            </h1>
            <p className="text-sm text-[#6B7280]">
              Pengaturan hierarki, posisi & sayap organisasi
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-[#001B55]/30 text-[#001B55]"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={cn(
                  "h-4 w-4 mr-2",
                  isFetching && "animate-spin text-[#001B55]"
                )}
              />
              Refresh
            </Button>
            <Button
              onClick={() => setOpenAdd(true)}
              className="bg-[#001B55] hover:bg-[#0b377f] text-white cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </div>
        </div>

        {/* Table */}
        <OrganizationTable
          data={struktur}
          totalData={orgData?.meta?.total || 0}
          loading={isLoading}
          fetching={isFetching}
          error={error}
          isError={isError}
          onRefresh={refetch}
          filters={filters}
          onFiltersChange={setFilters}
          regions={regions}
          sayapTypes={sayapTypes}
        />

        {/* Inline Add Dialog */}
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogContent className="sm:max-w-2xl h-[85vh] overflow-hidden bg-white shadow-xl rounded-xl p-0 flex flex-col">
            {/* Header */}
            <DialogHeader className="shrink-0 px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#001B55]">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-base font-semibold text-[#001B55] truncate">
                    Tambah Struktur Organisasi
                  </DialogTitle>
                  <DialogDescription className="text-xs text-gray-500">
                    Buat struktur organisasi baru
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Scroll Area */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 pt-3 space-y-6">
              <form
                onSubmit={handleSubmitAdd}
                className="space-y-8"
                aria-label="Form tambah organisasi"
              >
                {/* Foto Profil */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#001B55]/10 text-[#001B55]">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold tracking-wide text-[#001B55] uppercase">
                        Foto Profil
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Gunakan foto terbaru untuk struktur ini
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      {addForm.useFileUpload && addForm.photoFile ? (
                        <img
                          src={URL.createObjectURL(addForm.photoFile)}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : addForm.photoUrl ? (
                        <img
                          src={addForm.photoUrl}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="text-center px-4">
                          <p className="text-sm font-medium text-gray-600">
                            Belum ada foto
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Tambahkan foto melalui URL atau unggah file
                          </p>
                        </div>
                      )}
                    </div>
                    <Tabs
                      value={addForm.useFileUpload ? "upload" : "url"}
                      onValueChange={(value) =>
                        setAddForm((current) => ({
                          ...current,
                          useFileUpload: value === "upload",
                          photoFile:
                            value === "upload" ? current.photoFile : null,
                        }))
                      }
                    >
                      <TabsList className="grid w-full grid-cols-2 h-8">
                        <TabsTrigger value="url" className="text-[11px]">
                          URL Foto
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="text-[11px]">
                          Unggah File
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="url" className="space-y-2 pt-3">
                        <Label className="text-[11px] text-gray-600">
                          Tautan gambar
                        </Label>
                        <Input
                          placeholder="https://domain.com/foto.jpg"
                          value={addForm.photoUrl}
                          onChange={(e) =>
                            setAddForm((cur) => ({
                              ...cur,
                              photoUrl: e.target.value,
                            }))
                          }
                          className="h-8 text-sm"
                        />
                      </TabsContent>
                      <TabsContent value="upload" className="space-y-2 pt-3">
                        <div className="relative">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setAddForm((cur) => ({
                                ...cur,
                                photoFile: file,
                              }));
                            }}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-8 w-full text-xs justify-center"
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            {addForm.photoFile
                              ? addForm.photoFile.name
                              : "Pilih file gambar"}
                          </Button>
                          {addForm.photoFile && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setAddForm((cur) => ({
                                  ...cur,
                                  photoFile: null,
                                }))
                              }
                              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </section>

                {/* Informasi Dasar */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#001B55]/10 text-[#001B55]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold tracking-wide text-[#001B55] uppercase">
                        Informasi Dasar
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Level & posisi struktur organisasi
                      </p>
                    </div>
                  </div>
                  {/* Converted grid to vertical stack for full-width selects */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">
                        Level Organisasi
                      </Label>
                      <Select
                        value={addForm.level}
                        onValueChange={(v) =>
                          setAddForm((s) => ({
                            ...s,
                            level: v,
                            regionId: undefined,
                            sayapTypeId: undefined,
                          }))
                        }
                      >
                        <SelectTrigger className="h-9 text-sm w-full">
                          <SelectValue placeholder="Pilih level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dpd">DPD</SelectItem>
                          <SelectItem value="dpc">DPC</SelectItem>
                          <SelectItem value="dprt">DPRT</SelectItem>
                          <SelectItem value="sayap">Sayap</SelectItem>
                          <SelectItem value="kader">Kader</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">
                        Posisi
                      </Label>
                      <Select
                        value={addForm.position}
                        onValueChange={(v) =>
                          setAddForm((s) => ({ ...s, position: v }))
                        }
                      >
                        <SelectTrigger className="h-9 text-sm w-full">
                          <SelectValue placeholder="Pilih posisi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ketua">Ketua</SelectItem>
                          <SelectItem value="sekretaris">Sekretaris</SelectItem>
                          <SelectItem value="bendahara">Bendahara</SelectItem>
                          <SelectItem value="wakil">Wakil</SelectItem>
                          <SelectItem value="anggota">Anggota</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                {/* Wilayah & Sayap */}
                {(showRegion || showSayap) && (
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#001B55]/10 text-[#001B55]">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-semibold tracking-wide text-[#001B55] uppercase">
                          Wilayah & Sayap
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Filter wilayah atau tipe sayap
                        </p>
                      </div>
                    </div>
                    {/* Converted grid to vertical stack for full-width region/sayap */}
                    <div className="space-y-3">
                      {showRegion && (
                        <div className="space-y-1.5">
                          <Label className="text-[11px] text-gray-600">
                            Region (Cari)
                          </Label>
                          <div className="relative">
                            <Input
                              ref={regionInputRef}
                              placeholder="Ketik region..."
                              value={
                                selectedRegion
                                  ? selectedRegion.name
                                  : regionSearch
                              }
                              onChange={(e) => {
                                setRegionSearch(e.target.value);
                                setShowRegionDropdown(true);
                                if (!e.target.value) {
                                  setAddForm((s) => ({ ...s, regionId: undefined }));
                                }
                              }}
                              onFocus={() => setShowRegionDropdown(true)}
                              className="h-9 text-sm pr-8 w-full"
                            />
                            {showRegionDropdown && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                <div className="p-1 space-y-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAddForm((s) => ({ ...s, regionId: undefined }));
                                      setRegionSearch("");
                                      setShowRegionDropdown(false);
                                    }}
                                    className="w-full text-left px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded"
                                  >
                                    Tidak ada region
                                  </button>
                                  {filteredRegions.map((region) => (
                                    <button
                                      key={region.id}
                                      type="button"
                                      onClick={() => {
                                        setAddForm((s) => ({ ...s, regionId: region.id }));
                                        setRegionSearch("");
                                        setShowRegionDropdown(false);
                                      }}
                                      className="w-full text-left px-2 py-1.5 text-xs hover:bg-gray-100 rounded"
                                    >
                                      {region.name}
                                      <span className="text-[10px] text-gray-500 ml-1">
                                        ({region.type})
                                      </span>
                                    </button>
                                  ))}
                                  {filteredRegions.length === 0 && regionSearch && (
                                    <div className="px-2 py-1.5 text-[11px] text-gray-500">
                                      Tidak ditemukan "{regionSearch}"
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {showSayap && (
                        <div className="space-y-1.5">
                          <Label className="text-[11px] text-gray-600">
                            Sayap
                          </Label>
                          <Select
                            value={
                              addForm.sayapTypeId
                                ? String(addForm.sayapTypeId)
                                : "none"
                            }
                            onValueChange={(v) =>
                              setAddForm((s) => ({
                                ...s,
                                sayapTypeId: v === "none" ? undefined : Number(v),
                              }))
                            }
                          >
                            <SelectTrigger className="h-9 text-sm w-full">
                              <SelectValue placeholder="Pilih sayap" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Tidak ada</SelectItem>
                              {sayapTypes.map((s) => (
                                <SelectItem key={s.id} value={String(s.id)}>
                                  {s.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Periode Jabatan */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#001B55]/10 text-[#001B55]">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold tracking-wide text-[#001B55] uppercase">
                        Periode Jabatan
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Tanggal mulai & berakhir (opsional)
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">
                        Tanggal Mulai
                      </Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={addForm.startDate}
                          onChange={(e) =>
                            setAddForm((s) => ({
                              ...s,
                              startDate: e.target.value,
                            }))
                          }
                          className="h-9 pr-8 text-sm"
                        />
                        <CalendarIcon className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#001B55]/40" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">
                        Tanggal Berakhir
                      </Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={addForm.endDate}
                          onChange={(e) =>
                            setAddForm((s) => ({
                              ...s,
                              endDate: e.target.value,
                            }))
                          }
                          className="h-9 pr-8 text-sm"
                        />
                        <CalendarIcon className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#001B55]/40" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Anggota Terhubung */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold tracking-wide text-[#001B55] uppercase">
                        Anggota Terhubung
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Pilih anggota terkait struktur ini
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Cari nama anggota..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="h-9 text-sm"
                    />
                    <div className="max-h-44 overflow-y-auto rounded-md border border-gray-200 bg-white">
                      {loadingMembers ? (
                        <div className="p-3 text-center text-xs text-gray-500">
                          Memuat anggota...
                        </div>
                      ) : members.length === 0 ? (
                        <div className="p-3 text-center text-xs text-gray-500">
                          {memberSearch
                            ? "Tidak ditemukan"
                            : "Belum ada data anggota"}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {members.map((m: MemberLookupItem) => {
                            const checked = addForm.memberIds.includes(m.id);
                            return (
                              <label
                                key={m.id}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 cursor-pointer text-sm",
                                  checked && "bg-white"
                                )}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    setAddForm((s) => ({
                                      ...s,
                                      memberIds: checked
                                        ? s.memberIds.filter(
                                            (id) => id !== m.id
                                          )
                                        : [...s.memberIds, m.id],
                                    }))
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-[#001B55] focus:ring-[#001B55]"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="truncate text-xs font-medium text-gray-800">
                                    {m.fullName}
                                  </p>
                                  <p className="text-[10px] uppercase tracking-wide text-gray-500">
                                    {m.status || "active"}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {addForm.memberIds.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[11px] font-medium text-gray-600">
                          Dipilih ({addForm.memberIds.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {addForm.memberIds.map((id) => {
                            const found = members.find(
                              (m: MemberLookupItem) => m.id === id
                            );
                            return (
                              <span
                                key={id}
                                className="inline-flex items-center gap-1.5 rounded-md bg-[#001B55] px-2 py-1 text-[10px] text-white shadow-sm"
                              >
                                {found?.fullName || `ID:${id}`}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAddForm((s) => ({
                                      ...s,
                                      memberIds: s.memberIds.filter(
                                        (x) => x !== id
                                      ),
                                    }))
                                  }
                                  className="text-white/70 hover:text-white"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </form>
            </div>

            {/* Footer */}
            <DialogFooter className="shrink-0 border-t border-gray-200 bg-white/80 backdrop-blur px-5 py-4">
              <div className="flex w-full gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenAdd(false)}
                  className="h-9 flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                  disabled={createMut.isPending}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={createMut.isPending}
                  onClick={() => {
                    const form = document.querySelector(
                      "#add-organization-scroll form"
                    );
                    if (form) {
                      const evt = new Event("submit", {
                        bubbles: true,
                        cancelable: true,
                      });
                      form.dispatchEvent(evt);
                    }
                  }}
                  className="h-9 flex-1 bg-[#001B55] hover:bg-[#001B55]/90 text-white text-sm"
                >
                  {createMut.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Menyimpan...
                    </span>
                  ) : (
                    "Simpan Organisasi"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
