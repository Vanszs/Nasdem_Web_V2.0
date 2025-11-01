"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, UserX } from "lucide-react";
import { DpdStructureDisplay } from "@/components/dpd-structure-display";
import Image from "next/image";

// Fetch DPC data from API
async function fetchDpcData() {
  const res = await fetch("/api/organizations/dpc-ketua");
  if (!res.ok) throw new Error("Failed to fetch DPC data");
  return res.json();
}

// Mock data for development - replace with actual API calls
const mockDpdData = [
  {
    positionTitle: "Ketua DPD - Kabupaten Sidoarjo",
    positionOrder: 1,
    member: {
      id: 1,
      fullName: "Dr. H. Ahmad Budi Santoso, S.H., M.M.",
      photoUrl: "/placeholder-user.jpg",
      phone: "0812-3456-7890",
      email: "ketua@nasdem-sidoarjo.org"
    }
  },
  // Add more mock data as needed
];

export default function StrukturPage() {
  // Fetch DPC data from API
  const { data: dpcData = [], isLoading } = useQuery({
    queryKey: ["dpc-ketua"],
    queryFn: fetchDpcData,
  });

  // Use mock data for DPD for now
  const dpdStructureData = mockDpdData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header - REMOVED duplicate NasdemHeader since it's in layout */}
      <section className="relative bg-gradient-to-br from-[#001B55] via-[#002875] to-[#001845] text-white py-20 md:py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9C04]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF9C04]/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-[#FF9C04] text-white px-6 py-2 text-sm font-bold shadow-lg hover:scale-105 transition-transform">
              ORGANISASI
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Struktur Organisasi
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#FF9C04] to-transparent mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Kepengurusan DPD Partai NasDem Sidoarjo
            </p>
            <p className="text-lg text-white/70 mt-2">
              Periode 2024-2029
            </p>
          </div>
        </div>
      </section>

      {/* Main Structure - DPD */}
      <section className="py-16 bg-gradient-to-b from-[#FFFFFF] to-[#F9FAFB]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DpdStructureDisplay dpdData={dpdStructureData} />
        </div>
      </section>

      {/* DPC Structure - Ketua per Kecamatan */}
      <section className="py-20 bg-gradient-to-b from-[#F0F0F0] to-[#FFFFFF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-[#001B55]/10 shadow-2xl">
            {/* Simple Header - DPD Style */}
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-[#001B55] to-[#003875] text-white px-6 py-2 text-sm font-bold shadow-lg">
                DEWAN PIMPINAN CABANG
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#001B55] mb-4">
                Ketua DPC Per Kecamatan
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#FF9C04] to-transparent mx-auto mb-4"></div>
              <p className="text-lg md:text-xl text-[#6B7280]">
                18 Kecamatan di Kabupaten Sidoarjo
              </p>
            </div>

            {/* DPC Grid - Simple DPD Style with Circle Photos */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-[#FF9C04] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#6B7280] font-medium">Memuat data DPC...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {dpcData.map((dpc: any, index: number) => {
                const hasKetua = !!dpc.ketua;
                
                return (
                  <div
                    key={index}
                    className="group relative transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Card with Border - Fixed height for consistency */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#001B55]/20 hover:border-[#001B55]/40 h-[340px] flex flex-col">
                      {/* Circle Photo Card */}
                      <div className="flex flex-col items-center text-center space-y-3 flex-1">
                        {/* Photo Circle */}
                        <div className={`relative w-32 h-32 rounded-full overflow-hidden shadow-xl transition-all duration-300 group-hover:shadow-2xl border-4 border-[#001B55] flex-shrink-0`}>
                        {hasKetua ? (
                          <Image
                            src={dpc.ketua.photoUrl || "/placeholder-user.jpg"}
                            alt={dpc.ketua.fullName}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <UserX className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Name and Position - Fixed height container */}
                      <div className="space-y-1 flex-1 flex flex-col justify-between min-h-[80px]">
                        <div>
                          <Badge
                            className={`${
                              hasKetua
                                ? "bg-[#FF9C04] text-white"
                                : "bg-gray-400 text-white"
                            } px-3 py-1 text-xs font-bold shadow-md`}
                          >
                            KETUA DPC
                          </Badge>
                          
                          <p className="text-sm font-bold text-[#001B55] group-hover:text-[#FF9C04] transition-colors mt-2">
                            Kecamatan {dpc.kecamatan}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center min-h-[40px]">
                          {hasKetua ? (
                            <p className="text-xs text-[#6B7280] font-medium px-2 leading-tight text-center">
                              {dpc.ketua.fullName}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400 italic px-2 text-center">
                              Belum ditunjuk
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Contact Info (fixed space for consistency) */}
                      <div className="h-[20px] flex items-center justify-center">
                        {hasKetua && dpc.ketua.phone ? (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center justify-center gap-1 text-xs text-[#6B7280]">
                              <Phone className="h-3 w-3" />
                              <span>{dpc.ketua.phone}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-[20px]"></div>
                        )}
                      </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>

          {/* Contact CTA dengan styling modern */}
          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-[#001B55] mb-4">
                Ingin Bergabung?
              </h3>
              <p className="text-lg md:text-xl text-[#6B7280] mb-8 leading-relaxed">
                Hubungi pengurus terdekat di wilayah Anda atau kantor DPD kami untuk informasi lebih lanjut
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#FF9C04] to-[#FF8C00] hover:from-[#001B55] hover:to-[#003875] text-white font-bold px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl"
              >
                <Mail className="mr-3 h-6 w-6" />
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* REMOVED duplicate NasdemFooter since it's in layout */}
    </div>
  );
}
