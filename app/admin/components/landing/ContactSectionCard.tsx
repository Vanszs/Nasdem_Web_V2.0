"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Phone } from "lucide-react";

const schema = z.object({
  address: z.string().min(5),
  phone: z.string().min(5),
  email: z.string().email(),
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  officeHours: z.string().min(3),
});
type ContactForm = z.infer<typeof schema>;

export function ContactSectionCard() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["cms", "contact"],
    queryFn: async () => {
      const res = await fetch("/api/cms/contact");
      if (!res.ok) throw new Error("Gagal memuat contact");
      return res.json();
    },
  });
  const c = data?.data;

  const form = useForm<ContactForm>({
    resolver: zodResolver(schema),
    values: {
      address: c?.address || "",
      phone: c?.phone || "",
      email: c?.email || "",
      facebook: c?.facebookUrl || "",
      instagram: c?.instagramUrl || "",
      twitter: c?.twitterUrl || "",
      youtube: c?.youtubeUrl || "",
      officeHours: c?.operationalHours || "",
    },
  });

  const mut = useMutation({
    mutationFn: async (payload: ContactForm) => {
      const res = await fetch("/api/cms/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: payload.address,
          phone: payload.phone,
          email: payload.email,
          operationalHours: payload.officeHours,
          facebookUrl: payload.facebook || undefined,
          instagramUrl: payload.instagram || undefined,
          twitterUrl: payload.twitter || undefined,
          youtubeUrl: payload.youtube || undefined,
        }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "contact"] });
      toast.success("Kontak diupdate");
    },
    onError: () => toast.error("Gagal menyimpan kontak"),
  });

  return (
    <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-[#001B55]/5 via-[#FFFFFF] to-[#FF9C04]/5 border-b border-gray-100 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-3 text-[#001B55]">
            <div className="p-2 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-2xl shadow-md">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Informasi Kontak</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => mut.mutate(v))}
              className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            >
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telepon</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officeHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Operasional</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://facebook.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://instagram.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-full flex justify-end">
                <Button type="submit" disabled={mut.isPending}>
                  Simpan
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
