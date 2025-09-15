import { useState } from "react";
import { Search, Bell, User, LogOut, Settings, ChevronDown, Home, Menu } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Badge } from "@/src/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";

interface TopNavbarProps {
  breadcrumbs?: { label: string; href?: string }[];
  onToggleSidebar?: () => void;
}

export function TopNavbar({ breadcrumbs = [], onToggleSidebar }: TopNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
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
                  <BreadcrumbLink href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
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

        {/* Center Section - Enhanced Global Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="w-full relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-primary h-4 w-4 transition-colors duration-300" />
            <Input
              type="search"
              placeholder="Cari berita, galeri, struktur... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 h-11 w-full bg-white border-2 border-gray-200/80 hover:border-gray-300/90 rounded-2xl focus:bg-white focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-sm hover:shadow-md"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          </form>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 rounded-xl hover:bg-gray-100 transition-all duration-300"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Enhanced Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl border-2 border-gray-200/80 hover:border-gray-300/90 bg-white hover:bg-gray-50 transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent border-2 border-white text-white text-xs font-bold p-0 flex items-center justify-center animate-pulse shadow-md">
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-xl rounded-2xl overflow-hidden">
              <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Notifikasi</span>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    3 Baru
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50/70 cursor-pointer transition-colors duration-200">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Berita baru dipublish</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      "Program Infrastruktur Sidoarjo 2024" telah berhasil dipublish dan siap tayang
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 menit yang lalu</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50/70 cursor-pointer transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Media baru diupload</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      5 foto kegiatan DPD telah berhasil ditambahkan ke galeri
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">1 jam yang lalu</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50/70 cursor-pointer transition-colors duration-200">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Struktur organisasi diperbarui</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Data pengurus DPC Waru telah diperbarui dengan informasi terbaru
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">3 jam yang lalu</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                <Button variant="ghost" className="w-full text-primary hover:bg-primary/5 hover:text-primary rounded-xl transition-all duration-300">
                  Lihat semua notifikasi
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Enhanced Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-auto px-3 rounded-xl border-2 border-gray-200/80 hover:border-gray-300/90 bg-white hover:bg-gray-50 transition-all duration-300 group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-offset-white ring-primary/30 group-hover:ring-primary/50 transition-all duration-300 shadow-sm">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-sm font-semibold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">Admin User</span>
                    <span className="text-xs text-muted-foreground font-medium">Super Admin</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-all duration-300 group-hover:rotate-180" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-xl rounded-2xl overflow-hidden">
              <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@nasdem-sidoarjo.id</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <div className="p-2">
                <DropdownMenuItem className="px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <User className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Profil Saya</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem className="px-3 py-2 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg transition-colors duration-200">
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