"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  Calendar,
  Clock,
  ImageIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  useNewsList,
  NewsListItem,
  NewsStatusFilter,
  useDeleteNews,
  useUpdateNewsStatus,
} from "@/app/admin/news/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const statusConfig = {
  DRAFT: {
    label: "Draft",
    className:
      "inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-300 font-medium px-3 py-1 rounded-md text-xs",
  },
  SCHEDULED: {
    label: "Terjadwal",
    className:
      "inline-flex items-center gap-1.5 bg-[#FF9C04]/10 text-[#FF9C04] border border-[#FF9C04]/30 font-medium px-3 py-1 rounded-md text-xs",
  },
  PUBLISHED: {
    label: "Published",
    className:
      "inline-flex items-center gap-1.5 bg-[#34D399]/10 text-[#059669] border border-[#34D399]/30 font-medium px-3 py-1 rounded-md text-xs",
  },
  ARCHIVED: {
    label: "Diarsip",
    className:
      "inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-300 font-medium px-3 py-1 rounded-md text-xs",
  },
} as const;

type StatusKey = keyof typeof statusConfig;

const STATUS_OPTIONS: { label: string; value: NewsStatusFilter }[] = [
  { label: "Semua status", value: "all" },
  { label: statusConfig.DRAFT.label, value: "draft" },
  { label: statusConfig.SCHEDULED.label, value: "scheduled" },
  { label: statusConfig.PUBLISHED.label, value: "published" },
  { label: statusConfig.ARCHIVED.label, value: "archived" },
];

function deriveStatus(news: NewsListItem): StatusKey {
  if (news.deletedAt) return "ARCHIVED";
  if (!news.publishDate) return "DRAFT";

  const publishDate = new Date(news.publishDate);
  if (publishDate.getTime() > Date.now()) {
    return "SCHEDULED";
  }

  return "PUBLISHED";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Belum ditentukan";
  try {
    return format(new Date(value), "d MMMM yyyy HH:mm", { locale: id });
  } catch (error) {
    return value;
  }
}

