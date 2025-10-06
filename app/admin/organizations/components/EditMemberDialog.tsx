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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, ImageIcon, Upload, Link, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { MemberListItem } from "./MembersTable";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: MemberListItem | null;
  onUpdated?: () => void;
}

const optionalString = z.string().optional().or(z.literal(""));

const editMemberSchema = z.object({
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
  useFileUpload: z.boolean().default(false),
});

type EditMemberFormValues = z.infer<typeof editMemberSchema>;

const defaultEditValues: EditMemberFormValues = {
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
  useFileUpload: false,
};

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  if (!response.ok || !result.success || !result.url) {
    throw new Error(result.error || "Upload gagal");
  }
  return result.url as string;
}

export function EditMemberDialog({
  open,
  onOpenChange,
  member,
  onUpdated,
}: EditMemberDialogProps) {
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: defaultEditValues,
  });

  const useFileUpload = watch("useFileUpload");
  const genderValue = watch("gender");
  const statusValue = watch("status");
  const photoUrlValue = watch("photoUrl");

  React.useEffect(() => {
    if (open && member) {
      const toISODate = (value?: string | Date | null) => {
        if (!value) return "";
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return date.toISOString().slice(0, 10);
      };
      const normalizedGender =
        (member.gender || "").toLowerCase() === "female" ? "female" : "male";
      const normalizedStatus = (() => {
        const value = (member.status || "").toLowerCase();
        if (value === "inactive" || value === "suspended") return value;
        return "active";
      })();

      reset({
        fullName: member.fullName,
        email: member.email || "",
        phone: member.phone || "",
        gender: normalizedGender,
        status: normalizedStatus,
        dateOfBirth: toISODate(member.dateOfBirth),
        address: member.address || "",
        bio: member.bio || "",
        photoUrl: member.photoUrl || "",
        joinDate: toISODate(member.joinDate),
        useFileUpload: false,
      });
      setPhotoFile(null);
    }
    if (!open) {
      reset(defaultEditValues);
      setPhotoFile(null);
    }
  }, [member, open, reset]);

  React.useEffect(() => {
    if (!useFileUpload) {
      setPhotoFile(null);
    }
  }, [useFileUpload]);

  const updateMemberMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Record<string, unknown>;
    }) => {
      const res = await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memperbarui member");
      }
      return json;
    },
    onSuccess: () => {
      toast.success("Member berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      onUpdated?.();
      onOpenChange(false);
      reset(defaultEditValues);
      setPhotoFile(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Gagal memperbarui member");
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!member) return;

    let finalPhotoUrl = values.photoUrl;

    if (values.useFileUpload) {
      if (!photoFile) {
        toast.error("Silakan pilih file foto");
        return;
      }
      try {
        finalPhotoUrl = await uploadImage(photoFile);
      } catch (error) {
        toast.error((error as Error).message || "Gagal mengunggah foto");
        return;
      }
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
    };

    try {
      await updateMemberMutation.mutateAsync({ id: member.id, data: payload });
    } catch (error) {
      // handled in onError
    }
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!updateMemberMutation.isPending) {
          onOpenChange(next);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl h-[85vh] overflow-hidden bg-white shadow-xl rounded-xl p-0 flex flex-col">
        <DialogHeader className="shrink-0 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#001B55]">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold text-[#001B55] truncate">
                Edit Member
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Perbarui informasi profil member
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4 pt-3">
          <form
            onSubmit={onSubmit}
            className="space-y-8 py-2"
            id="edit-member-form"
          >
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
                    Perbarui foto profil member
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
                      onError={(event) => {
                        (
                          event.currentTarget as HTMLImageElement
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
                      <Link className="mr-2 h-3 w-3" />
                      URL Foto
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="text-[11px]">
                      <Upload className="mr-2 h-3 w-3" />
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

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#001B55]/10 text-[#001B55]">
                  <Edit3 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold tracking-wide text-[#001B55] uppercase">
                    Informasi Member
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Perbarui data identitas dan kontak
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
                  <Label className="text-[11px] text-gray-600">Telepon</Label>
                  <Input
                    placeholder="08xxxxxxxxxx"
                    className="h-9 text-sm"
                    {...register("phone")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-gray-600">Gender</Label>
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
                  <Label className="text-[11px] text-gray-600">Status</Label>
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
                  <Label className="text-[11px] text-gray-600">
                    Tanggal Lahir
                  </Label>
                  <Input
                    type="date"
                    className="h-9 text-sm"
                    {...register("dateOfBirth")}
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-[11px] text-gray-600">Alamat</Label>
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
          </form>
        </div>

        <DialogFooter className="shrink-0 border-t border-gray-200 bg-white/80 backdrop-blur px-5 py-4">
          <div className="flex w-full gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
              disabled={updateMemberMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              form="edit-member-form"
              disabled={updateMemberMutation.isPending}
              className="h-9 flex-1 bg-[#001B55] hover:bg-[#001B55]/90 text-white text-sm"
            >
              {updateMemberMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Menyimpan...
                </span>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
