"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Target, Award } from "lucide-react"

export function HeroSection() {
  return (
    <section id="beranda" className="relative min-h-screen bg-nasdem-blue flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-nasdem-orange/20 to-transparent"></div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-1/2 lg:w-2/5">
        <div className="relative h-full">
          <img src="/placeholder.svg?height=800&width=600" alt="Gedung NasDem" className="w-full h-full object-cover" />
          {/* Gradient overlay that fades the image into the blue background */}
          <div className="absolute inset-0 bg-gradient-to-r from-nasdem-blue via-nasdem-blue/70 to-transparent"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              DPD Partai NasDem
              <span className="block text-nasdem-orange">Sidoarjo</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Gerakan Perubahan untuk Indonesia yang Lebih Baik
            </p>
            <p className="text-lg mb-8 opacity-80 max-w-2xl">
              Bersama membangun Sidoarjo yang maju, adil, dan sejahtera melalui kepemimpinan yang amanah dan program
              kerja yang nyata untuk rakyat.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="bg-nasdem-orange hover:bg-nasdem-orange/90 text-white font-medium group transition-all duration-200"
                onClick={() => (window.location.href = "/program")}
              >
                Lihat Program Kami
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="hover-fade-up border-white text-white hover:bg-nasdem-blue hover:text-white bg-transparent font-medium transition-all duration-200"
              >
                Bergabung Sekarang
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center animate-slide-in-left animate-delay-200">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-nasdem-orange" />
                </div>
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm opacity-80">Anggota Aktif</div>
              </div>
              <div className="text-center animate-slide-in-left animate-delay-400">
                <div className="flex justify-center mb-2">
                  <Target className="h-8 w-8 text-nasdem-orange" />
                </div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm opacity-80">Program Kerja</div>
              </div>
              <div className="text-center animate-slide-in-left animate-delay-600">
                <div className="flex justify-center mb-2">
                  <Award className="h-8 w-8 text-nasdem-orange" />
                </div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm opacity-80">Tahun Pengabdian</div>
              </div>
            </div>
          </div>

          <div className="animate-slide-in-right lg:block hidden">
            {/* This space is now used by the background building image */}
          </div>
        </div>
      </div>
    </section>
  )
}
