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
  BookOpen,
  Search,
  Filter,
  Download,
  Users,
  CheckCircle,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function KipPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const queryClient = useQueryClient();

  // Fetch KIP registrations from API
  const { data, isLoading, error } = useQuery({
    queryKey: ["kip-registrations", status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status !== "all") params.append("status", status);

      const res = await fetch(`/api/registrations/kip?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal memuat data");
      return res.json();
    },
  });

  const kipApplications = data?.data || [];

  // Filter applications based on search
  const filteredApplications = kipApplications.filter((app: any) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    
    return (
      app.studentName?.toLowerCase().includes(searchLower) ||
      app.nisn?.toLowerCase().includes(searchLower) ||
      app.nim?.toLowerCase().includes(searchLower) ||
      app.universityName?.toLowerCase().includes(searchLower) ||
      app.proposerName?.toLowerCase().includes(searchLower) ||
      app.homeAddress?.toLowerCase().includes(searchLower)
    );
  });

  const total = filteredApplications.length;
  const pending = filteredApplications.filter(
    (app: any) => app.status === "pending"
  ).length;
  const rejected = filteredApplications.filter(
    (app: any) => app.status === "rejected"
  ).length;
  const accepted = filteredApplications.filter(
    (app: any) => app.status === "accepted"
  ).length;

  // Status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      newStatus,
    }: {
      id: number;
      newStatus: string;
    }) => {
      const res = await fetch(`/api/registrations/kip/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Gagal update status");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["kip-registrations"] });
      
      if (data.data?.status === "accepted") {
        toast.success("Pendaftar Diterima!", {
          description: "Data berhasil ditambahkan ke penerima manfaat",
        });
      } else if (data.data?.status === "rejected") {
        toast.error("Pendaftar Ditolak", {
          description: "Pendaftaran telah ditolak",
        });
      } else {
        toast.success("Status berhasil diupdate");
      }
      
      setNewStatus("");
      setIsUpdatingStatus(false);
      setShowDetail(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal update status");
      setIsUpdatingStatus(false);
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF9C04]/10 text-[#FF9C04] border border-[#FF9C04]/30">
            <Clock className="w-3 h-3" />
            Menunggu
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
    setIsUpdatingStatus(true);
    updateStatusMutation.mutate({
      id: selectedApplication.id,
      newStatus,
    });
  };

  return (
    <AdminLayout
      breadcrumbs={[{ label: "Pending Request" }, { label: "KIP (Kuliah)" }]}
    >
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-[#FF9C04]/10 transition-all duration-200 flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280] font-medium">
                Total Pendaftar
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#001B55]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#001B55]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#001B55]">
              {total}
            </div>
          </div>

          <div className="rounded-xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-[#FF9C04]/10 transition-all duration-200 flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280] font-medium">
                Menunggu
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#FF9C04]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FF9C04]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#FF9C04]">
              {pending}
            </div>
          </div>

          <div className="rounded-xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-[#FF9C04]/10 transition-all duration-200 flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280] font-medium">
                Ditolak
              </span>
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {rejected}
            </div>
          </div>

          <div className="rounded-xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-[#FF9C04]/10 transition-all duration-200 flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280] font-medium">
                Diterima
              </span>
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {accepted}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <Card className="rounded-xl border-2 border-gray-100 bg-white shadow-sm hover:shadow-[#FF9C04]/10 transition-all">
          <CardHeader className="bg-gradient-to-r from-[#FFFFFF] to-[#F0F0F0]/30 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#001B55]/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#001B55]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-[#001B55]">
                    Daftar Pendaftar Beasiswa KIP Kuliah
                  </CardTitle>
                  <CardDescription className="text-sm text-[#6B7280]">
                    {total} pendaftar beasiswa ditemukan
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2 border-gray-200 hover:border-[#FF9C04] hover:text-[#FF9C04] transition-all">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nama mahasiswa, NISN, NIM, universitas, pengusul..."
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
                  <SelectItem value="accepted">Diterima</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications Table */}
            <div className="rounded-xl bg-white border-2 border-gray-100 shadow-sm hover:shadow-[#FF9C04]/10 transition-all overflow-hidden">
              <div
                className="overflow-x-auto"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#FF9C04 #f0f0f0",
                }}
              >
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#F0F0F0] to-[#E5E7EB] border-b border-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Nama Mahasiswa
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        NIK
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        NISN
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        NIM
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Universitas
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Program Studi
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Angkatan
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Kontak
                      </th>
                      <th className="px-4 py-3 text-sm font-bold text-[#001B55] text-left whitespace-nowrap">
                        Pengusul
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
                  <tbody className="divide-y divide-gray-100">
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
                          className="text-center py-8 text-[#9CA3AF]"
                        >
                          Tidak ada data pendaftar beasiswa KIP Kuliah
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map(
                        (application: any) => (
                          <tr
                            key={application.id}
                            className="hover:bg-[#F0F0F0]/50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#001B55] rounded-full flex-shrink-0" />
                                <span className="text-sm font-semibold text-[#001B55] whitespace-nowrap">
                                  {application.studentName || "-"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#6B7280] font-medium whitespace-nowrap">
                              {application.nik || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#6B7280] font-medium whitespace-nowrap">
                              {application.nisn || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#6B7280] font-medium whitespace-nowrap">
                              {application.nim || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#6B7280] font-medium max-w-[200px]">
                              <span className="truncate block">
                                {application.universityName || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#6B7280] max-w-[180px]">
                              <span className="truncate block">
                                {application.studyProgram || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#6B7280] whitespace-nowrap">
                              {application.yearLevel || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5 text-xs text-[#6B7280] whitespace-nowrap">
                                <Phone className="w-3 h-3 text-[#FF9C04]" />
                                {application.phoneNumber || "-"}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#6B7280] font-medium whitespace-nowrap">
                              {application.proposerName || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#6B7280] whitespace-nowrap">
                              <span className="font-medium text-[#001B55]">
                                {application.program?.name || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {getStatusBadge(application.status)}
                            </td>
                            <td className="px-4 py-3 text-sm text-[#6B7280] whitespace-nowrap">
                              {new Date(
                                application.submittedAt
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-4 py-3 text-right sticky right-0 bg-white z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.02)]">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setShowDetail(true);
                                }}
                                className="text-xs h-8 rounded-lg border-gray-200 hover:border-[#FF9C04] hover:text-[#FF9C04] transition-all"
                              >
                                Detail
                              </Button>
                            </td>
                          </tr>
                        )
                      )
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
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        Detail Pendaftar Beasiswa KIP Kuliah
                      </h3>
                      <p className="text-sm text-white/80">
                        {selectedApplication.studentName}
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
                <div className="bg-gradient-to-br from-[#F0F0F0] to-[#FFFFFF]/50 rounded-xl p-5 border-2 border-gray-100 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Current Status */}
                    <div>
                      <span className="text-xs text-[#9CA3AF] uppercase tracking-wide font-semibold block mb-2">
                        Status Saat Ini
                      </span>
                      <div>{getStatusBadge(selectedApplication.status)}</div>
                    </div>

                    {/* Update Status Dropdown */}
                    <div>
                      <Label className="text-xs text-[#9CA3AF] uppercase tracking-wide font-semibold mb-2">
                        Ubah Status
                      </Label>
                      <Select
                        value={newStatus}
                        onValueChange={setNewStatus}
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="h-10 rounded-lg border-gray-200 focus:border-[#FF9C04] focus:ring-[#FF9C04]/20 bg-white transition-all">
                          <SelectValue placeholder="Pilih status baru..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#FF9C04]" />
                              <span>Menunggu</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="accepted">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Diterima</span>
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
                        className="w-full h-10 rounded-lg bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55]/90 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[#FF9C04]/30"
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
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                      Tanggal Pendaftaran
                    </span>
                    <div className="text-sm font-bold text-[#001B55] mt-1.5">
                      {formatDate(selectedApplication.submittedAt)}
                    </div>
                  </div>
                </div>

                {/* 📚 Data Mahasiswa */}
                <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-[#FF9C04]/10 transition-all overflow-hidden">
                  <div className="bg-gradient-to-r from-[#001B55]/5 to-[#001B55]/10 px-5 py-3 border-b border-gray-100">
                    <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                      <GraduationCap className="w-4.5 h-4.5" />
                      📚 Data Mahasiswa
                    </h4>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Nama Mahasiswa
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 mt-1.5">
                          {selectedApplication.studentName || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          NIK
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 mt-1.5">
                          {selectedApplication.nik || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Tempat Lahir
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5">
                          {selectedApplication.birthPlace || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Tanggal Lahir
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5">
                          {selectedApplication.dateOfBirth
                            ? new Date(
                                selectedApplication.dateOfBirth
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Jenis Kelamin
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5">
                          {selectedApplication.gender === "male"
                            ? "Laki-laki"
                            : selectedApplication.gender === "female"
                            ? "Perempuan"
                            : "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          NISN
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 mt-1.5">
                          {selectedApplication.nisn || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          NIM
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 mt-1.5">
                          {selectedApplication.nim || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Nomor HP/WA
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#FF9C04]" />
                          {selectedApplication.phoneNumber || "-"}
                        </p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Alamat Rumah
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-start gap-2 leading-relaxed">
                          <MapPin className="w-4 h-4 text-[#FF9C04] mt-0.5" />
                          {selectedApplication.homeAddress || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🏫 Data Universitas */}
                <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-[#FF9C04]/10 transition-all overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FF9C04]/5 to-[#FF9C04]/10 px-5 py-3 border-b border-gray-100">
                    <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                      <Building2 className="w-4.5 h-4.5" />
                      🏫 Data Universitas
                    </h4>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Nama Universitas
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 mt-1.5">
                          {selectedApplication.universityName || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          NPSN
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5">
                          {selectedApplication.npsn || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Status Perguruan Tinggi
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5">
                          {selectedApplication.universityStatus ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase">
                              {selectedApplication.universityStatus}
                            </span>
                          ) : "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Program Studi
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5">
                          {selectedApplication.studyProgram || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Tahun Angkatan
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5">
                          {selectedApplication.yearLevel || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 👨‍👩‍👧 Data Orang Tua */}
                <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-[#FF9C04]/10 transition-all overflow-hidden">
                  <div className="bg-gradient-to-r from-[#001B55]/5 to-[#001B55]/10 px-5 py-3 border-b border-gray-100">
                    <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                      <Users className="w-4.5 h-4.5" />
                      👨‍👩‍👧 Data Orang Tua Siswa
                    </h4>
                  </div>
                  <div className="p-5 space-y-5">
                    {/* Data Ayah & Ibu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Nama Ayah/Wali
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 mt-1.5">
                          {selectedApplication.fatherName || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Nama Ibu
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 mt-1.5">
                          {selectedApplication.motherName || "-"}
                        </p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Nomor HP/WA Orang Tua
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#FF9C04]" />
                          {selectedApplication.parentPhone || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Alamat Lengkap */}
                    <div className="border-t border-gray-200 pt-4">
                      <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-3 block">
                        <MapPin className="w-3.5 h-3.5 inline mr-1" />
                        Alamat Orang Tua
                      </Label>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 p-4 rounded-lg border border-gray-200/50">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {selectedApplication.parentAddress || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 📝 Data Pengusul */}
                <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-[#FF9C04]/10 transition-all overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FF9C04]/5 to-[#FF9C04]/10 px-5 py-3 border-b border-gray-100">
                    <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                      <User className="w-4.5 h-4.5" />
                      📝 Data Pengusul
                    </h4>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Nama Pengusul
                        </Label>
                        <p className="text-sm font-semibold text-gray-900 mt-1.5">
                          {selectedApplication.proposerName || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Status Pengusul
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5">
                          {selectedApplication.proposerStatus ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 uppercase">
                              {selectedApplication.proposerStatus === "korcam" ? "KORCAM" :
                               selectedApplication.proposerStatus === "korkel" ? "KORKEL" :
                               selectedApplication.proposerStatus === "kordes" ? "KORDES" :
                               selectedApplication.proposerStatus === "kortps" ? "KORTPS" :
                               selectedApplication.proposerStatus === "partai" ? "PARTAI" :
                               selectedApplication.proposerStatus === "relawan" ? "RELAWAN" :
                               selectedApplication.proposerStatusOther || "Lainnya"}
                            </span>
                          ) : "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Nomor HP/WA Pengusul
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#FF9C04]" />
                          {selectedApplication.proposerPhone || "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Hubungan Anak yang Diusulkan
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5">
                          {selectedApplication.proposerRelation ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                              {selectedApplication.proposerRelation === "anak" ? "Anak" :
                               selectedApplication.proposerRelation === "saudara" ? "Saudara" :
                               selectedApplication.proposerRelation === "kerabat" ? "Kerabat" :
                               selectedApplication.proposerRelation === "tetangga" ? "Tetangga" :
                               selectedApplication.proposerRelationOther || "Lainnya"}
                            </span>
                          ) : "-"}
                        </p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                          Alamat Pengusul
                        </Label>
                        <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-start gap-2 leading-relaxed">
                          <MapPin className="w-4 h-4 text-[#FF9C04] mt-0.5" />
                          {selectedApplication.proposerAddress || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Program Information */}
                <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-[#FF9C04]/10 transition-all overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-100">
                    <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                      <BookOpen className="w-4.5 h-4.5" />
                      Program
                    </h4>
                  </div>
                  <div className="p-5">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                        Nama Program
                      </Label>
                      <p className="text-sm font-semibold text-gray-900 mt-1.5">
                        {selectedApplication.program?.name || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reviewer Notes */}
                {selectedApplication.reviewerNotes && (
                  <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm hover:shadow-[#FF9C04]/10 transition-all overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-100">
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
                      <Button
                        onClick={() => {
                          setNewStatus("accepted");
                          handleStatusUpdate();
                        }}
                        disabled={isUpdatingStatus || updateStatusMutation.isPending}
                        className="flex-1 min-w-[120px] rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isUpdatingStatus ? "Memproses..." : "Terima"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewStatus("rejected");
                          handleStatusUpdate();
                        }}
                        disabled={isUpdatingStatus || updateStatusMutation.isPending}
                        className="flex-1 min-w-[120px] rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50"
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {isUpdatingStatus ? "Memproses..." : "Tolak"}
                      </Button>
                    </>
                  )}
                  {selectedApplication.status === "rejected" && (
                    <div className="w-full text-center py-2">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Pendaftaran ini telah ditolak
                      </span>
                    </div>
                  )}
                  {selectedApplication.status === "accepted" && (
                    <div className="w-full text-center py-2">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Pendaftaran ini telah diterima dan ditambahkan ke penerima manfaat
                      </span>
                    </div>
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
