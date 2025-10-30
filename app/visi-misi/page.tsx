"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUp,
  Target,
  Users,
  BookOpen,
  Heart,
  Globe,
  Table,
  CheckCircle,
} from "lucide-react";

export default function VisiMisiPage() {
  const [activeTab, setActiveTab] = useState("visi");

  const visiPoints = [
    {
      icon: <ArrowUp className="w-6 h-6 text-secondary" />,
      title: "Merdeka",
      description:
        "Freedom dan Liberty - Indonesia yang benar-benar merdeka dari segala bentuk penjajahan, baik fisik maupun mental",
    },
    {
      icon: <Target className="w-6 h-6 text-secondary" />,
      title: "Kedaulatan Ekonomi",
      description:
        "Berdaulat secara ekonomi dengan memberantas kemiskinan dan kesenjangan untuk mencapai keadilan sosial",
    },
    {
      icon: <Heart className="w-6 h-6 text-secondary" />,
      title: "Martabat Budaya",
      description:
        "Bermartabat dalam budaya dengan melestarikan dan mengembangkan kekayaan budaya Indonesia",
    },
  ];

  const misiPoints = [
    {
      icon: <Users className="w-6 h-6 text-secondary" />,
      title: "Sistem Politik Demokratis",
      description:
        "Membangun sistem politik yang demokratis dan berkeadilan, bebas dari oligarki, politik uang, dan KKN",
    },
    {
      icon: <Globe className="w-6 h-6 text-secondary" />,
      title: "Sistem Ekonomi Demokratis",
      description:
        "Menegakkan sistem ekonomi yang demokratis untuk kesejahteraan seluruh rakyat Indonesia",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-secondary" />,
      title: "Gotong Royong",
      description:
        "Menghidupkan kembali budaya gotong royong sebagai fondasi kehidupan bermasyarakat",
    },
  ];

  // Mission Implementation Table Data
  const missionTableData = [
    {
      misi: "Sistem politik yang demokratis dan berkeadilan",
      masalah: [
        "Oligarki",
        "Politik Uang",
        "KKN",
        "Distrust Publik terhadap Partai",
      ],
      aksiDPP: [
        "Mendesain, mengawasi, mengatur peraturan, dan mengkampanyekan Gerakan Akar Rumput. Bekerja sama dengan",
        "Pengusaha pro demokrasi",
        "Kampus",
        "TV",
        "NGO",
        "Youtuber",
      ],
      aksiDPWDPD: [
        "Memfasilitasi Gerakan Akar Rumput",
        "Menyelenggarakan Sekolah Kader Calon Legislatif",
        "Membuat mimbar kampanye anti-politik uang",
        "Membuat sikap dan pandangan partai terkait hasil evaluasi kerja eksekutif dan legislatif.",
      ],
      aksiDPCDPRt: [
        "Gerakan Akar Rumput",
        "Mengusung kader potensial dan idealis sebagai DPR.",
        "Menolak politik uang",
        "Mengontrol kerja eksekutif dan legislatif.",
      ],
    },
  ];

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
              Visi & Misi Partai NasDem
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Visi & Misi
              <span className="text-secondary block">Partai NasDem</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Landasan filosofis dan arah pergerakan Partai NasDem dalam
              membangun Indonesia yang merdeka, berdaulat secara ekonomi, dan
              bermartabat dalam budaya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full max-w-6xl mx-auto"
          >
            {/* Modern Navigation Menu */}
            <div className="flex justify-center mb-16">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-2 backdrop-blur-sm min-w-[600px]">
                <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-[#F0F0F0] to-[#F0F0F0]/80 rounded-3xl p-2 gap-2 h-16">
                  <TabsTrigger
                    value="visi"
                    className="relative inline-flex items-center justify-center whitespace-nowrap rounded-3xl px-8 py-4 text-lg font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55]/20 disabled:pointer-events-none disabled:opacity-50 text-[#6B7280] hover:text-[#001B55] hover:bg-white hover:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/95 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/20 data-[state=active]:z-10 min-w-[250px] h-12 [&[data-state=active]_span]:!text-white"
                  >
                    <span className="text-inherit font-semibold">
                      Visi Partai NasDem
                    </span>
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-all duration-300 shadow-sm scale-0 data-[state=active]:scale-100"></div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="misi"
                    className="relative inline-flex items-center justify-center whitespace-nowrap rounded-3xl px-8 py-4 text-lg font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55]/20 disabled:pointer-events-none disabled:opacity-50 text-[#6B7280] hover:text-[#001B55] hover:bg-white hover:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/95 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/20 data-[state=active]:z-10 min-w-[250px] h-12 [&[data-state=active]_span]:!text-white"
                  >
                    <span className="text-inherit font-semibold">
                      Misi Partai NasDem
                    </span>
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-all duration-300 shadow-sm scale-0 data-[state=active]:scale-100"></div>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-4 text-sm text-[#6B7280] bg-gradient-to-r from-[#FFFFFF] to-[#F0F0F0]/30 px-6 py-3 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF9C04] animate-pulse shadow-lg shadow-[#FF9C04]/30"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#FF9C04] animate-ping opacity-20"></div>
                  </div>
                  <span className="font-semibold text-[#001B55]">Aktif</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <span className="font-medium">
                  {activeTab === "visi"
                    ? "Menampilkan Visi Partai NasDem"
                    : "Menampilkan Misi Partai NasDem"}
                </span>
              </div>
            </div>

            <TabsContent value="visi" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Visi Statement */}
                <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-primary/5">
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-3xl md:text-4xl font-bold text-primary mb-4">
                      Visi Partai NasDem
                    </CardTitle>
                    <div className="w-20 h-1 bg-secondary mx-auto mb-6" />
                    <blockquote className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed italic">
                      "Indonesia yang merdeka sebagai negara bangsa, berdaulat
                      secara ekonomi, dan bermartabat dalam budaya."
                    </blockquote>
                  </CardHeader>
                </Card>

                {/* Visi Explanation */}
                <div className="grid md:grid-cols-3 gap-6">
                  {visiPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-secondary">
                        <CardHeader className="text-center">
                          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            {point.icon}
                          </div>
                          <CardTitle className="text-xl text-primary">
                            {point.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed text-center">
                            {point.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Detailed Explanation */}
                <Card className="bg-muted/50 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-3">
                      <BookOpen className="w-7 h-7 text-secondary" />
                      Penjelasan Mendalam Visi Partai NasDem
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none">
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <div className="bg-secondary/5 p-6 rounded-lg border-l-4 border-l-secondary">
                        <h4 className="text-lg font-semibold text-primary mb-3">
                          Pengertian Visi dan Misi
                        </h4>
                        <p>
                          Visi adalah 'cita-cita'. Hanya saja, cita-cita
                          biasanya digunakan sebagai istilah keseharian yang
                          kurang pantas bila digunakan dalam institusi resmi.
                          Untuk institusi seperti partai politik, maka
                          penggunaan nomeklatur yang tepat adalah visi. Asal
                          katanya dari Bahasa Inggris, vision yang berarti
                          'konsep tentang masa depan yang dianggap ideal'
                          (Oxford Dictionary). Demikian juga dengan 'misi'
                          berasal dari Bahasa Inggris (mission) berarti: "an
                          important official job that a person or group of
                          people is given to do" (Oxford Dictionary). Artinya,
                          "sebuah pekerjaan resmi dan penting untuk dilakukan
                          oleh seseorang atau kelompok." Jadi dengan kata lain,
                          visi merupakan impian besar sedangkan misi adalah
                          rumusan langkah untuk mencapai impian tersebut.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-primary mb-3">
                          Landasan Hukum dan Hierarki
                        </h4>
                        <p>
                          Visi-misi ini, sebagaimana memang berlaku pada
                          organisasi resmi pada umumnya, terdapat dalam Anggaran
                          Dasar/Anggarat Rumah Tangga (AD/ART). Secara
                          hierarkis, AD/ART merupakan peraturan tertinggi dalam
                          organisasi, termasuk partai politik. AD/ART Partai
                          NasDem (Bab XVIII Tata Urutan Aturan Partai Pasal 27)
                          menyebutkan bahwa tata urutan aturan partai ini yang
                          paling tertinggi adalah Anggaran Dasar (AD) kemudian
                          Anggaran Rumah Tangga (ART), lalu disusul Peraturan
                          Partai (PP), Keputusan Dewan Pimpinan Pusat, Instruksi
                          Dewan Pimpinan Pusat, Keputusan Dewan Pimpinan
                          Wilayah, dan Keputusan Dewan Pimpinan Daerah.
                        </p>
                      </div>

                      <div className="bg-primary/5 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-primary mb-3">
                          Pentingnya Visi dan Misi
                        </h4>
                        <p>
                          Sehebat apapun fasilitas dalam sebuah organisasi
                          tetapi bila di dalamnya tidak ada 'visi dan misi',
                          (atau ada namun tak diindahkan) maka organisasi itu
                          ibarat kapal besar dengan fasilitas mewah tetapi tak
                          tahu akan berlabuh ke mana sebab tidak ada mesin dan
                          kemudinya. Kapal itu akan terombangambing oleh
                          derasnya arus samudera. Demikian juga dengan
                          organisasi (apapun bentuknya, termasuk partai
                          politik). Partai politik yang tidak mengindahkan
                          visi-misinya akan terombangambing oleh arus
                          kepentingan yang bahkan berpotensi memecah tubuh
                          partai itu sendiri.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-primary mb-3">
                          Tiga Kata Kunci Visi
                        </h4>
                        <p className="mb-4">
                          Bunyi teks visi partai ini secara utuh adalah
                          "Indonesia yang merdeka sebagai negara bangsa,
                          berdaulat secara ekonomi, dan bermartabat dalam
                          budaya." Untuk dapat dipahami, teks visi tersebut
                          perlu diterjemahkan secara kontekstual. Terdapat tiga
                          kata kunci penting di sini: merdeka, kedaulatan
                          ekonomi, dan martabat budaya.
                        </p>

                        <div className="space-y-4">
                          <div className="border-l-4 border-l-secondary pl-4">
                            <h5 className="font-semibold text-primary mb-2">
                              1. Merdeka
                            </h5>
                            <p>
                              Kata 'merdeka' itu dapat diterjemahkan menjadi
                              freedom ('merdeka dari' atau 'bebas dari') dan
                              liberty ('merdeka untuk' atau 'bebas untuk')
                              sekaligus. Freedom tanpa liberty itu omong kosong.
                              Begitupun sebaliknya. Contoh, suatu negara
                              berhasil 'merdeka dari' penjajah. Freedom di sini
                              terbukti berhasil diraih. Namun, setelah merdeka
                              ternyata negara tersebut menerapkan sistem
                              otoriterianisme yang memenjara kebebasan (liberty)
                              warganya untuk berpendapat, bersikap, dan
                              berekspresi. Kondisi politik semacam ini yang
                              tejadi pada era Orde Baru.
                            </p>
                            <p className="mt-2">
                              Demikian pula sebaliknya. Liberty tanpa freedom
                              juga omong kosong. Di Indonesia, kondisi politik
                              semacam ini terjadi di era sekarang,
                              paska-Reformasi. UU dan semua peraturan menjamin
                              hak dan kebebasan semua warga negara untuk duduk
                              di kursi legislatif. Namun, untuk duduk di sana
                              membutuhkan modal ekonomi besar. Sementara
                              kesenjangan dan kemiskinan terus dibiarkan
                              terjadi.
                            </p>
                          </div>

                          <div className="border-l-4 border-l-secondary pl-4">
                            <h5 className="font-semibold text-primary mb-2">
                              2. Kedaulatan Ekonomi
                            </h5>
                            <p>
                              Masalah kedaulatan ekonomi ini merupakan salah
                              satu penyebab penting terhapusnya freedom dan
                              liberty di atas. Kolonialisme Belanda dan Jepang
                              berhasil merenggut kemerdekaan (freedom) Nusantara
                              karena berhasil melumpuhkan kedaulatan ekonomi
                              rakyatnya. Di era Reformasi ini, kebebasan bagi
                              rakyat terkesan palsu karena kedaulatan ekonomi
                              mereka pun dilemahkan. Kata kuncinya adalah
                              'hancurnya kedaulatan ekonomi rakyat'.
                            </p>
                            <p className="mt-2">
                              Jadi, visi Partai NasDem ingin menegakkan
                              kedaulatan ekonomi ini dapat diterjemahkan dengan
                              upayanya untuk secara serius memberantas
                              kemiskinan dan kesenjangan ekonomi. Kedaulatan
                              ekonomi rakyat bukan kedaulatan ekonomi segelintir
                              orang. Kemajuan pembangunan sektor perekonomian di
                              Indonesia tanpa upaya meminimalisasi kesenjangan
                              bagi Partai NasDem adalah usaha pembangunan yang
                              kontra-produktif.
                            </p>
                          </div>

                          <div className="border-l-4 border-l-secondary pl-4">
                            <h5 className="font-semibold text-primary mb-2">
                              3. Martabat Kebudayaan
                            </h5>
                            <p>
                              Visi ketiga Partai NasDem ini sangat berkaitan
                              dengan kekayaan budaya Indonesia yang tidak
                              terkelola dengan baik dan bahkan mulai hampir
                              dilupakan oleh generasi mudanya. Di tengah
                              gempuran globalisasi—dengan datangnya berbagai
                              fasilitas-fasilitas digital yang menghubungkan
                              satu bangsa dengan bangsa lain tanpa terikat
                              batasan-batasan negara—banyak generasi bangsa kita
                              mulai latah dan bahkan lebih membanggakan budaya
                              bangsa lain.
                            </p>
                            <p className="mt-2">
                              Kepercayaan diri sebagai bangsa Indonesia untuk
                              mencintai budayanya hampir lenyap. Padahal,
                              kekayaan budaya bangsa kita sangat besar.
                              Kesadaran budaya ini di era sekarang merupakan hal
                              yang urgen. Lenyapnya kesadaran tersebut merupakan
                              masalah serius yang membutuhkan penanganan secara
                              tepat, baik dari pemerintah maupun non-pemerintah.
                              NasDem sebagai partai politik—bila dilihat dari
                              visi ketiga ini—hadir untuk turut terlibat
                              memecahkan masalah tersebut.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-secondary/5 p-6 rounded-lg border-l-4 border-l-secondary">
                        <h4 className="text-lg font-semibold text-primary mb-3">
                          Komitmen Realisasi
                        </h4>
                        <p>
                          Demikian tiga kata kunci dalam visi Partai NasDem.
                          Bilamana partai kita yang tercinta ini memang serius
                          ingin mewujudkan visi tersebut berarti ke depan kita
                          harus melakukan terobosan-terobosan baru untuk
                          merealisasikannya dengan kerja-kerja politik yang
                          terukur—baik di pemerintahan (eksekutif) di fraksi
                          (legislatif), maupun di masyarakat (konstituen).
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="misi" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Misi Statement */}
                <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-primary/5">
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-3xl md:text-4xl font-bold text-primary mb-4">
                      Misi Partai NasDem
                    </CardTitle>
                    <div className="w-20 h-1 bg-secondary mx-auto mb-6" />
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                      Langkah-langkah konkret untuk mewujudkan visi Indonesia
                      yang merdeka, berdaulat, dan bermartabat
                    </p>
                  </CardHeader>
                </Card>

                {/* Misi Points */}
                <div className="grid md:grid-cols-3 gap-6">
                  {misiPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-secondary">
                        <CardHeader className="text-center">
                          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            {point.icon}
                          </div>
                          <CardTitle className="text-xl text-primary">
                            {point.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed text-center">
                            {point.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Mission Explanation */}
                <Card className="bg-muted/50 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-3">
                      <Target className="w-7 h-7 text-secondary" />
                      Penjelasan Misi Partai NasDem
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <p>
                        Untuk mewujudkan visi tersebut diperlukan
                        langkah-langkah. Gambaran langkah-langkah itu adalah apa
                        yang disebut dengan 'misi'. Dari tiga misi yang tertuang
                        dalam AD/ART, terdapat tiga poin penting. Pertama,
                        sistem politik yang demokratis dan berkeadilan. Kedua,
                        sistem ekonomi yang demokratis. Ketiga, gotong royong
                        sebagai budaya.
                      </p>
                      <p>
                        Supaya mempermudah kader untuk melakukan 'aksi'
                        berdasarkan lima isu dalam 'misi' itu, buku Pedoman
                        Dasar Kader ini memberikan contoh lembar kerja dalam
                        tabel berikut:
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Mission Implementation Table */}
                <Card className="bg-white border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-3">
                      <Table className="w-7 h-7 text-secondary" />
                      Strategi Implementasi Misi
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">
                      Contoh lembar kerja untuk implementasi misi sistem politik
                      yang demokratis dan berkeadilan
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-primary/5 border-b-2 border-primary/20">
                            <th className="border border-primary/20 px-4 py-3 text-left font-semibold text-primary">
                              Misi
                            </th>
                            <th className="border border-primary/20 px-4 py-3 text-left font-semibold text-primary">
                              Masalah
                            </th>
                            <th className="border border-primary/20 px-4 py-3 text-left font-semibold text-primary">
                              Aksi DPP
                            </th>
                            <th className="border border-primary/20 px-4 py-3 text-left font-semibold text-primary">
                              Aksi DPW/DPD
                            </th>
                            <th className="border border-primary/20 px-4 py-3 text-left font-semibold text-primary">
                              Aksi DPC/DPRt
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {missionTableData.map((row, index) => (
                            <tr
                              key={index}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <td className="border border-primary/20 px-4 py-4 align-top font-medium text-primary">
                                {row.misi}
                              </td>
                              <td className="border border-primary/20 px-4 py-4 align-top">
                                <ul className="space-y-1">
                                  {row.masalah.map((item, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm"
                                    >
                                      <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0"></span>
                                      <span className="text-muted-foreground">
                                        {item}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="border border-primary/20 px-4 py-4 align-top">
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground font-medium">
                                    {row.aksiDPP[0]}
                                  </p>
                                  <ul className="space-y-1">
                                    {row.aksiDPP.slice(1).map((item, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm"
                                      >
                                        <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0"></span>
                                        <span className="text-muted-foreground">
                                          {item}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </td>
                              <td className="border border-primary/20 px-4 py-4 align-top">
                                <ul className="space-y-2">
                                  {row.aksiDPWDPD.map((item, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm"
                                    >
                                      <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0"></span>
                                      <span className="text-muted-foreground">
                                        {item}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="border border-primary/20 px-4 py-4 align-top">
                                <ul className="space-y-2">
                                  {row.aksiDPCDPRt.map((item, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm"
                                    >
                                      <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-1.5 flex-shrink-0"></span>
                                      <span className="text-muted-foreground">
                                        {item}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Implementation Strategy Explanation */}
                <Card className="bg-muted/50 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-3">
                      <CheckCircle className="w-7 h-7 text-secondary" />
                      Penjelasan Strategi Gerakan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                      <p>
                        Dalam tabel di atas diberikan contoh lembar kerja. Pada
                        misi 'sistem politik yang demokratis dan berkeadilan',
                        tentukan dulu masalah yang terjadi. Terdapat empat
                        masalah demokrasi: oligarki, politik uang, KKN, dan
                        ketidakpercayaan publik terhadap institusi partai
                        politik. Untuk menyelesaikan empat masalah tersebut, apa
                        langkah DPP, DPW, DPD, hingga DPC dan DPRt?
                      </p>

                      <p>
                        Apa yang coba digambarkan dalam Pedoman Dasar Kader
                        ini—yang telah dicantumkan dalam ketiga kolom aksi di
                        atas—adalah contoh bagaimana seharusnya struktur
                        bergerak. DPP, DPW/DPD, dan DPC/DPRt harus memiliki
                        fokus atau cakupan gerakan yang berbeda.
                      </p>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg border border-primary/10">
                          <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                            <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                              <span className="text-secondary text-sm font-bold">
                                1
                              </span>
                            </div>
                            DPP (Pusat)
                          </h4>
                          <p className="text-sm">
                            Prinsipnya, apa yang dilakukan DPP adalah untuk dan
                            dalam konteks <strong>kedikenal</strong>an—supaya
                            partai dikenal di tingkat nasional.
                          </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-primary/10">
                          <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                            <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                              <span className="text-secondary text-sm font-bold">
                                2
                              </span>
                            </div>
                            DPW/DPD (Wilayah)
                          </h4>
                          <p className="text-sm">
                            Apa yang dilakukan DPW dan DPD adalah untuk{" "}
                            <strong>kedisuka</strong>an partai di tingkat
                            wilayah dan daerah.
                          </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-primary/10">
                          <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                            <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                              <span className="text-secondary text-sm font-bold">
                                3
                              </span>
                            </div>
                            DPC/DPRt (Cabang)
                          </h4>
                          <p className="text-sm">
                            Dan, apa yang dilakukan DPC/DPRt adalah untuk{" "}
                            <strong>kedipili</strong>han, karena basis suara
                            sebenarnya berada di tingkat DPC/DPRt.
                          </p>
                        </div>
                      </div>

                      <div className="bg-secondary/5 p-6 rounded-lg border-l-4 border-l-secondary">
                        <h4 className="text-lg font-semibold text-primary mb-3">
                          Fokus Masalah yang Diatasi:
                        </h4>
                        <ul className="grid md:grid-cols-2 gap-3">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full" />
                            <span>Oligarki dalam sistem politik</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full" />
                            <span>Politik uang dan transaksional</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full" />
                            <span>Korupsi, Kolusi, dan Nepotisme (KKN)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full" />
                            <span>
                              Ketidakpercayaan publik terhadap partai politik
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
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
              Bergabunglah Dengan Kami
            </h3>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-8">
              Mari bersama-sama mewujudkan visi Indonesia yang merdeka,
              berdaulat, dan bermartabat
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
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
