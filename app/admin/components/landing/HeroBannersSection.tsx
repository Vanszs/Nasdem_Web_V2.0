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
  imageUrl: z
    .string()
    .url({ message: "Masukkan URL gambar yang valid" })
    .optional(),
  // transient state for UI only; not sent to API
  uploadMode: z.boolean().optional(),
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

  const form = useForm<BannerForm>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      imageUrl: "",
      uploadMode: false,
      order: 0,
      isActive: true,
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      form.reset({ imageUrl: "", order: 0, isActive: true });
    }
  }, [open]);

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
                <DialogTitle>
                  {editingId ? "Edit Banner" : "Tambah Banner"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((values) =>
                    editingId
                      ? updateMut.mutate({ id: editingId, ...values })
                      : createMut.mutate(values)
                  )}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label className="m-0">Unggah file gambar</Label>
                    <Toggle
                      checked={!!form.watch("uploadMode")}
                      onCheckedChange={(v) => form.setValue("uploadMode", v)}
                    />
                  </div>
                  {form.watch("uploadMode") ? (
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const fd = new FormData();
                            fd.append("file", file);
                            fd.append("scope", "hero");
                            const res = await fetch("/api/upload?scope=hero", {
                              method: "POST",
                              body: fd,
                            });
                            if (!res.ok) throw new Error("Gagal upload gambar");
                            const json = await res.json();
                            if (!json?.url)
                              throw new Error("Respon upload tidak valid");
                            form.setValue("imageUrl", json.url, {
                              shouldValidate: true,
                            });
                            toast.success("Gambar berhasil diupload");
                          } catch (err: any) {
                            toast.error(err?.message || "Gagal upload gambar");
                          } finally {
                            // reset to allow re-upload same file
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4" /> Pilih File
                      </Button>
                      {form.watch("imageUrl") && (
                        <div className="text-xs text-[#475569] break-all">
                          URL: {form.watch("imageUrl")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Gambar</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urutan</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <FormLabel className="m-0">Aktif</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMut.isPending || updateMut.isPending}
                    >
                      {editingId ? "Simpan Perubahan" : "Simpan"}
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
                            order: b.order,
                            isActive: b.isActive,
                          });
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
