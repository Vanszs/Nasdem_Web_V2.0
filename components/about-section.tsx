"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";
import { Button, buttonVariants } from "@/components/ui/button";
import { Target, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
type About = {
  vision?: string | null;
  mission?: string | null;
  videoUrl?: string | null;
};

export function AboutSection({ about }: { about?: About | null }) {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const closePlayer = () => {
    setIsPlaying(false);
    setExpanded(false);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expanded) {
        closePlayer();
      }
    };
    if (expanded) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [expanded]);

  return (
    <section
      id="profil"
      className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-nasdem-orange/10 rounded-full px-5 py-2 mb-4 shadow-sm border border-nasdem-orange/20">
            <div className="w-2 h-2 bg-nasdem-orange rounded-full animate-pulse"></div>
            <span className="text-nasdem-blue text-sm font-semibold">
              Tentang Kami
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-nasdem-blue mb-4 leading-tight">
            Profil <span className="text-nasdem-orange">DPD NasDem</span>{" "}
            Sidoarjo
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Komitmen nyata untuk membangun Sidoarjo yang lebih maju, adil, dan
            sejahtera melalui gerakan perubahan.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16">
          {/* Video / Gambar */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-nasdem-blue/20 hover:border-nasdem-blue/40 hover:shadow-3xl transition-all duration-300">
              {about?.videoUrl ? (
                <ReactPlayer
                  src={about.videoUrl}
                  width="100%"
                  height="400px"
                  muted
                  playing={isPlaying}
                  controls={false}
                  onPlay={() => {
                    setExpanded(true);
                    setIsPlaying(true);
                  }}
                />
              ) : (
                <Image
                  src="/placeholder.svg"
                  alt="Rapat koordinasi DPD NasDem Sidoarjo"
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute pointer-events-none inset-0 bg-gradient-to-t from-nasdem-blue/40 via-nasdem-blue/10 to-transparent"></div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-2xl border-2 border-nasdem-blue/20 hover:border-nasdem-blue/40 hover:shadow-3xl transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-nasdem-blue mb-1">
                  2024-2029
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Periode Kepengurusan
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 md:space-y-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-nasdem-blue mb-6">
                Visi & Misi
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 border-2 border-nasdem-blue/20 shadow-lg hover:shadow-xl hover:border-nasdem-blue/40 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-nasdem-blue/10 rounded-lg flex items-center justify-center border border-nasdem-blue/20">
                      <Target className="text-nasdem-blue h-6 w-6" />
                    </div>
                    <div className="w-full">
                      <h4 className="font-bold text-nasdem-blue mb-2 text-base">
                        Visi
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed w-full">
                        {about?.vision ||
                          "Mewujudkan Sidoarjo sebagai daerah yang maju, demokratis, dan berkeadilan sosial melalui gerakan perubahan yang berkelanjutan."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-nasdem-blue/20 shadow-lg hover:shadow-xl hover:border-nasdem-blue/40 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-nasdem-orange/10 rounded-lg flex items-center justify-center border border-nasdem-orange/20">
                      <Heart className="text-nasdem-orange h-6 w-6" />
                    </div>
                    <div className="w-full">
                      <h4 className="font-bold text-nasdem-blue mb-2 text-base">
                        Misi
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {about?.mission ||
                          "Membangun kaderitas yang kuat, melayani masyarakat dengan integritas, dan mengadvokasi kebijakan pro-rakyat."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={"/program"}
              className={buttonVariants({
                variant: "outline",
                className:
                  "hover-fade-up font-semibold border-nasdem-blue bg-nasdem-blue/5 text-nasdem-blue hover:bg-nasdem-blue hover:text-white px-8 py-3",
              })}
            >
              Lihat Program Kerja
            </Link>
          </div>
        </div>
      </div>

      {/* 🆕 Cinematic Overlay dengan ReactPlayer + Framer Motion */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="video-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closePlayer}
          >
            {/* Close Button - Outside Video Card */}
            <button
              onClick={closePlayer}
              className="absolute cursor-pointer top-6 right-6 bg-white/90 hover:bg-white text-nasdem-blue text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-110 z-[1000]"
              aria-label="Close video"
            >
              ✕
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="relative w-[90vw] h-[70vh] bg-black rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ReactPlayer
                src={about?.videoUrl || ""}
                width="100%"
                height="100%"
                playing={isPlaying}
                controls
                onPlay={() => {
                  setExpanded(true);
                  setIsPlaying(true);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
