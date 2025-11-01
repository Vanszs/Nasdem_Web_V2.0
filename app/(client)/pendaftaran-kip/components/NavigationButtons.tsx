import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { TOTAL_STEPS } from "../constants";

interface NavigationButtonsProps {
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting: boolean;
}

export function NavigationButtons({
  currentStep,
  onPrevious,
  onNext,
  isSubmitting,
}: NavigationButtonsProps) {
  return (
    <div className="flex gap-4 pt-8 mt-8 border-t-2 border-gray-100">
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex-1 h-14 rounded-xl text-[#6B7280] hover:bg-[#001B55]/5 hover:text-[#001B55] border border-gray-200 hover:border-[#001B55]/20 font-semibold text-base transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Sebelumnya
        </Button>
      )}

      {currentStep < TOTAL_STEPS ? (
        <Button
          type="button"
          onClick={onNext}
          className="flex-1 h-14 rounded-xl bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Selanjutnya
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-14 rounded-xl bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
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
