import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

export type NewsStatusFilter =
  | "all"
  | "draft"
  | "scheduled"
  | "published"
  | "archived";

export interface NewsListParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: NewsStatusFilter;
  startDate?: string;
  endDate?: string;
}

export interface NewsListItem {
  id: number;
  title: string;
  content: string | null;
  publishDate: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user?: {
    id: number | null;
    username: string | null;
    email: string | null;
  } | null;
}

export interface NewsListResponse {
  success: boolean;
  data: NewsListItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

function buildQuery(params: NewsListParams) {
  const qp = new URLSearchParams();
  qp.set("page", String(params.page));
  qp.set("pageSize", String(params.pageSize));
  if (params.search) qp.set("search", params.search);
  if (params.status && params.status !== "all") qp.set("status", params.status);
  if (params.startDate) qp.set("startDate", params.startDate);
  if (params.endDate) qp.set("endDate", params.endDate);
  return qp;
}

async function fetchNews(
  params: NewsListParams,
  signal?: AbortSignal
): Promise<NewsListResponse> {
  const qp = buildQuery(params);
  const res = await fetch(`/api/news?${qp.toString()}`, {
    cache: "no-store",
    signal,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal memuat data berita");
  }
  return json as NewsListResponse;
}

export function useNewsList(params: NewsListParams) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["news", params],
    queryFn: ({ signal }) => fetchNews(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  useEffect(() => {
    const data = query.data;
    if (!data) return;

    const totalPages = data.meta.totalPages ?? 1;
    const currentPage = params.page;

    if (currentPage < totalPages) {
      const nextPageParams = { ...params, page: currentPage + 1 };
      qc.prefetchQuery({
        queryKey: ["news", nextPageParams],
        queryFn: ({ signal }) => fetchNews(nextPageParams, signal),
      });
    }
  }, [params, qc, query.data]);

  return query;
}
