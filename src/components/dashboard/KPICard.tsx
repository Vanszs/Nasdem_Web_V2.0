import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

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
    primary: "text-nasdem-blue bg-gradient-to-br from-blue-50 to-blue-100/50",
    accent: "text-nasdem-orange bg-gradient-to-br from-orange-50 to-orange-100/50", 
    success: "text-green-600 bg-gradient-to-br from-green-50 to-green-100/50",
    warning: "text-yellow-600 bg-gradient-to-br from-yellow-50 to-yellow-100/50",
    info: "text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100/50",
  };

  const changeColorClasses = {
    increase: "text-green-700 bg-green-50 border-green-200",
    decrease: "text-red-700 bg-red-50 border-red-200", 
    neutral: "text-gray-700 bg-gray-50 border-gray-200",
  };

  const gradientClasses = {
    primary: "from-nasdem-blue/5 via-blue-50/30 to-transparent",
    accent: "from-nasdem-orange/5 via-orange-50/30 to-transparent",
    success: "from-green-500/5 via-green-50/30 to-transparent",
    warning: "from-yellow-500/5 via-yellow-50/30 to-transparent",
    info: "from-blue-500/5 via-blue-50/30 to-transparent",
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5",
      className
    )}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
        <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
          {title}
        </h3>
        <div className={cn(
          "p-2.5 rounded-lg transition-all duration-300 group-hover:scale-110 border",
          colorClasses[color]
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>

      <CardContent className="relative pt-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-nasdem-blue transition-colors duration-200">
              {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
            </div>
            {description && (
              <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                {description}
              </p>
            )}
            
            {/* Progress indicator */}
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${color === 'primary' ? 'from-nasdem-blue to-blue-400' : color === 'accent' ? 'from-nasdem-orange to-orange-400' : 'from-current to-current/70'} rounded-full w-0 group-hover:w-3/4 transition-all duration-700 ease-out`} />
            </div>
          </div>
          
          {change && (
            <div className="ml-3">
              <Badge 
                variant="outline"
                className={cn(
                  "text-xs font-medium transition-all duration-200 group-hover:scale-105",
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

        {/* Subtle decorative elements */}
        <div className="absolute -top-1 -right-1 w-12 h-12 bg-gradient-to-br from-white/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </CardContent>
    </Card>
  );
}