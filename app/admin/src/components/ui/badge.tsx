import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 border-2 border-primary/20",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2 border-secondary/20",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 border-2 border-destructive/20",
        outline: "text-foreground border-2 border-gray-200/80 hover:border-gray-300/80",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/80 border-2 border-success/20",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/80 border-2 border-warning/20",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/80 border-2 border-info/20",
        brand: "border-transparent bg-[#FF9C04] text-white hover:bg-[#001B55] border-2 border-[#FF9C04]/20 hover:border-[#001B55]/40 transition-all duration-300",
        brandPrimary: "border-transparent bg-[#001B55] text-white hover:bg-[#001B55]/80 border-2 border-[#001B55]/20 transition-all duration-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
