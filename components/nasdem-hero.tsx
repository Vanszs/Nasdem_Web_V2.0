import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Trophy } from "lucide-react";
import Image from "next/image";

const NasdemHero = () => {
  return (
    <section id="beranda" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={"/nasdem-hero.jpg"}
          alt="Kantor DPD Partai NasDem Sidoarjo"
          fill
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span className="text-primary-foreground text-sm font-medium">
              Periode Kepengurusan 2024-2029
            </span>
          </div>

          {/* Main Content */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
              DPD Partai <span className="text-secondary">NasDem</span>
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl">Sidoarjo</span>
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl leading-relaxed">
              Membangun Indonesia yang lebih baik melalui{" "}
              <span className="text-secondary font-semibold">
                Gerakan Perubahan
              </span>{" "}
              dan{" "}
              <span className="text-secondary font-semibold">
                Restorasi Indonesia
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="hover-scale group font-semibold bg-secondary text-primary hover:bg-secondary/90"
              >
                <span>Bergabung dengan Kami</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold backdrop-blur-sm"
              >
                Lihat Program Kerja
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 animate-fade-in">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-secondary h-6 w-6" />
                <span className="text-3xl font-bold text-primary-foreground">
                  500+
                </span>
              </div>
              <p className="text-primary-foreground/80 text-sm">Kader Aktif</p>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="text-secondary h-6 w-6" />
                <span className="text-3xl font-bold text-primary-foreground">
                  103
                </span>
              </div>
              <p className="text-primary-foreground/80 text-sm">
                Kelompok Tani Dibina
              </p>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-secondary h-6 w-6" />
                <span className="text-3xl font-bold text-primary-foreground">
                  2025
                </span>
              </div>
              <p className="text-primary-foreground/80 text-sm">
                Tahun Pelayanan Aktif
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-secondary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default NasdemHero;
