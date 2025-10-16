"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
}

export function GalleryFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
}: Props) {
  return (
    <Card className="border-2 border-gray-300/80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari judul, deskripsi atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[240px] border-2 border-gray-200 hover:border-gray-300 focus:border-brand-primary">
              <SelectValue placeholder="Filter kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="sosial">Sosial</SelectItem>
              <SelectItem value="politik">Politik</SelectItem>
              <SelectItem value="pendidikan">Pendidikan</SelectItem>
              <SelectItem value="kaderisasi">Kaderisasi</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="kolaborasi">Kolaborasi</SelectItem>
              <SelectItem value="pelayanan">Pelayanan</SelectItem>
              <SelectItem value="publikasi">Publikasi</SelectItem>
              <SelectItem value="lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
