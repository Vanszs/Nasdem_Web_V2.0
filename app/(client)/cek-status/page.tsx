"use client";

import { useState } from "react";
import { Search, Loader2, CheckCircle, XCircle, Clock, User, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MembershipStatus {
  id: number;
  fullName: string;
  nik: string;
  email: string | null;
  phone: string | null;
  applicationType: string;
  status: string;
  submittedAt: string;
  reviewedAt: string | null;
  notes: string | null;
}

interface PipStatus {
  id: number;
  studentName: string;
  nisn: string | null;
  educationLevel: string;
  status: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewerNotes: string | null;
  program: {
    name: string;
  };
}

interface StatusResponse {
  found: boolean;
  membershipApplications: MembershipStatus[];
  pipRegistrations: PipStatus[];
}

export default function CekStatusPage() {
  const [nik, setNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nik.trim()) {
      setError("Mohon masukkan NIK/NISN");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/check-status?nik=${encodeURIComponent(nik.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Gagal mengecek status pendaftaran");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string; icon: any }> = {
      pending: {
        label: "Menunggu Verifikasi",
        className: "bg-[#FF9C04]/10 text-[#FF9C04] border border-[#FF9C04]/30",
        icon: Clock,
      },
      verified: {
        label: "Terverifikasi",
        className: "bg-[#001B55]/10 text-[#001B55] border border-[#001B55]/30",
        icon: CheckCircle,
      },
      accepted: {
        label: "Diterima",
        className: "bg-green-100 text-green-800 border border-green-300",
        icon: CheckCircle,
      },
      rejected: {
        label: "Ditolak",
        className: "bg-red-100 text-red-800 border border-red-300",
        icon: XCircle,
      },
    };

    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} font-semibold flex items-center gap-1 px-3 py-1`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </Badge>
    );
  };

  const getApplicationTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      member: {
        label: "Keanggotaan Partai",
        className: "bg-[#001B55]/10 text-[#001B55] border border-[#001B55]/20",
      },
      nasdem_muda: {
        label: "NasDem Muda",
        className: "bg-[#FF9C04]/10 text-[#FF9C04] border border-[#FF9C04]/20",
      },
    };

    const config = typeMap[type] || typeMap.member;

    return (
      <Badge className={`${config.className} font-medium`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] to-[#F9FAFB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001B55] to-[#001B55]/90 text-white py-12 shadow-[#FF9C04]/20 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Cek Status Pendaftaran
            </h1>
            <p className="text-lg text-gray-100">
              Masukkan NIK/NISN Anda untuk melihat status pendaftaran keanggotaan atau program bantuan
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-2 border-gray-100 bg-white hover:shadow-[#FF9C04]/10 transition-shadow">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label htmlFor="nik" className="block text-sm font-medium text-[#001B55] mb-2">
                    NIK / NISN
                  </label>
                  <div className="relative">
                    <Input
                      id="nik"
                      type="text"
                      placeholder="Masukkan NIK atau NISN Anda"
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      className="pl-10 h-12 text-base border-gray-200 focus:border-[#FF9C04] focus:ring-[#FF9C04]/20"
                      disabled={loading}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55]/90 text-white shadow-[#FF9C04]/30 hover:shadow-[#001B55]/30 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Cek Status
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {!result.found ? (
              <Card className="border-2 border-dashed border-gray-200 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#F0F0F0] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-[#6B7280]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#001B55] mb-2">
                    Data Tidak Ditemukan
                  </h3>
                  <p className="text-[#6B7280]">
                    Tidak ada pendaftaran yang ditemukan dengan NIK/NISN: <strong className="text-[#001B55]">{nik}</strong>
                  </p>
                  <p className="text-sm text-[#9CA3AF] mt-2">
                    Pastikan NIK/NISN yang Anda masukkan benar, atau silakan hubungi admin jika Anda sudah mendaftar.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Membership Applications */}
                {result.membershipApplications.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#001B55]/10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-[#001B55]" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#001B55]">
                        Pendaftaran Keanggotaan
                      </h2>
                    </div>

                    {result.membershipApplications.map((app) => (
                      <Card key={app.id} className="overflow-hidden border-2 border-gray-100 hover:shadow-[#FF9C04]/20 hover:border-[#FF9C04]/30 transition-all">
                        <CardHeader className="bg-gradient-to-r from-[#FFFFFF] to-[#F0F0F0]/30 border-b border-gray-100">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-xl text-[#001B55] mb-2">
                                {app.fullName}
                              </CardTitle>
                              <div className="flex flex-wrap gap-2">
                                {getApplicationTypeBadge(app.applicationType)}
                                {getStatusBadge(app.status)}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-[#9CA3AF] font-medium">NIK</p>
                              <p className="text-base font-semibold text-[#001B55]">{app.nik}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[#9CA3AF] font-medium">Email</p>
                              <p className="text-base text-[#6B7280]">{app.email || "-"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[#9CA3AF] font-medium">No. Telepon</p>
                              <p className="text-base text-[#6B7280]">{app.phone || "-"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[#9CA3AF] font-medium">Tanggal Daftar</p>
                              <p className="text-base text-[#6B7280]">
                                {new Date(app.submittedAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          {app.reviewedAt && (
                            <div className="pt-4 border-t border-gray-100">
                              <p className="text-sm text-[#9CA3AF] font-medium mb-1">Tanggal Review</p>
                              <p className="text-base text-[#6B7280]">
                                {new Date(app.reviewedAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          )}

                          {app.notes && (
                            <div className="pt-4 border-t border-gray-100">
                              <p className="text-sm text-[#9CA3AF] font-medium mb-1">Catatan</p>
                              <p className="text-base text-[#6B7280]">{app.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* PIP Registrations */}
                {result.pipRegistrations.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FF9C04]/10 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-[#FF9C04]" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#001B55]">
                        Pendaftaran Program PIP
                      </h2>
                    </div>

                    {result.pipRegistrations.map((pip) => (
                      <Card key={pip.id} className="overflow-hidden border-2 border-gray-100 hover:shadow-[#FF9C04]/20 hover:border-[#FF9C04]/30 transition-all">
                        <CardHeader className="bg-gradient-to-r from-[#FFFFFF] to-[#F0F0F0]/30 border-b border-gray-100">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-xl text-[#001B55] mb-2">
                                {pip.studentName}
                              </CardTitle>
                              <div className="flex flex-wrap gap-2">
                                <Badge className="bg-[#FF9C04]/10 text-[#FF9C04] border border-[#FF9C04]/20 font-medium">
                                  {pip.program.name}
                                </Badge>
                                {getStatusBadge(pip.status)}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-[#9CA3AF] font-medium">NISN</p>
                              <p className="text-base font-semibold text-[#001B55]">{pip.nisn || "-"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[#9CA3AF] font-medium">Jenjang Pendidikan</p>
                              <p className="text-base text-[#6B7280] uppercase">{pip.educationLevel}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[#9CA3AF] font-medium">Tanggal Daftar</p>
                              <p className="text-base text-[#6B7280]">
                                {new Date(pip.submittedAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            {pip.reviewedAt && (
                              <div>
                                <p className="text-sm text-[#9CA3AF] font-medium">Tanggal Review</p>
                                <p className="text-base text-[#6B7280]">
                                  {new Date(pip.reviewedAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            )}
                          </div>

                          {pip.reviewerNotes && (
                            <div className="pt-4 border-t border-gray-100">
                              <p className="text-sm text-[#9CA3AF] font-medium mb-1">Catatan</p>
                              <p className="text-base text-[#6B7280]">{pip.reviewerNotes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-[#F0F0F0] to-[#FFFFFF] border-2 border-gray-100 shadow-[#FF9C04]/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#001B55] mb-3">
                Informasi Penting
              </h3>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF9C04] mt-1">•</span>
                  <span>Jika status <strong className="text-[#001B55]">Menunggu Verifikasi</strong>, pendaftaran Anda sedang dalam proses review oleh admin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF9C04] mt-1">•</span>
                  <span>Jika status <strong className="text-[#001B55]">Diterima</strong>, pendaftaran Anda telah disetujui.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF9C04] mt-1">•</span>
                  <span>Jika status <strong className="text-[#001B55]">Ditolak</strong>, silakan hubungi admin untuk informasi lebih lanjut.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF9C04] mt-1">•</span>
                  <span>Data yang ditampilkan adalah data pendaftaran terbaru Anda.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
