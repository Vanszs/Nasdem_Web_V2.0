"use client";

import { User, MapPin, FileText } from "lucide-react";

export function StepTitleCard({ currentStep }: { currentStep: number }) {
  return (
    <div className="bg-[#001B55] rounded-3xl p-6 md:p-8 relative overflow-hidden mb-6 shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9C04]/10 rounded-full blur-3xl" />
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          {currentStep === 1 && (
            <User className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />
          )}
          {currentStep === 2 && (
            <MapPin className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />
          )}
          {currentStep === 3 && (
            <FileText className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />
          )}
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {currentStep === 1 && "Informasi Pribadi"}
            {currentStep === 2 && "Informasi Kontak"}
            {currentStep === 3 && "Dokumen & Program"}
          </h2>
          <p className="text-white/70 text-sm md:text-base">
            {currentStep === 1 && "Lengkapi data pribadi Anda dengan benar"}
            {currentStep === 2 && "Berikan informasi alamat dan pekerjaan"}
            {currentStep === 3 && "Upload dokumen dan pilih program (opsional)"}
          </p>
        </div>
      </div>
    </div>
  );
}
