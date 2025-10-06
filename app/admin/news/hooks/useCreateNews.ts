import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewsListItem } from "./useNewsList";

export interface CreateNewsPayload {
  title: string;
  content?: string | null;
  publishDate?: string | null;
  thumbnailUrl?: string | null;
}

interface CreateNewsResponse {
  success: boolean;
  data: NewsListItem;
  error?: string;
}

async function createNews(payload: CreateNewsPayload): Promise<NewsListItem> {
  const res = await fetch("/api/news", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const json: CreateNewsResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal membuat berita");
  }
  return json.data;
}

export function useCreateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
    },
  });
}
