"use client";

import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { GalleryDetailModal } from "@/app/admin/gallery/components/GalleryDetailModal";

const categories = [
  { value: "all", label: "Semua" },
  { value: "sosial", label: "Sosial" },
  { value: "politik", label: "Politik" },
  { value: "pendidikan", label: "Pendidikan" },
  { value: "kaderisasi", label: "Kaderisasi" },
  { value: "internal", label: "Internal" },
  { value: "kolaborasi", label: "Kolaborasi" },
  { value: "pelayanan", label: "Pelayanan" },
  { value: "publikasi", label: "Publikasi" },
  { value: "lainnya", label: "Lainnya" },
];

type Activity = {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  eventDate?: string | null;
  location?: string | null;
  createdAt: string;
  media: {
    id: number;
    type: "image" | "video";
    url: string;
    caption?: string | null;
  }[];
};

function useActivities(q: string, category: string) {
  return useQuery<{ success: boolean; data: Activity[] }>({
    queryKey: ["public-activities", q, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category !== "all") params.set("category", category);
      const res = await fetch(`/api/galleries?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat galeri");
      return res.json();
    },
  });
}

function GallerySkeleton() {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border-2 border-gray-100 overflow-hidden"
        >
          <div className="h-48 bg-gray-300 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
            <div className="h-3 w-1/3 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center border-2 border-nasdem-blue/20 rounded-2xl p-12 bg-white shadow-lg">
      <p className="text-lg font-semibold text-nasdem-blue mb-2">
        Belum ada kegiatan
      </p>
      <p className="text-gray-500">
        Data galeri akan muncul di sini ketika tersedia.
      </p>
    </div>
  );
}

export default function GaleriPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailActivity, setDetailActivity] = useState<{
    title: string;
    description?: string | null;
    createdAt: string;
    location?: string | null;
    category?: string | null;
    media: Activity["media"];
  } | null>(null);
  const itemsPerPage = 12;
  const debouncedQ = useDebounce(search, 400);
  const { data, isLoading } = useActivities(debouncedQ, category);
  const activities = data?.data ?? [];

  const mapped = useMemo(() => {
    return activities.map((a) => ({
      id: a.id,
      title: a.title,
      date: a.eventDate ?? a.createdAt,
      thumb: a.media?.[0]?.url ?? "/placeholder.svg?height=250&width=300",
      media: a.media,
    }));
  }, [activities]);

  const totalPages = Math.max(1, Math.ceil(mapped.length / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = mapped.slice(start, start + itemsPerPage);

  const onOpenDetail = (item: (typeof mapped)[number]) => {
    const full = activities.find((a) => a.id === item.id);
    setDetailActivity(
      full
        ? {
            title: full.title,
            description: full.description,
            createdAt: full.createdAt,
            location: full.location,
            category: full.category,
            media: full.media,
          }
        : {
            title: item.title,
            description: undefined,
            createdAt: new Date().toISOString(),
            location: undefined,
            category: undefined,
            media: item.media,
          }
    );
    setDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />

      {/* Header */}
      <section className="bg-nasdem-blue text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Galeri Kegiatan
          </h1>
          <p className="text-xl text-white/90">
            Dokumentasi kegiatan dan program NasDem Sidoarjo
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8">
            <div className="relative flex-1">
              <Input
                value={search}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="Cari judul, deskripsi, lokasi..."
                className="h-11 border-2 border-gray-200 focus:border-nasdem-orange"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <Button
                  key={c.value}
                  variant={c.value === category ? "default" : "outline"}
                  onClick={() => {
                    setCurrentPage(1);
                    setCategory(c.value);
                  }}
                  className={
                    c.value === category
                      ? "bg-nasdem-orange text-white"
                      : "border-nasdem-orange text-nasdem-orange hover:bg-nasdem-orange hover:text-white"
                  }
                >
                  {c.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <GallerySkeleton />
          ) : pageItems.length ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {pageItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group overflow-hidden rounded-lg bg-white shadow-lg border-2 border-nasdem-blue/20 hover:border-nasdem-blue/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-full h-48 relative">
                    <Image
                      src={item.thumb}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-nasdem-blue/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      className="bg-white text-nasdem-blue hover:bg-nasdem-orange hover:text-white cursor-pointer"
                      onClick={() => onOpenDetail(item)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-nasdem-blue mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

          {/* Pagination */}
          {pageItems.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-nasdem-orange text-nasdem-orange bg-transparent cursor-pointer"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const page =
                  Math.min(
                    Math.max(1, currentPage - 2),
                    Math.max(1, totalPages - 4)
                  ) + i;
                if (page > totalPages) return null;
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage
                        ? "bg-nasdem-orange text-white"
                        : "border-nasdem-orange text-nasdem-orange"
                    }
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="border-nasdem-orange text-nasdem-orange bg-transparent cursor-pointer"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal - shared component with two-column layout and auto slide */}
      {detailActivity && (
        <GalleryDetailModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          title={detailActivity.title}
          media={detailActivity.media.map((m) => ({
            id: m.id,
            type: m.type,
            url: m.url,
            caption: m.caption ?? undefined,
          }))}
          description={detailActivity.description || undefined}
          uploadDate={detailActivity.createdAt}
          location={detailActivity.location || undefined}
          category={detailActivity.category || undefined}
          autoPlaySeconds={4}
        />
      )}

      <NasdemFooter />
    </div>
  );
}

// DetailSlider removed in favor of shared GalleryDetailModal
