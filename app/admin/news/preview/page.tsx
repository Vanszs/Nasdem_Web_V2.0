"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "../../components/layout/AdminLayout";
import Image from "next/image";
import dynamic from "next/dynamic";

const BlockNoteEditor = dynamic(
  () => import("../components/blocknote-editor"),
  { ssr: false }
);

interface PreviewData {
  title: string;
  content: string;
  thumbnailUrl?: string;
  publishDate?: string;
}

export default function NewsPreviewPage() {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve preview data from sessionStorage
    const storedData = sessionStorage.getItem("newsPreview");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPreviewData(data);
      } catch (error) {
        console.error("Error parsing preview data:", error);
      }
    }
    setLoading(false);
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Belum ditentukan";
    try {
      return format(new Date(dateString), "d MMMM yyyy 'pukul' HH:mm", {
        locale: id,
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <AdminLayout breadcrumbs={[]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5BAFF] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat pratinjau...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!previewData) {
    return (
      <AdminLayout breadcrumbs={[]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">
                Data Tidak Ditemukan
              </h2>
              <p className="text-muted-foreground mb-4">
                Tidak ada data pratinjau yang tersedia. Silakan buat berita
                terlebih dahulu.
              </p>
              <Button onClick={() => window.close()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tutup
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin" },
    { label: "Berita", href: "/admin/news" },
    { label: "Pratinjau Berita" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.close()}
                className="border-2 border-gray-200 hover:border-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Pratinjau Berita</h1>
                <p className="text-muted-foreground text-sm">
                  Tampilan berita seperti yang akan terlihat oleh pengunjung
                  website
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* News Preview */}
        <Card className="border-2 border-gray-200 shadow-lg overflow-hidden">
          {/* Thumbnail */}
          {previewData.thumbnailUrl && (
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <Image
                src={previewData.thumbnailUrl}
                alt={previewData.title}
                fill
                sizes="100vw"
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <CardContent className="p-8">
            {/* Article Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-[#001B55] mb-4 leading-tight">
                {previewData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Admin NasDem</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(previewData.publishDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Pratinjau</span>
                </div>
              </div>
            </div>

            {/* Article Content (read-only BlockNote) */}
            <div className="max-w-none">
              <BlockNoteEditor
                value={previewData.content}
                onChange={() => {}}
                disabled
                className="bg-white border border-[#E8F9FF] rounded-[12px] p-4"
              />
            </div>

            {/* Preview Notice */}
            <div className="mt-8 p-4 bg-[#C5BAFF]/10 border border-[#C5BAFF]/20 rounded-lg">
              <p className="text-sm text-[#001B55]">
                <strong>Perhatian:</strong> Ini adalah halaman pratinjau. Berita
                belum dipublikasikan dan hanya visible untuk Anda.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
