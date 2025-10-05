"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Plus,
  BarChart3,
  ChevronRight,
  ChevronDown,
  Monitor,
  Globe,
  Network,
  FolderKanban,
  UserPlus,
  Sparkles,
} from "lucide-react";

import { SafeNavLink } from "./SafeNavLink";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    ariaLabel: "Dashboard utama",
  },
  {
    title: "CMS",
    icon: Monitor,
    isCollapsible: true,
    ariaLabel: "Menu Content Management System",
    subItems: [
      {
        title: "Berita",
        url: "/admin/news",
        icon: FileText,
        ariaLabel: "Kelola berita",
      },
      {
        title: "Galeri",
        url: "/admin/gallery",
        icon: Image,
        ariaLabel: "Kelola galeri foto dan video",
      },
      {
        title: "Landing Page",
        url: "/admin/landing",
        icon: Globe,
        ariaLabel: "Edit halaman landing",
      },
    ],
  },
  {
    title: "Struktur Organisasi",
    icon: Network,
    isCollapsible: true,
    ariaLabel: "Menu struktur organisasi",
    subItems: [
      {
        title: "Organisasi",
        url: "/admin/organizations",
        icon: Network,
        ariaLabel: "Kelola data organisasi",
      },
      {
        title: "Kelola Struktur",
        url: "/admin/organizations/manage",
        icon: FolderKanban,
        ariaLabel: "Kelola struktur organisasi",
      },
    ],
  },
  {
    title: "User",
    url: "/admin/user",
    icon: UserPlus,
    ariaLabel: "Kelola pengguna",
  },
  {
    title: "Statistik Pemilu",
    url: "/admin/statistik-pemilu",
    icon: BarChart3,
    ariaLabel: "Lihat statistik dan data pemilu",
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
  const sidebarRef = useRef<HTMLElement>(null);

  // Automatically determine which groups should be open based on current path
  const getInitialOpenGroups = () => {
    const groups: string[] = [];

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

    if (groups.length === 0 && menuItems[1]?.isCollapsible) {
      groups.push(menuItems[1].title);
    }

    return groups;
  };

  const [openGroups, setOpenGroups] = useState<string[]>(
    getInitialOpenGroups()
  );

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

  // Keyboard navigation handler
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    const focusableElements = sidebarRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );

    if (!focusableElements) return;

    const currentIndex = Array.from(focusableElements).indexOf(
      document.activeElement as HTMLElement
    );

    if (key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      focusableElements[nextIndex]?.focus();
    } else if (key === "ArrowUp") {
      event.preventDefault();
      const prevIndex =
        (currentIndex - 1 + focusableElements.length) %
        focusableElements.length;
      focusableElements[prevIndex]?.focus();
    }
  };

  return (
    <nav
      ref={sidebarRef}
      aria-label="Navigasi utama admin"
      onKeyDown={handleKeyDown}
      className={`relative h-screen flex flex-col transition-all duration-500 ease-in-out ${
        isCollapsed ? "w-20" : "w-80"
      }`}
      style={{
        background:
          "linear-gradient(135deg, rgba(0, 27, 85, 0.95) 0%, rgba(0, 27, 85, 0.98) 100%)",
        boxShadow:
          "0px 48px 48px -24px rgba(0, 27, 85, 0.4), 0px 0px 80px -20px rgba(255, 156, 4, 0.2)",
        backdropFilter: "blur(60px)",
        borderTopRightRadius: "24px",
        borderBottomRightRadius: "24px",
      }}
    >
      {/* Header with Logo */}
      <div className="relative p-6 border-b border-white/10">
        <div
          className={`flex items-center gap-4 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div
            className={`flex items-center gap-4 ${isCollapsed ? "flex-col" : ""}`}
          >
            <div
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, #FF9C04 0%, #FFB04A 100%)",
                boxShadow: "0 8px 32px rgba(255, 156, 4, 0.4)",
              }}
              role="img"
              aria-label="Logo NasDem Sidoarjo"
            >
              <Sparkles className="text-white w-6 h-6 z-10" />
            </div>
            {!isCollapsed && (
              <div className="space-y-1">
                <h2
                  className="font-bold text-white text-xl tracking-tight"
                  style={{
                    textShadow: "0px 0px 12px rgba(255, 255, 255, 0.8)",
                  }}
                >
                  NasDem
                </h2>
                <p className="text-white/70 text-xs font-medium flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 bg-[#53C22B] rounded-full animate-pulse"
                    role="status"
                    aria-label="Status online"
                  ></span>
                  Kabupaten Sidoarjo
                </p>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          {!isCollapsed && (
            <button
              onClick={onToggle}
              className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
              aria-label="Tutup sidebar"
              aria-expanded={!isCollapsed}
            >
              <ChevronRight className="w-4 h-4 text-white/60 rotate-180" />
            </button>
          )}
        </div>
      </div>

      {/* Line Separator */}
      <div
        className="mx-0 my-0"
        style={{
          height: "1px",
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255, 156, 4, 0.3) 0%, rgba(255, 156, 4, 0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Main Navigation */}
      <div
        className={`py-4 flex-1 overflow-y-auto space-y-1 scrollbar-hide transition-all duration-500 ${
          isCollapsed ? "px-2" : "px-4"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        role="list"
      >
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none !important;
            width: 0px !important;
            height: 0px !important;
          }
          .scrollbar-hide {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `}</style>

        {/* Main Menu Title */}
        {!isCollapsed && (
          <div className="px-3 py-2 flex items-center">
            <span
              className="text-[10px] text-white/50 uppercase tracking-widest font-semibold"
              style={{ letterSpacing: "0.05em" }}
            >
              Main Menu
            </span>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.title} className="relative group/item" role="listitem">
              {item.isCollapsible ? (
                <div className="relative">
                  <button
                    onClick={() => !isCollapsed && toggleGroup(item.title)}
                    className={`w-full group relative flex items-center ${
                      isCollapsed ? "justify-center px-0" : "gap-3 px-4"
                    } py-3 rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary ${
                      isGroupActive(item.subItems)
                        ? "bg-[#FF9C04]/10 text-white shadow-lg"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                    aria-label={item.ariaLabel}
                    aria-expanded={openGroups.includes(item.title)}
                    aria-controls={`submenu-${item.title}`}
                  >
                    {/* Active Indicator */}
                    {isGroupActive(item.subItems) && !isCollapsed && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                        style={{
                          background:
                            "linear-gradient(180deg, #FF9C04 0%, #FFB04A 100%)",
                          boxShadow: "0px 0px 12px rgba(255, 156, 4, 0.6)",
                        }}
                        aria-hidden="true"
                      />
                    )}

                    <div
                      className={`relative z-10 flex items-center ${
                        isCollapsed ? "" : "gap-3 w-full"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                          isGroupActive(item.subItems)
                            ? "text-[#FF9C04]"
                            : "text-white/70 group-hover:text-white"
                        }`}
                        style={{
                          filter: isGroupActive(item.subItems)
                            ? "drop-shadow(0px 0px 8px rgba(255, 156, 4, 0.5))"
                            : "none",
                        }}
                        aria-hidden="true"
                      />
                      {!isCollapsed && (
                        <>
                          <span
                            className={`flex-1 text-left text-sm font-semibold ${
                              isGroupActive(item.subItems)
                                ? "text-white"
                                : "group-hover:text-white"
                            }`}
                          >
                            {item.title}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-500 ${
                              openGroups.includes(item.title) ? "rotate-180" : ""
                            } ${
                              isGroupActive(item.subItems)
                                ? "text-[#FF9C04]"
                                : "text-white/50 group-hover:text-white/70"
                            }`}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </div>
                  </button>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div
                      className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-[#001B55] text-white text-sm font-medium rounded-lg shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
                      role="tooltip"
                    >
                      {item.title}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#001B55]"></div>
                    </div>
                  )}

                  {/* Submenu */}
                  {!isCollapsed && openGroups.includes(item.title) && (
                    <div
                      id={`submenu-${item.title}`}
                      className="ml-8 mt-1 mb-2 space-y-0.5 relative animate-in slide-in-from-top-2 duration-300"
                      role="list"
                      aria-label={`Submenu ${item.title}`}
                    >
                      {/* Vertical line connector */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-px"
                        style={{
                          background: "rgba(255, 156, 4, 0.2)",
                        }}
                        aria-hidden="true"
                      />

                      {item.subItems?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const subItemActive = isActive(subItem.url);
                        return (
                          <SafeNavLink
                            key={subItem.url}
                            to={subItem.url}
                            className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary ${
                              subItemActive
                                ? "bg-[#FF9C04]/20 text-white"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                            aria-label={subItem.ariaLabel}
                            aria-current={subItemActive ? "page" : undefined}
                          >
                            {/* Connection Dot */}
                            <div
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                subItemActive ? "bg-[#FF9C04]" : "bg-white/30"
                              }`}
                              style={{
                                boxShadow: subItemActive
                                  ? "0px 0px 8px rgba(255, 156, 4, 0.6)"
                                  : "none",
                              }}
                              aria-hidden="true"
                            />

                            <SubIcon
                              className={`h-4 w-4 flex-shrink-0 transition-all duration-300 ${
                                subItemActive
                                  ? "text-[#FF9C04]"
                                  : "text-white/50 group-hover:text-white/70"
                              }`}
                              aria-hidden="true"
                            />

                            <span
                              className={`text-sm font-medium ${
                                subItemActive
                                  ? "text-white"
                                  : "group-hover:text-white"
                              }`}
                            >
                              {subItem.title}
                            </span>
                          </SafeNavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <SafeNavLink
                    to={item.url ?? "#"}
                    className={`group relative flex items-center ${
                      isCollapsed ? "justify-center px-0" : "gap-3 px-4"
                    } py-3 rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary ${
                      isActive(item.url ?? "")
                        ? "bg-[#FF9C04]/10 text-white shadow-lg"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                    aria-label={item.ariaLabel}
                    aria-current={isActive(item.url ?? "") ? "page" : undefined}
                  >
                    {/* Active Indicator */}
                    {isActive(item.url ?? "") && !isCollapsed && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                        style={{
                          background:
                            "linear-gradient(180deg, #FF9C04 0%, #FFB04A 100%)",
                          boxShadow: "0px 0px 12px rgba(255, 156, 4, 0.6)",
                        }}
                        aria-hidden="true"
                      />
                    )}

                    <div
                      className={`relative z-10 flex items-center ${
                        isCollapsed ? "" : "gap-3 w-full"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                          isActive(item.url ?? "")
                            ? "text-[#FF9C04]"
                            : "text-white/70 group-hover:text-white"
                        }`}
                        style={{
                          filter: isActive(item.url ?? "")
                            ? "drop-shadow(0px 0px 8px rgba(255, 156, 4, 0.5))"
                            : "none",
                        }}
                        aria-hidden="true"
                      />
                      {!isCollapsed && (
                        <span
                          className={`flex-1 text-left text-sm font-semibold ${
                            isActive(item.url ?? "")
                              ? "text-white"
                              : "group-hover:text-white"
                          }`}
                        >
                          {item.title}
                        </span>
                      )}
                    </div>
                  </SafeNavLink>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div
                      className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-[#001B55] text-white text-sm font-medium rounded-lg shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
                      role="tooltip"
                    >
                      {item.title}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#001B55]"></div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Line Separator */}
      <div
        className="mx-0 my-0"
        style={{
          height: "1px",
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255, 156, 4, 0.3) 0%, rgba(255, 156, 4, 0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Quick Actions */}
      {!isCollapsed && (
        <div
          className="mx-5 mb-5 mt-5 p-5 rounded-2xl flex flex-col gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 156, 4, 0.1) 0%, rgba(0, 27, 85, 0.2) 100%)",
            boxShadow: "0px 20px 40px -12px rgba(255, 156, 4, 0.3)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 156, 4, 0.2)",
          }}
        >
          <div className="space-y-2">
            <h4
              className="text-sm text-white font-bold text-center"
              style={{
                textShadow: "0px 0px 12px rgba(255, 255, 255, 0.4)",
              }}
            >
              Quick Actions
            </h4>
            <p className="text-[11px] text-white/70 text-center leading-relaxed">
              Kelola konten dan data partai dengan mudah
            </p>
          </div>

          <SafeNavLink to="/admin/news/create">
            <button
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-primary"
              style={{
                background:
                  "linear-gradient(135deg, #FF9C04 0%, #FFB04A 100%)",
                boxShadow: "0px 8px 24px rgba(255, 156, 4, 0.4)",
              }}
              aria-label="Buat konten baru"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span>Buat Konten Baru</span>
            </button>
          </SafeNavLink>
        </div>
      )}

      {/* Collapsed state: Add Content Button at bottom */}
      {isCollapsed && (
        <div className="p-4 flex justify-center">
          <SafeNavLink to="/admin/news/create">
            <button
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
              style={{
                background:
                  "linear-gradient(135deg, #FF9C04 0%, #FFB04A 100%)",
                boxShadow: "0px 8px 24px rgba(255, 156, 4, 0.4)",
              }}
              aria-label="Buat konten baru"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </SafeNavLink>
        </div>
      )}

      {/* Arrow Button for collapsed state */}
      {isCollapsed && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-16 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
          style={{
            background: "rgba(15, 9, 12, 0.4)",
            backdropFilter: "blur(68.49px)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
          }}
          aria-label="Buka sidebar"
          aria-expanded={!isCollapsed}
        >
          <ChevronRight className="w-3.5 h-3.5 text-white/60" />
        </button>
      )}
    </nav>
  );
}
