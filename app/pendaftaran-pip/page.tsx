"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  FileText,
  ArrowRight,
  ArrowLeft,
  Users,
  BookOpen,
  Award,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Zod validation schema
const pipFormSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  nik: z.string().length(16, "NIK harus 16 digit"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  dateOfBirth: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"], {
    required_error: "Pilih jenis kelamin",
  }),
  occupation: z.string().min(2, "Pekerjaan wajib diisi"),
  familyMemberCount: z.string().optional(),
  fullAddress: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
  proposerName: z.string().min(3, "Nama pengusul minimal 3 karakter"),
  notes: z.string().optional(),
});

type PipFormData = z.infer<typeof pipFormSchema>;

export default function PendaftaranPipPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [success, setSuccess] = useState(false);

  // Get programId from URL query params
  const programIdParam = searchParams.get("programId");
  const programId = programIdParam ? parseInt(programIdParam, 10) : null;

  const totalSteps = 2;

  // Initialize React Hook Form with Zod
  const form = useForm<PipFormData>({
    resolver: zodResolver(pipFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      nik: "",
      phone: "",
      dateOfBirth: "",
      gender: undefined,
      occupation: "",
      familyMemberCount: "",
      fullAddress: "",
      proposerName: "",
      notes: "",
    },
    mode: "onChange",
  });

  // Mutation untuk submit form
  const submitMutation = useMutation({
    mutationFn: async (data: PipFormData) => {
      if (!programId) {
        throw new Error(
          "Program ID tidak tersedia. Silakan akses halaman ini dari detail program."
        );
      }

      const formData = new FormData();

      formData.append("programId", programId.toString());
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("nik", data.nik);
      formData.append("phone", data.phone);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender);
      formData.append("occupation", data.occupation);
      formData.append("familyMemberCount", data.familyMemberCount || "0");
      formData.append("fullAddress", data.fullAddress);
      formData.append("proposerName", data.proposerName);
      formData.append("notes", data.notes || "");

      const res = await fetch("/api/registrations/pip", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal mengirim pendaftaran");
      }

      return res.json();
    },
    onSuccess: () => {
      setSuccess(true);
      toast.success("Pendaftaran berhasil dikirim!");
      form.reset();
    },
    onError: (error: Error) => {
      console.error("❌ Registration error:", error);
      toast.error(error.message);
    },
  });

  const onSubmit = (data: PipFormData) => {
    submitMutation.mutate(data);
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      form
        .trigger(["fullName", "nik", "email", "phone", "dateOfBirth", "gender"])
        .then((isValid) => {
          if (isValid) {
            setCurrentStep(2);
          }
        });
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <NasdemHeader />
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-10 animate-fade-in">
              {/* Success Icon */}
              <div className="relative inline-block">
                <div className="w-28 h-28 bg-gradient-to-br from-[#FF9C04] to-[#FF9C04]/80 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <CheckCircle
                    className="w-16 h-16 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="absolute inset-0 bg-[#FF9C04] rounded-full blur-3xl opacity-20 animate-pulse"></div>
              </div>

              {/* Success Message */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-[#001B55]">
                  Pendaftaran Berhasil!
                </h1>
                <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
                  Terima kasih telah mendaftar Program Beasiswa PIP DPD Partai
                  NasDem Sidoarjo. Tim kami akan segera menghubungi Anda melalui
                  email atau telepon untuk proses verifikasi dan langkah
                  selanjutnya.
                </p>
              </div>

              {/* Info Cards */}
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                <Card className="border border-gray-100 bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="text-5xl font-bold text-[#FF9C04] mb-3">
                      7x24
                    </div>
                    <p className="text-base font-bold text-[#001B55]">
                      Jam Kerja
                    </p>
                    <p className="text-sm text-[#6B7280] mt-2">
                      Waktu Proses Verifikasi
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-gray-100 bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-[#001B55]" />
                      </div>
                    </div>
                    <p className="text-base font-bold text-[#001B55]">
                      Cek Email
                    </p>
                    <p className="text-sm text-[#6B7280] mt-2">
                      Konfirmasi Akan Dikirim
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
                <Button
                  onClick={() => router.push("/")}
                  size="lg"
                  className="bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-4 font-semibold"
                >
                  Kembali ke Beranda
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="lg"
                  className="text-[#6B7280] hover:bg-[#001B55]/5 hover:text-[#001B55] border border-transparent hover:border-[#001B55]/20 transition-all duration-300 rounded-xl px-8 py-4"
                >
                  Daftar Lagi
                </Button>
              </div>
            </div>
          </div>
        </main>
        <NasdemFooter />
      </div>
    );
  }

  // Fallback UI jika program tidak ditemukan
  if (!programId) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <NasdemHeader />
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-10">
              {/* Error Icon */}
              <div className="relative inline-block">
                <div className="w-28 h-28 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <AlertCircle
                    className="w-16 h-16 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="absolute inset-0 bg-red-500 rounded-full blur-3xl opacity-20"></div>
              </div>

              {/* Error Message */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-[#001B55]">
                  Program Tidak Ditemukan
                </h1>
                <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
                  Silakan akses halaman pendaftaran ini melalui tombol "Daftar
                  Sekarang" pada detail program yang tersedia di halaman
                  Program.
                </p>
              </div>

              {/* Info Card */}
              <Card className="border border-gray-100 bg-white shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-12 h-12 rounded-full bg-[#FF9C04]/10 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-[#FF9C04]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#001B55] mb-2">
                        Cara Mendaftar Program
                      </h3>
                      <ol className="space-y-2 text-[#6B7280]">
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-[#FF9C04] mt-0.5">
                            1.
                          </span>
                          <span>
                            Kunjungi halaman Program untuk melihat daftar
                            program yang tersedia
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-[#FF9C04] mt-0.5">
                            2.
                          </span>
                          <span>
                            Pilih program yang Anda inginkan dan klik "Detail
                            Program"
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-[#FF9C04] mt-0.5">
                            3.
                          </span>
                          <span>
                            Klik tombol "Daftar Sekarang" pada detail program
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-[#FF9C04] mt-0.5">
                            4.
                          </span>
                          <span>Isi formulir pendaftaran dengan lengkap</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  onClick={() => router.push("/program")}
                  size="lg"
                  className="bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-4 font-semibold"
                >
                  Lihat Daftar Program
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  size="lg"
                  className="text-[#6B7280] hover:bg-[#001B55]/5 hover:text-[#001B55] border border-transparent hover:border-[#001B55]/20 transition-all duration-300 rounded-xl px-8 py-4"
                >
                  Kembali ke Beranda
                </Button>
              </div>
            </div>
          </div>
        </main>
        <NasdemFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <NasdemHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#001B55] via-[#001B55] to-[#001845] py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF9C04]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF9C04]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FF9C04]/10 backdrop-blur-sm border border-[#FF9C04]/20 rounded-full px-6 py-2.5 mb-6">
            <GraduationCap className="w-4 h-4 text-[#FF9C04]" />
            <span className="text-white text-sm font-semibold tracking-wide">
              Program Beasiswa PIP
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Pendaftaran <span className="text-[#FF9C04]">Beasiswa PIP</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Program Indonesia Pintar dari DPD Partai NasDem Sidoarjo untuk
            mendukung pendidikan putra-putri Indonesia
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-1">
                <Users className="text-[#FF9C04] h-5 w-5" />
                <span className="text-2xl font-bold text-white">500+</span>
              </div>
              <p className="text-white/80 text-sm">Penerima Beasiswa</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-1">
                <BookOpen className="text-[#FF9C04] h-5 w-5" />
                <span className="text-2xl font-bold text-white">100%</span>
              </div>
              <p className="text-white/80 text-sm">Gratis Biaya Kuliah</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-1">
                <Award className="text-[#FF9C04] h-5 w-5" />
                <span className="text-2xl font-bold text-white">5 Tahun</span>
              </div>
              <p className="text-white/80 text-sm">Pengalaman Program</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-10 md:mb-12">
              <div className="relative bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-8 right-8 h-2 bg-gray-100 rounded-full -z-10 transform -translate-y-1/2">
                    <div
                      className="h-full bg-gradient-to-r from-[#001B55] to-[#FF9C04] rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${
                          ((currentStep - 1) / (totalSteps - 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>

                  {[1, 2].map((step) => (
                    <div
                      key={step}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                          step < currentStep
                            ? "bg-[#FF9C04] text-white shadow-lg"
                            : step === currentStep
                            ? "bg-[#001B55] text-white shadow-xl scale-110"
                            : "bg-gray-100 border-2 border-gray-200 text-gray-400"
                        }`}
                      >
                        {step < currentStep ? (
                          <Check className="w-6 h-6" strokeWidth={3} />
                        ) : (
                          step
                        )}
                      </div>
                      <span
                        className={`text-sm mt-3 font-semibold transition-all duration-300 ${
                          step === currentStep
                            ? "text-[#001B55]"
                            : "text-[#6B7280]"
                        }`}
                      >
                        {step === 1 ? "Data Diri" : "Alamat & Kontak"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Title Card */}
            <div className="bg-gradient-to-br from-[#001B55] to-[#001845] rounded-2xl p-6 md:p-8 relative overflow-hidden mb-6 shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9C04]/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  {currentStep === 1 && (
                    <User className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />
                  )}
                  {currentStep === 2 && (
                    <MapPin className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {currentStep === 1 && "Informasi Pribadi"}
                    {currentStep === 2 && "Informasi Kontak"}
                  </h2>
                  <p className="text-white/70 text-sm md:text-base">
                    {currentStep === 1 &&
                      "Lengkapi data pribadi Anda dengan benar"}
                    {currentStep === 2 &&
                      "Berikan informasi alamat dan pekerjaan"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <Card className="border border-gray-100 shadow-xl overflow-hidden rounded-2xl bg-white">
              <CardContent className="p-8 md:p-10 lg:p-12">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Step 1: Data Pribadi */}
                    {currentStep === 1 && (
                      <div className="space-y-8 animate-fade-in">
                        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold text-sm">
                                  <User className="w-4 h-4" />
                                  Nama Lengkap{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Masukkan nama lengkap sesuai KTP"
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#FF9C04] transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="nik"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold text-sm">
                                  <CreditCard className="w-4 h-4" />
                                  NIK <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="16 digit NIK"
                                    maxLength={16}
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#FF9C04] transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold text-sm">
                                  <Mail className="w-4 h-4" />
                                  Email <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="email@example.com"
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#FF9C04] transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold text-sm">
                                  <Phone className="w-4 h-4" />
                                  Nomor Telepon{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="tel"
                                    placeholder="08xxxxxxxxxx"
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#FF9C04] transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                          <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold text-sm">
                                  Tanggal Lahir{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="date"
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#FF9C04] transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold text-sm">
                                  Jenis Kelamin{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-[#FF9C04]">
                                      <SelectValue placeholder="Pilih jenis kelamin" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">
                                      Laki-laki
                                    </SelectItem>
                                    <SelectItem value="female">
                                      Perempuan
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Alamat & Pekerjaan */}
                    {currentStep === 2 && (
                      <div className="space-y-8 animate-fade-in">
                        <FormField
                          control={form.control}
                          name="fullAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold text-sm">
                                <MapPin className="w-4 h-4" />
                                Alamat Lengkap{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={5}
                                  placeholder="Masukkan alamat lengkap sesuai KTP&#10;Contoh: Jl. Pahlawan No. 123, RT 02/RW 03, Kelurahan Sidoarjo, Kecamatan Sidoarjo"
                                  className="rounded-xl border-gray-200 focus:border-[#FF9C04] transition-all resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                          <FormField
                            control={form.control}
                            name="occupation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold text-sm">
                                  <Briefcase className="w-4 h-4" />
                                  Pekerjaan{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Contoh: Pelajar, Mahasiswa, dll"
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#FF9C04] transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="familyMemberCount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold text-sm">
                                  <Users className="w-4 h-4" />
                                  Jumlah Anggota Keluarga
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    min="0"
                                    placeholder="Contoh: 5"
                                    className="h-12 rounded-xl border-gray-200 focus:border-[#FF9C04] transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="proposerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold text-sm">
                                <User className="w-4 h-4" />
                                Nama Pengusul{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Nama orang yang mengusulkan Anda"
                                  className="h-12 rounded-xl border-gray-200 focus:border-[#FF9C04] transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold text-sm">
                                <FileText className="w-4 h-4" />
                                Keterangan / Alasan Pengajuan
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={4}
                                  placeholder="Jelaskan alasan Anda mengajukan bantuan PIP (opsional)"
                                  className="rounded-xl border-gray-200 focus:border-[#FF9C04] transition-all resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pt-8 mt-8 border-t-2 border-gray-100">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="flex-1 h-14 rounded-xl text-[#6B7280] hover:bg-[#001B55]/5 hover:text-[#001B55] border border-gray-200 hover:border-[#001B55]/20 font-semibold text-base transition-all duration-300"
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Sebelumnya
                        </Button>
                      )}

                      {currentStep < totalSteps ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="flex-1 h-14 rounded-xl bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Selanjutnya
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={submitMutation.isPending}
                          className="flex-1 h-14 rounded-xl bg-gradient-to-r from-[#FF9C04] to-[#FF9C04]/90 hover:from-[#001B55] hover:to-[#001B55] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {submitMutation.isPending ? (
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Mengirim Data...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5" />
                              <span>Daftar Sekarang</span>
                            </div>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Info Box */}
            <div className="mt-10 md:mt-12 bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#001B55] to-[#001845] p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-[#FF9C04]" />
                  </div>
                  <h3 className="font-bold text-white text-lg md:text-xl">
                    Informasi Penting
                  </h3>
                </div>
              </div>
              <div className="p-8 md:p-10">
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#FF9C04] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-[#6B7280] pt-2 leading-relaxed">
                      Data Anda akan kami proses dalam waktu maksimal{" "}
                      <strong className="text-[#001B55]">7x24 jam kerja</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#FF9C04] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-[#6B7280] pt-2 leading-relaxed">
                      Pastikan{" "}
                      <strong className="text-[#001B55]">
                        email dan nomor telepon
                      </strong>{" "}
                      yang Anda berikan aktif untuk proses verifikasi
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#FF9C04] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-[#6B7280] pt-2 leading-relaxed">
                      Untuk informasi lebih lanjut, hubungi kami di{" "}
                      <strong className="text-[#001B55]">
                        (031) 1234-5678
                      </strong>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NasdemFooter />
    </div>
  );
}
