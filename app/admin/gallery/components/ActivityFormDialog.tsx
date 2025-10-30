"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const CategoryEnum = [
  "sosial",
  "politik",
  "pendidikan",
  "kaderisasi",
  "internal",
  "kolaborasi",
  "pelayanan",
  "publikasi",
  "lainnya",
] as const;

const MediaTypeEnum = ["image", "video"] as const;

const mediaItemSchema = z.object({
  id: z.number().optional(),
  type: z.enum(MediaTypeEnum),
  url: z.string(),
  caption: z.string().min(1, "Caption wajib diisi"),
  order: z.number().int().nonnegative(),
});

const formSchema = z.object({
  title: z.string().min(3, "Minimal 3 karakter"),
  description: z.string().optional(),
  category: z.enum(CategoryEnum),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  media: z.array(mediaItemSchema).min(1, "Minimal 1 media"),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData?: Partial<FormValues> & { id?: number };
}

export function ActivityFormDialog({ open, onOpenChange, initialData }: Props) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(initialData?.id);
  const [isUploading, setIsUploading] = useState(false);
  const inferType = (url: string): (typeof MediaTypeEnum)[number] =>
    /youtube\.com|youtu\.be|vimeo\.com|\.mp4($|\?)|\.webm($|\?)|\.m3u8($|\?)|\.mov($|\?)/i.test(
      url
    )
      ? "video"
      : "image";
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: (initialData?.category as any) || "sosial",
      eventDate: initialData?.eventDate || "",
      location: initialData?.location || "",
      media: Array.isArray(initialData?.media)
        ? (initialData!.media as any[])
            .map((m, i) =>
              typeof m === "string"
                ? {
                    type: inferType(m),
                    url: m,
                    caption: "Media " + (i + 1),
                    order: i,
                  }
                : {
                    id: (m as any).id,
                    type: (m as any).type,
                    url: (m as any).url,
                    caption: (m as any).caption || "Media " + (i + 1),
                    order: (m as any).order ?? i,
                  }
            )
            .filter((m) => Boolean(m?.url))
        : [],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: initialData?.title || "",
        description: initialData?.description || "",
        category: (initialData?.category as any) || "sosial",
        eventDate: initialData?.eventDate || "",
        location: initialData?.location || "",
        media: Array.isArray(initialData?.media)
          ? (initialData!.media as any[])
              .map((m, i) =>
                typeof m === "string"
                  ? {
                      type: inferType(m),
                      url: m,
                      caption: "Media " + (i + 1),
                      order: i,
                    }
                  : {
                      id: (m as any).id,
                      type: (m as any).type,
                      url: (m as any).url,
                      caption: (m as any).caption || "Media " + (i + 1),
                      order: (m as any).order ?? i,
                    }
              )
              .filter((m) => Boolean(m?.url))
          : [],
      });
    }
  }, [open, initialData, form]);

  // Use useWatch to avoid triggering internal state updates during render
  const media = (useWatch({ control: form.control, name: "media" }) ||
    []) as Array<z.infer<typeof mediaItemSchema>>;

  const uploadImages = async (files: File[]) => {
    setIsUploading(true);
    try {
      const results: { url: string }[] = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error("Format tidak didukung. Hanya gambar.");
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Ukuran gambar maksimal 5MB");
          continue;
        }
        const fd = new FormData();
        fd.append("file", file);
        fd.append("scope", "gallery");
        const res = await fetch("/api/upload?scope=gallery", {
          method: "POST",
          body: fd,
        });
        const json = await res.json();
        if (!res.ok || !json?.url)
          throw new Error(json?.error || "Upload gagal");
        results.push({ url: json.url });
      }
      if (results.length) {
        // Simpan ke pending dengan caption & order default untuk setiap media
        const currentLength = (form.getValues("media") || []).length;
        setPendingMedia(
          results.map((r, idx) => ({
            type: "image" as const,
            url: r.url,
            caption: "",
            order: currentLength + idx,
          }))
        );
        setShowMediaConfirmDialog(true);
      }
    } catch (e: any) {
      toast.error(e?.message || "Upload gagal");
    } finally {
      setIsUploading(false);
    }
  };

  const addImageByUrl = (url: string) => {
    if (!url) return;
    try {
      new URL(url);
    } catch {
      toast.error("URL tidak valid");
      return;
    }
    // Simpan ke pending dengan caption & order default
    const currentLength = (form.getValues("media") || []).length;
    setPendingMedia([
      { type: "image", url, caption: "", order: currentLength },
    ]);
    setShowMediaConfirmDialog(true);
  };

  const addVideoByUrl = (url: string) => {
    if (!url) return;
    try {
      new URL(url);
    } catch {
      toast.error("URL tidak valid");
      return;
    }
    // Simpan ke pending dengan caption & order default
    const currentLength = (form.getValues("media") || []).length;
    setPendingMedia([
      { type: "video", url, caption: "", order: currentLength },
    ]);
    setShowMediaConfirmDialog(true);
  };

  const removeMedia = (idx: number) => {
    const current = (form.getValues("media") || []) as Array<
      z.infer<typeof mediaItemSchema>
    >;
    const next = current
      .filter((_, i) => i !== idx)
      .map((m, i) => ({ ...m, order: i }));
    form.setValue("media", next, { shouldValidate: true });
  };

  // Handler untuk konfirmasi penambahan media dengan caption & order individual
  const confirmAddMedia = () => {
    if (pendingMedia.length === 0) return;

    // Validasi semua caption harus diisi
    const emptyCaption = pendingMedia.some((pm) => !pm.caption.trim());
    if (emptyCaption) {
      toast.error("Semua caption wajib diisi");
      return;
    }

    const current = (form.getValues("media") || []) as Array<
      z.infer<typeof mediaItemSchema>
    >;

    // Tambahkan semua media dari pending dengan caption & order masing-masing
    const newMedia = pendingMedia.map((pm) => ({
      type: pm.type,
      url: pm.url,
      caption: pm.caption.trim(),
      order: pm.order,
    }));

    form.setValue("media", [...current, ...newMedia], { shouldValidate: true });
    toast.success(`${pendingMedia.length} media ditambahkan`);

    // Reset state
    setPendingMedia([]);
    setShowMediaConfirmDialog(false);
    setImageUrlInput("");
    setVideoUrlInput("");
  };

  const cancelAddMedia = () => {
    setPendingMedia([]);
    setShowMediaConfirmDialog(false);
  };

  // Handler untuk update caption/order pada pending media
  const updatePendingMedia = (
    idx: number,
    field: "caption" | "order",
    value: string | number
  ) => {
    setPendingMedia((prev) =>
      prev.map((pm, i) => (i === idx ? { ...pm, [field]: value } : pm))
    );
  };

  // Handler untuk membuka dialog edit media existing
  const openEditMedia = (idx: number) => {
    const current = (form.getValues("media") || []) as Array<
      z.infer<typeof mediaItemSchema>
    >;
    const mediaToEdit = current[idx];
    if (mediaToEdit) {
      setEditingMediaIndex(idx);
      setEditCaption(mediaToEdit.caption);
      setEditOrder(mediaToEdit.order);
      setShowEditMediaDialog(true);
    }
  };

  const confirmEditMedia = () => {
    if (editingMediaIndex === null) return;
    if (!editCaption.trim()) {
      toast.error("Caption wajib diisi");
      return;
    }

    const current = (form.getValues("media") || []) as Array<
      z.infer<typeof mediaItemSchema>
    >;
    const updated = current.map((m, i) =>
      i === editingMediaIndex
        ? { ...m, caption: editCaption.trim(), order: editOrder }
        : m
    );

    form.setValue("media", updated, { shouldValidate: true });
    toast.success("Media berhasil diperbarui");

    setEditingMediaIndex(null);
    setShowEditMediaDialog(false);
    setEditCaption("");
    setEditOrder(0);
  };

  const cancelEditMedia = () => {
    setEditingMediaIndex(null);
    setShowEditMediaDialog(false);
    setEditCaption("");
    setEditOrder(0);
  };

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        title: values.title,
        description: values.description,
        category: values.category,
        eventDate: values.eventDate || undefined,
        location: values.location,
        media: values.media.map((m, idx) => ({
          type: m.type,
          url: m.url,
          caption: m.caption,
          order: idx,
        })),
      };
      // trigger mutation to create/update activity
      const res = await fetch(
        isEdit ? `/api/galleries/${initialData?.id}` : "/api/galleries",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok || !json?.success)
        throw new Error(json?.error || "Gagal menyimpan");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success(isEdit ? "Aktivitas diperbarui" : "Aktivitas ditambahkan");
      onOpenChange(false);
    },
    onError: (err: any) => toast.error(err?.message || "Gagal menyimpan"),
  });

  const onSubmit = (values: FormValues) => {
    console.log("Submitting form with values:", values);
    mutation.mutate(values);
  };

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");

  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const fileInputRef = useState<HTMLInputElement | null>(null);

  // State untuk dialog konfirmasi media - setiap media punya caption & order sendiri
  const [pendingMedia, setPendingMedia] = useState<
    Array<{
      type: "image" | "video";
      url: string;
      caption: string;
      order: number;
    }>
  >([]);
  const [showMediaConfirmDialog, setShowMediaConfirmDialog] = useState(false);

  // State untuk edit media existing
  const [editingMediaIndex, setEditingMediaIndex] = useState<number | null>(
    null
  );
  const [showEditMediaDialog, setShowEditMediaDialog] = useState(false);
  const [editCaption, setEditCaption] = useState("");
  const [editOrder, setEditOrder] = useState(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b border-gray-200">
          <DialogTitle className="text-xl font-bold text-[#001B55]">
            {isEdit ? "Edit Aktivitas" : "Tambah Aktivitas Baru"}
          </DialogTitle>
        </DialogHeader>

        {/* Fallback UI: saving/error state banner */}
        {(mutation.isPending || mutation.isError) && (
          <div
            className={
              "mt-3 mb-2 rounded-lg border px-3 py-2 text-sm" +
              (mutation.isPending
                ? " bg-[#E8F9FF] border-[#C4D9FF] text-[#001B55]"
                : " bg-red-50 border-red-200 text-red-700")
            }
            role="status"
            aria-live="polite"
          >
            {mutation.isPending ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
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
                {isEdit ? "Menyimpan perubahan..." : "Menyimpan aktivitas..."}
              </div>
            ) : (
              <span>
                {(mutation.error as any)?.message || "Terjadi kesalahan"}
              </span>
            )}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("Validation errors:", errors);
              toast.error(
                "Form belum valid, periksa kembali field yang wajib diisi"
              );
            })}
            className="space-y-5 pt-4"
          >
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#001B55] uppercase tracking-wide">
                Informasi Dasar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Judul <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan judul aktivitas"
                          disabled={mutation.isPending || isUploading}
                          className="h-9 text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Kategori <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={mutation.isPending || isUploading}
                            className="h-9 text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
                          >
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CategoryEnum.map((c) => (
                            <SelectItem
                              key={c}
                              value={c}
                              className="cursor-pointer capitalize text-sm"
                            >
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="eventDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Tanggal Kegiatan
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={mutation.isPending || isUploading}
                          className="h-9 text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="location"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Lokasi
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Masukkan lokasi"
                          disabled={mutation.isPending || isUploading}
                          className="h-9 text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-medium text-gray-700">
                        Deskripsi
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Tuliskan deskripsi singkat aktivitas"
                          rows={3}
                          disabled={mutation.isPending || isUploading}
                          className="text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF] resize-none"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-[#001B55] uppercase tracking-wide">
                Media <span className="text-red-500">*</span>
              </h3>

              {/* Media Type Selector */}
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-xs font-medium text-gray-700 mr-2">
                  Tipe Media:
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={mediaType === "image" ? "default" : "outline"}
                    onClick={() => setMediaType("image")}
                    className={`h-8 px-4 text-xs font-medium cursor-pointer transition-all ${
                      mediaType === "image"
                        ? "bg-[#C5BAFF] text-[#001B55] hover:bg-[#b0a5e6] border-[#C5BAFF]"
                        : "border-gray-300 hover:border-[#C5BAFF] hover:bg-gray-100"
                    }`}
                  >
                    📷 Gambar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={mediaType === "video" ? "default" : "outline"}
                    onClick={() => setMediaType("video")}
                    className={`h-8 px-4 text-xs font-medium cursor-pointer transition-all ${
                      mediaType === "video"
                        ? "bg-[#C5BAFF] text-[#001B55] hover:bg-[#b0a5e6] border-[#C5BAFF]"
                        : "border-gray-300 hover:border-[#C5BAFF] hover:bg-gray-100"
                    }`}
                  >
                    🎥 Video
                  </Button>
                </div>
              </div>

              {/* Conditional Media Upload */}
              {mediaType === "image" ? (
                <div className="space-y-2">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-[#C5BAFF] transition-colors">
                    <label className="flex flex-col items-center cursor-pointer">
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 mx-auto bg-[#E8F9FF] rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-[#001B55]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#001B55]">
                            Upload Gambar
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, WEBP (Maks. 5MB)
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        onChange={(e) =>
                          uploadImages(Array.from(e.target.files || []))
                        }
                        className="hidden"
                        disabled={isUploading || mutation.isPending}
                      />
                    </label>
                    {isUploading && (
                      <div className="mt-2 text-center">
                        <span className="text-xs text-[#001B55] font-medium">
                          Mengunggah...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* URL Input */}
                  <div className="flex gap-2">
                    <Input
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Atau masukkan URL gambar"
                      disabled={mutation.isPending || isUploading}
                      className="h-9 text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-9 px-4 text-xs cursor-pointer border-gray-300 hover:bg-[#E8F9FF] hover:border-[#C5BAFF] hover:text-[#001B55]"
                      disabled={mutation.isPending || isUploading}
                      onClick={() => {
                        addImageByUrl(imageUrlInput);
                        setImageUrlInput("");
                      }}
                    >
                      Tambah
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="Masukkan URL video (YouTube, Vimeo, dll)"
                    disabled={mutation.isPending || isUploading}
                    className="h-9 text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-9 px-4 text-xs cursor-pointer border-gray-300 hover:bg-[#E8F9FF] hover:border-[#C5BAFF] hover:text-[#001B55]"
                    disabled={mutation.isPending || isUploading}
                    onClick={() => {
                      addVideoByUrl(videoUrlInput);
                      setVideoUrlInput("");
                    }}
                  >
                    Tambah
                  </Button>
                </div>
              )}

              {form.formState.errors.media && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.media.message as string}
                </p>
              )}

              {/* Media Previews */}
              {media?.length ? (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    Media yang ditambahkan ({media.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {media.map((m, idx) => (
                      <div
                        key={idx}
                        className="relative group border border-gray-300 rounded-lg overflow-hidden hover:border-[#C5BAFF] transition-colors"
                      >
                        <div className="relative">
                          {m.type === "image" ? (
                            <div className="relative aspect-square bg-gray-200">
                              <Image
                                src={m.url}
                                alt={`image-${idx}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-square bg-gradient-to-br from-[#001B55] to-[#001B55]/80 flex flex-col items-center justify-center text-white">
                              <svg
                                className="w-8 h-8 mb-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                              </svg>
                              <span className="text-[10px] font-medium">
                                Video
                              </span>
                            </div>
                          )}
                          {/* Action buttons */}
                          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => openEditMedia(idx)}
                              className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-md text-xs font-medium cursor-pointer shadow-lg"
                              disabled={mutation.isPending || isUploading}
                              title="Edit caption & order"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeMedia(idx)}
                              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-md text-xs font-medium cursor-pointer shadow-lg"
                              disabled={mutation.isPending || isUploading}
                              title="Hapus media"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {/* Caption & Order Info Display */}
                        <div className="p-2 border-t border-gray-200 bg-white">
                          <p
                            className="text-[10px] text-gray-600 font-medium truncate"
                            title={m.caption || "Tanpa caption"}
                          >
                            {m.caption || "Tanpa caption"}
                          </p>
                          <p className="text-[9px] text-gray-400 mt-0.5">
                            Order: {m.order ?? idx}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-9 px-5 text-sm cursor-pointer border-gray-300 hover:bg-gray-100"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="h-9 px-5 text-sm cursor-pointer bg-[#001B55] hover:bg-[#001B55]/90 text-white"
              >
                {mutation.isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                ) : isEdit ? (
                  "Simpan Perubahan"
                ) : (
                  "Simpan Aktivitas"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>

      {/* Dialog Konfirmasi Media - Input Caption & Order Individual */}
      <Dialog
        open={showMediaConfirmDialog}
        onOpenChange={setShowMediaConfirmDialog}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#001B55]">
              Tambah Caption & Order Media ({pendingMedia.length} media)
            </DialogTitle>
            <p className="text-xs text-gray-600 mt-1">
              Isi caption dan urutan untuk setiap media sebelum menambahkan
            </p>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* List media dengan input individual */}
            <div className="space-y-3">
              {pendingMedia.map((pm, idx) => (
                <div
                  key={idx}
                  className="border border-gray-300 rounded-lg p-3 bg-gray-50 hover:border-[#C5BAFF] transition-colors"
                >
                  <div className="flex gap-3">
                    {/* Preview media */}
                    <div className="flex-shrink-0 w-20 h-20">
                      <div className="relative w-full h-full border border-gray-300 rounded-lg overflow-hidden">
                        {pm.type === "image" ? (
                          <Image
                            src={pm.url}
                            alt={`preview-${idx}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#001B55] to-[#001B55]/80 flex items-center justify-center text-white">
                            <svg
                              className="w-8 h-8"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Input caption & order */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#001B55] text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1 space-y-2">
                          {/* Caption Input */}
                          <div>
                            <label className="text-xs font-medium text-gray-700 block mb-1">
                              Caption <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                              value={pm.caption}
                              onChange={(e) =>
                                updatePendingMedia(
                                  idx,
                                  "caption",
                                  e.target.value
                                )
                              }
                              placeholder={`Caption untuk media #${idx + 1}...`}
                              rows={2}
                              className="text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF] resize-none"
                            />
                          </div>

                          {/* Order Input */}
                          <div className="w-32">
                            <label className="text-xs font-medium text-gray-700 block mb-1">
                              Order <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="number"
                              min={0}
                              value={pm.order}
                              onChange={(e) =>
                                updatePendingMedia(
                                  idx,
                                  "order",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="h-8 text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Helper text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Tips:</strong> Caption wajib diisi untuk setiap media.
                Order menentukan urutan tampilan (0 = pertama, 1 = kedua, dst).
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={cancelAddMedia}
              className="h-9 px-5 text-sm cursor-pointer border-gray-300 hover:bg-gray-100"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={confirmAddMedia}
              disabled={pendingMedia.some((pm) => !pm.caption.trim())}
              className="h-9 px-5 text-sm cursor-pointer bg-[#001B55] hover:bg-[#001B55]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tambahkan {pendingMedia.length} Media
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Media Existing */}
      <Dialog open={showEditMediaDialog} onOpenChange={setShowEditMediaDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#001B55]">
              Edit Caption & Order Media
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Preview media yang akan diedit */}
            {editingMediaIndex !== null && media[editingMediaIndex] && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">
                  Media yang akan diedit
                </p>
                <div className="w-full max-w-xs mx-auto">
                  <div className="relative aspect-square border border-gray-300 rounded-lg overflow-hidden">
                    {media[editingMediaIndex].type === "image" ? (
                      <Image
                        src={media[editingMediaIndex].url}
                        alt="edit-preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#001B55] to-[#001B55]/80 flex flex-col items-center justify-center text-white">
                        <svg
                          className="w-12 h-12"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                        <span className="text-sm font-medium mt-2">Video</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Caption Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">
                Caption <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Masukkan caption untuk media ini..."
                rows={3}
                className="text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF] resize-none"
              />
              <p className="text-xs text-gray-500">
                Caption wajib diisi untuk setiap media
              </p>
            </div>

            {/* Order Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">
                Urutan (Order) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min={0}
                value={editOrder}
                onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="h-9 text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
              />
              <p className="text-xs text-gray-500">
                Urutan media saat ditampilkan (0 = pertama)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={cancelEditMedia}
              className="h-9 px-5 text-sm cursor-pointer border-gray-300 hover:bg-gray-100"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={confirmEditMedia}
              disabled={!editCaption.trim()}
              className="h-9 px-5 text-sm cursor-pointer bg-[#001B55] hover:bg-[#001B55]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simpan Perubahan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
