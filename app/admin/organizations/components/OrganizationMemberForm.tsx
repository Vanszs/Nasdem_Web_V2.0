"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DpdPositionSelector } from "./DpdPositionSelector";
import { MemberList } from "./MemberList";
import {
  useRegions,
  useStruktur,
  useUnassignedMembers,
  type Region,
  type Struktur,
  type Member,
} from "../hooks/useOrganizationData";

// Form schema dengan Zod
const memberFormSchema = z
  .object({
    level: z.string().min(1, "Tipe organisasi harus dipilih"),
    position: z.string().min(1, "Posisi harus dipilih"),
    positionTitle: z.string().optional(), // For DPD specific titles
    sayapName: z.string().optional(),
    kecamatanId: z.string().optional(),
    regionId: z.string().optional(),
    strukturId: z.string().optional(),
    memberIds: z.array(z.number()).min(1, "Minimal satu anggota harus dipilih"),
  })
  .refine(
    (data) => (data.level.toLowerCase() === "sayap" ? !!data.sayapName : true),
    { message: "Unit sayap harus dipilih", path: ["sayapName"] }
  )
  .refine(
    (data) =>
      ["dpc", "dprt"].includes(data.level.toLowerCase())
        ? !!data.regionId
        : true,
    { message: "Wilayah harus dipilih", path: ["regionId"] }
  )
  .refine(
    (data) => (data.level.toLowerCase() === "dprt" ? !!data.kecamatanId : true),
    { message: "Kecamatan harus dipilih", path: ["kecamatanId"] }
  );

type FormData = z.infer<typeof memberFormSchema>;

interface OrganizationMemberFormProps {
  onSuccess: () => void;
  isDialogOpen: boolean;
}

/**
 * Form untuk menambahkan member ke struktur organisasi
 * Mendukung level: DPD, DPC, DPRT, Sayap
 */
