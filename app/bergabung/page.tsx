"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, AlertCircle, Check } from "lucide-react";
import { MembershipApplicationPDF } from "@/components/pdf/MembershipApplicationPDF";
import { downloadPDF, generateRegistrationNumber } from "@/lib/pdf-utils";
import { StepProgress } from "./components/StepProgress";
import { StepTitleCard } from "./components/StepTitleCard";
import { Step1, Step2, Step3 } from "./components/MembershipFormSteps";
import { NavigationButtons } from "./components/NavigationButtons";
import { SuccessView } from "./components/SuccessView";
import { membershipSchema, MembershipFormValues } from "./components/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";

const totalSteps = 3;

export default function BergabungPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      nik: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: undefined as any,
      address: "",
      occupation: "",
      isBeneficiary: false,
      beneficiaryProgramId: "",
      notes: "",
    },
  });

  const isBeneficiary = form.watch("isBeneficiary");
  const beneficiaryProgramId = form.watch("beneficiaryProgramId") || "";
  // Subscribe to all form values to reactively update button state
  const watchedValues = form.watch();

  // Derived validity for the current step; updates reactively as fields change
  const canProceed = (() => {
    const values = watchedValues as MembershipFormValues;
    if (currentStep === 1) {
      return (
        !!values.fullName &&
        !!values.email &&
        !!values.phone &&
        !!values.nik &&
        !!values.dateOfBirth &&
        !!values.gender
      );
    }
    if (currentStep === 2) {
      return !!values.address && !!values.occupation;
    }
    if (currentStep === 3) {
      return !values.isBeneficiary || !!values.beneficiaryProgramId;
    }
    return false;
  })();

  const mutation = useMutation({
    mutationFn: async (values: MembershipFormValues) => {
      const fd = new FormData();
      fd.append("fullName", values.fullName);
      fd.append("nik", values.nik || "");
      fd.append("email", values.email || "");
      fd.append("phone", values.phone || "");
      fd.append("address", values.address || "");
      fd.append("dateOfBirth", values.dateOfBirth || "");
      fd.append("gender", values.gender || "");
      fd.append("occupation", values.occupation || "");
      fd.append("motivation", values.notes || "");
      fd.append("applicationType", "REGULAR");
      if (ktpFile) fd.append("ktpPhoto", ktpFile);
      if (values.isBeneficiary && values.beneficiaryProgramId) {
        fd.append("isBeneficiary", "true");
        fd.append("beneficiaryProgramId", values.beneficiaryProgramId);
      } else {
        fd.append("isBeneficiary", "false");
      }
      const res = await fetch("/api/membership-applications", {
        method: "POST",
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || "Gagal mengirim permohonan");
      }
      return json;
    },
  });

  const handleBeneficiaryChange = (checked: boolean) => {
    form.setValue("isBeneficiary", checked);
    if (!checked) form.setValue("beneficiaryProgramId", "");
  };

  const onSubmit = async (values: MembershipFormValues) => {
    try {
      await mutation.mutateAsync(values);
      const registrationNumber = generateRegistrationNumber("NASDEM");
      const pdfDocument = (
        <MembershipApplicationPDF
          data={{
            fullName: values.fullName,
            email: values.email || undefined,
            phone: values.phone || undefined,
            dateOfBirth: values.dateOfBirth || undefined,
            gender: values.gender || undefined,
            nik: values.nik,
            address: values.address || undefined,
            occupation: values.occupation || undefined,
            notes: values.notes || undefined,
            isBeneficiary: values.isBeneficiary,
            beneficiaryProgramName: undefined,
            registrationNumber,
            submittedAt: new Date(),
          }}
        />
      );
      try {
        await downloadPDF(
          pdfDocument,
          `Bukti-Pendaftaran-NasDem-${registrationNumber}.pdf`
        );
      } catch {
        // ignore pdf errors
      }
      toast.success("Pendaftaran berhasil dikirim");
      setCurrentStep(totalSteps + 1); // go to success view
    } catch (e: any) {
      toast.error(e?.message || "Terjadi kesalahan saat mendaftar");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file KTP maksimal 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }

      setKtpFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeKtpFile = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

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

  if (currentStep === totalSteps + 1) return <SuccessView />;

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
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
            Bergabung Bersama{" "}
            <span className="text-[#FF9C04]">NasDem Sidoarjo</span>
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
            <StepProgress currentStep={currentStep} totalSteps={totalSteps} />

            {mutation.isError && (
              <Alert className="mb-8 border-0 bg-red-50 rounded-2xl p-4 shadow-lg animate-shake">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C81E1E] flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <AlertDescription className="text-[#C81E1E] font-medium text-sm pt-2">
                    Terjadi kesalahan saat mendaftar
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <StepTitleCard currentStep={currentStep} />

            {/* Form Card - Clean & Flat */}
            <Card className="border-0 shadow-2xl overflow-hidden rounded-3xl bg-white">
              <CardContent className="p-8 md:p-10 lg:p-12">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Step 1: Data Pribadi */}
                    {currentStep === 1 && <Step1 control={form.control} />}

                    {/* Step 2: Alamat & Pekerjaan */}
                    {currentStep === 2 && <Step2 control={form.control} />}

                    {/* Step 3: Dokumen & Penerima Manfaat */}
                    {currentStep === 3 && (
                      <Step3
                        control={form.control}
                        isBeneficiary={isBeneficiary}
                        onBeneficiaryChange={handleBeneficiaryChange}
                        programId={beneficiaryProgramId}
                        onProgramChange={(v) =>
                          form.setValue("beneficiaryProgramId", v)
                        }
                        ktpPreview={ktpPreview}
                        onPick={() => fileInputRef.current?.click()}
                        onFileChange={handleFileChange}
                        onRemove={() => removeKtpFile()}
                        inputRef={fileInputRef}
                      />
                    )}

                    {/* Navigation Buttons - Pill-shaped with generous spacing */}
                    <NavigationButtons
                      currentStep={currentStep}
                      totalSteps={totalSteps}
                      onPrev={prevStep}
                      onNext={nextStep}
                      onSubmit={form.handleSubmit(onSubmit)}
                      isSubmitting={mutation.isPending}
                      isStepValid={canProceed}
                    />
                  </form>
                </Form>
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
                      Data Anda akan kami proses dalam waktu maksimal{" "}
                      <strong className="text-[#001B55]">3x24 jam kerja</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#FF9C04] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 pt-2 leading-relaxed">
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
                    <span className="text-gray-700 pt-2 leading-relaxed">
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
    </div>
  );
}
