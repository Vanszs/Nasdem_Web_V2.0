import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  GraduationCap,
  Sprout,
  Heart,
  Building,
  Users,
  Briefcase,
  Calendar,
  Target,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react"
import NasdemHeader from "@/components/nasdem-header"
import NasdemFooter from "@/components/nasdem-footer"

const detailedPrograms = [
  {
    icon: GraduationCap,
    title: "Pendidikan Inklusif",
    description:
      "Program komprehensif untuk meningkatkan akses pendidikan berkualitas bagi seluruh masyarakat Sidoarjo.",
    target: "1000 penerima beasiswa",
    progress: 75,
    status: "Berlangsung",
    timeline: "2024-2026",
    details: [
      "Fasilitasi beasiswa PIP/KIP untuk siswa kurang mampu",
      "Pelatihan keterampilan digital untuk generasi muda",
      "Program literasi untuk orang dewasa",
      "Beasiswa kuliah untuk mahasiswa berprestasi",
    ],
    achievements: ["709 ton benih padi disalurkan", "150 siswa mendapat beasiswa"],
  },
  {
    icon: Sprout,
    title: "Ekonomi Kerakyatan",
    description: "Pemberdayaan ekonomi masyarakat melalui UMKM, pertanian modern, dan urban farming.",
    target: "200 UMKM dibina",
    progress: 60,
    status: "Berlangsung",
    timeline: "2024-2025",
    details: [
      "Pembinaan 103 kelompok tani aktif",
      "Pelatihan manajemen UMKM",
      "Program urban farming untuk ketahanan pangan",
      "Akses permodalan mikro",
    ],
    achievements: ["103 kelompok tani dibina", "85 UMKM mendapat bantuan modal"],
  },
  {
    icon: Heart,
    title: "Aksi Sosial Kesehatan",
    description: "Program kesehatan preventif dan bantuan sosial untuk masyarakat yang membutuhkan.",
    target: "12 kecamatan tercakup",
    progress: 90,
    status: "Berlangsung",
    timeline: "2024-2029",
    details: [
      "Program fogging pencegahan DBD rutin",
      "Pembagian sembako untuk keluarga prasejahtera",
      "Pemeriksaan kesehatan gratis",
      "Edukasi hidup sehat",
    ],
    achievements: ["Fogging di 50 desa", "500 paket sembako disalurkan"],
  },
  {
    icon: Building,
    title: "Advokasi Kebijakan",
    description: "Mengawal dan memberikan masukan konstruktif terhadap kebijakan pembangunan daerah.",
    target: "10 usulan kebijakan",
    progress: 40,
    status: "Berlangsung",
    timeline: "2025-2029",
    details: [
      "Pengawalan RPJMD Sidoarjo 2025-2029",
      "Advokasi kebijakan pro-rakyat",
      "Monitoring implementasi program daerah",
      "Dialog dengan stakeholder",
    ],
    achievements: ["3 usulan diterima DPRD", "5 hearing dengan pemerintah"],
  },
  {
    icon: Users,
    title: "NasDem Muda",
    description: "Platform pengembangan kepemimpinan dan partisipasi politik generasi muda berusia 17-30 tahun.",
    target: "500 anggota aktif",
    progress: 70,
    status: "Berlangsung",
    timeline: "2024-2029",
    details: [
      "Edukasi politik dan demokrasi",
      "Pelatihan kepemimpinan",
      "Kunjungan ke lembaga pemerintahan",
      "Kegiatan sosial interaktif",
    ],
    achievements: ["300 anggota terdaftar", "15 kegiatan pelatihan"],
  },
  {
    icon: Briefcase,
    title: "Pelatihan Politik",
    description: "Program pengembangan kapasitas kader melalui berbagai pelatihan dan workshop politik.",
    target: "200 kader terlatih",
    progress: 55,
    status: "Berlangsung",
    timeline: "2024-2026",
    details: [
      "Laboratorium Gerakan Perubahan (LAGA)",
      "Bimbingan teknis organisasi",
      "Workshop strategi kampanye",
      "Pelatihan public speaking",
    ],
    achievements: ["120 kader mengikuti LAGA", "8 workshop dilaksanakan"],
  },
]

export default function ProgramPage() {
  return (
    <div className="min-h-screen bg-nasdem-light-gray text-foreground">
      <NasdemHeader />

      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-nasdem-orange/10 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-nasdem-orange rounded-full animate-pulse"></div>
              <span className="text-nasdem-blue text-sm font-medium">Program Unggulan</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-nasdem-blue mb-4">
              Program <span className="text-nasdem-orange">Kerja</span> Lengkap
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Komitmen nyata DPD NasDem Sidoarjo untuk memajukan masyarakat melalui program-program strategis dan
              berkelanjutan periode 2024-2029.
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid gap-8 mb-16">
            {detailedPrograms.map((program, index) => {
              const IconComponent = program.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-nasdem-blue bg-white"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-nasdem-blue/10 rounded-xl flex items-center justify-center">
                        <IconComponent className="text-nasdem-blue h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <CardTitle className="text-2xl mb-2 text-nasdem-blue">{program.title}</CardTitle>
                            <CardDescription className="text-base leading-relaxed text-gray-600">
                              {program.description}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={program.status === "Berlangsung" ? "default" : "secondary"}
                            className="bg-nasdem-orange text-white"
                          >
                            {program.status}
                          </Badge>
                        </div>

                        {/* Progress and Stats */}
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Target size={14} />
                              <span>Target: {program.target}</span>
                            </div>
                            <Progress value={program.progress} className="h-2" />
                            <span className="text-xs text-gray-500">{program.progress}% tercapai</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={14} />
                            <span>Timeline: {program.timeline}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-nasdem-orange font-medium">
                            <Clock size={14} />
                            <span>Status: {program.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Program Details */}
                      <div>
                        <h5 className="font-semibold mb-3 text-nasdem-blue">Detail Program:</h5>
                        <ul className="space-y-2">
                          {program.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle size={14} className="text-nasdem-orange mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h5 className="font-semibold mb-3 text-nasdem-blue">Capaian Terkini:</h5>
                        <div className="space-y-2">
                          {program.achievements.map((achievement, idx) => (
                            <div key={idx} className="bg-nasdem-orange/10 rounded-lg p-3">
                              <span className="text-sm font-medium text-nasdem-orange">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tombol Daftar untuk Pendidikan Inklusif */}
                    {program.title === "Pendidikan Inklusif" && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <Link href="/program/pendidikan-inklusif/daftar">
                          <Button className="w-full bg-gradient-to-r from-nasdem-orange to-nasdem-orange/90 hover:from-nasdem-orange/90 hover:to-nasdem-orange text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                            <FileText className="mr-2 h-5 w-5" />
                            Daftar Program Pendidikan Inklusif (PIP)
                          </Button>
                        </Link>
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Tersedia untuk siswa kurang mampu dan berprestasi
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-nasdem-blue to-nasdem-orange text-white text-center">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Bergabunglah dalam Gerakan Perubahan</h3>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                Mari bersama-sama mewujudkan Sidoarjo yang lebih maju, adil, dan sejahtera melalui program-program
                nyata.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-nasdem-blue hover:bg-gray-100 font-semibold text-lg px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Daftar Sebagai Relawan
                </Button>
                <Button
                  variant="outline"
                  className="border-white bg-white/10 text-white hover:bg-white hover:text-nasdem-blue font-semibold text-lg px-8 py-3 rounded-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                >
                  Hubungi Tim Program
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <NasdemFooter />
    </div>
  )
}
