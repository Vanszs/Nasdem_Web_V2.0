"use client";
import { AdminLayout } from "@/src/components/layout/AdminLayout";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Users, Plus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export function StructurePage() {
  const router = useRouter();
  
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "Struktur" },
    { label: "DPD" }
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header Section with Border */}
        <div className="bg-white/70 backdrop-blur-sm border-2 border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Struktur DPD</h1>
              <p className="text-muted-foreground">Kelola pengurus DPD Partai NasDem Sidoarjo</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-2 border-gray-200 hover:border-gray-300"
                onClick={() => router.push("/members")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Daftar Anggota
              </Button>
              <Button className="bg-brand-accent border-2 border-brand-accent/20 hover:border-brand-accent/40 transition-all duration-300">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pengurus
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Card with Enhanced Border */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/80 hover:border-gray-300/90 shadow-lg hover:shadow-xl transition-all duration-300 p-12 text-center">
          <Users className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4 p-2 border-2 border-dashed border-gray-300/60 rounded-2xl" />
          <h3 className="text-lg font-semibold mb-2">Struktur Organisasi</h3>
          <p className="text-muted-foreground mb-4">Tambahkan entri BPH untuk menampilkan di landing page.</p>
          <div className="flex justify-center gap-3">
            <Button 
              variant="outline" 
              className="border-2 border-gray-200 hover:border-gray-300"
              onClick={() => router.push("/members")}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Lihat Daftar Anggota
            </Button>
            <Button className="bg-brand-accent border-2 border-brand-accent/20 hover:border-brand-accent/40 transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengurus
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
