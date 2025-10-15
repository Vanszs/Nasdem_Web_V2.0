"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  Users,
  UserPlus,
  Link2,
  Search,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
//
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Define form schema with Zod
const memberFormSchema = z
  .object({
    level: z.string().min(1, "Tipe organisasi harus dipilih"),
    position: z.string().min(1, "Posisi harus dipilih"),
    sayapName: z.string().optional(),
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
      ["dpc", "dprt", "kader"].includes(data.level.toLowerCase())
        ? !!data.regionId
        : true,
    { message: "Region harus dipilih", path: ["regionId"] }
  );

const kaderFormSchema = z.object({
  dprtMemberId: z.number({ required_error: "Member DPRT harus dipilih" }),
  kaderIds: z.array(z.number()).min(1, "Minimal satu kader harus dipilih"),
});

type Region = { id: number; name: string; type: string };
type Struktur = {
  id: number;
  level: string;
  position: string;
  region?: Region | null;
  sayapType?: { name: string } | null;
};
type Member = { id: number; fullName: string; status?: string };
type DprtMember = Member & { region?: Region | null };

export function AddMemberDialog({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const controlledOpen = open !== undefined ? open : dialogOpen;
  const setOpen = (v: boolean) => {
    onOpenChange?.(v);
    if (open === undefined) {
      setDialogOpen(v);
    }
  };

  // React Query client
  const queryClient = useQueryClient();

  // Tabs state
  const [tab, setTab] = React.useState("org");

  // RHF
  const orgForm = useForm<z.infer<typeof memberFormSchema>>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      level: "",
      position: "",
      sayapName: "",
      regionId: "",
      strukturId: "",
      memberIds: [],
    },
    mode: "onChange",
  });
  const kaderForm = useForm<z.infer<typeof kaderFormSchema>>({
    resolver: zodResolver(kaderFormSchema),
    defaultValues: {
      dprtMemberId: undefined as any,
      kaderIds: [],
    },
    mode: "onChange",
  });

  const watchLevel = orgForm.watch("level");
  const watchPosition = orgForm.watch("position");
  const watchRegionId = orgForm.watch("regionId");
  const watchDprtMemberId = kaderForm.watch("dprtMemberId");

  // Search states
  const [regionSearch, setRegionSearch] = React.useState("");
  const [memberSearch, setMemberSearch] = React.useState("");
  const [dprtMemberSearch, setDprtMemberSearch] = React.useState("");
  const [openRegion, setOpenRegion] = React.useState(false);
  const [openMember, setOpenMember] = React.useState(false);
  const [openDprtMember, setOpenDprtMember] = React.useState(false);

  // Queries (moved after states to use latest values)
  const regionsQuery = useQuery<any>({
    queryKey: ["regions"],
    queryFn: async () => {
      const res = await fetch("/api/regions");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memuat wilayah");
      return json;
    },
    enabled: controlledOpen,
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
    enabled: controlledOpen,
    staleTime: 60_000,
  });
  const membersUnassignedQuery = useQuery<any>({
    queryKey: [
      "members-unassigned",
      { search: memberSearch, page: 1, pageSize: 100 },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("pageSize", "100");
      params.set("struktur", "true");
      params.set("unassigned", "true");
      if (memberSearch) params.set("search", memberSearch);
      const res = await fetch(`/api/members?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memuat anggota");
      return json;
    },
    enabled: controlledOpen,
  });
  const dprtMembersQuery = useQuery<any>({
    queryKey: ["members-dprt", { search: dprtMemberSearch }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("pageSize", "100");
      params.set("struktur", "true");
      params.set("level", "dprt");
      if (dprtMemberSearch) params.set("search", dprtMemberSearch);
      const res = await fetch(`/api/members?${params.toString()}`);
      const json = await res.json();
      if (!json.success)
        throw new Error(json.error || "Gagal memuat member DPRT");
      return json;
    },
    enabled: controlledOpen,
    staleTime: 60_000,
  });

  // Derived data
  const regions = ((regionsQuery.data as any)?.data as Region[]) || [];
  const struktur = ((strukturQuery.data as any)?.data as Struktur[]) || [];
  const unassignedMembers: Member[] = (
    ((membersUnassignedQuery.data as any)?.data as any[]) || []
  ).map((m) => ({
    id: m.id,
    fullName: m.fullName,
    status: m.status,
  }));

  // Derived options
  const levels = React.useMemo(() => {
    const list = Array.from(new Set(struktur.map((s) => s.level)));
    if (!list.some((l) => l?.toLowerCase() === "dprt")) list.push("dprt");
    return list;
  }, [struktur]);
  const positionEnums = [
    "ketua",
    "sekretaris",
    "bendahara",
    "wakil",
    "anggota",
  ];
  const positions = React.useMemo(() => {
    return positionEnums;
  }, []);
  const sayapNames = React.useMemo(() => {
    const names = struktur
      .filter((s) => s.level?.toLowerCase() === "sayap" && s.sayapType?.name)
      .map((s) => s.sayapType!.name as string);
    return Array.from(new Set(names));
  }, [struktur]);
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

  const filteredMembersForOrg = React.useMemo(() => {
    // server already applies search & unassigned
    return unassignedMembers;
  }, [unassignedMembers]);

  const dprtMembers: DprtMember[] = React.useMemo(() => {
    const list = ((dprtMembersQuery.data as any)?.data as any[]) || [];
    return list.map((m) => ({
      id: m.id,
      fullName: m.fullName,
      status: m.status,
      region: m?.struktur?.region
        ? {
            id: m.struktur.region.id,
            name: m.struktur.region.name,
            type: m.struktur.region.type,
          }
        : null,
    }));
  }, [dprtMembersQuery.data]);

  const selectedDprt = React.useMemo(() => {
    if (!watchDprtMemberId) return undefined;
    return dprtMembers.find((m) => m.id === watchDprtMemberId);
  }, [watchDprtMemberId, dprtMembers]);
  // Note: We no longer render a general "Unit Struktur" selector for non-sayap.
  // We'll resolve strukturId automatically on submit based on level, position and region.

  // Submissions
  // Mutations
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
      queryClient.invalidateQueries({ queryKey: ["members-unassigned"] });
      setOpen(false);
      orgForm.reset();
    },
    onError: (e: any) => {
      toast.error("Gagal", { description: e.message || "Terjadi kesalahan" });
    },
  });

  const addKadersMutation = useMutation({
    mutationFn: async (payload: {
      dprtMemberId: number;
      kaderIds: number[];
    }) => {
      const res = await fetch("/api/members/kaders", {
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
        description: `${variables.kaderIds.length} kader ditautkan`,
      });
      queryClient.invalidateQueries({ queryKey: ["members-unassigned"] });
      setOpen(false);
      kaderForm.reset();
    },
    onError: (e: any) => {
      toast.error("Gagal", { description: e.message || "Terjadi kesalahan" });
    },
  });

  const onSubmitOrg = async (data: z.infer<typeof memberFormSchema>) => {
    try {
      let strukturId = data.strukturId;
      const lvl = data.level.toLowerCase();

      if (lvl === "sayap") {
        const match = struktur.find(
          (s) =>
            s.level?.toLowerCase() === "sayap" &&
            s.sayapType?.name === data.sayapName
        );
        if (!match)
          throw new Error("Tidak menemukan struktur sayap yang sesuai");
        strukturId = String(match.id);
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
        if (!target) {
          throw new Error(
            "Tidak menemukan unit struktur untuk kombinasi level/posisi/wilayah"
          );
        }
        strukturId = String(target.id);
      }

      await addMembersMutation.mutateAsync({
        strukturId: strukturId!,
        memberIds: data.memberIds,
      });
    } catch (e: any) {
      toast.error("Gagal", { description: e.message || "Terjadi kesalahan" });
    }
  };

  const onSubmitKader = async (data: z.infer<typeof kaderFormSchema>) => {
    try {
      await addKadersMutation.mutateAsync({
        dprtMemberId: data.dprtMemberId,
        kaderIds: data.kaderIds,
      });
    } catch (e: any) {
      // handled in mutation onError
    }
  };

  // UI helpers
  const MemberList = ({
    selectedIds,
    onToggle,
    membersList,
    isLoading,
  }: {
    selectedIds: number[];
    onToggle: (id: number) => void;
    membersList?: Member[];
    isLoading?: boolean;
  }) => {
    const list = membersList || [];
    return (
      <div
        className="max-h-72 overflow-y-auto border border-[#D8E2F0] bg-white divide-y divide-[#E8F9FF]"
        style={{
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        {isLoading ? (
          <div className="p-8 text-center text-sm text-[#475569]">
            Memuat data...
          </div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#475569]">
            Tidak ada anggota tersedia
          </div>
        ) : (
          list.map((m) => {
            const checked = selectedIds.includes(m.id);
            return (
              <label
                key={m.id}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-300 ${
                  checked ? "bg-[#F0F6FF]" : "hover:bg-[#FBFBFB]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(m.id)}
                  className="h-4 w-4 rounded border-[#C4D9FF] text-[#C5BAFF] focus:ring-2 focus:ring-[#C5BAFF]/20 transition-colors"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#001B55] truncate">
                    {m.fullName}
                  </div>
                  <div className="text-xs text-[#475569] mt-0.5">
                    {m.status || "active"}
                  </div>
                </div>
              </label>
            );
          })
        )}
      </div>
    );
  };

  return (
    <Dialog open={controlledOpen} onOpenChange={setOpen}>
      {/* DialogTrigger removed - using controlled state from parent */}
      <DialogContent
        className="!max-w-3xl max-h-[82vh] bg-white border border-[#D8E2F0] p-0 overflow-hidden flex flex-col"
        style={{
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 27, 85, 0.15)",
        }}
      >
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-[#E8F9FF] bg-gradient-to-r from-white to-[#F8FBFF]">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-[#001B55] to-[#003875] shadow-md"
              style={{ borderRadius: "10px" }}
            >
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-bold text-[#001B55]">
                Tambah Keanggotaan Organisasi
              </DialogTitle>
              <p className="text-xs text-[#475569] mt-0.5">
                Tambahkan anggota ke struktur atau tautkan kader ke DPRT
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#C5BAFF #f0f0f0'
          }}
        >
          <div className="px-5 py-4">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="w-full inline-flex h-auto p-0 bg-transparent gap-2 border-b-2 border-gray-200/80 mb-4">
              <TabsTrigger
                value="org"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#001B55] data-[state=active]:to-[#003875] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-[#001B55] data-[state=active]:border-b-0 data-[state=active]:shadow-md data-[state=inactive]:bg-white/70 data-[state=inactive]:text-[#475569] data-[state=inactive]:border data-[state=inactive]:border-gray-200 data-[state=inactive]:border-b-0 data-[state=inactive]:hover:text-[#001B55] data-[state=inactive]:hover:border-[#001B55]/30 data-[state=inactive]:hover:bg-white font-medium transition-all duration-200 py-2.5 px-4 rounded-t-lg mb-[-2px] text-sm"
              >
                <Link2 className="mr-1.5 h-4 w-4" /> Anggota → Organisasi
              </TabsTrigger>
              <TabsTrigger
                value="kader"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#001B55] data-[state=active]:to-[#003875] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-[#001B55] data-[state=active]:border-b-0 data-[state=active]:shadow-md data-[state=inactive]:bg-white/70 data-[state=inactive]:text-[#475569] data-[state=inactive]:border data-[state=inactive]:border-gray-200 data-[state=inactive]:border-b-0 data-[state=inactive]:hover:text-[#001B55] data-[state=inactive]:hover:border-[#001B55]/30 data-[state=inactive]:hover:bg-white font-medium transition-all duration-200 py-2.5 px-4 rounded-t-lg mb-[-2px] text-sm"
              >
                <Users className="mr-1.5 h-4 w-4" /> Kader → DPRT
              </TabsTrigger>
            </TabsList>

            <TabsContent value="org" className="mt-0 space-y-4">
              {/* Info Box untuk menjelaskan */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 border-l-3 border-[#001B55] p-3 rounded-lg">
                <div className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-[#001B55]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#001B55] mb-0.5">
                      Menambahkan Anggota ke Struktur Organisasi
                    </h4>
                    <p className="text-[11px] text-[#475569] leading-snug">
                      Tautkan anggota yang belum memiliki jabatan ke struktur organisasi. Pilih tipe, posisi, dan anggota.
                    </p>
                  </div>
                </div>
              </div>

              <Form {...orgForm}>
                <form
                  onSubmit={orgForm.handleSubmit(onSubmitOrg)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <FormField
                      control={orgForm.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#001B55] font-semibold">
                            Tipe Organisasi
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(v) => {
                                field.onChange(v);
                                orgForm.setValue("position", "");
                                orgForm.setValue("regionId", "");
                                orgForm.setValue("strukturId", "");
                                orgForm.setValue("sayapName", "");
                              }}
                            >
                              <SelectTrigger
                                className="h-11 bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300"
                                style={{ borderRadius: "10px" }}
                              >
                                <SelectValue placeholder="Pilih tipe organisasi" />
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
                    <FormField
                      control={orgForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#001B55] font-semibold">
                            Posisi
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(v) => {
                                field.onChange(v);
                                orgForm.setValue("strukturId", "");
                              }}
                              disabled={!watchLevel}
                            >
                              <SelectTrigger
                                className="h-11 bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300 disabled:opacity-50"
                                style={{ borderRadius: "10px" }}
                              >
                                <SelectValue placeholder="Pilih posisi" />
                              </SelectTrigger>
                              <SelectContent
                                className="bg-white border border-[#D8E2F0]"
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
                  </div>

                  {regionTypeForLevel && (
                    <FormField
                      control={orgForm.control}
                      name="regionId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-[#001B55] font-semibold">
                            Wilayah
                          </FormLabel>
                          <Popover
                            open={openRegion}
                            onOpenChange={setOpenRegion}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={openRegion}
                                  className={cn(
                                    "w-full justify-between h-11 bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300",
                                    !field.value && "text-[#475569]"
                                  )}
                                  style={{ borderRadius: "10px" }}
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
                            <PopoverContent
                              className="w-full p-0 bg-white border border-[#D8E2F0]"
                              align="start"
                              style={{ borderRadius: "10px" }}
                            >
                              <Command className="bg-white">
                                <CommandInput
                                  placeholder="Cari wilayah..."
                                  value={regionSearch}
                                  onValueChange={setRegionSearch}
                                  className="h-10 border-b border-[#E8F9FF]"
                                />
                                <CommandList>
                                  <CommandEmpty className="py-6 text-center text-sm text-[#475569]">
                                    Tidak ada wilayah ditemukan.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {filteredRegions.map((r) => (
                                      <CommandItem
                                        key={r.id}
                                        value={r.name}
                                        onSelect={() => {
                                          field.onChange(String(r.id));
                                          orgForm.setValue("strukturId", "");
                                          setOpenRegion(false);
                                          setRegionSearch("");
                                        }}
                                        className="hover:bg-[#F0F6FF] transition-colors"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4 text-[#C5BAFF]",
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
                      control={orgForm.control}
                      name="sayapName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#001B55] font-semibold">
                            Unit Struktur (Sayap)
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                className="h-11 bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300"
                                style={{ borderRadius: "10px" }}
                              >
                                <SelectValue placeholder="Pilih sayap" />
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

                  <FormField
                    control={orgForm.control}
                    name="memberIds"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-[#001B55] font-semibold">
                          Pilih Anggota
                        </FormLabel>
                        <div className="space-y-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                            <Input
                              placeholder="Cari nama anggota..."
                              value={memberSearch}
                              onChange={(e) => setMemberSearch(e.target.value)}
                              className="pl-10 h-11 bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] placeholder:text-[#475569] transition-all duration-300"
                              style={{ borderRadius: "10px" }}
                            />
                          </div>
                          <MemberList
                            selectedIds={orgForm.getValues("memberIds") || []}
                            onToggle={(id) => {
                              const cur = orgForm.getValues("memberIds") || [];
                              const next = cur.includes(id)
                                ? cur.filter((x) => x !== id)
                                : [...cur, id];
                              orgForm.setValue("memberIds", next, {
                                shouldValidate: true,
                              });
                            }}
                            membersList={filteredMembersForOrg}
                            isLoading={membersUnassignedQuery.isLoading}
                          />
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E8F9FF] bg-gradient-to-r from-white to-[#F8FBFF] -mx-5 -mb-4 px-5 pb-4 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOpen(false);
                        orgForm.reset();
                      }}
                      className="h-9 px-5 bg-white border border-[#D8E2F0] hover:bg-[#F0F6FF] hover:border-[#C4D9FF] text-[#475569] hover:text-[#001B55] font-medium transition-all duration-200 text-sm"
                      style={{ borderRadius: "8px" }}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="h-9 px-5 bg-gradient-to-r from-[#001B55] to-[#003875] hover:from-[#003875] hover:to-[#001B55] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                      style={{ borderRadius: "8px" }}
                      disabled={addMembersMutation.isPending}
                    >
                      {addMembersMutation.isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="kader" className="mt-0 space-y-4">
              {/* Info Box untuk menjelaskan */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 border-l-3 border-[#001B55] p-3 rounded-lg">
                <div className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-[#001B55]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#001B55] mb-0.5">
                      Menautkan Kader ke Member DPRT
                    </h4>
                    <p className="text-[11px] text-[#475569] leading-snug">
                      Tautkan kader (anggota tanpa jabatan) ke member DPRT. Pilih member DPRT dan kader yang akan ditautkan.
                    </p>
                  </div>
                </div>
              </div>

              <Form {...kaderForm}>
                <form
                  onSubmit={kaderForm.handleSubmit(onSubmitKader)}
                  className="space-y-4"
                >
                  {/* DPRT members in selected desa */}
                  <FormField
                    control={kaderForm.control}
                    name="dprtMemberId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#001B55] font-semibold">
                          Member (DPRT)
                        </FormLabel>
                        <FormControl>
                          <Popover
                            open={openDprtMember}
                            onOpenChange={setOpenDprtMember}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openDprtMember}
                                className={cn(
                                  "w-full justify-between h-11 bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300",
                                  !field.value && "text-[#475569]"
                                )}
                                style={{ borderRadius: "10px" }}
                              >
                                {field.value
                                  ? dprtMembers.find(
                                      (m) => m.id === field.value
                                    )?.fullName
                                  : "Pilih member DPRT"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0 bg-white border border-[#D8E2F0]"
                              style={{ borderRadius: "10px" }}
                            >
                              <Command className="bg-white">
                                <CommandInput
                                  placeholder="Cari member DPRT..."
                                  value={dprtMemberSearch}
                                  onValueChange={setDprtMemberSearch}
                                  className="h-10 border-b border-[#E8F9FF]"
                                />
                                <CommandList>
                                  <CommandEmpty className="py-6 text-center text-sm text-[#475569]">
                                    Member DPRT tidak ditemukan.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {dprtMembers.map((m) => (
                                      <CommandItem
                                        key={m.id}
                                        value={m.fullName}
                                        onSelect={() => {
                                          field.onChange(m.id);
                                          setOpenDprtMember(false);
                                        }}
                                        className="hover:bg-[#F0F6FF] transition-colors"
                                      >
                                        <Check
                                          className={`mr-2 h-4 w-4 text-[#C5BAFF] ${
                                            field.value === m.id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        />
                                        {m.fullName}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Auto-derived Desa from selected DPRT member */}
                  <div
                    className="px-4 py-3 bg-[#E8F9FF] border border-[#C4D9FF] text-sm text-[#001B55]"
                    style={{ borderRadius: "10px" }}
                  >
                    <span className="font-semibold">Desa otomatis:</span>{" "}
                    <span>{selectedDprt?.region?.name || "-"}</span>
                  </div>

                  {/* Choose cadres */}
                  <FormField
                    control={kaderForm.control}
                    name="kaderIds"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-[#001B55] font-semibold">
                          Pilih Kader
                        </FormLabel>
                        <MemberList
                          selectedIds={kaderForm.getValues("kaderIds") || []}
                          onToggle={(id) => {
                            const cur = kaderForm.getValues("kaderIds") || [];
                            const next = cur.includes(id)
                              ? cur.filter((x) => x !== id)
                              : [...cur, id];
                            kaderForm.setValue("kaderIds", next, {
                              shouldValidate: true,
                            });
                          }}
                          membersList={filteredMembersForOrg}
                          isLoading={membersUnassignedQuery.isLoading}
                        />
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E8F9FF] bg-gradient-to-r from-white to-[#F8FBFF] -mx-5 -mb-4 px-5 pb-4 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOpen(false);
                        kaderForm.reset();
                      }}
                      className="h-9 px-5 bg-white border border-[#D8E2F0] hover:bg-[#F0F6FF] hover:border-[#C4D9FF] text-[#475569] hover:text-[#001B55] font-medium transition-all duration-200 text-sm"
                      style={{ borderRadius: "8px" }}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="h-9 px-5 bg-gradient-to-r from-[#001B55] to-[#003875] hover:from-[#003875] hover:to-[#001B55] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                      style={{ borderRadius: "8px" }}
                      disabled={addKadersMutation.isPending}
                    >
                      {addKadersMutation.isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
