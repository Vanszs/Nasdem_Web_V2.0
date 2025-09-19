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
  color?: "primary" | "accent" | "success" | "warning" | "info";
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  description, 
  color = "primary",
  className 
}: KPICardProps) {
  const colorClasses = {
    primary: "text-[#001B55] bg-gradient-to-br from-[#001B55]/10 to-[#001B55]/5",
    accent: "text-[#FF9C04] bg-gradient-to-br from-[#FF9C04]/10 to-[#FF9C04]/5", 
    success: "text-[#16A34A] bg-gradient-to-br from-[#16A34A]/10 to-[#16A34A]/5",
    warning: "text-[#F59E0B] bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5",
    info: "text-[#2563EB] bg-gradient-to-br from-[#2563EB]/10 to-[#2563EB]/5",
  };

  const changeColorClasses = {
    increase: "text-[#16A34A] bg-green-50 border-green-200/50",
    decrease: "text-[#C81E1E] bg-red-50 border-red-200/50", 
    neutral: "text-[#6B7280] bg-gray-50 border-gray-200/50",
  };

  const gradientClasses = {
    primary: "from-[#001B55]/10 via-[#001B55]/5 to-transparent",
    accent: "from-[#FF9C04]/10 via-[#FF9C04]/5 to-transparent",
    success: "from-[#16A34A]/10 via-[#16A34A]/5 to-transparent",
    warning: "from-[#F59E0B]/10 via-[#F59E0B]/5 to-transparent",
    info: "from-[#2563EB]/10 via-[#2563EB]/5 to-transparent",
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-[1.01]",
      "shadow-md hover:shadow-lg bg-white backdrop-blur-sm",
      className
    )}>
      {/* Clean Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[color]} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-1 p-4">
        <h3 className="text-xs font-medium text-[#6B7280] group-hover:text-[#001B55] transition-colors duration-300">
          {title}
        </h3>
        <div className={`p-2 rounded-xl border border-current/20 transition-all duration-300 group-hover:scale-105 ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>

      <CardContent className="relative p-4 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-2xl font-bold text-[#001B55] transition-colors duration-300 leading-none mb-1">
              {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
            </div>
            {description && (
              <p className="text-xs text-[#6B7280] group-hover:text-[#001B55] transition-colors duration-300">
                {description}
              </p>
            )}
            
            {/* Clean Progress Indicator */}
            <div className="mt-2 h-0.5 bg-[#F0F0F0] rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${color === 'primary' ? 'from-[#001B55] to-[#FF9C04]' : color === 'accent' ? 'from-[#FF9C04] to-[#001B55]' : 'from-current to-current/70'} rounded-full w-0 group-hover:w-full transition-all duration-500 ease-out`} />
            </div>
          </div>
          
          {change && (
            <div className="ml-3">
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

        {/* Subtle Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#001B55]/5 to-[#FF9C04]/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      </CardContent>
    </Card>
  );
}
