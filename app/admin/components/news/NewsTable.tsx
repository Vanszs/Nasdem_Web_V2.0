"use client";
import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  MoreHorizontal,
  Pin,
  Edit,
  Copy,
  Archive,
  Trash2,
  Eye,
  Calendar,
  Filter,
  SortAsc,
  FileText,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SafeLink } from "../layout/SafeLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PinConfirmDialog } from "./PinConfirmDialog";
import { News } from "@/lib/types";
import { toast } from "sonner";

// Mock data
const mockNews: News[] = [
  {
    id: "1",
    title: "Program Pembangunan Infrastruktur Sidoarjo 2024",
    slug: "program-pembangunan-infrastruktur-sidoarjo-2024",
    summary:
      "Rencana pembangunan infrastruktur untuk mendukung kemajuan Kabupaten Sidoarjo",
    content: "Lorem ipsum dolor sit amet...",
    coverUrl: "/placeholder-news-1.jpg",
    tags: ["infrastruktur", "pembangunan"],
    status: "PUBLISHED",
    publishedAt: "2024-01-15T10:00:00Z",
    author: "Admin User",
    pinned: true,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Rapat Koordinasi DPD Partai NasDem Januari 2024",
    slug: "rapat-koordinasi-dpd-januari-2024",
    summary: "Koordinasi program kerja dan evaluasi tahun sebelumnya",
    content: "Lorem ipsum dolor sit amet...",
    tags: ["rapat", "koordinasi"],
    status: "PUBLISHED",
    publishedAt: "2024-01-10T14:00:00Z",
    author: "Editor User",
    pinned: false,
    createdAt: "2024-01-10T12:00:00Z",
    updatedAt: "2024-01-10T14:00:00Z",
  },
  {
    id: "3",
    title: "Sosialisasi Program Pendidikan Gratis",
    slug: "sosialisasi-program-pendidikan-gratis",
    summary: "Program bantuan pendidikan untuk masyarakat kurang mampu",
    content: "Lorem ipsum dolor sit amet...",
    tags: ["pendidikan", "sosialisasi"],
    status: "DRAFT",
    author: "Writer User",
    pinned: false,
    createdAt: "2024-01-08T16:00:00Z",
    updatedAt: "2024-01-08T16:00:00Z",
  },
  {
    id: "4",
    title: "Kegiatan Bakti Sosial Ramadan 2024",
    slug: "bakti-sosial-ramadan-2024",
    summary: "Kegiatan berbagi untuk masyarakat kurang mampu",
    content: "Lorem ipsum dolor sit amet...",
    tags: ["bakti sosial", "ramadan"],
    status: "SCHEDULED",
    scheduledAt: "2024-03-15T07:00:00Z",
    author: "Admin User",
    pinned: false,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z",
  },
];

const statusConfig = {
  DRAFT: {
    label: "Draft",
    className:
      "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 font-medium px-5 py-2.5 w-[110px] justify-center rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-sm",
  },
  SCHEDULED: {
    label: "Terjadwal",
    className:
      "bg-[#FF9C04]/10 text-[#FF9C04] border border-[#FF9C04]/20 hover:bg-[#FF9C04]/20 font-medium px-5 py-2.5 w-[110px] justify-center rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-sm",
  },
  PUBLISHED: {
    label: "Published",
    className:
      "bg-[#001B55]/10 text-[#001B55] border border-[#001B55]/20 hover:bg-[#001B55]/20 font-medium px-5 py-2.5 w-[110px] justify-center rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-sm",
  },
  ARCHIVED: {
    label: "Diarsip",
    className:
      "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 font-medium px-5 py-2.5 w-[110px] justify-center rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-sm",
  },
};

