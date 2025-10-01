import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateMemberPayload {
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  gender?: string;
  status?: string;
  strukturId?: number;
  photoUrl?: string;
  joinDate?: string;
  endDate?: string;
  dateOfBirth?: string;
}

async function createMember(payload: CreateMemberPayload) {
  const res = await fetch("/api/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success)
    throw new Error(json.error || "Gagal membuat member");
  return json.data;
}

export function useCreateMember(
  onSuccess?: (data: any) => void,
  onError?: (e: any) => void
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createMember,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["members"] });
      onSuccess?.(data);
    },
    onError,
  });
}
