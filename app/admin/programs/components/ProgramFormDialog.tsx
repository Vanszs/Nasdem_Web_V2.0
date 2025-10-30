"use client";
import { useEffect, useMemo, useState } from "react";
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
import { Plus, Search, Loader2 } from "lucide-react";
import { categories, programNameOptions } from "../data";
import type { CreateProgramInput, Program, UpdateProgramInput } from "../types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ProgramFormDialogProps {
  editingProgram: Program | null;
  triggerClassName?: string;
  onSuccess?: () => void; // invalidate parent list
  onClose?: () => void; // clear editing from parent
}

const schema = z.object({
  category: z.string().min(1, "Pilih kategori"),
  name: z.string().min(1, "Pilih nama program"),
  description: z.string().min(10, "Minimal 10 karakter"),
  target: z.coerce.number().int().min(1, "Minimal 1"),
  currentTarget: z.coerce
    .number()
    .int()
    .min(0, "Tidak boleh negatif")
    .optional()
    .default(0),
  budget: z.coerce.number().min(0, "Tidak boleh negatif"),
  status: z.enum(["pending", "completed", "ongoing", "planning"]),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  coordinatorId: z.coerce.number().int().min(1, "Pilih koordinator"),
});

type FormValues = z.infer<typeof schema>;

type MemberOption = { id: number; fullName: string };

