"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log error to an error reporting service
    // console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-20 bg-[#F9FAFB]">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-[#FF9C04]/10 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-[#FF9C04]" />
            </div>
            <h1 className="text-2xl font-bold text-[#001B55] mb-2">
              Terjadi Kesalahan
            </h1>
            <p className="text-[#6B7280] mb-6">
              Maaf, ada kendala saat memuat halaman ini. Coba muat ulang atau
              kembali ke beranda.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => reset()}
                className="rounded-xl bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6"
              >
                Coba Lagi
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="rounded-xl border border-gray-200 hover:border-[#001B55]/30 hover:bg-[#001B55]/5 text-[#001B55] px-6"
                >
                  Ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
