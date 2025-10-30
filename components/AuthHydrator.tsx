"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

type SSRUser = {
  userId: number;
  role: "superadmin" | "editor" | "analyst" | string;
  email?: string;
  username?: string;
} | null;

export default function AuthHydrator({ user }: { user: SSRUser }) {
  const setUser = useAuthStore((s) => s.setUser);
  useEffect(() => {
    if (user && user.userId) {
      setUser({
        id: user.userId,
        email: user.email || "",
        username: user.username || "",
        role: (user.role as any) || "editor",
        createdAt: "",
      });
    } else {
      setUser(null);
    }
  }, [user, setUser]);
  return null;
}
