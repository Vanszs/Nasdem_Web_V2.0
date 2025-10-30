"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import NewsContent from "@/components/news-content";
import { SimplePagination } from "@/components/ui/pagination";

type PublicNews = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  author: { full_name: string };
};

type NewsListItem = {
  id: number;
  title: string;
  content: string | null;
  publishDate: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  user?: { username: string | null; email: string | null } | null;
};

type NewsListResponse = {
  success: boolean;
  data: NewsListItem[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
};

function stripHtml(html?: string | null) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toPublic(n: NewsListItem): PublicNews {
  const plain = stripHtml(n.content);
  const excerpt =
    plain.length > 180 ? plain.slice(0, 180).trimEnd() + "…" : plain;
  const created = n.publishDate || n.createdAt;
  const name = n.user?.username || n.user?.email || "Redaksi NasDem";
  return {
    id: String(n.id),
    title: n.title,
    content: n.content || "",
    excerpt,
    image_url: n.thumbnailUrl || "/placeholder.jpg",
    created_at: created,
    author: { full_name: name },
  };
}

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const { data: listData, isLoading: isListLoading } = useQuery({
    queryKey: ["public-news", { page, pageSize }],
    queryFn: async (): Promise<NewsListResponse> => {
      const qp = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        status: "published",
      });
      const res = await fetch(`/api/news?${qp.toString()}`, {
        cache: "no-store",
      });
      const json = await res.json();
      console.log(json);
      if (!res.ok || !json.success)
        throw new Error(json.error || "Gagal memuat berita");
      return json;
    },
  });

  const { data: recentData, isLoading: isRecentLoading } = useQuery({
    queryKey: ["public-news-recent"],
    queryFn: async (): Promise<NewsListResponse> => {
      const qp = new URLSearchParams({
        page: "1",
        pageSize: "3",
        status: "published",
      });
      const res = await fetch(`/api/news?${qp.toString()}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Gagal memuat berita");
      return json;
    },
  });

  const news = useMemo(() => (listData?.data || []).map(toPublic), [listData]);
  const recentNews = useMemo(
    () => (recentData?.data || []).map(toPublic),
    [recentData]
  );

  if (isListLoading || isRecentLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Featured skeleton */}
          <div className="mb-16">
            <div className="grid lg:grid-cols-2 gap-0">
              <Skeleton className="h-64 lg:h-[420px] w-full rounded-xl bg-gray-300" />
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-5 w-24 bg-gray-300" />
                  <Skeleton className="h-5 w-32 bg-gray-300" />
                </div>
                <Skeleton className="h-8 w-3/4 mb-4 bg-gray-300" />
                <Skeleton className="h-5 w-11/12 mb-2 bg-gray-300" />
                <Skeleton className="h-5 w-10/12 mb-6 bg-gray-300" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32 bg-gray-300" />
                  <Skeleton className="h-10 w-36 rounded-lg bg-gray-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Grid skeletons */}
              <div className="grid md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border-2 border-gray-200/60 shadow-lg p-0"
                  >
                    <Skeleton className="h-48 w-full bg-gray-300" />
                    <div className="p-6">
                      <Skeleton className="h-4 w-24 mb-3 bg-gray-300" />
                      <Skeleton className="h-6 w-3/4 mb-3 bg-gray-300" />
                      <Skeleton className="h-4 w-11/12 mb-2 bg-gray-300" />
                      <Skeleton className="h-4 w-9/12 mb-4 bg-gray-300" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24 bg-gray-300" />
                        <Skeleton className="h-8 w-20 rounded-md bg-gray-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center gap-2 mt-12">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-8 w-8 rounded-md bg-gray-300"
                  />
                ))}
              </div>
            </div>

            {/* Recent list skeleton */}
            <div className="space-y-8">
              <div className="p-6 rounded-xl border-2 border-gray-200/60 shadow-lg">
                <Skeleton className="h-6 w-48 mb-6 bg-gray-300" />
                <div className="space-y-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-3 pb-5 border-b border-gray-200 last:border-b-0 last:pb-0 p-2 rounded-lg"
                    >
                      <Skeleton className="w-20 h-15 rounded-lg bg-gray-300" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-48 mb-2 bg-gray-300" />
                        <Skeleton className="h-3 w-24 bg-gray-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <NewsContent
          news={news}
          recentNews={recentNews}
          currentPage={listData?.meta.page || page}
          totalPages={listData?.meta.totalPages || 1}
          totalCount={listData?.meta.total || news.length}
        />
        <div className="mt-10">
          <SimplePagination
            page={listData?.meta.page || page}
            totalPages={listData?.meta.totalPages || 1}
            totalItems={listData?.meta.total || news.length}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </section>
  );
}
