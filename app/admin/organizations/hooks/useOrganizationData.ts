/**
 * Custom hooks untuk data fetching organization-related data
 * Dipisahkan dari component untuk reusability dan maintainability
 */

import { useQuery } from "@tanstack/react-query";

export type Region = { id: number; name: string; type: string };
export type Struktur = {
  id: number;
  level: string;
  position: string;
  positionTitle?: string;
  positionOrder?: number;
  region?: Region | null;
  sayapType?: { name: string } | null;
};
export type Member = { id: number; fullName: string; status?: string };
export type DprtMember = Member & { region?: Region | null };

/**
 * Hook untuk fetch regions (kecamatan & desa)
 */
export function useRegions(enabled: boolean = true) {
  return useQuery<any>({
    queryKey: ["regions"],
    queryFn: async () => {
      const res = await fetch("/api/regions");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memuat wilayah");
      return json;
    },
    enabled,
    staleTime: 60_000,
  });
}

/**
 * Hook untuk fetch struktur organisasi
 */
export function useStruktur(enabled: boolean = true) {
  return useQuery<any>({
    queryKey: ["struktur", { take: 500 }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("take", "500");
      const res = await fetch(`/api/organizations?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memuat struktur");
      return json;
    },
    enabled,
    staleTime: 60_000,
  });
}

/**
 * Hook untuk fetch unassigned members
 */
export function useUnassignedMembers(
  search: string,
  enabled: boolean = false
) {
  return useQuery<any>({
    queryKey: ["members-unassigned", { search, page: 1, pageSize: 100 }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("pageSize", "100");
      params.set("struktur", "true");
      params.set("unassigned", "true");
      if (search) params.set("search", search);
      const res = await fetch(`/api/members?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memuat anggota");
      return json;
    },
    enabled,
  });
}

/**
 * Hook untuk fetch DPRT members
 */
export function useDprtMembers(enabled: boolean = false) {
  return useQuery<any>({
    queryKey: ["members-dprt"],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("pageSize", "100");
      params.set("struktur", "true");
      params.set("level", "dprt");
      const res = await fetch(`/api/members?${params.toString()}`);
      const json = await res.json();
      if (!json.success)
        throw new Error(json.error || "Gagal memuat member DPRT");
      return json;
    },
    enabled,
    staleTime: 60_000,
  });
}
