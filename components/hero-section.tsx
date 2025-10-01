"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Target, Award, ChevronDown } from "lucide-react"

export function HeroSection() {
  const scrollToContent = () => {
    const aboutSection = document.getElementById('profil');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="beranda" className="relative bg-nasdem-blue flex items-center overflow-hidden min-h-[calc(100vh-80px)]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-nasdem-orange/20 to-transparent"></div>
      </div>

      {/* Background Image - Right Side */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 lg:w-2/5">
        <div className="relative h-full">
          <img 
            src="/placeholder.svg?height=800&width=600" 
            alt="Gedung NasDem" 
            className="w-full h-full object-cover opacity-30 lg:opacity-50" 
          />
          {/* Gradient overlay that fades the image into the blue background */}
          <div className="absolute inset-0 bg-gradient-to-r from-nasdem-blue via-nasdem-blue/85 to-nasdem-blue/50"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content - Left Side */}
            <div className="text-white space-y-6 md:space-y-7 animate-fade-in-up max-w-2xl">
              {/* Main Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight">
                  DPD Partai NasDem
                  <span className="block text-nasdem-orange mt-1">Sidoarjo</span>
                </h1>
              </div>

              {/* Tagline */}
              <div className="space-y-3 max-w-xl">
                <p className="text-lg sm:text-xl md:text-2xl font-semibold opacity-95 leading-snug">
                  Gerakan Perubahan untuk Indonesia yang Lebih Baik
                </p>
                <p className="text-sm sm:text-base opacity-85 leading-relaxed">
                  Bersama membangun Sidoarjo yang maju, adil, dan sejahtera melalui kepemimpinan yang amanah dan program kerja yang nyata untuk rakyat.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  size="lg"
                  className="bg-nasdem-orange hover:bg-nasdem-orange/90 text-white font-semibold text-base px-6 py-5 group transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  onClick={() => (window.location.href = "/program")}
                >
                  Lihat Program Kami
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-nasdem-blue bg-transparent font-semibold text-base px-6 py-5 transition-all duration-300 hover:scale-105"
                >
                  Bergabung Sekarang
                </Button>
              </div>

              {/* Stats - Enhanced Design */}
              <div className="pt-6 border-t border-white/20">
                <div className="grid grid-cols-3 gap-4 lg:gap-6">
                  <div className="group animate-slide-in-left animate-delay-200">
                    <div className="flex flex-col items-center lg:items-start space-y-1.5 transition-transform duration-300 group-hover:scale-105">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-nasdem-orange/20 flex items-center justify-center mb-1 group-hover:bg-nasdem-orange/30 transition-colors">
                        <Users className="h-5 w-5 lg:h-6 lg:w-6 text-nasdem-orange" />
                      </div>
                      <div className="text-xl md:text-2xl lg:text-3xl font-bold">1000+</div>
                      <div className="text-xs lg:text-sm opacity-80 text-center lg:text-left leading-tight">Anggota Aktif</div>
                    </div>
                  </div>
                  <div className="group animate-slide-in-left animate-delay-400">
                    <div className="flex flex-col items-center lg:items-start space-y-1.5 transition-transform duration-300 group-hover:scale-105">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-nasdem-orange/20 flex items-center justify-center mb-1 group-hover:bg-nasdem-orange/30 transition-colors">
                        <Target className="h-5 w-5 lg:h-6 lg:w-6 text-nasdem-orange" />
                      </div>
                      <div className="text-xl md:text-2xl lg:text-3xl font-bold">50+</div>
                      <div className="text-xs lg:text-sm opacity-80 text-center lg:text-left leading-tight">Program Kerja</div>
                    </div>
                  </div>
                  <div className="group animate-slide-in-left animate-delay-600">
                    <div className="flex flex-col items-center lg:items-start space-y-1.5 transition-transform duration-300 group-hover:scale-105">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-nasdem-orange/20 flex items-center justify-center mb-1 group-hover:bg-nasdem-orange/30 transition-colors">
                        <Award className="h-5 w-5 lg:h-6 lg:w-6 text-nasdem-orange" />
                      </div>
                      <div className="text-xl md:text-2xl lg:text-3xl font-bold">5</div>
                      <div className="text-xs lg:text-sm opacity-80 text-center lg:text-left leading-tight">Tahun Pengabdian</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Reserved for background image */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator - Enhanced */}
      <div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer hidden md:block"
        onClick={scrollToContent}
      >
        <div className="flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-all duration-300 group animate-bounce">
          <div className="relative w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2 group-hover:border-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/20">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-scroll-down group-hover:bg-white"></div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium tracking-wide">Scroll</span>
            <ChevronDown className="h-3 w-3" />
          </div>
        </div>
      </div>
    </section>
  )
}
