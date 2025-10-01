"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  UserPlus,
  Monitor,
  BarChart3,
  Globe,
  Network,
  FolderKanban,
} from "lucide-react";

import { SafeNavLink } from "./SafeNavLink";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    badge: "Home",
  },
  {
    title: "CMS",
    icon: Monitor,
    isCollapsible: true,
    badge: "Content",
    subItems: [
      {
        title: "Berita",
        url: "/admin/news",
        icon: FileText,
        description: "Kelola berita dan artikel",
      },
      {
        title: "Galeri",
        url: "/admin/gallery",
        icon: Image,
        description: "Kelola foto dan media",
      },
      {
        title: "Landing Page",
        url: "/admin/landing",
        icon: Globe,
        description: "Kelola halaman utama",
      },
    ],
  },
  {
    title: "Struktur Organisasi",
    icon: Monitor,
    isCollapsible: true,
    badge: "Organization",
    subItems: [
      {
        title: "Organisasi",
        url: "/admin/organizations",
        icon: Network,
        description: "Kelola struktur partai",
      },
      {
        title: "Kelola Struktur",
        url: "/admin/organizations/manage",
        icon: FolderKanban,
        description: "Kelola foto dan media",
      },
    ],
  },
  {
    title: "User",
    url: "/admin/user",
    icon: UserPlus,
    badge: "Management",
  },
  {
    title: "Statistik Pemilu",
    url: "/admin/statistik-pemilu",
    icon: BarChart3,
    badge: "Analytics",
  },
];

