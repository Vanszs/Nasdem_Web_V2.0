"use client";

import { useState, useEffect, useCallback } from "react";
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
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Check,
  User,
  Phone,
  FileText,
  ArrowRight,
  ArrowLeft,
  Users,
  BookOpen,
  Award,
  School,
  Home,
  MapPin,
  Save,
  Trash2,
  ChevronsUpDown,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

// Zod validation schema untuk form PIP lengkap
const pipFormSchema = z.object({
  // Data Siswa
  educationLevel: z.enum(["sd", "smp", "sma", "smk"], {
    required_error: "Pilih jenjang pendidikan",
  }),
  studentName: z.string().min(3, "Nama siswa minimal 3 karakter"),
  birthPlace: z.string().min(2, "Tempat lahir minimal 2 karakter"),
  dateOfBirth: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"], {
    required_error: "Pilih jenis kelamin",
  }),
  nisn: z.string().optional(),
  studentClass: z.string().min(1, "Kelas wajib diisi"),
  studentPhone: z.string().min(10, "Nomor HP/WA minimal 10 digit"),
  
  // Data Sekolah
  schoolName: z.string().min(3, "Nama sekolah minimal 3 karakter"),
  npsn: z.string().optional(),
  schoolStatus: z.enum(["negeri", "swasta"], {
    required_error: "Pilih status sekolah",
  }),
  schoolVillage: z.string().min(2, "Kelurahan/Desa wajib diisi"),
  schoolDistrict: z.string().min(2, "Kecamatan wajib diisi"),
  schoolCity: z.string().optional(),
  schoolProvince: z.string().optional(),
  
  // Data Orang Tua
  fatherName: z.string().min(3, "Nama ayah/wali minimal 3 karakter"),
  fatherPhone: z.string().min(10, "Nomor HP/WA ayah minimal 10 digit"),
  motherName: z.string().min(3, "Nama ibu minimal 3 karakter"),
  motherPhone: z.string().min(10, "Nomor HP/WA ibu minimal 10 digit"),
  parentProvince: z.string().min(1, "Pilih provinsi"),
  parentCity: z.string().min(1, "Pilih kota/kabupaten"),
  parentDistrict: z.string().min(1, "Pilih kecamatan"),
  parentVillage: z.string().min(1, "Pilih desa/kelurahan"),
  parentRtRw: z.string().min(1, "RT/RW wajib diisi"),
  parentAddress: z.string().min(10, "Alamat detail minimal 10 karakter"),
  parentWillingJoinNasdem: z.boolean(),
  parentJoinReason: z.string().optional(),
  
  // Data Pengusul
  proposerName: z.string().min(3, "Nama pengusul minimal 3 karakter"),
  proposerStatus: z.enum(["dpd", "dpc", "dprt", "kordes", "lainnya"], {
    required_error: "Pilih status pengusul",
  }),
  proposerStatusOther: z.string().optional(),
  proposerPhone: z.string().min(10, "Nomor HP/WA pengusul minimal 10 digit"),
  proposerAddress: z.string().min(10, "Alamat pengusul minimal 10 karakter"),
  proposerRelation: z.enum(["anak", "saudara", "tetangga", "lainnya"], {
    required_error: "Pilih hubungan dengan siswa",
  }),
  proposerRelationOther: z.string().optional(),
});

type PipFormData = z.infer<typeof pipFormSchema>;

// LocalStorage key untuk draft
const DRAFT_STORAGE_KEY = "pip_registration_draft";
const DRAFT_TIMESTAMP_KEY = "pip_registration_draft_timestamp";

