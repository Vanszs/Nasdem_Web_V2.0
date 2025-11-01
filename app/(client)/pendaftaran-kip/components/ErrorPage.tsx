import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";

export function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <NasdemHeader />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-10">
            {/* Error Icon */}
            <div className="relative inline-block">
              <div className="w-28 h-28 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <AlertCircle
                  className="w-16 h-16 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <div className="absolute inset-0 bg-red-500 rounded-full blur-3xl opacity-20"></div>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-[#001B55]">
                Program Tidak Ditemukan
              </h1>
              <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
                Silakan akses halaman pendaftaran ini melalui tombol "Daftar
                Sekarang" pada detail program yang tersedia di halaman
                Program.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                onClick={() => router.push("/program")}
                size="lg"
                className="bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-4 font-semibold"
              >
                Lihat Daftar Program
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                size="lg"
                className="text-[#6B7280] hover:bg-[#001B55]/5 hover:text-[#001B55] border border-transparent hover:border-[#001B55]/20 transition-all duration-300 rounded-xl px-8 py-4"
              >
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        </div>
      </main>
      <NasdemFooter />
    </div>
  );
}
