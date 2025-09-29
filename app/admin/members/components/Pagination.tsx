import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const visible = Math.min(totalPages, 5);
  const start = currentPage <= 3 ? 1 : Math.max(1, currentPage - 2);
  const pages = Array.from({ length: visible }, (_, i) => {
    const p = start + i;
    return p <= totalPages ? p : null;
  }).filter(Boolean) as number[];
  return (
    <div className="flex items-center justify-between p-6 bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-2xl shadow-lg">
      <div className="text-sm font-medium text-[#6B7280]">
        Halaman <span className="font-bold text-[#001B55]">{currentPage}</span>{" "}
        dari <span className="font-bold text-[#001B55]">{totalPages}</span>
        <span className="ml-2 text-[#6B7280]/70">
          ({totalItems} total anggota)
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-xl border-2 font-medium ${
            currentPage === 1
              ? "border-[#F0F0F0] text-[#6B7280]/50"
              : "border-[#001B55]/20 text-[#001B55] hover:border-[#001B55] hover:bg-[#001B55] hover:text-white"
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
        </Button>
        <div className="flex items-center gap-2">
          {pages.map((p) => (
            <Button
              key={p}
              size="sm"
              variant={p === currentPage ? "default" : "outline"}
              onClick={() => onChange(p)}
              className={`min-w-[44px] h-10 rounded-xl font-semibold ${
                p === currentPage
                  ? "bg-gradient-to-r from-[#001B55] to-[#001B55]/90 text-white shadow-lg scale-105"
                  : "border-2 border-[#F0F0F0] text-[#6B7280] hover:border-[#001B55]/30 hover:text-[#001B55]"
              }`}
            >
              {p}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-xl border-2 font-medium ${
            currentPage === totalPages
              ? "border-[#F0F0F0] text-[#6B7280]/50"
              : "border-[#001B55]/20 text-[#001B55] hover:border-[#001B55] hover:bg-[#001B55] hover:text-white"
          }`}
        >
          Selanjutnya <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
