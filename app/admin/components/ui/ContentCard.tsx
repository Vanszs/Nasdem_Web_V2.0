"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

export function ContentCard({
  title,
  description,
  icon,
  children,
  className,
  headerClassName,
}: ContentCardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-[#001B55]/10 shadow-sm overflow-hidden", className)}>
      {(title || description) && (
        <div className={cn("p-6 border-b border-[#001B55]/10", headerClassName)}>
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-white border border-[#001B55]/20 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h2 className="text-lg font-bold text-[#001B55]">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-gray-600 mt-0.5">{description}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
