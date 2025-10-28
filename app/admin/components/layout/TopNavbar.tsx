import {
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Home,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/rbac";
import { useAuth } from "@/app/admin/hooks/useAuth";

interface TopNavbarProps {
  breadcrumbs?: { label: string; href?: string }[];
  onToggleSidebar?: () => void;
}

export function TopNavbar({
  breadcrumbs = [],
  onToggleSidebar,
}: TopNavbarProps) {
  const router = useRouter();
  const { user, logout: authLogout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await authLogout();
      router.replace("/");
    } catch (e) {
      console.error("Logout error", e);
      router.replace("/");
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPERADMIN:
        return "Super Admin";
      case UserRole.EDITOR:
        return "Editor";
      case UserRole.ANALYST:
        return "Analyst";
      default:
        return "Unknown";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b-2 border-gray-200/80 hover:border-gray-300/90 transition-all duration-300 shadow-md hover:shadow-lg">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Left Section - Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Menu */}
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="lg:hidden h-10 w-10 rounded-xl border-2 border-gray-200/80 hover:border-gray-300/90 bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}

          {breadcrumbs.length > 0 ? (
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/admin"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink
                          href={crumb.href}
                          className="text-muted-foreground hover:text-primary transition-colors duration-300"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-foreground font-medium">
                          {crumb.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          ) : (
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                DPD Partai NasDem Kabupaten Sidoarjo
              </p>
            </div>
          )}
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Enhanced Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-auto px-3 rounded-xl border-2 border-gray-200/80 hover:border-gray-300/90 bg-white hover:bg-gray-50 transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-offset-white ring-primary/30 group-hover:ring-primary/50 transition-all duration-300 shadow-sm">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={user?.username || "Admin"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-sm font-semibold">
                      {user ? getInitials(user.username) : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">
                      {user?.username || "Admin User"}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {user ? getRoleDisplayName(user.role) : "Loading..."}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-all duration-300 group-hover:rotate-180" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-xl rounded-2xl overflow-hidden"
            >
              <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={user?.username || "Admin"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
                      {user ? getInitials(user.username) : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {user?.username || "Admin User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || "admin@nasdem-sidoarjo.id"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <div className="p-2">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="px-3 py-2 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
