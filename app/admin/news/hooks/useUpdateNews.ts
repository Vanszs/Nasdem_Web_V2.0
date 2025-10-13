import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NewsListItem } from "./useNewsList";

export interface UpdateNewsPayload {
  id: number;
  title: string;
  content?: string | null;
  publishDate?: string | null;
  thumbnailUrl?: string | null;
}

interface UpdateNewsResponse {
  success: boolean;
  data: NewsListItem;
  error?: string;
}

async function updateNews(payload: UpdateNewsPayload): Promise<NewsListItem> {
  const { id, ...body } = payload;
  const res = await fetch(`/api/news/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json: UpdateNewsResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal memperbarui berita");
  }
  return json.data;
}

export function useUpdateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateNews,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["news"] });
      qc.invalidateQueries({ queryKey: ["news", data.id] });
    },
  });
}
