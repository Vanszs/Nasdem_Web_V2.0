"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building } from "lucide-react"

export function OrganizationSection() {
  const leadership = [
    {
      name: "Muh. Zakaria Dimas Pratama, S.Kom",
      position: "Ketua DPD",
      period: "2024-2029",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Dr. Siti Aminah, M.Si",
      position: "Sekretaris",
      period: "2024-2029",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Ahmad Fauzi, S.E",
      position: "Bendahara",
      period: "2024-2029",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const departments = [
    { name: "Bidang Organisasi", head: "Ir. Bambang Sutrisno" },
    { name: "Bidang Politik & Hukum", head: "Dr. Ratna Sari, S.H" },
    { name: "Bidang Ekonomi & UMKM", head: "Drs. Agus Salim" },
    { name: "Bidang Sosial & Budaya", head: "Hj. Fatimah, S.Sos" },
    { name: "Bidang Pemuda & Olahraga", head: "M. Rizki Pratama, S.Pd" },
    { name: "Bidang Perempuan & Anak", head: "Dr. Nurul Hidayah" },
  ]

  return (
    <section id="organisasi" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Struktur Organisasi</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Kepengurusan DPD Partai NasDem Sidoarjo periode 2024-2029
          </p>
        </div>

        {/* Leadership */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-primary text-center mb-8 animate-fade-in-up">Pimpinan DPD</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {leadership.map((leader, index) => (
              <Card
                key={index}
                className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                    <img
                      src={leader.image || "/placeholder.svg"}
                      alt={leader.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardTitle className="text-primary">{leader.name}</CardTitle>
                  <p className="text-accent font-semibold">{leader.position}</p>
                  <p className="text-sm text-muted-foreground">{leader.period}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div>
          <h3 className="text-2xl font-bold text-primary text-center mb-8 animate-fade-in-up">Bidang-Bidang</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Building className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-2">{dept.name}</h4>
                      <p className="text-sm text-muted-foreground">Kepala: {dept.head}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">25</div>
            <div className="text-sm text-muted-foreground">Pengurus Inti</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">1000+</div>
            <div className="text-sm text-muted-foreground">Anggota</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">40%</div>
            <div className="text-sm text-muted-foreground">Keterwakilan Perempuan</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">18</div>
            <div className="text-sm text-muted-foreground">Kecamatan</div>
          </div>
        </div>
      </div>
    </section>
  )
}
