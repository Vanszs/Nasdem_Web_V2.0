"use client";

import { useState } from "react";
import {
  FileText,
  Image,
  Users,
  BarChart3,
  TrendingUp,
  Eye,
  Calendar,
} from "lucide-react";
import { AdminLayout } from "./components/layout/AdminLayout";
import { KPIStat, KPIStatSkeleton } from "@/components/dashboard/kpi-stat";
import { ChartCard, ChartCardSkeleton } from "@/components/dashboard/chart-card";
import {
  DataTable,
  DataTableSkeleton,
  DataTableColumn,
} from "@/components/dashboard/data-table";

// Sample data - replace with actual API calls
const kpisData = {
  totalContent: 512,
  monthlyViews: 28400,
  activeMembers: 156,
  totalGallery: 238,
};

const recentContentData = [
  {
    month: "Januari",
    Berita: 12,
    Galeri: 8,
    Organisasi: 5,
    Program: 10,
  },
  {
    month: "Februari",
    Berita: 15,
    Galeri: 10,
    Organisasi: 7,
    Program: 12,
  },
  {
    month: "Maret",
    Berita: 18,
    Galeri: 12,
    Organisasi: 6,
    Program: 15,
  },
  {
    month: "April",
    Berita: 20,
    Galeri: 15,
    Organisasi: 8,
    Program: 18,
  },
  {
    month: "Mei",
    Berita: 22,
    Galeri: 18,
    Organisasi: 10,
    Program: 20,
  },
  {
    month: "Juni",
    Berita: 25,
    Galeri: 20,
    Organisasi: 12,
    Program: 22,
  },
];

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
  const breadcrumbs = [{ label: "Dashboard" }];
  const [loading, setLoading] = useState(false);

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
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
                delta={{ value: 8.2, direction: "up", tooltip: "Naik 8.2% dari bulan lalu" }}
              />
              <KPIStat
                label="Views Bulanan"
                value={kpisData.monthlyViews}
                format={{ type: "number" }}
                icon={Eye}
                delta={{ value: 15.3, direction: "up", tooltip: "Naik 15.3% dari bulan lalu" }}
              />
              <KPIStat
                label="Anggota Aktif"
                value={kpisData.activeMembers}
                format={{ type: "number" }}
                icon={Users}
                delta={{ value: 2.1, direction: "down", tooltip: "Turun 2.1% dari bulan lalu" }}
              />
              <KPIStat
                label="Media Galeri"
                value={kpisData.totalGallery}
                format={{ type: "number" }}
                icon={Image}
                delta={{ value: 12.8, direction: "up", tooltip: "Naik 12.8% dari bulan lalu" }}
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
                title="Konten per Kategori"
                subtitle="Distribusi konten 6 bulan terakhir"
              >
                <div className="h-64 flex items-center justify-center text-text-secondary">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chart akan ditampilkan di sini</p>
                    <p className="text-xs text-text-tertiary mt-1">
                      Install recharts: npm install recharts
                    </p>
                  </div>
                </div>
              </ChartCard>

              <ChartCard
                title="Trend Aktivitas"
                subtitle="Aktivitas penambahan konten per bulan"
              >
                <div className="h-64 flex items-center justify-center text-text-secondary">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chart akan ditampilkan di sini</p>
                    <p className="text-xs text-text-tertiary mt-1">
                      Install recharts: npm install recharts
                    </p>
                  </div>
                </div>
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
          <a
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
          </a>

          <a
            href="/admin/gallery"
            className="group p-5 rounded-xl bg-card border border-border hover:border-brand-accent hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
                <Image className="w-5 h-5 text-brand-primary group-hover:text-brand-accent" />
              </div>
              <h3 className="font-semibold text-text-primary">Kelola Galeri</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Upload foto dan video
            </p>
          </a>

          <a
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
          </a>

          <a
            href="/admin/statistik-pemilu"
            className="group p-5 rounded-xl bg-card border border-border hover:border-brand-accent hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
                <BarChart3 className="w-5 h-5 text-brand-primary group-hover:text-brand-accent" />
              </div>
              <h3 className="font-semibold text-text-primary">Statistik</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Data analisis pemilu
            </p>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
