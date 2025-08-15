"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Eye, Target, Heart, Lightbulb } from "lucide-react"

export function AboutSection() {
  const values = [
    {
      icon: Eye,
      title: "Visi",
      description: "Menjadi partai politik yang terdepan dalam mewujudkan Indonesia yang berdaulat, adil, dan makmur",
    },
    {
      icon: Target,
      title: "Misi",
      description: "Membangun sistem politik yang demokratis, transparan, dan akuntabel untuk kesejahteraan rakyat",
    },
    {
      icon: Heart,
      title: "Nilai",
      description: "Keadilan, kejujuran, dan kepedulian sebagai fondasi dalam setiap langkah perjuangan",
    },
    {
      icon: Lightbulb,
      title: "Inovasi",
      description: "Menghadirkan solusi kreatif dan inovatif untuk tantangan pembangunan daerah",
    },
  ]

  return (
    <section id="profil" className="py-20 bg-nasdem-light-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-nasdem-blue mb-4">Tentang DPD NasDem Sidoarjo</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Partai NasDem Sidoarjo berkomitmen untuk menjadi garda terdepan dalam gerakan perubahan menuju Indonesia
            yang lebih baik, dimulai dari Kabupaten Sidoarjo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 animate-fade-in-up bg-white border-gray-200"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-nasdem-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-nasdem-orange/20 transition-colors">
                  <value.icon className="h-8 w-8 text-nasdem-orange" />
                </div>
                <h3 className="text-xl font-semibold text-nasdem-blue mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h3 className="text-2xl font-bold text-nasdem-blue mb-6">Sejarah & Pencapaian</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                DPD Partai NasDem Sidoarjo didirikan sebagai bagian dari gerakan perubahan nasional yang dipimpin oleh
                Partai NasDem. Sejak berdiri, kami telah konsisten memperjuangkan kepentingan masyarakat Sidoarjo.
              </p>
              <p className="text-gray-600">
                Di bawah kepemimpinan Muh. Zakaria Dimas Pratama, S.Kom (periode 2024-2029), DPD NasDem Sidoarjo terus
                mengembangkan program-program inovatif untuk pemberdayaan masyarakat dan pembangunan daerah.
              </p>
            </div>
          </div>

          <div className="animate-slide-in-right">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Kantor DPD NasDem Sidoarjo"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
