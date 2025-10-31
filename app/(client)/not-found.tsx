import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-20 bg-[#F9FAFB]">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#FF9C04]/10 flex items-center justify-center">
          <SearchX className="w-7 h-7 text-[#FF9C04]" />
        </div>
        <h1 className="text-2xl font-bold text-[#001B55] mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-[#6B7280] mb-6">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link href="/">
          <Button className="rounded-xl bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
