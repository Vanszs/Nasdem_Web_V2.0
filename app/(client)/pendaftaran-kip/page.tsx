"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { kipFormSchema, KipFormData } from "./schema";
import { TOTAL_STEPS } from "./constants";
import {
  saveDraftToLocalStorage,
  loadDraftFromLocalStorage,
  clearDraft,
  getDraftTimestamp,
} from "./helpers";
import { KipHeroSection } from "./components/KipHeroSection";
import { ProgressSteps } from "./components/ProgressSteps";
import { StepTitleCard } from "./components/StepTitleCard";
import { DraftIndicator } from "./components/DraftIndicator";
import { Step1DataMahasiswa } from "./components/Step1DataMahasiswa";
import { Step2DataUniversitas } from "./components/Step2DataUniversitas";
import { Step3DataOrangTua } from "./components/Step3DataOrangTua";
import { Step4DataPengusul } from "./components/Step4DataPengusul";
import { NavigationButtons } from "./components/NavigationButtons";
import { SuccessPage } from "./components/SuccessPage";
import { ErrorPage } from "./components/ErrorPage";
import { InfoBox } from "./components/InfoBox";

export default function PendaftaranKipPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Get programId from URL query params
  const programIdParam = searchParams.get("programId");
  const programId = programIdParam ? parseInt(programIdParam, 10) : null;

  // Initialize React Hook Form with Zod
  const form = useForm<KipFormData>({
    resolver: zodResolver(kipFormSchema),
    defaultValues: {
      studentName: "",
      homeAddress: "",
      phoneNumber: "",
      nik: "",
      birthPlace: "",
      dateOfBirth: "",
      gender: undefined,
      nisn: "",
      nim: "",
      universityName: "",
      npsn: "",
      universityStatus: undefined,
      studyProgram: "",
      yearLevel: "",
      universityProvince: "",
      universityCity: "",
      universityDistrict: "",
      universityVillage: "",
      fatherName: "",
      motherName: "",
      parentPhone: "",
      parentProvince: "Jawa Timur",
      parentCity: "Kabupaten Sidoarjo",
      parentDistrict: "",
      parentVillage: "",
      parentRtRw: "",
      parentAddress: "",
      parentWillingJoinNasdem: false,
      parentJoinReason: "",
      proposerName: "",
      proposerStatus: undefined,
      proposerStatusOther: "",
      proposerPhone: "",
      proposerAddress: "",
      proposerRelation: undefined,
      proposerRelationOther: "",
    },
    mode: "onChange",
  });

  // Watch all form values untuk auto-save
  const formValues = form.watch();
  const debouncedFormValues = useDebounce(formValues, 1000);

  // Auto-save draft when form values change (debounced)
  useEffect(() => {
    if (draftLoaded) {
      saveDraftToLocalStorage(debouncedFormValues);
    }
  }, [debouncedFormValues, draftLoaded]);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraftFromLocalStorage();
    if (draft) {
      const timestamp = getDraftTimestamp();
      toast.info(
        `Draft ditemukan dari ${timestamp}. Data otomatis dipulihkan.`,
        {
          duration: 5000,
          action: {
            label: "Hapus Draft",
            onClick: () => {
              form.reset();
              clearDraft();
              toast.success("Draft berhasil dihapus");
            },
          },
        }
      );

      // Restore form values
      Object.keys(draft).forEach((key) => {
        const value = draft[key as keyof KipFormData];
        if (value !== undefined) {
          form.setValue(key as keyof KipFormData, value as any);
        }
      });
    }
    setDraftLoaded(true);
  }, [form]);

  // Mutation untuk submit form
  const submitMutation = useMutation({
    mutationFn: async (data: KipFormData) => {
      if (!programId) {
        throw new Error(
          "Program ID tidak tersedia. Silakan akses halaman ini dari detail program."
        );
      }

      const payload = {
        programId: programId,
        ...data,
      };

      const res = await fetch("/api/registrations/kip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal mengirim pendaftaran");
      }

      return res.json();
    },
    onSuccess: () => {
      setSuccess(true);
      clearDraft();
      toast.success("Pendaftaran berhasil dikirim! Draft otomatis terhapus.");
      form.reset();
    },
    onError: (error: Error) => {
      console.error("❌ Registration error:", error);
      toast.error(error.message);
    },
  });

  const onSubmit = (data: KipFormData) => {
    submitMutation.mutate(data);
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      form
        .trigger([
          "studentName",
          "nik",
          "birthPlace",
          "dateOfBirth",
          "gender",
          "nim",
          "phoneNumber",
          "homeAddress",
        ])
        .then((isValid) => {
          if (isValid) {
            setCurrentStep(2);
          }
        });
    } else if (currentStep === 2) {
      form
        .trigger(["universityName", "universityStatus", "studyProgram", "yearLevel"])
        .then((isValid) => {
          if (isValid) {
            setCurrentStep(3);
          }
        });
    } else if (currentStep === 3) {
      form
        .trigger([
          "fatherName",
          "motherName",
          "parentPhone",
          "parentProvince",
          "parentCity",
          "parentDistrict",
          "parentVillage",
          "parentRtRw",
          "parentAddress",
        ])
        .then((isValid) => {
          if (isValid) {
            setCurrentStep(4);
          }
        });
    } else if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Success state
  if (success) {
    return <SuccessPage />;
  }

  // Error state - program not found
  if (!programId) {
    return <ErrorPage />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <NasdemHeader />

      {/* Hero Section */}
      <KipHeroSection />

      {/* Form Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <ProgressSteps currentStep={currentStep} />

            {/* Step Title Card */}
            <StepTitleCard currentStep={currentStep} />

            {/* Draft Auto-Save Indicator */}
            <DraftIndicator form={form} draftLoaded={draftLoaded} />

            {/* Form Card */}
            <Card className="border-2 border-[#001B55]/20 shadow-xl overflow-hidden rounded-2xl bg-white">
              <CardContent className="p-8 md:p-10 lg:p-12">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Step 1: Data Mahasiswa */}
                    {currentStep === 1 && <Step1DataMahasiswa form={form} />}

                    {/* Step 2: Data Universitas */}
                    {currentStep === 2 && <Step2DataUniversitas form={form} />}

                    {/* Step 3: Data Orang Tua */}
                    {currentStep === 3 && <Step3DataOrangTua form={form} />}

                    {/* Step 4: Data Pengusul */}
                    {currentStep === 4 && <Step4DataPengusul form={form} />}

                    {/* Navigation Buttons */}
                    <NavigationButtons
                      currentStep={currentStep}
                      onPrevious={prevStep}
                      onNext={nextStep}
                      isSubmitting={submitMutation.isPending}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Info Box */}
            <InfoBox />
          </div>
        </div>
      </section>

      <NasdemFooter />
    </div>
  );
}
