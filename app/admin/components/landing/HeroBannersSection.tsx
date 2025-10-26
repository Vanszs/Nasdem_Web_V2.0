"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Image, Plus, Trash2, Pencil, Upload } from "lucide-react";
import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Switch as Toggle } from "@/components/ui/switch";

const bannerSchema = z.object({
  imageUrl: z.string().min(1, "URL gambar wajib diisi"),
  uploadMode: z.boolean(),
  order: z.coerce.number().min(0),
  isActive: z.boolean().default(true),
});
type BannerForm = z.infer<typeof bannerSchema>;

export function HeroBannersSection() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["cms", "hero-banners"],
    queryFn: async () => {
      const res = await fetch("/api/cms/hero-banners");
      if (!res.ok) throw new Error("Gagal memuat banner");
      return res.json();
    },
  });
  const banners = data?.data ?? [];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<BannerForm>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      imageUrl: "",
      uploadMode: true,
      order: 0,
      isActive: true,
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      setPreviewUrl(null);
      setIsUploading(false);
      form.reset({ imageUrl: "", uploadMode: true, order: 0, isActive: true });
    } else {
      // Set preview jika edit mode dan ada imageUrl
      if (editingId && form.getValues("imageUrl")) {
        setPreviewUrl(form.getValues("imageUrl"));
      }
    }
  }, [open, editingId]);

  const createMut = useMutation({
    mutationFn: async (payload: BannerForm) => {
      const res = await fetch("/api/cms/hero-banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "hero-banners"] });
      toast.success("Banner ditambahkan");
      setOpen(false);
    },
    onError: () => toast.error("Gagal menambah banner"),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, ...payload }: BannerForm & { id: number }) => {
      const res = await fetch(`/api/cms/hero-banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal mengubah");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "hero-banners"] });
      toast.success("Banner diubah");
      setOpen(false);
    },
    onError: () => toast.error("Gagal mengubah banner"),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/cms/hero-banners/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "hero-banners"] });
      toast.success("Banner dihapus");
    },
    onError: () => toast.error("Gagal menghapus banner"),
  });

  return (
    <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-[#001B55]/5 via-[#FFFFFF] to-[#FF9C04]/5 border-b border-gray-100 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-3 text-[#001B55] mt-2">
            <div className="p-2 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-2xl shadow-md">
              <Image className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Hero Banners</span>
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r mt-2 from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white rounded-xl px-5 py-2.5">
                <Plus className="w-4 h-4 mr-2" /> Tambah Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#001B55]">
                  {editingId ? "Edit Banner Hero" : "Tambah Banner Hero"}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Upload gambar banner untuk ditampilkan di halaman utama
                </p>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((values) =>
                    editingId
                      ? updateMut.mutate({ id: editingId, ...values })
                      : createMut.mutate(values)
                  )}
                  className="space-y-5 pt-3"
                >
                  {/* Upload Mode Toggle */}
                  <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-3">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#001B55]" />
                      <Label className="m-0 font-medium text-[#001B55]">
                        Upload dari komputer
                      </Label>
                    </div>
                    <Toggle
                      checked={!!form.watch("uploadMode")}
                      onCheckedChange={(v) => {
                        form.setValue("uploadMode", v);
                        if (!v) {
                          setPreviewUrl(null);
                          form.setValue("imageUrl", "");
                        }
                      }}
                    />
                  </div>

                  {form.watch("uploadMode") ? (
                    <div className="space-y-3">
                      {/* Drag & Drop Upload Area */}
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-700">
                          Gambar Banner <span className="text-red-500">*</span>
                        </Label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            // Validasi ukuran file (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error("Ukuran gambar maksimal 5MB");
                              return;
                            }

                            // Validasi tipe file
                            if (!file.type.startsWith("image/")) {
                              toast.error("File harus berupa gambar");
                              return;
                            }

                            setIsUploading(true);
                            try {
                              // Preview lokal
                              const localPreview = URL.createObjectURL(file);
                              setPreviewUrl(localPreview);

                              const fd = new FormData();
                              fd.append("file", file);
                              fd.append("scope", "hero");
                              const res = await fetch(
                                "/api/upload?scope=hero",
                                {
                                  method: "POST",
                                  body: fd,
                                }
                              );
                              if (!res.ok)
                                throw new Error("Gagal upload gambar");
                              const json = await res.json();
                              if (!json?.url)
                                throw new Error("Respon upload tidak valid");

                              form.setValue("imageUrl", json.url, {
                                shouldValidate: true,
                              });
                              setPreviewUrl(json.url);
                              toast.success("Gambar berhasil diupload");
                            } catch (err: any) {
                              toast.error(
                                err?.message || "Gagal upload gambar"
                              );
                              setPreviewUrl(null);
                            } finally {
                              setIsUploading(false);
                              if (fileInputRef.current)
                                fileInputRef.current.value = "";
                            }
                          }}
                        />

                        {/* Upload Area dengan Preview */}
                        <div
                          onClick={() =>
                            !isUploading && fileInputRef.current?.click()
                          }
                          className={`
                            border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
                            ${
                              isUploading
                                ? "border-blue-300 bg-blue-50 cursor-wait"
                                : previewUrl
                                ? "border-green-300 bg-green-50 hover:border-green-400"
                                : "border-gray-300 bg-gray-50 hover:border-[#FF9C04] hover:bg-[#FF9C04]/5"
                            }
                          `}
                        >
                          {isUploading ? (
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 border-4 border-blue-200 border-t-[#001B55] rounded-full animate-spin" />
                              <p className="text-sm font-medium text-[#001B55]">
                                Mengupload gambar...
                              </p>
                            </div>
                          ) : previewUrl ? (
                            <div className="space-y-3">
                              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">
                                  Gambar berhasil diupload
                                </span>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="mt-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fileInputRef.current?.click();
                                }}
                              >
                                Ganti Gambar
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 flex items-center justify-center shadow-lg">
                                <Upload className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#001B55] mb-1">
                                  Klik untuk upload gambar
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, WEBP (Maks. 5MB)
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-gray-700">
                            URL Gambar <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setPreviewUrl(e.target.value);
                              }}
                              className="h-10 border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                          {previewUrl && (
                            <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                              <p className="text-xs font-medium text-gray-700 mb-2">
                                Preview:
                              </p>
                              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={() => setPreviewUrl(null)}
                                />
                              </div>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  )}
                  {/* Order Input */}
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">
                          Urutan Tampilan{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...field}
                            className="h-10 border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          Banner dengan urutan lebih kecil akan ditampilkan
                          lebih dulu
                        </p>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Active Status Toggle */}
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-3">
                        <div>
                          <FormLabel className="m-0 font-medium text-[#001B55]">
                            Status Aktif
                          </FormLabel>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Banner akan ditampilkan di halaman utama
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={
                        isUploading ||
                        createMut.isPending ||
                        updateMut.isPending
                      }
                      className="h-10 px-5 cursor-pointer"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isUploading ||
                        createMut.isPending ||
                        updateMut.isPending ||
                        !form.watch("imageUrl")
                      }
                      className="h-10 px-5 cursor-pointer bg-[#001B55] hover:bg-[#001B55]/90 text-white"
                    >
                      {isUploading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Mengupload...
                        </>
                      ) : createMut.isPending || updateMut.isPending ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Menyimpan...
                        </>
                      ) : editingId ? (
                        "Simpan Perubahan"
                      ) : (
                        "Simpan Banner"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200 border-b-2 border-gray-300">
                <TableHead className="w-[60%]">Gambar</TableHead>
                <TableHead>Urutan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((b: any) => (
                <TableRow key={b.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.imageUrl}
                        alt="banner"
                        className="h-12 w-20 object-cover rounded"
                      />
                      <span className="text-sm text-[#475569]">
                        {b.imageUrl}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{b.order}</TableCell>
                  <TableCell>
                    <span
                      className={
                        b.isActive ? "text-green-600" : "text-slate-400"
                      }
                    >
                      {b.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        disabled={editingId === b.id && updateMut.isPending}
                        onClick={() => {
                          setEditingId(b.id);
                          form.reset({
                            imageUrl: b.imageUrl,
                            uploadMode: false,
                            order: b.order,
                            isActive: b.isActive,
                          });
                          setPreviewUrl(b.imageUrl);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="cursor-pointer"
                        disabled={deleteId === b.id && deleteMut.isPending}
                        onClick={() => {
                          setDeleteId(b.id);
                          setConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Apakah kamu yakin ingin menghapus banner ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setConfirmOpen(false);
                setDeleteId(null);
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={deleteId === null || deleteMut.isPending}
              className="cursor-pointer"
              onClick={() => {
                if (deleteId) deleteMut.mutate(deleteId);
                setConfirmOpen(false);
                setDeleteId(null);
              }}
            >
              Ya, Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
