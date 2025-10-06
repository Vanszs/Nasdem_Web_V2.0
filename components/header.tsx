"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    { href: "#beranda", label: "Beranda" },
    { href: "#profil", label: "Profil" },
    { href: "#program", label: "Program" },
    { href: "#berita", label: "Berita" },
    { href: "#galeri", label: "Galeri" },
    { href: "#organisasi", label: "Organisasi" },
    { href: "#kontak", label: "Kontak" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-nasdem-blue/95 backdrop-blur-sm shadow-lg" : "bg-nasdem-blue"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 flex-shrink-0 rounded-lg border-2 border-white/30 p-1 bg-white/10">
              <Image
                src="/logo-nasdem.png"
                alt="Logo NasDem"
                fill
                className="object-contain rounded-md"
                priority
              />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-lg">NasDem Sidoarjo</h1>
              <p className="text-xs opacity-90">Gerakan Perubahan</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-white hover:text-nasdem-orange transition-colors duration-200 text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-nasdem-blue bg-transparent transition-all duration-200"
            >
              Login
            </Button>
            <Button
              size="sm"
              className="bg-nasdem-orange hover:bg-nasdem-orange/90 text-white font-medium transition-all duration-200"
            >
              Bergabung
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-nasdem-blue border-t border-white/20">
            <nav className="py-4 space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-white hover:bg-white/10 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="px-4 pt-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white text-white hover:bg-white hover:text-nasdem-blue bg-transparent"
                >
                  Login
                </Button>
                <Button size="sm" className="w-full bg-nasdem-orange hover:bg-nasdem-orange/90 text-white font-medium">
                  Bergabung
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
