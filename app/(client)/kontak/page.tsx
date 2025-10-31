"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useCmsContactStore } from "@/store/cms-contact";
import { toast } from "sonner";
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
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface ContactInfo {
  type: string;
  label: string;
  value: string;
  status: "Aktif" | "Nonaktif";
  icon: React.ReactNode;
  description?: string;
}

export function ContactPage() {
  const { contact, isLoading, fetchContact } = useCmsContactStore();
  useEffect(() => {
    fetchContact();
  }, [fetchContact]);
  const c = contact as
    | {
        phone?: string | null;
        email?: string | null;
        address?: string | null;
        operationalHours?: string | null;
        instagramUrl?: string | null;
        facebookUrl?: string | null;
        twitterUrl?: string | null;
        youtubeUrl?: string | null;
      }
    | undefined;

  const formSchema = z.object({
    name: z.string().min(3, "Minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().optional(),
    category: z.string().optional(),
    subject: z.string().min(3, "Minimal 3 karakter"),
    message: z.string().min(10, "Minimal 10 karakter"),
  });
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      category: "",
      subject: "",
      message: "",
    },
  });

  const contactInfo: ContactInfo[] = [
    {
      type: "Alamat",
      label: "Alamat Kantor",
      value: c?.address || "",
      status: "Aktif",
      icon: <MapPin className="w-6 h-6 text-secondary" />,
      description: "Kantor DPD NasDem Sidoarjo",
    },
    {
      type: "Telepon",
      label: "Telepon",
      value: c?.phone || "",
      status: "Aktif",
      icon: <Phone className="w-6 h-6 text-secondary" />,
      description: "Telepon Kantor",
    },
    {
      type: "Email",
      label: "Email",
      value: c?.email || "",
      status: "Aktif",
      icon: <Mail className="w-6 h-6 text-secondary" />,
      description: "Email Resmi",
    },
    {
      type: "Jam Operasional",
      label: "Jam Operasional",
      value: c?.operationalHours || "",
      status: "Aktif",
      icon: <Clock className="w-6 h-6 text-secondary" />,
      description: "Waktu Pelayanan",
    },
  ];

  const socialMedia = [
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      url: c?.facebookUrl || "#",
      color: "bg-blue-600",
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: c?.instagramUrl || "#",
      color: "bg-pink-600",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      url: c?.twitterUrl || "#",
      color: "bg-blue-400",
    },
    {
      name: "Youtube",
      icon: <Youtube className="w-5 h-5" />,
      url: c?.youtubeUrl || "#",
      color: "bg-red-600",
    },
  ];

  const services = [
    {
      title: "Aspirasi Masyarakat",
      description: "Sampaikan aspirasi dan keluhan masyarakat",
      icon: <MessageCircle className="w-8 h-8 text-secondary" />,
    },
    {
      title: "Bergabung Kader",
      description: "Informasi pendaftaran kader dan anggota",
      icon: <Users className="w-8 h-8 text-secondary" />,
    },
    {
      title: "Agenda Kegiatan",
      description: "Informasi jadwal dan agenda partai",
      icon: <Calendar className="w-8 h-8 text-secondary" />,
    },
    {
      title: "Kerjasama Program",
      description: "Proposal kerjasama dan program bersama",
      icon: <Building className="w-8 h-8 text-secondary" />,
    },
  ];

  const onSubmit = (values: FormValues) => {
    // Placeholder submit: integrate with API when available
    toast.success("Pesan terkirim. Terima kasih!");
    form.reset();
  };

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
            <Badge
              variant="outline"
              className="mb-4 px-4 py-2 text-sm font-medium border-secondary/30 bg-secondary/5"
            >
              Hubungi Kami
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Kontak
              <span className="text-secondary block">NasDem Sidoarjo</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sampaikan aspirasi, bergabung sebagai kader, atau jalin kerjasama
              dengan DPD NasDem Sidoarjo. Kami siap melayani untuk kemajuan
              bersama.
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
              Informasi Kontak{" "}
              <span className="text-secondary">({contactInfo.length})</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Informasi lengkap untuk menghubungi kami
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-44 bg-muted/50 rounded-lg animate-pulse"
                  />
                ))
              : contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary">
                      <CardHeader className="text-center pb-4">
                        <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          {info.icon}
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {info.type}
                          </Badge>
                          <Badge
                            variant={
                              info.status === "Aktif" ? "default" : "secondary"
                            }
                            className={`text-xs ${
                              info.status === "Aktif"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {info.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg text-primary">
                          {info.label}
                        </CardTitle>
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
              <p className="text-muted-foreground">
                Berbagai layanan yang dapat Anda akses
              </p>
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
                    <h3 className="font-semibold text-primary mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
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
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-primary">
                                Nama Lengkap *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Masukkan nama lengkap"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-primary">
                                Email *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="nama@email.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-primary">
                                No. Telepon
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="08xx-xxxx-xxxx"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-primary">
                                Kategori
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih kategori" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="aspirasi">
                                    Aspirasi Masyarakat
                                  </SelectItem>
                                  <SelectItem value="bergabung">
                                    Bergabung sebagai Kader
                                  </SelectItem>
                                  <SelectItem value="kerjasama">
                                    Kerjasama Program
                                  </SelectItem>
                                  <SelectItem value="media">
                                    Media & Pers
                                  </SelectItem>
                                  <SelectItem value="lainnya">
                                    Lainnya
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-primary">
                              Subjek *
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Subjek pesan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-primary">
                              Pesan *
                            </FormLabel>
                            <FormControl>
                              <textarea
                                rows={6}
                                className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                                placeholder="Tulis pesan Anda di sini..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        variant="default"
                      >
                        <Send className="mr-2 h-5 w-5" />
                        Kirim Pesan
                      </Button>
                    </form>
                  </Form>
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
                  {isLoading ? (
                    <div className="w-full h-64 bg-muted/50 rounded-lg animate-pulse" />
                  ) : (
                    <div className="w-full h-64 bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          Peta Lokasi Kantor
                          <br />
                          {contact?.address || "DPD NasDem Sidoarjo"}
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buka di Google Maps
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    Media Sosial
                  </CardTitle>
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
                        className={`${social.color} text-white rounded-lg p-4 transition-transform flex items-center justify-center gap-2 font-medium`}
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
                  <CardTitle className="text-xl text-primary">
                    Kontak Cepat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-10 bg-muted/50 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="font-medium">WhatsApp</p>
                          <p className="text-sm text-muted-foreground">
                            {contact?.phone || "0812-3456-7890"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="font-medium">Email Cepat</p>
                          <p className="text-sm text-muted-foreground">
                            {contact?.email || "info@nasdems.id"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="font-medium">Respons</p>
                          <p className="text-sm text-muted-foreground">
                            Maksimal 24 jam
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
              <Link
                href={"/bergabung"}
                className={buttonVariants({
                  variant: "secondary",
                  className: "font-semibold px-8",
                })}
              >
                Bergabung Sekarang
              </Link>
              <Link
                href={"/program"}
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-8",
                })}
              >
                Pelajari Program Kami
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
