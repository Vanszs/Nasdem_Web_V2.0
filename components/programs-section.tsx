"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  GraduationCap,
  Sprout,
  Heart,
  Building,
  Users,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

type Program = {
  id: number;
  name: string;
  description?: string | null;
  category?: string | null;
  status?: string | null;
  photoUrl?: string | null;
};

function categoryIcon(category?: string | null) {
  const c = (category || "").toLowerCase();
  if (c.includes("didik") || c.includes("sekol") || c.includes("pip"))
    return GraduationCap;
  if (
    c.includes("tani") ||
    c.includes("umkm") ||
    c.includes("ekonomi") ||
    c.includes("farming")
  )
    return Sprout;
  if (c.includes("sosial") || c.includes("kesehat")) return Heart;
  if (c.includes("kebijakan") || c.includes("advokasi")) return Building;
  if (c.includes("pelatihan") || c.includes("politik") || c.includes("laga"))
    return Briefcase;
  if (c.includes("muda") || c.includes("kader")) return Users;
  return Users;
}

export function ProgramsSection({
  programs = [] as Program[],
}: {
  programs?: Program[];
}) {
  return (
    <section
      id="program"
      className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-nasdem-orange/10 rounded-full px-5 py-2 mb-4 shadow-sm border border-nasdem-orange/20">
            <div className="w-2 h-2 bg-nasdem-orange rounded-full animate-pulse"></div>
            <span className="text-nasdem-blue text-sm font-semibold">
              Program Unggulan
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-nasdem-blue mb-4 leading-tight">
            Program <span className="text-nasdem-orange">Kerja</span> Kami
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Komitmen nyata untuk memajukan Sidoarjo melalui program-program yang
            berdampak langsung bagi masyarakat.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {programs.map((program, index) => {
            const IconComponent = categoryIcon(program.category);
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 md:p-8 border-2 border-nasdem-blue/20 hover:border-nasdem-blue/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-nasdem-blue/10 rounded-lg flex items-center justify-center group-hover:bg-nasdem-orange/10 transition-colors border border-nasdem-blue/20 group-hover:border-nasdem-orange/30">
                    <IconComponent className="text-nasdem-blue group-hover:text-nasdem-orange h-6 w-6 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-nasdem-blue mb-2 group-hover:text-nasdem-blue transition-colors">
                      {program.name}
                    </h3>
                    {program.category && (
                      <div className="inline-block bg-nasdem-orange/10 text-nasdem-orange text-xs font-medium px-2 py-1 rounded-full mb-3">
                        {program.category}
                      </div>
                    )}
                  </div>
                </div>
                {program.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {program.description}
                  </p>
                )}
                <Link
                  href={"/program"}
                  className={buttonVariants({
                    variant: "ghost",
                    className:
                      "text-nasdem-blue hover:text-nasdem-orange p-2 h-auto",
                  })}
                >
                  Selengkapnya →
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-nasdem-blue rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-nasdem-blue via-nasdem-blue to-nasdem-orange/20"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Bergabunglah dalam Gerakan Perubahan
            </h3>
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              Mari bersama-sama membangun Sidoarjo yang lebih maju, adil, dan
              sejahtera untuk semua.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-nasdem-orange hover:bg-nasdem-orange/90 text-white font-semibold">
                Daftar NasDem Muda
              </Button>
              <Button
                variant="outline"
                className="border-white bg-white/10 text-white hover:bg-white hover:text-nasdem-blue font-semibold backdrop-blur-sm"
                onClick={() => (window.location.href = "/program")}
              >
                Lihat Semua Program
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
