"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProgramFilters({
  q,
  onQChange,
  category,
  onCategoryChange,
}: {
  q: string;
  onQChange: (v: string) => void;
  category?: string;
  onCategoryChange: (v?: string) => void;
}) {
  return (
    <div className="mb-8 rounded-xl bg-white border border-gray-200 shadow-lg p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-9">
          <Input
            placeholder="Cari program..."
            value={q}
            onChange={(e) => onQChange(e.target.value)}
            className="bg-white p-5 border-gray-300 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20"
          />
        </div>
        <div className="md:col-span-3">
          <Select
            value={category ?? "all"}
            onValueChange={(v) => onCategoryChange(v === "all" ? undefined : v)}
          >
            <SelectTrigger className="bg-white w-full p-5 border-gray-300 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20">
              <SelectValue placeholder="Semua kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Program</SelectItem>
              <SelectItem value="pip">Program Indonesia Pintar (PIP)</SelectItem>
              <SelectItem value="kip">Kartu Indonesia Pintar Kuliah (KIP)</SelectItem>
              <SelectItem value="pendidikan">Pendidikan</SelectItem>
              <SelectItem value="ekonomi">Ekonomi</SelectItem>
              <SelectItem value="pertanian">Pertanian</SelectItem>
              <SelectItem value="sosial">Sosial</SelectItem>
              <SelectItem value="advokasi">Advokasi</SelectItem>
              <SelectItem value="organisasi">Organisasi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
