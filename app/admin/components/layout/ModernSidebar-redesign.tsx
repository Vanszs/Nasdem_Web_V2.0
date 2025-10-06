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
      className={`relative h-screen flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      } bg-card border-r border-border shadow-lg`}
    >
      {/* Header with Logo */}
      <div className="relative p-5 border-b border-border bg-muted/30">
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div
            className={`flex items-center gap-3 ${isCollapsed ? "flex-col" : ""}`}
          >
            <div
              className="relative w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #001B55 0%, #002266 100%)",
              }}
              role="img"
              aria-label="Logo NasDem Sidoarjo"
            >
              <Sparkles className="text-brand-accent w-5 h-5 z-10" />
            </div>
            {!isCollapsed && (
              <div className="space-y-0.5">
                <h2 className="font-semibold text-text-primary text-base">
                  NasDem
                </h2>
                <p className="text-text-tertiary text-xs font-medium flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 bg-brand-success rounded-full animate-pulse"
                    role="status"
                    aria-label="Status online"
                  ></span>
                  Kab. Sidoarjo
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-1"
              aria-label="Tutup sidebar"
              aria-expanded={!isCollapsed}
            >
              <ChevronRight className="w-4 h-4 text-text-tertiary" />
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div
        className={`py-3 flex-1 overflow-y-auto scrollbar-hide transition-all duration-300 ${
          isCollapsed ? "px-2" : "px-3"
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
          }
        `}</style>

        {!isCollapsed && (
          <div className="px-3 py-2 mb-2">
            <span className="text-xs text-text-tertiary uppercase tracking-wider font-semibold">
              Menu Utama
            </span>
          </div>
        )}

        <div className="space-y-0.5">
          {menuItems.map((item) => (
            <div key={item.title} className="relative group/item" role="listitem">
              {item.isCollapsible ? (
                <div className="relative">
                  <button
                    onClick={() => !isCollapsed && toggleGroup(item.title)}
                    className={`w-full group relative flex items-center ${
                      isCollapsed ? "justify-center px-0" : "gap-2.5 px-3"
                    } py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-1 ${
                      isGroupActive(item.subItems)
                        ? "bg-brand-primary text-white"
                        : "text-text-secondary hover:bg-muted hover:text-text-primary"
                    }`}
                    aria-label={item.ariaLabel}
                    aria-expanded={openGroups.includes(item.title)}
                  >
                    {isGroupActive(item.subItems) && !isCollapsed && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-accent rounded-r"
                        aria-hidden="true"
                      />
                    )}

                    <div
                      className={`relative z-10 flex items-center ${
                        isCollapsed ? "" : "gap-2.5 w-full"
                      }`}
                    >
                      <item.icon
                        className={`h-4.5 w-4.5 flex-shrink-0 transition-colors ${
                          isGroupActive(item.subItems)
                            ? "text-brand-accent"
                            : ""
                        }`}
                        aria-hidden="true"
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-sm font-medium">
                            {item.title}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              openGroups.includes(item.title) ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </div>
                  </button>

                  {isCollapsed && (
                    <div
                      className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-text-primary text-white text-sm font-medium rounded-lg shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
                      role="tooltip"
                    >
                      {item.title}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-text-primary"></div>
                    </div>
                  )}

                  {!isCollapsed && openGroups.includes(item.title) && (
                    <div
                      className="ml-6 mt-1 mb-1 space-y-0.5 pl-3 border-l-2 border-border"
                      role="list"
                    >
                      {item.subItems?.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const subItemActive = isActive(subItem.url);
                        return (
                          <SafeNavLink
                            key={subItem.url}
                            to={subItem.url}
                            className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-1 ${
                              subItemActive
                                ? "bg-brand-accent/10 text-brand-accent font-medium"
                                : "text-text-secondary hover:bg-muted hover:text-text-primary"
                            }`}
                            aria-label={subItem.ariaLabel}
                            aria-current={subItemActive ? "page" : undefined}
                          >
                            <SubIcon
                              className="h-4 w-4 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="text-sm">{subItem.title}</span>
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
                      isCollapsed ? "justify-center px-0" : "gap-2.5 px-3"
                    } py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-1 ${
                      isActive(item.url ?? "")
                        ? "bg-brand-primary text-white"
                        : "text-text-secondary hover:bg-muted hover:text-text-primary"
                    }`}
                    aria-label={item.ariaLabel}
                    aria-current={isActive(item.url ?? "") ? "page" : undefined}
                  >
                    {isActive(item.url ?? "") && !isCollapsed && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-accent rounded-r"
                        aria-hidden="true"
                      />
                    )}

                    <div
                      className={`relative z-10 flex items-center ${
                        isCollapsed ? "" : "gap-2.5 w-full"
                      }`}
                    >
                      <item.icon
                        className={`h-4.5 w-4.5 flex-shrink-0 ${
                          isActive(item.url ?? "")
                            ? "text-brand-accent"
                            : ""
                        }`}
                        aria-hidden="true"
                      />
                      {!isCollapsed && (
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.title}
                        </span>
                      )}
                    </div>
                  </SafeNavLink>

                  {isCollapsed && (
                    <div
                      className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-text-primary text-white text-sm font-medium rounded-lg shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
                      role="tooltip"
                    >
                      {item.title}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-text-primary"></div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="m-4 p-4 bg-gradient-to-br from-brand-primary to-brand-primary/90 rounded-xl">
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="text-sm text-white font-semibold">
                Quick Actions
              </h4>
              <p className="text-xs text-white/80">
                Kelola konten dengan mudah
              </p>
            </div>

            <SafeNavLink to="/admin/news/create">
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-primary"
                aria-label="Buat konten baru"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Konten Baru</span>
              </button>
            </SafeNavLink>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="p-3 flex justify-center border-t border-border">
          <SafeNavLink to="/admin/news/create">
            <button
              className="w-12 h-12 rounded-lg flex items-center justify-center bg-brand-accent hover:bg-brand-accent/90 text-white transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-1"
              aria-label="Buat konten baru"
            >
              <Plus className="w-5 h-5" />
            </button>
          </SafeNavLink>
        </div>
      )}

      {isCollapsed && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center bg-card border border-border shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent"
          aria-label="Buka sidebar"
          aria-expanded={!isCollapsed}
        >
          <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />
        </button>
      )}
    </nav>
  );
}