export function ProgramFormDialog({
  editingProgram,
  triggerClassName,
  onSuccess,
  onClose,
}: ProgramFormDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Helper: format to yyyy-MM-dd for <input type="date">
  const toDateInputValue = (value?: string | null): string | undefined => {
    if (!value) return undefined;
    // If already yyyy-MM-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    // If ISO string with time
    const d = new Date(value);
    if (isNaN(d.getTime())) return undefined;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Prefill when editing
  const defaultValues: Partial<FormValues> = useMemo(() => {
    if (!editingProgram) return {};
    return {
      category: editingProgram.category,
      name: editingProgram.name,
      description: editingProgram.description ?? "",
      target: editingProgram.target,
      currentTarget: editingProgram.currentTarget,
      budget: Number(editingProgram.budget),
      status: editingProgram.status,
      startDate: editingProgram.startDate ?? undefined,
      endDate: editingProgram.endDate ?? undefined,
      coordinatorId: editingProgram.coordinatorId,
    };
  }, [editingProgram]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "",
      name: "",
      description: "",
      target: 0,
      currentTarget: 0,
      budget: 0,
      status: "ongoing",
      startDate: undefined,
      endDate: undefined,
      coordinatorId: 0,
      ...defaultValues,
    },
  });

  // open dialog when editing is set
  useEffect(() => {
    if (editingProgram) {
      setOpen(true);
    }
  }, [editingProgram]);

  // Reset form values when editingProgram changes
  useEffect(() => {
    if (editingProgram) {
      form.reset({
        category: editingProgram.category,
        name: editingProgram.name,
        description: editingProgram.description ?? "",
        target: editingProgram.target,
        currentTarget: editingProgram.currentTarget,
        budget: Number(editingProgram.budget),
        status: editingProgram.status as any,
        startDate: toDateInputValue(editingProgram.startDate ?? undefined),
        endDate: toDateInputValue(editingProgram.endDate ?? undefined),
        coordinatorId: editingProgram.coordinatorId,
      });
    } else {
      form.reset({
        category: "",
        name: "",
        description: "",
        target: 0,
        currentTarget: 0,
        budget: 0,
        status: "ongoing",
        startDate: undefined,
        endDate: undefined,
        coordinatorId: 0,
      });
    }
  }, [editingProgram, form]);

  const filteredProgramNames = programNameOptions.filter(
    (p) => p.categoryId === form.watch("category")
  );

  const [search, setSearch] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { data: members = [], isFetching } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await fetch(`/api/members`);
      if (!res.ok) throw new Error("Failed to fetch members");
      return res.json();
    },
    enabled: open,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: 1,
    select: (res: any) => (res?.data ?? []) as MemberOption[],
  });

  // Reset search when dialog opens to load default list
  useEffect(() => {
    if (open) setSearch("");
  }, [open]);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateProgramInput) => {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal membuat program");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Program berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      onSuccess?.();
      handleClose();
    },
    onError: (e: any) => toast.error(e?.message || "Gagal menyimpan"),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateProgramInput) => {
      const res = await fetch(`/api/programs/${payload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal memperbarui program");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Program berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      onSuccess?.();
      handleClose();
    },
    onError: (e: any) => toast.error(e?.message || "Gagal menyimpan"),
  });

  function handleClose() {
    setOpen(false);
    form.reset();
    onClose?.();
  }

  function onSubmit(values: FormValues) {
    if (editingProgram) {
      const payload: UpdateProgramInput = {
        id: editingProgram.id,
        category: values.category,
        name: values.name,
        description: values.description,
        target: values.target,
        currentTarget: values.currentTarget ?? 0,
        budget: values.budget,
        status: values.status as any,
        startDate: values.startDate ?? null,
        endDate: values.endDate ?? null,
        photoUrl: undefined,
        coordinatorId: values.coordinatorId,
      };
      updateMutation.mutate(payload);
    } else {
      const payload: CreateProgramInput = {
        category: values.category,
        name: values.name,
        description: values.description,
        target: values.target,
        currentTarget: values.currentTarget ?? 0,
        budget: values.budget,
        status: values.status as any,
        startDate: values.startDate ?? null,
        endDate: values.endDate ?? null,
        photoUrl: undefined,
        coordinatorId: values.coordinatorId,
      };
      createMutation.mutate(payload);
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => (o ? setOpen(true) : handleClose())}
    >
      <DialogTrigger asChild>
        <Button
          className={
            triggerClassName ||
            "h-14 px-8 cursor-pointer rounded-full bg-[#C5BAFF] hover:bg-[#b7a8ff] text-[#001B55] font-bold shadow transition-all duration-300"
          }
          onClick={() => setOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Program
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#001B55]">
            {editingProgram ? "Edit Program" : "Tambah Program Baru"}
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Kategori *
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("name", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border border-[#C4D9FF] w-full">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Nama Program *
                    </FormLabel>
                    {form.watch("category") === "lainnya" ? (
                      <FormControl>
                        <Input
                          placeholder="Tulis nama program"
                          className="h-12 rounded-xl border border-[#C4D9FF] w-full"
                          {...field}
                        />
                      </FormControl>
                    ) : (
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        disabled={!form.watch("category")}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border border-[#C4D9FF] w-full">
                            <SelectValue
                              placeholder={
                                form.watch("category")
                                  ? "Pilih program"
                                  : "Pilih kategori dahulu"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredProgramNames.length === 0 ? (
                            <SelectItem value="__none__" disabled>
                              Tidak ada program
                            </SelectItem>
                          ) : (
                            filteredProgramNames.map((p) => (
                              <SelectItem key={p.id} value={p.title}>
                                {p.title}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-[#001B55]">
                    Deskripsi *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      className="rounded-xl border border-[#C4D9FF] focus:border-[#C5BAFF]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Target
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
                name="currentTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Capaian Saat Ini
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Tanggal Mulai
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
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Tanggal Selesai
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Anggaran (Rp)
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[#001B55]">
                      Status
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-12 w-full rounded-xl border border-[#C4D9FF]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ongoing">Berlangsung</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                        <SelectItem value="pending">Tertunda</SelectItem>
                        <SelectItem value="planning">Perencanaan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Searchable Coordinator combobox */}
            <FormField
              control={form.control}
              name="coordinatorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-[#001B55]">
                    Koordinator
                  </FormLabel>
                  <div className="relative w-full">
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between h-12 rounded-xl cursor-pointer hover:bg-[#F0F6FF] transition-colors"
                        >
                          {field.value
                            ? members.find(
                                (m: MemberOption) => m.id === field.value
                              )?.fullName ?? "Pilih Koordinator"
                            : "Pilih Koordinator"}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        side="bottom"
                        className="p-0 w-full"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Cari nama..."
                            value={search}
                            onValueChange={setSearch}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {isFetching ? "Memuat..." : "Tidak ditemukan"}
                            </CommandEmpty>
                            <CommandGroup>
                              {members.map((m) => (
                                <CommandItem
                                  key={m.id}
                                  // Use fullName as value to leverage internal filtering
                                  value={m.fullName}
                                  onSelect={() => {
                                    form.setValue("coordinatorId", m.id, {
                                      shouldValidate: true,
                                    });
                                    setPopoverOpen(false);
                                    setSearch("");
                                  }}
                                >
                                  {m.fullName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-12 px-6 rounded-full font-bold cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 cursor-pointer rounded-full bg-[#001B55] hover:bg-[#002060]/90 font-bold text-white"
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : editingProgram
                  ? "Simpan Perubahan"
                  : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
