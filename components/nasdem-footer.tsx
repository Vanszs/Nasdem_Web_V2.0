import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter } from "lucide-react"
import Image from "next/image"

const NasdemFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 flex-shrink-0 rounded-lg border-2 border-white/20 p-1 bg-white/5">
                <Image
                  src="/logo-nasdem.png"
                  alt="Logo NasDem"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-primary-foreground text-xl">DPD Partai NasDem</span>
                <span className="text-primary-foreground/80 text-sm">Kabupaten Sidoarjo</span>
              </div>
            </div>

            <p className="text-primary-foreground/90 mb-6 leading-relaxed max-w-md">
              Membangun Indonesia yang lebih baik melalui Gerakan Perubahan dan Restorasi Indonesia. Bersama-sama menuju
              Sidoarjo yang maju, adil, dan sejahtera.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="text-secondary h-5 w-5 flex-shrink-0" />
                <span className="text-primary-foreground/90 text-sm">
                  Jl. Raya Sidoarjo, Kab. Sidoarjo, Jawa Timur 61219
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-secondary h-5 w-5 flex-shrink-0" />
                <span className="text-primary-foreground/90 text-sm">(031) 1234-5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-secondary h-5 w-5 flex-shrink-0" />
                <span className="text-primary-foreground/90 text-sm">dpd.sidoarjo@nasdem.id</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-primary-foreground text-lg mb-4">Menu Utama</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#beranda"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a href="#profil" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Profil Partai
                </a>
              </li>
              <li>
                <a
                  href="#program"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Program Kerja
                </a>
              </li>
              <li>
                <a href="#berita" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Berita & Kegiatan
                </a>
              </li>
              <li>
                <a href="#galeri" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Galeri
                </a>
              </li>
              <li>
                <a
                  href="#struktur"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Struktur Organisasi
                </a>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-bold text-primary-foreground text-lg mb-4">Program Unggulan</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  NasDem Muda
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Pemberdayaan UMKM
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Pendidikan Inklusif
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Aksi Sosial Kesehatan
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Advokasi Kebijakan
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Pelatihan Politik
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-primary-foreground/5 rounded-2xl p-8 mb-12 border border-primary-foreground/10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="font-bold text-primary-foreground text-xl mb-2">Dapatkan Update Terbaru</h4>
              <p className="text-primary-foreground/80 text-sm">
                Berlangganan newsletter untuk mendapatkan informasi program dan kegiatan terbaru.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 rounded-lg bg-card text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button variant="secondary" className="font-semibold whitespace-nowrap">
                Berlangganan
              </Button>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center">
          <h4 className="font-bold text-primary-foreground text-lg mb-6">Ikuti Media Sosial Kami</h4>
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://facebook.com/sidoarjo.nasdem.id"
              className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all hover-scale"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/sidoarjo.nasdem.id"
              className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all hover-scale"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com/@sidoarjonasdem"
              className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all hover-scale"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/sidoarjonasdem"
              className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all hover-scale"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <div>© 2025 DPD Partai NasDem Sidoarjo. Hak Cipta Dilindungi.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-secondary transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                Syarat & Ketentuan
              </a>
              <a href="#kontak" className="hover:text-secondary transition-colors">
                Kontak
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default NasdemFooter
