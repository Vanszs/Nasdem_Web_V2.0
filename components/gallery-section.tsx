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
    <section id="galeri" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Galeri Multimedia</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Dokumentasi kegiatan dan program DPD NasDem Sidoarjo
          </p>
        </div>

        <div className="flex justify-center mb-8 animate-fade-in-up">
          <div className="bg-secondary rounded-lg p-1">
            <Button
              variant={activeTab === "foto" ? "default" : "ghost"}
              onClick={() => setActiveTab("foto")}
              className={activeTab === "foto" ? "bg-accent text-white" : ""}
            >
              Foto
            </Button>
            <Button
              variant={activeTab === "video" ? "default" : "ghost"}
              onClick={() => setActiveTab("video")}
              className={activeTab === "video" ? "bg-accent text-white" : ""}
            >
              Video
            </Button>
          </div>
        </div>

        {activeTab === "foto" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {photos.map((photo, index) => (
              <Card
                key={index}
                className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
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
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-fade-in-up">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="Video Profil Ketua"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-primary">Profil Ketua DPD NasDem Sidoarjo</h3>
              </div>
            </Card>
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-fade-in-up animate-delay-200">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="Video Kegiatan Sosial"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-primary">Dokumentasi Kegiatan Sosial</h3>
              </div>
            </Card>
          </div>
        )}

        <div className="text-center animate-fade-in-up">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
            Lihat Semua {activeTab === "foto" ? "Foto" : "Video"}
          </Button>
        </div>
      </div>
    </section>
  )
}
