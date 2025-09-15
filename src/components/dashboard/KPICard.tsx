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
    primary: "text-primary bg-gradient-to-br from-primary/10 to-primary/5",
    accent: "text-accent bg-gradient-to-br from-accent/10 to-accent/5", 
    success: "text-green-600 bg-gradient-to-br from-green/10 to-green/5",
    warning: "text-yellow-600 bg-gradient-to-br from-yellow/10 to-yellow/5",
    info: "text-blue-600 bg-gradient-to-br from-blue/10 to-blue/5",
  };

  const changeColorClasses = {
    increase: "text-green-700 bg-green-50 border-green-200/50",
    decrease: "text-red-700 bg-red-50 border-red-200/50", 
    neutral: "text-muted-foreground bg-gray-50 border-gray-200/50",
  };

  const gradientClasses = {
    primary: "from-primary/10 via-primary/5 to-transparent",
    accent: "from-accent/10 via-accent/5 to-transparent",
    success: "from-green-500/10 via-green-500/5 to-transparent",
    warning: "from-yellow-500/10 via-yellow-500/5 to-transparent",
    info: "from-blue-500/10 via-blue-500/5 to-transparent",
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden border-2 border-gray-200/80 hover:border-gray-300/90 shadow-md hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm",
      className
    )}>
      {/* Enhanced Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[color]} opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />
      
      {/* Enhanced Animated Border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="h-full w-full rounded-xl bg-white/95 backdrop-blur-sm" />
      </div>

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-100/50">
        <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {title}
        </h3>
        <div className={`p-3 rounded-smooth border border-current/20 transition-all duration-500 group-hover:scale-110 ${colorClasses[color]}`}>
          <Icon className="h-5 w-5 transition-transform duration-300" />
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-none mb-2">
              {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors duration-300">
                {description}
              </p>
            )}
            
            {/* Progress Bar Effect */}
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${color === 'primary' ? 'from-primary to-accent' : color === 'accent' ? 'from-accent to-primary' : 'from-current to-current/70'} rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out`} />
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
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200" />
      </CardContent>
    </Card>
  );
}