"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  GraduationCap,
  Sprout,
  Heart,
  Building,
  Users,
  Briefcase,
  Target,
} from "lucide-react";
import NasdemHeader from "@/components/nasdem-header";
import NasdemFooter from "@/components/nasdem-footer";
import { ProgramFilters } from "@/app/program/components/ProgramFilters";
import { ProgramCard } from "@/app/program/components/ProgramCard";
import { JoinProgramDialog as JoinDialog } from "@/app/program/components/JoinProgramDialog";
import { ProgramDetailDialog } from "@/app/program/components/ProgramDetailDialog";
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
                const isPip =
                  (program.category || "").toLowerCase() === "pendidikan" &&
                  (program.name || "")
                    .toLowerCase()
                    .includes("pendidikan inklusif");
                return (
                  <ProgramCard
                    key={program.id ?? index}
                    program={program}
                    IconComponent={IconComponent}
                    DetailDialog={<ProgramDetailDialog program={program} />}
                    showJoin={isPip}
                    JoinDialog={
                      isPip ? (
                        <JoinDialog
                          programId={program.id}
                          isSubmitting={joinMutation.isPending}
                          onSubmit={(fd) => joinMutation.mutate(fd)}
                        />
                      ) : undefined
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
        </div>
      </main>

      <NasdemFooter />
    </div>
  );
}