export default function PendaftaranPipPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Get programId from URL query params
  const programIdParam = searchParams.get("programId");
  const programId = programIdParam ? parseInt(programIdParam, 10) : null;

  const totalSteps = 4; // 4 steps

  // State for cascading dropdowns
  const [selectedProvince, setSelectedProvince] = useState("Jawa Timur");
  const [selectedCity, setSelectedCity] = useState("Kabupaten Sidoarjo");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // State for kecamatan and desa from API
  const [kecamatanList, setKecamatanList] = useState<Array<{ id: number; name: string }>>([]);
  const [desaList, setDesaList] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingKecamatan, setLoadingKecamatan] = useState(false);
  const [loadingDesa, setLoadingDesa] = useState(false);
  
  // State for Command/Popover open
  const [openKecamatan, setOpenKecamatan] = useState(false);
  const [openDesa, setOpenDesa] = useState(false);

  // Fetch kecamatan on mount
  useEffect(() => {
    const fetchKecamatan = async () => {
      setLoadingKecamatan(true);
      try {
        const res = await fetch("/api/regions/kecamatan");
        const data = await res.json();
        if (data.data) {
          setKecamatanList(data.data);
        }
      } catch (error) {
        console.error("Error fetching kecamatan:", error);
        toast.error("Gagal memuat data kecamatan");
      } finally {
        setLoadingKecamatan(false);
      }
    };
    fetchKecamatan();
  }, []);

  // Fetch desa when kecamatan changes
  const fetchDesa = async (kecamatanName: string) => {
    if (!kecamatanName) {
      setDesaList([]);
      return;
    }

    setLoadingDesa(true);
    try {
      const res = await fetch(`/api/regions/desa?kecamatan=${encodeURIComponent(kecamatanName)}`);
      const data = await res.json();
      if (data.data) {
        setDesaList(data.data);
      }
    } catch (error) {
      console.error("Error fetching desa:", error);
      toast.error("Gagal memuat data desa");
    } finally {
      setLoadingDesa(false);
    }
  };

  // Initialize React Hook Form with Zod
  const form = useForm<PipFormData>({
    resolver: zodResolver(pipFormSchema),
    defaultValues: {
      // Data Siswa
      educationLevel: undefined,
      studentName: "",
      birthPlace: "",
      dateOfBirth: "",
      gender: undefined,
      nisn: "",
      studentClass: "",
      studentPhone: "",
      
      // Data Sekolah
      schoolName: "",
      npsn: "",
      schoolStatus: undefined,
      schoolVillage: "",
      schoolDistrict: "",
      schoolCity: "",
      schoolProvince: "",
      
      // Data Orang Tua
      fatherName: "",
      fatherPhone: "",
      motherName: "",
      motherPhone: "",
      parentProvince: "Jawa Timur",
      parentCity: "Kabupaten Sidoarjo",
      parentDistrict: "",
      parentVillage: "",
      parentRtRw: "",
      parentAddress: "",
      parentWillingJoinNasdem: false,
      parentJoinReason: "",
      
      // Data Pengusul
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

  // Watch untuk conditional fields
  const watchProposerStatus = form.watch("proposerStatus");
  const watchProposerRelation = form.watch("proposerRelation");
  const watchParentWilling = form.watch("parentWillingJoinNasdem");

  // Watch all form values untuk auto-save
  const formValues = form.watch();
  const debouncedFormValues = useDebounce(formValues, 1000); // Debounce 1 detik

  // LocalStorage Functions
  const saveDraftToLocalStorage = useCallback((data: Partial<PipFormData>) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(DRAFT_TIMESTAMP_KEY, new Date().toISOString());
      console.log("✅ Draft saved to localStorage");
    } catch (error) {
      console.error("❌ Failed to save draft:", error);
    }
  }, []);

  const loadDraftFromLocalStorage = useCallback((): Partial<PipFormData> | null => {
    try {
      const draftData = localStorage.getItem(DRAFT_STORAGE_KEY);
      const timestamp = localStorage.getItem(DRAFT_TIMESTAMP_KEY);
      
      if (draftData && timestamp) {
        const savedTime = new Date(timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);
        
        // Hapus draft jika lebih dari 7 hari
        if (hoursDiff > 168) {
          clearDraft();
          return null;
        }
        
        return JSON.parse(draftData);
      }
    } catch (error) {
      console.error("❌ Failed to load draft:", error);
    }
    return null;
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
      console.log("🗑️ Draft cleared from localStorage");
    } catch (error) {
      console.error("❌ Failed to clear draft:", error);
    }
  }, []);

  const getDraftTimestamp = (): string | null => {
    try {
      const timestamp = localStorage.getItem(DRAFT_TIMESTAMP_KEY);
      if (timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      }
    } catch (error) {
      console.error("❌ Failed to get timestamp:", error);
    }
    return null;
  };

  // Auto-save draft when form values change (debounced)
  useEffect(() => {
    if (draftLoaded) {
      saveDraftToLocalStorage(debouncedFormValues);
    }
  }, [debouncedFormValues, draftLoaded, saveDraftToLocalStorage]);

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
        const value = draft[key as keyof PipFormData];
        if (value !== undefined) {
          form.setValue(key as keyof PipFormData, value as any);
        }
      });

      // Restore cascading dropdown states
      if (draft.parentDistrict) {
        setSelectedDistrict(draft.parentDistrict);
        fetchDesa(draft.parentDistrict);
      }
    }
    setDraftLoaded(true);
  }, [form, loadDraftFromLocalStorage, clearDraft]);

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
      
      // Data Siswa
      formData.append("educationLevel", data.educationLevel);
      formData.append("studentName", data.studentName);
      formData.append("birthPlace", data.birthPlace);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender);
      formData.append("nisn", data.nisn || "");
      formData.append("studentClass", data.studentClass);
      formData.append("studentPhone", data.studentPhone);
      
      // Data Sekolah
      formData.append("schoolName", data.schoolName);
      formData.append("npsn", data.npsn || "");
      formData.append("schoolStatus", data.schoolStatus);
      formData.append("schoolVillage", data.schoolVillage);
      formData.append("schoolDistrict", data.schoolDistrict);
      formData.append("schoolCity", data.schoolCity || "");
      formData.append("schoolProvince", data.schoolProvince || "");
      
      // Data Orang Tua
      formData.append("fatherName", data.fatherName);
      formData.append("fatherPhone", data.fatherPhone);
      formData.append("motherName", data.motherName);
      formData.append("motherPhone", data.motherPhone);
      formData.append("parentProvince", data.parentProvince);
      formData.append("parentCity", data.parentCity);
      formData.append("parentDistrict", data.parentDistrict);
      formData.append("parentVillage", data.parentVillage);
      formData.append("parentRtRw", data.parentRtRw);
      formData.append("parentAddress", data.parentAddress);
      formData.append("parentWillingJoinNasdem", data.parentWillingJoinNasdem.toString());
      formData.append("parentJoinReason", data.parentJoinReason || "");
      
      // Data Pengusul
      formData.append("proposerName", data.proposerName);
      formData.append("proposerStatus", data.proposerStatus);
      formData.append("proposerStatusOther", data.proposerStatusOther || "");
      formData.append("proposerPhone", data.proposerPhone);
      formData.append("proposerAddress", data.proposerAddress);
      formData.append("proposerRelation", data.proposerRelation);
      formData.append("proposerRelationOther", data.proposerRelationOther || "");

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
      clearDraft(); // Clear draft dari localStorage setelah submit berhasil
      toast.success("Pendaftaran berhasil dikirim! Draft otomatis terhapus.");
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
      // Step 1: Data Siswa
      form
        .trigger(["educationLevel", "studentName", "birthPlace", "dateOfBirth", "gender", "studentClass", "studentPhone"])
        .then((isValid) => {
          if (isValid) {
            setCurrentStep(2);
          }
        });
    } else if (currentStep === 2) {
      // Step 2: Data Sekolah
      form
        .trigger(["schoolName", "schoolStatus", "schoolVillage", "schoolDistrict"])
        .then((isValid) => {
          if (isValid) {
            setCurrentStep(3);
          }
        });
    } else if (currentStep === 3) {
      // Step 3: Data Orang Tua
      form
        .trigger([
          "fatherName",
          "fatherPhone",
          "motherName",
          "motherPhone",
          "parentProvince",
          "parentCity",
          "parentDistrict",
          "parentVillage",
          "parentRtRw",
          "parentAddress"
        ])
        .then((isValid) => {
          if (isValid) {
            setCurrentStep(4);
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
                  telepon untuk proses verifikasi dan langkah selanjutnya.
                </p>
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

                  {[1, 2, 3, 4].map((step) => (
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
                        className={`text-xs sm:text-sm mt-3 font-semibold transition-all duration-300 text-center ${
                          step === currentStep
                            ? "text-[#001B55]"
                            : "text-[#6B7280]"
                        }`}
                      >
                        {step === 1 && "Data Siswa"}
                        {step === 2 && "Data Sekolah"}
                        {step === 3 && "Data Orang Tua"}
                        {step === 4 && "Data Pengusul"}
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
                    <School className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />
                  )}
                  {currentStep === 3 && (
                    <Home className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />
                  )}
                  {currentStep === 4 && (
                    <FileText className="w-6 h-6 md:w-7 md:h-7 text-[#FF9C04]" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {currentStep === 1 && "Data Siswa"}
                    {currentStep === 2 && "Data Sekolah"}
                    {currentStep === 3 && "Data Orang Tua Siswa"}
                    {currentStep === 4 && "Data Pengusul"}
                  </h2>
                  <p className="text-white/70 text-sm md:text-base">
                    {currentStep === 1 &&
                      "Lengkapi informasi pribadi siswa dengan benar"}
                    {currentStep === 2 &&
                      "Informasi sekolah dan status pendidikan"}
                    {currentStep === 3 &&
                      "Data orang tua/wali siswa dan kesediaan bergabung"}
                    {currentStep === 4 &&
                      "Informasi pengusul dan hubungan dengan siswa"}
                  </p>
                </div>
              </div>
            </div>

            {/* Draft Auto-Save Indicator */}
            {draftLoaded && (
              <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Save className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-900">
                      Draft Otomatis Aktif
                    </p>
                    <p className="text-xs text-green-700">
                      Data Anda disimpan otomatis setiap perubahan
                      {getDraftTimestamp() && (
                        <span className="ml-1">• Terakhir: {getDraftTimestamp()}</span>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Yakin ingin menghapus draft dan reset form?")) {
                      form.reset();
                      clearDraft();
                      toast.success("Draft berhasil dihapus");
                    }
                  }}
                  className="text-green-700 hover:text-green-900 hover:bg-green-100"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Draft
                </Button>
              </div>
            )}

            {/* Form Card */}
            <Card className="border-2 border-[#001B55]/20 shadow-xl overflow-hidden rounded-2xl bg-white">
              <CardContent className="p-8 md:p-10 lg:p-12">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Step 1: Data Siswa */}
                    {currentStep === 1 && (
                      <div className="space-y-6 animate-fade-in">
                        {/* Jenjang Pendidikan - Checkbox Style */}
                        <FormField
                          control={form.control}
                          name="educationLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#001B55] font-semibold text-base mb-3 block">
                                Jenjang Pendidikan <span className="text-red-500">*</span>
                              </FormLabel>
                              <div className="flex flex-wrap gap-4">
                                {[
                                  { value: "sd", label: "SD" },
                                  { value: "smp", label: "SMP" },
                                  { value: "sma", label: "SMA" },
                                  { value: "smk", label: "SMK" },
                                ].map((option) => (
                                  <div key={option.value} className="flex items-center">
                                    <Checkbox
                                      checked={field.value === option.value}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange(option.value);
                                        }
                                      }}
                                      id={`education-${option.value}`}
                                    />
                                    <Label
                                      htmlFor={`education-${option.value}`}
                                      className="ml-2 cursor-pointer text-sm font-medium"
                                    >
                                      {option.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Nama Siswa */}
                        <FormField
                          control={form.control}
                          name="studentName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                                <User className="w-4 h-4" />
                                Nama Lengkap Siswa <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Nama lengkap sesuai identitas"
                                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Tempat & Tanggal Lahir */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="birthPlace"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Tempat Lahir <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Contoh: Sidoarjo"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Tanggal Lahir <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="date"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Jenis Kelamin */}
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#001B55] font-semibold">
                                Jenis Kelamin <span className="text-red-500">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all">
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

                        {/* NISN */}
                        <FormField
                          control={form.control}
                          name="nisn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#001B55] font-semibold">
                                NISN (Nomor Induk Siswa Nasional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Masukkan NISN jika ada"
                                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Opsional - Isi jika sudah memiliki NISN
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Kelas */}
                        <FormField
                          control={form.control}
                          name="studentClass"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#001B55] font-semibold">
                                Kelas <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Contoh: 10 IPA 1"
                                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Nomor HP/WA Siswa */}
                        <FormField
                          control={form.control}
                          name="studentPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                                <Phone className="w-4 h-4" />
                                Nomor HP/WA Siswa <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="tel"
                                  placeholder="08xxxxxxxxxx"
                                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 2: Data Sekolah */}
                    {currentStep === 2 && (
                      <div className="space-y-6 animate-fade-in">
                        {/* Nama Sekolah */}
                        <FormField
                          control={form.control}
                          name="schoolName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                                <School className="w-4 h-4" />
                                Nama Sekolah <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Nama sekolah lengkap"
                                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* NPSN */}
                        <FormField
                          control={form.control}
                          name="npsn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#001B55] font-semibold">
                                NPSN (Nomor Pokok Sekolah Nasional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Masukkan NPSN jika ada"
                                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Opsional - Isi jika sekolah memiliki NPSN
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Status Sekolah - Radio */}
                        <FormField
                          control={form.control}
                          name="schoolStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#001B55] font-semibold text-base mb-3 block">
                                Status Sekolah <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex gap-6"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="negeri" id="negeri" />
                                    <Label htmlFor="negeri" className="cursor-pointer">Negeri</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="swasta" id="swasta" />
                                    <Label htmlFor="swasta" className="cursor-pointer">Swasta</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Lokasi Sekolah */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="schoolVillage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Kelurahan/Desa <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Nama kelurahan/desa"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="schoolDistrict"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Kecamatan <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Nama kecamatan"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="schoolCity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Kabupaten/Kota
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Contoh: Sidoarjo"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="schoolProvince"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Provinsi
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Contoh: Jawa Timur"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Data Orang Tua */}
                    {currentStep === 3 && (
                      <div className="space-y-6 animate-fade-in">
                        {/* Data Ayah/Wali */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="fatherName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                                  <User className="w-4 h-4" />
                                  Nama Ayah/Wali <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Nama lengkap ayah/wali"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="fatherPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                                  <Phone className="w-4 h-4" />
                                  Nomor HP/WA Ayah <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="tel"
                                    placeholder="08xxxxxxxxxx"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Data Ibu */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="motherName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                                  <User className="w-4 h-4" />
                                  Nama Ibu <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Nama lengkap ibu"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="motherPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                                  <Phone className="w-4 h-4" />
                                  Nomor HP/WA Ibu <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="tel"
                                    placeholder="08xxxxxxxxxx"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Alamat Orang Tua - Cascading Dropdown */}
                        <div className="space-y-4 border-2 border-[#001B55]/20 rounded-xl p-6 bg-gradient-to-br from-white to-blue-50/20">
                          <h3 className="text-lg font-bold text-[#001B55] flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5" />
                            Alamat Lengkap Orang Tua
                          </h3>

                          {/* Provinsi - Fixed to Jawa Timur */}
                          <FormField
                            control={form.control}
                            name="parentProvince"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Provinsi <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    value="Jawa Timur"
                                    readOnly
                                    disabled
                                    className="h-12 rounded-xl border-[#001B55]/20 bg-gray-50 text-gray-600 font-medium"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Kota/Kabupaten - Fixed to Sidoarjo */}
                          <FormField
                            control={form.control}
                            name="parentCity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Kota/Kabupaten <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    value="Kabupaten Sidoarjo"
                                    readOnly
                                    disabled
                                    className="h-12 rounded-xl border-[#001B55]/20 bg-gray-50 text-gray-600 font-medium"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Kecamatan - From API with Search */}
                          <FormField
                            control={form.control}
                            name="parentDistrict"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Kecamatan <span className="text-red-500">*</span>
                                </FormLabel>
                                <Popover open={openKecamatan} onOpenChange={setOpenKecamatan}>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        disabled={loadingKecamatan}
                                        className={cn(
                                          "h-12 w-full justify-between rounded-xl border-[#001B55]/20 hover:border-[#001B55] hover:bg-transparent font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {loadingKecamatan
                                          ? "Memuat data..."
                                          : field.value
                                          ? kecamatanList.find((k) => k.name === field.value)?.name
                                          : "Pilih Kecamatan"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command>
                                      <CommandInput placeholder="Cari kecamatan..." className="h-9" />
                                      <CommandList className="max-h-[240px] overflow-y-auto">
                                        <CommandEmpty>Kecamatan tidak ditemukan.</CommandEmpty>
                                        <CommandGroup>
                                          {kecamatanList.map((kecamatan) => (
                                            <CommandItem
                                              key={kecamatan.id}
                                              value={kecamatan.name}
                                              onSelect={() => {
                                                field.onChange(kecamatan.name);
                                                setSelectedDistrict(kecamatan.name);
                                                form.setValue("parentVillage", "");
                                                fetchDesa(kecamatan.name);
                                                setOpenKecamatan(false);
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  field.value === kecamatan.name ? "opacity-100" : "opacity-0"
                                                )}
                                              />
                                              {kecamatan.name}
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Desa/Kelurahan - From API based on Kecamatan with Search */}
                          <FormField
                            control={form.control}
                            name="parentVillage"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Desa/Kelurahan <span className="text-red-500">*</span>
                                </FormLabel>
                                <Popover open={openDesa} onOpenChange={setOpenDesa}>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        disabled={!selectedDistrict || loadingDesa}
                                        className={cn(
                                          "h-12 w-full justify-between rounded-xl border-[#001B55]/20 hover:border-[#001B55] hover:bg-transparent font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {loadingDesa
                                          ? "Memuat data..."
                                          : !selectedDistrict
                                          ? "Pilih kecamatan terlebih dahulu"
                                          : field.value
                                          ? desaList.find((d) => d.name === field.value)?.name
                                          : "Pilih Desa/Kelurahan"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command>
                                      <CommandInput placeholder="Cari desa/kelurahan..." className="h-9" />
                                      <CommandList className="max-h-[240px] overflow-y-auto">
                                        <CommandEmpty>Desa/Kelurahan tidak ditemukan.</CommandEmpty>
                                        <CommandGroup>
                                          {desaList.map((desa) => (
                                            <CommandItem
                                              key={desa.id}
                                              value={desa.name}
                                              onSelect={() => {
                                                field.onChange(desa.name);
                                                setOpenDesa(false);
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  field.value === desa.name ? "opacity-100" : "opacity-0"
                                                )}
                                              />
                                              {desa.name}
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* RT/RW */}
                          <FormField
                            control={form.control}
                            name="parentRtRw"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  RT/RW <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Contoh: 001/002 atau RT 01/RW 02"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Format: RT/RW (contoh: 001/002)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Alamat Detail */}
                          <FormField
                            control={form.control}
                            name="parentAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                                  <Home className="w-4 h-4" />
                                  Alamat Detail <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    rows={3}
                                    placeholder="Alamat lengkap: Nama jalan, gang, nomor rumah&#10;Contoh: Jl. Pahlawan No. 45, Gang Mawar 3, Rumah cat biru"
                                    className="rounded-xl resize-none border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Tuliskan detail jalan, gang, nomor rumah, atau patokan lainnya
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Bersedia Bergabung di Partai Nasdem */}
                        <FormField
                          control={form.control}
                          name="parentWillingJoinNasdem"
                          render={({ field }) => (
                            <FormItem className="border-2 border-[#001B55]/20 rounded-xl p-6 bg-blue-50/30 hover:border-[#001B55]/40 transition-all">
                              <div className="flex items-start space-x-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="willing-join"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel
                                    htmlFor="willing-join"
                                    className="text-[#001B55] font-semibold cursor-pointer"
                                  >
                                    Bersedia Bergabung di Partai NasDem
                                  </FormLabel>
                                  <FormDescription className="text-sm">
                                    Centang jika orang tua bersedia bergabung di Partai NasDem Sidoarjo
                                  </FormDescription>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Alasan Bergabung/Tidak Bergabung - Conditional */}
                        {watchParentWilling !== undefined && (
                          <FormField
                            control={form.control}
                            name="parentJoinReason"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Alasan {watchParentWilling ? "Bergabung" : "Tidak Bergabung"}
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    rows={3}
                                    placeholder={`Jelaskan alasan ${watchParentWilling ? "bersedia" : "tidak bersedia"} bergabung (opsional)`}
                                    className="rounded-xl resize-none border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    )}

                    {/* Step 4: Data Pengusul */}
                    {currentStep === 4 && (
                      <div className="space-y-6 animate-fade-in">
                        {/* Nama Pengusul */}
                        <FormField
                          control={form.control}
                          name="proposerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                                <User className="w-4 h-4" />
                                Nama Pengusul <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Nama lengkap pengusul"
                                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Status Pengusul */}
                        <FormField
                          control={form.control}
                          name="proposerStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#001B55] font-semibold">
                                Status Pengusul <span className="text-red-500">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all">
                                    <SelectValue placeholder="Pilih status pengusul" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="dpd">DPD</SelectItem>
                                  <SelectItem value="dpc">DPC</SelectItem>
                                  <SelectItem value="dprt">DPRT</SelectItem>
                                  <SelectItem value="kordes">KORDES</SelectItem>
                                  <SelectItem value="lainnya">Lainnya</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Status Lainnya - Conditional */}
                        {watchProposerStatus === "lainnya" && (
                          <FormField
                            control={form.control}
                            name="proposerStatusOther"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Sebutkan Status Lainnya
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Sebutkan status pengusul"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Nomor HP/WA Pengusul */}
                        <FormField
                          control={form.control}
                          name="proposerPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                                <Phone className="w-4 h-4" />
                                Nomor HP/WA Pengusul <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="tel"
                                  placeholder="08xxxxxxxxxx"
                                  className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Alamat Pengusul */}
                        <FormField
                          control={form.control}
                          name="proposerAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-[#001B55] font-semibold">
                                <Home className="w-4 h-4" />
                                Alamat Pengusul <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={4}
                                  placeholder="Alamat lengkap pengusul"
                                  className="rounded-xl resize-none border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Hubungan dengan Siswa */}
                        <FormField
                          control={form.control}
                          name="proposerRelation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#001B55] font-semibold">
                                Hubungan dengan Siswa <span className="text-red-500">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all">
                                    <SelectValue placeholder="Pilih hubungan" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="anak">Anak</SelectItem>
                                  <SelectItem value="saudara">Saudara</SelectItem>
                                  <SelectItem value="tetangga">Tetangga</SelectItem>
                                  <SelectItem value="lainnya">Lainnya</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Hubungan Lainnya - Conditional */}
                        {watchProposerRelation === "lainnya" && (
                          <FormField
                            control={form.control}
                            name="proposerRelationOther"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#001B55] font-semibold">
                                  Sebutkan Hubungan Lainnya
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Sebutkan hubungan dengan siswa"
                                    className="h-12 rounded-xl border-[#001B55]/20 focus:border-[#001B55] focus:ring-2 focus:ring-[#001B55]/20 transition-all"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
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
            <div className="mt-10 md:mt-12 bg-white shadow-lg rounded-2xl overflow-hidden border-2 border-[#001B55]/20">
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
                        nomor telepon
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



