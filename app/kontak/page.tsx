import NasdemHeader from "@/components/nasdem-header"
import NasdemFooter from "@/components/nasdem-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-background">
      <NasdemHeader />

      {/* Header */}
      <section className="bg-nasdem-blue text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl text-white/90">Sampaikan aspirasi, saran, atau bergabung dengan NasDem Sidoarjo</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-nasdem-blue mb-6">Kirim Pesan</h2>
              <Card className="p-6">
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-nasdem-blue mb-2">Nama Lengkap *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nasdem-orange"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-nasdem-blue mb-2">Email *</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nasdem-orange"
                        placeholder="nama@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-nasdem-blue mb-2">No. Telepon</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nasdem-orange"
                        placeholder="08xx-xxxx-xxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-nasdem-blue mb-2">Kategori</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nasdem-orange">
                        <option>Pilih kategori</option>
                        <option>Aspirasi Masyarakat</option>
                        <option>Bergabung sebagai Kader</option>
                        <option>Kerjasama Program</option>
                        <option>Media & Pers</option>
                        <option>Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-nasdem-blue mb-2">Subjek *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nasdem-orange"
                      placeholder="Subjek pesan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-nasdem-blue mb-2">Pesan *</label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nasdem-orange resize-none"
                      placeholder="Tulis pesan Anda di sini..."
                    ></textarea>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-nasdem-orange hover:bg-nasdem-dark-red text-white font-semibold"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Kirim Pesan
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-nasdem-blue mb-6">Informasi Kontak</h2>

                <div className="space-y-6">
                  <Card className="p-6">
                    <CardContent className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-nasdem-orange rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-nasdem-blue mb-2">Alamat Kantor</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Jl. Raya Sidoarjo No. 123
                          <br />
                          Kab. Sidoarjo, Jawa Timur 61219
                          <br />
                          Indonesia
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardContent className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-nasdem-orange rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-nasdem-blue mb-2">Telepon</h3>
                        <p className="text-gray-600">
                          Kantor: (031) 1234-5678
                          <br />
                          WhatsApp: 0812-3456-7890
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardContent className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-nasdem-orange rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-nasdem-blue mb-2">Email</h3>
                        <p className="text-gray-600">
                          dpd.sidoarjo@nasdem.id
                          <br />
                          info@nasdemsidoarjo.id
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardContent className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-nasdem-orange rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-nasdem-blue mb-2">Jam Operasional</h3>
                        <p className="text-gray-600">
                          Senin - Jumat: 08:00 - 17:00 WIB
                          <br />
                          Sabtu: 08:00 - 12:00 WIB
                          <br />
                          Minggu: Tutup
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Map */}
              <Card className="p-6">
                <CardContent>
                  <h3 className="font-bold text-nasdem-blue mb-4">Lokasi Kantor</h3>
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Peta Lokasi Kantor DPD NasDem Sidoarjo</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <NasdemFooter />
    </div>
  )
}
