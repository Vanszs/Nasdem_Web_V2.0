"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Target,
  User,
  Wallet,
  TrendingUp,
  Clock,
  MapPin,
  FileText,
  Award,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ProgramDetailDialog({ program }: { program: any }) {
  const target = Number(program.target) || 0;
  const current = Number(program.currentTarget) || 0;
  const budget = Number(program.budget) || 0;
  const percent =
    target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  const start = program.startDate
    ? new Date(program.startDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";
  const end = program.endDate
    ? new Date(program.endDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const createdAt = program.createdAt
    ? new Date(program.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  // Check if this is PIP program
  const isPipProgram =
    (program.category || "").toLowerCase() === "pendidikan" &&
    ((program.name || "").toLowerCase().includes("beasiswa") ||
      (program.name || "").toLowerCase().includes("pip"));

  const statusConfig: Record<
    string,
    { color: string; bgColor: string; label: string }
  > = {
    ongoing: {
      color: "text-green-700",
      bgColor: "bg-green-100",
      label: "Berlangsung",
    },
    completed: {
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      label: "Selesai",
    },
    pending: {
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
      label: "Menunggu",
    },
    planning: {
      color: "text-gray-700",
      bgColor: "bg-gray-100",
      label: "Perencanaan",
    },
  };

  const statusInfo = statusConfig[program.status] || statusConfig.ongoing;

  return (
    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-start justify-between gap-4 mt-8">
          <div className="flex-1">
            <DialogTitle className="text-2xl md:text-3xl text-[#001B55] mb-2 leading-tight">
              {program.name}
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>Kategori: </span>
              <span className="font-semibold text-[#FF9C04] capitalize">
                {program.category || "-"}
              </span>
            </div>
          </div>
          <Badge
            className={`${statusInfo.bgColor} ${statusInfo.color} capitalize font-semibold`}
          >
            {statusInfo.label}
          </Badge>
        </div>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* Program Photo */}
        {program.photoUrl && (
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            <Image
              src={program.photoUrl}
              alt={program.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-[#001B55] mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FF9C04]" />
            Deskripsi Program
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {program.description || "Tidak ada deskripsi tersedia."}
          </p>
        </div>

        {/* Progress & Statistics */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Target Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FF9C04]/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#FF9C04]" />
              </div>
              <div>
                <h4 className="font-bold text-[#001B55]">Target & Capaian</h4>
                <p className="text-xs text-gray-600">Progress realisasi</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Target:</span>
                <span className="font-bold text-[#001B55]">
                  {target.toLocaleString("id-ID")} orang
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Saat ini:</span>
                <span className="font-bold text-[#FF9C04]">
                  {current.toLocaleString("id-ID")} orang
                </span>
              </div>
              <Progress value={percent} className="h-3" />
              <div className="text-center">
                <span className="text-2xl font-bold text-[#001B55]">
                  {percent}%
                </span>
                <span className="text-sm text-gray-600 ml-2">tercapai</span>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#001B55]/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#001B55]" />
              </div>
              <div>
                <h4 className="font-bold text-[#001B55]">Anggaran Program</h4>
                <p className="text-xs text-gray-600">Total dana dialokasikan</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-[#001B55]">
                Rp {budget.toLocaleString("id-ID")}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Dana untuk seluruh kegiatan program
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#001B55] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF9C04]" />
            Timeline Program
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">Tanggal Mulai</span>
              </div>
              <p className="text-base font-bold text-[#001B55]">{start}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">Tanggal Selesai</span>
              </div>
              <p className="text-base font-bold text-[#001B55]">{end}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">Dibuat Pada</span>
              </div>
              <p className="text-base font-bold text-[#001B55]">{createdAt}</p>
            </div>
          </div>
        </div>

        {/* Coordinator Info */}
        <div className="bg-gradient-to-br from-[#001B55]/5 to-[#FF9C04]/5 rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#001B55] mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#FF9C04]" />
            Koordinator Program
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image
                src={program.coordinator?.photoUrl || "/placeholder-user.jpg"}
                alt={program.coordinator?.fullName || "Koordinator"}
                width={64}
                height={64}
                className="object-cover w-16 h-16"
              />
            </div>
            <div>
              <p className="font-bold text-[#001B55] text-lg">
                {program.coordinator?.fullName || "-"}
              </p>
              <p className="text-sm text-gray-600">Penanggung jawab program</p>
            </div>
          </div>
        </div>

        {/* PIP Registration Button */}
        {isPipProgram && (
          <div className="bg-gradient-to-r from-[#FF9C04]/10 to-[#FF9C04]/5 rounded-xl border-2 border-[#FF9C04]/30 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FF9C04] flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#001B55] mb-2">
                  Tertarik Mengikuti Program Ini?
                </h3>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Daftarkan diri Anda sekarang untuk mendapatkan kesempatan
                  menerima beasiswa pendidikan dari DPD Partai NasDem Sidoarjo.
                </p>
                <Link href={`/pendaftaran-pip?programId=${program.id}`}>
                  <Button className="bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}
