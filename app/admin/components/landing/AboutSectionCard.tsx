"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Users } from "lucide-react";

const schema = z.object({
  vision: z.string().min(10, { message: "Minimal 10 karakter" }),
  mission: z.string().min(10, { message: "Minimal 10 karakter" }),
  videoUrl: z
    .string()
    .url({ message: "Masukkan URL video yang valid" })
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
});
type AboutForm = z.infer<typeof schema>;

export function AboutSectionCard() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["cms", "about"],
    queryFn: async () => {
      const res = await fetch("/api/cms/about");
      if (!res.ok) throw new Error("Gagal memuat about");
      return res.json();
    },
  });
  const about = data?.data;

  const form = useForm<AboutForm>({
    resolver: zodResolver(schema),
    values: {
      vision: about?.vision || "",
      mission: about?.mission || "",
      videoUrl: about?.videoUrl || "",
    },
  });

  const mut = useMutation({
    mutationFn: async (payload: AboutForm) => {
      const res = await fetch("/api/cms/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vision: payload.vision,
          mission: payload.mission,
          videoUrl: payload.videoUrl,
        }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "about"] });
      toast.success("Tentang kami diupdate");
    },
    onError: () => toast.error("Gagal menyimpan tentang kami"),
  });

  return (
    <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-[#001B55]/5 via-[#FFFFFF] to-[#FF9C04]/5 border-b border-gray-100 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-3 text-[#001B55]">
            <div className="p-2 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-2xl shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Tentang Kami</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-100 rounded animate-pulse" />
            <div className="space-y-4">
              <div className="h-10 bg-gray-100 rounded animate-pulse" />
              <div className="h-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-10 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                {form.watch("videoUrl") ? (
                  <iframe
                    src={form.watch("videoUrl")}
                    className="w-full h-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="Video Tentang Kami"
                  />
                ) : (
                  <div className="text-sm text-slate-500">
                    Masukkan URL video untuk preview
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((v) => mut.mutate(v))}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Video</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.youtube.com/embed/... (opsional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visi</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Tulis visi..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Misi</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Tulis misi..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={mut.isPending}>
                      Simpan
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
