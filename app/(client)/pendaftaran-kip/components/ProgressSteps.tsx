import { Check } from "lucide-react";
import { TOTAL_STEPS, STEP_LABELS } from "../constants";

interface ProgressStepsProps {
  currentStep: number;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="mb-10 md:mb-12">
      <div className="relative bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-8 right-8 h-2 bg-gray-100 rounded-full -z-10 transform -translate-y-1/2">
            <div
              className="h-full bg-gradient-to-r from-[#001B55] to-[#FF9C04] rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%`,
              }}
            ></div>
          </div>

          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                  step < currentStep
                    ? "bg-[#FF9C04] text-white shadow-lg"
                    : step === currentStep
                    ? "bg-[#001B55] text-white shadow-xl scale-110"
                    : "bg-gray-100 border-2 border-gray-200 text-gray-400"
                }`}
              >
                {step < currentStep ? (
                  <Check className="w-6 h-6" strokeWidth={3} />
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-xs sm:text-sm mt-3 font-semibold transition-all duration-300 text-center ${
                  step === currentStep ? "text-[#001B55]" : "text-[#6B7280]"
                }`}
              >
                {STEP_LABELS[step as keyof typeof STEP_LABELS]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
