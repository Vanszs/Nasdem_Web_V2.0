"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const EnhancedCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    indeterminate?: boolean;
    variant?: "default" | "table" | "card";
  }
>(({ className, indeterminate, variant = "default", ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const checkboxRef = React.useRef<HTMLButtonElement>(null);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target === checkboxRef.current) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          checkboxRef.current?.click();
        }
      }
    };

    const element = checkboxRef.current;
    element?.addEventListener("keydown", handleKeyDown);
    return () => element?.removeEventListener("keydown", handleKeyDown);
  }, []);

  const variantStyles = {
    default: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20",
    table: "h-4 w-4 rounded border-gray-300 text-[#001B55] focus:ring-2 focus:ring-[#001B55]/20",
    card: "h-5 w-5 rounded-md border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20",
  };

  const animationClasses = cn(
    "transition-all duration-200 ease-in-out",
    isHovered && "scale-110",
    isFocused && "ring-2 ring-offset-2",
    isChecked && "animate-pulse-once"
  );

  return (
    <div className="relative inline-flex items-center">
      <CheckboxPrimitive.Root
        ref={(node) => {
          checkboxRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "peer shrink-0 cursor-pointer",
          variantStyles[variant],
          animationClasses,
          isFocused && "ring-blue-500 ring-offset-2",
          className
        )}
        onCheckedChange={(checked) => {
          setIsChecked(checked === true);
          props.onCheckedChange?.(checked);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn(
            "flex items-center justify-center text-current transition-all duration-200",
            isChecked ? "scale-100 opacity-100" : "scale-75 opacity-0"
          )}
        >
          {indeterminate ? (
            <div className="h-2 w-2 bg-current rounded-sm" />
          ) : (
            <Check className="h-3 w-3" />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      
      {/* Visual feedback ring */}
      {(isFocused || isHovered) && (
        <div 
          className={cn(
            "absolute inset-0 rounded pointer-events-none transition-opacity duration-200",
            variant === "table" 
              ? "border-2 border-[#001B55]/30" 
              : "border-2 border-blue-500/30"
          )}
          style={{
            width: variant === "card" ? "1.5rem" : "1.25rem",
            height: variant === "card" ? "1.5rem" : "1.25rem",
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%",
          }}
        />
      )}
    </div>
  );
});

EnhancedCheckbox.displayName = "Enhanced Checkbox";

export { EnhancedCheckbox };