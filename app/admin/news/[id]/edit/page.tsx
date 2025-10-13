"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminLayout } from "../../../components/layout/AdminLayout";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Image as ImageIcon,
  Loader2,
  Save,
  X,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useNewsDetail, useUpdateNews } from "@/app/admin/news/hooks";

const BlockNoteEditor = dynamic(
  () => import("../../components/blocknote-editor"),
  { ssr: false }
);

const formSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z
    .string()
    .min(20, "Konten minimal 20 karakter")
    .refine((val) => val.replace(/<[^>]*>/g, "").trim().length >= 20, {
      message: "Konten minimal 20 karakter",
    }),
  publishDate: z.string().optional().or(z.literal("")),
  thumbnailUrl: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const { data, isLoading } = useNewsDetail(
    Number.isFinite(id) ? id : undefined
  );
  const updateMutation = useUpdateNews();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(
      () => ({
        title: "",
        content: "",
        publishDate: "",
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
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (!data) return;
    reset({
      title: data.title ?? "",
      content: data.content ?? "",
      publishDate: data.publishDate
        ? new Date(data.publishDate).toISOString().slice(0, 16)
        : "",
      thumbnailUrl: data.thumbnailUrl ?? "",
    });
  }, [data, reset]);

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
      if (!res.ok || !json.success)
        throw new Error(json.error || "Gagal mengunggah gambar");
      setValue("thumbnailUrl", json.url, { shouldValidate: true });
      clearErrors("thumbnailUrl");
      toast.success("Gambar berhasil diunggah");
    } catch (error) {
      setError("thumbnailUrl", {
        type: "manual",
        message: (error as Error).message,
      });
      toast.error("Upload gagal", { description: (error as Error).message });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setValue("thumbnailUrl", "", { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Gambar sampul dihapus");
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const cleanContent = values.content.replace(/<[^>]*>/g, "").trim();
      if (cleanContent.length < 20) {
        toast.error("Konten terlalu pendek", {
          description: "Konten minimal 20 karakter",
        });
        return;
      }
      await updateMutation.mutateAsync({
        id,
        title: values.title.trim(),
        content: values.content.trim(),
        publishDate: values.publishDate
          ? new Date(values.publishDate).toISOString()
          : null,
        thumbnailUrl: values.thumbnailUrl?.trim() || null,
      });
      toast.success("Berita berhasil diperbarui");
      router.push("/admin/news");
    } catch (error) {
      toast.error("Gagal memperbarui berita", {
        description: (error as Error).message,
      });
    }
  });

  const isBusy =
    isLoading || isSubmitting || updateMutation.isPending || isUploading;

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    { label: "Berita", href: "/admin/news" },
    { label: "Edit Berita" },
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
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Berita</h1>
                <p className="text-muted-foreground text-sm">
                  Perbarui informasi berita dengan data terbaru.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={isBusy}
                className="bg-[#FF9C04] hover:bg-[#001B55] text-white border-2 border-[#FF9C04] hover:border-[#001B55] shadow-lg transition-all duration-300"
              >
                <Save className="mr-2 h-4 w-4" />{" "}
                {isBusy ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-2 border-gray-300/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" /> Konten Utama
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

                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Konten Berita *
                  </label>
                  <BlockNoteEditor
                    value={watch("content")}
                    onChange={(html: string) =>
                      setValue("content", html, { shouldValidate: true })
                    }
                    placeholder="Tulis konten berita di sini..."
                    disabled={isBusy}
                    className="bg-white shadow-sm focus-within:shadow-md transition-shadow duration-200"
                  />
                  {errors.content && (
                    <p className="mt-1 text-xs text-red-600">
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
                  <Calendar className="h-5 w-5" /> Pengaturan Publikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tanggal Publikasi
                  </label>
                  <Input
                    type="datetime-local"
                    {...register("publishDate")}
                    disabled={isBusy}
                    className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Waktu publikasi akan dikonversi otomatis ke zona waktu
                    server.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-300/80 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5" /> Sampul Berita
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
                      {String(errors.thumbnailUrl.message)}
                    </p>
                  )}
                  {isUploading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
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
                      <Image
                        src={thumbnailUrl}
                        alt="Pratinjau gambar sampul"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                        className="object-cover"
                        unoptimized
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
                      <X className="mr-2 h-3.5 w-3.5" /> Hapus gambar
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
