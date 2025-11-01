"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MemberList } from "./MemberList";
import {
  useDprtMembers,
  useUnassignedMembers,
  type DprtMember,
  type Member,
} from "../hooks/useOrganizationData";

// Form schema
const kaderFormSchema = z.object({
  dprtMemberId: z.number({ required_error: "Member DPRT harus dipilih" }),
  kaderIds: z.array(z.number()).min(1, "Minimal satu kader harus dipilih"),
});

type FormData = z.infer<typeof kaderFormSchema>;

interface KaderToDprtFormProps {
  onSuccess: () => void;
  isDialogOpen: boolean;
}

/**
 * Form untuk menautkan kader ke member DPRT
 * Kader akan berada di bawah pengawasan member DPRT yang dipilih
 */
export function KaderToDprtForm({
  onSuccess,
  isDialogOpen,
}: KaderToDprtFormProps) {
  const queryClient = useQueryClient();
  const [memberSearch] = React.useState("");

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(kaderFormSchema),
    defaultValues: {
      dprtMemberId: undefined as any,
      kaderIds: [],
    },
    mode: "onChange",
  });

  const watchDprtMemberId = form.watch("dprtMemberId");

  // Data fetching hooks
  const dprtMembersQuery = useDprtMembers(isDialogOpen);
  const canSelectKaders = !!watchDprtMemberId;
  const membersUnassignedQuery = useUnassignedMembers(
    memberSearch,
    isDialogOpen && canSelectKaders
  );

  // Derived data
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

  const unassignedMembers: Member[] = (
    ((membersUnassignedQuery.data as any)?.data as any[]) || []
  ).map((m) => ({
    id: m.id,
    fullName: m.fullName,
    status: m.status,
  }));

  // Mutation
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
      await addKadersMutation.mutateAsync({
        dprtMemberId: data.dprtMemberId,
        kaderIds: data.kaderIds,
      });
    } catch (e: any) {
      // handled in mutation onError
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Info Box */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50/50 border-l-4 border-[#001B55] p-4 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-full bg-[#001B55] flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#001B55] mb-1">
                Menautkan Kader ke Member DPRT
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed mb-3">
                Hubungkan kader dengan member DPRT untuk struktur organisasi
                yang lebih baik:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300",
                      watchDprtMemberId
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    )}
                  >
                    {watchDprtMemberId ? "✓" : "1"}
                  </div>
                  <span
                    className={cn(
                      "font-medium transition-colors duration-300",
                      watchDprtMemberId
                        ? "text-green-700"
                        : "text-[#475569]"
                    )}
                  >
                    Pilih Member DPRT
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300",
                      form.getValues("kaderIds")?.length > 0
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    )}
                  >
                    {form.getValues("kaderIds")?.length > 0 ? "✓" : "2"}
                  </div>
                  <span
                    className={cn(
                      "font-medium transition-colors duration-300",
                      form.getValues("kaderIds")?.length > 0
                        ? "text-green-700"
                        : "text-[#475569]"
                    )}
                  >
                    Pilih Kader yang Akan Ditautkan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DPRT Member Selection */}
        <FormField
          control={form.control}
          name="dprtMemberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-semibold">
                Member (DPRT)
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                  disabled={dprtMembersQuery.isLoading}
                >
                  <SelectTrigger
                    className={cn(
                      "h-11 w-full bg-white border-2 border-[#C4D9FF] hover:border-[#C5BAFF] focus:border-[#001B55] focus:ring-2 focus:ring-[#C5BAFF]/20 text-[#001B55] transition-all duration-300",
                      !field.value && "text-[#475569]"
                    )}
                    style={{ borderRadius: "10px" }}
                  >
                    <SelectValue
                      placeholder={
                        dprtMembersQuery.isLoading
                          ? "Memuat member DPRT..."
                          : "Pilih member DPRT"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border border-[#D8E2F0] max-h-[300px]"
                    style={{ borderRadius: "10px" }}
                  >
                    {dprtMembers.length === 0 ? (
                      <div className="py-6 text-center text-sm text-[#475569]">
                        {dprtMembersQuery.isLoading
                          ? "Memuat..."
                          : "Member DPRT tidak ditemukan."}
                      </div>
                    ) : (
                      dprtMembers.map((m) => (
                        <SelectItem
                          key={m.id}
                          value={String(m.id)}
                          className="hover:bg-[#F0F6FF] transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#001B55]">
                              {m.fullName}
                            </span>
                            {m.region?.name && (
                              <span className="text-xs text-[#475569]">
                                {m.region.name}
                              </span>
                            )}
                          </div>
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

        {/* Auto-derived Desa */}
        {watchDprtMemberId && (
          <div
            className="px-4 py-3 bg-gradient-to-r from-[#E8F9FF] to-[#F0F6FF] border-2 border-[#C5BAFF] text-sm"
            style={{ borderRadius: "10px" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C5BAFF] animate-pulse"></div>
              <span className="font-semibold text-[#001B55]">
                Desa otomatis:
              </span>
              <span className="font-bold text-[#001B55]">
                {selectedDprt?.region?.name || "-"}
              </span>
            </div>
            <p className="text-xs text-[#475569] mt-1 ml-4">
              Kader yang dipilih akan ditautkan ke desa ini
            </p>
          </div>
        )}

        {/* Kader Selection */}
        <FormField
          control={form.control}
          name="kaderIds"
          render={() => (
            <FormItem>
              <FormLabel className="text-[#001B55] font-semibold flex items-center gap-2">
                <span>Pilih Kader</span>
                {!canSelectKaders && (
                  <span className="text-xs font-normal text-amber-600">
                    (Pilih member DPRT terlebih dahulu)
                  </span>
                )}
                {canSelectKaders && form.getValues("kaderIds")?.length > 0 && (
                  <span className="text-xs font-normal text-green-600">
                    ✓ {form.getValues("kaderIds").length} terpilih
                  </span>
                )}
              </FormLabel>
              {!canSelectKaders ? (
                <div className="max-h-72 overflow-hidden border border-[#D8E2F0] bg-gray-50 rounded-lg flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[#E8F9FF] flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-[#475569]" />
                    </div>
                    <p className="text-sm font-medium text-[#001B55] mb-1">
                      Pilih Member DPRT
                    </p>
                    <p className="text-xs text-[#475569]">
                      Pilih member DPRT terlebih dahulu untuk melihat daftar
                      kader
                    </p>
                  </div>
                </div>
              ) : (
                <MemberList
                  selectedIds={form.getValues("kaderIds") || []}
                  onToggle={(id) => {
                    const cur = form.getValues("kaderIds") || [];
                    const next = cur.includes(id)
                      ? cur.filter((x) => x !== id)
                      : [...cur, id];
                    form.setValue("kaderIds", next, {
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
            disabled={addKadersMutation.isPending}
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
              addKadersMutation.isPending || !form.formState.isValid
            }
          >
            {addKadersMutation.isPending ? (
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
