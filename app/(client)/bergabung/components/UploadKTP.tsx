"use client";

import { Camera, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RefObject } from "react";

export function UploadKTP({
  ktpPreview,
  onPick,
  onFileChange,
  onRemove,
  inputRef,
}: {
  ktpPreview: string;
  onPick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (e?: React.MouseEvent) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
        <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
          <Camera className="w-3.5 h-3.5 text-[#001B55]" />
        </div>
        Upload Foto KTP (Opsional)
      </Label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      {!ktpPreview ? (
        <div
          onClick={onPick}
          className="border-3 border-dashed border-gray-300 rounded-2xl p-10 md:p-12 text-center hover:border-[#FF9C04] hover:bg-[#FF9C04]/5 transition-all duration-300 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-[#FF9C04]/10 flex items-center justify-center mx-auto mb-5 transition-all duration-300">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#FF9C04] transition-colors" />
          </div>
          <p className="text-base font-bold text-[#001B55] mb-2">
            Klik atau drag untuk upload foto KTP
          </p>
          <p className="text-sm text-gray-500">
            Format: PNG, JPG, JPEG • Maksimal: 5MB
          </p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
          <img
            src={ktpPreview}
            alt="Preview KTP"
            className="w-full h-56 md:h-64 object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-4 right-4 bg-[#C81E1E] text-white p-3 rounded-full hover:bg-[#A01818] transition-all duration-300 shadow-xl"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white text-sm font-medium">
              ✓ Foto KTP berhasil diupload
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
