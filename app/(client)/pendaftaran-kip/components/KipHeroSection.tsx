import { GraduationCap, Users, BookOpen, Award } from "lucide-react";

export function KipHeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#001B55] via-[#001B55] to-[#001845] py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF9C04]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF9C04]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#FF9C04]/10 backdrop-blur-sm border border-[#FF9C04]/20 rounded-full px-6 py-2.5 mb-6">
          <GraduationCap className="w-4 h-4 text-[#FF9C04]" />
          <span className="text-white text-sm font-semibold tracking-wide">
            Program Beasiswa KIP Kuliah
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Pendaftaran <span className="text-[#FF9C04]">Beasiswa KIP</span>
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Kartu Indonesia Pintar Kuliah dari DPD Partai NasDem Sidoarjo untuk
          mendukung pendidikan tinggi mahasiswa Indonesia
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-1">
              <Users className="text-[#FF9C04] h-5 w-5" />
              <span className="text-2xl font-bold text-white">300+</span>
            </div>
            <p className="text-white/80 text-sm">Penerima Beasiswa</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-1">
              <BookOpen className="text-[#FF9C04] h-5 w-5" />
              <span className="text-2xl font-bold text-white">100%</span>
            </div>
            <p className="text-white/80 text-sm">Gratis Biaya Kuliah</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-1">
              <Award className="text-[#FF9C04] h-5 w-5" />
              <span className="text-2xl font-bold text-white">5 Tahun</span>
            </div>
            <p className="text-white/80 text-sm">Pengalaman Program</p>
          </div>
        </div>
      </div>
    </section>
  );
}
