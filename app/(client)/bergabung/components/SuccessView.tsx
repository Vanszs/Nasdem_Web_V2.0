"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CheckCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export function SuccessView() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-10 animate-fade-in">
            <div className="relative inline-block">
              <div className="w-28 h-28 bg-[#FF9C04] rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle
                  className="w-16 h-16 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <div className="absolute inset-0 bg-[#FF9C04] rounded-full blur-3xl opacity-20 animate-pulse" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-[#001B55]">
                Pendaftaran Berhasil!
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Terima kasih telah bergabung dengan DPD Partai NasDem Sidoarjo.
                Tim kami akan segera menghubungi Anda melalui email atau telepon
                untuk proses verifikasi dan langkah selanjutnya.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card className="border-0 bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-bold text-[#FF9C04] mb-3">
                    3x24
                  </div>
                  <p className="text-base font-bold text-[#001B55]">
                    Jam Kerja
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Waktu Proses Verifikasi
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-[#001B55]" />
                    </div>
                  </div>
                  <p className="text-base font-bold text-[#001B55]">
                    Cek Email
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Konfirmasi Akan Dikirim
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
              <Button
                onClick={() => router.push("/")}
                size="lg"
                className="h-14 px-8 rounded-full bg-[#001B55] hover:bg-[#002060] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-bold"
              >
                Kembali ke Beranda
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-full border-2 border-[#FF9C04] text-[#FF9C04] hover:bg-[#FF9C04] hover:text-white transition-all duration-300 hover:scale-105 font-bold"
              >
                Daftar Lagi
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
