export type Gender = "male" | "female";
export type BenefitStatus = "pending" | "completed";

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
  status: BenefitStatus;
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
  status: BenefitStatus;
}

export interface UpdateBeneficiaryInput
  extends Partial<CreateBeneficiaryInput> {
  id: number;
}
