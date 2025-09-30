"use client";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

async function loginRequest(data: LoginInput) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Login gagal");
  }
  return json;
}

export function useLogin() {
  return useMutation({
    mutationFn: loginRequest,
  });
}
