import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-10 animate-fade-in">
            {/* Success Icon */}
            <div className="relative inline-block">
              <div className="w-28 h-28 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle
                  className="w-16 h-16 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <div className="absolute inset-0 bg-[#FF9C04] rounded-full blur-3xl opacity-20 animate-pulse"></div>
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-[#001B55]">
                Pendaftaran Berhasil!
              </h1>
              <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
                Terima kasih telah mendaftar Program Beasiswa KIP Kuliah DPD Partai
                NasDem Sidoarjo. Tim kami akan segera menghubungi Anda melalui
                telepon untuk proses verifikasi dan langkah selanjutnya.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
              <Button
                onClick={() => router.push("/")}
                size="lg"
                className="bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-4 font-semibold"
              >
                Kembali ke Beranda
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="lg"
                className="text-[#6B7280] hover:bg-[#001B55]/5 hover:text-[#001B55] border border-transparent hover:border-[#001B55]/20 transition-all duration-300 rounded-xl px-8 py-4"
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
