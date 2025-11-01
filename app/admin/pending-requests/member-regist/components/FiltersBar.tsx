"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export function FiltersBar({
  search,
  onSearch,
  status,
  onStatus,
  pageSize,
  onPageSize,
}: {
  search: string;
  onSearch: (v: string) => void;
  status: string;
  onStatus: (v: string) => void;
  pageSize: number;
  onPageSize: (n: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Cari nama, email, telepon..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF] transition-all"
        />
      </div>

      <Select value={status} onValueChange={onStatus}>
        <SelectTrigger className="h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <SelectValue placeholder="Filter Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="pending">Menunggu</SelectItem>
          <SelectItem value="accepted">Diterima</SelectItem>
          <SelectItem value="rejected">Ditolak</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={String(pageSize)}
        onValueChange={(v) => onPageSize(parseInt(v, 10))}
      >
        <SelectTrigger className="h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF]">
          <SelectValue placeholder="Jumlah per halaman" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 / halaman</SelectItem>
          <SelectItem value="30">30 / halaman</SelectItem>
          <SelectItem value="50">50 / halaman</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
