import { AdminLayout } from "@/src/components/layout/AdminLayout";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/src/components/ui/carousel";
import { useState, useEffect } from "react";
import { Progress } from "@/src/components/ui/progress";

export function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=1200&h=600&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&h=600&fit=crop&crop=face",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Landing Page" }
  ];

  const programKerja = [
    {
      title: "Pendidikan Inklusif",
      description: "Program komprehensif untuk meningkatkan akses pendidikan berkualitas bagi seluruh masyarakat Sidoarjo.",
      status: "Berlangsung",
      target: "1000 penerima beasiswa",
      progress: 75,
      timeline: "2024-2026",
      details: [
        "Fasilitasi beasiswa PIP/KIP untuk siswa kurang mampu",
        "Pelatihan keterampilan digital untuk generasi muda",
        "Program literasi untuk orang dewasa",
        "Beasiswa kuliah untuk mahasiswa berprestasi",
      ],
      achievements: [
        "709 ton benih padi disalurkan",
        "150 siswa mendapat beasiswa",
      ],
    },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        {/* Hero Carousel */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <Carousel>
            <CarouselContent>
              {heroImages.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-96 lg:h-[500px]">
                    <img src={img} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white p-4">
                        <h1 className="text-4xl lg:text-6xl font-bold mb-4">DPD Partai NasDem Sidoarjo</h1>
                        <p className="text-xl lg:text-2xl">Restorasi Indonesia Untuk Indonesia Raya</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Visi Misi */}
        <Card className="border-2 border-gray-300/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Visi & Misi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Visi</h3>
                <p className="text-muted-foreground">
                  Terwujudnya Sidoarjo yang sejahtera, adil, dan berbudaya melalui gerakan restorasi untuk Indonesia raya.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Misi</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Mewujudkan pemerintahan yang bersih dan bebas KKN</li>
                  <li>Menjamin kesejahteraan sosial untuk seluruh lapisan masyarakat</li>
                  <li>Membangun Sidoarjo yang berbasis ekonomi kerakyatan</li>
                  <li>Melestarikan budaya dan lingkungan hidup</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Kerja */}
        <Card className="border-2 border-gray-300/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Program Kerja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {programKerja.map((program, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{program.title}</h3>
                      <p className="text-muted-foreground mt-1">{program.description}</p>
                    </div>
                    <Badge className="mt-2 md:mt-0">{program.status}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Target</p>
                      <p className="font-medium">{program.target}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tercapai</p>
                      <p className="font-medium">{program.progress}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Timeline</p>
                      <p className="font-medium">{program.timeline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{program.status}</p>
                    </div>
                  </div>

                  <Progress value={program.progress} className="mb-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Detail Program:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {program.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Capaian Terkini:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {program.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}