import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateStatusPayload {
  id: number;
  publishDate: string | null;
}

async function deleteNews(id: number) {
  const res = await fetch(`/api/news/${id}`, {
    method: "DELETE",
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal menghapus berita");
  }
  return true;
}

async function updateNewsStatus({ id, publishDate }: UpdateStatusPayload) {
  const res = await fetch(`/api/news/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publishDate }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal mengubah status berita");
  }
  return json.data;
}

export function useDeleteNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
    },
  });
}

export function useUpdateNewsStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateNewsStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
    },
  });
}
