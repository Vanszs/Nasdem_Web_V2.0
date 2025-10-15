"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Upload, CheckCircle, AlertCircle, ArrowLeft, User, MapPin, Phone, Mail, FileText, Users, Camera, Download, Printer } from "lucide-react";
import Link from "next/link";
import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";

// Form Schema
const pipFormSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit").optional().or(z.literal("")),
  dateOfBirth: z.string().min(1, "Tanggal lahir harus diisi"),
  gender: z.enum(["male", "female"], { required_error: "Jenis kelamin harus dipilih" }),
  occupation: z.string().optional(),
  familyMemberCount: z.string().optional(),
  fullAddress: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
  pengusul: z.string().optional(),
  ktpPhoto: z.instanceof(File).optional(),
  kkPhoto: z.instanceof(File).optional(),
});

type PipFormData = z.infer<typeof pipFormSchema>;

export default function PipRegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [kkPreview, setKkPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);

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
      pengusul: "",
    },
  });

  // Mutation untuk submit form
  const submitMutation = useMutation({
    mutationFn: async (data: PipFormData) => {
      const formData = new FormData();
      
      formData.append("fullName", data.fullName);
      formData.append("nik", data.nik);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender);
      formData.append("fullAddress", data.fullAddress);
      
      if (data.email) formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.occupation) formData.append("occupation", data.occupation);
      if (data.familyMemberCount) formData.append("familyMemberCount", data.familyMemberCount);
      if (data.pengusul) formData.append("pengusul", data.pengusul);
      if (data.ktpPhoto) formData.append("ktpPhoto", data.ktpPhoto);
      if (data.kkPhoto) formData.append("kkPhoto", data.kkPhoto);

      const res = await fetch("/api/registrations/pip", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal mengirim pendaftaran");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Pendaftaran berhasil dikirim!", {
        description: "Tim kami akan meninjau pendaftaran Anda segera.",
      });
      setRegistrationData(data);
      setShowSuccess(true);
      form.reset();
      setKtpPreview(null);
      setKkPreview(null);
    },
    onError: (error: Error) => {
      toast.error("Gagal mengirim pendaftaran", {
        description: error.message,
      });
    },
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('pipRegistrationDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.formData) {
          form.reset(draft.formData);
        }
        if (draft.currentStep) {
          setCurrentStep(draft.currentStep);
        }
        if (draft.ktpPreview) {
          setKtpPreview(draft.ktpPreview);
        }
        if (draft.kkPreview) {
          setKkPreview(draft.kkPreview);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [form]);

  // Save draft to localStorage whenever form data changes
  useEffect(() => {
    const formData = form.getValues();
    const draft = {
      formData,
      currentStep,
      ktpPreview,
      kkPreview,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('pipRegistrationDraft', JSON.stringify(draft));
  }, [form.watch(), currentStep, ktpPreview, kkPreview]);

  // Clear draft on successful submission
  useEffect(() => {
    if (submitMutation.isSuccess) {
      localStorage.removeItem('pipRegistrationDraft');
    }
  }, [submitMutation.isSuccess]);

  const onSubmit = async (data: PipFormData) => {
    setIsSubmitting(true);
    try {
      await submitMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "ktpPhoto" | "kkPhoto"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "ktpPhoto") {
          setKtpPreview(reader.result as string);
        } else {
          setKkPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate form progress
  const watchedFields = form.watch();
  const calculateProgress = () => {
    let filledFields = 0;
    let totalFields = 0;
    
    // Required fields
    if (watchedFields.fullName) filledFields++;
    if (watchedFields.nik) filledFields++;
    if (watchedFields.dateOfBirth) filledFields++;
    if (watchedFields.gender) filledFields++;
    if (watchedFields.fullAddress) filledFields++;
    totalFields += 5;
    
    // Optional fields
    if (watchedFields.email) filledFields++;
    if (watchedFields.phone) filledFields++;
    if (watchedFields.occupation) filledFields++;
    if (watchedFields.familyMemberCount) filledFields++;
    if (ktpPreview) filledFields++;
    if (kkPreview) filledFields++;
    totalFields += 6;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  const progress = calculateProgress();

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return watchedFields.fullName && watchedFields.nik && watchedFields.dateOfBirth && watchedFields.gender;
      case 2:
        return watchedFields.fullAddress;
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Optional files
      default:
        return false;
    }
  };

  const handleDownloadProof = () => {
    if (!registrationData) return;
    
    // Create a simple text proof of registration
    const proofContent = `
BUKTI PENDAFTARAN PROGRAM PENDIDIKAN INKLUSIF (PIP)

Tanggal Pendaftaran: ${new Date().toLocaleDateString('id-ID')}
Nomor Pendaftaran: ${registrationData.id || 'REG-' + Date.now()}
Status: Sedang Ditinjau

DATA PEMOHON:
Nama Lengkap: ${form.getValues().fullName}
NIK: ${form.getValues().nik}
Tanggal Lahir: ${form.getValues().dateOfBirth}
Jenis Kelamin: ${form.getValues().gender === 'male' ? 'Laki-laki' : 'Perempuan'}
Pekerjaan: ${form.getValues().occupation || '-'}
Email: ${form.getValues().email || '-'}
Nomor Telepon: ${form.getValues().phone || '-'}
Alamat Lengkap: ${form.getValues().fullAddress}
Jumlah Anggota Keluarga: ${form.getValues().familyMemberCount || '-'}
Pengusul: ${form.getValues().pengusul || '-'}

---
Dokumen ini adalah bukti sah pendaftaran Program Pendidikan Inklusif (PIP)
Generated by NasDem Sidoarjo Portal
    `.trim();

    // Create a blob and download
    const blob = new Blob([proofContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bukti-Pendaftaran-PIP-${form.getValues().fullName}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintProof = () => {
    if (!registrationData) return;
    
    const printContent = `
      <html>
        <head>
          <title>Bukti Pendaftaran PIP</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { line-height: 1.6; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BUKTI PENDAFTARAN PROGRAM PENDIDIKAN INKLUSIF (PIP)</h1>
            <p>NasDem Sidoarjo</p>
          </div>
          <div class="content">
            <p><strong>Tanggal Pendaftaran:</strong> ${new Date().toLocaleDateString('id-ID')}</p>
            <p><strong>Nomor Pendaftaran:</strong> ${registrationData.id || 'REG-' + Date.now()}</p>
            <p><strong>Status:</strong> Sedang Ditinjau</p>
            <hr>
            <h3>DATA PEMOHON:</h3>
            <p><strong>Nama Lengkap:</strong> ${form.getValues().fullName}</p>
            <p><strong>NIK:</strong> ${form.getValues().nik}</p>
            <p><strong>Tanggal Lahir:</strong> ${form.getValues().dateOfBirth}</p>
            <p><strong>Jenis Kelamin:</strong> ${form.getValues().gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
            <p><strong>Pekerjaan:</strong> ${form.getValues().occupation || '-'}</p>
            <p><strong>Email:</strong> ${form.getValues().email || '-'}</p>
            <p><strong>Nomor Telepon:</strong> ${form.getValues().phone || '-'}</p>
            <p><strong>Alamat Lengkap:</strong> ${form.getValues().fullAddress}</p>
            <p><strong>Jumlah Anggota Keluarga:</strong> ${form.getValues().familyMemberCount || '-'}</p>
            <p><strong>Pengusul:</strong> ${form.getValues().pengusul || '-'}</p>
          </div>
          <div class="footer">
            <p>Dokumen ini adalah bukti sah pendaftaran Program Pendidikan Inklusif (PIP)</p>
            <p>Generated by NasDem Sidoarjo Portal</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nasdem-light-gray via-white to-nasdem-light-gray">
      <NasdemHeader />

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Modal */}
          {showSuccess && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md animate-slide-up">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-nasdem-blue">Pendaftaran Berhasil!</CardTitle>
                  <CardDescription>
                    Terima kasih telah mendaftar Program Pendidikan Inklusif (PIP). Pendaftaran Anda telah kami terima dan akan segera diproses.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Nomor Pendaftaran:</strong> {registrationData?.id || 'REG-' + Date.now()}
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      <strong>Status:</strong> Sedang Ditinjau
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleDownloadProof}
                      className="w-full bg-nasdem-blue hover:bg-nasdem-blue/90 text-white flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Unduh Bukti Pendaftaran
                    </Button>
                    
                    <Button
                      onClick={handlePrintProof}
                      variant="outline"
                      className="w-full border-nasdem-blue text-nasdem-blue hover:bg-nasdem-blue/10 flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Cetak Bukti Pendaftaran
                    </Button>
                    
                    <Button
                      onClick={() => router.push("/program")}
                      variant="ghost"
                      className="w-full text-gray-600 hover:text-gray-800"
                    >
                      Kembali ke Halaman Program
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Back Button */}
          <Link href="/program">
            <Button
              variant="ghost"
              className="mb-6 hover:bg-nasdem-blue/5 text-nasdem-blue group transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Kembali ke Program
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-nasdem-orange/10 to-nasdem-blue/10 rounded-full px-4 py-2 mb-4 backdrop-blur-sm">
              <GraduationCap className="h-5 w-5 text-nasdem-orange" />
              <span className="text-nasdem-blue text-sm font-medium">
                Pendaftaran Program
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-nasdem-blue mb-3">
              Program <span className="text-nasdem-orange">Pendidikan Inklusif</span> (PIP)
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Daftarkan diri Anda untuk mendapatkan bantuan pendidikan melalui Program Indonesia Pintar.
              Isi form di bawah ini dengan lengkap dan benar.
            </p>
          </div>

          {/* Progress Indicator */}
          <Card className="mb-8 shadow-md border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-nasdem-blue text-white flex items-center justify-center text-sm font-semibold">
                    {currentStep}
                  </div>
                  <span className="text-sm font-medium text-nasdem-blue">Langkah {currentStep} dari {totalSteps}</span>
                </div>
                <span className="text-sm text-gray-500">{progress}% Lengkap</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-200" />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Data Pribadi</span>
                <span className="text-xs text-gray-500">Alamat</span>
                <span className="text-xs text-gray-500">Kontak</span>
                <span className="text-xs text-gray-500">Dokumen</span>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mb-8 border-l-4 border-l-nasdem-orange shadow-md bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-nasdem-blue">
                <AlertCircle className="h-5 w-5 text-nasdem-orange" />
                Persyaratan Pendaftaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-nasdem-orange mt-0.5 flex-shrink-0" />
                  <span>Warga Kabupaten Sidoarjo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-nasdem-orange mt-0.5 flex-shrink-0" />
                  <span>Siswa/Mahasiswa dari keluarga kurang mampu atau berprestasi</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-nasdem-orange mt-0.5 flex-shrink-0" />
                  <span>Memiliki KTP dan Kartu Keluarga yang masih berlaku</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-nasdem-orange mt-0.5 flex-shrink-0" />
                  <span>Mengisi formulir pendaftaran dengan lengkap dan jujur</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-6 bg-gradient-to-r from-nasdem-blue/5 to-nasdem-orange/5 rounded-t-lg">
              {/* Capsule Component */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-nasdem-orange/10 to-nasdem-blue/10 rounded-full px-4 py-2 w-fit backdrop-blur-sm">
                <div className="w-2 h-2 bg-nasdem-orange rounded-full animate-pulse"></div>
                <span className="text-nasdem-blue text-sm font-semibold">Formulir Pendaftaran</span>
              </div>
              
              <div>
                <CardTitle className="text-2xl text-nasdem-blue">Lengkapi Data Diri Anda</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Pastikan semua informasi yang Anda berikan akurat dan sesuai dengan dokumen resmi
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Data Pribadi */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-slide-up">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-nasdem-blue/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-nasdem-blue" />
                        </div>
                        <h3 className="text-xl font-semibold text-nasdem-blue">Data Pribadi</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-nasdem-blue font-medium flex items-center gap-2">
                                Nama Lengkap <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Masukkan nama lengkap sesuai KTP"
                                  className="border-gray-300 focus:border-nasdem-blue focus:ring-2 focus:ring-nasdem-blue/20 transition-all duration-200"
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
                              <FormLabel className="text-nasdem-blue font-medium flex items-center gap-2">
                                NIK <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="16 digit NIK"
                                  maxLength={16}
                                  className="border-gray-300 focus:border-nasdem-blue focus:ring-2 focus:ring-nasdem-blue/20 transition-all duration-200"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-nasdem-blue font-medium flex items-center gap-2">
                                Tanggal Lahir <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="date"
                                  className="border-gray-300 focus:border-nasdem-blue focus:ring-2 focus:ring-nasdem-blue/20 transition-all duration-200"
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
                              <FormLabel className="text-nasdem-blue font-medium flex items-center gap-2">
                                Jenis Kelamin <span className="text-red-500">*</span>
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-gray-300 focus:border-nasdem-blue focus:ring-2 focus:ring-nasdem-blue/20 transition-all duration-200">
                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Laki-laki</SelectItem>
                                  <SelectItem value="female">Perempuan</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-nasdem-blue font-medium flex items-center gap-2">
                              Pekerjaan/Status
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Contoh: Pelajar, Mahasiswa"
                                className="border-gray-300 focus:border-nasdem-blue focus:ring-2 focus:ring-nasdem-blue/20 transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Alamat */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-slide-up">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-nasdem-blue/10 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-nasdem-blue" />
                        </div>
                        <h3 className="text-xl font-semibold text-nasdem-blue">Alamat</h3>
                      </div>

                      <FormField
                        control={form.control}
                        name="fullAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-nasdem-blue font-medium flex items-center gap-2">
                              Alamat Lengkap <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Masukkan alamat lengkap termasuk RT/RW, Kelurahan, Kecamatan"
                                rows={4}
                                className="border-gray-300 focus:border-nasdem-blue focus:ring-2 focus:ring-nasdem-blue/20 transition-all duration-200 resize-none"
                              />
                            </FormControl>
                            <FormDescription className="text-sm text-gray-500 mt-1">
                              Pastikan alamat yang dimasukkan lengkap dan akurat untuk memudahkan verifikasi
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 3: Kontak */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-slide-up">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-nasdem-blue/10 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-nasdem-blue" />
                        </div>
                        <h3 className="text-xl font-semibold text-nasdem-blue">Informasi Kontak</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-nasdem-blue font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="email@example.com"
                                  className="border-gray-300 focus:border-nasdem-blue focus:ring-2 focus:ring-nasdem-blue/20 transition-all duration-200"
                                />
                              </FormControl>
                              <FormDescription className="text-xs text-gray-500 mt-1">
                                Opsional, digunakan untuk konfirmasi pendaftaran
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-nasdem-blue font-medium flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Nomor Telepon
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="08xxxxxxxxxx"
                                  className="border-gray-300 focus:border-nasdem-blue focus:ring-2 focus:ring-nasdem-blue/20 transition-all duration-200"
                                />
                              </FormControl>
                              <FormDescription className="text-xs text-gray-500 mt-1">
                                Opsional, digunakan untuk menghubungi Anda
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="familyMemberCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-nasdem-blue font-medium flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Jumlah Anggota Keluarga
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Contoh: 5"
                                className="border-gray-300 focus:border-nasdem-blue focus:ring-2 focus:ring-nasdem-blue/20 transition-all duration-200"
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500 mt-1">
                              Jumlah orang yang tinggal satu rumah
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pengusul"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-nasdem-blue font-medium flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Pengusul
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Nama pengusul (jika ada)"
                                className="border-gray-300 focus:border-nasdem-blue focus:ring-2 focus:ring-nasdem-blue/20 transition-all duration-200"
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500 mt-1">
                              Nama orang atau lembaga yang merekomendasikan Anda (opsional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 4: Dokumen */}
                  {currentStep === 4 && (
                    <div className="space-y-6 animate-slide-up">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-nasdem-blue/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-nasdem-blue" />
                        </div>
                        <h3 className="text-xl font-semibold text-nasdem-blue">Dokumen Pendukung</h3>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                          <strong>Catatan:</strong> Pengunggahan dokumen bersifat opsional namun sangat disarankan untuk mempercepat proses verifikasi.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Upload KTP */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-nasdem-blue flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            Foto KTP (Opsional)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-nasdem-orange transition-all duration-300 hover:bg-nasdem-orange/5 group cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, "ktpPhoto")}
                              className="hidden"
                              id="ktpPhoto"
                            />
                            <label
                              htmlFor="ktpPhoto"
                              className="flex flex-col items-center cursor-pointer"
                            >
                              {ktpPreview ? (
                                <div className="relative w-full">
                                  <img
                                    src={ktpPreview}
                                    alt="Preview KTP"
                                    className="w-full h-40 object-cover rounded-lg mb-3"
                                  />
                                  <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Camera className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-12 w-12 text-gray-400 mb-3 group-hover:text-nasdem-orange transition-colors duration-300" />
                                  <span className="text-sm text-gray-500 text-center">
                                    Klik untuk upload KTP
                                  </span>
                                  <span className="text-xs text-gray-400 mt-1">
                                    Format: JPG, PNG (Max. 5MB)
                                  </span>
                                </>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Upload KK */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-nasdem-blue flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            Foto Kartu Keluarga (Opsional)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-nasdem-orange transition-all duration-300 hover:bg-nasdem-orange/5 group cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, "kkPhoto")}
                              className="hidden"
                              id="kkPhoto"
                            />
                            <label
                              htmlFor="kkPhoto"
                              className="flex flex-col items-center cursor-pointer"
                            >
                              {kkPreview ? (
                                <div className="relative w-full">
                                  <img
                                    src={kkPreview}
                                    alt="Preview KK"
                                    className="w-full h-40 object-cover rounded-lg mb-3"
                                  />
                                  <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Camera className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-12 w-12 text-gray-400 mb-3 group-hover:text-nasdem-orange transition-colors duration-300" />
                                  <span className="text-sm text-gray-500 text-center">
                                    Klik untuk upload KK
                                  </span>
                                  <span className="text-xs text-gray-400 mt-1">
                                    Format: JPG, PNG (Max. 5MB)
                                  </span>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1 border-gray-300 hover:bg-gray-50 transition-all duration-300"
                        disabled={isSubmitting}
                      >
                        Sebelumnya
                      </Button>
                    )}
                    
                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 bg-gradient-to-r from-nasdem-blue to-nasdem-blue/90 hover:from-nasdem-blue/90 hover:to-nasdem-blue text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={!isStepValid(currentStep)}
                      >
                        Lanjutkan
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-nasdem-orange to-nasdem-orange/90 hover:from-nasdem-orange/90 hover:to-nasdem-orange text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
                      </Button>
                    )}
                    
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => router.push("/program")}
                      className="border-gray-300 hover:bg-gray-50 transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Info Bottom */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 text-center">
                <AlertCircle className="inline h-4 w-4 mr-1 text-nasdem-blue" />
                Pendaftaran Anda akan ditinjau oleh tim kami dalam 3-7 hari kerja.
                Kami akan menghubungi Anda melalui kontak yang telah didaftarkan.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <NasdemFooter />
    </div>
  );
}
