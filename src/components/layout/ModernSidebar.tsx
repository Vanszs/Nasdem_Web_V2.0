"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  ChevronDown,
  Building,
  Layers,
  MapPin,
  TreePine,
  Menu,
  X,
  UserPlus,
  Monitor,
  BarChart3,
  Globe
} from "lucide-react";

import { SafeNavLink } from "./SafeNavLink";
import { Button } from "@/src/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Content",
    icon: Monitor,
    isCollapsible: true,
    subItems: [
      { title: "Berita", url: "/admin/news", icon: FileText },
      { title: "Galeri", url: "/admin/gallery", icon: Image },
      { title: "Landing", url: "/admin/landing", icon: Globe },
    ],
  },
  {
    title: "Struktur",
    icon: Users,
    isCollapsible: true,
    subItems: [
      { title: "DPD", url: "/admin/structure/dpd", icon: Building },
      { title: "Sayap", url: "/admin/structure/sayap", icon: Layers },
      { title: "DPC", url: "/admin/structure/dpc", icon: MapPin },
      { title: "DPRT", url: "/admin/structure/dprt", icon: TreePine },
    ],
  },
  {
    title: "Users",
    url: "/admin/user",
    icon: UserPlus,
  },
  {
    title: "Analytics",
    url: "/admin/statistik-pemilu",
    icon: BarChart3,
  },
];

interface ModernSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function ModernSidebar({ isCollapsed = false, onToggle }: ModernSidebarProps) {
  const [openGroups, setOpenGroups] = useState<string[]>(["Struktur"]);
  const [mounted, setMounted] = useState(false);
  
  const currentPath = usePathname() || "/";

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (subItems?: { url: string }[]) => 
    subItems?.some(item => isActive(item.url));
  
  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-nasdem-blue to-nasdem-blue/95 text-white flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-nasdem-orange rounded-lg flex items-center justify-center text-sm font-bold">
              N
            </div>
            <div>
              <h2 className="font-bold text-lg">NasDem</h2>
              <p className="text-xs text-white/70">Sidoarjo</p>
            </div>
          </div>
          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.isCollapsible ? (
              <div>
                <button
                  onClick={() => toggleGroup(item.title)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-left transition-colors ${
                    isGroupActive(item.subItems)
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-sm font-medium">{item.title}</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${
                      openGroups.includes(item.title) ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {openGroups.includes(item.title) && (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.subItems?.map((subItem) => (
                      <SafeNavLink
                        key={subItem.url}
                        to={subItem.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? "bg-nasdem-orange text-white"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`
                        }
                      >
                        <subItem.icon className="h-4 w-4" />
                        {subItem.title}
                      </SafeNavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : item.url ? (
              <SafeNavLink
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-nasdem-orange text-white"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </SafeNavLink>
            ) : null}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Online</span>
          <span className="ml-auto">v2.1</span>
        </div>
      </div>
    </div>
  );
}
