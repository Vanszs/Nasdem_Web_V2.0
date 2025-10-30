import { create } from "zustand";
import { QueryClient } from "@tanstack/react-query";

export type CmsContact = {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  operationalHours?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;
};

interface CmsContactState {
  contact: CmsContact | null;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchContact: (opts?: { force?: boolean }) => Promise<void>;
  updateContact: (payload: Partial<CmsContact>) => Promise<void>;
  setContact: (contact: CmsContact | null) => void;
}

// React Query setup specifically for CMS contact cache with 10 minutes stale time
const CONTACT_QUERY_KEY = ["cms", "contact"] as const;
const contactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

async function fetchContactFromApi(): Promise<CmsContact | null> {
  const res = await fetch("/api/cms/contact", { credentials: "include" });
  if (!res.ok) throw new Error("Gagal memuat kontak");
  const json = await res.json();
  return (json?.data as CmsContact) ?? null;
}

export const useCmsContactStore = create<CmsContactState>((set, get) => ({
  contact: null,
  isLoading: false,
  error: null,
  hasFetched: false,

  setContact: (contact) => set({ contact }),

  fetchContact: async (opts) => {
    const force = opts?.force ?? false;
    try {
      set({ isLoading: true, error: null });
      if (force) {
        await contactQueryClient.invalidateQueries({
          queryKey: CONTACT_QUERY_KEY,
        });
      }
      const data = await contactQueryClient.fetchQuery({
        queryKey: CONTACT_QUERY_KEY,
        queryFn: fetchContactFromApi,
        staleTime: 10 * 60 * 1000,
      });
      set({ contact: data ?? null, isLoading: false, hasFetched: true });
    } catch (e: any) {
      set({
        error: e?.message ?? "Gagal memuat kontak",
        isLoading: false,
        hasFetched: true,
      });
    }
  },

  updateContact: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch("/api/cms/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal memperbarui kontak");
      await contactQueryClient.invalidateQueries({
        queryKey: CONTACT_QUERY_KEY,
      });
      const fresh = await contactQueryClient.fetchQuery({
        queryKey: CONTACT_QUERY_KEY,
        queryFn: fetchContactFromApi,
        staleTime: 10 * 60 * 1000,
      });
      set({ contact: fresh ?? null, isLoading: false });
    } catch (e: any) {
      set({
        error: e?.message ?? "Gagal memperbarui kontak",
        isLoading: false,
      });
      throw e;
    }
  },
}));
