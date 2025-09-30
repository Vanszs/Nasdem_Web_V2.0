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
          <DialogContent className="sm:max-w-2xl bg-white border border-gray-200 shadow-xl rounded-xl max-h-[90vh] overflow-hidden">
            {/* Header with Icon */}
            <DialogHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#001B55] rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-[#001B55]">
                    Tambah Struktur Organisasi
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">
                    Buat entri struktur organisasi baru dengan detail lengkap
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Scrollable Form Content */}
            <div className="overflow-y-auto flex-1 py-4">
              <form onSubmit={handleSubmitAdd} className="space-y-6">
                {/* Photo Profile Section - At Top */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="h-4 w-4 text-[#FF9C04]" />
                    <h3 className="text-sm font-semibold text-[#001B55] uppercase tracking-wide">
                      Foto Profil
                    </h3>
                  </div>

                  <div className="w-full space-y-4">
                    {/* Photo Preview - Full Width and Larger */}
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative group hover:border-[#FF9C04] transition-colors">
                      {addForm.photoUrl && !addForm.useFileUpload ? (
                        <img
                          src={addForm.photoUrl}
                          alt="Preview"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : addForm.photoFile ? (
                        <img
                          src={URL.createObjectURL(addForm.photoFile)}
                          alt="Preview"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center p-8">
                          <div className="w-16 h-16 bg-[#FF9C04]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="h-8 w-8 text-[#FF9C04]" />
                          </div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Foto Profil Organisasi
                          </p>
                          <p className="text-xs text-gray-500">
                            Upload foto atau masukkan URL gambar
                          </p>
                        </div>
                      )}
                      {(addForm.photoUrl || addForm.photoFile) && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="bg-white/90 rounded-lg px-3 py-1">
                            <p className="text-xs text-gray-700 font-medium">
                              Preview
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Photo Upload Options */}
                    <div className="w-full">
                      <Tabs
                        value={addForm.useFileUpload ? "upload" : "url"}
                        onValueChange={(v) =>
                          setAddForm((s) => ({
                            ...s,
                            useFileUpload: v === "upload",
                            photoUrl: v === "upload" ? "" : s.photoUrl,
                            photoFile: v === "url" ? null : s.photoFile,
                          }))
                        }
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2 h-9">
                          <TabsTrigger
                            value="url"
                            className="text-xs flex items-center gap-1"
                          >
                            <Link className="h-3 w-3" />
                            URL Link
                          </TabsTrigger>
                          <TabsTrigger
                            value="upload"
                            className="text-xs flex items-center gap-1"
                          >
                            <Upload className="h-3 w-3" />
                            Upload File
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="url" className="space-y-2 mt-3">
                          <Input
                            placeholder="https://example.com/image.jpg"
                            value={addForm.photoUrl || ""}
                            onChange={(e) =>
                              setAddForm((s) => ({
                                ...s,
                                photoUrl: e.target.value,
                              }))
                            }
                            className="h-9"
                          />
                        </TabsContent>

                        <TabsContent value="upload" className="space-y-2 mt-3">
                          <div className="relative">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setAddForm((s) => ({ ...s, photoFile: file }));
                              }}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full h-9 text-sm"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {addForm.photoFile
                                ? addForm.photoFile.name
                                : "Pilih file gambar"}
                            </Button>
                            {addForm.photoFile && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setAddForm((s) => ({ ...s, photoFile: null }))
                                }
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-100 hover:bg-red-200"
                              >
                                <X className="h-3 w-3 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-[#001B55]" />
                    <h3 className="text-sm font-semibold text-[#001B55] uppercase tracking-wide">
                      Informasi Dasar
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-[#001B55] uppercase tracking-wide">
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
                        <SelectTrigger className="h-10 mt-1">
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

                    <div>
                      <Label className="text-xs font-medium text-[#001B55] uppercase tracking-wide">
                        Posisi
                      </Label>
                      <Select
                        value={addForm.position}
                        onValueChange={(v) =>
                          setAddForm((s) => ({ ...s, position: v }))
                        }
                      >
                        <SelectTrigger className="h-10 mt-1">
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

                  {/* Regional & Wing Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {showRegion && (
                      <div className="relative">
                        <Label className="text-xs font-medium text-[#001B55] uppercase tracking-wide">
                          Region (Cari)
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            ref={regionInputRef}
                            placeholder="Ketik untuk mencari region..."
                            value={
                              selectedRegion
                                ? selectedRegion.name
                                : regionSearch
                            }
                            onChange={(e) => {
                              setRegionSearch(e.target.value);
                              setShowRegionDropdown(true);
                              if (!e.target.value) {
                                setAddForm((s) => ({
                                  ...s,
                                  regionId: undefined,
                                }));
                              }
                            }}
                            onFocus={() => setShowRegionDropdown(true)}
                            className="h-10"
                          />
                          {showRegionDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              <div className="p-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAddForm((s) => ({
                                      ...s,
                                      regionId: undefined,
                                    }));
                                    setRegionSearch("");
                                    setShowRegionDropdown(false);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded"
                                >
                                  Tidak ada region
                                </button>
                                {filteredRegions.map((region) => (
                                  <button
                                    key={region.id}
                                    type="button"
                                    onClick={() => {
                                      setAddForm((s) => ({
                                        ...s,
                                        regionId: region.id,
                                      }));
                                      setRegionSearch("");
                                      setShowRegionDropdown(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                  >
                                    {region.name}
                                    <span className="text-xs text-gray-500 ml-2">
                                      ({region.type})
                                    </span>
                                  </button>
                                ))}
                                {filteredRegions.length === 0 &&
                                  regionSearch && (
                                    <div className="px-3 py-2 text-sm text-gray-500">
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
                      <div>
                        <Label className="text-xs font-medium text-[#001B55] uppercase tracking-wide">
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
                          <SelectTrigger className="h-10 mt-1">
                            <SelectValue placeholder="Pilih sayap" />
                          </SelectTrigger>
                          <SelectContent className="max-h-48">
                            <SelectItem value="none">
                              <span className="text-gray-500">Tidak ada</span>
                            </SelectItem>
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
                </div>

                {/* Members Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-[#16A34A]" />
                    <h3 className="text-sm font-semibold text-[#001B55] uppercase tracking-wide">
                      Anggota (Opsional)
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-600 mb-2 block">
                        Cari dan pilih anggota
                      </Label>
                      <Input
                        placeholder="Cari nama anggota..."
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/50">
                      {loadingMembers ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          <div className="animate-pulse">Memuat anggota...</div>
                        </div>
                      ) : members.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          {memberSearch
                            ? "Tidak ditemukan"
                            : "Tidak ada anggota"}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {members.map((m: MemberLookupItem) => {
                            const checked = addForm.memberIds.includes(m.id);
                            return (
                              <label
                                key={m.id}
                                className={cn(
                                  "flex items-center gap-3 p-3 cursor-pointer hover:bg-white transition-colors",
                                  checked &&
                                    "bg-white border-l-2 border-l-[#001B55]"
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
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {m.fullName}
                                  </div>
                                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                                    {m.status || "active"}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Selected Members Summary */}
                    {addForm.memberIds.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-600 mb-2">
                          Dipilih ({addForm.memberIds.length})
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {addForm.memberIds.map((id) => {
                            const found = members.find(
                              (m: MemberLookupItem) => m.id === id
                            );
                            return (
                              <span
                                key={id}
                                className="inline-flex items-center gap-1 text-xs bg-[#001B55] text-white px-2 py-1 rounded-md"
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
                                  className="ml-1 text-white/70 hover:text-white"
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
                </div>
              </form>
            </div>

            {/* Footer Actions */}
            <DialogFooter className="pt-4 border-t border-gray-100">
              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10"
                  onClick={() => setOpenAdd(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={createMut.isPending}
                  onClick={() => {
                    const form = document.querySelector("form");
                    if (form) {
                      const event = new Event("submit", {
                        bubbles: true,
                        cancelable: true,
                      });
                      form.dispatchEvent(event);
                    }
                  }}
                  className="flex-1 h-10 bg-[#001B55] hover:bg-[#001B55]/90 text-white"
                >
                  {createMut.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Menyimpan...
                    </div>
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
