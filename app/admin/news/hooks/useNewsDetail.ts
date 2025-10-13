import { useQuery } from "@tanstack/react-query";
import type { NewsListItem } from "./useNewsList";

interface NewsDetailResponse {
  success: boolean;
  data: NewsListItem;
  error?: string;
}

async function fetchNewsDetail(
  id: number,
  signal?: AbortSignal
): Promise<NewsListItem> {
  const res = await fetch(`/api/news/${id}`, { cache: "no-store", signal });
  const json: NewsDetailResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal memuat berita");
  }
  return json.data;
}

export function useNewsDetail(id?: number) {
  return useQuery({
    queryKey: ["news", id],
    queryFn: ({ signal }) => fetchNewsDetail(id as number, signal),
    enabled: typeof id === "number" && id > 0,
  });
}
