"use client";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import type {
  Beneficiary,
  CreateBeneficiaryInput,
  UpdateBeneficiaryInput,
} from "../types";
import { Loader2, Plus } from "lucide-react";

function toDateInputValue(d?: string | null): string {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const schema = z.object({
  programId: z.coerce.number().int().min(1, "Pilih program"),
  fullName: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email().optional().or(z.literal("")),
  nik: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female"]).optional().or(z.literal("")),
  occupation: z.string().optional().or(z.literal("")),
  familyMemberCount: z.coerce.number().int().min(0).optional(),
  proposerName: z.string().optional().or(z.literal("")),
  fullAddress: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  status: z.enum(["pending", "completed"]).default("pending"),
});

type FormValues = z.infer<typeof schema>;

export function BeneficiaryFormDialog({
  editing,
  onClose,
}: {
  editing: Beneficiary | null;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: programsRes, isLoading: loadingPrograms } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const res = await fetch("/api/programs", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal memuat program");
      return res.json();
    },
  });
  const programs: { id: number; name: string }[] = useMemo(
    () =>
      programsRes?.data?.map((p: any) => ({ id: p.id, name: p.name })) ?? [],
    [programsRes]
  );

  const defaults: Partial<FormValues> = useMemo(() => {
    if (!editing) return {};
    return {
      programId: editing.programId,
      fullName: editing.fullName,
      email: editing.email ?? "",
      nik: editing.nik ?? "",
      phone: editing.phone ?? "",
      dateOfBirth: toDateInputValue(editing.dateOfBirth),
      gender: (editing.gender as any) ?? "",
      occupation: editing.occupation ?? "",
      familyMemberCount: editing.familyMemberCount ?? undefined,
      proposerName: editing.proposerName ?? "",
      fullAddress: editing.fullAddress ?? "",
      notes: editing.notes ?? "",
      status: editing.status,
    };
  }, [editing]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      programId: 0,
      fullName: "",
      email: "",
      nik: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      occupation: "",
      familyMemberCount: 0,
      proposerName: "",
      fullAddress: "",
      notes: "",
      status: "pending",
      ...defaults,
    },
  });

  useEffect(() => {
    if (editing) setOpen(true);
  }, [editing]);

  useEffect(() => {
    if (editing) {
      form.reset({
        programId: editing.programId,
        fullName: editing.fullName,
        email: editing.email ?? "",
        nik: editing.nik ?? "",
        phone: editing.phone ?? "",
        dateOfBirth: toDateInputValue(editing.dateOfBirth),
        gender: (editing.gender as any) ?? "",
        occupation: editing.occupation ?? "",
        familyMemberCount: editing.familyMemberCount ?? 0,
        proposerName: editing.proposerName ?? "",
        fullAddress: editing.fullAddress ?? "",
        notes: editing.notes ?? "",
        status: editing.status,
      });
    } else {
      form.reset({
        programId: 0,
        fullName: "",
        email: "",
        nik: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        occupation: "",
        familyMemberCount: 0,
        proposerName: "",
        fullAddress: "",
        notes: "",
        status: "pending",
      });
    }
  }, [editing, form]);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateBeneficiaryInput) => {
      const res = await fetch("/api/beneficiaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal menambahkan penerima manfaat");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Penerima manfaat berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      handleClose();
    },
    onError: (e: any) => toast.error(e?.message || "Gagal menyimpan"),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateBeneficiaryInput) => {
      const res = await fetch(`/api/beneficiaries/${payload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal memperbarui penerima manfaat");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Penerima manfaat berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      handleClose();
    },
    onError: (e: any) => toast.error(e?.message || "Gagal menyimpan"),
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  function handleClose() {
    setOpen(false);
    form.reset();
    onClose?.();
  }

  function onSubmit(values: FormValues) {
    const payloadBase = {
      programId: values.programId,
      fullName: values.fullName,
      email: values.email || null,
      nik: values.nik || null,
      phone: values.phone || null,
      dateOfBirth: values.dateOfBirth || null,
      gender: (values.gender as any) || null,
      occupation: values.occupation || null,
      familyMemberCount: values.familyMemberCount ?? null,
      proposerName: values.proposerName || null,
      fullAddress: values.fullAddress || null,
      notes: values.notes || null,
      status: values.status,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...payloadBase });
    } else {
      createMutation.mutate(payloadBase);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => (o ? setOpen(true) : handleClose())}
    >
      <DialogTrigger asChild>
        <Button className="h-12 px-6 rounded-full bg-gradient-to-r from-[#C5BAFF] to-[#C4D9FF] hover:from-[#001B55] hover:to-[#001B55] hover:text-white text-[#001B55] font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" /> Tambah Penerima Manfaat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-white to-[#F0F6FF] border-2 border-[#C4D9FF]">
        <DialogHeader className="pb-4 border-b border-[#E8F9FF]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#C5BAFF] to-[#C4D9FF] shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-[#001B55]">
                {editing ? "Edit Penerima Manfaat" : "Tambah Penerima Manfaat"}
              </DialogTitle>
              <p className="text-sm text-[#475569] mt-1">
                {editing
                  ? "Perbarui informasi penerima manfaat program"
                  : "Tambahkan penerima manfaat baru ke dalam program"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto py-6 px-2 space-y-6"
          >
            {/* Section 1: Program & Identitas Dasar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8F9FF]">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[#001B55]/10 flex items-center justify-center">
                  <span className="text-[#001B55] font-bold text-sm">1</span>
                </div>
                <h3 className="text-lg font-bold text-[#001B55]">
                  Program & Identitas Dasar
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="programId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55] flex items-center gap-1">
                        Program <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300 w-full">
                            <SelectValue
                              placeholder={
                                loadingPrograms
                                  ? "Memuat program..."
                                  : "Pilih program"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {loadingPrograms ? (
                            <div className="p-3 text-sm text-slate-600 flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Memuat...
                            </div>
                          ) : (
                            programs.map((p) => (
                              <SelectItem
                                key={p.id}
                                value={String(p.id)}
                                className="hover:bg-[#F0F6FF] transition-colors"
                              >
                                {p.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55] flex items-center gap-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300"
                          placeholder="Masukkan nama lengkap"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 2: Kontak & Identitas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8F9FF]">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[#FF9C04]/10 flex items-center justify-center">
                  <span className="text-[#FF9C04] font-bold text-sm">2</span>
                </div>
                <h3 className="text-lg font-bold text-[#001B55]">
                  Kontak & Identitas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="nik"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55]">
                        NIK
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300"
                          placeholder="16 digit NIK"
                          maxLength={16}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55]">
                        Telepon
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300"
                          placeholder="08xxxxxxxxxx"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55]">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="h-12 rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300"
                          placeholder="email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 3: Data Pribadi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8F9FF]">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[#34D399]/10 flex items-center justify-center">
                  <span className="text-[#34D399] font-bold text-sm">3</span>
                </div>
                <h3 className="text-lg font-bold text-[#001B55]">
                  Data Pribadi
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55]">
                        Tanggal Lahir
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="h-12 rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55]">
                        Jenis Kelamin
                      </FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(v) => field.onChange(v)}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300 w-full">
                            <SelectValue placeholder="Pilih gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem
                            value="male"
                            className="hover:bg-[#F0F6FF]"
                          >
                            Laki-laki
                          </SelectItem>
                          <SelectItem
                            value="female"
                            className="hover:bg-[#F0F6FF]"
                          >
                            Perempuan
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55]">
                        Pekerjaan
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300"
                          placeholder="Contoh: Petani, Guru, dll"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 4: Informasi Tambahan */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8F9FF]">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[#60A5FA]/10 flex items-center justify-center">
                  <span className="text-[#60A5FA] font-bold text-sm">4</span>
                </div>
                <h3 className="text-lg font-bold text-[#001B55]">
                  Informasi Tambahan
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="familyMemberCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55]">
                        Jumlah Keluarga
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          className="h-12 rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proposerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55]">
                        Nama Pengusul
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300"
                          placeholder="Nama yang mengusulkan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55]">
                        Status
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300 w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem
                            value="pending"
                            className="hover:bg-[#F0F6FF]"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500" />
                              Menunggu
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="completed"
                            className="hover:bg-[#F0F6FF]"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                              Selesai
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55]">
                        Alamat Lengkap
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300 resize-none"
                          placeholder="Masukkan alamat lengkap dengan RT/RW, kelurahan, kecamatan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-[#001B55]">
                        Catatan
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="rounded-xl border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-all duration-300 resize-none"
                          placeholder="Tambahkan catatan atau informasi tambahan (opsional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pb-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="h-12 px-6 rounded-full border-2 border-[#C4D9FF] hover:bg-[#F0F6FF] transition-all duration-300"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 rounded-full bg-gradient-to-r from-[#001B55] to-[#002060] hover:from-[#002060] hover:to-[#003080] text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : editing ? (
                  <>
                    <span className="mr-2">💾</span> Simpan Perubahan
                  </>
                ) : (
                  <>
                    <span className="mr-2">✓</span> Simpan
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
