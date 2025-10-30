"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  HandHeart,
  MapPin,
  UserCheck,
} from "lucide-react";
import { MemberRegistration } from "../hooks/useMemberRegistrations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3" />
          Menunggu
        </span>
      );
    case "reviewed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FileText className="w-3 h-3" />
          Ditinjau
        </span>
      );
    case "approved":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Disetujui
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="w-3 h-3" />
          Ditolak
        </span>
      );
    default:
      return null;
  }
}

export function DetailModal({
  open,
  onClose,
  data,
  onUpdateStatus,
  isUpdating,
  getProgramName,
}: {
  open: boolean;
  onClose: () => void;
  data: MemberRegistration | null;
  onUpdateStatus: (
    status: "pending" | "reviewed" | "approved" | "rejected"
  ) => void;
  isUpdating?: boolean;
  getProgramName: (id?: number | null) => string;
}) {
  const [newStatus, setNewStatus] = React.useState<string>("");

  React.useEffect(() => {
    setNewStatus("");
  }, [data]);

  if (!open || !data) return null;

  const formatDateTime = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-[#001B55] to-[#001845] text-white px-6 py-4 flex-shrink-0 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">
                  Biodata Anggota
                </h3>
                <p className="text-sm text-white/70 mt-0.5">{data.fullName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-lg h-9 w-9 p-0 transition-all"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Update */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-200/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-2">
                  Status Saat Ini
                </span>
                <div>{getStatusBadge(data.status)}</div>
              </div>
              <div>
                <Label className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  Ubah Status
                </Label>
                <Select
                  value={newStatus}
                  onValueChange={setNewStatus}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="h-10 rounded-lg border-[#C4D9FF] focus:border-[#C5BAFF] bg-white transition-all">
                    <SelectValue placeholder="Pilih status baru..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="reviewed">Ditinjau</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => newStatus && onUpdateStatus(newStatus as any)}
                  disabled={!newStatus || isUpdating}
                  className="w-full h-10 rounded-lg bg-[#001B55] hover:bg-[#001B55]/90 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
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

            <div className="mt-4 pt-4 border-t border-gray-200/70">
              <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Tanggal Pendaftaran
              </span>
              <div className="text-sm font-bold text-[#001B55] mt-1.5">
                {formatDateTime(data.submittedAt)}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
              <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                Informasi Pribadi
              </h4>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Nama Lengkap" value={data.fullName} />
              <InfoItem label="NIK" value={data.nik} />
              <InfoItem
                label="Tanggal Lahir"
                value={
                  data.dateOfBirth
                    ? new Date(data.dateOfBirth).toLocaleDateString("id-ID")
                    : "-"
                }
              />
              <InfoItem
                label="Jenis Kelamin"
                value={
                  data.gender === "male"
                    ? "Laki-laki"
                    : data.gender === "female"
                    ? "Perempuan"
                    : "-"
                }
              />
              <InfoItem label="Email" value={data.email} />
              <InfoItem label="Telepon" value={data.phone} />
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
              <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                Alamat
              </h4>
            </div>
            <div className="p-5">
              <InfoItem label="Alamat Lengkap" value={data.address} />
            </div>
          </div>

          {/* Work */}
          <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
              <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                Informasi Pekerjaan
              </h4>
            </div>
            <div className="p-5">
              <InfoItem label="Pekerjaan" value={data.occupation} />
            </div>
          </div>

          {/* Beneficiary */}
          {data.isBeneficiary ? (
            <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
                <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                  Informasi Penerima Manfaat
                </h4>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Status Penerima Manfaat" value="Ya" />
                <InfoItem
                  label="Program"
                  value={getProgramName(data.beneficiaryProgramId)}
                />
              </div>
            </div>
          ) : null}

          {/* KTP Photo */}
          <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
              <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                Dokumen KTP
              </h4>
            </div>
            <div className="p-5">
              {data.ktpPhotoUrl ? (
                <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden border border-[#E8F9FF] bg-[#F8FAFC]">
                  <Image
                    src={data.ktpPhotoUrl}
                    alt={`Foto KTP ${data.fullName}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain"
                    priority={false}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Belum ada foto KTP yang diunggah.
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 border-b border-gray-200/70">
              <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
                Catatan & Motivasi
              </h4>
            </div>
            <div className="p-5">
              <InfoItem
                label="Deskripsi Singkat"
                value={data.notes || "Tidak ada catatan tambahan"}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-t from-white via-white to-transparent border-t border-gray-200/70 px-6 py-4 flex-shrink-0">
          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 min-w-[120px] rounded-lg border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
        {label}
      </Label>
      <p className="text-sm font-medium text-gray-700 mt-1.5">{value ?? "-"}</p>
    </div>
  );
}
