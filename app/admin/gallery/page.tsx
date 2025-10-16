"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GalleryGrid, GalleryGridItem } from "./components/GalleryGrid";
import {
  ActivityMediaItem,
  GalleryDetailModal,
} from "./components/GalleryDetailModal";
import { useDebounce } from "@/hooks/use-debounce";
import { AdminLayout } from "../components/layout/AdminLayout";
import { GalleryHeader } from "./components/GalleryHeader";
import { GalleryFilters } from "./components/GalleryFilters";
import { GallerySkeleton } from "./components/GallerySkeleton";
import { GalleryPagination } from "./components/GalleryPagination";
import { GalleryEmptyState } from "./components/GalleryEmptyState";
import { ActivityFormDialog } from "./components/ActivityFormDialog";

type GalleryItem = GalleryGridItem;

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTitle, setDetailTitle] = useState("");
  const [detailMedia, setDetailMedia] = useState<ActivityMediaItem[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const itemsPerPage = 9;
  const debouncedQ = useDebounce(searchTerm, 400);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["activities", debouncedQ, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedQ) params.set("q", debouncedQ);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      const res = await fetch(`/api/galleries?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const activities = data?.data ?? [];

  const mappedItems: GalleryItem[] = useMemo(() => {
    return activities.map((a: any) => ({
      id: String(a.id),
      title: a.title,
      description: a.description ?? "",
      category: a.category,
      image: a.media?.[0]?.url ?? "/placeholder.svg?height=300&width=400",
      uploadDate: a.eventDate ?? a.createdAt ?? new Date().toISOString(),
      photographer: a.location ?? undefined,
      location: a.location ?? undefined,
      tags: [],
      views: 0,
    }));
  }, [activities]);

  const totalPages = Math.ceil(mappedItems.length / itemsPerPage) || 1;
  const paginatedItems = mappedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalItems = mappedItems.length;

  const handlePageChange = (page: number) => setCurrentPage(page);

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    { label: "Galeri" },
  ];

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/galleries/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json?.success)
        throw new Error(json?.error || "Gagal menghapus");
      return json;
    },
    onSuccess: () => {
      toast.success("Aktivitas dihapus");
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setDeleteId(null);
    },
    onError: (e: any) => toast.error(e?.message || "Gagal menghapus"),
  });

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <GalleryHeader
          onCreate={() => {
            setEditData(undefined);
            setFormOpen(true);
          }}
        />
        <GalleryFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />

        {isLoading ? (
          <GallerySkeleton />
        ) : paginatedItems.length > 0 ? (
          <>
            <GalleryGrid
              items={paginatedItems}
              onViewDetail={(id) => {
                const a = activities.find(
                  (x: any) => String(x.id) === String(id)
                );
                if (a) {
                  setSelectedActivity(a);
                  setDetailTitle(a.title);
                  const media: ActivityMediaItem[] = (a.media || []).map(
                    (m: any) => ({
                      id: m.id,
                      type: m.type,
                      url: m.url,
                      caption: m.caption || undefined,
                    })
                  );
                  setDetailMedia(media);
                  setDetailOpen(true);
                }
              }}
            />
            <GalleryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <GalleryEmptyState />
        )}
      </div>

      <GalleryDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={detailTitle}
        media={detailMedia}
        description={selectedActivity?.description}
        uploadDate={selectedActivity?.createdAt ?? selectedActivity?.eventDate}
        location={selectedActivity?.location}
        category={selectedActivity?.category}
        onEdit={() => {
          const a = selectedActivity;
          if (a) {
            setEditData({
              id: a.id,
              title: a.title,
              description: a.description,
              category: a.category,
              eventDate: a.eventDate ? String(a.eventDate).slice(0, 10) : "",
              location: a.location,
              media: (a.media || []).map((m: any, i: number) => ({
                id: m.id,
                type: m.type,
                url: m.url,
                caption: m.caption,
                order: m.order ?? i,
              })),
            });
            setDetailOpen(false);
            setFormOpen(true);
          }
        }}
        onDelete={() => {
          if (selectedActivity) setDeleteId(selectedActivity.id);
        }}
      />

      <ActivityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editData}
      />

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus aktivitas?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={() =>
                deleteId !== null && deleteMutation.mutate(deleteId)
              }
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