interface ModernSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function ModernSidebar({
  isCollapsed = false,
  onToggle,
}: ModernSidebarProps) {
  const currentPath = usePathname() || "/";

  // Automatically determine which groups should be open based on current path
  const getInitialOpenGroups = () => {
    const groups: string[] = [];

    // Check each menu item to see if current path matches any of its subitems
    menuItems.forEach((item) => {
      if (item.isCollapsible && item.subItems) {
        const hasActiveSubItem = item.subItems.some(
          (subItem) =>
            currentPath === subItem.url ||
            currentPath.startsWith(subItem.url + "/")
        );
        if (hasActiveSubItem) {
          groups.push(item.title);
        }
      }
    });

    // Always keep "CMS" open by default if no other groups are active
    if (groups.length === 0) {
      groups.push("CMS");
    }

    return groups;
  };

  const [openGroups, setOpenGroups] = useState<string[]>(
    getInitialOpenGroups()
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Update open groups when path changes
  useEffect(() => {
    const newOpenGroups = getInitialOpenGroups();
    setOpenGroups(newOpenGroups);
  }, [currentPath]);

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (subItems?: { url: string }[]) =>
    subItems?.some((item) => isActive(item.url));

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    );
  };

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    if (sidebarRef.current) {
      sidebarRef.current.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (sidebarRef.current) {
        sidebarRef.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3 px-4 py-3 mx-3 rounded-smooth font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
      isActive
        ? "text-white/85 bg-white/[0.12] text-white scale-[1.01] shadow-lg shadow-white/10"
        : "text-white/85 hover:bg-white/[0.12] hover:text-white hover:scale-[1.01] hover:shadow-lg hover:shadow-white/10"
    }`;

  return (
    <div
      ref={sidebarRef}
      className={`relative h-screen flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCollapsed ? "w-20" : "w-80"
      } backdrop-blur-xl border-r-4 border-white/20 hover:border-white/30 transition-border duration-300 overflow-hidden shadow-2xl`}
      style={{
        background: `
          radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.05) 0%, transparent 50%),
          linear-gradient(135deg, hsl(218, 100%, 17%) 0%, hsl(218, 100%, 17%) 40%, hsl(218, 100%, 15%) 100%)
        `,
      }}
    >
      {/* Header with Glass Effect */}
      <div className="relative p-6 border-b border-white/10">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="relative w-12 h-12 rounded-smooth flex items-center justify-center shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, hsl(33, 100%, 51%) 0%, hsl(38, 95%, 55%) 100%)",
                boxShadow: "0 8px 32px hsla(33, 100%, 51%, 0.4)",
              }}
            >
              <Sparkles className="text-white w-6 h-6 z-10" />
            </div>
            {!isCollapsed && (
              <div className="space-y-1 transition-all duration-500">
                <h2 className="font-bold text-white text-xl tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text">
                  NasDem
                </h2>
                <p className="text-white/70 text-sm font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Kabupaten Sidoarjo
                </p>
              </div>
            )}
          </div>
          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="text-white/80 hover:text-white hover:bg-white/10 h-10 w-10 rounded-smooth transition-all duration-300 hover:scale-110"
            >
              <div className="transition-transform duration-300">
                {isCollapsed ? (
                  <Menu className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
              </div>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation with Enhanced Animations and No Scrollbar */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 pt-1 space-y-2 min-h-0 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
          }
        `}</style>
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <div
              key={item.title}
              className="relative"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {item.isCollapsible ? (
                <div className="relative">
                  <button
                    onClick={() => toggleGroup(item.title)}
                    onMouseEnter={() => setHoveredItem(item.title)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full group relative flex items-center gap-3 px-4 py-3 mx-3 rounded-smooth font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                      isGroupActive(item.subItems)
                        ? "bg-white/[0.12] text-white scale-[1.01] shadow-lg shadow-white/10"
                        : "text-white/85 hover:bg-white/[0.12] hover:text-white hover:scale-[1.01]"
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-3 w-full">
                      <item.icon className="h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
                      {!isCollapsed && (
                        <>
                          <div className="flex-1 flex flex-col items-start">
                            <span className="font-semibold text-sm">
                              {item.title}
                            </span>
                            <span className="text-xs text-white/70 group-hover:text-white/80">
                              {item.badge}
                            </span>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 text-white/70 group-hover:text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              openGroups.includes(item.title)
                                ? "rotate-180"
                                : ""
                            } group-hover:scale-110`}
                          />
                        </>
                      )}
                    </div>

                    {/* Active indicator */}
                    {isGroupActive(item.subItems) && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white/80 rounded-r-full" />
                    )}
                  </button>

                  {!isCollapsed && openGroups.includes(item.title) && (
                    <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                      {item.subItems?.map((subItem, subIndex) => (
                        <SafeNavLink
                          key={subItem.url}
                          to={subItem.url}
                          className={({ isActive }) =>
                            `group relative flex items-center gap-3 px-6 py-3 mx-2 rounded-smooth transition-all duration-300 ${
                              isActive
                                ? "bg-white/[0.12] text-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`
                          }
                        >
                          <div className="w-6 h-[2px] bg-white/60 rounded-full group-hover:bg-white/80 transition-all duration-300" />
                          <subItem.icon className="h-4 w-4 flex-shrink-0 text-white/80 group-hover:text-white transition-all duration-300 group-hover:scale-110" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {subItem.title}
                            </span>
                            <span className="text-xs text-white/60 group-hover:text-white/70">
                              {subItem.description}
                            </span>
                          </div>
                        </SafeNavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <SafeNavLink
                  to={item.url ?? "#"}
                  className={({ isActive }) => getNavClassName({ isActive })}
                >
                  <div className="relative z-10 flex items-center gap-3 w-full">
                    <item.icon className="h-5 w-5 flex-shrink-0 text-white/90 group-hover:text-white transition-all duration-300 group-hover:scale-110" />
                    {!isCollapsed && (
                      <div className="flex-1 flex flex-col items-start">
                        <span className="font-semibold text-sm">
                          {item.title}
                        </span>
                        <span className="text-xs text-white/70 group-hover:text-white/80">
                          {item.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Active indicator */}
                  {isActive(item.url ?? "") && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white/80 rounded-r-full" />
                  )}
                </SafeNavLink>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Glass Overlay with Status - Fixed Position */}
      <div className="relative p-4 border-t border-white/10 flex-shrink-0 mt-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        {!isCollapsed && (
          <div className="relative flex items-center gap-3 text-white/60 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="flex-1">System Online</span>
            <span className="text-white/40">v2.1.0</span>
          </div>
        )}
        {isCollapsed && (
          <div className="relative flex justify-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Tooltip for collapsed state */}
      {isCollapsed && hoveredItem && (
        <div
          className="fixed left-24 bg-gray-900 text-white px-3 py-2 rounded-smooth shadow-xl z-50 pointer-events-none transition-all duration-200"
          style={{
            top: `${mousePos.y - 20}px`,
            opacity: hoveredItem ? 1 : 0,
          }}
        >
          {hoveredItem}
        </div>
      )}
    </div>
  );
}
