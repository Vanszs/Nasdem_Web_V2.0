"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileText, Image, Users, BarChart3, Eye } from "lucide-react";
import { AdminLayout } from "./components/layout/AdminLayout";
import { KPIStat, KPIStatSkeleton } from "@/components/dashboard/kpi-stat";
import {
  ChartCard,
  ChartCardSkeleton,
} from "@/components/dashboard/chart-card";
import { DataTable, DataTableColumn } from "@/components/dashboard/data-table";
import { StackedBarChart } from "@/components/dashboard/stacked-bar-chart";
import { LineTrendChart } from "@/components/dashboard/line-trend-chart";

// Fallback placeholders used while fetching to minimize layout shift
const FALLBACK_KPIS = {
  totalContent: 0,
  monthlyViews: 0,
  activeMembers: 0,
  totalGallery: 0,
};

const tableColumns: DataTableColumn[] = [
  { key: "month", label: "Bulan", width: 120 },
  {
    key: "Berita",
    label: "Berita",
    align: "right",
    format: "number",
  },
  {
    key: "Galeri",
    label: "Galeri",
    align: "right",
    format: "number",
  },
  {
    key: "Organisasi",
    label: "Organisasi",
    align: "right",
    format: "number",
  },
  {
    key: "Program",
    label: "Program",
    align: "right",
    format: "number",
  },
];

export default function AdminDashboard() {
  // Queries
  const kpisQuery = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/overview", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal memuat overview");
      const json = await res.json();
      return json.data as typeof FALLBACK_KPIS;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: FALLBACK_KPIS,
  });

  const contentQuery = useQuery({
    queryKey: ["dashboard", "content"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/content", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal memuat data konten");
      const json = await res.json();
      return json.data as {
        programChartData: Array<Record<string, number | string>>;
        recentContentData: Array<Record<string, number | string>>;
      };
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: { programChartData: [], recentContentData: [] },
  });

  const membersQuery = useQuery({
    queryKey: ["dashboard", "members"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/members", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal memuat data anggota");
      const json = await res.json();
      return json.data as Array<Record<string, number | string>>;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: [],
  });

  const loading =
    kpisQuery.isLoading || contentQuery.isLoading || membersQuery.isLoading;

  const kpisData = kpisQuery.data ?? FALLBACK_KPIS;
  const programChartData = contentQuery.data?.programChartData ?? [];
  const recentContentData = contentQuery.data?.recentContentData ?? [];
  const memberGrowthData = membersQuery.data ?? [];

  return (
    <AdminLayout>
      <div className="max-w-container mx-auto space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-xxl font-bold text-text-primary mb-2">
            Dashboard Admin
          </h1>
          <p className="text-md text-text-secondary">
            Ringkasan aktivitas dan statistik DPD NasDem Sidoarjo
          </p>
        </div>

        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              <KPIStatSkeleton />
              <KPIStatSkeleton />
              <KPIStatSkeleton />
              <KPIStatSkeleton />
            </>
          ) : (
            <>
              <KPIStat
                label="Total Konten"
                value={kpisData.totalContent}
                format={{ type: "number" }}
                icon={FileText}
                delta={{
                  value: 8.2,
                  direction: "up",
                  tooltip: "Naik 8.2% dari bulan lalu",
                }}
              />
              <KPIStat
                label="Total Program"
                value={(kpisData as any).totalProgram ?? 0}
                format={{ type: "number" }}
                icon={Eye}
                delta={{
                  value: 15.3,
                  direction: "up",
                  tooltip: "Naik 15.3% dari bulan lalu",
                }}
              />
              <KPIStat
                label="Anggota Aktif"
                value={kpisData.activeMembers}
                format={{ type: "number" }}
                icon={Users}
                delta={{
                  value: 2.1,
                  direction: "down",
                  tooltip: "Turun 2.1% dari bulan lalu",
                }}
              />
              <KPIStat
                label="Media Galeri"
                value={kpisData.totalGallery}
                format={{ type: "number" }}
                icon={Image}
                delta={{
                  value: 12.8,
                  direction: "up",
                  tooltip: "Naik 12.8% dari bulan lalu",
                }}
              />
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading ? (
            <>
              <ChartCardSkeleton />
              <ChartCardSkeleton />
            </>
          ) : (
            <>
              <ChartCard
                title="Program"
                subtitle="Distribusi status program 6 bulan terakhir"
              >
                <StackedBarChart
                  data={programChartData}
                  dataKeyX="month"
                  stacks={[
                    { key: "pending", color: "#FBBF24" },
                    { key: "ongoing", color: "#60A5FA" },
                    { key: "planning", color: "#C5BAFF" },
                    { key: "completed", color: "#34D399" },
                  ]}
                  height={260}
                  useNumber={true}
                />
              </ChartCard>

              <ChartCard
                title="Pertumbuhan Anggota"
                subtitle="Perkembangan keanggotaan per level organisasi"
              >
                <LineTrendChart
                  data={memberGrowthData}
                  dataKeyX="month"
                  series={[
                    { key: "Total Anggota", color: "#C5BAFF" },
                    { key: "DPC", color: "#C4D9FF" },
                    { key: "DPRT", color: "#E8F9FF" },
                    { key: "Kader", color: "#FF9C04" },
                  ]}
                  height={260}
                  useNumber={true}
                />
              </ChartCard>
            </>
          )}
        </div>

        {/* Data Table Section */}
        <div className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-text-primary">
              Aktivitas 6 Bulan Terakhir
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Detail penambahan konten per kategori setiap bulan
            </p>
          </div>

          <DataTable
            columns={tableColumns}
            data={recentContentData}
            rowKey="month"
            stickyHeader={true}
            pagination={{ pageSize: 6 }}
            loading={loading}
            emptyState={{
              title: "Belum ada data aktivitas",
              action: {
                label: "Refresh Data",
                onClick: () => window.location.reload(),
              },
            }}
          />
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Link
            href="/admin/news/create"
            className="group p-5 rounded-xl bg-card border border-border hover:border-brand-accent hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
                <FileText className="w-5 h-5 text-brand-primary group-hover:text-brand-accent" />
              </div>
              <h3 className="font-semibold text-text-primary">Buat Berita</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Tambah artikel berita baru
            </p>
          </Link>

          <Link
            href="/admin/gallery"
            className="group p-5 rounded-xl bg-card border border-border hover:border-brand-accent hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
                <Image className="w-5 h-5 text-brand-primary group-hover:text-brand-accent" />
              </div>
              <h3 className="font-semibold text-text-primary">Kelola Galeri</h3>
            </div>
            <p className="text-sm text-text-secondary">Upload foto dan video</p>
          </Link>

          <Link
            href="/admin/organizations"
            className="group p-5 rounded-xl bg-card border border-border hover:border-brand-accent hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
                <Users className="w-5 h-5 text-brand-primary group-hover:text-brand-accent" />
              </div>
              <h3 className="font-semibold text-text-primary">Struktur</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Kelola struktur organisasi
            </p>
          </Link>

          <Link
            href="/admin/statistik-pemilu"
            className="group p-5 rounded-xl bg-card border border-border hover:border-brand-accent hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
                <BarChart3 className="w-5 h-5 text-brand-primary group-hover:text-brand-accent" />
              </div>
              <h3 className="font-semibold text-text-primary">Statistik</h3>
            </div>
            <p className="text-sm text-text-secondary">Data analisis pemilu</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
