"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserPlus, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  X, 
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  Camera,
  FileText,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export default function BergabungPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isBeneficiary, setIsBeneficiary] = useState(false);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    gender: "",
    nik: "",
    occupation: "",
    isBeneficiary: false,
    beneficiaryProgramId: "",
    notes: "",
  });

  const totalSteps = 3;

  // Load programs when isBeneficiary is checked
  const handleBeneficiaryChange = async (checked: boolean) => {
    setIsBeneficiary(checked);
    setFormData({ ...formData, isBeneficiary: checked });

    if (checked && programs.length === 0) {
      setLoadingPrograms(true);
      try {
        const response = await fetch("/api/programs");
        if (response.ok) {
          const data = await response.json();
          setPrograms(data.programs || []);
        }
      } catch (err) {
        console.error("Failed to load programs", err);
      } finally {
        setLoadingPrograms(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file KTP maksimal 5MB");
        return;
      }
      
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar");
        return;
      }

      setKtpFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const removeKtpFile = () => {
    setKtpFile(null);
    setKtpPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.nik && formData.dateOfBirth && formData.gender;
      case 2:
        return formData.address && formData.occupation;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F0F0F0]">
        <NasdemHeader />
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-10 animate-fade-in">
              {/* Success Icon - Clean design */}
              <div className="relative inline-block">
                <div className="w-28 h-28 bg-[#FF9C04] rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 bg-[#FF9C04] rounded-full blur-3xl opacity-20 animate-pulse"></div>
              </div>

              {/* Success Message */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-[#001B55]">
                  Pendaftaran Berhasil!
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Terima kasih telah bergabung dengan DPD Partai NasDem Sidoarjo. 
                  Tim kami akan segera menghubungi Anda melalui email atau telepon 
                  untuk proses verifikasi dan langkah selanjutnya.
                </p>
              </div>

              {/* Info Cards - Clean & Flat */}
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                <Card className="border-0 bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="text-5xl font-bold text-[#FF9C04] mb-3">3x24</div>
                    <p className="text-base font-bold text-[#001B55]">Jam Kerja</p>
                    <p className="text-sm text-gray-600 mt-2">Waktu Proses Verifikasi</p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-[#001B55]" />
                      </div>
                    </div>
                    <p className="text-base font-bold text-[#001B55]">Cek Email</p>
                    <p className="text-sm text-gray-600 mt-2">Konfirmasi Akan Dikirim</p>
                  </CardContent>
                </Card>
              </div>

              {/* Actions - Pill-shaped buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
                <Button 
                  onClick={() => router.push("/")} 
                  size="lg"
                  className="h-14 px-8 rounded-full bg-[#001B55] hover:bg-[#002060] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-bold"
                >
                  Kembali ke Beranda
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 rounded-full border-2 border-[#FF9C04] text-[#FF9C04] hover:bg-[#FF9C04] hover:text-white transition-all duration-300 hover:scale-105 font-bold"
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

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <NasdemHeader />

      {/* Hero Section - Clean & Flat */}
      <section className="relative bg-[#001B55] py-16 md:py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF9C04]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF9C04]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FF9C04]/10 backdrop-blur-sm border border-[#FF9C04]/20 rounded-full px-6 py-2.5 mb-6 hover:bg-[#FF9C04]/20 transition-all duration-300">
            <UserPlus className="w-4 h-4 text-[#FF9C04]" />
            <span className="text-white text-sm font-semibold tracking-wide">
              Formulir Pendaftaran Anggota
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Bergabung Bersama <span className="text-[#FF9C04]">NasDem Sidoarjo</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Wujudkan Indonesia yang lebih baik melalui Gerakan Perubahan
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps - Pill-shaped with Creative Geometry */}
            <div className="mb-10 md:mb-12">
              <div className="relative bg-white rounded-full p-4 shadow-lg">
                <div className="flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-8 right-8 h-2 bg-gray-100 rounded-full -z-10 transform -translate-y-1/2">
                    <div 
                      className="h-full bg-gradient-to-r from-[#001B55] to-[#FF9C04] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    ></div>
                  </div>

                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                          step < currentStep 
                            ? 'bg-[#FF9C04] text-white shadow-xl scale-110 hover:scale-115' 
                            : step === currentStep
                            ? 'bg-[#001B55] text-white shadow-2xl scale-125 ring-4 ring-[#FF9C04]/20'
                            : 'bg-gray-100 border-2 border-gray-200 text-gray-400'
                        }`}
                      >
                        {step < currentStep ? <Check className="w-6 h-6" strokeWidth={3} /> : step}
                      </div>
                      <span className={`text-sm mt-3 font-semibold transition-all duration-300 ${
                        step === currentStep ? 'text-[#001B55]' : 'text-gray-500'
                      }`}>
                        {step === 1 ? 'Data Diri' : step === 2 ? 'Alamat' : 'Dokumen'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <Alert className="mb-8 border-0 bg-red-50 rounded-2xl p-4 shadow-lg animate-shake">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C81E1E] flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <AlertDescription className="text-[#C81E1E] font-medium text-sm pt-2">
                    {error}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* Step Title Card - Direct without parent wrapper */}
            <div className="bg-[#001B55] rounded-3xl p-6 md:p-8 relative overflow-hidden mb-6 shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9C04]/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  {currentStep === 1 && <User className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />}
                  {currentStep === 2 && <MapPin className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />}
                  {currentStep === 3 && <FileText className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {currentStep === 1 && "Informasi Pribadi"}
                    {currentStep === 2 && "Informasi Kontak"}
                    {currentStep === 3 && "Dokumen & Program"}
                  </h2>
                  <p className="text-white/70 text-sm md:text-base">
                    {currentStep === 1 && "Lengkapi data pribadi Anda dengan benar"}
                    {currentStep === 2 && "Berikan informasi alamat dan pekerjaan"}
                    {currentStep === 3 && "Upload dokumen dan pilih program (opsional)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Card - Clean & Flat */}
            <Card className="border-0 shadow-2xl overflow-hidden rounded-3xl bg-white">
              <CardContent className="p-8 md:p-10 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Data Pribadi */}
                  {currentStep === 1 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="fullName" className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                            <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-[#001B55]" />
                            </div>
                            Nama Lengkap <span className="text-[#C81E1E]">*</span>
                          </Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Masukkan nama lengkap sesuai KTP"
                            className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="nik" className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                            <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                              <CreditCard className="w-3.5 h-3.5 text-[#001B55]" />
                            </div>
                            NIK <span className="text-[#C81E1E]">*</span>
                          </Label>
                          <Input
                            id="nik"
                            name="nik"
                            value={formData.nik}
                            onChange={handleChange}
                            required
                            placeholder="16 digit NIK"
                            maxLength={16}
                            className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="email" className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                            <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                              <Mail className="w-3.5 h-3.5 text-[#001B55]" />
                            </div>
                            Email <span className="text-[#C81E1E]">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="email@example.com"
                            className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="phone" className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                            <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                              <Phone className="w-3.5 h-3.5 text-[#001B55]" />
                            </div>
                            Nomor Telepon <span className="text-[#C81E1E]">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="08xxxxxxxxxx"
                            className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="dateOfBirth" className="text-[#001B55] font-bold text-sm">
                            Tanggal Lahir <span className="text-[#C81E1E]">*</span>
                          </Label>
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                            className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="gender" className="text-[#001B55] font-bold text-sm">
                            Jenis Kelamin <span className="text-[#C81E1E]">*</span>
                          </Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(value) =>
                              setFormData({ ...formData, gender: value })
                            }
                          >
                            <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300">
                              <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Laki-laki</SelectItem>
                              <SelectItem value="female">Perempuan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Alamat & Pekerjaan */}
                  {currentStep === 2 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="space-y-3">
                        <Label htmlFor="address" className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                          <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                            <MapPin className="w-3.5 h-3.5 text-[#001B55]" />
                          </div>
                          Alamat Lengkap <span className="text-[#C81E1E]">*</span>
                        </Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          rows={5}
                          placeholder="Masukkan alamat lengkap sesuai KTP&#10;Contoh: Jl. Pahlawan No. 123, RT 02/RW 03, Kelurahan Sidoarjo, Kecamatan Sidoarjo"
                          className="rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300 resize-none"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="occupation" className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                          <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                            <Briefcase className="w-3.5 h-3.5 text-[#001B55]" />
                          </div>
                          Pekerjaan <span className="text-[#C81E1E]">*</span>
                        </Label>
                        <Input
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          required
                          placeholder="Contoh: Pegawai Swasta, Wiraswasta, Guru, dll"
                          className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Dokumen & Penerima Manfaat */}
                  {currentStep === 3 && (
                    <div className="space-y-8 animate-fade-in">
                      {/* Upload KTP */}
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                          <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                            <Camera className="w-3.5 h-3.5 text-[#001B55]" />
                          </div>
                          Upload Foto KTP (Opsional)
                        </Label>
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {!ktpPreview ? (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-3 border-dashed border-gray-300 rounded-2xl p-10 md:p-12 text-center hover:border-[#FF9C04] hover:bg-[#FF9C04]/5 transition-all duration-300 cursor-pointer group"
                          >
                            <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-[#FF9C04]/10 flex items-center justify-center mx-auto mb-5 transition-all duration-300">
                              <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#FF9C04] transition-colors" />
                            </div>
                            <p className="text-base font-bold text-[#001B55] mb-2">
                              Klik atau drag untuk upload foto KTP
                            </p>
                            <p className="text-sm text-gray-500">
                              Format: PNG, JPG, JPEG • Maksimal: 5MB
                            </p>
                          </div>
                        ) : (
                          <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
                            <img
                              src={ktpPreview}
                              alt="Preview KTP"
                              className="w-full h-56 md:h-64 object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeKtpFile}
                              className="absolute top-4 right-4 bg-[#C81E1E] text-white p-3 rounded-full hover:bg-[#A01818] transition-all duration-300 shadow-xl hover:scale-110"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                              <p className="text-white text-sm font-medium">
                                ✓ Foto KTP berhasil diupload
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Penerima Manfaat */}
                      <div className="space-y-6 pt-6 border-t-2 border-gray-100">
                        <div className="bg-[#F0F0F0] rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300">
                          <div className="flex items-start space-x-4">
                            <Checkbox
                              id="isBeneficiary"
                              checked={isBeneficiary}
                              onCheckedChange={handleBeneficiaryChange}
                              className="mt-1.5 w-5 h-5 rounded border-2 data-[state=checked]:bg-[#FF9C04] data-[state=checked]:border-[#FF9C04]"
                            />
                            <div className="space-y-2 flex-1">
                              <Label
                                htmlFor="isBeneficiary"
                                className="text-base font-bold text-[#001B55] cursor-pointer leading-tight"
                              >
                                Saya adalah penerima manfaat program kerja
                              </Label>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                Centang jika Anda pernah atau sedang menerima bantuan dari
                                program kerja NasDem Sidoarjo
                              </p>
                            </div>
                          </div>

                          {isBeneficiary && (
                            <div className="mt-6 space-y-3 animate-fade-in">
                              <Label htmlFor="beneficiaryProgramId" className="text-[#001B55] font-bold text-sm">
                                Program Yang Diterima <span className="text-[#C81E1E]">*</span>
                              </Label>
                              <Select
                                value={formData.beneficiaryProgramId}
                                onValueChange={(value) =>
                                  setFormData({ ...formData, beneficiaryProgramId: value })
                                }
                                disabled={loadingPrograms}
                              >
                                <SelectTrigger className="h-14 rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 bg-white">
                                  <SelectValue
                                    placeholder={
                                      loadingPrograms
                                        ? "Memuat program..."
                                        : "Pilih program yang Anda terima"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {programs.map((program) => (
                                    <SelectItem
                                      key={program.id}
                                      value={program.id.toString()}
                                    >
                                      {program.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Catatan Tambahan */}
                      <div className="space-y-3">
                        <Label htmlFor="notes" className="flex items-center gap-2 text-[#001B55] font-bold text-sm">
                          <div className="w-6 h-6 rounded-full bg-[#001B55]/10 flex items-center justify-center">
                            <FileText className="w-3.5 h-3.5 text-[#001B55]" />
                          </div>
                          Catatan Tambahan (Opsional)
                        </Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Sampaikan pesan, pertanyaan, atau catatan tambahan Anda di sini"
                          className="rounded-xl border-2 border-gray-200 focus:border-[#FF9C04] focus:ring-2 focus:ring-[#FF9C04]/20 transition-all duration-300 hover:border-gray-300 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons - Pill-shaped with generous spacing */}
                  <div className="flex gap-4 pt-8 mt-8 border-t-2 border-gray-100">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1 h-14 rounded-full border-2 border-gray-300 hover:border-[#001B55] hover:bg-[#001B55] hover:text-white font-bold text-base transition-all duration-300 hover:scale-105"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Sebelumnya
                      </Button>
                    )}
                    
                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className="flex-1 h-14 rounded-full bg-[#001B55] hover:bg-[#002060] disabled:opacity-40 disabled:cursor-not-allowed font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      >
                        Selanjutnya
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-14 rounded-full bg-[#FF9C04] hover:bg-[#E08A00] text-white font-bold text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      >
                        {isSubmitting ? (
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
              </CardContent>
            </Card>

            {/* Info Box - Clean with generous white space */}
            <div className="mt-10 md:mt-12 bg-white shadow-xl rounded-3xl overflow-hidden">
              <div className="bg-[#001B55] p-6 md:p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF9C04]/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex items-center gap-3">
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
                    <span className="text-gray-700 pt-2 leading-relaxed">
                      Data Anda akan kami proses dalam waktu maksimal <strong className="text-[#001B55]">3x24 jam kerja</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#FF9C04] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 pt-2 leading-relaxed">
                      Pastikan <strong className="text-[#001B55]">email dan nomor telepon</strong> yang Anda berikan aktif untuk proses verifikasi
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#FF9C04] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 pt-2 leading-relaxed">
                      Untuk informasi lebih lanjut, hubungi kami di <strong className="text-[#001B55]">(031) 1234-5678</strong>
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
