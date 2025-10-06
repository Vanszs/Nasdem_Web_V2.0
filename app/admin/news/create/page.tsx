"use client";

import { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "../../components/layout/AdminLayout";
import {
  ArrowLeft,
  Calendar,
  Eye,
  FileText,
  Image,
  Save,
  Loader2,
  X,
} from "lucide-react";
import { useCreateNews } from "@/app/admin/news/hooks";

const formSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z
    .string()
    .min(20, "Konten minimal 20 karakter agar layak publikasi"),
  publishDate: z.string().min(1, "Tanggal publikasi wajib diisi"),
  thumbnailUrl: z
    .string()
    .url("Unggah gambar sampul terlebih dahulu"),
});

type FormValues = z.infer<typeof formSchema>;

function getDefaultPublishDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

export default function CreateNewsPage() {
  const router = useRouter();
  const mutation = useCreateNews();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(
      () => ({
        title: "",
        content: "",
        publishDate: getDefaultPublishDate(),
        thumbnailUrl: "",
      }),
      []
    ),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  const thumbnailUrl = watch("thumbnailUrl");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("scope", "news");

      const res = await fetch("/api/upload?scope=news", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengunggah gambar");
      }

      setValue("thumbnailUrl", json.url, { shouldValidate: true });
      clearErrors("thumbnailUrl");
      toast.success("Gambar berhasil diunggah", {
        description: "Gunakan pratinjau di bawah untuk memastikan tampilannya.",
      });
    } catch (error) {
      setError("thumbnailUrl", {
        type: "manual",
        message: (error as Error).message,
      });
      toast.error("Upload gagal", {
        description: (error as Error).message,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setValue("thumbnailUrl", "", { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Gambar sampul dihapus", {
      description: "Unggah gambar baru sebelum menyimpan berita.",
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        title: values.title,
        content: values.content,
        publishDate: values.publishDate
          ? new Date(values.publishDate).toISOString()
          : undefined,
        thumbnailUrl: values.thumbnailUrl.trim(),
      };

      await mutation.mutateAsync(payload);
      toast.success("Berita berhasil dibuat", {
        description: "Artikel siap ditinjau atau dipublikasikan.",
      });
      router.push("/admin/news");
    } catch (error) {
      toast.error("Gagal menyimpan berita", {
        description: (error as Error).message,
      });
    }
  });

  const isBusy = isSubmitting || mutation.isPending || isUploading;

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    { label: "Berita", href: "/admin/news" },
    { label: "Tulis Berita" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/news")}
                className="border-2 border-gray-200 hover:border-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Tulis Berita Baru</h1>
                <p className="text-muted-foreground text-sm">
                  Isi informasi berita dengan lengkap sebelum dipublikasikan.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isBusy}
                onClick={() =>
                  toast.info("Pratinjau belum tersedia", {
                    description: "Fitur pratinjau akan hadir segera.",
                  })
                }
                className="border-2 border-gray-200 hover:border-gray-300"
              >
                <Eye className="mr-2 h-4 w-4" />
                Pratinjau
              </Button>
              <Button
                type="submit"
                disabled={isBusy}
                className="bg-[#FF9C04] hover:bg-[#001B55] text-white border-2 border-[#FF9C04] hover:border-[#001B55] shadow-lg transition-all duration-300"
              >
                <Save className="mr-2 h-4 w-4" />
                {isBusy ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-2 border-gray-300/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Konten Utama
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Judul Berita *
                  </label>
                  <Input
                    {...register("title")}
                    placeholder="Masukkan judul berita"
                    disabled={isBusy}
                    className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                  />
                  {errors.title && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Konten Berita *
                  </label>
                  <Textarea
                    {...register("content")}
                    placeholder="Tulis konten berita di sini..."
                    disabled={isBusy}
                    className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary min-h-[280px]"
                  />
                  {errors.content && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.content.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-gray-300/80 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  Pengaturan Publikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tanggal Publikasi *
                  </label>
                  <Input
                    type="datetime-local"
                    {...register("publishDate")}
                    disabled={isBusy}
                    className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                  />
                  {errors.publishDate && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.publishDate.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Waktu publikasi akan dikonversi otomatis ke zona waktu server.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300/80 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Image className="h-5 w-5" />
                  Sampul Berita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input type="hidden" {...register("thumbnailUrl")} />

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Unggah Gambar Sampul
                  </label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    disabled={isBusy}
                    className="border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format yang didukung: JPG, PNG, WEBP (maksimal 5MB).
                  </p>
                  {errors.thumbnailUrl && (
                    <p className="text-xs text-red-600">
                      {errors.thumbnailUrl.message}
                    </p>
                  )}
                  {isUploading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Mengunggah gambar...
                    </div>
                  )}
                </div>

                {thumbnailUrl && (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      Pratinjau gambar sampul:
                    </p>
                    <div className="relative aspect-video overflow-hidden rounded-md bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnailUrl}
                        alt="Pratinjau gambar sampul"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                      disabled={isBusy}
                      className="mt-3 text-xs text-red-600 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="mr-2 h-3.5 w-3.5" />
                      Hapus gambar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
