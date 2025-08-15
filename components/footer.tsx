"use client"

import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">NasDem Sidoarjo</h3>
                <p className="text-sm opacity-90">Gerakan Perubahan</p>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Bersama membangun Sidoarjo yang maju, adil, dan sejahtera melalui kepemimpinan yang amanah.
            </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                <Facebook className="h-4 w-4" />
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                <Instagram className="h-4 w-4" />
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                <Youtube className="h-4 w-4" />
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                <Twitter className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Menu Utama</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#beranda" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#profil" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                  Profil
                </a>
              </li>
              <li>
                <a href="#program" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                  Program
                </a>
              </li>
              <li>
                <a href="#berita" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                  Berita
                </a>
              </li>
              <li>
                <a href="#galeri" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                  Galeri
                </a>
              </li>
              <li>
                <a href="#organisasi" className="opacity-80 hover:opacity-100 hover:text-accent transition-colors">
                  Organisasi
                </a>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Program Unggulan</h4>
            <ul className="space-y-2 text-sm">
              <li className="opacity-80">Pendidikan Inklusif</li>
              <li className="opacity-80">Pemberdayaan UMKM</li>
              <li className="opacity-80">NasDem Muda</li>
              <li className="opacity-80">Aksi Sosial Kesehatan</li>
              <li className="opacity-80">Ketahanan Pangan</li>
              <li className="opacity-80">Advokasi Kebijakan</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Kontak</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                <span className="opacity-80">Jl. Raya Sidoarjo No. 123, Sidoarjo, Jawa Timur</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="opacity-80">+62 31 8945 6789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="opacity-80">info@nasdemsidoarjo.id</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-80">
            © 2025 DPD Partai NasDem Sidoarjo. Hak Cipta Dilindungi. | Periode Kepengurusan 2024-2029
          </p>
        </div>
      </div>
    </footer>
  )
}
