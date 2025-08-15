"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Briefcase, Heart, Sprout, Shield } from "lucide-react"

export function ProgramsSection() {
  const programs = [
    {
      icon: GraduationCap,
      title: "Pendidikan Inklusif",
      description: "Program beasiswa PIP/KIP dan pelatihan keterampilan untuk generasi muda Sidoarjo",
      color: "bg-blue-500",
    },
    {
      icon: Briefcase,
      title: "Pemberdayaan UMKM",
      description: "Fasilitasi modal usaha dan pelatihan bisnis untuk mengembangkan ekonomi kerakyatan",
      color: "bg-green-500",
    },
    {
      icon: Users,
      title: "NasDem Muda",
      description: "Program kaderisasi pemuda 17-30 tahun dengan fokus kepemimpinan dan edukasi politik",
      color: "bg-purple-500",
    },
    {
      icon: Heart,
      title: "Aksi Sosial Kesehatan",
      description: "Fogging anti DBD, pembagian sembako, dan program kesehatan masyarakat",
      color: "bg-red-500",
    },
    {
      icon: Sprout,
      title: "Ketahanan Pangan",
      description: "Distribusi 709 ton benih padi kepada 103 kelompok tani untuk swasembada pangan",
      color: "bg-yellow-500",
    },
    {
      icon: Shield,
      title: "Advokasi Kebijakan",
      description: "Pengawasan dan masukan kritis terhadap RPJMD Sidoarjo 2025-2029",
      color: "bg-indigo-500",
    },
  ]

  return (
    <section id="program" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Program & Kegiatan</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Program kerja prioritas DPD NasDem Sidoarjo untuk mewujudkan kesejahteraan dan kemajuan masyarakat Sidoarjo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {programs.map((program, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 ${program.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <program.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-primary">{program.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{program.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in-up">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
            Lihat Semua Program
          </Button>
        </div>
      </div>
    </section>
  )
}
