"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  Edit3,
  ImageIcon,
  Link,
  Upload,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMembersLookup } from "@/app/admin/organizations/hooks/useLookups";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface LookupRegion {
  id: number;
  name: string;
  type: string;
}

interface LookupSayap {
  id: number;
  name: string;
}

type MemberLookupItem = {
  id: number;
  fullName: string;
  status?: string;
  photoUrl?: string | null;
};

export interface OrganizationItem {
  id: number;
  level: string;
  position: string;
  region?: { id: number; name: string; type: string } | null;
  sayapType?: { id: number; name: string } | null;
  startDate?: string | null;
  endDate?: string | null;
  photoUrl?: string | null;
  members?: {
    id: number;
    fullName: string;
    status?: string;
    photoUrl?: string | null;
  }[];
}

export interface EditOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: OrganizationItem | null;
  regions: LookupRegion[];
  sayapTypes: LookupSayap[];
  onUpdate: (
    id: number,
    payload: {
      level?: string;
      position?: string;
      regionId?: number | null;
      sayapTypeId?: number | null;
      startDate?: string;
      endDate?: string;
      photoUrl?: string | null;
      memberIds?: number[];
    }
  ) => void;
  updating: boolean;
}

const formSchema = z.object({
  level: z.enum(["dpd", "dpc", "dprt", "sayap", "kader"], {
    required_error: "Level wajib diisi",
  }),
  position: z.enum(["ketua", "sekretaris", "bendahara", "wakil", "anggota"], {
    required_error: "Posisi wajib diisi",
  }),
  regionId: z.number().int().positive().nullable().optional(),
  sayapTypeId: z.number().int().positive().nullable().optional(),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  photoUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  useFileUpload: z.boolean().default(false),
  memberIds: z.array(z.number()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

export function EditOrganizationDialog({
  open,
  onOpenChange,
  item,
  regions,
  sayapTypes,
  onUpdate,
  updating,
}: EditOrganizationDialogProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [memberSearch, setMemberSearch] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: "dpd",
      position: "anggota",
      regionId: null,
      sayapTypeId: null,
      startDate: "",
      endDate: "",
      photoUrl: "",
      useFileUpload: false,
      memberIds: [],
    },
    mode: "onChange",
  });

  const { data: memberOptions = [], isLoading: membersLoading } =
    useMembersLookup(memberSearch) as {
      data?: MemberLookupItem[];
      isLoading: boolean;
    };

  const sortedRegions = React.useMemo(
    () => regions.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [regions]
  );

  const levelValue = form.watch("level");
  const positionValue = form.watch("position");
  const useFileUpload = form.watch("useFileUpload");
  const memberIdsValue = form.watch("memberIds");

  const showRegion = React.useMemo(
    () => ["dpd", "dpc", "dprt", "kader"].includes(levelValue),
    [levelValue]
  );

  const showSayap = React.useMemo(() => levelValue === "sayap", [levelValue]);

  const combinedMemberOptions = React.useMemo(() => {
    if (!item?.members) return memberOptions;
    const existing = new Map(memberOptions.map((m) => [m.id, m]));
    item.members.forEach((member) => {
      if (!existing.has(member.id)) {
        existing.set(member.id, {
          id: member.id,
          fullName: member.fullName,
          status: member.status,
          photoUrl: member.photoUrl,
        });
      }
    });
    return Array.from(existing.values());
  }, [item?.members, memberOptions]);

  React.useEffect(() => {
    if (open && item) {
      form.reset({
        level: item.level as FormValues["level"],
        position: item.position as FormValues["position"],
        regionId: item.region?.id ?? null,
        sayapTypeId: item.sayapType?.id ?? null,
        startDate: item.startDate ? item.startDate.substring(0, 10) : "",
        endDate: item.endDate ? item.endDate.substring(0, 10) : "",
        photoUrl: item.photoUrl ?? "",
        useFileUpload: false,
        memberIds: item.members ? item.members.map((m) => m.id) : [],
      });
      setMemberSearch("");
      setUploadError(null);
      setPhotoFile(null);
    }
    if (!open) {
      form.reset();
      setUploadError(null);
      setMemberSearch("");
      setPhotoFile(null);
    }
  }, [open, item, form]);

  const handleFileUpload = React.useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success && result.url) {
        return result.url as string;
      }
      throw new Error(result.error || "Upload gagal");
    } catch (error) {
      console.error("Upload error", error);
      return null;
    }
  }, []);

  const toggleMember = (id: number) => {
    const cur = form.getValues("memberIds");
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    form.setValue("memberIds", next, { shouldValidate: true });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!item) return;
    setUploadError(null);
    let resolvedPhotoUrl = values.photoUrl || "";

    if (values.useFileUpload && photoFile) {
      setUploading(true);
      const uploadedUrl = await handleFileUpload(photoFile);
      setUploading(false);
      if (!uploadedUrl) {
        setUploadError("Gagal mengunggah foto. Coba lagi atau gunakan URL.");
        return;
      }
      resolvedPhotoUrl = uploadedUrl;
    }

    onUpdate(item.id, {
      level: values.level,
      position: values.position,
      regionId: values.regionId ?? null,
      sayapTypeId: values.sayapTypeId ?? null,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      photoUrl: resolvedPhotoUrl ? resolvedPhotoUrl : null,
      memberIds: values.memberIds,
    });
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!updating) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col overflow-hidden bg-white shadow-xl rounded-xl p-0">
        <div className="flex flex-col flex-1 min-h-0">
          <DialogHeader className="shrink-0 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#001B55]">
                <Edit3 className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base font-semibold text-[#001B55] truncate">
                  Edit Struktur Organisasi
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Sesuaikan detail struktur organisasi
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div
            className="flex-1 min-h-0 overflow-y-auto px-6 pb-4 pt-3 space-y-6"
            id="edit-organization-scroll"
          >
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6 py-4 pb-8">
                {/* Photo Section */}
                <section className="space-y-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#001B55]/10 text-[#001B55]">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-[#001B55]">
                        Foto Profil
                      </h3>
                      <p className="text-xs text-gray-500">
                        Gunakan foto terbaru untuk struktur ini
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
                      {useFileUpload && photoFile ? (
                        <img
                          src={URL.createObjectURL(photoFile)}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : form.getValues("photoUrl") ? (
                        <img
                          src={form.getValues("photoUrl") || ""}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            (
                              event.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">
                            Belum ada foto
                          </p>
                          <p className="text-xs text-gray-500">
                            Tambahkan foto melalui URL atau unggah file
                          </p>
                        </div>
                      )}
                    </div>

                    <Tabs
                      value={useFileUpload ? "upload" : "url"}
                      onValueChange={(value) => {
                        form.setValue("useFileUpload", value === "upload", {
                          shouldValidate: true,
                        });
                        if (value !== "upload") setPhotoFile(null);
                      }}
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="url" className="text-xs">
                          <Link className="mr-2 h-3 w-3" />
                          URL Foto
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="text-xs">
                          <Upload className="mr-2 h-3 w-3" />
                          Unggah File
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="url" className="space-y-2 pt-4">
                        <FormField
                          control={form.control}
                          name="photoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-gray-600">
                                Tautan gambar
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://domain.com/foto.jpg"
                                  className="h-9"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      <TabsContent value="upload" className="space-y-3 pt-4">
                        <div className="relative">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              setPhotoFile(file);
                            }}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-9 w-full justify-center text-sm"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {photoFile ? photoFile.name : "Pilih file gambar"}
                          </Button>
                          {photoFile && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => setPhotoFile(null)}
                              className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                    {uploadError && (
                      <p className="text-xs font-medium text-red-600">
                        {uploadError}
                      </p>
                    )}
                  </div>
                </section>
                {/* Basic Information */}
                <section className="space-y-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#001B55]/10 text-[#001B55]">
                      <Edit3 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-[#001B55]">
                        Informasi Utama
                      </h3>
                      <p className="text-xs text-gray-500">
                        Tentukan level dan posisi struktur
                      </p>
                    </div>
                  </div>

                  {/* Converted from grid to vertical stack for full-width inputs */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-600">
                            Level Organisasi
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                form.setValue("regionId", null);
                                form.setValue("sayapTypeId", null);
                              }}
                            >
                              <SelectTrigger className="h-11 rounded-xl border-[#001B55]/15 bg-white/90 shadow-sm w-full">
                                <SelectValue placeholder="Pilih level" />
                              </SelectTrigger>
                              <SelectContent className="max-h-56 rounded-xl border-[#001B55]/15 bg-white/95 backdrop-blur">
                                <SelectItem value="dpd">DPD</SelectItem>
                                <SelectItem value="dpc">DPC</SelectItem>
                                <SelectItem value="dprt">DPRT</SelectItem>
                                <SelectItem value="sayap">Sayap</SelectItem>
                                <SelectItem value="kader">Kader</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-600">
                            Posisi
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value) => field.onChange(value)}
                            >
                              <SelectTrigger className="h-11 rounded-xl border-[#001B55]/15 bg-white/90 shadow-sm w-full">
                                <SelectValue placeholder="Pilih posisi" />
                              </SelectTrigger>
                              <SelectContent className="max-h-56 rounded-xl border-[#001B55]/15 bg-white/95 backdrop-blur">
                                <SelectItem value="ketua">Ketua</SelectItem>
                                <SelectItem value="sekretaris">
                                  Sekretaris
                                </SelectItem>
                                <SelectItem value="bendahara">
                                  Bendahara
                                </SelectItem>
                                <SelectItem value="wakil">Wakil</SelectItem>
                                <SelectItem value="anggota">Anggota</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
                {/* Region & Wings */}
                {(showRegion || showSayap) && (
                  <section className="space-y-5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#001B55]/10 text-[#001B55]">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#001B55]">
                          Wilayah & Sayap
                        </h3>
                        <p className="text-xs text-gray-500">
                          Sesuaikan detail wilayah atau sayap organisasi
                        </p>
                      </div>
                    </div>

                    {/* Converted from grid to vertical stack for full-width inputs */}
                    <div className="space-y-4">
                      {showRegion && (
                        <FormField
                          control={form.control}
                          name="regionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-gray-600">
                                Region
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={
                                    field.value != null
                                      ? String(field.value)
                                      : "none"
                                  }
                                  onValueChange={(value) =>
                                    field.onChange(
                                      value === "none" ? null : Number(value)
                                    )
                                  }
                                >
                                  <SelectTrigger className="h-11 rounded-xl border-[#001B55]/15 bg-white/90 shadow-sm w-full">
                                    <SelectValue placeholder="Pilih region" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-56 rounded-xl border-[#001B55]/15 bg-white/95 backdrop-blur">
                                    <SelectItem value="none">
                                      Tidak ada
                                    </SelectItem>
                                    {sortedRegions.map((region) => (
                                      <SelectItem
                                        key={region.id}
                                        value={String(region.id)}
                                      >
                                        <div className="flex flex-col">
                                          <span>{region.name}</span>
                                          <span className="text-[10px] uppercase tracking-wide text-gray-500">
                                            {region.type}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {showSayap && (
                        <FormField
                          control={form.control}
                          name="sayapTypeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-gray-600">
                                Sayap
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={
                                    field.value != null
                                      ? String(field.value)
                                      : "none"
                                  }
                                  onValueChange={(value) =>
                                    field.onChange(
                                      value === "none" ? null : Number(value)
                                    )
                                  }
                                >
                                  <SelectTrigger className="h-11 rounded-xl border-[#001B55]/15 bg-white/90 shadow-sm w-full">
                                    <SelectValue placeholder="Pilih sayap" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-56 rounded-xl border-[#001B55]/15 bg-white/95 backdrop-blur">
                                    <SelectItem value="none">
                                      Tidak ada
                                    </SelectItem>
                                    {sayapTypes.map((sayap) => (
                                      <SelectItem
                                        key={sayap.id}
                                        value={String(sayap.id)}
                                      >
                                        {sayap.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </section>
                )}
                {/* Period */}
                <section className="space-y-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#001B55]/10 text-[#001B55]">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-[#001B55]">
                        Periode Jabatan
                      </h3>
                      <p className="text-xs text-gray-500">
                        Atur tanggal mulai dan berakhir jabatan
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-600">
                            Tanggal Mulai
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type="date"
                                className="h-11 rounded-xl border-[#001B55]/15 bg-white/90 pl-4 pr-10 shadow-sm"
                                {...field}
                              />
                            </FormControl>
                            <CalendarIcon className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#001B55]/40" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-600">
                            Tanggal Berakhir
                          </FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type="date"
                                className="h-11 rounded-xl border-[#001B55]/15 bg-white/90 pl-4 pr-10 shadow-sm"
                                {...field}
                              />
                            </FormControl>
                            <CalendarIcon className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#001B55]/40" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
                {/* Members */}
                <section className="space-y-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-[#001B55]">
                        Anggota Terhubung
                      </h3>
                      <p className="text-xs text-gray-500">
                        Tambah atau hapus anggota yang terhubung dengan struktur
                        ini
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Input
                      placeholder="Cari nama anggota..."
                      value={memberSearch}
                      onChange={(event) => setMemberSearch(event.target.value)}
                      className="h-9 rounded-xl border-[#001B55]/10"
                    />

                    <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white/70">
                      {membersLoading ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          Memuat anggota...
                        </div>
                      ) : combinedMemberOptions.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          {memberSearch
                            ? "Tidak ditemukan"
                            : "Belum ada data anggota"}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {combinedMemberOptions.map((member) => {
                            const checked = memberIdsValue.includes(member.id);
                            return (
                              <label
                                key={member.id}
                                className={cn(
                                  "flex cursor-pointer items-center gap-3 px-4 py-3",
                                  checked && "bg-white"
                                )}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleMember(member.id)}
                                  className="h-4 w-4 rounded border-gray-300 text-[#001B55] focus:ring-[#001B55]"
                                />
                                <div className="flex min-w-0 flex-1 flex-col">
                                  <span className="truncate text-sm font-medium text-gray-900">
                                    {member.fullName}
                                  </span>
                                  <span className="text-xs uppercase tracking-wide text-gray-500">
                                    {member.status || "active"}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {memberIdsValue.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-600">
                          Dipilih ({memberIdsValue.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {memberIdsValue.map((memberId) => {
                            const detail = combinedMemberOptions.find(
                              (member) => member.id === memberId
                            );
                            return (
                              <span
                                key={memberId}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#001B55] px-3 py-1 text-xs text-white shadow-sm"
                              >
                                {detail?.fullName || `ID:${memberId}`}
                                <button
                                  type="button"
                                  onClick={() => toggleMember(memberId)}
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
                <div className="h-1" />{" "}
                {/* spacer to ensure last item not hidden */}
              </form>
            </Form>
          </div>
          <DialogFooter className="border-t border-gray-200 px-6 py-4 flex-shrink-0 bg-white/70 backdrop-blur-sm">
            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={updating || uploading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={updating || uploading}
                onClick={() => {
                  const el = document.querySelector("form");
                  if (el) (el as HTMLFormElement).requestSubmit();
                }}
                className="h-10 flex-1 bg-[#001B55] hover:bg-[#001B55]/90 text-white"
              >
                {updating || uploading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
