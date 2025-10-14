"use client";
import { Badge } from "@/components/ui/badge";
import type { ProgramStatus } from "@prisma/client";

const labelMap: Record<ProgramStatus, string> = {
  ongoing: "Berlangsung",
  completed: "Selesai",
  pending: "Tertunda",
  planning: "Perencanaan",
};

export function ProgramStatusBadge({ status }: { status: ProgramStatus }) {
  const colors: Record<ProgramStatus, string> = {
    ongoing:
      "bg-gradient-to-r from-[#001B55] to-[#001845] text-white shadow-lg shadow-[#001B55]/30 font-semibold px-4 py-1 rounded-full text-xs tracking-wide",
    completed:
      "bg-[#FF9C04]/10 text-[#FF9C04] border border-[#FF9C04]/30 font-semibold px-4 py-1 rounded-full text-xs tracking-wide",
    pending:
      "bg-[#F59E0B]/10 text-[#B45309] border border-[#F59E0B]/30 font-semibold px-4 py-1 rounded-full text-xs tracking-wide",
    planning:
      "bg-[#6B7280]/10 text-[#374151] border border-[#6B7280]/30 font-semibold px-4 py-1 rounded-full text-xs tracking-wide",
  };
  return <Badge className={colors[status]}>{labelMap[status]}</Badge>;
}
