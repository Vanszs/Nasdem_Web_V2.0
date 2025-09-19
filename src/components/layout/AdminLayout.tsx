"use client";
import { ReactNode, useState } from "react";
import { ModernSidebar } from "./ModernSidebar";
import { TopNavbar } from "./TopNavbar";

interface AdminLayoutProps {
  children: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminLayout({ children, breadcrumbs }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Optimized Sidebar */}
      <div className={`fixed top-0 left-0 z-40 h-full transition-transform duration-300 ease-out ${
        sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      }`}>
        <ModernSidebar 
          isCollapsed={false} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Mobile Overlay - Simplified */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Main Content - Cleaner Layout */}
      <div className="lg:ml-72">
        <TopNavbar 
          breadcrumbs={breadcrumbs} 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
