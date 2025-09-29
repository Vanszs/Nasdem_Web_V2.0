import { useQuery } from "@tanstack/react-query";

export interface Region {
  id: number;
  name: string;
  type: string; // kabupaten | kecamatan | desa | ...
}

async function fetchRegions(): Promise<Region[]> {
  const res = await fetch("/api/regions", { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal memuat region");
  }
  return json.data;
}

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: 5 * 60 * 1000,
  });
}
