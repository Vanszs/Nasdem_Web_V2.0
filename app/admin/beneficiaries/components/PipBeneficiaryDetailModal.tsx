"use client";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Phone,
  MapPin,
  Users,
  FileText,
  User,
} from "lucide-react";

interface PipData {
  // Student Info
  studentName: string;
  nisn: string | null;
  birthPlace: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  studentClass: string | null;
  studentPhone: string | null;
  educationLevel: string | null;

  // School Info
  schoolName: string | null;
  npsn: string | null;
  schoolStatus: string | null;
  schoolVillage: string | null;
  schoolDistrict: string | null;
  schoolCity: string | null;
  schoolProvince: string | null;

  // Parent Info
  fatherName: string | null;
  fatherPhone: string | null;
  motherName: string | null;
  motherPhone: string | null;
  parentAddress: string | null;
  parentRtRw: string | null;
  parentVillage: string | null;
  parentDistrict: string | null;
  parentCity: string | null;
  parentProvince: string | null;
  parentZipCode: string | null;

  // Proposer Info
  proposerName: string | null;
  proposerPhone: string | null;
}

interface PipBeneficiaryDetailModalProps {
  pipData: PipData;
  programName: string;
}

export function PipBeneficiaryDetailModal({
  pipData,
  programName,
}: PipBeneficiaryDetailModalProps) {
  const getGenderText = (gender: string | null) => {
    if (gender === "male") return "Laki-laki";
    if (gender === "female") return "Perempuan";
    return "-";
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-5">
      {/* Program Badge */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#E8F9FF] to-[#E8F9FF]/50 rounded-xl p-4 border border-[#C4D9FF]">
        <div>
          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
            Program Bantuan
          </p>
          <p className="text-lg font-bold text-[#001B55]">{programName}</p>
        </div>
      </div>

      {/* 👨‍🎓 Data Siswa */}
      <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 px-5 py-3 border-b border-gray-200/70">
          <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
            <User className="w-4.5 h-4.5" />
            👨‍🎓 Data Siswa
          </h4>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Nama Lengkap
              </Label>
              <p className="text-sm font-semibold text-gray-900 mt-1.5">
                {pipData.studentName || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Jenjang Pendidikan
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5">
                {pipData.educationLevel?.toUpperCase() || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Tempat Lahir
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5">
                {pipData.birthPlace || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Tanggal Lahir
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5">
                {formatDate(pipData.dateOfBirth)}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Jenis Kelamin
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5">
                {getGenderText(pipData.gender)}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                NISN
              </Label>
              <p className="text-sm font-semibold text-gray-900 mt-1.5">
                {pipData.nisn || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Kelas
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5">
                {pipData.studentClass || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Nomor HP/WA Siswa
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF9C04]" />
                {pipData.studentPhone || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🏫 Data Sekolah */}
      <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
        <div className="bg-gradient-to-r from-green-50 to-green-100/50 px-5 py-3 border-b border-gray-200/70">
          <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
            <GraduationCap className="w-4.5 h-4.5" />
            🏫 Data Sekolah
          </h4>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Nama Sekolah
              </Label>
              <p className="text-sm font-semibold text-gray-900 mt-1.5">
                {pipData.schoolName || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                NPSN
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5">
                {pipData.npsn || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Status Sekolah
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5">
                {pipData.schoolStatus ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase">
                    {pipData.schoolStatus}
                  </span>
                ) : (
                  "-"
                )}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Kelurahan/Desa
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5">
                {pipData.schoolVillage || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Kecamatan
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5">
                {pipData.schoolDistrict || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Kabupaten/Kota
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5">
                {pipData.schoolCity || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Provinsi
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5">
                {pipData.schoolProvince || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 👨‍👩‍👧 Data Orang Tua */}
      <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 px-5 py-3 border-b border-gray-200/70">
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
                Nama Ayah
              </Label>
              <p className="text-sm font-semibold text-gray-900 mt-1.5">
                {pipData.fatherName || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Nama Ibu
              </Label>
              <p className="text-sm font-semibold text-gray-900 mt-1.5">
                {pipData.motherName || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Nomor HP Ayah
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF9C04]" />
                {pipData.fatherPhone || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Nomor HP Ibu
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF9C04]" />
                {pipData.motherPhone || "-"}
              </p>
            </div>
          </div>

          {/* Alamat Orang Tua */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#001B55] mt-1 flex-shrink-0" />
              <Label className="text-xs text-gray-600 uppercase tracking-wider font-bold">
                Alamat Lengkap Orang Tua
              </Label>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="font-medium">{pipData.parentAddress || "-"}</p>
              {pipData.parentRtRw && (
                <p className="text-xs">RT/RW: {pipData.parentRtRw}</p>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200">
                <div>
                  <span className="text-gray-500">Desa/Kelurahan:</span>
                  <br />
                  <span className="font-medium">
                    {pipData.parentVillage || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Kecamatan:</span>
                  <br />
                  <span className="font-medium">
                    {pipData.parentDistrict || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Kab/Kota:</span>
                  <br />
                  <span className="font-medium">
                    {pipData.parentCity || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Provinsi:</span>
                  <br />
                  <span className="font-medium">
                    {pipData.parentProvince || "-"}
                  </span>
                </div>
                {pipData.parentZipCode && (
                  <div>
                    <span className="text-gray-500">Kode Pos:</span>
                    <br />
                    <span className="font-medium">{pipData.parentZipCode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📝 Data Pengusul */}
      <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden transition-all hover:border-gray-300">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 px-5 py-3 border-b border-gray-200/70">
          <h4 className="text-base font-bold text-[#001B55] flex items-center gap-2">
            <FileText className="w-4.5 h-4.5" />
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
                {pipData.proposerName || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                Nomor HP Pengusul
              </Label>
              <p className="text-sm font-medium text-gray-700 mt-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF9C04]" />
                {pipData.proposerPhone || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
