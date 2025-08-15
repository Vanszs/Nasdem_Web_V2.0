"use client"

import { Button } from "@/components/ui/button"
import { Target, Heart, Handshake, Award } from "lucide-react"

export function AboutSection() {
  return (
    <section id="profil" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-nasdem-orange/10 rounded-full px-4 py-2 mb-4">
            <div className="w-2 h-2 bg-nasdem-orange rounded-full"></div>
            <span className="text-nasdem-blue text-sm font-medium">Tentang Kami</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-nasdem-blue mb-4">
            Profil <span className="text-nasdem-orange">DPD NasDem</span> Sidoarjo
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Komitmen nyata untuk membangun Sidoarjo yang lebih maju, adil, dan sejahtera melalui gerakan perubahan.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Rapat koordinasi DPD NasDem Sidoarjo"
                className="w-full h-[400px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nasdem-blue/30 to-transparent"></div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl border">
              <div className="text-center">
                <div className="text-2xl font-bold text-nasdem-blue mb-1">2024-2029</div>
                <div className="text-sm text-gray-600">Periode Kepengurusan</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-nasdem-blue mb-4">Visi & Misi</h3>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-nasdem-blue/10 rounded-lg flex items-center justify-center">
                      <Target className="text-nasdem-blue h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-nasdem-blue mb-2">Visi</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Mewujudkan Sidoarjo sebagai daerah yang maju, demokratis, dan berkeadilan sosial melalui gerakan
                        perubahan yang berkelanjutan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-nasdem-orange/10 rounded-lg flex items-center justify-center">
                      <Heart className="text-nasdem-orange h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-nasdem-blue mb-2">Misi</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Membangun kaderitas yang kuat, melayani masyarakat dengan integritas, dan mengadvokasi kebijakan
                        pro-rakyat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="hover-fade-up font-semibold border-nasdem-blue bg-nasdem-blue/5 text-nasdem-blue hover:bg-nasdem-blue hover:text-white px-8 py-3"
              onClick={() => {
                const profilSection = document.getElementById("profil")
                if (profilSection) {
                  profilSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-nasdem-light-gray rounded-2xl p-8 md:p-12 mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-nasdem-blue mb-6 text-center">Sejarah & Pencapaian</h3>
          <div className="max-w-4xl mx-auto space-y-4 text-center">
            <p className="text-gray-600 text-lg leading-relaxed">
              DPD Partai NasDem Sidoarjo didirikan sebagai bagian dari gerakan perubahan nasional yang dipimpin oleh
              Partai NasDem. Sejak berdiri, kami telah konsisten memperjuangkan kepentingan masyarakat Sidoarjo.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Di bawah kepemimpinan{" "}
              <span className="font-semibold text-nasdem-blue">Muh. Zakaria Dimas Pratama, S.Kom</span> (periode
              2024-2029), DPD NasDem Sidoarjo terus mengembangkan program-program inovatif untuk pemberdayaan masyarakat
              dan pembangunan daerah.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-nasdem-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="text-nasdem-blue h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-nasdem-blue mb-3">Integritas</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Menjalankan amanah dengan jujur, transparan, dan bertanggung jawab kepada rakyat Sidoarjo.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-nasdem-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-nasdem-orange h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-nasdem-blue mb-3">Keunggulan</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Mengutamakan kualitas dalam setiap program dan pelayanan untuk mencapai hasil terbaik.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-nasdem-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-nasdem-blue h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-nasdem-blue mb-3">Kemanusiaan</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Mengutamakan kepentingan rakyat dan keadilan sosial dalam setiap keputusan politik.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
