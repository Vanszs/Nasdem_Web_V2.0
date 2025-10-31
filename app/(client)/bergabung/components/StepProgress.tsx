"use client";

import { Check } from "lucide-react";

export function StepProgress({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="mb-10 md:mb-12">
      <div className="relative bg-white rounded-full p-4 shadow-lg">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-8 right-8 h-2 bg-gray-100 rounded-full -z-10 transform -translate-y-1/2">
            <div
              className="h-full bg-gradient-to-r from-[#001B55] to-[#FF9C04] rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              }}
            />
          </div>
          {[...Array(totalSteps)].map((_, idx) => {
            const step = idx + 1;
            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                    step < currentStep
                      ? "bg-[#FF9C04] text-white shadow-xl scale-110 hover:scale-115"
                      : step === currentStep
                      ? "bg-[#001B55] text-white shadow-2xl scale-125 ring-4 ring-[#FF9C04]/20"
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
                  className={`text-sm mt-3 font-semibold transition-all duration-300 ${
                    step === currentStep ? "text-[#001B55]" : "text-gray-500"
                  }`}
                >
                  {step === 1 ? "Data Diri" : step === 2 ? "Alamat" : "Dokumen"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
