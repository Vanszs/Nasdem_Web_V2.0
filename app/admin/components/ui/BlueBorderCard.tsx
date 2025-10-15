import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface BlueBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BlueBorderCard = forwardRef<HTMLDivElement, BlueBorderCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-lg border-2 border-[#001B55]/20 hover:border-[#001B55]/40 overflow-hidden transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BlueBorderCard.displayName = "BlueBorderCard";