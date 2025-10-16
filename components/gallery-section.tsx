"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export function GallerySection() {
  const [activeTab, setActiveTab] = useState("foto");

  const { data, isLoading } = useQuery({
    queryKey: ["gallery", "homepage"],
    queryFn: async () => {
      const res = await fetch(`/api/galleries`);
      if (!res.ok) throw new Error("Gagal memuat galeri");
      const json = await res.json();
      return json?.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  type Activity = {
    id: number;
    title: string;
    description?: string | null;
    category?: string | null;
    media: Array<{
      id: number;
      type: "image" | "video";
      url: string;
      caption?: string | null;
    }>;
  };

  const { photos, videos } = useMemo(() => {
    const items = (data as Activity[]) || [];
    const media = items.flatMap((a) =>
      a.media.map((m) => ({ ...m, activityTitle: a.title }))
    );
    return {
      photos: media.filter((m) => m.type === "image").slice(0, 6),
      videos: media.filter((m) => m.type === "video").slice(0, 4),
    };
  }, [data]);

  return (
    <section
      id="galeri"
      className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-nasdem-orange/10 rounded-full px-5 py-2 mb-4 shadow-sm border border-nasdem-orange/20">
            <div className="w-2 h-2 bg-nasdem-orange rounded-full animate-pulse"></div>
            <span className="text-nasdem-blue text-sm font-semibold">
              Dokumentasi
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#001B55] mb-4 leading-tight">
            Galeri Multimedia
          </h2>
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
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden rounded-2xl border-2 border-nasdem-blue/20"
                >
                  <div className="w-full h-64 bg-gray-100 animate-pulse" />
                </Card>
              ))
            ) : photos.length === 0 ? (
              <div className="col-span-full text-center text-[#6B7280]">
                Belum ada foto.
              </div>
            ) : (
              photos.map((m, index) => (
                <Card
                  key={m.id}
                  className="overflow-hidden p-0 group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up rounded-2xl border-2 border-nasdem-blue/20 hover:border-nasdem-blue/40 shadow-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative w-full h-80">
                    <Image
                      src={m.url || "/placeholder.svg"}
                      alt={
                        m.caption ||
                        m.activityTitle ||
                        `Kegiatan NasDem Sidoarjo ${index + 1}`
                      }
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                      <p className="relative z-10 font-bold tracking-wide text-white text-sm line-clamp-2">
                        {m.caption || m.activityTitle}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "video" && (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden rounded-2xl border-2 border-nasdem-blue/20"
                >
                  <div className="w-full h-64 bg-gray-100 animate-pulse" />
                </Card>
              ))
            ) : videos.length === 0 ? (
              <div className="col-span-full text-center text-[#6B7280]">
                Belum ada video.
              </div>
            ) : (
              videos.map((v, index) => (
                <Card
                  key={v.id}
                  className="overflow-hidden p-0 group hover:shadow-2xl transition-all duration-300 animate-fade-in-up rounded-2xl border-2 border-nasdem-blue/20 hover:border-nasdem-blue/40 shadow-lg hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative w-full h-80">
                    {/* Lightweight video preview: image overlay or iframe (if YouTube embed URL) */}
                    {v.url.includes("youtube.com") ||
                    v.url.includes("youtu.be") ? (
                      <iframe
                        src={v.url}
                        className="w-full h-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={v.caption || `Video ${index + 1}`}
                      />
                    ) : (
                      <Image
                        src={"/placeholder.svg"}
                        alt={v.caption || `Video ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                      <p className="relative z-10 font-bold tracking-wide text-white text-sm line-clamp-2">
                        {v.caption}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
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
  );
}
