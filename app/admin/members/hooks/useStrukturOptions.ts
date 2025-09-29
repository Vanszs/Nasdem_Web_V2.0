import { useQuery } from "@tanstack/react-query";

export interface StrukturOption {
  id: number;
  title: string;
}

async function fetchStrukturOptions(): Promise<StrukturOption[]> {
  const res = await fetch("/api/organizations", { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal mengambil struktur organisasi");
  const json = await res.json();
  if (!json.success)
    throw new Error(json.error || "Gagal memuat data struktur");
  return (json.data || []).map((s: any) => ({
    id: s.id,
    title: s.title || s.name || `Struktur #${s.id}`,
  }));
}

export function useStrukturOptions() {
  return useQuery({
    queryKey: ["struktur-options"],
    queryFn: fetchStrukturOptions,
    staleTime: 5 * 60 * 1000,
  });
}
