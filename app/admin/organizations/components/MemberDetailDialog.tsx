"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building,
  UserCheck,
  AlertTriangle,
  Trophy,
  Clock,
  Mail,
  Phone,
  MapPin,
  Printer,
  CreditCard,
  Calendar,
  Briefcase,
  Heart,
  User,
  X,
} from "lucide-react";
import { Member } from "../types";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  member: Member | null;
  members: Member[];
  departmentConfig: any;
  getDPRTLeader: (region: string, subDepartment: string) => Member | undefined;
  getKaderCount: (region: string, subDepartment: string) => number;
  onRequestEdit?: (member: Member) => void;
}

export function MemberDetailDialog({
  open,
  onOpenChange,
  member,
  members,
  departmentConfig,
  getDPRTLeader,
  getKaderCount,
  onRequestEdit,
}: Props) {
  const router = useRouter();

  // DEBUG: Log when dialog opens to validate assumptions
  React.useEffect(() => {
    if (open && member) {
      console.log("MemberDetailDialog opened:", {
        memberName: member.name,
        department: member.department,
        hasPhoto: !!member.photo,
        hasKtpPhoto: !!member.ktpPhotoUrl,
        hasBenefits: member.benefits && member.benefits.length > 0,
        hasAchievements: member.achievements && member.achievements.length > 0,
      });
    }
  }, [open, member]);

  const handlePrint = () => {
    console.log("PDF generation triggered");
    // Dynamically import only when needed to avoid SSR issues
    import("@react-pdf/renderer").then(async ({ pdf }) => {
      const { default: MemberPDF } = await import("./MemberPDF");
      if (!member) return;
      try {
        const blob = await pdf(
          <MemberPDF member={member} departmentConfig={departmentConfig} />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        const win = window.open(url, "_blank");
        if (!win) {
          // Fallback to download if popup blocked
          const a = document.createElement("a");
          a.href = url;
          a.download = `biodata-${member.name}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
        // Revoke when window closed or after a delay
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } catch (e) {
        console.error("Failed to generate PDF, falling back to print", e);
        window.print();
      }
    });
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-5xl max-h-[90vh] overflow-hidden bg-white border-2 border-[#D8E2F0] shadow-2xl p-0 rounded-2xl transition-all duration-300 ease-in-out"
        showCloseButton={false}
      >
        {/* Accessible title for screen readers */}
        <DialogHeader className="sr-only">
          <DialogTitle>Detail Anggota</DialogTitle>
        </DialogHeader>
        {/* Custom Scrollbar Styles */}
        <style jsx global>{`
          /* Custom scrollbar for the dialog */
          .scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: #c5baff #f0f0f0;
          }

          .scrollbar-thin::-webkit-scrollbar {
            width: 8px;
          }

          .scrollbar-thin::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 4px;
          }

          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #c5baff;
            border-radius: 4px;
            transition: background 0.3s ease;
          }

          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #001b55;
          }
        `}</style>

        {/* Print Styles - Enhanced & Fixed */}
        <style jsx global>{`
          @media print {
            /* Page setup */
            @page {
              size: A4;
              margin: 12mm;
            }

            /* One-page scaling variables */
            :root {
              --page-w: 210mm;
              --page-h: 297mm;
              --print-margin: 12mm;
              --content-w: calc(var(--page-w) - (2 * var(--print-margin)));
              --content-h: calc(var(--page-h) - (2 * var(--print-margin)));
              /* Tweak this scale if still overflowing; lower value = smaller content */
              --print-scale: 0.8;
            }

            /* Reset and base */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            body {
              margin: 0;
              padding: 0;
            }

            /* Hide everything except print area */
            body * {
              visibility: hidden;
            }

            .print-area,
            .print-area * {
              visibility: visible;
            }

            /* Print area should flow naturally for multi-page */
            .print-area {
              position: static !important;
              inset: auto !important;
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
            }

            /* Force content to fit a single page by scaling */
            .print-onepage {
              transform: scale(var(--print-scale));
              transform-origin: top left;
              /* Expand width so that after scaling it matches printable width */
              width: calc(var(--content-w) / var(--print-scale)) !important;
              max-width: none !important;
              /* Height capped to one page; overflow hidden ensures exactly one sheet */
              max-height: calc(
                var(--content-h) / var(--print-scale)
              ) !important;
              overflow: hidden !important;
            }

            /* Hide screen-only elements */
            .no-print,
            .no-print * {
              display: none !important;
              visibility: hidden !important;
            }

            /* Hide optional/verbose sections to keep one page */
            .print-optional {
              display: none !important;
            }

            /* Show print header */
            .print-header {
              display: flex !important;
              visibility: visible !important;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 2px solid #001b55;
            }

            /* Card styles for print */
            .print-card {
              page-break-inside: avoid;
              break-inside: avoid;
              margin-bottom: 6px;
              border: 1px solid #e5e7eb !important;
              border-radius: 6px;
              overflow: hidden;
            }

            /* Compact spacing */
            .print-compact {
              padding: 6px !important;
            }

            /* Typography for print */
            .print-text-sm {
              font-size: 9pt !important;
              line-height: 1.4 !important;
            }

            .print-text-xs {
              font-size: 8pt !important;
              line-height: 1.3 !important;
            }

            /* Headers in print */
            .print-card h3 {
              font-size: 9pt !important;
              font-weight: 600 !important;
              padding: 4px 6px !important;
              margin: 0 !important;
            }

            /* Grid layout for print */
            .print-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 8px !important;
            }

            /* Images for print */
            img {
              max-width: 100% !important;
              height: auto !important;
              page-break-inside: avoid;
            }

            /* Badges */
            .print-badge {
              display: inline-block !important;
              padding: 2px 6px !important;
              border-radius: 4px !important;
              font-size: 8pt !important;
              font-weight: 500 !important;
            }

            /* Avatar for print */
            .print-avatar {
              width: 48px !important;
              height: 48px !important;
              border-radius: 50% !important;
              border: 2px solid #001b55 !important;
            }
          }

          @media screen {
            .print-header {
              display: none;
            }
          }
        `}</style>

        {/* Print Header - Professional Letterhead */}
        <div className="print-header">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-base font-bold text-[#001B55] mb-0">
                DPD PARTAI NASDEM SIDOARJO
              </h1>
              <p className="text-[9pt] text-gray-600 mt-0.5">Biodata Anggota</p>
            </div>
            <div className="text-right">
              <p className="text-[8pt] text-gray-600">
                Dicetak:{" "}
                {new Date().toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Modern Flat Header - Clean & Organized */}
        <div className="no-print bg-gradient-to-r from-white to-[#F8FBFF] border-b-2 border-[#E8F9FF] transition-all duration-300">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              {/* Left Section - Avatar & Member Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Avatar with Ring */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#001B55] to-[#FF9C04] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                  <Avatar className="relative w-16 h-16 ring-2 ring-[#E8F9FF] ring-offset-2 transition-all duration-300 group-hover:ring-[#C5BAFF]">
                    <AvatarImage
                      src={member.photo}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#001B55] to-[#003875] text-white text-lg font-bold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Status Indicator */}
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-all duration-300 ${
                      member.status === "active"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  ></div>
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-[#001B55] mb-1 truncate transition-colors duration-300 hover:text-[#003875]">
                    {member.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    {member.position}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`${
                        departmentConfig[member.department]?.className
                      } border-0 px-3 py-1 text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md`}
                    >
                      {departmentConfig[member.department]?.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`border-0 px-3 py-1 text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md ${
                        member.status === "active"
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Right Section - Action Buttons */}
              <div className="flex items-center gap-3 ml-4">
                {/* Close Button */}
                <button
                  onClick={() => onOpenChange(false)}
                  className="w-10 cursor-pointer h-10 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 flex items-center justify-center transition-all duration-300 group shadow-sm hover:shadow-md"
                  aria-label="Tutup dialog"
                >
                  <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content - Compact */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)] scrollbar-thin print-area">
          <div className="p-6 space-y-5 print-onepage">
            {/* Print Profile Header - Simple */}
            <div className="hidden print:block mb-4 pb-4 border-b border-gray-300">
              <div className="flex items-start gap-4">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="print-avatar"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#001B55] mb-1">
                    {member.name}
                  </h2>
                  <p className="text-sm text-gray-700 mb-2">
                    {member.position}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className="print-badge"
                      style={{ background: "#001B55", color: "white" }}
                    >
                      {departmentConfig[member.department]?.label}
                    </span>
                    <span
                      className="print-badge"
                      style={{
                        background:
                          member.status === "active" ? "#10b981" : "#6b7280",
                        color: "white",
                      }}
                    >
                      {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print-grid">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Data Identitas - Compact */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print-card print-compact shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="bg-gradient-to-r from-[#E8F9FF] to-[#F0F6FF] px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-[#001B55] text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#001B55]" />
                      Data Identitas
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-medium text-gray-500 mb-0.5">
                          NIK
                        </p>
                        <p className="text-xs font-semibold text-[#001B55]">
                          {member.nik || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-gray-500 mb-0.5">
                          No. KTA
                        </p>
                        <p className="text-xs font-semibold text-[#001B55]">
                          {member.ktaNumber || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-[10px] font-medium text-gray-500 mb-0.5">
                        Tanggal Bergabung
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#001B55]" />
                        <p className="text-xs font-medium text-gray-700">
                          {new Date(member.joinDate).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kontak - Compact */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print-card print-compact shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="bg-gradient-to-r from-[#E8F9FF] to-[#F0F6FF] px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-[#001B55] text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#001B55]" />
                      Informasi Kontak
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Mail className="w-3.5 h-3.5 text-[#001B55]" />
                        <p className="text-[10px] font-medium text-gray-500">
                          Email
                        </p>
                      </div>
                      <p className="text-xs font-medium text-gray-700 ml-5">
                        {member.email}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Phone className="w-3.5 h-3.5 text-[#001B55]" />
                        <p className="text-[10px] font-medium text-gray-500">
                          Telepon
                        </p>
                      </div>
                      <p className="text-xs font-medium text-gray-700 ml-5">
                        {member.phone}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#001B55]" />
                        <p className="text-[10px] font-medium text-gray-500">
                          Alamat Lengkap
                        </p>
                      </div>
                      <p className="text-xs font-medium text-gray-700 leading-relaxed ml-5">
                        {member.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Keluarga - Compact */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print-card print-compact shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="bg-gradient-to-r from-[#E8F9FF] to-[#F0F6FF] px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-[#001B55] text-sm flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#001B55]" />
                      Data Keluarga
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-medium text-gray-500 mb-0.5">
                          Status Perkawinan
                        </p>
                        <p className="text-xs font-semibold text-gray-700">
                          {member.maritalStatus || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-gray-500 mb-0.5">
                          Jumlah Keluarga
                        </p>
                        <p className="text-xs font-semibold text-gray-700">
                          {member.familyCount
                            ? `${member.familyCount} orang`
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Biodata & Deskripsi - Compact */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print-card print-compact shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="bg-gradient-to-r from-[#E8F9FF] to-[#F0F6FF] px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-[#001B55] text-sm flex items-center gap-2">
                      <User className="w-4 h-4 text-[#001B55]" />
                      Biodata & Deskripsi
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap print-text-sm">
                      {member.description || "Belum ada deskripsi"}
                    </p>
                  </div>
                </div>

                {/* Program & Bantuan - Compact */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print-card print-compact shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="bg-gradient-to-r from-[#E8F9FF] to-[#F0F6FF] px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-[#001B55] text-sm flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#001B55]" />
                      Program & Bantuan
                    </h3>
                  </div>
                  <div className="p-4">
                    {member.benefits && member.benefits.length > 0 ? (
                      <ul className="space-y-1.5">
                        {member.benefits.map((benefit, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 p-2 bg-[#E8F9FF] rounded-md"
                          >
                            <div className="w-1 h-1 bg-[#001B55] rounded-full mt-1.5 flex-shrink-0" />
                            <span className="text-xs text-gray-700 font-medium print-text-xs">
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic text-center py-2 text-xs">
                        Belum ada data
                      </p>
                    )}
                  </div>
                </div>

                {/* Foto KTP - Enhanced */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print-card print-compact shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="bg-gradient-to-r from-[#E8F9FF] to-[#F0F6FF] px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-[#001B55] text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#001B55]" />
                      Foto KTP
                    </h3>
                  </div>
                  <div className="p-4">
                    {member.ktpPhotoUrl ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                        <img
                          src={member.ktpPhotoUrl}
                          alt="Foto KTP"
                          className="w-full h-auto max-h-48 object-contain bg-gray-50"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <CreditCard className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                          <p className="text-xs text-gray-500 italic">
                            Belum ada foto KTP
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pencapaian - Compact */}
                {member.achievements && member.achievements.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print-card print-compact shadow-sm hover:shadow-md transition-all duration-300 print-optional">
                    <div className="bg-gradient-to-r from-[#E8F9FF] to-[#F0F6FF] px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-[#001B55] text-sm flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-[#001B55]" />
                        Pencapaian & Prestasi
                      </h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-1.5">
                        {member.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 p-2 bg-yellow-50 rounded-md"
                          >
                            <Trophy className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-700 font-medium print-text-xs">
                              {achievement}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Aktivitas Terakhir - Compact */}
                {member.lastActivity && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print-card print-compact shadow-sm hover:shadow-md transition-all duration-300 print-optional">
                    <div className="bg-gradient-to-r from-[#E8F9FF] to-[#F0F6FF] px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-[#001B55] text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#001B55]" />
                        Aktivitas Terakhir
                      </h3>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-700 leading-relaxed print-text-sm">
                        {member.lastActivity}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informasi Organisasi - DPRT Info for Kader */}
            {member.department === "kader" &&
              member.region &&
              member.subDepartment && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-4 print-card print-compact shadow-sm hover:shadow-md transition-all duration-300 print-optional">
                  <div className="bg-gradient-to-r from-[#E8F9FF] to-[#F0F6FF] px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-[#001B55] text-sm flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#001B55]" />
                      Informasi DPRT
                    </h3>
                  </div>
                  <div className="p-4">
                    {(() => {
                      const dprtLeader = getDPRTLeader(
                        member.region!,
                        member.subDepartment!
                      );
                      const totalKaders = getKaderCount(
                        member.region!,
                        member.subDepartment!
                      );
                      return (
                        <div className="space-y-3">
                          {dprtLeader ? (
                            <>
                              <div className="flex items-center gap-3 p-3 bg-[#E8F9FF] rounded-lg">
                                <div className="w-10 h-10 bg-[#001B55] rounded-lg flex items-center justify-center flex-shrink-0">
                                  <UserCheck className="h-5 w-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-gray-500">
                                    Ketua DPRT
                                  </p>
                                  <p className="text-sm text-[#001B55] font-bold truncate">
                                    {dprtLeader.name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Users className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-gray-500">
                                    Total Kader
                                  </p>
                                  <p className="text-sm text-gray-700 font-bold">
                                    {totalKaders} orang
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Desa {member.subDepartment}
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-orange-900 font-bold text-sm truncate">
                                  Belum ada Ketua DPRT
                                </p>
                                <p className="text-xs text-orange-700">
                                  Desa {member.subDepartment} perlu ditugaskan
                                  Ketua DPRT
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

            {/* Kader yang Dibawahi - untuk DPRT */}
            {member.department === "dprt" &&
              member.region &&
              member.subDepartment && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-4 print-card print-compact shadow-sm hover:shadow-md transition-all duration-300 print-optional">
                  <div className="bg-gradient-to-r from-[#E8F9FF] to-[#F0F6FF] px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-[#001B55] text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#001B55]" />
                      Kader Dibawahi
                    </h3>
                  </div>
                  <div className="p-4">
                    {(() => {
                      const kaderCount = members.filter(
                        (m) =>
                          m.department === "kader" &&
                          m.region === member.region &&
                          m.subDepartment === member.subDepartment
                      ).length;
                      return (
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                          <div className="min-w-0 flex-1">
                            <p className="text-amber-900 font-bold text-sm truncate">
                              {kaderCount > 0 ? (
                                <>{kaderCount} kader aktif</>
                              ) : (
                                <>Belum ada kader yang diawasi</>
                              )}
                            </p>
                            <p className="text-xs text-amber-700 mt-0.5 truncate">
                              Desa {member.subDepartment}, Kec. {member.region}
                            </p>
                          </div>
                          <Badge className="bg-amber-500 text-white hover:bg-amber-600 px-3 py-1 text-sm">
                            {kaderCount}
                          </Badge>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Footer Actions - Compact Modern */}
        <div className="no-print bg-gradient-to-r from-white to-[#F8FBFF] flex items-center justify-between px-6 py-4 border-t border-gray-200 transition-all duration-300">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm h-10 px-4 transition-all duration-300 hover:shadow-sm"
          >
            Tutup
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onRequestEdit?.(member)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm h-10 px-4 transition-all duration-300 hover:shadow-sm"
            >
              Edit
            </Button>
            <Button
              onClick={handlePrint}
              className="bg-gradient-to-r from-[#001B55] to-[#003875] hover:from-[#003875] hover:to-[#001B55] text-white rounded-lg shadow-md hover:shadow-lg text-sm h-10 px-4 transition-all duration-300 transform hover:scale-105"
            >
              <Printer className="w-4 h-4 mr-2" />
              Cetak PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
