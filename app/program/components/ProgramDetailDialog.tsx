"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target } from "lucide-react";
import Image from "next/image";

export function ProgramDetailDialog({ program }: { program: any }) {
  const target = Number(program.target) || 0;
  const current = Number(program.currentTarget) || 0;
  const start = program.startDate
    ? new Date(program.startDate).toLocaleDateString("id-ID")
    : "-";
  const end = program.endDate
    ? new Date(program.endDate).toLocaleDateString("id-ID")
    : "-";

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between mt-8">
          <span className="text-[#001B55]">{program.name}</span>
          <Badge className="bg-nasdem-orange text-white capitalize">
            {program.status}
          </Badge>
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {program.photoUrl && (
          <div className="relative w-full h-56 rounded-xl overflow-hidden border">
            <Image
              src={program.photoUrl}
              alt={program.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <p className="text-gray-600 leading-relaxed">{program.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Target size={14} />
            Target: {target}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            Mulai: {start}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            Selesai: {end}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Koordinator:{" "}
          <span className="font-semibold text-[#001B55]">
            {program.coordinator?.fullName || "-"}
          </span>
        </div>
      </div>
    </DialogContent>
  );
}
