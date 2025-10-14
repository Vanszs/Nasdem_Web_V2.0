import type { ProgramStatus } from "@prisma/client";

// Static categories and name options for UI selections
export interface Category {
  id: string; // slug-like id (e.g., "pendidikan", "ekonomi")
  name: string;
}

export interface ProgramNameOption {
  id: string; // slug/shortcode (e.g., "pip")
  title: string; // human readable (e.g., "Beasiswa PIP")
  categoryId: string; // matches Category.id
  description?: string;
}

// Program record aligned with Prisma schema
export interface Program {
  id: number;
  category: string; // from Category.id
  name: string; // from ProgramNameOption.title (or custom)
  description?: string | null;
  target: number;
  currentTarget: number;
  budget: number | string; // Prisma Decimal may serialize as string
  status: ProgramStatus; // enum: pending | completed | ongoing | planning
  startDate?: string | null; // ISO date string
  endDate?: string | null; // ISO date string
  photoUrl?: string | null;

  coordinatorId: number;
  // Optional expanded coordinator for UI (if API includes it later)
  coordinator?: {
    id: number;
    fullName: string;
  } | null;
}

// Payloads for create/update
export type CreateProgramInput = Omit<
  Program,
  "id" | "coordinator" | "budget"
> & {
  budget: number; // send number to API; backend will cast to Decimal
};

export type UpdateProgramInput = Omit<Program, "coordinator" | "budget"> & {
  budget: number; // send number to API
};
