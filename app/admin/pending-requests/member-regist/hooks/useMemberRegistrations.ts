import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "approved"
  | "rejected";

export interface MemberRegistration {
  id: number;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  nik?: string | null;
  dateOfBirth?: string | null;
  gender?: "male" | "female" | null;
  address?: string | null;
  occupation?: string | null;
  isBeneficiary?: boolean | null;
  beneficiaryProgramId?: number | null;
  notes?: string | null;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string | null;
  ktpPhotoUrl?: string | null;
}

export interface ApplicationsResponse {
  success: boolean;
  data: MemberRegistration[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
  summary?: {
    total: number;
    pending: number;
    reviewed: number;
    approved: number;
    rejected: number;
  };
}

export function useMemberRegistrations(params: {
  search: string;
  status: string; // 'all' | ApplicationStatus
  page?: number;
  pageSize?: number;
}) {
  const { search, status, page = 1, pageSize = 50 } = params;
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("pageSize", String(pageSize));
  // This page is specifically for member applications
  qs.set("type", "member");
  if (search) qs.set("search", search);
  if (status && status !== "all") qs.set("status", status);

  return useQuery<ApplicationsResponse, Error>({
    queryKey: ["member-registrations", search, status, page, pageSize],
    queryFn: async () => {
      const res = await fetch(`/api/membership-applications?${qs.toString()}`);
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Gagal memuat data");
      return json;
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { 
      id: number; 
      status: "accepted" | "rejected";
      organizationId?: number;
      notes?: string;
    }) => {
      const res = await fetch(`/api/membership-applications/${payload.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: payload.status,
          organizationId: payload.organizationId,
          notes: payload.notes,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Gagal update status");
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["member-registrations"] });
    },
  });
}
