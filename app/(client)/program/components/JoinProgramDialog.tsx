"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";

// Matches PipRegistration schema requirements
const pipSchema = z.object({
  programId: z.number(),
  fullName: z.string().min(3, "Minimal 3 karakter"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  nik: z.string().length(16, "NIK harus 16 digit"),
  phone: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string().min(4, "Tanggal lahir wajib"),
  gender: z.enum(["male", "female"]),
  occupation: z.string().optional().or(z.literal("")),
  familyMemberCount: z.string().optional().or(z.literal("")),
  fullAddress: z.string().min(10, "Alamat minimal 10 karakter"),
  ktpPhoto: z.any().optional(),
  kkPhoto: z.any().optional(),
});

export type PipForm = z.infer<typeof pipSchema>;

export function JoinProgramDialog({
  programId,
  isSubmitting,
  onSubmit,
}: {
  programId: number;
  isSubmitting: boolean;
  onSubmit: (data: FormData) => void;
}) {
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [kkPreview, setKkPreview] = useState<string | null>(null);
  const [isUploadingKtp, setIsUploadingKtp] = useState(false);
  const [isUploadingKk, setIsUploadingKk] = useState(false);

  const form = useForm<PipForm>({
    resolver: zodResolver(pipSchema),
    defaultValues: {
      programId,
      fullName: "",
      email: "",
      nik: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      occupation: "",
      familyMemberCount: "",
      fullAddress: "",
    },
  });

  const buildFormData = (values: PipForm) => {
    const fd = new FormData();
    fd.set("fullName", values.fullName);
    fd.set("email", values.email || "");
    fd.set("nik", values.nik);
    fd.set("phone", values.phone || "");
    fd.set("dateOfBirth", values.dateOfBirth);
    fd.set("gender", values.gender);
    fd.set("occupation", values.occupation || "");
    fd.set("familyMemberCount", values.familyMemberCount || "");
    fd.set("fullAddress", values.fullAddress);
    // files - If we uploaded via /api/upload first, we can include the URLs in notes or extend API later.
    // For now, still attach raw files for PIP API as optional.
    const ktp = (form.getValues() as any).ktpPhoto as File | undefined;
    const kk = (form.getValues() as any).kkPhoto as File | undefined;
    if (ktp) fd.set("ktpPhoto", ktp);
    if (kk) fd.set("kkPhoto", kk);
    return fd;
  };

  const handleUpload = async (file: File, scope: "ktp" | "kk") => {
    const localUrl = URL.createObjectURL(file);
    scope === "ktp" ? setKtpPreview(localUrl) : setKkPreview(localUrl);
    scope === "ktp" ? setIsUploadingKtp(true) : setIsUploadingKk(true);

    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("scope", "cms"); // use cms scope for general uploads per allowed scopes
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        throw new Error("Upload gagal");
      }
      // We keep preview and original file in form; API /registrations/pip still accepts files.
    } catch (e) {
      // Revert preview on error
      scope === "ktp" ? setKtpPreview(null) : setKkPreview(null);
    } finally {
      scope === "ktp" ? setIsUploadingKtp(false) : setIsUploadingKk(false);
    }
  };

  const removePreview = (scope: "ktp" | "kk") => {
    if (scope === "ktp") {
      setKtpPreview(null);
      form.setValue("ktpPhoto" as any, undefined);
    } else {
      setKkPreview(null);
      form.setValue("kkPhoto" as any, undefined);
    }
  };

  return (
    <DialogContent className="sm:max-w-3xl">
      {/* widened nearly full-screen on desktop */}
      <DialogHeader>
        <DialogTitle>Daftar Program (PIP)</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={form.handleSubmit((v) => onSubmit(buildFormData(v)))}
        className="space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <Input {...form.register("fullName")} placeholder="Nama lengkap" />
            <p className="text-xs text-red-500">
              {form.formState.errors.fullName?.message}
            </p>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              {...form.register("email")}
              placeholder="email@domain.com"
            />
            <p className="text-xs text-red-500">
              {form.formState.errors.email?.message}
            </p>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">NIK</label>
            <Input {...form.register("nik")} placeholder="16 digit" />
            <p className="text-xs text-red-500">
              {form.formState.errors.nik?.message}
            </p>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Telepon</label>
            <Input {...form.register("phone")} placeholder="08xx" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tanggal Lahir</label>
            <Input type="date" {...form.register("dateOfBirth")} />
            <p className="text-xs text-red-500">
              {form.formState.errors.dateOfBirth?.message}
            </p>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Gender</label>
            <select
              className="border rounded px-3 py-2"
              {...form.register("gender")}
            >
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Pekerjaan</label>
            <Input {...form.register("occupation")} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Jumlah Anggota Keluarga
            </label>
            <Input type="number" {...form.register("familyMemberCount")} />
          </div>
          <div className="md:col-span-2 grid gap-2">
            <label className="text-sm font-medium">Alamat Lengkap</label>
            <Input {...form.register("fullAddress")} placeholder="Alamat" />
            <p className="text-xs text-red-500">
              {form.formState.errors.fullAddress?.message}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Foto KTP (opsional)</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  form.setValue("ktpPhoto" as any, f);
                  void handleUpload(f, "ktp");
                }
              }}
            />
            {ktpPreview && (
              <div className="relative w-full h-36 rounded-lg overflow-hidden border">
                <Image
                  src={ktpPreview}
                  alt="KTP preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePreview("ktp")}
                  >
                    Hapus
                  </Button>
                </div>
                {isUploadingKtp && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm">
                    Mengunggah...
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Foto KK (opsional)</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  form.setValue("kkPhoto" as any, f);
                  void handleUpload(f, "kk");
                }
              }}
            />
            {kkPreview && (
              <div className="relative w-full h-36 rounded-lg overflow-hidden border">
                <Image
                  src={kkPreview}
                  alt="KK preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePreview("kk")}
                  >
                    Hapus
                  </Button>
                </div>
                {isUploadingKk && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm">
                    Mengunggah...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
