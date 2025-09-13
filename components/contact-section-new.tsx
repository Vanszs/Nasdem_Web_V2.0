"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  MessageCircle,
  Users,
  Calendar,
  Building,
  CheckCircle,
  ExternalLink
} from "lucide-react"

interface ContactInfo {
  type: string
  label: string
  value: string
  status: "Aktif" | "Nonaktif"
  icon: React.ReactNode
  description?: string
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: ""
  })

  const contactInfo: ContactInfo[] = [
    {
      type: "Alamat",
      label: "Alamat Kantor",
      value: "Jl. Raya Sidoarjo No. 123, Sidoarjo, Jawa Timur 61215",
      status: "Aktif",
      icon: <MapPin className="w-6 h-6 text-secondary" />,
      description: "Kantor DPD NasDem Sidoarjo"
    },
    {
      type: "Telepon",
      label: "Telepon",
      value: "(031) 8945678",
      status: "Aktif",
      icon: <Phone className="w-6 h-6 text-secondary" />,
      description: "Telepon Kantor"
    },
    {
      type: "Email",
      label: "Email",
      value: "info@nasdems.id",
      status: "Aktif",
      icon: <Mail className="w-6 h-6 text-secondary" />,
      description: "Email Resmi"
    },
    {
      type: "Jam Operasional",
      label: "Jam Operasional",
      value: "Senin - Jumat: 08:00 - 16:00 WIB",
      status: "Aktif",
      icon: <Clock className="w-6 h-6 text-secondary" />,
      description: "Waktu Pelayanan"
    }
  ]

  const socialMedia = [
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, url: "#", color: "bg-blue-600" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, url: "#", color: "bg-pink-600" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, url: "#", color: "bg-blue-400" },
    { name: "Youtube", icon: <Youtube className="w-5 h-5" />, url: "#", color: "bg-red-600" }
  ]

  const services = [
    {
      title: "Aspirasi Masyarakat",
      description: "Sampaikan aspirasi dan keluhan masyarakat",
      icon: <MessageCircle className="w-8 h-8 text-secondary" />
    },
    {
      title: "Bergabung Kader",
      description: "Informasi pendaftaran kader dan anggota",
      icon: <Users className="w-8 h-8 text-secondary" />
    },
    {
      title: "Agenda Kegiatan",
      description: "Informasi jadwal dan agenda partai",
      icon: <Calendar className="w-8 h-8 text-secondary" />
    },
    {
      title: "Kerjasama Program",
      description: "Proposal kerjasama dan program bersama",
      icon: <Building className="w-8 h-8 text-secondary" />
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium border-secondary/30 bg-secondary/5">
              Hubungi Kami
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Kontak
              <span className="text-secondary block">NasDem Sidoarjo</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sampaikan aspirasi, bergabung sebagai kader, atau jalin kerjasama dengan DPD NasDem Sidoarjo. 
              Kami siap melayani untuk kemajuan bersama.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Informasi Kontak <span className="text-secondary">({contactInfo.length})</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Informasi lengkap untuk menghubungi kami
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-secondary">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      {info.icon}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {info.type}
                      </Badge>
                      <Badge 
                        variant={info.status === "Aktif" ? "default" : "secondary"} 
                        className={`text-xs ${info.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {info.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-primary">{info.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-center text-sm leading-relaxed mb-2">
                      {info.value}
                    </p>
                    {info.description && (
                      <p className="text-xs text-muted-foreground text-center opacity-75">
                        {info.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Services Section */}
          <Card className="mb-16 bg-muted/50 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary flex items-center justify-center gap-3">
                <Building className="w-7 h-7 text-secondary" />
                Layanan Kami
              </CardTitle>
              <p className="text-muted-foreground">Berbagai layanan yang dapat Anda akses</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-4"
                  >
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      {service.icon}
                    </div>
                    <h3 className="font-semibold text-primary mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Form and Additional Info */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary flex items-center gap-3">
                    <Send className="w-7 h-7 text-secondary" />
                    Kirim Pesan
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Isi form di bawah ini untuk menghubungi kami
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-semibold text-primary">
                          Nama Lengkap *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Masukkan nama lengkap"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-semibold text-primary">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="nama@email.com"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-sm font-semibold text-primary">
                          No. Telepon
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="08xx-xxxx-xxxx"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category" className="text-sm font-semibold text-primary">
                          Kategori
                        </Label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                          <option value="">Pilih kategori</option>
                          <option value="aspirasi">Aspirasi Masyarakat</option>
                          <option value="bergabung">Bergabung sebagai Kader</option>
                          <option value="kerjasama">Kerjasama Program</option>
                          <option value="media">Media & Pers</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm font-semibold text-primary">
                        Subjek *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Subjek pesan"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm font-semibold text-primary">
                        Pesan *
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                        placeholder="Tulis pesan Anda di sini..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full hover-scale"
                      variant="default"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Kirim Pesan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Map and Social Media */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-secondary" />
                    Lokasi Kantor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Peta Lokasi Kantor
                        <br />
                        DPD NasDem Sidoarjo
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Buka di Google Maps
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Media Sosial</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Ikuti kami di media sosial untuk update terbaru
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {socialMedia.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className={`${social.color} text-white rounded-lg p-4 hover:scale-105 transition-transform flex items-center justify-center gap-2 font-medium`}
                      >
                        {social.icon}
                        <span>{social.name}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Kontak Cepat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-sm text-muted-foreground">0812-3456-7890</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium">Email Cepat</p>
                        <p className="text-sm text-muted-foreground">info@nasdems.id</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium">Respons</p>
                        <p className="text-sm text-muted-foreground">Maksimal 24 jam</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-primary-foreground mb-6">
              Mari Berkolaborasi
            </h3>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-8">
              Bersama-sama membangun Sidoarjo yang lebih baik untuk semua
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="hover-scale font-semibold px-8"
              >
                Bergabung Sekarang
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-8"
              >
                Pelajari Program Kami
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
