"use client";
import { useQuery } from "@tanstack/react-query";

async function fetchRegions() {
  const res = await fetch("/api/regions", { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Gagal memuat region");
  return json.data as { id: number; name: string; type: string }[];
}

async function fetchSayapTypes() {
  const res = await fetch("/api/sayap-types", { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Gagal memuat sayap types");
  return json.data as { id: number; name: string }[];
}

// New: lightweight members lookup (first 500 members) for assignment
async function fetchMembersLookup(search?: string) {
  const params = new URLSearchParams();
  params.set("page", "1");
  params.set("pageSize", "500");
  if (search) params.set("search", search);
  const res = await fetch(`/api/members?${params.toString()}`, {
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Gagal memuat anggota");
  // Return minimal shape
  return (json.data || []).map((m: any) => ({
    id: m.id,
    fullName: m.fullName,
    status: m.status,
  }));
}

export function useRegionsLookup() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: 5 * 60_000,
  });
}

export function useSayapTypesLookup() {
  return useQuery({
    queryKey: ["sayap-types"],
    queryFn: fetchSayapTypes,
    staleTime: 10 * 60_000,
  });
}

export function useMembersLookup(search?: string) {
  return useQuery({
    queryKey: ["members-lookup", search || ""],
    queryFn: () => fetchMembersLookup(search),
    staleTime: 60_000,
  });
}
