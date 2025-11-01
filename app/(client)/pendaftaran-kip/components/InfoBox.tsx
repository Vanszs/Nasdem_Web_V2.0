import { AlertCircle, Check } from "lucide-react";

export function InfoBox() {
  return (
    <div className="mt-10 md:mt-12 bg-white shadow-lg rounded-2xl overflow-hidden border-2 border-[#001B55]/20">
      <div className="bg-gradient-to-r from-[#001B55] to-[#001845] p-6 md:p-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-[#FF9C04]" />
          </div>
          <h3 className="font-bold text-white text-lg md:text-xl">
            Informasi Penting
          </h3>
        </div>
      </div>
      <div className="p-8 md:p-10">
        <ul className="space-y-6">
          <li className="flex items-start gap-4 group">
            <div className="w-10 h-10 rounded-full bg-[#FF9C04] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <span className="text-[#6B7280] pt-2 leading-relaxed">
              Data Anda akan kami proses dalam waktu maksimal{" "}
              <strong className="text-[#001B55]">7x24 jam kerja</strong>
            </span>
          </li>
          <li className="flex items-start gap-4 group">
            <div className="w-10 h-10 rounded-full bg-[#FF9C04] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <span className="text-[#6B7280] pt-2 leading-relaxed">
              Pastikan{" "}
              <strong className="text-[#001B55]">
                nomor telepon
              </strong>{" "}
              yang Anda berikan aktif untuk proses verifikasi
            </span>
          </li>
          <li className="flex items-start gap-4 group">
            <div className="w-10 h-10 rounded-full bg-[#FF9C04] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <span className="text-[#6B7280] pt-2 leading-relaxed">
              Untuk informasi lebih lanjut, hubungi kami di{" "}
              <strong className="text-[#001B55]">
                (031) 1234-5678
              </strong>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
