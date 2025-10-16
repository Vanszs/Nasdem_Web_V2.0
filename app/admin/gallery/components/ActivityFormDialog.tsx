"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
  url: z.string().url({ message: "URL tidak valid" }),
  caption: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: (initialData?.category as any) || "sosial",
      eventDate: initialData?.eventDate || "",
      location: initialData?.location || "",
      media: (initialData?.media as any) || [],
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
        media: (initialData?.media as any) || [],
      });
    }
  }, [open, initialData, form]);

  const media = form.watch("media");

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
        const form = new FormData();
        form.append("file", file);
        form.append("scope", "gallery");
        const res = await fetch("/api/upload?scope=gallery", {
          method: "POST",
          body: form,
        });
        const json = await res.json();
        if (!res.ok || !json?.url)
          throw new Error(json?.error || "Upload gagal");
        results.push({ url: json.url });
      }
      if (results.length) {
        const current = form.watch("media") || [];
        const merged = [
          ...current,
          ...results.map((r, idx) => ({
            type: "image" as const,
            url: r.url,
            order: current.length + idx,
          })),
        ];
        form.setValue("media", merged, { shouldValidate: true });
        toast.success(`${results.length} gambar ditambahkan`);
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
    const current = form.watch("media") || [];
    form.setValue(
      "media",
      [...current, { type: "image", url, order: current.length }],
      { shouldValidate: true }
    );
  };

  const addVideoByUrl = (url: string) => {
    if (!url) return;
    try {
      new URL(url);
    } catch {
      toast.error("URL tidak valid");
      return;
    }
    const current = form.watch("media") || [];
    form.setValue(
      "media",
      [...current, { type: "video", url, order: current.length }],
      { shouldValidate: true }
    );
  };

  const removeMedia = (idx: number) => {
    const current = form.watch("media") || [];
    const next = current
      .filter((_, i) => i !== idx)
      .map((m, i) => ({ ...m, order: i }));
    form.setValue("media", next, { shouldValidate: true });
  };

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        title: values.title,
        description: values.description,
        category: values.category,
        eventDate: values.eventDate || undefined,
        location: values.location,
        media: values.media,
      };
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

  const onSubmit = (values: FormValues) => mutation.mutate(values);

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");

  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const fileInputRef = useState<HTMLInputElement | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b border-gray-200">
          <DialogTitle className="text-xl font-bold text-[#001B55]">
            {isEdit ? "Edit Aktivitas" : "Tambah Aktivitas Baru"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
                          <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]">
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
                        disabled={isUploading}
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
                      className="h-9 text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-9 px-4 text-xs cursor-pointer border-gray-300 hover:bg-[#E8F9FF] hover:border-[#C5BAFF] hover:text-[#001B55]"
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
                    className="h-9 text-sm border-gray-300 focus:border-[#C5BAFF] focus:ring-[#C5BAFF]"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-9 px-4 text-xs cursor-pointer border-gray-300 hover:bg-[#E8F9FF] hover:border-[#C5BAFF] hover:text-[#001B55]"
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
                        {m.type === "image" ? (
                          <div className="relative aspect-square bg-gray-200">
                            <Image
                              src={m.url}
                              alt={m.caption || `image-${idx}`}
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
                        <button
                          type="button"
                          onClick={() => removeMedia(idx)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-md text-xs font-medium cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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
    </Dialog>
  );
}
