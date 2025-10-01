"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Users, Phone, MapPin } from "lucide-react";

const NasdemHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Function to check if a link is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href);
  };

  // Function to get link classes with active state
  const getLinkClasses = (href: string, baseClasses: string = "") => {
    const isActive = isActiveLink(href);
    return `${baseClasses} ${
      isActive
        ? "text-[#FF9C04] font-bold relative" // Active state: kuning/orange dengan bold dan relative positioning
        : "text-primary-foreground hover:text-[#FF9C04] transition-all duration-300 relative group"
    }`;
  };

  // Function to render active indicator
  const ActiveIndicator = ({ isActive }: { isActive: boolean }) => (
    <>
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF9C04] rounded-full animate-pulse"></span>
      )}
      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF9C04] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
      <div className="container mx-auto px-4">
        {/* Top contact bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-xs text-primary-foreground/80 border-b border-primary-foreground/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={12} />
              <span>Jl. Raya Sidoarjo, Kab. Sidoarjo, Jawa Timur</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={12} />
              <span>(031) 1234-5678</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users size={12} />
            <span>Anggota: 500+ Kader Aktif</span>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-primary text-lg">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-primary-foreground text-lg">
                NasDem
              </span>
              <span className="text-primary-foreground/80 text-xs">
                Sidoarjo
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <li className="relative">
              <a href="/" className={getLinkClasses("/", "story-link")}>
                Beranda
                <ActiveIndicator isActive={isActiveLink("/")} />
              </a>
            </li>
            <li className="relative">
              <a
                href="#profil"
                className={getLinkClasses("#profil", "story-link")}
              >
                Profil
                <ActiveIndicator isActive={isActiveLink("#profil")} />
              </a>
            </li>
            <li className="relative">
              <a
                href="/visi-misi"
                className={getLinkClasses("/visi-misi", "story-link")}
              >
                Visi Misi
                <ActiveIndicator isActive={isActiveLink("/visi-misi")} />
              </a>
            </li>
            <li className="relative">
              <a
                href="#program"
                className={getLinkClasses("#program", "story-link")}
              >
                Program
                <ActiveIndicator isActive={isActiveLink("#program")} />
              </a>
            </li>
            <li className="relative">
              <a
                href="/berita"
                className={getLinkClasses("/berita", "story-link")}
              >
                Berita
                <ActiveIndicator isActive={isActiveLink("/berita")} />
              </a>
            </li>
            <li className="relative">
              <a
                href="/galeri"
                className={getLinkClasses("/galeri", "story-link")}
              >
                Galeri
                <ActiveIndicator isActive={isActiveLink("/galeri")} />
              </a>
            </li>
            <li className="relative">
              <a
                href="/struktur"
                className={getLinkClasses("/struktur", "story-link")}
              >
                Struktur
                <ActiveIndicator isActive={isActiveLink("/struktur")} />
              </a>
            </li>
            <li className="relative">
              <a
                href="/kontak"
                className={getLinkClasses("/kontak", "story-link")}
              >
                Kontak
                <ActiveIndicator isActive={isActiveLink("/kontak")} />
              </a>
            </li>
          </ul>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="hover-scale font-medium"
            >
              Bergabung
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-secondary hover:text-primary font-medium backdrop-blur-sm"
            >
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-primary-foreground hover:text-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-primary border-t border-primary-foreground/10 animate-fade-in">
            <nav className="container mx-auto px-4 py-6">
              <ul className="space-y-4 text-sm font-medium">
                <li className="relative">
                  <a href="/" className={getLinkClasses("/", "block py-2")}>
                    Beranda
                    {isActiveLink("/") && (
                      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#FF9C04] rounded-r-full"></span>
                    )}
                  </a>
                </li>
                <li className="relative">
                  <a
                    href="#profil"
                    className={getLinkClasses("#profil", "block py-2 pl-4")}
                  >
                    Profil
                    {isActiveLink("#profil") && (
                      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#FF9C04] rounded-r-full"></span>
                    )}
                  </a>
                </li>
                <li className="relative">
                  <a
                    href="/visi-misi"
                    className={getLinkClasses("/visi-misi", "block py-2 pl-4")}
                  >
                    Visi Misi
                    {isActiveLink("/visi-misi") && (
                      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#FF9C04] rounded-r-full"></span>
                    )}
                  </a>
                </li>
                <li className="relative">
                  <a
                    href="#program"
                    className={getLinkClasses("#program", "block py-2 pl-4")}
                  >
                    Program
                    {isActiveLink("#program") && (
                      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#FF9C04] rounded-r-full"></span>
                    )}
                  </a>
                </li>
                <li className="relative">
                  <a
                    href="/berita"
                    className={getLinkClasses("/berita", "block py-2 pl-4")}
                  >
                    Berita
                    {isActiveLink("/berita") && (
                      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#FF9C04] rounded-r-full"></span>
                    )}
                  </a>
                </li>
                <li className="relative">
                  <a
                    href="/galeri"
                    className={getLinkClasses("/galeri", "block py-2 pl-4")}
                  >
                    Galeri
                    {isActiveLink("/galeri") && (
                      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#FF9C04] rounded-r-full"></span>
                    )}
                  </a>
                </li>
                <li className="relative">
                  <a
                    href="/struktur"
                    className={getLinkClasses("/struktur", "block py-2 pl-4")}
                  >
                    Struktur
                    {isActiveLink("/struktur") && (
                      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#FF9C04] rounded-r-full"></span>
                    )}
                  </a>
                </li>
                <li className="relative">
                  <a
                    href="/kontak"
                    className={getLinkClasses("/kontak", "block py-2 pl-4")}
                  >
                    Kontak
                    {isActiveLink("/kontak") && (
                      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#FF9C04] rounded-r-full"></span>
                    )}
                  </a>
                </li>
              </ul>
              <div className="flex flex-col gap-3 mt-6">
                <Button variant="secondary" size="sm" className="w-full">
                  Bergabung
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-secondary hover:text-primary font-medium backdrop-blur-sm"
                >
                  Login
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NasdemHeader;
