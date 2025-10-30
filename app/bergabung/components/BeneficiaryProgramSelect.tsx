"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";

type Program = { id: string | number; title?: string; name?: string };

export function BeneficiaryProgramSelect({
  enabled,
  value,
  onChange,
}: {
  enabled: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const { data, isLoading } = useQuery<
    { programs?: Program[]; data?: Program[]; success?: boolean } | Program[]
  >({
    queryKey: ["programs"],
    queryFn: async () => {
      const res = await fetch("/api/programs", { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      return json;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const programs: Program[] = Array.isArray(data)
    ? data
    : (data?.data as Program[]) || (data?.programs as Program[]) || [];

  return (
    <div className="mt-6 space-y-3 animate-fade-in">
      <Label
        htmlFor="beneficiaryProgramId"
        className="text-[#001B55] font-bold text-sm"
      >
        Program Yang Diterima <span className="text-[#C81E1E]">*</span>
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={!enabled || isLoading}
      >
        <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 bg-white">
          <SelectValue
            placeholder={
              isLoading ? "Memuat program..." : "Pilih program yang Anda terima"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {programs.map((p) => (
            <SelectItem key={String(p.id)} value={String(p.id)}>
              {p.title || p.name || String(p.id)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
