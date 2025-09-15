"use client";
import { ReactNode, useState } from "react";
import { ModernSidebar } from "./ModernSidebar";
import { TopNavbar } from "./TopNavbar";

interface AdminLayoutProps {
  children: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminLayout({ children, breadcrumbs }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Start collapsed on mobile

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Modern Sidebar - Always visible on desktop, hideable on mobile */}
      <div className={`fixed top-0 left-0 z-40 h-full transition-transform duration-500 ${
        sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      }`}>
        <ModernSidebar 
          isCollapsed={false} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Overlay for mobile only */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Main Content Area - Responsive margin yang lebih sederhana */}
      <div className="min-h-screen flex flex-col lg:ml-80">
        {/* Top Navigation - Sticky tanpa wrapper */}
        <TopNavbar breadcrumbs={breadcrumbs} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        {/* Main Content with Proper Scrolling */}
        <main className="flex-1 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(var(--color-primary), 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(var(--color-accent), 0.1) 0%, transparent 50%)`
            }} />
          </div>
          
          <div className="relative p-4 md:p-6 min-h-screen bg-gradient-to-br from-white/80 via-gray-50/30 to-white/60 backdrop-blur-sm border border-gray-200/60 rounded-smooth-xl m-2 md:m-4 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
