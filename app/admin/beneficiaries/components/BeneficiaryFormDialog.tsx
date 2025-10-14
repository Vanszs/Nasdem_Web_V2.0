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
      const res = await fetch("/api/programs");
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
      dateOfBirth: editing.dateOfBirth ?? "",
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
        dateOfBirth: editing.dateOfBirth ?? "",
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
        <Button className="h-12 px-6 rounded-full bg-[#C5BAFF] hover:bg-[#C4D9FF] text-[#001B55] font-semibold shadow">
          <Plus className="w-4 h-4 mr-2" /> Tambah Penerima Manfaat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#001B55]">
            {editing ? "Edit Penerima Manfaat" : "Tambah Penerima Manfaat"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4 overflow-y-auto p-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="programId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Program *
                    </FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border border-[#C4D9FF] w-full">
                          <SelectValue
                            placeholder={
                              loadingPrograms
                                ? "Memuat program..."
                                : "Pilih program"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingPrograms ? (
                          <div className="p-3 text-sm text-slate-600">
                            Memuat...
                          </div>
                        ) : (
                          programs.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Nama Lengkap *
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 rounded-xl border border-[#C4D9FF]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      NIK
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 rounded-xl border border-[#C4D9FF]"
                        {...field}
                      />
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
                    <FormLabel className="font-bold text-[#001B55]">
                      Telepon
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 rounded-xl border border-[#C4D9FF]"
                        {...field}
                      />
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
                    <FormLabel className="font-bold text-[#001B55]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="h-12 rounded-xl border border-[#C4D9FF]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Tanggal Lahir
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-12 rounded-xl border border-[#C4D9FF]"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Jenis Kelamin
                    </FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border border-[#C4D9FF] w-full">
                          <SelectValue placeholder="Pilih gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Laki-laki</SelectItem>
                        <SelectItem value="female">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Pekerjaan
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 rounded-xl border border-[#C4D9FF]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="familyMemberCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Jumlah Keluarga
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="h-12 rounded-xl border border-[#C4D9FF]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proposerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Nama Pengusul
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 rounded-xl border border-[#C4D9FF]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Status
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border border-[#C4D9FF] w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Menunggu</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fullAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-[#001B55]">
                    Alamat Lengkap
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      className="rounded-xl border border-[#C4D9FF]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-[#001B55]">
                    Catatan
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      className="rounded-xl border border-[#C4D9FF]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-12 px-6 rounded-full"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 rounded-full bg-[#001B55] hover:bg-[#002060]/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Menyimpan...
                  </>
                ) : editing ? (
                  "Simpan Perubahan"
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