export function NewsTable() {
  const [news, setNews] = useState<News[]>(mockNews);
  const [selectedNews, setSelectedNews] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pendingPinNews, setPendingPinNews] = useState<News | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentPinned = news.find((item) => item.pinned);

  const handlePin = (newsItem: News) => {
    if (newsItem.pinned) {
      // Unpin current news
      setNews((prev) =>
        prev.map((item) =>
          item.id === newsItem.id ? { ...item, pinned: false } : item
        )
      );
      toast.success("Pin dicabut", {
        description: `Berita "${newsItem.title}" tidak lagi di-pin.`,
      });
    } else {
      // Check if there's already a pinned news
      if (currentPinned) {
        setPendingPinNews(newsItem);
        setPinDialogOpen(true);
      } else {
        // No current pinned, directly pin this news
        setNews((prev) =>
          prev.map((item) =>
            item.id === newsItem.id ? { ...item, pinned: true } : item
          )
        );
        toast.success("Berita di-pin", {
          description: `"${newsItem.title}" sekarang menjadi berita utama.`,
        });
      }
    }
  };

  const confirmPin = () => {
    if (pendingPinNews) {
      setNews((prev) =>
        prev.map((item) => ({
          ...item,
          pinned: item.id === pendingPinNews.id,
        }))
      );

      toast.success(`Berita dipromosikan sebagai Pinned`, {
        description: `"${pendingPinNews.title}" sekarang menjadi berita utama. Pin sebelumnya telah dilepas.`,
      });

      setPendingPinNews(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedNews(checked ? filteredNews.map((item) => item.id) : []);
  };

  const handleSelectItem = (newsId: string, checked: boolean) => {
    setSelectedNews((prev) =>
      checked ? [...prev, newsId] : prev.filter((id) => id !== newsId)
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Cari berita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SortAsc className="h-4 w-4" />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="SCHEDULED">Terjadwal</SelectItem>
            <SelectItem value="ARCHIVED">Diarsip</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedNews.length === filteredNews.length &&
                    filteredNews.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Judul</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[200px]">Penulis</TableHead>
              <TableHead className="w-[180px]">Tanggal</TableHead>
              <TableHead className="w-12 text-center">Pin</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNews.map((newsItem) => (
              <TableRow key={newsItem.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedNews.includes(newsItem.id)}
                    onCheckedChange={(checked) =>
                      handleSelectItem(newsItem.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="line-clamp-1">{newsItem.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {newsItem.tags.join(", ")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      newsItem.status === "PUBLISHED"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {statusConfig[newsItem.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {newsItem.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{newsItem.author}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(
                    new Date(newsItem.updatedAt),
                    "dd MMM yyyy, HH:mm",
                    {
                      locale: id,
                    }
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {newsItem.pinned && (
                    <Pin className="h-4 w-4 text-blue-500" />
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <SafeLink to={`/admin/news/edit/${newsItem.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </SafeLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePin(newsItem)}>
                        <Pin className="mr-2 h-4 w-4" />
                        {newsItem.pinned ? "Unpin" : "Pin"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
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

      {/* Enhanced Pagination */}
      <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-200/50 px-2">
        <div className="bg-white/60 backdrop-blur-sm px-4 py-2.5 rounded-full border border-gray-200/50 shadow-sm">
          <span className="text-sm font-medium text-[#6B7280]">
            Menampilkan{" "}
            <span className="text-[#001B55] font-semibold">
              {startIndex + 1}-{Math.min(endIndex, filteredNews.length)}
            </span>
            {" "}dari{" "}
            <span className="text-[#001B55] font-semibold">
              {filteredNews.length}
            </span>
            {" "}berita
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-0 bg-white/80 shadow-sm hover:shadow-md hover:bg-[#FF9C04] hover:text-white transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Sebelumnya
          </Button>
          
          <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 shadow-sm">
            <span className="text-sm font-medium text-[#001B55]">
              Halaman {currentPage} dari {totalPages}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-0 bg-white/80 shadow-sm hover:shadow-md hover:bg-[#FF9C04] hover:text-white transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Pin Confirmation Dialog */}
      <PinConfirmDialog
        open={pinDialogOpen}
        onOpenChange={setPinDialogOpen}
        currentPinnedTitle={currentPinned?.title}
        newTitle={pendingPinNews?.title || ""}
        onConfirm={confirmPin}
      />
    </div>
  );
}
