"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ icon, title, description, action }: PageHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-[#001B55]/10 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#001B55]/20 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-[#001B55] tracking-tight">
              {title}
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              {description}
            </p>
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
