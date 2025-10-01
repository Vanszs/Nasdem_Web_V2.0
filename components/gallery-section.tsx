"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function GallerySection() {
  const [activeTab, setActiveTab] = useState("foto")

  const photos = [
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ]

  return (
    <section id="galeri" className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-nasdem-orange/10 rounded-full px-5 py-2 mb-4 shadow-sm border border-nasdem-orange/20">
            <div className="w-2 h-2 bg-nasdem-orange rounded-full animate-pulse"></div>
            <span className="text-nasdem-blue text-sm font-semibold">Dokumentasi</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#001B55] mb-4 leading-tight">Galeri Multimedia</h2>
          <p className="text-base md:text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            Dokumentasi kegiatan dan program DPD NasDem Sidoarjo
          </p>
        </div>

        <div className="flex justify-center mb-12 animate-fade-in-up">
          <div className="bg-white rounded-2xl p-3 shadow-xl border-2 border-nasdem-blue/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Button
                variant={activeTab === "foto" ? "default" : "ghost"}
                onClick={() => setActiveTab("foto")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 min-w-[120px] ${
                  activeTab === "foto"
                    ? "bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl"
                    : "text-[#6B7280] hover:bg-[#001B55]/5 hover:text-[#001B55] border border-transparent hover:border-[#001B55]/20"
                }`}
              >
                Foto
              </Button>
              <Button
                variant={activeTab === "video" ? "default" : "ghost"}
                onClick={() => setActiveTab("video")}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 min-w-[120px] ${
                  activeTab === "video"
                    ? "bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl"
                    : "text-[#6B7280] hover:bg-[#001B55]/5 hover:text-[#001B55] border border-transparent hover:border-[#001B55]/20"
                }`}
              >
                Video
              </Button>
            </div>
          </div>
        </div>

        {activeTab === "foto" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {photos.map((photo, index) => (
              <Card
                key={index}
                className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up rounded-2xl border-2 border-nasdem-blue/20 hover:border-nasdem-blue/40 shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={photo || "/placeholder.svg"}
                  alt={`Kegiatan NasDem Sidoarjo ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Card>
            ))}
          </div>
        )}

        {activeTab === "video" && (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
            <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 animate-fade-in-up rounded-2xl border-2 border-nasdem-blue/20 hover:border-nasdem-blue/40 shadow-lg hover:-translate-y-1">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="Video Profil Ketua"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#FF9C04] rounded-full flex items-center justify-center shadow-lg hover:bg-[#001B55] transition-colors duration-300">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-[#001B55] text-lg">Profil Ketua DPD NasDem Sidoarjo</h3>
              </div>
            </Card>
            <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 animate-fade-in-up animate-delay-200 rounded-2xl border-2 border-nasdem-blue/20 hover:border-nasdem-blue/40 shadow-lg hover:-translate-y-1">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="Video Kegiatan Sosial"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#FF9C04] rounded-full flex items-center justify-center shadow-lg hover:bg-[#001B55] transition-colors duration-300">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-[#001B55] text-lg">Dokumentasi Kegiatan Sosial</h3>
              </div>
            </Card>
          </div>
        )}

        <div className="text-center animate-fade-in-up pt-8">
          <Button
            variant="outline"
            size="lg"
            className="hover-fade-up font-semibold border-2 border-nasdem-blue/30 bg-nasdem-blue/5 text-nasdem-blue hover:bg-nasdem-blue hover:text-white px-10 py-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
            onClick={() => (window.location.href = "/galeri")}
          >
            Lihat Semua {activeTab === "foto" ? "Foto" : "Video"}
          </Button>
        </div>
      </div>
    </section>
  )
}
