"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { User } from "lucide-react";
import {
  DPD_KETUA_WAKIL,
  DPD_SEKRETARIS_BENDAHARA,
  type DpdPosition,
} from "@/lib/dpd-positions";

interface DpdMember {
  id: number;
  fullName: string;
  photoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface DpdStructureData {
  positionTitle: string;
  positionOrder: number;
  member?: DpdMember | null;
}

interface DpdStructureDisplayProps {
  dpdData: DpdStructureData[];
}

/**
 * Component untuk menampilkan struktur DPD
 * Layout: Ketua → Sekretaris/Bendahara → Wakil Ketua → Wakil Sekretaris/Bendahara
 */
export function DpdStructureDisplay({ dpdData }: DpdStructureDisplayProps) {
  // Create a map for quick lookup
  const dataMap = React.useMemo(() => {
    const map = new Map<string, DpdStructureData>();
    dpdData.forEach((item) => {
      map.set(item.positionTitle, item);
    });
    return map;
  }, [dpdData]);

  // Get Ketua (order 1)
  const ketuaPosition = DPD_KETUA_WAKIL.find((p) => p.order === 1);
  const ketuaData = ketuaPosition ? dataMap.get(ketuaPosition.title) : undefined;

  // Get Sekretaris Utama (order 28)
  const sekretarisUtama = DPD_SEKRETARIS_BENDAHARA.find((p) => p.order === 28);
  const sekretarisUtamaData = sekretarisUtama ? dataMap.get(sekretarisUtama.title) : undefined;

  // Get Bendahara Utama (order 33)
  const bendaharaUtama = DPD_SEKRETARIS_BENDAHARA.find((p) => p.order === 33);
  const bendaharaUtamaData = bendaharaUtama ? dataMap.get(bendaharaUtama.title) : undefined;

  // Get Wakil Ketua (order 2-27)
  const wakilKetuaPositions = DPD_KETUA_WAKIL.filter((p) => p.order >= 2);

  // Get Wakil Sekretaris (order 29-32)
  const wakilSekretarisPositions = DPD_SEKRETARIS_BENDAHARA.filter(
    (p) => p.order >= 29 && p.order <= 32
  );

  // Get Wakil Bendahara (order 34-35)
  const wakilBendaharaPositions = DPD_SEKRETARIS_BENDAHARA.filter((p) => p.order >= 34);

  // Helper to render circle card with photo
  const renderCircleCard = (
    position: DpdPosition,
    data?: DpdStructureData,
    size: "large" | "medium" = "medium",
    variant: "primary" | "secondary" | "default" = "default"
  ) => {
    const member = data?.member;
    const circleSize = size === "large" ? "w-36 h-36 md:w-40 md:h-40" : "w-28 h-28";
    const imageSize = size === "large" ? 160 : 112;
    const iconSize = size === "large" ? "w-16 h-16" : "w-10 h-10";

    // Determine if this is a main position (Ketua, Sekretaris, Bendahara)
    const isMainPosition = variant === "primary" || variant === "secondary";

    return (
      <div
        key={position.order}
        className="flex flex-col items-center text-center transition-all duration-300 hover:scale-105 group"
      >
        {/* Circle Photo */}
        <div
          className={`${circleSize} rounded-full overflow-hidden relative ${
            variant === "primary"
              ? "border-[5px] border-[#001B55] shadow-2xl"
              : variant === "secondary"
              ? "border-4 border-[#001B55] shadow-2xl"
              : "border-4 border-[#001B55] shadow-xl"
          } bg-gradient-to-br from-gray-50 to-gray-100 mb-4 transition-all duration-300`}
        >
          {member?.photoUrl ? (
            <Image
              src={member.photoUrl}
              alt={member.fullName}
              width={imageSize}
              height={imageSize}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <User className={`${iconSize} text-gray-500`} />
            </div>
          )}
          
          {/* Badge untuk Main Positions - REMOVED */}
          {false && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <Badge className="bg-[#FF9C04] text-white font-bold px-3 py-1 shadow-lg">
                #{position.order}
              </Badge>
            </div>
          )}
        </div>

        {/* Position Title */}
        <h4 
          className={`font-bold mb-2 px-3 leading-tight ${
            variant === "primary"
              ? "text-lg md:text-xl text-white"
              : variant === "secondary"
              ? "text-base md:text-lg text-white"
              : "text-sm md:text-base text-[#001B55]"
          }`}
        >
          {position.title}
        </h4>

        {/* Member Name */}
        {member ? (
          <div className="space-y-1">
            <p 
              className={`font-bold ${
                variant === "primary"
                  ? "text-xl md:text-2xl text-[#FF9C04]"
                  : variant === "secondary"
                  ? "text-lg md:text-xl text-[#FF9C04]"
                  : "text-base md:text-lg text-[#001B55]"
              }`}
            >
              {member.fullName}
            </p>
            {member.phone && (
              <p 
                className={`text-xs md:text-sm ${
                  isMainPosition ? "text-white/90" : "text-[#6B7280]"
                }`}
              >
                📞 {member.phone}
              </p>
            )}
            {member.email && (
              <p 
                className={`text-xs ${
                  isMainPosition ? "text-white/80" : "text-[#9CA3AF]"
                }`}
              >
                ✉️ {member.email}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <p 
              className={`text-sm italic ${
                isMainPosition ? "text-white/60" : "text-gray-400"
              }`}
            >
              Belum ada pejabat
            </p>
            <p 
              className={`text-xs ${
                isMainPosition ? "text-white/50" : "text-gray-300"
              }`}
            >
              Sedang dalam proses seleksi
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header dengan gradient modern */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF9C04]/5 to-transparent h-full"></div>
        <div className="relative">
          <Badge className="mb-4 bg-[#FF9C04] text-white px-6 py-2 text-sm font-bold shadow-lg">
            PERIODE 2024-2029
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#001B55] mb-4 tracking-tight">
            DEWAN PIMPINAN DAERAH
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#FF9C04] to-transparent mx-auto mb-4"></div>
          <p className="text-lg md:text-xl text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
            Struktur Kepengurusan DPD Partai NasDem Kabupaten Sidoarjo
          </p>
        </div>
      </div>

      {/* KETUA - Paling Atas dengan Design Premium */}
      {ketuaPosition && (
        <div className="mb-16">
          <div className="relative bg-gradient-to-br from-[#001B55] via-[#002875] to-[#001B55] rounded-3xl p-12 md:p-16 shadow-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9C04]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF9C04]/10 rounded-full blur-3xl"></div>
            
            <div className="relative flex justify-center">
              {renderCircleCard(ketuaPosition, ketuaData, "large", "primary")}
            </div>
          </div>
        </div>
      )}

      {/* SEKRETARIS & BENDAHARA - 2 Kolom Premium */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-[#001B55] mb-2">
            Sekretaris & Bendahara
          </h3>
          <p className="text-[#6B7280]">Pengelola Administrasi dan Bendahara</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sekretaris */}
          {sekretarisUtama && (
            <div className="relative bg-gradient-to-br from-[#001B55] via-[#002875] to-[#001B55] rounded-3xl p-10 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF9C04]/10 rounded-full blur-3xl group-hover:bg-[#FF9C04]/20 transition-all duration-300"></div>
              <div className="relative flex justify-center">
                {renderCircleCard(sekretarisUtama, sekretarisUtamaData, "large", "secondary")}
              </div>
            </div>
          )}

          {/* Bendahara */}
          {bendaharaUtama && (
            <div className="relative bg-gradient-to-br from-[#001B55] via-[#002875] to-[#001B55] rounded-3xl p-10 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF9C04]/10 rounded-full blur-3xl group-hover:bg-[#FF9C04]/20 transition-all duration-300"></div>
              <div className="relative flex justify-center">
                {renderCircleCard(bendaharaUtama, bendaharaUtamaData, "large", "secondary")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WAKIL KETUA BIDANG - Modern Grid */}
      <div className="mb-16">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-[#001B55]/10 shadow-xl p-8 md:p-10 overflow-hidden">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold text-[#001B55] mb-3">
              Wakil Ketua Bidang
            </h3>
            <p className="text-[#6B7280] text-lg">26 Bidang Strategis Partai</p>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#FF9C04] to-transparent mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {wakilKetuaPositions.map((position) => {
              const data = dataMap.get(position.title);
              return (
                <div key={position.order} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#001B55]/20 hover:border-[#001B55]/40 min-h-[280px] flex items-center justify-center">
                  {renderCircleCard(position, data, "medium", "default")}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* WAKIL SEKRETARIS & WAKIL BENDAHARA - Layout Seimbang 3 Kolom */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-[#001B55] mb-2">
            Wakil Sekretaris & Wakil Bendahara
          </h3>
          <p className="text-[#6B7280]">Tim Pendukung Administrasi dan Bendahara</p>
        </div>

        {/* Layout 3 Kolom untuk keseimbangan: 2 Sekretaris kiri, 2 Bendahara tengah, 2 Sekretaris kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri - 2 Wakil Sekretaris Pertama */}
          <div className="bg-gradient-to-br from-white to-[#F0F0F0]/30 rounded-3xl border-2 border-[#001B55]/10 shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-6">
              <Badge className="bg-[#001B55] text-white px-4 py-2 text-sm font-bold">
                WAKIL SEKRETARIS
              </Badge>
            </div>
            <div className="space-y-6">
              {wakilSekretarisPositions.slice(0, 2).map((position) => {
                const data = dataMap.get(position.title);
                return (
                  <div key={position.order} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-[#001B55]/20 min-h-[280px] flex items-center justify-center">
                    {renderCircleCard(position, data, "medium", "default")}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolom Tengah - 2 Wakil Bendahara */}
          <div className="bg-gradient-to-br from-white to-[#FFF9F0]/30 rounded-3xl border-2 border-[#001B55]/10 shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-6">
              <Badge className="bg-[#FF9C04] text-white px-4 py-2 text-sm font-bold">
                WAKIL BENDAHARA
              </Badge>
            </div>
            <div className="space-y-6">
              {wakilBendaharaPositions.map((position) => {
                const data = dataMap.get(position.title);
                return (
                  <div key={position.order} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-[#001B55]/20 min-h-[280px] flex items-center justify-center">
                    {renderCircleCard(position, data, "medium", "default")}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolom Kanan - 2 Wakil Sekretaris Terakhir */}
          <div className="bg-gradient-to-br from-white to-[#F0F0F0]/30 rounded-3xl border-2 border-[#001B55]/10 shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-6">
              <Badge className="bg-[#001B55] text-white px-4 py-2 text-sm font-bold">
                WAKIL SEKRETARIS
              </Badge>
            </div>
            <div className="space-y-6">
              {wakilSekretarisPositions.slice(2).map((position) => {
                const data = dataMap.get(position.title);
                return (
                  <div key={position.order} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-[#001B55]/20 min-h-[280px] flex items-center justify-center">
                    {renderCircleCard(position, data, "medium", "default")}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Info Footer Modern */}
      <div className="relative mt-12 p-6 md:p-8 bg-gradient-to-r from-[#F9FAFB] via-[#F0F0F0] to-[#F9FAFB] border-l-[6px] border-[#001B55] rounded-2xl shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9C04]/5 rounded-full blur-2xl"></div>
        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-[#001B55] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl">ℹ️</span>
          </div>
          <div>
            <p className="text-sm md:text-base text-[#6B7280] leading-relaxed">
              <span className="font-bold text-[#001B55] text-lg">Informasi:</span>
              <br />
              Struktur organisasi ini mencakup <span className="font-bold text-[#FF9C04]">35 posisi strategis</span> di DPD Partai NasDem Sidoarjo.
              Jika ada posisi yang belum terisi, kami sedang dalam proses seleksi yang ketat untuk mengisi posisi tersebut dengan kader terbaik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
