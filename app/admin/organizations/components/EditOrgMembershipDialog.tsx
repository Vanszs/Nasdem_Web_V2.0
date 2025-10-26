"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronsUpDown, Check, Cog } from "lucide-react";
import { cn } from "@/lib/utils";
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

const formSchema = z
  .object({
    level: z.string().min(1, "Level wajib dipilih"),
    position: z.string().min(1, "Posisi wajib dipilih"),
    sayapName: z.string().optional(),
    regionId: z.string().optional(),
  })
  .refine((d) => (d.level.toLowerCase() === "sayap" ? !!d.sayapName : true), {
    path: ["sayapName"],
    message: "Unit sayap wajib dipilih",
  })
  .refine(
    (d) =>
      ["dpc", "dprt", "kader"].includes(d.level.toLowerCase())
        ? !!d.regionId
        : true,
    { path: ["regionId"], message: "Wilayah wajib dipilih" }
  );

type Region = { id: number; name: string; type: string };
type Struktur = {
  id: number;
  level: string;
  position: string;
  region?: Region | null;
  sayapType?: { name: string } | null;
};

export function EditOrgMembershipDialog({
  open,
  onOpenChange,
  member,
  onSaved,
}: {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  member: any | null;
  onSaved?: () => void;
}) {
  const queryClient = useQueryClient();
  const [regionSearch, setRegionSearch] = React.useState("");
  const [openRegion, setOpenRegion] = React.useState(false);

  const regionsQuery = useQuery<any>({
    queryKey: ["regions"],
    queryFn: async () => {
      const res = await fetch("/api/regions");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memuat wilayah");
      return json;
    },
    enabled: !!open,
    staleTime: 60_000,
  });
  const strukturQuery = useQuery<any>({
    queryKey: ["struktur"],
    queryFn: async () => {
      const res = await fetch(`/api/organizations`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memuat struktur");
      return json;
    },
    enabled: !!open,
    staleTime: 60_000,
  });

  const regions: Region[] =
    ((regionsQuery.data as any)?.data as Region[]) || [];
  const struktur: Struktur[] =
    ((strukturQuery.data as any)?.data as Struktur[]) || [];

  const positionEnums = [
    "ketua",
    "sekretaris",
    "bendahara",
    "wakil",
    "anggota",
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: "",
      position: "",
      sayapName: "",
      regionId: "",
    },
    mode: "onChange",
  });

  const watchLevel = form.watch("level");

  // Prefill when member changes
  React.useEffect(() => {
    if (!member) return;
    const so = member?.struktur;
    const level = (so?.level || member.department || "").toString();
    const position = (so?.position || member.position || "").toString();
    const regionId = so?.region?.id ? String(so.region.id) : "";
    form.reset({
      level,
      position,
      sayapName: so?.sayapType?.name || "",
      regionId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member]);

  const regionTypeForLevel = React.useMemo(() => {
    const lvl = watchLevel?.toLowerCase();
    if (lvl === "dpc") return "kecamatan";
    if (lvl === "dprt" || lvl === "kader") return "desa";
    return undefined;
  }, [watchLevel]);

  const filteredRegions = React.useMemo(() => {
    if (!regionTypeForLevel) return [] as Region[];
    const filtered = regions.filter(
      (r) => r.type?.toLowerCase() === regionTypeForLevel
    );
    if (!regionSearch) return filtered;
    return filtered.filter((r) =>
      r.name.toLowerCase().includes(regionSearch.toLowerCase())
    );
  }, [regions, regionTypeForLevel, regionSearch]);

  const sayapNames = React.useMemo(() => {
    const names = struktur
      .filter((s) => s.level?.toLowerCase() === "sayap" && s.sayapType?.name)
      .map((s) => s.sayapType!.name as string);
    return Array.from(new Set(names));
  }, [struktur]);

  const mutation = useMutation({
    mutationFn: async (payload: {
      strukturId: number | string;
      memberId: number;
    }) => {
      const res = await fetch("/api/organizations/add-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strukturId: payload.strukturId,
          memberIds: [payload.memberId],
        }),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.error || "Gagal menyimpan perubahan");
      return j;
    },
    onSuccess: () => {
      toast.success("Perubahan disimpan");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      onSaved?.();
    },
    onError: (e: any) => toast.error(e?.message || "Gagal menyimpan"),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      let strukturId: string | number | undefined = undefined;
      const lvl = data.level.toLowerCase();
      if (lvl === "sayap") {
        const match = struktur.find(
          (s) =>
            s.level?.toLowerCase() === "sayap" &&
            s.sayapType?.name === data.sayapName
        );
        if (!match) throw new Error("Struktur sayap tidak ditemukan");
        strukturId = match.id;
      } else {
        const byLevelPos = struktur.filter(
          (s) =>
            s.level?.toLowerCase() === lvl &&
            s.position?.toLowerCase() === data.position.toLowerCase()
        );
        const target = data.regionId
          ? byLevelPos.find(
              (s) => String(s.region?.id || "") === String(data.regionId)
            )
          : byLevelPos[0];
        if (!target)
          throw new Error(
            "Unit struktur tidak ditemukan untuk kombinasi tersebut"
          );
        strukturId = target.id;
      }
      await mutation.mutateAsync({
        strukturId: strukturId!,
        memberId: Number(member.id),
      });
    } catch (e: any) {
      // handled by mutation onError or explicit throw
      if (e?.message) toast.error(e.message);
    }
  };

  const isLoadingOptions = regionsQuery.isLoading || strukturQuery.isLoading;

  return (
    <Dialog open={!!open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md relative p-0 overflow-hidden">
        {(mutation.isPending || isLoadingOptions) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 text-[#001B55]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#001B55]/40 border-t-[#001B55]" />
              <span className="text-sm">
                {mutation.isPending ? "Menyimpan..." : "Memuat..."}
              </span>
            </div>
          </div>
        )}
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-[#E8F9FF] bg-gradient-to-r from-white to-[#F8FBFF]">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center bg-[#E8F9FF]"
              style={{ borderRadius: 10 }}
            >
              <Cog className="h-5 w-5 text-[#001B55]" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-bold text-[#001B55]">
                Edit Keanggotaan
              </DialogTitle>
              <p className="text-xs text-[#475569] mt-0.5">
                Ubah level, posisi, dan wilayah
              </p>
            </div>
          </div>
        </DialogHeader>
        <div className="px-5 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001B55] font-semibold">
                        Level
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(v) => {
                            field.onChange(v);
                            form.setValue("position", "");
                            form.setValue("regionId", "");
                            form.setValue("sayapName", "");
                          }}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Pilih level" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              new Set(struktur.map((s) => s.level))
                            ).map((l) => (
                              <SelectItem key={l} value={l}>
                                {String(l).toUpperCase()}
                              </SelectItem>
                            ))}
                            {!struktur.some(
                              (s) => s.level?.toLowerCase() === "dprt"
                            ) && <SelectItem value="dprt">DPRT</SelectItem>}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001B55] font-semibold">
                        Posisi
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!watchLevel}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Pilih posisi" />
                          </SelectTrigger>
                          <SelectContent>
                            {positionEnums.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {regionTypeForLevel && (
                <FormField
                  control={form.control}
                  name="regionId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-[#001B55] font-semibold">
                        Wilayah
                      </FormLabel>
                      <Popover open={openRegion} onOpenChange={setOpenRegion}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openRegion}
                              className={cn(
                                "w-full justify-between h-10",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? filteredRegions.find(
                                    (r) => String(r.id) === field.value
                                  )?.name
                                : "Pilih wilayah"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Cari wilayah..."
                              value={regionSearch}
                              onValueChange={setRegionSearch}
                            />
                            <CommandList>
                              <CommandEmpty className="py-4 text-center text-sm">
                                Tidak ada wilayah
                              </CommandEmpty>
                              <CommandGroup>
                                {filteredRegions.map((r) => (
                                  <CommandItem
                                    key={r.id}
                                    value={r.name}
                                    onSelect={() => {
                                      field.onChange(String(r.id));
                                      setOpenRegion(false);
                                      setRegionSearch("");
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        String(r.id) === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {r.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              )}

              {watchLevel?.toLowerCase() === "sayap" && (
                <FormField
                  control={form.control}
                  name="sayapName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001B55] font-semibold">
                        Unit Sayap
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Pilih unit sayap" />
                          </SelectTrigger>
                          <SelectContent>
                            {sayapNames.map((n) => (
                              <SelectItem key={n} value={n}>
                                {n}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange?.(false)}
                  disabled={mutation.isPending}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-[#001B55] text-white"
                >
                  {mutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
