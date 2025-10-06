"use client";
import { ReactNode, useState } from "react";
import { ModernSidebar } from "./ModernSidebar";
import { TopNavbar } from "./TopNavbar";

interface AdminLayoutProps {
  children: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminLayout({ children, breadcrumbs }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Modern Sidebar */}
      <div className={`fixed top-0 left-0 z-30 h-full transition-all duration-500 lg:translate-x-0 ${
        sidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <ModernSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}
      
      {/* Main Content Area */}
      <div className={`min-h-screen flex flex-col transition-all duration-500 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
      }`}>
        {/* Top Navigation */}
        <TopNavbar breadcrumbs={breadcrumbs} onToggleSidebar={() => setSidebarMobileOpen(!sidebarMobileOpen)} />
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
        className="fixed bottom-6 right-6 z-40 lg:hidden w-14 h-14 bg-[#001B55] hover:bg-[#FF9C04] text-white rounded-2xl shadow-2xl hover:shadow-[#FF9C04]/50 transition-all duration-300 flex items-center justify-center group"
        aria-label="Toggle Menu"
      >
        <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
