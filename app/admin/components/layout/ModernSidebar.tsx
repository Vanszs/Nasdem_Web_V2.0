"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
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
  ClipboardList,
  HandHeart,
  Clock,
  GraduationCap,
  UserCheck,
} from "lucide-react";

import { SafeNavLink } from "./SafeNavLink";
import { UserRole } from "@/lib/rbac";
import { useAuthStore } from "@/store/auth";

// Define all menu items with their required roles
const allMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    ariaLabel: "Dashboard utama",
    requiredRoles: [UserRole.SUPERADMIN, UserRole.EDITOR, UserRole.ANALYST],
  },
  {
    title: "CMS",
    icon: Monitor,
    isCollapsible: true,
    ariaLabel: "Menu Content Management System",
    requiredRoles: [UserRole.SUPERADMIN, UserRole.EDITOR],
    subItems: [
      {
        title: "Berita",
        url: "/admin/news",
        icon: FileText,
        ariaLabel: "Kelola berita",
        requiredRoles: [UserRole.SUPERADMIN, UserRole.EDITOR],
      },
      {
        title: "Galeri",
        url: "/admin/gallery",
        icon: ImageIcon,
        ariaLabel: "Kelola galeri foto dan video",
        requiredRoles: [UserRole.SUPERADMIN, UserRole.EDITOR],
      },
    ],
  },
  {
    title: "Landing Page",
    url: "/admin/landing",
    icon: Globe,
    ariaLabel: "Edit halaman landing",
    requiredRoles: [UserRole.SUPERADMIN, UserRole.EDITOR],
  },
  {
    title: "Program Kerja",
    icon: ClipboardList,
    isCollapsible: true,
    ariaLabel: "Menu Program Kerja",
    requiredRoles: [UserRole.SUPERADMIN],
    subItems: [
      {
        title: "Daftar Program",
        url: "/admin/programs",
        icon: ClipboardList,
        ariaLabel: "Kelola program kerja",
        requiredRoles: [UserRole.SUPERADMIN],
      },
      {
        title: "Penerima Manfaat",
        url: "/admin/beneficiaries",
        icon: HandHeart,
        ariaLabel: "Kelola penerima manfaat program",
        requiredRoles: [UserRole.SUPERADMIN],
      },
    ],
  },
  {
    title: "Struktur Organisasi",
    icon: Network,
    isCollapsible: true,
    ariaLabel: "Menu struktur organisasi",
    requiredRoles: [UserRole.SUPERADMIN],
    subItems: [
      {
        title: "Struktur Organisasi",
        url: "/admin/organizations",
        icon: Network,
        ariaLabel: "Kelola data organisasi",
        requiredRoles: [UserRole.SUPERADMIN],
      },
      {
        title: "Kelola Anggota",
        url: "/admin/organizations/manage",
        icon: FolderKanban,
        ariaLabel: "Kelola anggota organisasi",
        requiredRoles: [UserRole.SUPERADMIN],
      },
    ],
  },
  {
    title: "User",
    url: "/admin/user",
    icon: UserPlus,
    ariaLabel: "Kelola pengguna",
    requiredRoles: [UserRole.SUPERADMIN],
  },
  {
    title: "Pending Request",
    icon: Clock,
    isCollapsible: true,
    ariaLabel: "Menu permintaan yang menunggu persetujuan",
    requiredRoles: [UserRole.SUPERADMIN],
    subItems: [
      {
        title: "PIP (Beasiswa)",
        url: "/admin/pending-requests/pip",
        icon: GraduationCap,
        ariaLabel: "Kelola pendaftaran beasiswa PIP",
        requiredRoles: [UserRole.SUPERADMIN],
      },
      {
        title: "Member Regist",
        url: "/admin/pending-requests/member-regist",
        icon: UserCheck,
        ariaLabel: "Kelola pendaftaran anggota baru",
        requiredRoles: [UserRole.SUPERADMIN],
      },
    ],
  },
  {
    title: "Statistik Pemilu",
    url: "/admin/statistik-pemilu",
    icon: BarChart3,
    ariaLabel: "Lihat statistik dan data pemilu",
    requiredRoles: [UserRole.SUPERADMIN, UserRole.ANALYST],
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
  const router = useRouter();
  const currentPath = usePathname() || "/";
  const sidebarRef = useRef<HTMLElement>(null);
  const storeUserRole = useAuthStore(
    (s) => s.user?.role as UserRole | undefined
  );
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const storeIsLoading = useAuthStore((s) => s.isLoading);
  const lastFetchedAt = useAuthStore((s) => s.lastFetchedAt);
  const [userRole, setUserRole] = useState<UserRole | null>(
    storeUserRole || null
  );
  const [menuItems, setMenuItems] = useState<typeof allMenuItems>(allMenuItems);
  const [isLoading, setIsLoading] = useState(true);
  const [authCheckDone, setAuthCheckDone] = useState(false);

  // Initial auth check - only once on mount
  useEffect(() => {
    if (!authCheckDone) {
      console.log("🔍 [ModernSidebar] Starting initial auth check...");
      fetchUser().finally(() => {
        console.log("✅ [ModernSidebar] Auth check completed");
        setAuthCheckDone(true);
      });
    }
  }, [authCheckDone, fetchUser]);

  // Redirect to login if auth check done and user is null
  useEffect(() => {
    if (authCheckDone && !user && !storeIsLoading && lastFetchedAt) {
      // User is definitely not authenticated, redirect to login
      console.log("⚠️  No authenticated user, redirecting to login...");
      router.push("/auth");
    }
  }, [authCheckDone, user, storeIsLoading, lastFetchedAt, router]);

  // Use hydrated user role from auth store (SSR) and filter menu items
  useEffect(() => {
    if (!storeUserRole) {
      // If role hasn't hydrated yet, stop showing infinite spinner
      setIsLoading(false);
      setMenuItems([] as any);
      return;
    }
    setUserRole(storeUserRole);

    const filteredItems = allMenuItems
      .filter((item) => item.requiredRoles.includes(storeUserRole))
      .map((item) => {
        const newItem = { ...item } as any;
        if (newItem.subItems) {
          newItem.subItems = newItem.subItems.filter((subItem: any) =>
            subItem.requiredRoles.includes(storeUserRole)
          );
        }
        return newItem;
      });

    setMenuItems(filteredItems as any);
    setIsLoading(false);
  }, [storeUserRole]);

  const getInitialOpenGroups = () => {
    const groups: string[] = [];
    menuItems.forEach((item: any) => {
      if (item.isCollapsible && item.subItems) {
        const hasActiveSubItem = item.subItems.some(
          (subItem: any) =>
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
  }, [currentPath, menuItems]);

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
      "a[href], button:not([disabled])"
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
      } bg-white border-r border-[#001B55]/10 shadow-sm`}
    >
      {/* Header with Logo */}
      <div className="relative p-5 border-b border-[#001B55]/10">
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "flex-col" : ""
            }`}
          >
            <div
              className="relative w-11 h-11 rounded-xl flex items-center justify-center bg-white border-2 border-[#001B55]/20 shadow-sm overflow-hidden"
              role="img"
              aria-label="Logo NasDem Sidoarjo"
            >
              <Image
                src="/logo-nasdem.png"
                alt="Logo NasDem"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            {!isCollapsed && (
              <div className="space-y-0.5">
                <h2 className="font-bold text-[#001B55] text-base tracking-tight">
                  NasDem
                </h2>
                <p className="text-gray-600 text-xs font-medium flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 bg-[#001B55]/40 rounded-full animate-pulse"
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
              className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#001B55]/30 focus:ring-offset-1"
              aria-label="Tutup sidebar"
              aria-expanded={!isCollapsed}
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
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
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Menu Utama
            </span>
          </div>
        )}

        <div className="space-y-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001B55]"></div>
            </div>
          ) : (
            menuItems.map((item: any) => (
              <div
                key={item.title}
                className="relative group/item"
                role="listitem"
              >
                {item.isCollapsible ? (
                  <div className="relative">
                    <button
                      onClick={() => !isCollapsed && toggleGroup(item.title)}
                      className={`w-full group relative flex items-center ${
                        isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                      } py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#001B55]/30 focus:ring-offset-1 ${
                        isGroupActive(item.subItems)
                          ? "bg-gray-200 text-[#001B55] shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#001B55]"
                      }`}
                      aria-label={item.ariaLabel}
                      aria-expanded={openGroups.includes(item.title)}
                    >
                      <div
                        className={`relative z-10 flex items-center ${
                          isCollapsed ? "" : "gap-3 w-full"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 flex-shrink-0 transition-colors ${
                            isGroupActive(item.subItems) ? "text-[#001B55]" : ""
                          }`}
                          aria-hidden="true"
                        />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left text-sm font-semibold">
                              {item.title}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                openGroups.includes(item.title)
                                  ? "rotate-180 text-[#001B55]"
                                  : ""
                              }`}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </div>
                    </button>

                    {isCollapsed && (
                      <div
                        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-white border-2 border-[#001B55] text-[#001B55] text-sm font-semibold rounded-lg shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
                        role="tooltip"
                      >
                        {item.title}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-white drop-shadow-lg"></div>
                      </div>
                    )}

                    {!isCollapsed && openGroups.includes(item.title) && (
                      <div
                        className="ml-8 mt-1 mb-1 space-y-1 pl-3 border-l border-[#001B55]/20"
                        role="list"
                      >
                        {item.subItems?.map((subItem: any) => {
                          const SubIcon = subItem.icon;
                          const subItemActive = isActive(subItem.url);
                          return (
                            <SafeNavLink
                              key={subItem.url}
                              to={subItem.url}
                              className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#001B55]/30 focus:ring-offset-1 ${
                                subItemActive
                                  ? "bg-white text-[#001B55] font-semibold border-l-2 border-[#001B55]/40"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-[#001B55]"
                              }`}
                              aria-label={subItem.ariaLabel}
                              aria-current={subItemActive ? "page" : undefined}
                            >
                              <SubIcon
                                className={`h-4 w-4 flex-shrink-0 ${
                                  subItemActive ? "text-[#001B55]" : ""
                                }`}
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
                        isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                      } py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#001B55]/30 focus:ring-offset-1 ${
                        isActive(item.url ?? "")
                          ? "bg-gray-200 text-[#001B55] shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#001B55]"
                      }`}
                      aria-label={item.ariaLabel}
                      aria-current={
                        isActive(item.url ?? "") ? "page" : undefined
                      }
                    >
                      <div
                        className={`relative z-10 flex items-center ${
                          isCollapsed ? "" : "gap-3 w-full"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 flex-shrink-0 ${
                            isActive(item.url ?? "") ? "text-[#001B55]" : ""
                          }`}
                          aria-hidden="true"
                        />
                        {!isCollapsed && (
                          <span className="flex-1 text-left text-sm font-semibold">
                            {item.title}
                          </span>
                        )}
                      </div>
                    </SafeNavLink>

                    {isCollapsed && (
                      <div
                        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-white border-2 border-[#001B55] text-[#001B55] text-sm font-semibold rounded-lg shadow-xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
                        role="tooltip"
                      >
                        {item.title}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-white drop-shadow-lg"></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="m-4 p-4 bg-white border-2 border-[#001B55]/20 rounded-xl shadow-sm">
          <div className="space-y-3">
            <div className="space-y-1 pb-3 border-b border-[#001B55]/20">
              <h4 className="text-sm text-[#001B55] font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#001B55]/60" />
                Quick Actions
              </h4>
              <p className="text-xs text-gray-600">
                Kelola konten dengan mudah
              </p>
            </div>

            <SafeNavLink to="/admin/news/create">
              <button
                className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#001B55]/30 text-[#001B55] hover:bg-[#001B55]/5 rounded-lg font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#001B55]/30 focus:ring-offset-2"
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
        <div className="p-3 flex justify-center border-t border-[#001B55]/10">
          <SafeNavLink to="/admin/news/create">
            <button
              className="w-12 h-12 rounded-lg flex items-center justify-center bg-white border border-[#001B55]/30 text-[#001B55] hover:bg-[#001B55]/5 transition-all focus:outline-none focus:ring-2 focus:ring-[#001B55]/30 focus:ring-offset-1"
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
          className="absolute cursor-pointer -right-3 top-20 w-7 h-7 rounded-full flex items-center justify-center bg-white border-2 border-[#001B55]/20 shadow-md hover:shadow-lg hover:border-[#001B55] transition-all focus:outline-none focus:ring-2 focus:ring-[#001B55]/30"
          aria-label="Buka sidebar"
          aria-expanded={!isCollapsed}
        >
          <ChevronRight className="w-4 h-4 text-[#001B55]" />
        </button>
      )}
    </nav>
  );
}
