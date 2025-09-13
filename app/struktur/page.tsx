import NasdemHeader from "@/components/nasdem-header"
import NasdemFooter from "@/components/nasdem-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Phone, Mail } from "lucide-react"

// Static organization data
const organizationData = [
  {
    id: "1",
    name: "Sidoarjo",
    code: "SDO",
    level: "DPD",
    leader: "H. Ahmad Muhaimin Iskandar",
    deputy: "Dra. Siti Nurhaliza, M.Si",
    secretary: "Muhammad Ridwan, S.Sos",
    treasurer: "Anik Maslachah, S.E",
    address: "Jl. Raya Sidoarjo No. 123",
    phone: "(031) 8945678",
    email: "dpd@nasdemsidoarjo.id",
    members_count: 1250,
    districts: [
      {
        id: "1",
        name: "Sidoarjo",
        code: "SDO",
        level: "DPC",
        leader: "H. Bambang Hariyanto",
        deputy: "Susi Pudjiastuti, S.H",
        secretary: "Ahmad Fauzi, S.Kom",
        treasurer: "Rina Kusumawati, S.E",
        address: "Jl. Mojopahit No. 45",
        phone: "(031) 8912345",
        email: "dpc.sidoarjo@nasdemsidoarjo.id",
        members_count: 180
      },
      {
        id: "2", 
        name: "Buduran",
        code: "BDR",
        level: "DPC",
        leader: "Hj. Fatimah Zahra",
        deputy: "Dr. Wahyu Setiawan",
        secretary: "Indra Gunawan, S.Pd",
        treasurer: "Lestari Handayani, S.E",
        address: "Jl. Buduran Raya No. 78",
        phone: "(031) 8923456",
        email: "dpc.buduran@nasdemsidoarjo.id",
        members_count: 145
      },
      {
        id: "3",
        name: "Candi", 
        code: "CDI",
        level: "DPC",
        leader: "H. Suryadi Joko Purnomo",
        deputy: "Dra. Maya Sari Dewi",
        secretary: "Eko Prasetyo, S.H",
        treasurer: "Wulan Dari, S.E",
        address: "Jl. Candi Raya No. 23",
        phone: "(031) 8934567",
        email: "dpc.candi@nasdemsidoarjo.id", 
        members_count: 132
      },
      {
        id: "4",
        name: "Gedangan",
        code: "GDG", 
        level: "DPC",
        leader: "Ir. Hendra Wijaya",
        deputy: "Hj. Aminah Basuki",
        secretary: "Dedi Susanto, S.Kom",
        treasurer: "Sari Wulandari, S.E",
        address: "Jl. Gedangan No. 67",
        phone: "(031) 8945678",
        email: "dpc.gedangan@nasdemsidoarjo.id",
        members_count: 167
      },
      {
        id: "5",
        name: "Jabon",
        code: "JBN",
        level: "DPC", 
        leader: "H. Achmad Yusuf",
        deputy: "Hj. Romlah Siti",
        secretary: "Agus Salim, S.Pd",
        treasurer: "Dewi Kartika, S.E",
        address: "Jl. Jabon Raya No. 34",
        phone: "(031) 8956789",
        email: "dpc.jabon@nasdemsidoarjo.id",
        members_count: 98
      },
      {
        id: "6",
        name: "Krembung",
        code: "KRB",
        level: "DPC",
        leader: "Drs. Supardi Hasan",
        deputy: "Hj. Nurul Hidayati",
        secretary: "Budi Santoso, S.H",
        treasurer: "Rina Marlina, S.E", 
        address: "Jl. Krembung No. 12",
        phone: "(031) 8967890",
        email: "dpc.krembung@nasdemsidoarjo.id",
        members_count: 89
      },
      {
        id: "7",
        name: "Krian",
        code: "KRI",
        level: "DPC",
        leader: "H. Mujiono Rahardjo", 
        deputy: "Dr. Sinta Dewi",
        secretary: "Firman Syahputra, S.Kom",
        treasurer: "Laila Fitriani, S.E",
        address: "Jl. Krian Raya No. 89",
        phone: "(031) 8978901", 
        email: "dpc.krian@nasdemsidoarjo.id",
        members_count: 154
      },
      {
        id: "8", 
        name: "Prambon",
        code: "PRB",
        level: "DPC",
        leader: "Hj. Sri Wahyuni",
        deputy: "H. Guntur Prasetya",
        secretary: "Andi Pratama, S.Pd",
        treasurer: "Mega Putri, S.E",
        address: "Jl. Prambon No. 56",
        phone: "(031) 8989012",
        email: "dpc.prambon@nasdemsidoarjo.id",
        members_count: 121
      },
      {
        id: "9",
        name: "Porong", 
        code: "PRG",
        level: "DPC",
        leader: "H. Bambang Suroso",
        deputy: "Hj. Ida Bagus Ayu",
        secretary: "Ricky Firmansyah, S.H",
        treasurer: "Tuti Handayani, S.E",
        address: "Jl. Porong Raya No. 90",
        phone: "(031) 8990123",
        email: "dpc.porong@nasdemsidoarjo.id", 
        members_count: 143
      },
      {
        id: "10",
        name: "Sedati",
        code: "SDT",
        level: "DPC",
        leader: "Dr. Widodo Aris",
        deputy: "Hj. Ratna Sari Dewi", 
        secretary: "Joko Susilo, S.Kom",
        treasurer: "Fitri Handayani, S.E",
        address: "Jl. Sedati No. 43",
        phone: "(031) 8901234",
        email: "dpc.sedati@nasdemsidoarjo.id",
        members_count: 176
      },
      {
        id: "11",
        name: "Sukodono", 
        code: "SKD",
        level: "DPC",
        leader: "H. Sutrisno Hadi",
        deputy: "Dra. Endang Susilowati",
        secretary: "Yudi Prasetyo, S.Pd",
        treasurer: "Siti Aisyah, S.E",
        address: "Jl. Sukodono No. 21",
        phone: "(031) 8912345",
        email: "dpc.sukodono@nasdemsidoarjo.id",
        members_count: 134
      },
      {
        id: "12",
        name: "Taman",
        code: "TMN", 
        level: "DPC",
        leader: "Ir. Hendro Gunawan",
        deputy: "Hj. Sumarni Indah",
        secretary: "Rizky Aditya, S.H",
        treasurer: "Dina Safitri, S.E",
        address: "Jl. Taman Raya No. 65",
        phone: "(031) 8923456",
        email: "dpc.taman@nasdemsidoarjo.id",
        members_count: 198
      },
      {
        id: "13",
        name: "Tanggulangin",
        code: "TGL",
        level: "DPC",
        leader: "H. Slamet Riyadi",
        deputy: "Hj. Widya Ningrum",
        secretary: "Fajar Sidik, S.Kom", 
        treasurer: "Evi Susanti, S.E",
        address: "Jl. Tanggulangin No. 87",
        phone: "(031) 8934567",
        email: "dpc.tanggulangin@nasdemsidoarjo.id",
        members_count: 156
      },
      {
        id: "14",
        name: "Tarik",
        code: "TRK",
        level: "DPC", 
        leader: "Dr. Agus Supriyanto",
        deputy: "Hj. Lilik Suryani",
        secretary: "Dimas Pratama, S.Pd",
        treasurer: "Yuni Rahayu, S.E", 
        address: "Jl. Tarik No. 32",
        phone: "(031) 8945678",
        email: "dpc.tarik@nasdemsidoarjo.id",
        members_count: 87
      },
      {
        id: "15",
        name: "Tulangan",
        code: "TLG",
        level: "DPC",
        leader: "H. Wahyu Hidayat",
        deputy: "Hj. Rohana Sari",
        secretary: "Aldi Firmansyah, S.H", 
        treasurer: "Riska Putri, S.E",
        address: "Jl. Tulangan No. 54",
        phone: "(031) 8956789",
        email: "dpc.tulangan@nasdemsidoarjo.id",
        members_count: 125
      },
      {
        id: "16", 
        name: "Waru",
        code: "WRU",
        level: "DPC",
        leader: "Ir. Bambang Yudhoyono",
        deputy: "Dr. Sari Indahwati",
        secretary: "Gilang Ramadhan, S.Kom",
        treasurer: "Indah Permata, S.E",
        address: "Jl. Waru Raya No. 76",
        phone: "(031) 8967890",
        email: "dpc.waru@nasdemsidoarjo.id", 
        members_count: 189
      },
      {
        id: "17",
        name: "Wonoayu", 
        code: "WNA",
        level: "DPC",
        leader: "H. Sugiarto Wijaya",
        deputy: "Hj. Kusuma Dewi",
        secretary: "Arief Rahman, S.Pd",
        treasurer: "Maya Sari, S.E",
        address: "Jl. Wonoayu No. 98",
        phone: "(031) 8978901",
        email: "dpc.wonoayu@nasdemsidoarjo.id",
        members_count: 112
      },
      {
        id: "18",
        name: "Balongbendo",
        code: "BLB",
        level: "DPC", 
        leader: "Drs. Sutomo Hadi",
        deputy: "Hj. Kartini Sari",
        secretary: "Wahyu Setiawan, S.H",
        treasurer: "Ria Anggraeni, S.E",
        address: "Jl. Balongbendo No. 21",
        phone: "(031) 8989012",
        email: "dpc.balongbendo@nasdemsidoarjo.id",
        members_count: 103
      }
    ]
  }
]

