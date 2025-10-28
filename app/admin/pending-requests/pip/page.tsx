"use client";

import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Search,
  Filter,
  Download,
  Users,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  AlertCircle,
  Eye,
  X,
  ThumbsDown,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";

export default function PipPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const queryClient = useQueryClient();

  // Fetch PIP registrations from API
  const { data, isLoading, error } = useQuery({
    queryKey: ["pip-registrations", status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status !== "all") params.append("status", status);
      
      const res = await fetch(`/api/registrations/pip?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal memuat data");
      return res.json();
    },
  });

  const pipApplications = data?.data || [];
  
  // Filter applications based on search
  const filteredApplications = pipApplications.filter((app: any) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      app.fullName?.toLowerCase().includes(searchLower) ||
      app.email?.toLowerCase().includes(searchLower) ||
      app.phone?.includes(search) ||
      app.nik?.includes(search)
    );
  });

  const total = filteredApplications.length;
  const pending = filteredApplications.filter((app: any) => app.status === "pending").length;
  const verified = filteredApplications.filter((app: any) => app.status === "verified").length;
  const rejected = filteredApplications.filter((app: any) => app.status === "rejected").length;
  const accepted = filteredApplications.filter((app: any) => app.status === "accepted").length;

  // Status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: number; newStatus: string }) => {
      const res = await fetch(`/api/registrations/pip/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Gagal update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pip-registrations"] });
      toast.success("Status berhasil diupdate");
      setNewStatus("");
      setShowDetail(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal update status");
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Menunggu
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3" />
            Terverifikasi
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3" />
            Ditolak
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Diterima
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = () => {
    if (!newStatus || !selectedApplication) return;
    updateStatusMutation.mutate({
      id: selectedApplication.id,
      newStatus,
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "verified":
        return "Terverifikasi";
      case "rejected":
        return "Ditolak";
      case "accepted":
        return "Diterima";
      default:
        return status;
    }
  };

  return (
    <AdminLayout breadcrumbs={[{ label: "Pending Request" }, { label: "PIP (Beasiswa)" }]}>
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Total Pendaftar
              </span>
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-primary" />
              </div>
            </div>
            <div className="text-num font-semibold text-text-primary">
              {total}
            </div>
          </div>

          <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Menunggu
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#FF9C04]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FF9C04]" />
              </div>
            </div>
            <div className="text-num font-semibold text-[#FF9C04]">
              {pending}
            </div>
          </div>

          <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Terverifikasi
              </span>
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-num font-semibold text-blue-600">
              {verified}
            </div>
          </div>

          <div className="rounded-xl bg-card shadow-sm p-5 border border-border hover:shadow-md transition-all duration-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary font-medium">
                Ditolak
              </span>
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="text-num font-semibold text-red-600">
              {rejected}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <Card className="rounded-xl border border-[#E8F9FF] shadow-sm">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E8F9FF] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#001B55]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-[#001B55]">
                    Daftar Pendaftar Beasiswa PIP
                  </CardTitle>
                  <CardDescription className="text-sm text-[#475569]">
                    {total} pendaftar beasiswa ditemukan
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nama, email, telepon..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF] transition-all"
                />
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-10 rounded-lg border border-[#C4D9FF] focus:border-[#C5BAFF]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="verified">Terverifikasi</SelectItem>
                  <SelectItem value="accepted">Diterima</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications Table */}
            <div className="rounded-xl bg-card shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C5BAFF #f0f0f0' }}>
                <table className="w-full">
                  <thead className="bg-gray-200 border-b border-border sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Nama Lengkap
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        NIK
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Kontak
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Tanggal Lahir
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Jenis Kelamin
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Pekerjaan
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Jumlah Keluarga
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Pengusul
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Alamat
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Program
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Terdaftar
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-right sticky right-0 bg-gray-200 z-10 whitespace-nowrap">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {isLoading ? (
                      <tr>
                        <td colSpan={13} className="text-center py-8">
                          <div className="w-8 h-8 border-4 border-[#FF9C04]/30 border-t-[#FF9C04] rounded-full animate-spin mx-auto"></div>
                          <p className="text-[#6B7280] mt-2">Memuat data...</p>
                        </td>
                      </tr>
                    ) : filteredApplications.length === 0 ? (
                      <tr>
                        <td
                          colSpan={13}
                          className="text-center py-8 text-text-secondary"
                        >
                          Tidak ada data pendaftar beasiswa PIP
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((application: any, index: number) => (
                        <tr
                          key={application.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#C5BAFF] rounded-full flex-shrink-0" />
                              <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
                                {application.fullName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary font-medium whitespace-nowrap">
                            {application.nik}
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-0.5 text-xs">
                              <div className="flex items-center gap-1.5 text-text-secondary whitespace-nowrap">
                                <Mail className="w-3 h-3" />
                                <span className="truncate max-w-[180px]">{application.email || "-"}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-text-secondary whitespace-nowrap">
                                <Phone className="w-3 h-3" />
                                {application.phone || "-"}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                            {application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }) : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                            {application.gender === "male" ? "Laki-laki" : application.gender === "female" ? "Perempuan" : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                            {application.occupation || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary text-center whitespace-nowrap">
                            {application.familyMemberCount || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                            <span className="font-medium text-text-primary">
                              {application.proposerName || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary max-w-[200px]">
                            <span className="truncate block">{application.fullAddress || "-"}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                            <span className="font-medium text-text-primary">
                              {application.program?.name || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {getStatusBadge(application.status)}
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                            {new Date(application.submittedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3 text-right sticky right-0 bg-card z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.02)]">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowDetail(true);
                              }}
                              className="text-xs h-8 rounded-lg border-border hover:bg-muted hover:border-brand-primary text-brand-primary transition-all"
                            >
                              Detail
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {showDetail && selectedApplication && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Sticky Header */}
              <div className="bg-gradient-to-r from-[#001B55] to-[#001845] text-white px-6 py-4 flex-shrink-0 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        Detail Pendaftar Beasiswa PIP
                      </h3>
                      <p className="text-sm text-white/80">
                        {selectedApplication.fullName}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetail(false)}
                    className="text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Status Update Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-200/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Current Status */}
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-2">
                        Status Saat Ini
                      </span>
                      <div>{getStatusBadge(selectedApplication.status)}</div>
                    </div>

                    {/* Update Status Dropdown */}
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                        Ubah Status
                      </Label>
                      <Select 
                        value={newStatus} 
                        onValueChange={setNewStatus}
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="h-10 rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF] bg-white transition-all">
                          <SelectValue placeholder="Pilih status baru..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-yellow-600" />
                              <span>Menunggu</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="verified">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                              <span>Terverifikasi</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="rejected">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600" />
                              <span>Ditolak</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Update Button */}
                    <div className="flex items-end">
                      <Button
                        onClick={handleStatusUpdate}
                        disabled={!newStatus || isUpdatingStatus}
                        className="w-full h-10 rounded-lg bg-[#001B55] hover:bg-[#001B55]/90 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdatingStatus ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Memperbarui...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Update Status
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Registration Date */}
                  <div className="mt-4 pt-4 border-t border-gray-200/70">
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Tanggal Pendaftaran</span>
                    <div className="text-sm font-bold text-[#001B55] mt-1.5">
                      {formatDate(selectedApplication.submittedAt)}
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
                    <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                      <User className="w-4.5 h-4.5" />
                      Data Pribadi
                    </h4>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Nama Lengkap</Label>
                      <p className="text-sm font-semibold text-gray-900 mt-1.5">{selectedApplication.fullName}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">NIK</Label>
                      <p className="text-sm font-semibold text-gray-900 mt-1.5">{selectedApplication.nik}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Tanggal Lahir</Label>
                      <p className="text-sm font-medium text-gray-700 mt-1.5">
                        {new Date(selectedApplication.dateOfBirth).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Jenis Kelamin</Label>
                      <p className="text-sm font-medium text-gray-700 mt-1.5">
                        {selectedApplication.gender === "male" ? "Laki-laki" : "Perempuan"}
                      </p>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
                    <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                      <Phone className="w-4.5 h-4.5" />
                      Kontak & Alamat
                    </h4>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Email</Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-brand-accent" />
                          {selectedApplication.email}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Telepon</Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-brand-accent" />
                          {selectedApplication.phone}
                        </p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Alamat Lengkap</Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-start gap-2 leading-relaxed">
                          <MapPin className="w-4 h-4 text-brand-accent mt-0.5" />
                          {selectedApplication.fullAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* School Information */}
                <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
                    <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                      <GraduationCap className="w-4.5 h-4.5" />
                      Informasi Tambahan
                    </h4>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Pekerjaan</Label>
                        <p className="text-sm font-semibold text-gray-900 mt-1.5">{selectedApplication.occupation || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Jumlah Anggota Keluarga</Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5">{selectedApplication.familyMemberCount || "-"}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Nama Pengusul</Label>
                        <p className="text-sm font-semibold text-gray-900 mt-1.5">{selectedApplication.proposerName || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Photos */}
                <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
                    <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                      <FileText className="w-4.5 h-4.5" />
                      Dokumen Pendukung
                    </h4>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* KTP Photo */}
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Foto KTP</Label>
                        {selectedApplication.ktpPhotoUrl ? (
                          <div className="relative group">
                            <img
                              src={selectedApplication.ktpPhotoUrl}
                              alt="Foto KTP"
                              className="w-full h-48 object-cover rounded-lg border-2 border-[#C4D9FF]"
                            />
                            <a
                              href={selectedApplication.ktpPhotoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                            >
                              <Eye className="w-8 h-8 text-white" />
                            </a>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <p className="text-gray-400 text-sm">Tidak ada foto</p>
                          </div>
                        )}
                      </div>

                      {/* KK Photo */}
                      <div className="space-y-2">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Foto Kartu Keluarga</Label>
                        {selectedApplication.kkPhotoUrl ? (
                          <div className="relative group">
                            <img
                              src={selectedApplication.kkPhotoUrl}
                              alt="Foto KK"
                              className="w-full h-48 object-cover rounded-lg border-2 border-[#C4D9FF]"
                            />
                            <a
                              href={selectedApplication.kkPhotoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                            >
                              <Eye className="w-8 h-8 text-white" />
                            </a>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <p className="text-gray-400 text-sm">Tidak ada foto</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Program Information */}
                <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
                    <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                      <GraduationCap className="w-4.5 h-4.5" />
                      Program
                    </h4>
                  </div>
                  <div className="p-5">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Nama Program</Label>
                      <p className="text-sm font-semibold text-gray-900 mt-1.5">{selectedApplication.program?.name || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Reviewer Notes */}
                {selectedApplication.reviewerNotes && (
                  <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
                      <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                        <FileText className="w-4.5 h-4.5" />
                        Catatan Reviewer
                      </h4>
                    </div>
                    <div className="p-5">
                      <div className="bg-gradient-to-br from-blue-50/50 to-gray-50/30 p-4 rounded-lg border border-gray-200/50">
                        <p className="text-sm font-medium text-gray-700 leading-relaxed">
                          {selectedApplication.reviewerNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions - Sticky Footer */}
              <div className="bg-gradient-to-t from-white via-white to-transparent border-t border-gray-200/70 px-6 py-4 flex-shrink-0">
                <div className="flex flex-wrap gap-2.5">
                  {selectedApplication.status === "pending" && (
                    <>
                      <Button className="flex-1 min-w-[120px] rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all shadow-sm hover:shadow-md">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verifikasi
                      </Button>
                      <Button variant="outline" className="flex-1 min-w-[120px] rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Tolak
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDetail(false)}
                    className="flex-1 min-w-[120px] rounded-lg border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}