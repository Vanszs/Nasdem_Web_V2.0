"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Home,
  Activity,
  Settings,
  ChevronDown,
  Building,
  Layers,
  MapPin,
  TreePine,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SafeNavLink } from "./SafeNavLink";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Berita",
    url: "/news",
    icon: FileText,
  },
  {
    title: "Galeri",
    url: "/gallery",
    icon: Image,
  },
  {
    title: "Struktur",
    icon: Users,
    isCollapsible: true,
    subItems: [
      { title: "DPD", url: "/structure/dpd", icon: Building },
      { title: "Sayap", url: "/structure/sayap", icon: Layers },
      { title: "DPC", url: "/structure/dpc", icon: MapPin },
      { title: "DPRT", url: "/structure/dprt", icon: TreePine },
    ],
  },
  {
    title: "Landing Page",
    url: "/landing",
    icon: Home,
  },
  {
    title: "Audit Log",
    url: "/audit",
    icon: Activity,
  },
  {
    title: "Pengaturan",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const [openGroups, setOpenGroups] = useState<string[]>(["Struktur"]);

  const currentPath = usePathname() || "/";

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (subItems?: { url: string }[]) =>
    subItems?.some((item) => isActive(item.url));

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    );
  };

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-[var(--shadow-glow)]"
      : "text-sidebar-foreground hover:bg-sidebar-accent/20 hover:text-sidebar-accent-foreground hover:shadow-[var(--shadow-soft)]";

  return (
    <Sidebar
      className="border-r-0 shadow-[var(--shadow-large)]"
      style={{ background: "var(--sidebar-background)" }}
    >
      <SidebarContent className="overflow-hidden">
        {/* Logo Section */}
        <div className="p-8 border-b border-sidebar-border/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-[var(--shadow-glow)] floating-element">
              <span className="text-accent-foreground font-bold text-lg">
                N
              </span>
            </div>
            {state === "expanded" && (
              <div className="space-y-1">
                <h2 className="font-bold text-sidebar-foreground text-lg tracking-tight">
                  NasDem
                </h2>
                <p className="text-sidebar-foreground/70 text-sm font-medium">
                  Sidoarjo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="p-4 space-y-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-widest mb-4 px-3">
              Menu Utama
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.isCollapsible ? (
                      <Collapsible
                        open={openGroups.includes(item.title)}
                        onOpenChange={() => toggleGroup(item.title)}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`sidebar-nav-item px-4 py-3 mx-1 ${
                              isGroupActive(item.subItems)
                                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[var(--shadow-glow)] font-semibold"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/20 hover:text-sidebar-accent-foreground hover:shadow-[var(--shadow-soft)]"
                            } ultra-smooth`}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {state === "expanded" && (
                              <>
                                <span className="font-medium">
                                  {item.title}
                                </span>
                                <ChevronDown
                                  className={`ml-auto h-4 w-4 transition-transform duration-300 ${
                                    openGroups.includes(item.title)
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        {state === "expanded" && (
                          <CollapsibleContent>
                            <SidebarMenuSub className="mt-2 space-y-1">
                              {item.subItems?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.url}>
                                  <SidebarMenuSubButton asChild>
                                    <SafeNavLink
                                      to={subItem.url}
                                      className={({ isActive }) =>
                                        `flex items-center gap-3 px-6 py-2.5 mx-1 rounded-xl ultra-smooth ${
                                          isActive
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-[var(--shadow-soft)]"
                                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/15 hover:text-sidebar-accent-foreground"
                                        }`
                                      }
                                    >
                                      <subItem.icon className="h-4 w-4 flex-shrink-0" />
                                      <span className="text-sm font-medium">
                                        {subItem.title}
                                      </span>
                                    </SafeNavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton asChild>
                        <SafeNavLink
                          to={item.url ?? "#"}
                          className={({ isActive }) =>
                            `sidebar-nav-item flex items-center gap-4 px-4 py-3 mx-1 font-medium ultra-smooth ${getNavClassName(
                              { isActive }
                            )}`
                          }
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          {state === "expanded" && (
                            <span className="font-medium">{item.title}</span>
                          )}
                        </SafeNavLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sidebar-background/60 via-transparent to-transparent pointer-events-none" />
      </SidebarContent>
    </Sidebar>
  );
}
