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
