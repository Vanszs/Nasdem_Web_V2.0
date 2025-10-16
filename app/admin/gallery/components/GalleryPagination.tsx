"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function GalleryPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: Props) {
  if (!(totalItems > 0 && totalPages > 1)) return null;

  const visiblePages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) =>
    currentPage <= 3 ? i + 1 : currentPage - 2 + i
  ).filter((p) => p <= totalPages);

  return (
    <div className="flex items-center justify-between pt-6">
      <div className="text-sm text-muted-foreground">
        Halaman {currentPage} dari {totalPages} ({totalItems} total media)
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-2 border-gray-200 hover:border-gray-300 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </Button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] border-2 cursor-pointer ${
                page === currentPage
                  ? "bg-brand-primary border-brand-primary text-white"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-2 border-gray-200 hover:border-gray-300 cursor-pointer"
        >
          Selanjutnya
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
