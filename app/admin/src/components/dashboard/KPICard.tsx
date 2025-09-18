import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease" | "neutral";
    period?: string;
  };
  icon: LucideIcon;
  description?: string;
  color?: "primary" | "accent" | "success" | "warning" | "info" | string;
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  description,
  color = "primary",
  className,
}: KPICardProps) {
  // Map standard colors to hex codes
  const getTextColorClass = () => {
    if (color === "primary") return "text-[#001B55]";
    if (color === "accent") return "text-[#FF9C04]";
    if (color === "success") return "text-[#10B981]";
    if (color === "warning") return "text-[#F59E0B]";
    if (color === "info") return "text-[#3B82F6]";
    if (color.startsWith("#")) return `text-[${color}]`;
    return "text-[#001B55]"; // Default
  };

  const getBgGradientClass = () => {
    if (color === "primary")
      return "from-[#001B55]/10 via-[#001B55]/5 to-transparent";
    if (color === "accent")
      return "from-[#FF9C04]/10 via-[#FF9C04]/5 to-transparent";
    if (color === "success")
      return "from-[#10B981]/10 via-[#10B981]/5 to-transparent";
    if (color === "warning")
      return "from-[#F59E0B]/10 via-[#F59E0B]/5 to-transparent";
    if (color === "info")
      return "from-[#3B82F6]/10 via-[#3B82F6]/5 to-transparent";
    if (color.startsWith("#")) {
      const hex = color.replace("#", "");
      return `from-[${color}]/10 via-[${color}]/5 to-transparent`;
    }
    return "from-[#001B55]/10 via-[#001B55]/5 to-transparent"; // Default
  };

  const getIconBgClass = () => {
    if (color === "primary")
      return "text-[#001B55] bg-gradient-to-br from-[#001B55]/10 to-[#001B55]/5";
    if (color === "accent")
      return "text-[#FF9C04] bg-gradient-to-br from-[#FF9C04]/10 to-[#FF9C04]/5";
    if (color === "success")
      return "text-[#10B981] bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/5";
    if (color === "warning")
      return "text-[#F59E0B] bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5";
    if (color === "info")
      return "text-[#3B82F6] bg-gradient-to-br from-[#3B82F6]/10 to-[#3B82F6]/5";
    if (color.startsWith("#")) {
      return `text-[${color}] bg-gradient-to-br from-[${color}]/10 to-[${color}]/5`;
    }
    return "text-[#001B55] bg-gradient-to-br from-[#001B55]/10 to-[#001B55]/5"; // Default
  };

  const changeColorClasses = {
    increase: "text-[#10B981] bg-[#ECFDF5] border-[#A7F3D0]/50",
    decrease: "text-[#EF4444] bg-[#FEF2F2] border-[#FECACA]/50",
    neutral: "text-[#64748b] bg-[#F8FAFC] border-[#E2E8F0]/50",
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-2 border-gray-200/80 hover:border-gray-300/90 shadow-md hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm",
        className
      )}
    >
      {/* Enhanced Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getBgGradientClass()} opacity-40 group-hover:opacity-70 transition-opacity duration-500`}
      />

      {/* Enhanced Animated Border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#001B55]/30 via-[#FF9C04]/30 to-[#001B55]/30 p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="h-full w-full rounded-xl bg-white/95 backdrop-blur-sm" />
      </div>

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-100/50">
        <h3 className="text-sm font-medium text-[#64748b] group-hover:text-[#334155] transition-colors duration-300">
          {title}
        </h3>
        <div
          className={`p-3 rounded-smooth border border-current/20 transition-all duration-500 group-hover:scale-110 ${getIconBgClass()}`}
        >
          <Icon className="h-5 w-5 transition-transform duration-300" />
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-3xl font-bold text-[#334155] group-hover:text-[#001B55] transition-colors duration-300 leading-none mb-2">
              {typeof value === "number"
                ? value.toLocaleString("id-ID")
                : value}
            </div>
            {description && (
              <p className="text-xs text-[#64748b]/70 group-hover:text-[#64748b] transition-colors duration-300">
                {description}
              </p>
            )}

            {/* Progress Bar Effect */}
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${
                  color === "primary"
                    ? "from-[#001B55] to-[#FF9C04]"
                    : color === "accent"
                    ? "from-[#FF9C04] to-[#001B55]"
                    : color.startsWith("#")
                    ? `from-[${color}] to-[${color}]/70`
                    : "from-current to-current/70"
                } rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out`}
              />
            </div>
          </div>

          {change && (
            <div className="ml-4">
              <Badge
                variant="secondary"
                className={cn(
                  "border text-xs font-semibold shadow-sm transition-all duration-300 group-hover:scale-105",
                  changeColorClasses[change.type]
                )}
              >
                {change.type === "increase" && "+"}
                {change.type === "decrease" && "-"}
                {change.value}
                {change.period && ` ${change.period}`}
              </Badge>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-[#001B55]/5 to-[#FF9C04]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-[#FF9C04]/5 to-[#001B55]/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200" />
      </CardContent>
    </Card>
  );
}
