import { User, School, Home, FileText } from "lucide-react";
import { STEP_DESCRIPTIONS } from "../constants";

interface StepTitleCardProps {
  currentStep: number;
}

export function StepTitleCard({ currentStep }: StepTitleCardProps) {
  const getIcon = () => {
    switch (currentStep) {
      case 1:
        return <User className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />;
      case 2:
        return <School className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />;
      case 3:
        return <Home className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />;
      case 4:
        return <FileText className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (currentStep) {
      case 1:
        return "Data Mahasiswa";
      case 2:
        return "Data Universitas";
      case 3:
        return "Data Orang Tua Mahasiswa";
      case 4:
        return "Data Pengusul";
      default:
        return "";
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#001B55] to-[#001845] rounded-2xl p-6 md:p-8 relative overflow-hidden mb-6 shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9C04]/10 rounded-full blur-3xl"></div>
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {getTitle()}
          </h2>
          <p className="text-white/70 text-sm md:text-base">
            {STEP_DESCRIPTIONS[currentStep as keyof typeof STEP_DESCRIPTIONS]}
          </p>
        </div>
      </div>
    </div>
  );
}