export default function StrukturPage() {
  const dpdData = organizationData[0]

  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />
      <main className="py-8">
        {/* Header Section */}
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Struktur Organisasi
            </h1>
            <p className="text-muted-foreground text-lg">
              Dewan Pimpinan Daerah NasDem Sidoarjo
            </p>
          </div>
        </div>

        {/* DPD Info */}
        <div className="container mx-auto px-4 mb-12">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-secondary" />
                    DPD NasDem Sidoarjo
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold">Ketua: </span>
                      <span className="text-muted-foreground">{dpdData.leader}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Wakil Ketua: </span>
                      <span className="text-muted-foreground">{dpdData.deputy}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Sekretaris: </span>
                      <span className="text-muted-foreground">{dpdData.secretary}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Bendahara: </span>
                      <span className="text-muted-foreground">{dpdData.treasurer}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-4">Informasi Kontak</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                      <span className="text-muted-foreground">{dpdData.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-secondary" />
                      <span className="text-muted-foreground">{dpdData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-secondary" />
                      <span className="text-muted-foreground">{dpdData.email}</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total Anggota</span>
                      <span className="text-2xl font-bold text-secondary">{dpdData.members_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold">DPC</span>
                      <span className="text-xl font-bold text-primary">{dpdData.districts.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organization Structure */}
        <div className="container mx-auto px-4 mb-12">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                Struktur Organisasi DPD NasDem Sidoarjo
              </h2>
              <div className="text-center text-muted-foreground">
                <p>Struktur organisasi lengkap akan segera ditampilkan</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DPC List */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary mb-6">Dewan Pimpinan Cabang (DPC)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dpdData.districts.map((district) => (
              <Card key={district.id} className="border-primary/20 hover:border-secondary/50 transition-colors">
                <CardContent className="p-4">
                  <h3 className="font-bold text-primary mb-2">DPC {district.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Ketua: </span>
                      <span className="text-muted-foreground">{district.leader}</span>
                    </div>
                    <div>
                      <span className="font-medium">Anggota: </span>
                      <span className="text-secondary font-semibold">{district.members_count}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-xs">{district.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <NasdemFooter />
    </div>
  )
}
