"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Users, Phone, MapPin } from "lucide-react"

const NasdemHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              <span className="font-bold text-primary-foreground text-lg">NasDem</span>
              <span className="text-primary-foreground/80 text-xs">Sidoarjo</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <li>
              <a href="/" className="story-link text-primary-foreground hover:text-secondary transition-colors">
                Beranda
              </a>
            </li>
            <li>
              <a href="#profil" className="story-link text-primary-foreground hover:text-secondary transition-colors">
                Profil
              </a>
            </li>
            <li>
              <a href="#program" className="story-link text-primary-foreground hover:text-secondary transition-colors">
                Program
              </a>
            </li>
            <li>
              <a href="/berita" className="story-link text-primary-foreground hover:text-secondary transition-colors">
                Berita
              </a>
            </li>
            <li>
              <a href="/galeri" className="story-link text-primary-foreground hover:text-secondary transition-colors">
                Galeri
              </a>
            </li>
            <li>
              <a href="/struktur" className="story-link text-primary-foreground hover:text-secondary transition-colors">
                Struktur
              </a>
            </li>
            <li>
              <a href="#kontak" className="story-link text-primary-foreground hover:text-secondary transition-colors">
                Kontak
              </a>
            </li>
          </ul>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="secondary" size="sm" className="hover-scale font-medium">
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
                <li>
                  <a href="/" className="block text-primary-foreground hover:text-secondary transition-colors py-2">
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    href="#profil"
                    className="block text-primary-foreground hover:text-secondary transition-colors py-2"
                  >
                    Profil
                  </a>
                </li>
                <li>
                  <a
                    href="#program"
                    className="block text-primary-foreground hover:text-secondary transition-colors py-2"
                  >
                    Program
                  </a>
                </li>
                <li>
                  <a
                    href="/berita"
                    className="block text-primary-foreground hover:text-secondary transition-colors py-2"
                  >
                    Berita
                  </a>
                </li>
                <li>
                  <a
                    href="/galeri"
                    className="block text-primary-foreground hover:text-secondary transition-colors py-2"
                  >
                    Galeri
                  </a>
                </li>
                <li>
                  <a
                    href="/struktur"
                    className="block text-primary-foreground hover:text-secondary transition-colors py-2"
                  >
                    Struktur
                  </a>
                </li>
                <li>
                  <a
                    href="#kontak"
                    className="block text-primary-foreground hover:text-secondary transition-colors py-2"
                  >
                    Kontak
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
  )
}

export default NasdemHeader
