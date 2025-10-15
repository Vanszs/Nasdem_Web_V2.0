"use client";

import { AdminLayout } from "../components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Image, Users, Phone } from "lucide-react";
import { HeroBannersSection } from "../components/landing/HeroBannersSection";
import { AboutSectionCard } from "../components/landing/AboutSectionCard";
import { ContactSectionCard } from "../components/landing/ContactSectionCard";

export default function LandingAdminPage() {
  const breadcrumbs = [{ label: "Landing Page" }];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-[#001B55]/10 via-[#F0F0F0]/20 to-[#FF9C04]/10 p-8 rounded-2xl border border-gray-200/40 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-2xl shadow-lg">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#001B55] leading-tight">
                Manajemen Landing Page
              </h1>
              <p className="text-[#6B7280] mt-1">
                Kelola konten halaman utama website dengan sistem yang
                terintegrasi
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="hero" className="w-full">
          <div className="flex justify-center mb-10">
            <div className="bg-[#FFFFFF] rounded-3xl border border-gray-100 shadow-sm p-1.5 backdrop-blur-sm">
              <TabsList className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-[#F0F0F0] to-[#F0F0F0] p-2 gap-2 min-w-[600px] h-16">
                <TabsTrigger
                  value="hero"
                  className="relative inline-flex items-center justify-center whitespace-nowrap rounded-3xl px-8 py-4 text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55]/20 disabled:pointer-events-none disabled:opacity-50 text-[#6B7280] hover:text-[#001B55] hover:bg-[#FFFFFF] hover:shadow-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/95 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/20 data-[state=active]:z-10 min-w-[180px] h-12 [&[data-state=active]>div>*]:!text-white [&[data-state=active]_*]:!text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Image className="w-4 h-4 text-inherit opacity-80" />
                    <span className="text-inherit font-medium">
                      Hero Banner
                    </span>
                  </div>
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-all duration-300 shadow-sm scale-0 data-[state=active]:scale-100"></div>
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="relative inline-flex items-center justify-center whitespace-nowrap rounded-3xl px-8 py-4 text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55]/20 disabled:pointer-events-none disabled:opacity-50 text-[#6B7280] hover:text-[#001B55] hover:bg-[#FFFFFF] hover:shadow-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/95 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/20 data-[state=active]:z-10 min-w-[180px] h-12 [&[data-state=active]>div>*]:!text-white [&[data-state=active]_*]:!text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-inherit opacity-80" />
                    <span className="text-inherit font-medium">
                      Tentang Kami
                    </span>
                  </div>
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-all duration-300 shadow-sm scale-0 data-[state=active]:scale-100"></div>
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="relative inline-flex items-center justify-center whitespace-nowrap rounded-3xl px-8 py-4 text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001B55]/20 disabled:pointer-events-none disabled:opacity-50 text-[#6B7280] hover:text-[#001B55] hover:bg-[#FFFFFF] hover:shadow-sm data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#001B55] data-[state=active]:to-[#001B55]/95 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#001B55]/20 data-[state=active]:z-10 min-w-[180px] h-12 [&[data-state=active]>div>*]:!text-white [&[data-state=active]_*]:!text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-inherit opacity-80" />
                    <span className="text-inherit font-medium">Kontak</span>
                  </div>
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF9C04] opacity-0 data-[state=active]:opacity-100 transition-all duration-300 shadow-sm scale-0 data-[state=active]:scale-100"></div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4 text-sm text-[#6B7280] bg-gradient-to-r from-[#FFFFFF] to-[#F0F0F0]/30 px-6 py-3 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF9C04] animate-pulse shadow-lg shadow-[#FF9C04]/30"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#FF9C04] animate-ping opacity-20"></div>
                </div>
                <span className="font-semibold text-[#001B55]">Live</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <span className="font-medium">
                Pilih tab untuk mengelola konten
              </span>
            </div>
          </div>

          <TabsContent value="hero" className="space-y-6">
            <HeroBannersSection />
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <AboutSectionCard />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <ContactSectionCard />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
