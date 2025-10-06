import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

export interface MembersQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  name?: string;
  email?: string;
  address?: string;
  status?: string;
  gender?: string;
  level?: string;
  position?: string;
  sayapTypeId?: number;
  regionId?: number;
  struktur?: boolean;
}

function buildQuery(params: MembersQueryParams) {
  const qp = new URLSearchParams();
  qp.set("page", String(params.page));
  qp.set("pageSize", String(params.pageSize));
  if (params.search) qp.set("search", params.search);
  if (params.name) qp.set("name", params.name);
  if (params.email) qp.set("email", params.email);
  if (params.address) qp.set("address", params.address);
  if (params.status && params.status !== "all") qp.set("status", params.status);
  if (params.gender && params.gender !== "all") qp.set("gender", params.gender);
  if (params.level && params.level !== "all") qp.set("level", params.level);
  if (params.position && params.position !== "all")
    qp.set("position", params.position);
  if (params.sayapTypeId) qp.set("sayapTypeId", String(params.sayapTypeId));
  if (params.regionId) qp.set("regionId", String(params.regionId));
  if (params.struktur) qp.set("struktur", "1");
  return qp;
}

async function fetchMembers(params: MembersQueryParams) {
  const qp = buildQuery(params);
  const res = await fetch(`/api/members?${qp.toString()}`, {
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Gagal memuat data");
  return json;
}

export function useMembers(params: MembersQueryParams) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["members", params],
    queryFn: () => fetchMembers(params),
    placeholderData: keepPreviousData,
    staleTime: 15000,
  });

  useEffect(() => {
    const data: any = query.data;
    if (!data) return;

    const { meta } = data;
    if (!meta) return;

    if (meta.page < meta.totalPages) {
      const nextPage = params.page + 1;
      qc.prefetchQuery({
        queryKey: ["members", { ...params, page: nextPage }],
        queryFn: () => fetchMembers({ ...params, page: nextPage }),
      });
    }
  }, [params, qc, query.data]);

  return query;
}
