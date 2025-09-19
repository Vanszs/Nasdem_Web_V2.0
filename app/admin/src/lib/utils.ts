import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Clean UI design tokens for consistent styling
export const designTokens = {
  colors: {
    primary: "#001B55",
    secondary: "#FF9C04", 
    success: "#10B981",
    neutral: {
      50: "#F8FAFC",
      100: "#F1F5F9", 
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    }
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem", 
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem", 
    xl: "1.5rem",
  }
};

// Subtle animation utilities for smooth UX
export const animations = {
  fadeIn: "animate-in fade-in duration-300",
  slideUp: "animate-in slide-in-from-bottom-4 duration-300", 
  slideDown: "animate-in slide-in-from-top-4 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-200",
  hover: "transition-all duration-200 ease-in-out",
};
