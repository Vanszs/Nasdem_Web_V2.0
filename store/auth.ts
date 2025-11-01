import { create } from "zustand";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: "superadmin" | "editor" | "analyst";
  createdAt: string;
};

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  cacheTTL: number; // ms
  fetchUser: (opts?: { force?: boolean }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const TEN_MIN = 10 * 60 * 1000;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,
  cacheTTL: TEN_MIN,

  setUser: (user) => set({ user }),

  fetchUser: async (opts) => {
    const { lastFetchedAt, user, cacheTTL, isLoading, error } = get();
    const force = opts?.force ?? false;

    const fresh = lastFetchedAt && Date.now() - lastFetchedAt < cacheTTL;
    if (!force && fresh && user && !isLoading) return;

    // Prevent excessive polling when already getting 401 errors
    if (error && error.includes("401") && Date.now() - (lastFetchedAt || 0) < 5000) {
      console.log("⏸️ [AuthStore] Skipping auth check due to recent 401 error");
      return;
    }

    try {
      console.log("🔍 [AuthStore] Fetching user data...");
      set({ isLoading: true, error: null });
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });
      console.log("📊 [AuthStore] Auth response status:", response.status);
      if (!response.ok) {
        // Not authenticated
        console.log("❌ [AuthStore] Authentication failed with status:", response.status);
        set({
          user: null,
          isLoading: false,
          lastFetchedAt: Date.now(),
          error: `Authentication failed: ${response.status}`
        });
        return;
      }
      const data = await response.json();
      if (!data?.success) {
        set({ user: null, isLoading: false, lastFetchedAt: Date.now() });
        return;
      }
      set({
        user: data.data as AuthUser,
        isLoading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (e: any) {
      set({
        error: e?.message ?? "Gagal memuat sesi",
        isLoading: false,
        lastFetchedAt: Date.now(),
      });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(
          data?.error || "Login gagal. Periksa email atau sandi Anda."
        );
      }
      set({
        user: data.data.user as AuthUser,
        isLoading: false,
        lastFetchedAt: Date.now(),
      });
    } catch (e: any) {
      set({ error: e?.message ?? "Login gagal", isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Logout gagal");
      }
      set({ user: null, isLoading: false, lastFetchedAt: 0 });
    } catch (e: any) {
      set({ error: e?.message ?? "Logout gagal", isLoading: false });
      throw e;
    }
  },
}));
