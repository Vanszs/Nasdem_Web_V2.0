import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface BlueBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  children: React.ReactNode;
}

export const BlueBorderButton = forwardRef<HTMLButtonElement, BlueBorderButtonProps>(
  ({ className, variant = "outline", children, ...props }, ref) => {
    const baseClasses = "bg-white border-2 border-[#001B55]/20 hover:border-[#001B55]/40 text-gray-700 hover:text-[#001B55] hover:bg-[#001B55]/5 text-sm h-9 transition-all duration-300 rounded-lg";
    
    const variantClasses = {
      default: "bg-[#001B55] hover:bg-[#003875] text-white border-[#001B55]",
      outline: baseClasses
    };

    return (
      <Button
        className={cn(variantClasses[variant], className)}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

BlueBorderButton.displayName = "BlueBorderButton";