export type Gender = "male" | "female";

export interface Beneficiary {
  id: number;
  programId: number;
  receivedAt: string;
  fullName: string;
  email?: string | null;
  nik?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  occupation?: string | null;
  familyMemberCount?: number | null;
  proposerName?: string | null;
  fullAddress?: string | null;
  notes?: string | null;
  program?: { id: number; category: string; name: string };
}

export interface CreateBeneficiaryInput {
  programId: number;
  fullName: string;
  email?: string | null;
  nik?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  occupation?: string | null;
  familyMemberCount?: number | null;
  proposerName?: string | null;
  fullAddress?: string | null;
  notes?: string | null;
}

export interface UpdateBeneficiaryInput
  extends Partial<CreateBeneficiaryInput> {
  id: number;
}
