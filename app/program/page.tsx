"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  Sprout,
  Heart,
  Building,
  Users,
  Briefcase,
  Calendar,
  Target,
  Clock,
} from "lucide-react";
import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";
import { ProgramFilters } from "@/components/programs/ProgramFilters";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { JoinProgramDialog as JoinDialog } from "@/components/programs/JoinProgramDialog";
import { SimplePagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

type Coordinator = {
  id: number;
  fullName: string;
  photoUrl?: string | null;
};

type ProgramItem = {
  id: number;
  name: string;
  description?: string | null;
  status: string;
  category?: string | null;
  target: number;
  currentTarget: number;
  startDate?: string | null;
  endDate?: string | null;
  coordinator?: Coordinator | null;
};

type ProgramsResponse = {
  data: ProgramItem[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
};

const categoryIconMap: Record<string, any> = {
  pendidikan: GraduationCap,
  ekonomi: Briefcase,
  pertanian: Sprout,
  sosial: Heart,
  advokasi: Building,
  organisasi: Users,
};

// form moved to components/programs/JoinProgramDialog

export default function ProgramPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);

  const debouncedQ = useDebounce(q, 400);
  const debouncedCategory = useDebounce(category, 400);

  const { data, isLoading } = useQuery<ProgramsResponse>({
    queryKey: [
      "programs",
      { page, q: debouncedQ, category: debouncedCategory },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", String(20));
      params.set("status", "ongoing");
      if (debouncedQ) params.set("q", debouncedQ);
      if (debouncedCategory) params.set("category", debouncedCategory);
      const res = await fetch(`/api/programs?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat program");
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const programs = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, pageSize: 20, total: 0, totalPages: 0 };

  const joinMutation = useMutation({
    // Switch to PIP registration endpoint with multipart FormData
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/registrations/pip", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Gagal mendaftar program");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Pendaftaran terkirim. Terima kasih!");
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: () => toast.error("Gagal mengirim pendaftaran"),
  });

  return (
    <div className="min-h-screen bg-nasdem-light-gray text-foreground">
      <NasdemHeader />

      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-nasdem-orange/10 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-nasdem-orange rounded-full animate-pulse"></div>
              <span className="text-nasdem-blue text-sm font-medium">
                Program Unggulan
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-nasdem-blue mb-4">
              Program <span className="text-nasdem-orange">Kerja</span> Lengkap
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Komitmen nyata DPD NasDem Sidoarjo untuk memajukan masyarakat
              melalui program-program strategis dan berkelanjutan periode
              2024-2029.
            </p>
          </div>

          {/* Search & Filter */}
          <ProgramFilters
            q={q}
            onQChange={(val) => {
              setPage(1);
              setQ(val);
            }}
            category={category}
            onCategoryChange={(val) => {
              setPage(1);
              setCategory(val);
            }}
          />

          {/* Programs Grid */}
          <div className="grid gap-8 mb-10 md:mb-16">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  className="border-l-4 border-l-nasdem-blue bg-white"
                >
                  <CardHeader>
                    <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 w-full bg-gray-100 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))
            ) : programs.length === 0 ? (
              <div className="text-center text-gray-600">
                Tidak ada program berlangsung.
              </div>
            ) : (
              programs.map((program: any, index: number) => {
                const IconComponent =
                  categoryIconMap[program.category?.toLowerCase?.()] || Target;
                return (
                  <ProgramCard
                    key={program.id ?? index}
                    program={program}
                    IconComponent={IconComponent}
                    JoinDialog={
                      <JoinDialog
                        programId={program.id}
                        isSubmitting={joinMutation.isPending}
                        onSubmit={(fd) => joinMutation.mutate(fd)}
                      />
                    }
                  />
                );
              })
            )}
          </div>

          {/* Pagination */}
          <SimplePagination
            page={meta.page}
            totalPages={meta.totalPages}
            onChange={(p) => setPage(p)}
            totalItems={meta.total}
          />

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-nasdem-blue to-nasdem-orange text-white text-center mt-10">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Bergabunglah dalam Gerakan Perubahan
              </h3>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                Mari bersama-sama mewujudkan Sidoarjo yang lebih maju, adil, dan
                sejahtera melalui program-program nyata.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-nasdem-blue hover:bg-gray-100 font-semibold text-lg px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Daftar Sebagai Relawan
                </Button>
                <Button
                  variant="outline"
                  className="border-white bg-white/10 text-white hover:bg-white hover:text-nasdem-blue font-semibold text-lg px-8 py-3 rounded-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                >
                  Hubungi Tim Program
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <NasdemFooter />
    </div>
  );
}
