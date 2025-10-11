"use client";

import * as React from "react";
import { RefreshCw, Plus, Building2, ImageIcon, Upload, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  MembersTable,
  type MemberTableFilters,
} from "../components/MembersTable";
import { useMembers } from "@/app/admin/organizations/hooks/useMembers";

// We'll render a simple MemberTable inline here for now
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
import { Textarea } from "@/components/ui/textarea";

const breadcrumbs = [
  { label: "Member", href: "/admin/members" },
  { label: "Kelola Member" },
];

const optionalString = z.string().optional().or(z.literal(""));

const addMemberSchema = z.object({
  fullName: z.string().min(1, "Nama wajib diisi"),
  email: z
    .union([z.string().email("Email tidak valid"), z.literal("")])
    .optional(),
  phone: optionalString,
  gender: z.enum(["male", "female"]),
  status: z.enum(["active", "inactive", "suspended"]),
  dateOfBirth: optionalString,
  address: optionalString,
  bio: optionalString,
  photoUrl: z.union([z.string().url("URL tidak valid"), z.literal("")]),
  joinDate: optionalString,
  nik: optionalString,
  ktaNumber: optionalString,
  familyCount: z.union([z.string(), z.number(), z.literal("")]),
  maritalStatus: optionalString,
  useFileUpload: z.boolean().default(false),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

const defaultAddValues: AddMemberFormValues = {
  fullName: "",
  email: "",
  phone: "",
  gender: "male",
  status: "active",
  dateOfBirth: "",
  address: "",
  bio: "",
  photoUrl: "",
  joinDate: "",
  nik: "",
  ktaNumber: "",
  familyCount: "",
  maritalStatus: "",
  useFileUpload: false,
};

export default function ManageOrganizationPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = React.useState<MemberTableFilters>({
    name: "",
    email: "",
    status: "",
    gender: "",
    address: "",
    take: 10,
    skip: 0,
  });
  const debouncedName = useDebounce(filters.name, 400);
  const debouncedEmail = useDebounce(filters.email, 400);
  const debouncedAddress = useDebounce(filters.address, 400);
  const [openAdd, setOpenAdd] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: defaultAddValues,
  });

  const useFileUpload = watch("useFileUpload");
  const genderValue = watch("gender");
  const statusValue = watch("status");
  const photoUrlValue = watch("photoUrl");

  React.useEffect(() => {
    if (!openAdd) {
      reset(defaultAddValues);
      setPhotoFile(null);
    }
  }, [openAdd, reset]);

  React.useEffect(() => {
    if (!useFileUpload) {
      setPhotoFile(null);
    }
  }, [useFileUpload]);

  // Fetch member data for table view
  const page = Math.floor(filters.skip / filters.take) + 1;
  const pageSize = filters.take;

  const {
    data: membersData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMembers({
    page,
    pageSize,
    name: debouncedName || undefined,
    email: debouncedEmail || undefined,
    address: debouncedAddress || undefined,
    status: filters.status || undefined,
    gender: filters.gender || undefined,
  });
  const members = membersData?.data || [];
  const totalMembers = membersData?.meta?.total || 0;

  const createMemberMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan member");
      }
      return json;
    },
    onSuccess: () => {
      toast.success("Member berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setOpenAdd(false);
      reset(defaultAddValues);
      setPhotoFile(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal menyimpan member");
    },
  });

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

  const handleSubmitAdd = handleSubmit(async (values) => {
    let finalPhotoUrl = values.photoUrl;

    if (values.useFileUpload) {
      if (!photoFile) {
        toast.error("Silakan pilih file foto");
        return;
      }
      const uploadedUrl = await handleFileUpload(photoFile);
      if (!uploadedUrl) {
        toast.error("Gagal mengunggah foto");
        return;
      }
      finalPhotoUrl = uploadedUrl;
    }

    const payload = {
      fullName: values.fullName,
      email: values.email ? values.email : undefined,
      phone: values.phone ? values.phone : undefined,
      gender: values.gender || undefined,
      status: values.status || undefined,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth : undefined,
      address: values.address ? values.address : undefined,
      bio: values.bio ? values.bio : undefined,
      photoUrl: finalPhotoUrl ? finalPhotoUrl : undefined,
      joinDate: values.joinDate ? values.joinDate : undefined,
      nik: values.nik ? values.nik : undefined,
      ktaNumber: values.ktaNumber ? values.ktaNumber : undefined,
      familyCount: values.familyCount ? parseInt(values.familyCount.toString()) : undefined,
      maritalStatus: values.maritalStatus ? values.maritalStatus : undefined,
    };

    try {
      await createMemberMutation.mutateAsync(payload);
    } catch (error) {
      // toast handled in onError
    }
  });

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200/70 rounded-2xl px-6 py-5 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-[#001B55]">Kelola Member</h1>
            <p className="text-sm text-[#6B7280]">
              Manajemen data anggota dan kader
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
              Tambah Member
            </Button>
          </div>
        </div>

        <MembersTable
          data={members}
          totalData={totalMembers}
          loading={isLoading}
          fetching={isFetching}
          error={error}
          isError={isError}
          onRefresh={refetch}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Inline Add Member Dialog */}
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
                    Tambah Member
                  </DialogTitle>
                  <DialogDescription className="text-xs text-gray-500">
                    Tambahkan anggota baru ke sistem
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Scroll Area */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 pt-3 space-y-6">
              <form
                id="add-member-form"
                onSubmit={handleSubmitAdd}
                className="space-y-8"
                aria-label="Form tambah member"
              >
                {/* Foto Profil */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FF9C04]/10 text-[#FF9C04]">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold tracking-wide text-[#001B55] uppercase">
                        Foto Profil
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Gunakan foto profil terbaru
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      {useFileUpload && photoFile ? (
                        <img
                          src={URL.createObjectURL(photoFile)}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : !useFileUpload && photoUrlValue ? (
                        <img
                          src={photoUrlValue}
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
                      value={useFileUpload ? "upload" : "url"}
                      onValueChange={(value) => {
                        const shouldUpload = value === "upload";
                        setValue("useFileUpload", shouldUpload, {
                          shouldValidate: true,
                        });
                        if (shouldUpload) {
                          setValue("photoUrl", "");
                        } else {
                          setPhotoFile(null);
                        }
                      }}
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
                          disabled={useFileUpload}
                          className="h-8 text-sm"
                          {...register("photoUrl")}
                        />
                        {errors.photoUrl && !useFileUpload && (
                          <p className="text-xs font-medium text-red-600">
                            {errors.photoUrl.message}
                          </p>
                        )}
                      </TabsContent>
                      <TabsContent value="upload" className="space-y-2 pt-3">
                        <div className="relative">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setPhotoFile(file);
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
                            {photoFile ? photoFile.name : "Pilih file gambar"}
                          </Button>
                          {photoFile && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => setPhotoFile(null)}
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

                {/* Informasi Member */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#001B55]/10 text-[#001B55]">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold tracking-wide text-[#001B55] uppercase">
                        Informasi Dasar Member
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Data identitas dan kontak
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-[11px] text-gray-600">
                        Nama Lengkap
                      </Label>
                      <Input
                        placeholder="Nama lengkap"
                        className="h-9 text-sm"
                        {...register("fullName")}
                        required
                      />
                      {errors.fullName && (
                        <p className="text-xs font-medium text-red-600">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">Email</Label>
                      <Input
                        type="email"
                        placeholder="email@domain.com"
                        className="h-9 text-sm"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs font-medium text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">
                        Telepon
                      </Label>
                      <Input
                        placeholder="08xxxxxxxxxx"
                        className="h-9 text-sm"
                        {...register("phone")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">
                        Gender
                      </Label>
                      <Select
                        value={genderValue}
                        onValueChange={(value) =>
                          setValue("gender", value as "male" | "female", {
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger className="h-9 text-sm w-full">
                          <SelectValue placeholder="Pilih gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Pria</SelectItem>
                          <SelectItem value="female">Wanita</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-xs font-medium text-red-600">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">
                        Status
                      </Label>
                      <Select
                        value={statusValue}
                        onValueChange={(value) =>
                          setValue(
                            "status",
                            value as "active" | "inactive" | "suspended",
                            { shouldValidate: true }
                          )
                        }
                      >
                        <SelectTrigger className="h-9 text-sm w-full">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Tidak aktif</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.status && (
                        <p className="text-xs font-medium text-red-600">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">NIK</Label>
                      <Input
                        placeholder="16 digit NIK"
                        maxLength={16}
                        className="h-9 text-sm"
                        {...register("nik")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">No. KTA</Label>
                      <Input
                        placeholder="Nomor KTA"
                        className="h-9 text-sm"
                        {...register("ktaNumber")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">
                        Tanggal Lahir
                      </Label>
                      <Input
                        type="date"
                        className="h-9 text-sm"
                        {...register("dateOfBirth")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">Status Perkawinan</Label>
                      <Select
                        defaultValue=""
                        onValueChange={(value) => setValue("maritalStatus", value)}
                      >
                        <SelectTrigger className="h-9 text-sm w-full">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Belum Kawin">Belum Kawin</SelectItem>
                          <SelectItem value="Kawin">Kawin</SelectItem>
                          <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                          <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">Jumlah Keluarga</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        min="1"
                        className="h-9 text-sm"
                        {...register("familyCount")}
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-[11px] text-gray-600">
                        Alamat
                      </Label>
                      <Textarea
                        placeholder="Alamat lengkap"
                        className="text-sm"
                        rows={3}
                        {...register("address")}
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-[11px] text-gray-600">Bio</Label>
                      <Textarea
                        placeholder="Deskripsi singkat"
                        className="text-sm"
                        rows={3}
                        {...register("bio")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] text-gray-600">
                        Tanggal Bergabung
                      </Label>
                      <Input
                        type="date"
                        className="h-9 text-sm"
                        {...register("joinDate")}
                      />
                    </div>
                  </div>
                </section>
                {/* No extra linking here; linking to struktur handled elsewhere */}
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
                  disabled={createMemberMutation.isPending}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  form="add-member-form"
                  disabled={createMemberMutation.isPending}
                  className="h-9 flex-1 bg-[#001B55] hover:bg-[#001B55]/90 text-white text-sm"
                >
                  {createMemberMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Menyimpan...
                    </span>
                  ) : (
                    "Simpan Member"
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
