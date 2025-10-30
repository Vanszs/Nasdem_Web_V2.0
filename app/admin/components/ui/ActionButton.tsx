"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, icon, variant = "primary", className, ...props }, ref) => {
    const baseStyles =
      "inline-flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-white border border-[#001B55]/30 text-[#001B55] hover:bg-[#001B55]/5 focus:ring-[#001B55]/30",
      secondary:
        "bg-white border border-[#001B55]/20 text-gray-700 hover:bg-gray-50 focus:ring-[#001B55]/20",
      outline:
        "bg-transparent border border-[#001B55]/20 text-gray-700 hover:bg-gray-50 focus:ring-[#001B55]/20",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-[#001B55]/20",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";
