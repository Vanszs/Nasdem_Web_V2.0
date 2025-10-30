"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

export function NavigationButtons({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting,
  isStepValid,
}: {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isStepValid: boolean;
}) {
  return (
    <div className="flex gap-4 pt-8 mt-8 border-t-2 border-gray-100">
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="flex-1 h-14 rounded-full border-2 border-gray-300 hover:border-[#001B55] hover:bg-[#001B55] hover:text-white font-bold text-base transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Sebelumnya
        </Button>
      )}

      {currentStep < totalSteps ? (
        <Button
          type="button"
          onClick={onNext}
          disabled={!isStepValid}
          className="flex-1 h-14 rounded-full bg-[#001B55] hover:bg-[#002060] disabled:opacity-40 disabled:cursor-not-allowed font-bold text-base transition-all duration-300 hover:shadow-xl"
        >
          Selanjutnya
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 h-14 rounded-full bg-[#FF9C04] hover:bg-[#E08A00] text-white font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Mengirim Data...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <span>Daftar Sekarang</span>
            </div>
          )}
        </Button>
      )}
    </div>
  );
}
