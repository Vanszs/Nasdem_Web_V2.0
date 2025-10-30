"use client";

import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useCmsContactStore } from "@/store/cms-contact";
import Link from "next/link";

const NasdemFooter = () => {
  const { contact, fetchContact } = useCmsContactStore();
  useEffect(() => {
    fetchContact();
  }, [fetchContact]);
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
                <span className="font-bold text-primary-foreground text-xl">
                  DPD Partai NasDem
                </span>
                <span className="text-primary-foreground/80 text-sm">
                  Kabupaten Sidoarjo
                </span>
              </div>
            </div>

            <p className="text-primary-foreground/90 mb-6 leading-relaxed max-w-md">
              Membangun Indonesia yang lebih baik melalui Gerakan Perubahan dan
              Restorasi Indonesia. Bersama-sama menuju Sidoarjo yang maju, adil,
              dan sejahtera.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="text-secondary h-5 w-5 flex-shrink-0" />
                <span className="text-primary-foreground/90 text-sm">
                  {contact?.address}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-secondary h-5 w-5 flex-shrink-0" />
                <span className="text-primary-foreground/90 text-sm">
                  {contact?.phone}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-secondary h-5 w-5 flex-shrink-0" />
                <span className="text-primary-foreground/90 text-sm">
                  {contact?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-primary-foreground text-lg mb-4">
              Menu Utama
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/#profil"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Profil Partai
                </Link>
              </li>
              <li>
                <Link
                  href="/program"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Program Kerja
                </Link>
              </li>
              <li>
                <Link
                  href="/berita"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Berita & Kegiatan
                </Link>
              </li>
              <li>
                <Link
                  href="/galeri"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Galeri
                </Link>
              </li>
              <li>
                <Link
                  href="/struktur"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Struktur Organisasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-bold text-primary-foreground text-lg mb-4">
              Program Unggulan
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/program"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  NasDem Muda
                </Link>
              </li>
              <li>
                <Link
                  href="/program"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Pemberdayaan UMKM
                </Link>
              </li>
              <li>
                <Link
                  href="/program"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Pendidikan Inklusif
                </Link>
              </li>
              <li>
                <Link
                  href="/program"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Aksi Sosial Kesehatan
                </Link>
              </li>
              <li>
                <Link
                  href="/program"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Advokasi Kebijakan
                </Link>
              </li>
              <li>
                <Link
                  href="/program"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Pelatihan Politik
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-primary-foreground/5 rounded-2xl p-8 mb-12 border border-primary-foreground/10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="font-bold text-primary-foreground text-xl mb-2">
                Dapatkan Update Terbaru
              </h4>
              <p className="text-primary-foreground/80 text-sm">
                Berlangganan newsletter untuk mendapatkan informasi program dan
                kegiatan terbaru.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 rounded-lg bg-card text-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button
                variant="secondary"
                className="font-semibold whitespace-nowrap"
              >
                Berlangganan
              </Button>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center">
          <h4 className="font-bold text-primary-foreground text-lg mb-6">
            Ikuti Media Sosial Kami
          </h4>
          <div className="flex justify-center gap-4 mb-8">
            <Link
              href={contact?.facebookUrl || "#"}
              className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href={contact?.instagramUrl || "#"}
              className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href={contact?.youtubeUrl || "#"}
              className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </Link>
            <Link
              href={contact?.twitterUrl || "#"}
              className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <div>© 2025 DPD Partai NasDem Sidoarjo. Hak Cipta Dilindungi.</div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-secondary transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="hover:text-secondary transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link
                href="/kontak"
                className="hover:text-secondary transition-colors"
              >
                Kontak
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NasdemFooter;
