import NasdemHeader from "@/components/nasdem-header"
import NasdemFooter from "@/components/nasdem-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Phone, Mail } from "lucide-react"
import OrganizationStructure from "@/components/organization-structure"
// Remove Supabase dependency: provide mock data with same shape
type Kader = { id: string; full_name: string; phone?: string; address?: string }
type TPS = {
  id: string
  name: string
  number: number
  coordinator?: { id: string; full_name: string; email: string; phone?: string }
  kaders: Kader[]
}
type Desa = { id: string; name: string; code: string; tps: TPS[] }
type Kecamatan = { id: string; name: string; code: string; desa: Desa[] }

async function getOrganizationData(): Promise<Kecamatan[]> {
  // Minimal sample to preserve layout without external data source
  const sample: Kecamatan[] = [
    {
      id: "kec-1",
      name: "Sidoarjo",
      code: "SID",
      desa: [
        {
          id: "desa-1",
          name: "Pekarungan",
          code: "PEK",
          tps: [
            {
              id: "tps-1",
              name: "TPS Pekarungan",
              number: 1,
              coordinator: {
                id: "u-1",
                full_name: "Agus Salim",
                email: "agus@example.com",
                phone: "0812-1111-2222",
              },
              kaders: [
                { id: "k-1", full_name: "Budi Santoso", phone: "0812-3333-4444" },
                { id: "k-2", full_name: "Siti Aminah" },
              ],
            },
            {
              id: "tps-2",
              name: "TPS Pekarungan",
              number: 2,
              kaders: [
                { id: "k-3", full_name: "Rizki Pratama" },
                { id: "k-4", full_name: "Dewi Sartika" },
              ],
            },
          ],
        },
        {
          id: "desa-2",
          name: "Jati",
          code: "JTI",
          tps: [
            {
              id: "tps-3",
              name: "TPS Jati",
              number: 3,
              kaders: [
                { id: "k-5", full_name: "Eko Prasetyo" },
                { id: "k-6", full_name: "Maya Kusuma" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "kec-2",
      name: "Waru",
      code: "WRU",
      desa: [
        {
          id: "desa-3",
          name: "Kureksari",
          code: "KRS",
          tps: [
            {
              id: "tps-4",
              name: "TPS Kureksari",
              number: 1,
              kaders: [
                { id: "k-7", full_name: "Bambang Sutrisno" },
                { id: "k-8", full_name: "Indira Sari" },
              ],
            },
          ],
        },
      ],
    },
  ]

  return sample
}

export default async function StrukturPage() {
  const organizationData = await getOrganizationData()

  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />

      {/* Header */}
      <section className="bg-nasdem-blue text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Struktur Organisasi</h1>
          <p className="text-xl text-white/90">Kepengurusan DPD Partai NasDem Sidoarjo Periode 2024-2029</p>
        </div>
      </section>

      {/* Main Structure */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-nasdem-blue mb-4">Pengurus Harian DPD</h2>
            <p className="text-lg text-gray-600">Struktur kepengurusan utama DPD Partai NasDem Sidoarjo</p>
          </div>

          {/* Chairman */}
          <div className="text-center mb-12">
            <Card className="inline-block p-8 bg-nasdem-light-gray">
              <CardContent className="text-center space-y-4">
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Ketua DPD"
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-nasdem-orange"
                />
                <div>
                  <h3 className="text-2xl font-bold text-nasdem-blue">H. Ahmad Mulyadi, S.H.</h3>
                  <p className="text-nasdem-orange font-semibold text-lg">Ketua DPD</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
                    <Phone className="h-4 w-4" />
                    <span>0812-3456-7890</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vice Chairmen */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 text-center">
              <CardContent className="space-y-4">
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Wakil Ketua 1"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-nasdem-orange"
                />
                <div>
                  <h3 className="text-xl font-bold text-nasdem-blue">Hj. Siti Aminah, M.Si.</h3>
                  <p className="text-nasdem-orange font-semibold">Wakil Ketua I</p>
                  <p className="text-sm text-gray-600">Bidang Organisasi & Kaderisasi</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="space-y-4">
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Wakil Ketua 2"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-nasdem-orange"
                />
                <div>
                  <h3 className="text-xl font-bold text-nasdem-blue">Drs. Bambang Sutrisno</h3>
                  <p className="text-nasdem-orange font-semibold">Wakil Ketua II</p>
                  <p className="text-sm text-gray-600">Bidang Program & Kebijakan</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Positions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { name: "Dr. Indira Sari, M.M.", position: "Sekretaris", bidang: "Administrasi & Kesekretariatan" },
              { name: "H. Wahyu Hidayat, S.E.", position: "Bendahara", bidang: "Keuangan & Aset" },
              {
                name: "Ir. Suryanto, M.T.",
                position: "Ketua Bidang Pembangunan",
                bidang: "Infrastruktur & Lingkungan",
              },
              {
                name: "Dr. Maya Kusuma, S.Pd.",
                position: "Ketua Bidang Pendidikan",
                bidang: "Pendidikan & Kebudayaan",
              },
              { name: "H. Rizki Pratama, S.H.", position: "Ketua Bidang Hukum", bidang: "Hukum & HAM" },
              {
                name: "Hj. Dewi Sartika, S.Sos.",
                position: "Ketua Bidang Perempuan",
                bidang: "Pemberdayaan Perempuan",
              },
            ].map((person, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow">
                <CardContent className="space-y-3">
                  <img
                    src={`/placeholder.svg?height=100&width=100&query=Indonesian political leader portrait ${index % 2 === 0 ? "male" : "female"}`}
                    alt={person.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-nasdem-orange"
                  />
                  <div>
                    <h4 className="font-bold text-nasdem-blue">{person.name}</h4>
                    <p className="text-nasdem-orange font-semibold text-sm">{person.position}</p>
                    <p className="text-xs text-gray-600">{person.bidang}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Regional Structure */}
          <div className="bg-nasdem-light-gray rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-nasdem-blue text-center mb-8">
              Struktur Per Daerah Pemilihan (Dapil)
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { dapil: "Dapil 1", wilayah: "Sidoarjo, Waru, Gedangan", koordinator: "H. Agus Salim, S.H." },
                { dapil: "Dapil 2", wilayah: "Taman, Sepanjang, Sukodono", koordinator: "Hj. Ratna Dewi, M.Si." },
                { dapil: "Dapil 3", wilayah: "Candi, Porong, Krembung", koordinator: "Drs. Eko Prasetyo" },
                { dapil: "Dapil 4", wilayah: "Krian, Balongbendo, Wonoayu", koordinator: "H. Sutrisno, S.E." },
                { dapil: "Dapil 5", wilayah: "Tanggulangin, Jabon, Buduran", koordinator: "Ir. Sari Indah, M.T." },
                { dapil: "Dapil 6", wilayah: "Tarik, Prambon, Tulangan", koordinator: "Dr. Budi Santoso" },
              ].map((dapil, index) => (
                <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-nasdem-orange rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <h3 className="font-bold text-nasdem-blue">{dapil.dapil}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-nasdem-orange mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{dapil.wilayah}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-nasdem-orange mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-semibold text-nasdem-blue">{dapil.koordinator}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-nasdem-blue text-center mb-8">Struktur Organisasi Lengkap</h2>
            <p className="text-center text-gray-600 mb-8">
              Struktur lengkap per Kecamatan, Desa, TPS, Koordinator, dan Kader
            </p>

            <OrganizationStructure data={organizationData} />
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-nasdem-blue mb-4">Ingin Bergabung atau Berkolaborasi?</h3>
            <p className="text-lg text-gray-600 mb-6">Hubungi pengurus terdekat di wilayah Anda atau kantor DPD kami</p>
            <Button size="lg" className="bg-nasdem-orange hover:bg-nasdem-dark-red text-white font-semibold px-8">
              <Mail className="mr-2 h-5 w-5" />
              Hubungi Kami
            </Button>
          </div>
        </div>
      </section>

      <NasdemFooter />
    </div>
  )
}