export function OrganizationMemberForm({
  onSuccess,
  isDialogOpen,
}: OrganizationMemberFormProps) {
  const queryClient = useQueryClient();
  const [memberSearch, setMemberSearch] = React.useState("");

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      level: "",
      position: "",
      positionTitle: "",
      sayapName: "",
      kecamatanId: "",
      regionId: "",
      strukturId: "",
      memberIds: [],
    },
    mode: "onChange",
  });

  const watchLevel = form.watch("level");
  const watchPosition = form.watch("position");
  const watchKecamatanId = form.watch("kecamatanId");
  const watchRegionId = form.watch("regionId");
  const watchPositionTitle = form.watch("positionTitle");

  // Data fetching hooks
  const regionsQuery = useRegions(isDialogOpen);
  const strukturQuery = useStruktur(isDialogOpen);

  // Derived data
  const regions = ((regionsQuery.data as any)?.data as Region[]) || [];
  const struktur = ((strukturQuery.data as any)?.data as Struktur[]) || [];
  const schemaLevels: string[] =
    ((strukturQuery.data as any)?.meta?.levels as string[]) || [];
  const schemaPositions: string[] =
    ((strukturQuery.data as any)?.meta?.positions as string[]) || [];

  // Loading flags
  const strukturLoading = strukturQuery.isLoading && !strukturQuery.data;
  const regionsLoading = regionsQuery.isLoading && !regionsQuery.data;

  // Determine if members can be selected
  const canSelectMembers = React.useMemo(() => {
    return (
      !!watchLevel &&
      !!watchPosition &&
      (watchLevel.toLowerCase() === "dpd" ||
        (watchLevel.toLowerCase() === "sayap" &&
          !!form.getValues("sayapName")) ||
        (watchLevel.toLowerCase() === "dpc" && !!watchRegionId) ||
        (watchLevel.toLowerCase() === "dprt" &&
          !!watchKecamatanId &&
          !!watchRegionId))
    );
  }, [watchLevel, watchPosition, watchRegionId, watchKecamatanId, form]);

  const membersUnassignedQuery = useUnassignedMembers(
    memberSearch,
    isDialogOpen && canSelectMembers
  );

  const unassignedMembers: Member[] = (
    ((membersUnassignedQuery.data as any)?.data as any[]) || []
  ).map((m) => ({
    id: m.id,
    fullName: m.fullName,
    status: m.status,
  }));

  // Derived options
  const levels = React.useMemo(() => {
    let allLevels: string[] = [];
    if (schemaLevels.length) {
      allLevels = schemaLevels;
    } else {
      const list = Array.from(new Set(struktur.map((s) => s.level)));
      if (!list.some((l) => l?.toLowerCase() === "dprt")) list.push("dprt");
      allLevels = list;
    }
    // Filter out 'kader'
    return allLevels.filter((l) => l.toLowerCase() !== "kader");
  }, [schemaLevels, struktur]);

  const positions = React.useMemo(() => {
    if (schemaPositions.length) return schemaPositions;
    return ["ketua", "sekretaris", "bendahara", "wakil", "anggota"];
  }, [schemaPositions]);

  const sayapNames = React.useMemo(() => {
    const names = struktur
      .filter((s) => s.level?.toLowerCase() === "sayap" && s.sayapType?.name)
      .map((s) => s.sayapType!.name as string);
    return Array.from(new Set(names));
  }, [struktur]);

  const regionTypeForLevel = React.useMemo(() => {
    const lvl = watchLevel?.toLowerCase();
    if (lvl === "dpc") return "kecamatan";
    if (lvl === "dprt") return "desa";
    return undefined;
  }, [watchLevel]);

  const kecamatanOptions = React.useMemo(() => {
    return regions
      .filter((r) => r.type?.toLowerCase() === "kecamatan")
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [regions]);

  const filteredRegions = React.useMemo(() => {
    if (!regionTypeForLevel) return [] as Region[];

    if (regionTypeForLevel === "kecamatan") {
      return kecamatanOptions;
    }

    if (regionTypeForLevel === "desa") {
      const filtered = regions.filter((r) => r.type?.toLowerCase() === "desa");
      if (watchKecamatanId) {
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      }
      return [];
    }

    return [];
  }, [regions, regionTypeForLevel, kecamatanOptions, watchKecamatanId]);

  // Mutation
  const addMembersMutation = useMutation({
    mutationFn: async (payload: {
      strukturId: string | number;
      memberIds: number[];
    }) => {
      const res = await fetch("/api/organizations/add-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.error || "Gagal menyimpan");
      return j;
    },
    onSuccess: (_data, variables) => {
      toast.success("Berhasil", {
        description: `${variables.memberIds.length} anggota ditautkan`,
      });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["members-unassigned"] });
        onSuccess();
        form.reset();
      }, 0);
    },
    onError: (e: any) => {
      toast.error("Gagal", { description: e.message || "Terjadi kesalahan" });
    },
  });

  // Submit handler
  const onSubmit = async (data: FormData) => {
    try {
      if (strukturLoading || !struktur.length) {
        toast.error("Data struktur belum siap", {
          description: "Mohon tunggu sebentar, opsi struktur sedang dimuat.",
        });
        return;
      }

      let strukturId = data.strukturId;
      const lvl = data.level.toLowerCase();

      // Find or create matching struktur
      if (lvl === "sayap") {
        const match = struktur.find(
          (s) =>
            s.level?.toLowerCase() === "sayap" &&
            s.position?.toLowerCase() === data.position.toLowerCase() &&
            s.sayapType?.name === data.sayapName
        );
        strukturId = match ? String(match.id) : undefined;
      } else if (lvl === "dpd") {
        // For DPD, try to match by positionTitle first if provided
        if (data.positionTitle) {
          const match = struktur.find(
            (s) =>
              s.level?.toLowerCase() === "dpd" &&
              s.positionTitle === data.positionTitle
          );
          strukturId = match ? String(match.id) : undefined;
        } else {
          // Fallback to position enum
          const match = struktur.find(
            (s) =>
              s.level?.toLowerCase() === "dpd" &&
              s.position?.toLowerCase() === data.position.toLowerCase()
          );
          strukturId = match ? String(match.id) : undefined;
        }
      } else {
        // DPC and DPRT need region
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
        strukturId = target ? String(target.id) : undefined;
      }

      if (!strukturId) {
        throw new Error("Struktur tidak ditemukan. Mohon hubungi administrator.");
      }

      await addMembersMutation.mutateAsync({
        strukturId: strukturId,
        memberIds: data.memberIds,
      });
    } catch (e: any) {
      toast.error("Gagal", { description: e.message || "Terjadi kesalahan" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border-l-4 border-[#001B55] p-4 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-full bg-[#001B55] flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#001B55] mb-1">
                Menambahkan Anggota ke Struktur Organisasi
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                Tautkan anggota yang belum memiliki jabatan ke struktur
                organisasi dengan memilih level, posisi, dan anggota.
              </p>
            </div>
          </div>
        </div>

        {/* Level & Position */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[#001B55] font-semibold">
                  Tipe Organisasi
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("position", "");
                      form.setValue("positionTitle", "");
                      form.setValue("kecamatanId", "");
                      form.setValue("regionId", "");
                      form.setValue("strukturId", "");
                      form.setValue("sayapName", "");
                    }}
                    disabled={strukturLoading}
                  >
                    <SelectTrigger
                      className="h-11 w-full bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300"
                      style={{ borderRadius: "10px" }}
                    >
                      <SelectValue
                        placeholder={
                          strukturLoading
                            ? "Memuat tipe organisasi..."
                            : "Pilih tipe organisasi"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white border border-[#D8E2F0]"
                      style={{ borderRadius: "10px" }}
                    >
                      {levels.map((l) => (
                        <SelectItem
                          key={l}
                          value={l}
                          className="hover:bg-[#F0F6FF] transition-colors"
                        >
                          {l.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Position Field - Use DpdPositionSelector for DPD */}
          {watchLevel?.toLowerCase() === "dpd" ? (
            <FormField
              control={form.control}
              name="positionTitle"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[#001B55] font-semibold">
                    Posisi DPD
                  </FormLabel>
                  <FormControl>
                    <DpdPositionSelector
                      value={field.value || ""}
                      onChange={(val) => {
                        field.onChange(val);
                        // Also set the generic position enum for backward compatibility
                        if (val.includes("Ketua") && !val.includes("Wakil")) {
                          form.setValue("position", "ketua");
                        } else if (val.includes("Sekretaris")) {
                          form.setValue("position", "sekretaris");
                        } else if (val.includes("Bendahara")) {
                          form.setValue("position", "bendahara");
                        } else {
                          form.setValue("position", "wakil");
                        }
                      }}
                      disabled={!watchLevel || strukturLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[#001B55] font-semibold">
                    Posisi
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        form.setValue("strukturId", "");
                      }}
                      disabled={!watchLevel || strukturLoading}
                    >
                      <SelectTrigger
                        className="h-11 w-full bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300 disabled:opacity-50"
                        style={{ borderRadius: "10px" }}
                      >
                        <SelectValue
                          placeholder={
                            strukturLoading
                              ? "Memuat posisi..."
                              : "Pilih posisi"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-white border w-full border-[#D8E2F0]"
                        style={{ borderRadius: "10px" }}
                      >
                        {positions.map((p) => (
                          <SelectItem
                            key={p}
                            value={p}
                            className="hover:bg-[#F0F6FF] transition-colors"
                          >
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
          )}
        </div>

        {/* Kecamatan and Desa for DPRT */}
        {watchLevel?.toLowerCase() === "dprt" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="kecamatanId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[#001B55] font-semibold flex items-center gap-2">
                    <span>Kecamatan</span>
                    <span className="text-xs font-normal text-[#FF9C04]">
                      (Pilih dulu)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        form.setValue("regionId", "");
                      }}
                      disabled={regionsLoading}
                    >
                      <SelectTrigger
                        className="h-11 w-full bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300"
                        style={{ borderRadius: "10px" }}
                      >
                        <SelectValue
                          placeholder={
                            regionsLoading
                              ? "Memuat kecamatan..."
                              : "Pilih kecamatan terlebih dahulu"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-white border border-[#D8E2F0] max-h-[300px]"
                        style={{ borderRadius: "10px" }}
                      >
                        {regionsLoading ? (
                          <div className="py-6 text-center text-sm text-[#475569]">
                            Memuat kecamatan...
                          </div>
                        ) : (
                          kecamatanOptions.map((kec) => (
                            <SelectItem
                              key={kec.id}
                              value={String(kec.id)}
                              className="hover:bg-[#F0F6FF] transition-colors"
                            >
                              {kec.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regionId"
              render={({ field }) => {
                const isDprtWithoutKec = !watchKecamatanId;

                return (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-[#001B55] font-semibold flex items-center gap-2">
                      <span>Desa</span>
                      {isDprtWithoutKec && (
                        <span className="text-xs font-normal text-amber-600 animate-pulse">
                          (Pilih kecamatan dulu)
                        </span>
                      )}
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        form.setValue("strukturId", "");
                      }}
                      disabled={isDprtWithoutKec || regionsLoading}
                    >
                      <SelectTrigger
                        className={cn(
                          "h-11 w-full bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300",
                          isDprtWithoutKec &&
                            "opacity-50 cursor-not-allowed"
                        )}
                        style={{ borderRadius: "10px" }}
                      >
                        <SelectValue
                          placeholder={
                            regionsLoading
                              ? "Memuat desa..."
                              : isDprtWithoutKec
                              ? "Pilih kecamatan terlebih dahulu"
                              : "Pilih desa"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-white border border-[#D8E2F0] max-h-[300px]"
                        style={{ borderRadius: "10px" }}
                      >
                        {regionsLoading ? (
                          <div className="py-6 text-center text-sm text-[#475569]">
                            Memuat desa...
                          </div>
                        ) : filteredRegions.length === 0 ? (
                          <div className="py-6 text-center text-sm text-[#475569]">
                            {isDprtWithoutKec
                              ? "Pilih kecamatan terlebih dahulu"
                              : "Tidak ada wilayah tersedia"}
                          </div>
                        ) : (
                          filteredRegions.map((r) => (
                            <SelectItem
                              key={r.id}
                              value={String(r.id)}
                              className="hover:bg-[#F0F6FF] transition-colors"
                            >
                              {r.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                );
              }}
            />
          </div>
        )}

        {/* Kecamatan for DPC */}
        {watchLevel?.toLowerCase() === "dpc" && regionTypeForLevel && (
          <FormField
            control={form.control}
            name="regionId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="text-[#001B55] font-semibold">
                  Kecamatan
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    form.setValue("strukturId", "");
                  }}
                  disabled={regionsLoading}
                >
                  <SelectTrigger
                    className="h-11 w-full bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300"
                    style={{ borderRadius: "10px" }}
                  >
                    <SelectValue
                      placeholder={
                        regionsLoading
                          ? "Memuat kecamatan..."
                          : "Pilih kecamatan"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border border-[#D8E2F0] max-h-[300px]"
                    style={{ borderRadius: "10px" }}
                  >
                    {regionsLoading ? (
                      <div className="py-6 text-center text-sm text-[#475569]">
                        Memuat kecamatan...
                      </div>
                    ) : filteredRegions.length === 0 ? (
                      <div className="py-6 text-center text-sm text-[#475569]">
                        Tidak ada wilayah tersedia
                      </div>
                    ) : (
                      filteredRegions.map((r) => (
                        <SelectItem
                          key={r.id}
                          value={String(r.id)}
                          className="hover:bg-[#F0F6FF] transition-colors"
                        >
                          {r.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        )}

        {/* Sayap Name */}
        {watchLevel?.toLowerCase() === "sayap" && (
          <FormField
            control={form.control}
            name="sayapName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[#001B55] font-semibold">
                  Unit Struktur (Sayap)
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={strukturLoading}
                  >
                    <SelectTrigger
                      className="h-11 w-full bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300"
                      style={{ borderRadius: "10px" }}
                    >
                      <SelectValue
                        placeholder={
                          strukturLoading
                            ? "Memuat unit sayap..."
                            : "Pilih sayap"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white border border-[#D8E2F0]"
                      style={{ borderRadius: "10px" }}
                    >
                      {sayapNames.map((n) => (
                        <SelectItem
                          key={n}
                          value={n}
                          className="hover:bg-[#F0F6FF] transition-colors"
                        >
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

        {/* Member Selection */}
        <FormField
          control={form.control}
          name="memberIds"
          render={() => (
            <FormItem className="w-full">
              <FormLabel className="text-[#001B55] font-semibold flex items-center gap-2">
                <span>Pilih Anggota</span>
                {!canSelectMembers && (
                  <span className="text-xs font-normal text-amber-600">
                    (Lengkapi field di atas terlebih dahulu)
                  </span>
                )}
                {canSelectMembers &&
                  form.getValues("memberIds")?.length > 0 && (
                    <span className="text-xs font-normal text-green-600">
                      ✓ {form.getValues("memberIds").length} terpilih
                    </span>
                  )}
              </FormLabel>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                  <Input
                    placeholder={
                      canSelectMembers
                        ? "Cari nama anggota..."
                        : "Lengkapi form terlebih dahulu"
                    }
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    disabled={!canSelectMembers}
                    className={cn(
                      "pl-10 h-11 bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] placeholder:text-[#475569] transition-all duration-300",
                      !canSelectMembers && "opacity-50 cursor-not-allowed"
                    )}
                    style={{ borderRadius: "10px" }}
                  />
                </div>
                {!canSelectMembers ? (
                  <div className="max-h-72 overflow-hidden border border-[#D8E2F0] bg-gray-50 rounded-lg flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-[#E8F9FF] flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-[#475569]" />
                      </div>
                      <p className="text-sm font-medium text-[#001B55] mb-1">
                        Lengkapi Informasi Struktur
                      </p>
                      <p className="text-xs text-[#475569]">
                        Pilih tipe organisasi dan posisi terlebih dahulu
                      </p>
                    </div>
                  </div>
                ) : (
                  <MemberList
                    selectedIds={form.getValues("memberIds") || []}
                    onToggle={(id) => {
                      const cur = form.getValues("memberIds") || [];
                      const next = cur.includes(id)
                        ? cur.filter((x) => x !== id)
                        : [...cur, id];
                      form.setValue("memberIds", next, {
                        shouldValidate: true,
                      });
                    }}
                    membersList={unassignedMembers}
                    isLoading={
                      membersUnassignedQuery.isLoading ||
                      membersUnassignedQuery.isFetching
                    }
                  />
                )}
              </div>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Submit Buttons */}
        <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E8F9FF] bg-gradient-to-r from-white to-[#F8FBFF] -mx-5 -mb-4 px-5 pb-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onSuccess();
              form.reset();
            }}
            disabled={addMembersMutation.isPending}
            className="h-9 px-5 bg-white border border-[#D8E2F0] hover:bg-[#F0F6FF] hover:border-[#C4D9FF] text-[#475569] hover:text-[#001B55] font-medium transition-all duration-200 text-sm disabled:opacity-50"
            style={{ borderRadius: "8px" }}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="h-9 px-5 bg-gradient-to-r from-[#001B55] to-[#003875] hover:from-[#003875] hover:to-[#001B55] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ borderRadius: "8px" }}
            disabled={
              addMembersMutation.isPending ||
              !form.formState.isValid ||
              strukturLoading ||
              ((watchLevel?.toLowerCase() === "dpc" ||
                watchLevel?.toLowerCase() === "dprt") &&
                regionsLoading)
            }
          >
            {addMembersMutation.isPending ? (
              <span className="flex items-center gap-2">
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menyimpan...
              </span>
            ) : (
              "Simpan"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
