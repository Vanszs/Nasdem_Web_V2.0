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
      "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300 font-semibold px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-xs",
    dotColor: "bg-gray-400",
  },
  SCHEDULED: {
    label: "Terjadwal",
    className:
      "bg-gradient-to-r from-[#FF9C04]/10 to-[#FFB04A]/10 text-[#FF9C04] border-2 border-[#FF9C04]/30 hover:border-[#FF9C04]/50 font-semibold px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-xs",
    dotColor: "bg-[#FF9C04]",
  },
  PUBLISHED: {
    label: "Published",
    className:
      "bg-gradient-to-r from-[#001B55]/10 to-[#002266]/10 text-[#001B55] border-2 border-[#001B55]/30 hover:border-[#001B55]/50 font-semibold px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-xs",
    dotColor: "bg-[#001B55]",
  },
  ARCHIVED: {
    label: "Diarsip",
    className:
      "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-2 border-orange-200 hover:border-orange-300 font-semibold px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-xs",
    dotColor: "bg-orange-500",
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
      {/* Filters Section with Modern Design */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Cari berita berdasarkan judul atau penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 rounded-2xl border-2 border-gray-200 focus:border-[#FF9C04] transition-all duration-200 bg-white/50 backdrop-blur-sm"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SortAsc className="h-5 w-5" />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-2xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm hover:border-[#FF9C04] transition-all duration-200">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Filter status" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="SCHEDULED">Terjadwal</SelectItem>
            <SelectItem value="ARCHIVED">Diarsip</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Section with Enhanced Styling */}
      <div className="overflow-hidden rounded-2xl border-2 border-gray-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200 border-b-2 border-gray-300">
              <TableHead className="w-12 pl-6">
                <Checkbox
                  checked={
                    selectedNews.length === filteredNews.length &&
                    filteredNews.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  className="rounded-md border-2"
                />
              </TableHead>
              <TableHead className="font-bold text-[#001B55]">Judul Berita</TableHead>
              <TableHead className="w-[140px] font-bold text-[#001B55]">Status</TableHead>
              <TableHead className="w-[200px] font-bold text-[#001B55]">Penulis</TableHead>
              <TableHead className="w-[180px] font-bold text-[#001B55]">Tanggal</TableHead>
              <TableHead className="w-12 text-center font-bold text-[#001B55]">Pin</TableHead>
              <TableHead className="w-12 pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-500 font-medium">Tidak ada berita ditemukan</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedNews.map((newsItem, index) => (
                <TableRow 
                  key={newsItem.id}
                  className="hover:bg-blue-100 transition-colors duration-200 border-b border-gray-100"
                  style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#eff1f3' }}
                >
                  <TableCell className="pl-6">
                    <Checkbox
                      checked={selectedNews.includes(newsItem.id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(newsItem.id, checked as boolean)
                      }
                      className="rounded-md border-2"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1.5">
                      <span className="line-clamp-2 text-[#001B55] font-semibold leading-snug">
                        {newsItem.title}
                      </span>
                      {newsItem.tags && newsItem.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {newsItem.tags.slice(0, 3).map((tag, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-2 py-0.5 rounded-full bg-[#FF9C04]/10 text-[#FF9C04] font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusConfig[newsItem.status].dotColor} animate-pulse`} />
                      <Badge
                        variant="outline"
                        className={statusConfig[newsItem.status].className}
                      >
                        {statusConfig[newsItem.status].label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 border-2 border-gray-200">
                        <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-[#001B55] to-[#002266] text-white">
                          {newsItem.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700">{newsItem.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {format(
                        new Date(newsItem.updatedAt),
                        "dd MMM yyyy, HH:mm",
                        {
                          locale: id,
                        }
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {newsItem.pinned && (
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                          <Pin className="h-4 w-4 text-[#001B55] fill-[#001B55]" />
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        >
                          <MoreHorizontal className="h-5 w-5 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                        <DropdownMenuLabel className="font-semibold text-[#001B55]">
                          Aksi
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <SafeLink to={`/admin/news/edit/${newsItem.id}`} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Berita
                          </SafeLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <SafeLink to={`/berita/${newsItem.slug}`} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Preview
                          </SafeLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePin(newsItem)} className="cursor-pointer">
                          <Pin className="mr-2 h-4 w-4" />
                          {newsItem.pinned ? "Lepas Pin" : "Pin Berita"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-[#C81E1E] focus:text-[#C81E1E] cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="bg-gradient-to-r from-gray-50 to-white px-5 py-3 rounded-2xl border-2 border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-700">
            Menampilkan{" "}
            <span className="text-[#001B55] font-bold">
              {startIndex + 1}-{Math.min(endIndex, filteredNews.length)}
            </span>
            {" "}dari{" "}
            <span className="text-[#001B55] font-bold">
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
            className="h-11 border-2 border-gray-200 bg-white hover:bg-[#FF9C04] hover:text-white hover:border-[#FF9C04] transition-all duration-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed px-5 font-medium shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Sebelumnya
          </Button>
          
          <div className="bg-gradient-to-r from-[#001B55] to-[#002266] px-5 py-2.5 rounded-xl shadow-md">
            <span className="text-sm font-bold text-white">
              {currentPage} / {totalPages}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-11 border-2 border-gray-200 bg-white hover:bg-[#FF9C04] hover:text-white hover:border-[#FF9C04] transition-all duration-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed px-5 font-medium shadow-sm hover:shadow-md"
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
