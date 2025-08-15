"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Twitter } from "lucide-react"

export function ContactSection() {
  return (
    <section id="kontak" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Hubungi Kami</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Sampaikan aspirasi, saran, atau bergabung dengan gerakan perubahan bersama DPD NasDem Sidoarjo
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="animate-slide-in-left">
            <h3 className="text-2xl font-bold text-primary mb-6">Informasi Kontak</h3>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Alamat Sekretariat</h4>
                  <p className="text-muted-foreground">
                    Jl. Raya Sidoarjo No. 123
                    <br />
                    Sidoarjo, Jawa Timur 61234
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Telepon</h4>
                  <p className="text-muted-foreground">+62 31 8945 6789</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Email</h4>
                  <p className="text-muted-foreground">info@nasdemsidoarjo.id</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Jam Operasional</h4>
                  <p className="text-muted-foreground">
                    Senin - Jumat: 08:00 - 17:00
                    <br />
                    Sabtu: 08:00 - 12:00
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-primary mb-4">Ikuti Media Sosial Kami</h4>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Youtube className="h-5 w-5" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 bg-transparent">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">@sidoarjo.nasdem.id</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-in-right">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Kirim Pesan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-primary mb-2 block">Nama Lengkap</label>
                    <Input placeholder="Masukkan nama lengkap" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary mb-2 block">Email</label>
                    <Input type="email" placeholder="Masukkan email" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-2 block">Nomor Telepon</label>
                  <Input placeholder="Masukkan nomor telepon" />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-2 block">Subjek</label>
                  <Input placeholder="Masukkan subjek pesan" />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-2 block">Pesan</label>
                  <Textarea placeholder="Tulis pesan Anda..." rows={5} />
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-white">Kirim Pesan</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
