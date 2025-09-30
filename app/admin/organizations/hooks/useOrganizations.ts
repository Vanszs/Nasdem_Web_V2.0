"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface OrganizationRow {
  id: number;
  level: string;
  position: string;
  region?: { id: number; name: string; type: string } | null;
  sayapType?: { id: number; name: string } | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  membersCount?: number;
}

export interface OrgFilters {
  search?: string;
  level?: string;
  position?: string;
  take?: number;
  skip?: number;
}

function buildQuery(f: OrgFilters) {
  const sp = new URLSearchParams();
  sp.set("include", "region,sayapType,membersCount");
  if (f.search) sp.set("search", f.search);
  if (f.level) sp.set("level", f.level);
  if (f.position && typeof f.position === "string")
    sp.set("position", f.position);
  if (typeof f.take === "number") sp.set("take", String(f.take));
  if (typeof f.skip === "number") sp.set("skip", String(f.skip));
  return sp.toString();
}

async function fetchOrganizations(filters: OrgFilters): Promise<{
  data: OrganizationRow[];
  meta: { total: number; skip: number; take: number };
}> {
  const qs = buildQuery(filters);
  const res = await fetch(`/api/organizations?${qs}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal memuat struktur");
  }
  return { data: json.data, meta: json.meta };
}

async function createOrganization(payload: any) {
  const res = await fetch("/api/organizations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || "Gagal create");
  return json.data;
}

async function updateOrganization(id: number, payload: any) {
  const res = await fetch(`/api/organizations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || "Gagal update");
  return json.data;
}

async function deleteOrganization(id: number) {
  const res = await fetch(`/api/organizations/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || "Gagal delete");
  return true;
}

export function useOrganizations(filters: OrgFilters) {
  const qc = useQueryClient();
  return useQuery<{
    data: OrganizationRow[];
    meta: { total: number; skip: number; take: number };
  }>({
    queryKey: ["organizations", filters],
    queryFn: () => fetchOrganizations(filters),
    placeholderData: (prev) => prev, // menjaga data lama saat refetch (pengganti keepPreviousData)
    staleTime: 15_000,
  });
}

export function useOrganizationMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organizations"] }),
  });
  const update = useMutation({
    mutationFn: (p: { id: number; data: any }) =>
      updateOrganization(p.id, p.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organizations"] }),
  });
  const remove = useMutation({
    mutationFn: (id: number) => deleteOrganization(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organizations"] }),
  });
  return { create, update, remove };
}
