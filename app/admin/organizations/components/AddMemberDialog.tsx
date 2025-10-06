"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Camera } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  bio: string;
  gender: "" | "MALE" | "FEMALE";
  status: "ACTIVE" | "INACTIVE";
  strukturId: string | null;
  joinDate: string;
  endDate: string;
  photoFile: File | null;
  photoUrl: string;
}

interface AddMemberDialogProps {
  formData: FormData;
  setFormData: (fn: (p: FormData) => FormData) => void;
  onAdd: () => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  submitting?: boolean;
  strukturOptions?: { id: number; title: string }[];
  uploading?: boolean;
  photoError?: string | null;
}

export function AddMemberDialog({
  formData,
  setFormData,
  onAdd,
  open,
  onOpenChange,
  submitting = false,
  strukturOptions = [],
  uploading = false,
  photoError = null,
}: AddMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#FF9C04] hover:bg-[#FF9C04]/90 text-white font-semibold border-2 border-[#FF9C04]/20 hover:border-[#FF9C04]/40 transition-all duration-300 shadow-lg hover:shadow-xl">
          <Plus className="mr-2 h-4 w-4" /> Tambah Anggota
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-4xl bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#001B55] to-[#FF9C04] bg-clip-text text-transparent">
            Tambah Anggota Baru
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-2">
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#001B55] to-[#FF9C04] rounded-full blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
                <Avatar className="relative w-40 h-40 border-4 border-white shadow-xl">
                  <AvatarImage
                    src={
                      formData.photoFile
                        ? URL.createObjectURL(formData.photoFile)
                        : formData.photoUrl
                    }
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                    <Camera className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-3 right-3 bg-gradient-to-r from-[#FF9C04] to-[#FFB84D] hover:from-[#001B55] hover:to-[#003875] text-white rounded-full p-3 cursor-pointer shadow-lg transition-all duration-300"
                >
                  <Camera className="h-5 w-5" />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // eksklusif: reset URL jika file dipilih
                      setFormData((p) => ({
                        ...p,
                        photoFile: file,
                        photoUrl: "",
                      }));
                    }
                  }}
                  className="hidden"
                />
              </div>
              <Input
                placeholder="URL Foto (opsional)"
                value={formData.photoUrl}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    photoUrl: e.target.value,
                    // eksklusif: reset file jika user mengetik url
                    photoFile: e.target.value ? null : p.photoFile,
                  }))
                }
                className="bg-white/60 border-slate-200/70 rounded-xl"
              />
              {photoError && (
                <p className="text-xs text-red-600 font-medium -mt-4">
                  {photoError}
                </p>
              )}
              {(uploading || submitting) && (
                <p className="text-xs text-[#001B55] animate-pulse font-medium">
                  {uploading ? "Mengunggah gambar..." : "Menyimpan data..."}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Nama Lengkap *
                </Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, fullName: e.target.value }))
                  }
                  placeholder="Masukkan nama lengkap"
                  className="bg-white/50 border-2 border-slate-200/60 focus:border-[#001B55] rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Email
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="email@example.com"
                  className="bg-white/50 border-2 border-slate-200/60 focus:border-[#001B55] rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Telepon
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="0812-XXXX-XXXX"
                  className="bg-white/50 border-2 border-slate-200/60 focus:border-[#001B55] rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Tanggal Lahir
                </Label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, dateOfBirth: e.target.value }))
                  }
                  className="bg-white/50 border-2 border-slate-200/60 focus:border-[#001B55] rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Tanggal Bergabung
                </Label>
                <Input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, joinDate: e.target.value }))
                  }
                  className="bg-white/50 border-2 border-slate-200/60 focus:border-[#001B55] rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Tanggal Berakhir (opsional)
                </Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, endDate: e.target.value }))
                  }
                  className="bg-white/50 border-2 border-slate-200/60 focus:border-[#001B55] rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(v: any) =>
                    setFormData((p) => ({ ...p, gender: v }))
                  }
                >
                  <SelectTrigger className="bg-white/50 border-2 border-slate-200/60 rounded-xl">
                    <SelectValue placeholder="Pilih gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Laki-laki</SelectItem>
                    <SelectItem value="FEMALE">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: any) =>
                    setFormData((p) => ({ ...p, status: v }))
                  }
                >
                  <SelectTrigger className="bg-white/50 border-2 border-slate-200/60 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                    <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Struktur Organisasi
                </Label>
                <Select
                  value={formData.strukturId ?? undefined}
                  onValueChange={(v: string) =>
                    setFormData((p) => ({
                      ...p,
                      strukturId: v === "none" ? null : v,
                    }))
                  }
                >
                  <SelectTrigger className="bg-white/50 border-2 border-slate-200/60 rounded-xl">
                    <SelectValue placeholder="Pilih struktur (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">(Tidak di-set)</SelectItem>
                    {strukturOptions.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Alamat
                </Label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="Masukkan alamat"
                  className="bg-white/50 border-2 border-slate-200/60 focus:border-[#001B55] rounded-xl"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Bio / Deskripsi
                </Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, bio: e.target.value }))
                  }
                  placeholder="Deskripsi peran / catatan"
                  className="bg-white/50 border-2 border-slate-200/60 focus:border-[#001B55] rounded-xl min-h-[120px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Batal
          </Button>
          <Button
            onClick={onAdd}
            disabled={submitting || uploading || !formData.fullName}
            className="px-8 py-3 bg-gradient-to-r from-[#FF9C04] via-[#FFB84D] to-[#FF9C04] hover:from-[#001B55] hover:to-[#001B55] text-white font-semibold rounded-xl shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting || uploading ? (
              "Memproses..."
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" /> Simpan
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
