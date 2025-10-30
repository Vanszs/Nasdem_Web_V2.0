"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Calendar, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Reuse BlockNote editor component in disabled/read-only mode
const BlockNoteEditor = dynamic(
  () =>
    import("@/app/admin/news/components/blocknote-editor").then(
      (m) => m.BlockNoteEditorField
    ),
  { ssr: false }
);

type NewsDetail = {
  id: number;
  title: string;
  content: string | null;
  publishDate: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  user?: { username: string | null; email: string | null } | null;
};

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-news-detail", id],
    enabled: !!id,
    queryFn: async (): Promise<{ success: boolean; data: NewsDetail }> => {
      const res = await fetch(`/api/news/${id}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Gagal memuat berita");
      return json;
    },
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-9 md:h-12 w-3/4 mb-4 bg-gray-300" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-5 w-40 bg-gray-300" />
            <Skeleton className="h-5 w-24 bg-gray-300" />
          </div>
          <Skeleton className="w-full h-72 md:h-[420px] mb-8 rounded-xl bg-gray-300" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-11/12 bg-gray-300" />
            <Skeleton className="h-5 w-10/12 bg-gray-300" />
            <Skeleton className="h-5 w-9/12 bg-gray-300" />
            <Skeleton className="h-5 w-8/12 bg-gray-300" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-500">
        Berita tidak ditemukan.
      </div>
    );
  }

  const item = data.data;
  const author = item.user?.username || item.user?.email || "Redaksi NasDem";
  const dateStr = (item.publishDate || item.createdAt) ?? item.createdAt;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/berita");
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-nasdem-blue/30 text-nasdem-blue hover:bg-nasdem-blue hover:text-white transition-colors"
          >
            ← Kembali
          </button>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-nasdem-blue mb-4 leading-tight">
          {item.title}
        </h1>
        <div className="flex items-center gap-4 text-gray-500 mb-6">
          <span className="flex items-center gap-2 text-sm">
            <Calendar size={16} />
            {new Date(dateStr).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-2 text-sm">
            <User size={16} />
            {author}
          </span>
        </div>

        {item.thumbnailUrl && (
          <div className="relative w-full h-72 md:h-[420px] mb-8 rounded-xl overflow-hidden border border-gray-200 shadow-lg">
            <Image
              src={item.thumbnailUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="prose max-w-none">
          <BlockNoteEditor
            value={item.content || ""}
            onChange={() => {}}
            disabled
            className="p-0 border-none shadow-none"
          />
        </div>
      </div>
    </section>
  );
}