export function NewsTable() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<NewsStatusFilter>("all");

  // Schedule dialog state
  const [scheduleDialog, setScheduleDialog] = useState<{
    open: boolean;
    newsId: number;
    newsTitle: string;
    date: string;
    time: string;
  }>({
    open: false,
    newsId: 0,
    newsTitle: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: format(new Date(), "HH:mm"),
  });

  const router = useRouter();
  const deleteMutation = useDeleteNews();
  const updateStatusMutation = useUpdateNewsStatus();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const query = useNewsList({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter,
  });

  const items = query.data?.data ?? [];
  const meta = query.data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const totalItems = meta?.total ?? 0;

  const tableRows = useMemo(() => {
    return items.map((item) => {
      const status = deriveStatus(item);
      const badge = statusConfig[status];
      const author = item.user?.username || item.user?.email || "Tidak ada";
      return {
        id: item.id,
        title: item.title,
        status,
        badge,
        author,
        publishDate: formatDate(item.publishDate),
        createdAt: formatDate(item.createdAt),
        thumbnailUrl: item.thumbnailUrl,
      };
    });
  }, [items]);

  const isEmpty = !query.isLoading && tableRows.length === 0;

  const handleEdit = (id: number) => {
    router.push(`/admin/news/${id}/edit`);
  };

  const handleDelete = (id: number, title: string) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus berita "${title}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Berita dihapus", {
          description: `"${title}" telah dihapus dari daftar berita.`,
        });
      },
      onError: (err) => {
        toast.error("Gagal menghapus", {
          description: (err as Error).message,
        });
      },
    });
  };

  const handleStatusChange = (
    id: number,
    title: string,
    targetStatus: "draft" | "published" | "scheduled"
  ) => {
    if (targetStatus === "scheduled") {
      // Open dialog instead of prompt
      setScheduleDialog({
        open: true,
        newsId: id,
        newsTitle: title,
        date: format(new Date(), "yyyy-MM-dd"),
        time: format(new Date(), "HH:mm"),
      });
      return;
    }

    const publishDate =
      targetStatus === "draft" ? null : new Date().toISOString();

    updateStatusMutation.mutate(
      { id, publishDate },
      {
        onSuccess: () => {
          const label =
            targetStatus === "draft" ? "status draft" : "status publikasi";
          toast.success("Status diperbarui", {
            description: `"${title}" berhasil diubah menjadi ${label}.`,
          });
        },
        onError: (err) => {
          toast.error("Gagal mengubah status", {
            description: (err as Error).message,
          });
        },
      }
    );
  };

  const handleScheduleSubmit = () => {
    const { newsId, newsTitle, date, time } = scheduleDialog;

    if (!date || !time) {
      toast.error("Tanggal dan waktu harus diisi");
      return;
    }

    const dateTimeString = `${date}T${time}`;
    const scheduleDate = new Date(dateTimeString);

    if (Number.isNaN(scheduleDate.getTime())) {
      toast.error("Format tanggal atau waktu tidak valid");
      return;
    }

    if (scheduleDate.getTime() <= Date.now()) {
      toast.error("Tanggal publikasi harus di masa depan");
      return;
    }

    updateStatusMutation.mutate(
      { id: newsId, publishDate: scheduleDate.toISOString() },
      {
        onSuccess: () => {
          toast.success("Status diperbarui", {
            description: `"${newsTitle}" akan terbit pada ${formatDate(
              scheduleDate.toISOString()
            )}.`,
          });
          setScheduleDialog({ ...scheduleDialog, open: false });
        },
        onError: (err) => {
          toast.error("Gagal mengubah status", {
            description: (err as Error).message,
          });
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Filter dan cari berita yang telah dipublikasikan.
          </span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Cari judul atau penulis..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full sm:w-64"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as NewsStatusFilter)
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[12%]">Sampul</TableHead>
                <TableHead className="w-[32%]">Judul Berita</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Tanggal Publikasi</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right sticky right-0 bg-muted/30 z-10 min-w-[100px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm">
                    Memuat data berita...
                  </TableCell>
                </TableRow>
              )}

              {query.isError && !query.isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-red-600"
                  >
                    {(query.error as Error)?.message ||
                      "Terjadi kesalahan memuat data"}
                  </TableCell>
                </TableRow>
              )}

              {isEmpty && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Tidak ada berita yang cocok dengan filter.
                  </TableCell>
                </TableRow>
              )}

              {!query.isLoading &&
                !query.isError &&
                tableRows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/40">
                    <TableCell>
                      {row.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.thumbnailUrl}
                          alt={row.title}
                          className="h-16 w-24 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="h-16 w-24 rounded-lg border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center gap-1 shadow-sm">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-[10px] font-medium text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-sm text-foreground">
                          {row.title}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={row.badge.className}>
                        {row.badge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{row.author}</TableCell>
                    <TableCell className="text-sm">{row.publishDate}</TableCell>
                    <TableCell className="text-sm">{row.createdAt}</TableCell>
                    <TableCell className="text-right sticky right-0 bg-white z-10 min-w-[100px] shadow-[ -5px 0 5px -5px rgba(0,0,0,0.1)]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu aksi</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              handleEdit(row.id);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              handleStatusChange(
                                row.id,
                                row.title,
                                "published"
                              );
                            }}
                            disabled={updateStatusMutation.isPending}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Publikasikan Sekarang
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              handleStatusChange(row.id, row.title, "draft");
                            }}
                            disabled={updateStatusMutation.isPending}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Tandai sebagai Draft
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              handleStatusChange(
                                row.id,
                                row.title,
                                "scheduled"
                              );
                            }}
                            disabled={updateStatusMutation.isPending}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Jadwalkan
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(row.id, row.title);
                            }}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-muted-foreground">
          Menampilkan {tableRows.length} dari {totalItems} berita.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || query.isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= totalPages || query.isLoading}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog
        open={scheduleDialog.open}
        onOpenChange={(open) => setScheduleDialog({ ...scheduleDialog, open })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#FF9C04]" />
              Jadwalkan Publikasi
            </DialogTitle>
            <DialogDescription>
              Atur tanggal dan waktu publikasi untuk "{scheduleDialog.newsTitle}
              "
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="schedule-date"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Calendar className="h-4 w-4" />
                Tanggal Publikasi
              </Label>
              <Input
                id="schedule-date"
                type="date"
                value={scheduleDialog.date}
                onChange={(e) =>
                  setScheduleDialog({ ...scheduleDialog, date: e.target.value })
                }
                min={format(new Date(), "yyyy-MM-dd")}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="schedule-time"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Clock className="h-4 w-4" />
                Waktu Publikasi
              </Label>
              <Input
                id="schedule-time"
                type="time"
                value={scheduleDialog.time}
                onChange={(e) =>
                  setScheduleDialog({ ...scheduleDialog, time: e.target.value })
                }
                className="w-full"
              />
            </div>

            <div className="rounded-lg bg-[#FF9C04]/10 border border-[#FF9C04]/20 p-3">
              <p className="text-sm text-[#001B55]">
                <span className="font-semibold">Preview:</span> Berita akan
                dipublikasikan pada{" "}
                {scheduleDialog.date && scheduleDialog.time
                  ? format(
                      new Date(`${scheduleDialog.date}T${scheduleDialog.time}`),
                      "d MMMM yyyy 'pukul' HH:mm",
                      { locale: id }
                    )
                  : "—"}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setScheduleDialog({ ...scheduleDialog, open: false })
              }
              disabled={updateStatusMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleScheduleSubmit}
              disabled={updateStatusMutation.isPending}
              className="bg-[#FF9C04] hover:bg-[#FF9C04]/90 text-white"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Menjadwalkan...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Jadwalkan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
